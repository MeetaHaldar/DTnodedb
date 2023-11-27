import expres from "express";
import multer from "multer";
import { ObjectId } from "mongodb";
import { bodyValidator } from "../middleware/bodyValidator.mjs";
import { eventCollection as db } from "../db.mjs";
import { isValidObjectId } from "../middleware/isValidObjectId.mjs";
import { eventParamValidate } from "../middleware/eventParamValidate.mjs";
import { uploadFile, deleteFile } from "../assets/storage/supabase-storage.mjs";

const upload = multer();
// const upload = multer({ dest: "../assets/uploads/" });

const eventsRouter = expres.Router();

//get all events or get events by id
eventsRouter.get("/", eventParamValidate, async (req, res) => {
  const { id, type = "latest", limit = 5, page = 1 } = req.query;

  if (id) {
    const objectID = new ObjectId(id);
    await db.findOne({ _id: objectID }, function (error, result) {
      if (error) {
        res.json({ error });
      } else {
        res.json(result);
      }
    });
  } else {
    const skipValue = parseInt(limit * (page - 1)); //get value of skip on basis of page and limit
    const limitValue = parseInt(limit); //get value of limit

    const result = await db.find().skip(skipValue).limit(limitValue).toArray();
    if (!result) res.json([]);
    else res.json([...result]);
  }
});

//get event by id
eventsRouter.get("/:id", isValidObjectId, async (req, res) => {
  const objectID = new ObjectId(req.params.id);
  await db.findOne({ _id: objectID }, function (error, result) {
    if (error) {
      res.json({ error });
    } else {
      res.json(result);
    }
  });
});

//create event
eventsRouter.post("/", upload.array("file", 10), async (req, res) => {
  const event = req.body;
  const files = req.files;

  if (files != null && files.length > 0) {
    try {
      var publicURL = [];
      for (const a of files) {
        publicURL.push(await uploadFile(a.buffer, a.originalname));
      }
      const result = await db.insertOne({ file: publicURL, ...event });
      res.json({ file: publicURL, ...event });
    } catch (error) {
      res.json({ error });
    }
  } else {
    try { await db.insertOne({ ...event });
    res.json({...event})
      
    } catch (error) {
      res.json({error})
    }
   
  }
});

//update event by id
eventsRouter.put("/:id", isValidObjectId,upload.array("file", 10), async (req, res) => {
  const objectID = new ObjectId(req.params.id);
  const files = req.files;
  const event = req.body;
  const result = await db.findOne({ _id: objectID });
  if ((result == null)) {
    throw 'object not found';
  }
  const myURL = result.file;
   console.log(myURL);
  if (files.length > 0) {
    try {
      var publicURL = [];
      for (const a of files) {
        publicURL.push(await uploadFile(a.buffer, a.originalname));
      }
      await db.updateOne({ _id: objectID }, { $set: { ...event , file: publicURL } });
      res.json({ file: publicURL, ...event });
      await deleteFile(myURL);
    } catch (error) {
      res.json({ error });
    }
  } else {
    await db.updateOne({ _id: objectID }, { $set: { ...event } });
    res.json({ ...event })
  }

});

//delete event by id
eventsRouter.delete("/:id", isValidObjectId, async (req, res) => {
  try {
    const objectID = new ObjectId(req.params.id);
    const result = await db.findOne({ _id: objectID });
    if ((result == null)) {
      throw 'object not found';
    }
    const myURL = result.file;
    if(myURL){
      await deleteFile(myURL);
    }
    
    await db.deleteOne({ _id: objectID });
    res.json({ data: objectID });
  } catch (error) {
    console.log(error);
    res.json({error});
  }
});

export default eventsRouter;
