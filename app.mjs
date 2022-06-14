import express from "express";
import { config } from "dotenv";
import { connect } from "./db.mjs";
config();
const app = express();
/**
 * basically tells the system that you want json to be used.
 */
app.use(express.json());

//basically tells the system whether you want to use a simple algorithm for shallow parsing (i.e. false) or complex algorithm for deep parsing that can deal with nested objects (i.e. true).
app.use(express.urlencoded({ extended: true }));

const { default: router } = await import("./routes/index.mjs");

app.use(process.env.BASE_URL, router);

//Port for server to listen on
const PORT = process.env.PORT || 3000;

// Connect to the database
await connect();

//server listening endpoint
app.listen(PORT || 3000, () => {
  console.log(`Server listening on port ${PORT}`);
});
