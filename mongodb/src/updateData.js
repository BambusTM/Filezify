const { MongoClient } = require("mongodb");

const uri = "mongodb://root:root@localhost:27017/filezify?authSource=admin";
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const db = client.db("testdb");

    // Beispiel 1: Update eines Users – Ändern der E-Mail-Adresse
    const filterUser = { _id: 1 };
    const updateUser = { $set: { email: "newuser1@example.com" } };
    const resultUser = await db.collection("Users").updateOne(filterUser, updateUser);
    console.log(`Updated ${resultUser.modifiedCount} document(s) in Users.`);

    // Beispiel 2: Update eines Files – Erhöhe den downloadCount um 1
    const filterFile = { _id: 2 };
    const updateFile = { $inc: { downloadCount: 1 } };
    const resultFile = await db.collection("Files").updateOne(filterFile, updateFile);
    console.log(`Updated ${resultFile.modifiedCount} document(s) in Files.`);
  } catch (error) {
    console.error("Fehler beim Aktualisieren der Daten:", error);
  } finally {
    await client.close();
  }
}

run();
