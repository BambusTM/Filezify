const { MongoClient } = require("mongodb");

const uri = "mongodb://root:root@localhost:27017/filezify?authSource=admin";
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const db = client.db("testdb");

    const resultUsers = await db.collection("Users").deleteMany({});
    const resultFiles = await db.collection("Files").deleteMany({});
    const resultPermission = await db.collection("Permission").deleteMany({});

    console.log(`Deleted ${resultUsers.deletedCount} Users documents.`);
    console.log(`Deleted ${resultFiles.deletedCount} Files documents.`);
    console.log(`Deleted ${resultPermission.deletedCount} Permission documents.`);
  } catch (error) {
    console.error("Fehler beim Löschen der Daten:", error);
  } finally {
    await client.close();
  }
}

run();
