const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')

/* =========================
* Server Running Port
 =========================*/
const port = process.env.PORT || 5000

/* =========================
* Middleware
 =========================*/
app.use(express.json())
app.use(cors())

/* =========================
* MongoDB URL and MongoClient
 =========================*/
 const uri = `mongodb+srv://${ process.env.BD_USER }:${ process.env.DB_PASS }@cluster0.1ipuukw.mongodb.net/?retryWrites=true&w=majority`
 const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 })

/* =========================
* MongoDb Database Connection
 =========================*/
 async function dbConnect() {
    try {
        await client.connect()
        console.log('Database Connected')
    } catch (error) {
        console.log(error.name, error.message)
    }
}dbConnect().catch(error => console.log(error.message))

/* =========================
* All Database Collection
 =========================*/
 const DataTable = client.db('aide').collection('datatable')
 const ImageUpload = client.db('aide').collection('image')

//  app.post('/api/v1/aide/table-data', async (req, res) => {
//     try {
//         const tableData = req.body
//         const tableDatas = await DataTable.insertOne(tableData)
//         res.send({
//             success: true,
//             message: 'Successfully add a new data',
//             data: tableDatas
//         })
//     } catch (error) {
//         res.send({
//             success: false,
//             error: error.message
//         })
//     }
// })

app.get('/api/v1/aide/datatable',  async (req, res) => {
    try {
        const datatables = await DataTable.find({}).toArray()
        res.send({
            success: true,
            message: 'Successfully all datatable loaded!',
            data: datatables
        })
    } catch (error) {
        res.send({
            success: false,
            error: error.message
        })
    }
})
app.delete('/api/v1/aide/tableDataDelete/:tableDataId', async (req, res) => {
    try {
        const tableDataId = req.params.tableDataId
        const dataTable = await DataTable.deleteOne({ _id: ObjectId(tableDataId) })
        res.send({
            success: true,
            message: 'Table Data deleted successfully',
            data: dataTable
        })
    } catch (error) {
        res.send({
            success: false,
            error: error.message
        })
    }
})
app.get("/api/v1/aide/tableData/:tableDataId", async (req, res) => {
    try {
        const tableDataId = req.params.tableDataId
        const dataTables = await DataTable.findOne({ _id: ObjectId(tableDataId) })
        res.send({
            success: true,
            message: 'Successfully got the Table data',
            data: dataTables,
        });
    } catch (error) {
        res.send({
            success: false,
            error: error.message,
        });
    }
})
app.put("/api/v1/aide/tableData/edit/:tableDataId", async (req, res) => {
    try {
        const tableDataId = req.params.tableDataId
        const dataTables = await DataTable.updateOne({ _id: ObjectId(tableDataId) }, { $set: req.body })
        if (dataTables.matchedCount) {
            res.send({
                success: true,
                message: "Successfully updated the Table Data",
            });
        } else {
            res.send({
                success: false,
                error: "Couldn't update  the Table Data",
            });
        }
    } catch (error) {
        res.send({
            success: false,
            error: error.message,
        });
    }
})

// Image Upload
app.post('/api/v1/aide/image-upload', async (req, res) => {
    try {
        const imageUpload = req.body
        const imageUploads = await ImageUpload.insertOne(imageUpload)
        res.send({
            success: true,
            message: 'Successfully add a new image',
            data: imageUploads
        })
    } catch (error) {
        res.send({
            success: false,
            error: error.message
        })
    }
})
app.get('/api/v1/aide/image',  async (req, res) => {
    try {
        const imageUploads = await ImageUpload.find({}).toArray()
        res.send({
            success: true,
            message: 'Successfully all image loaded!',
            data: imageUploads
        })
    } catch (error) {
        res.send({
            success: false,
            error: error.message
        })
    }
})
app.delete('/api/v1/aide/image/:imageId', async (req, res) => {
    try {
        const imageId = req.params.imageId
        const imageUploads = await ImageUpload.deleteOne({ _id: ObjectId(imageId) })
        res.send({
            success: true,
            message: 'Image deleted successfully',
            data: imageUploads
        })
    } catch (error) {
        res.send({
            success: false,
            error: error.message
        })
    }
})


/* =========================
* Root and 404 Api Endpoint
 =========================*/
// Root api import and endpoint
app.get('/api/v1/aide', (req, res) => {
    res.send({
        status: '200',
        message: `Aide Server!`,
        version: '1.0.0',
        author: `Ab Naeem`,
    })
})
// Time Watch 404 not found api endpoint
app.all('*', (req, res) => {
    res.send({
        status: '404',
        message: `No route found!`,
    })
})

/* =========================
* Time Watch listening port
 =========================*/
app.listen(port, () => {
    console.log(`Aide listening on port ${port}!`)
})

