const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors')
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qifrc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        // console.log('connected to database');
        const database = client.db("BdTourist");
        const servicesCollection = database.collection("services");
        const ordersCollection = database.collection("orders");

        // GET API OR LOAD ALL DATA
        app.get('/services', async(req, res) =>{
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })

        // ORDERS GET API
        app.get('/services/:email', async(req, res) =>{
          console.log(req.params.email)
          const cursor = ordersCollection.find({email:req.params.email});
          const services = await cursor.toArray();
          console.log(services);
          res.send(services);
      })

        // GET Single Service
        // app.get('/services/:id', async (req, res) => {
        //     const id = req.params.id;
        //     console.log('getting specific service', id);
        //     const query = { _id: id };
        //     const service = await servicesCollection.find(query);
        //     res.json(service);
        // })

        // GET Single Service
        app.get('/service/:id', async (req, res) => {
          const id = req.params.id;
          const query = { _id: ObjectId(id) };
          const user = await servicesCollection.findOne(query);
          // console.log('load user with id: ', id);
          res.send(user);
      })

        // POST API 
        app.post('/services', async(req, res) => {
            const service = req.body;
            console.log('hit the post api', service);

            const result = await servicesCollection.insertOne(service);
            console.log(result);
            res.json(result)
        });

        // ORDERS POST API 
        app.post('/orders', async(req, res) => {
            const orders = req.body;
            console.log('hit the order post api', orders);

            const result = await ordersCollection.insertOne(orders);
            console.log(result);
            res.json(result)
        });

        // DELETE API
        app.delete('/services/:id', async (req, res) => {
          const id = req.params.id;
          const query = { _id: ObjectId(id) };
          const result = await ordersCollection.deleteOne(query);
          res.json(result);
      })


      } 
      finally {
        // await client.close();
      }

}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Running Bd Tourist Server');
});

app.listen(port, () => {
  console.log('Running Bd Tourist Server on port', port);
})