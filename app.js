const Express = require("express");

//body-parser is which allows express to read the body and then parse that into a Json object that we can understand
const BodyParser = require("body-parser")

require("dotenv").config(); //load .env variables

//Nodejs library that handles connecting to and interacting with a MongoDB database.
const MongoClient = require("mongodb").MongoClient; 

const app = Express();
app.use(BodyParser.json()); //basically tells the system that you want json to be used.

//basically tells the system whether you want to use a simple algorithm for shallow parsing (i.e. false) or complex algorithm for deep parsing that can deal with nested objects (i.e. true).
app.use(BodyParser.urlencoded({ extended: true }));

//route for the root end point , used to create a new router object
const routes = Express.Router();
app.use(process.env.BASE_URL, routes);

//Port for server to listen on
const Port = process.env.PORT || 3000;

//server listening endpoint
app.listen(Port || 3000, () => {
    MongoClient.connect(
        process.env.CONNECTION_URL, { useNewUrlParser: true },
        (error, client) => {
            if (error) {
                throw error;
            }
            const database = client.db(process.env.DATABASE_NAME);
            const collection = database.collection(process.env.COLLECTION_NAME);
            console.log("Connected to `" + process.env.DATABASE_NAME + "`!");
            console.log("Server Running on Port `" + Port + "`!");

            require("./routes/events")(routes, collection); //importing event route
        }
    );
});