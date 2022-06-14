import { ObjectId } from "mongodb";
function isPositiveInteger(str) {
    if (typeof str !== "string") {
        return false;
    }
     const num = Number(str);
    if (Number.isInteger(num) && num > 0) {
        return true;
    }
    return false;
}
export function eventParamValidate(req, res, next) {
    const id = req.query.id;
    const limit = req.query.limit;
    const page = req.query.page;
    const type = req.query.type;
    var error = [];

    if (limit != undefined || limit != null) {
        if (!isPositiveInteger(limit)) error.push("invalid limit value");
    }

    if (page != undefined || page != null) {
        if (!isPositiveInteger(page)) error.push("invalid page value");
    }

    if (id != null || id != undefined) {
        if (ObjectId.isValid(id)) {
            if (String(new ObjectId(id)) === id) {
                // next();
                // console.log("valid id");
            } else error.push("Invalid ObjectId");
        } else error.push("Invalid ObjectId");
    }

    if (error.length > 0) {
        res.status(400).json({ error });
    } else next();
};