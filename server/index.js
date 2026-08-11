const express = require('express')
const app = express()
const path = require('path')
const cors = require('cors')
const bodyParser = require('body-parser')
require("dotenv").config();

// Force DNS lookups (incl. the mongodb+srv SRV record) to use public DNS servers.
// Fixes "querySrv ECONNREFUSED" when the system's default resolver refuses SRV queries.
const dns = require('dns')
dns.setServers(['1.1.1.1', '8.8.8.8'])

const { MongoClient, ObjectId } = require('mongodb')
const { MongoURI } = process.env
const client = new MongoClient(MongoURI)   // modern driver: no need for the old useNewUrlParser/useUnifiedTopology options
const { cloudinary } = require('./cloudinary')

const { PORT } = process.env
const DB = 'sandeczigns'   // database name

app.use(express.json({ limit: '50mb' }))          // large limit so base64 image uploads fit
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
app.use(bodyParser.json())
app.use(cors())
app.use(express.static(path.resolve(`${__dirname}/../dist`)))   // serve the built Vue app (Vite outputs to /dist)

app.listen(PORT, () => console.log(`Server running on port ${PORT}!`))


// ============================================================
//  POEMS  — { title, body }
// ============================================================

// get all poems (newest first)
app.get('/poems', async (req, res) => {
  try {
    await client.connect()
    const poems = await client.db(DB).collection('poems').find().sort({ createdAt: -1 }).toArray()
    return res.send(poems)
  } catch (e) {
    console.error(e)
    res.status(500).send('server error')
  } finally {
    await client.close()
  }
})

// add a poem
app.post('/poems', async (req, res) => {
  const { title, body } = req.body
  try {
    await client.connect()
    const poem = { title, body, createdAt: new Date() }
    const dbRes = await client.db(DB).collection('poems').insertOne(poem)
    return res.send({ _id: dbRes.insertedId, ...poem })
  } catch (e) {
    console.error(e)
    res.status(500).send('server error')
  } finally {
    await client.close()
  }
})

// delete a poem by id
app.delete('/poems/:id', async (req, res) => {
  const { id } = req.params
  try {
    await client.connect()
    await client.db(DB).collection('poems').deleteOne({ _id: new ObjectId(id) })
    return res.send('poem deleted')
  } catch (e) {
    console.error(e)
    res.status(500).send('server error')
  } finally {
    await client.close()
  }
})


// ============================================================
//  STORIES  — { title, body }  (same shape as poems)
// ============================================================

app.get('/stories', async (req, res) => {
  try {
    await client.connect()
    const stories = await client.db(DB).collection('stories').find().sort({ createdAt: -1 }).toArray()
    return res.send(stories)
  } catch (e) {
    console.error(e)
    res.status(500).send('server error')
  } finally {
    await client.close()
  }
})

app.post('/stories', async (req, res) => {
  const { title, body } = req.body
  try {
    await client.connect()
    const story = { title, body, createdAt: new Date() }
    const dbRes = await client.db(DB).collection('stories').insertOne(story)
    return res.send({ _id: dbRes.insertedId, ...story })
  } catch (e) {
    console.error(e)
    res.status(500).send('server error')
  } finally {
    await client.close()
  }
})

app.delete('/stories/:id', async (req, res) => {
  const { id } = req.params
  try {
    await client.connect()
    await client.db(DB).collection('stories').deleteOne({ _id: new ObjectId(id) })
    return res.send('story deleted')
  } catch (e) {
    console.error(e)
    res.status(500).send('server error')
  } finally {
    await client.close()
  }
})


// ============================================================
//  PHOTOS  — { title, caption, data }  (data = base64 image string)
//  Same upload-to-Cloudinary flow as MyVCF's /picUpload.
// ============================================================

app.get('/photos', async (req, res) => {
  try {
    await client.connect()
    const photos = await client.db(DB).collection('photos').find().sort({ createdAt: -1 }).toArray()
    return res.send(photos)
  } catch (e) {
    console.error(e)
    res.status(500).send('server error')
  } finally {
    await client.close()
  }
})

// upload a photo: send it to Cloudinary, then save the record in Mongo
app.post('/photos', async (req, res) => {
  const { title, caption, data } = req.body   // `data` is the base64 string from the frontend
  try {
    // 1. upload the image to Cloudinary (into a "sandeczigns" folder)
    const cloudRes = await cloudinary.uploader.upload(data, { folder: 'sandeczigns' })

    // 2. save the photo record in MongoDB
    await client.connect()
    const photo = {
      title: title || '',
      caption: caption || '',
      pic_url: cloudRes.secure_url,    // full URL — drops straight into an <img src>
      public_id: cloudRes.public_id,   // kept so we can delete from Cloudinary later
      createdAt: new Date(),
    }
    const dbRes = await client.db(DB).collection('photos').insertOne(photo)
    return res.send({ _id: dbRes.insertedId, ...photo })
  } catch (e) {
    console.error(e)
    res.status(500).send('upload failed')
  } finally {
    await client.close()
  }
})

// delete a photo — removes it from both Cloudinary and Mongo
app.delete('/photos/:id', async (req, res) => {
  const { id } = req.params
  try {
    await client.connect()
    const photo = await client.db(DB).collection('photos').findOne({ _id: new ObjectId(id) })
    if (photo && photo.public_id) {
      await cloudinary.uploader.destroy(photo.public_id)   // remove the image from Cloudinary
    }
    await client.db(DB).collection('photos').deleteOne({ _id: new ObjectId(id) })
    return res.send('photo deleted')
  } catch (e) {
    console.error(e)
    res.status(500).send('server error')
  } finally {
    await client.close()
  }
})
