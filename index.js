const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cn1yph8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});



async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
       
        const artCollection = client.db('artCollection').collection('arts');
        const bestCollection = client.db('artCollection').collection('best');
        const ideaCollection = client.db('artCollection').collection('ideas');
        const categoryCollection = client.db('artCollection').collection('categories');
        app.get('/arts', async (req, res) => {
            const cursor = artCollection.find();
            const result = await cursor.toArray();
            console.log(result);
            res.send(result); 
        })
        app.get('/ideas', async (req, res) => {
            const cursor = ideaCollection.find();
            const result = await cursor.toArray();
            console.log(result);
            res.send(result); 
        })
        app.get('/best', async (req, res) => {
            const cursor = bestCollection.find();
            const result = await cursor.toArray();
            console.log(result);
            res.send(result); 
        })
        app.get('/arts/:subcategory', async (req, res) => {
            const subcategory = req.params.subcategory
            const result = await categoryCollection.find({ subcategory_Name: subcategory}).toArray()
            res.send(result)
           
        })
    
        app.post('/addArt', async (req, res) => {
            const newArt = req.body;
            const arts = await artCollection.insertOne(newArt)
            console.log(arts);
            res.send(arts) 
        })
        app.get('/details/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await artCollection.findOne(query);
            res.send(result);
        })
        app.get('/details/subcategory/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await categoryCollection.findOne(query);
            res.send(result);
        })
        app.get('/:email', async (req, res) => {
            const email = req.params.email

            console.log(email);
            const result = await artCollection.find({ User_Email: email }).toArray()

            res.send(result)
        })
        app.get('/myArt/:email/:customization', async (req, res) => {
            const email = req.params.email
            const customization = req.params.customization
            console.log(req.params);
            const result = await artCollection.find({ User_Email: email, customization: customization }).toArray()
            
            res.send(result)
        })
       
        app.delete('/delete/:id', async (req, res) => {
            const id = req.params.id
            
          
            const result = await artCollection.deleteOne({ _id: new ObjectId(req.params.id) }); 
            
            res.send(result);
        })
        app.put('/update/:id', async (req, res) => {
            const id = req.params.id
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const updatedArt = req.body
            const art = {
                $set:{
                    image_url :updatedArt.image_url,
                    item_name :updatedArt.item_name,
                    subcategory_Name :updatedArt.subcategory_Name,
                    short_description :updatedArt.short_description,
                    price :updatedArt.price,
                    rating :updatedArt.rating,
                    customization :updatedArt.customization,
                    processing_time :updatedArt.processing_time,
                    stockStatus :updatedArt.stockStatus,
                }
            }
            const result = await artCollection.updateOne(filter, art, options);
           
            res.send(result);
        })
        // Send a ping to confirm a successful connection
        
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Art & Craft Store')
})

app.listen(port, () => {
    console.log(`Art & Craft Store is running on port ${port}!`)
})