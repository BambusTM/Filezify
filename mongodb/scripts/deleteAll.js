use testdb;

var resultUsers = db.Users.deleteMany({});
var resultFiles = db.Files.deleteMany({});
var resultPermission = db.Permission.deleteMany({});