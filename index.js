const express = require("express");
const { MongoClient } = require("mongodb");
require("dotenv").config();
const ObjectId = require("mongodb").ObjectId;
const cors = require("cors");
const app = express();


const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@watchshop.qraug.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
      await client.connect();
      const database = client.db("WrishShop");
      const productCollection = database.collection("Products");
      const userWatchCollection = database.collection("userWatch");
      const reviewCollection = database.collection("Reviews");
      // create a document to insert
      app.post("/product", async (req, res) => {
        const product = req.body;
        const result = await productCollection.insertOne(product);
        console.log(`A document was inserted with the _id: ${result.insertedId}`);
        res.json(result);
      });

      // get document from database
    app.get("/products", async (req, res) => {
      const cursor = productCollection.find({});
      const products = await cursor.toArray();
      res.send(products);
    });

    // find document by id 
    app.get("/pharches/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const Product = await productCollection.findOne(query);
      res.json(Product);
    });

      // pharches Watch 
    app.post("/pharches", async (req, res) => {
      const ride = req.body;
      const result = await userWatchCollection.insertOne(ride);
      console.log(`A document was inserted with the _id: ${result.insertedId}`);
      res.json(result);
    });

          // specifiq user order Watch
    app.get("/userorder/:email", async (req, res) => {
      const email = req.params.email;
      const result = userWatchCollection.find({ userEmail: email });
      const order = await result.toArray();
      res.json(order);
    });
    
        // get document from database
      app.get("/allorder", async (req, res) => {
        const cursor = userWatchCollection.find({});
        const order = await cursor.toArray();
        res.json(order);
      });
      

      app.post("/review", async (req, res) => {
        const review = req.body;
        const result = await reviewCollection.insertOne(review);
        console.log(`A document was inserted with the _id: ${review.insertedId}`);
        res.json(result);
      });
    } finally {
      //   await client.close();
    }
  }
  run().catch(console.dir);
app.get("/", (req, res) => {
    res.send("hello world");
  });
  
  app.listen(port, () => {
    console.log("server started in ", port);
  });
  