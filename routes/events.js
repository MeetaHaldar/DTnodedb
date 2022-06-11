var ObjectId = require("mongodb").ObjectId;

module.exports = function(route, db) {
    //server root end point
    route.get("/", (req, res) => {
        res.json({ message: "hooray! welcome to our rest video api!" });
    });

    //get all events
    route.get("/events", async(req, res) => {
        const result = await db.find().sort({ schedule: -1 }).toArray();

        if (!result) res.json({ data: [] });
        else res.json({ data: result });
    });

    //get event by id
    route.get("/events/:id", async(req, res) => {
        const id = req.params.id;
        const objectID = new ObjectId(id);
        console.log(objectID)
                await db.findOne({ _id: objectID }, function(error, result) {
            if ((error = null)) {
                res.json({ error });
            } else {
                res.json({ data: result });
            }
        });
    });

    //create event
    route.post("/events", async(req, res) => {
        const event = req.body;
        // console.log(...event);
        await db.insertOne({...event });
        res.json({ data: event });
    });

    //update event by id
    route.put("/events/:id", async(req, res) => {
        const id = req.params.id;
        const objectID = new ObjectId(id);
        const event = req.body;
        await db.updateOne({ _id: objectID }, { $set: {...event } });
        res.json({ data: event });
    });

    //delete event by id 
    route.delete("/events/:id", async(req, res) => {
        const id = req.params.id;
        const objectID = new ObjectId(id);
        await db.deleteOne({ _id: objectID });
        res.json({ data: id });
    });
};