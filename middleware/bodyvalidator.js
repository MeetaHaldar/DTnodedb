module.exports = function bodyValidator(req, res, next) {
    var {
        name,
        files,
        tagline,
        schedule,
        description,
        moderator,
        category,
        sub_category,
        rigor_rank,
    } = req.body;

    var error = [];

    if (name == null || typeof name != "string") {
        error.push("name is required");
    }
    if (files == null && typeof files != "string") {
        error.push("files is required");
    }
    if (tagline == null && typeof tagline != "string") {
        error.push("tagline is required");
    }
    if (schedule == null && typeof schedule != "string") {
        error.push("schedule is required");
    }
    if (description == null && typeof description != "string") {
        error.push("description is required");
    }
    if (moderator == null && typeof moderator != "string") {
        error.push("moderator is required");
    }
    if (category == null && typeof category != "string") {
        error.push("category is required");
    }
    if (sub_category == null && typeof sub_category != "string") {
        error.push("sub_category is required");
    }
    if (rigor_rank == null && typeof rigor_rank != "number") {
        error.push("rigor_rank is required");
    }

    if (error.length > 0) {
        res.status(400).json({ error });
    } else {
        next();
    }
};