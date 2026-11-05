const path = require("path");
const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();
const PORT = 3000;
const url = process.env.MONGO_URI || "mongodb://127.0.0.1:27017";
const client = new MongoClient(url);
let toys;

app.use(cors());
app.use(express.json());

// Returns clean values, or null when any field is invalid
function readToy(body) {
  const { toyName, category, price, stock, status } = body;
  if ([toyName, category, price, stock, status].some((value) => typeof value !== "string")) return null;
  if (!/^[A-Za-z0-9 '&-]+$/.test(toyName.trim())) return null;
  if (!/^\d{1,6}$/.test(price) || Number(price) < 1) return null;
  if (!/^\d{1,4}$/.test(stock)) return null;
  if (!category || !status) return null;
  return { toyName: toyName.trim(), category, price, stock, status };
}

// READ all toys
app.get("/api/toys", async (req, res) => {
  try {
    const records = await toys.find({}).sort({ toyName: 1 }).toArray();
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: "Unable to fetch toys" });
  }
});

// CREATE a toy
app.post("/api/toys", async (req, res) => {
  try {
    const toy = readToy(req.body);
    if (!toy) {
      return res.status(400).json({ error: "Enter valid toy details" });
    }
    const result = await toys.insertOne(toy);
    res.status(201).json({ message: "Toy added successfully", insertedId: result.insertedId });
  } catch (error) {
    res.status(500).json({ error: "Unable to add toy" });
  }
});

// UPDATE a toy
app.put("/api/toys/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid toy ID" });
    }
    const toy = readToy(req.body);
    if (!toy) {
      return res.status(400).json({ error: "Enter valid toy details" });
    }
    const result = await toys.updateOne({ _id: new ObjectId(id) }, { $set: toy });
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Toy not found" });
    }
    res.json({ message: "Toy updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Unable to update toy" });
  }
});

// DELETE a toy
app.delete("/api/toys/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid toy ID" });
    }
    const result = await toys.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Toy not found" });
    }
    res.json({ message: "Toy deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Unable to delete toy" });
  }
});

// Serve the built React frontend
app.use(express.static(path.join(__dirname, "../frontend/dist")));

async function startServer() {
  try {
    await client.connect();
    const db = client.db("ToyStoreDB");
    toys = db.collection("toys");
    app.listen(PORT, () => {
      console.log("TOYNEST WEBSITE STARTED");
      console.log(`Website: http://localhost:${PORT}`);
      console.log("MongoDB Connected Successfully");
    });
  } catch (error) {
    console.error("Database Connection Error:", error.message);
    process.exit(1);
  }
}

startServer();
