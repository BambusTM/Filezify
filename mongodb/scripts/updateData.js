use testdb;

var resultUser = db.Users.updateOne(
  { _id: 1 },
  { $set: { email: "newuser1@example.com" } }
);

var resultFile = db.Files.updateOne(
  { _id: 2 },
  { $inc: { downloadCount: 1 } }
);
