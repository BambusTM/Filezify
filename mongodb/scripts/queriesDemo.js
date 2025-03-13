// Switch to the testdb database
use testdb;

// 1. Display one document per collection (one example for each entity type)
var oneUser = db.Users.findOne({});
var oneFile = db.Files.findOne({});
var onePermission = db.Permission.findOne({});

// 2. Retrieve all documents from each collection
var allUsers = db.Users.find({}).toArray();
var allFiles = db.Files.find({}).toArray();
var allPermissions = db.Permission.find({}).toArray();

// 3. Additional practical queries:

// Query 1: All users that have an 'email' field, projecting only username and email (excluding _id)
var usersWithEmailProjection = db.Users.find(
  { email: { $exists: true } },
  { projection: { username: 1, email: 1, _id: 0 } }
).toArray();

// Query 2: All files, projecting only name, type, and downloadCount (excluding _id)
var filesProjection = db.Files.find(
  {},
  { projection: { name: 1, type: 1, downloadCount: 1, _id: 0 } }
).toArray();

// Query 3: Combine files with their corresponding user information (Owner)
var filesWithOwner = db.Files.aggregate([
  {
    $lookup: {
      from: "Users",
      localField: "ownerId",
      foreignField: "_id",
      as: "owner"
    }
  }
]).toArray();

// Query 4: Combine permissions with corresponding user and file information
var permissionsJoin = db.Permission.aggregate([
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

// Query 5: Retrieve all locked files
var lockedFiles = db.Files.find({ locked: true }).toArray();
