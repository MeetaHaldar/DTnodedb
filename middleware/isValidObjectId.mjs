import { ObjectId } from "mongodb";

export function isValidObjectId(req, res, next) {
    const id = req.params.id;
    if (ObjectId.isValid(id)) {
        if (String(new ObjectId(id)) === id) {
            next();
        } else res.status(400).json({ error: "Invalid ObjectId" });
    } else res.status(400).json({ error: "Invalid ObjectId" });
};