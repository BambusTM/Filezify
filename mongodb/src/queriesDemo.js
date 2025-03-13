const { MongoClient } = require("mongodb");

const uri = "mongodb://root:root@localhost:27017/filezify?authSource=admin";
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const db = client.db("testdb");
    const users = db.collection("Users");
    const files = db.collection("Files");
    const permission = db.collection("Permission");

    // 1. Eine Entität anzeigen (ein Beispiel pro Entitätstyp)
    const oneUser = await users.findOne({});
    const oneFile = await files.findOne({});
    const onePermission = await permission.findOne({});

    console.log("Ein Benutzer:", oneUser);
    console.log("Eine Datei:", oneFile);
    console.log("Eine Berechtigung:", onePermission);

    // 2. Alle Entitäten anzeigen (jeweils für einen Entitätstyp)
    const allUsers = await users.find({}).toArray();
    const allFiles = await files.find({}).toArray();
    const allPermissions = await permission.find({}).toArray();

    console.log("Alle Benutzer (Anzahl):", allUsers.length);
    console.log("Alle Dateien (Anzahl):", allFiles.length);
    console.log("Alle Berechtigungen (Anzahl):", allPermissions.length);

    // 3. Weitere praxisnahe Abfragen:

    // Query 1: Alle Benutzer mit einem vorhandenen 'email'-Feld, nur username und email anzeigen
    const usersWithEmailProjection = await users.find(
      { email: { $exists: true } },
      { projection: { username: 1, email: 1, _id: 0 } }
    ).toArray();
    console.log("Benutzer mit Email (Projection):", usersWithEmailProjection);

    // Query 2: Alle Dateien, nur name, type und downloadCount anzeigen
    const filesProjection = await files.find(
      {},
      { projection: { name: 1, type: 1, downloadCount: 1, _id: 0 } }
    ).toArray();
    console.log("Dateien (Projection):", filesProjection);

    // Query 3: Dateien mit zugehörigen Benutzerinformationen (Owner) kombinieren
    const filesWithOwner = await files.aggregate([
      {
        $lookup: {
          from: "Users",
          localField: "ownerId",
          foreignField: "_id",
          as: "owner"
        }
      }
    ]).toArray();
    console.log("Dateien mit Owner-Info (Join):", filesWithOwner);

    // Query 4: Berechtigungen kombiniert mit Benutzer- und Dateiinformationen
    const permissionsJoin = await permission.aggregate([
      {
        $lookup: {
          from: "Users",
          localField: "userId",
          foreignField: "_id",
          as: "user"
        }
      },
      {
        $lookup: {
          from: "Files",
          localField: "fileId",
          foreignField: "_id",
          as: "file"
        }
      }
    ]).toArray();
    console.log("Berechtigungen mit Benutzer- und Dateiinfos (Join):", permissionsJoin);

    // Query 5: Alle gesperrten Dateien anzeigen
    const lockedFiles = await files.find({ locked: true }).toArray();
    console.log("Gesperrte Dateien:", lockedFiles);

  } catch (error) {
    console.error("Fehler bei den Abfragen:", error);
  } finally {
    await client.close();
  }
}

run();
