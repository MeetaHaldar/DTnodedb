//Nodejs library that handles connecting to and interacting with a MongoDB database.
import { MongoClient } from "mongodb";

export let db;
export let eventCollection;

/**
 * Connects to the database and returns a promise that resolves with the database object.
 * @returns {Promise<void>}
 */
export async function connect() {
    return new Promise((resolve, reject) => {
        MongoClient.connect(
            process.env.CONNECTION_URL, { useNewUrlParser: true },
            (error, client) => {
                if (error) {
                    reject(error);
                }
                db = client.db(process.env.DATABASE_NAME);
                eventCollection = db.collection(process.env.COLLECTION_NAME);
                console.log("Connected to `" + process.env.DATABASE_NAME + "`!");
                resolve(db)
            }
        );
    });
}
