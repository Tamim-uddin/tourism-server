const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;


const app = express();
const port = process.env.PORT || 5000;

// middlewar
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ww2yo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// console.log(uri);

async function run() {
    try {
        await client.connect();
        const database = client.db('tour-wb');
        const tourCollection = database.collection('tours');

        // post api
        app.post('/tours', async (req, res) => {
            const tour = req.body;
            console.log('hiting the post api', tour);
            const result = await tourCollection.insertOne(tour);
            console.log(result);
            res.json(result)

        });




        // get api
        app.get('/tours', async (req, res) => {
            const cursor = tourCollection.find({});
            const tour = await cursor.toArray();
            res.send(tour);

        });

        // get a single tour
        app.get('/tours/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const tour = await tourCollection.findOne(query);
            res.json(tour);
        })
        
    }
    finally {
        // await client.close();
    }

}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('tourism website')
});

app.listen(port, () => {
    console.log('torism website server', port)
})