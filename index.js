const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectId = require("mongodb").ObjectId;
require('dotenv').config();
const app = express();

const port = process.env.PORT || 5000;

//middle weares
app.use(cors());
app.use(express.json());

//mongo cluster setup
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.y4qnm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



async function run() {
    try {
        await client.connect();

        //db
        const database = client.db("heroRider");
        // collections
        const studentCollection = database.collection("students");
        const foodCollection = database.collection("foods");


        /*******************************************\
         -------------all post api's----------------
        \*******************************************/
        // users
        app.post('/students', async (req, res) => {
            const doc = req.body;
            const result = await studentCollection.insertOne(doc);
            res.send(result);
        });

        // users
        app.post('/foods', async (req, res) => {
            const doc = req.body;
            console.log(doc)
            const result = await foodCollection.insertOne(doc);
            res.send(result);
        });
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);



//default api's
app.get('/', (req, res) => {
    res.send('Databse is live');
});

app.listen(port, () => {
    console.log('DB is running on port', port);
});