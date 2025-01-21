const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

async function connectDB() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Database connection failed", err);
    process.exit(1);
  }
}
connectDB();

const initDB = async () =>{
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({ ...obj, owner: "675a97f3f7905f2f8fc8c477"}));
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};

initDB();



