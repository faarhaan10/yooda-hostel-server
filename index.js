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
        const serveCollection = database.collection("distribution");


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
            const result = await foodCollection.insertOne(doc);
            res.send(result);
        });

        // food serve
        app.post('/serve', async (req, res) => {
            const doc = req.body;
            const result = await serveCollection.insertOne(doc);
            res.send(result);
        });


        /*******************************************\
         -------------all get api's----------------
        \*******************************************/
        //foods
        app.get('/foods', async (req, res) => {
            const page = req.query.page;
            const size = parseInt(req.query.size);
            const cursor = foodCollection.find({}).sort({ "_id": -1 });
            const count = await cursor.count();

            let result;
            if (page) {
                result = await cursor.skip(page * size).limit(size).toArray();
            }
            else {
                result = await cursor.toArray();
            }
            res.send({ result, count });
        });

        //students
        app.get('/students', async (req, res) => {
            const page = req.query.page;
            const size = parseInt(req.query.size);
            const cursor = studentCollection.find({}).sort({ "_id": -1 });
            const count = await cursor.count();

            let result;
            if (page) {
                result = await cursor.skip(page * size).limit(size).toArray();
            }
            else {
                result = await cursor.toArray();
            }
            res.send({ result, count });
        });

        // get single data api 
        app.get('/student/roll/:roll', async (req, res) => {
            const roll = req.params.roll;
            const query = { roll: roll };
            const result = await studentCollection.findOne(query);
            res.send(result);
        });


        /*******************************************\
         -------------all put api's----------------
        \*******************************************/
        //foods
        app.put('/foods/:id', async (req, res) => {
            const id = req.params.id;
            const doc = req.body;
            const filter = { _id: ObjectId(id) };
            const updateDoc = { $set: doc };
            const options = { upsert: true };
            const result = await foodCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        });

        //students
        app.put('/students/:id', async (req, res) => {
            const id = req.params.id;
            const doc = req.body;
            const filter = { _id: ObjectId(id) };
            const updateDoc = { $set: doc };
            const options = { upsert: true };
            const result = await studentCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        });

        //update multiple students
        app.put('/students', async (req, res) => {
            const doc = req.body;
            const students = doc.selectedStudents.map(item => ObjectId(item));
            const query = {
                _id: { $in: students }
            };
            const updateDoc = { $set: { status: doc.status } };
            const result = await studentCollection.updateMany(query, updateDoc);
            res.send(result);
        });

        //students
        app.put('/serve/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const updateDoc = { $set: { status: 'served' } };
            const options = { upsert: true };
            const result = await studentCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        });


        /*******************************************\
         -------------all delete api's----------------
        \*******************************************/

        //delete food
        app.delete('/foods/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await foodCollection.deleteOne(query);
            res.send(result);
        });

        //delete student
        app.delete('/students/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await studentCollection.deleteOne(query);
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