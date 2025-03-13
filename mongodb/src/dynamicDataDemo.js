const { MongoClient } = require("mongodb");

const uri = "mongodb://root:root@localhost:27017/filezify?authSource=admin";
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const db = client.db("testdb");
    const users = db.collection("Users");

    const user1 = {
      username: "Alice",
      email: "alice@example.com",
      createdAt: new Date("2023-04-01")
    };

    const user2 = {
      username: "Bob",
      phone: "+123456789",
      registeredAt: new Date("2023-04-02")
    };

    await users.insertMany([user1, user2]);

    const allUsers = await users.find({}).toArray();
    console.log("Alle Benutzer:", allUsers);

  } catch (error) {
    console.error("Fehler:", error);
  } finally {
    await client.close();
  }
}

run();
