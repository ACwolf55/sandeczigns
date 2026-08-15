// One-time script to create (or update) the admin account.
// Run it once:  npm run seed:admin
// It reads ADMIN_USERNAME + ADMIN_PASSWORD from .env, hashes the password,
// and saves it to the "admins" collection in MongoDB.

require('dotenv').config()

// Force public DNS so the mongodb+srv lookup works on Node v25 (same fix as index.js)
const dns = require('dns')
dns.setServers(['1.1.1.1', '8.8.8.8'])

const { MongoClient } = require('mongodb')
const bcrypt = require('bcryptjs')

const { MongoURI, ADMIN_USERNAME, ADMIN_PASSWORD } = process.env
const DB = 'sandeczigns'

async function seed() {
  if (!ADMIN_USERNAME || !ADMIN_PASSWORD) {
    console.error('❌ Set ADMIN_USERNAME and ADMIN_PASSWORD in server/.env first.')
    process.exit(1)
  }

  const client = new MongoClient(MongoURI)
  try {
    await client.connect()
    const hash = bcrypt.hashSync(ADMIN_PASSWORD, 10)
    await client.db(DB).collection('admins').updateOne(
      { username: ADMIN_USERNAME },
      { $set: { username: ADMIN_USERNAME, password: hash } },
      { upsert: true }
    )
    console.log(`✅ Admin "${ADMIN_USERNAME}" created/updated. You can log in now.`)
  } catch (e) {
    console.error(e)
  } finally {
    await client.close()
  }
}

seed()
