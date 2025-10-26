const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// MongoDB URI
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.f78kgfp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// MongoDB client
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    const coffeeCollection = client
      .db("coffee-EspressoDB")
      .collection("coffees");
    const userCollection = client.db("coffee-EspressoDB").collection("users");

    // Root route
    app.get("/", (req, res) => {
      res.send("☕ Coffee Espresso server is running!");
    });

    // Get all coffees
    app.get("/coffees", async (req, res) => {
      const result = await coffeeCollection.find().toArray();
      res.send(result);
    });

    // Get single coffee
    app.get("/coffees/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeeCollection.findOne(query);
      res.send(result);
    });

    // Create coffee
    app.post("/coffees", async (req, res) => {
      const newCoffee = req.body;
      const result = await coffeeCollection.insertOne(newCoffee);
      res.send(result);
    });

    // Update coffee
    app.put("/coffees/:id", async (req, res) => {
      const id = req.params.id;
      const updatedCoffee = req.body;
      const result = await coffeeCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedCoffee }
      );
      res.send(result);
    });

    // Delete coffee
    app.delete("/coffees/:id", async (req, res) => {
      const id = req.params.id;
      const result = await coffeeCollection.deleteOne({
        _id: new ObjectId(id),
      });
      res.send(result);
    });

    // Users routes
    app.get("/users", async (req, res) => {
      const result = await userCollection.find().toArray();
      res.send(result);
    });

    app.post("/users", async (req, res) => {
      const newUser = req.body;
      const result = await userCollection.insertOne(newUser);
      res.send(result);
    });

    app.patch("/users", async (req, res) => {
      const { email, lastSignInTime } = req.body;
      const result = await userCollection.updateOne(
        { email },
        { $set: { lastSignInTime } }
      );
      res.send(result);
    });

    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      const result = await userCollection.deleteOne({ _id: new ObjectId(id) });
      res.send(result);
    });

    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection failed:", err);
  }
}
run();

// Export for Vercel
module.exports = app;
