use testdb;

var user1 = {
  username: "Alice",
  email: "alice@example.com",
  createdAt: new Date("2023-04-01")
};

var user2 = {
  username: "Bob",
  phone: "+123456789",
  registeredAt: new Date("2023-04-02")
};

db.Users.insertMany([user1, user2]);

var allUsers = db.Users.find({}).toArray();
print("Alle Benutzer:");
printjson(allUsers);
