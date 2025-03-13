use testdb;

var users = [
  { _id: 1, username: "user1",  email: "user1@example.com",  password: "pass1",  createdAt: new Date("2023-01-01") },
  { _id: 2, username: "user2",  email: "user2@example.com",  password: "pass2",  createdAt: new Date("2023-01-02") },
  { _id: 3, username: "user3",  email: "user3@example.com",  password: "pass3",  createdAt: new Date("2023-01-03") },
  { _id: 4, username: "user4",  email: "user4@example.com",  password: "pass4",  createdAt: new Date("2023-01-04") },
  { _id: 5, username: "user5",  email: "user5@example.com",  password: "pass5",  createdAt: new Date("2023-01-05") },
  { _id: 6, username: "user6",  email: "user6@example.com",  password: "pass6",  createdAt: new Date("2023-01-06") },
  { _id: 7, username: "user7",  email: "user7@example.com",  password: "pass7",  createdAt: new Date("2023-01-07") },
  { _id: 8, username: "user8",  email: "user8@example.com",  password: "pass8",  createdAt: new Date("2023-01-08") },
  { _id: 9, username: "user9",  email: "user9@example.com",  password: "pass9",  createdAt: new Date("2023-01-09") },
  { _id: 10, username: "user10", email: "user10@example.com", password: "pass10", createdAt: new Date("2023-01-10") },
  { _id: 11, username: "user11", email: "user11@example.com", password: "pass11", createdAt: new Date("2023-01-11") },
  { _id: 12, username: "user12", email: "user12@example.com", password: "pass12", createdAt: new Date("2023-01-12") },
  { _id: 13, username: "user13", email: "user13@example.com", password: "pass13", createdAt: new Date("2023-01-13") },
  { _id: 14, username: "user14", email: "user14@example.com", password: "pass14", createdAt: new Date("2023-01-14") },
  { _id: 15, username: "user15", email: "user15@example.com", password: "pass15", createdAt: new Date("2023-01-15") },
  { _id: 16, username: "user16", email: "user16@example.com", password: "pass16", createdAt: new Date("2023-01-16") },
  { _id: 17, username: "user17", email: "user17@example.com", password: "pass17", createdAt: new Date("2023-01-17") },
  { _id: 18, username: "user18", email: "user18@example.com", password: "pass18", createdAt: new Date("2023-01-18") },
  { _id: 19, username: "user19", email: "user19@example.com", password: "pass19", createdAt: new Date("2023-01-19") },
  { _id: 20, username: "user20", email: "user20@example.com", password: "pass20", createdAt: new Date("2023-01-20") }
];

var files = [
  { _id: 1,  ownerId: 1,  name: "File1",  path: "/uploads/file1.pdf",   size: 123,  type: "pdf",  uploadedAt: new Date("2023-02-01"), downloadCount: 0, locked: false, comment: "Testdatei 1" },
  { _id: 2,  ownerId: 2,  name: "File2",  path: "/uploads/file2.docx",  size: 456,  type: "docx", uploadedAt: new Date("2023-02-02"), downloadCount: 2, locked: false, comment: "Testdatei 2" },
  { _id: 3,  ownerId: 3,  name: "File3",  path: "/uploads/file3.jpg",   size: 789,  type: "jpg",  uploadedAt: new Date("2023-02-03"), downloadCount: 5, locked: true,  comment: "Bilddatei" },
  { _id: 4,  ownerId: 4,  name: "File4",  path: "/uploads/file4.png",   size: 200,  type: "png",  uploadedAt: new Date("2023-02-04"), downloadCount: 1, locked: false, comment: "Testdatei 4" },
  { _id: 5,  ownerId: 5,  name: "File5",  path: "/uploads/file5.txt",   size: 10,   type: "txt",  uploadedAt: new Date("2023-02-05"), downloadCount: 0, locked: false, comment: "Textdatei" },
  { _id: 6,  ownerId: 6,  name: "File6",  path: "/uploads/file6.mp4",   size: 1024, type: "mp4",  uploadedAt: new Date("2023-02-06"), downloadCount: 7, locked: false, comment: "Video" },
  { _id: 7,  ownerId: 7,  name: "File7",  path: "/uploads/file7.mp3",   size: 2048, type: "mp3",  uploadedAt: new Date("2023-02-07"), downloadCount: 9, locked: false, comment: "Audio" },
  { _id: 8,  ownerId: 8,  name: "File8",  path: "/uploads/file8.csv",   size: 333,  type: "csv",  uploadedAt: new Date("2023-02-08"), downloadCount: 3, locked: true,  comment: "CSV-Datei" },
  { _id: 9,  ownerId: 9,  name: "File9",  path: "/uploads/file9.pdf",   size: 500,  type: "pdf",  uploadedAt: new Date("2023-02-09"), downloadCount: 2, locked: false, comment: "PDF-Test" },
  { _id: 10, ownerId: 10, name: "File10", path: "/uploads/file10.docx", size: 600,  type: "docx", uploadedAt: new Date("2023-02-10"), downloadCount: 4, locked: false, comment: "Dokument" },
  { _id: 11, ownerId: 11, name: "File11", path: "/uploads/file11.jpg",  size: 100,  type: "jpg",  uploadedAt: new Date("2023-02-11"), downloadCount: 2, locked: false, comment: "Bild" },
  { _id: 12, ownerId: 12, name: "File12", path: "/uploads/file12.pdf",  size: 700,  type: "pdf",  uploadedAt: new Date("2023-02-12"), downloadCount: 5, locked: true,  comment: "Testdatei 12" },
  { _id: 13, ownerId: 13, name: "File13", path: "/uploads/file13.docx", size: 150,  type: "docx", uploadedAt: new Date("2023-02-13"), downloadCount: 1, locked: false, comment: "Textdatei 13" },
  { _id: 14, ownerId: 14, name: "File14", path: "/uploads/file14.png",  size: 900,  type: "png",  uploadedAt: new Date("2023-02-14"), downloadCount: 0, locked: false, comment: "Grafikdatei" },
  { _id: 15, ownerId: 15, name: "File15", path: "/uploads/file15.mp4",  size: 2048, type: "mp4",  uploadedAt: new Date("2023-02-15"), downloadCount: 8, locked: false, comment: "Video 15" },
  { _id: 16, ownerId: 16, name: "File16", path: "/uploads/file16.mp3",  size: 1024, type: "mp3",  uploadedAt: new Date("2023-02-16"), downloadCount: 3, locked: false, comment: "Audio 16" },
  { _id: 17, ownerId: 17, name: "File17", path: "/uploads/file17.csv",  size: 50,   type: "csv",  uploadedAt: new Date("2023-02-17"), downloadCount: 4, locked: false, comment: "CSV 17" },
  { _id: 18, ownerId: 18, name: "File18", path: "/uploads/file18.txt",  size: 20,   type: "txt",  uploadedAt: new Date("2023-02-18"), downloadCount: 2, locked: false, comment: "Textdatei 18" },
  { _id: 19, ownerId: 19, name: "File19", path: "/uploads/file19.pdf",  size: 800,  type: "pdf",  uploadedAt: new Date("2023-02-19"), downloadCount: 6, locked: false, comment: "Große PDF" },
  { _id: 20, ownerId: 20, name: "File20", path: "/uploads/file20.docx", size: 350,  type: "docx", uploadedAt: new Date("2023-02-20"), downloadCount: 1, locked: true,  comment: "Abschlussdatei" }
];

var permissions = [
  { _id: 1,  userId: 1,  fileId: 1,  permissionType: "read",  grantedAt: new Date("2023-03-01") },
  { _id: 2,  userId: 1,  fileId: 2,  permissionType: "write", grantedAt: new Date("2023-03-02") },
  { _id: 3,  userId: 2,  fileId: 1,  permissionType: "admin", grantedAt: new Date("2023-03-03") },
  { _id: 4,  userId: 2,  fileId: 3,  permissionType: "read",  grantedAt: new Date("2023-03-04") },
  { _id: 5,  userId: 3,  fileId: 4,  permissionType: "read",  grantedAt: new Date("2023-03-05") },
  { _id: 6,  userId: 3,  fileId: 5,  permissionType: "write", grantedAt: new Date("2023-03-06") },
  { _id: 7,  userId: 4,  fileId: 6,  permissionType: "read",  grantedAt: new Date("2023-03-07") },
  { _id: 8,  userId: 5,  fileId: 7,  permissionType: "admin", grantedAt: new Date("2023-03-08") },
  { _id: 9,  userId: 5,  fileId: 8,  permissionType: "read",  grantedAt: new Date("2023-03-09") },
  { _id: 10, userId: 6,  fileId: 9,  permissionType: "write", grantedAt: new Date("2023-03-10") },
  { _id: 11, userId: 7,  fileId: 10, permissionType: "admin", grantedAt: new Date("2023-03-11") },
  { _id: 12, userId: 8,  fileId: 11, permissionType: "read",  grantedAt: new Date("2023-03-12") },
  { _id: 13, userId: 9,  fileId: 12, permissionType: "write", grantedAt: new Date("2023-03-13") },
  { _id: 14, userId: 10, fileId: 13, permissionType: "admin", grantedAt: new Date("2023-03-14") },
  { _id: 15, userId: 11, fileId: 14, permissionType: "read",  grantedAt: new Date("2023-03-15") },
  { _id: 16, userId: 12, fileId: 15, permissionType: "write", grantedAt: new Date("2023-03-16") },
  { _id: 17, userId: 13, fileId: 16, permissionType: "admin", grantedAt: new Date("2023-03-17") },
  { _id: 18, userId: 14, fileId: 17, permissionType: "read",  grantedAt: new Date("2023-03-18") },
  { _id: 19, userId: 15, fileId: 18, permissionType: "write", grantedAt: new Date("2023-03-19") },
  { _id: 20, userId: 16, fileId: 19, permissionType: "admin", grantedAt: new Date("2023-03-20") },
  { _id: 21, userId: 17, fileId: 20, permissionType: "read",  grantedAt: new Date("2023-03-21") },
  { _id: 22, userId: 18, fileId: 1,  permissionType: "write", grantedAt: new Date("2023-03-22") },
  { _id: 23, userId: 19, fileId: 2,  permissionType: "read",  grantedAt: new Date("2023-03-23") },
  { _id: 24, userId: 20, fileId: 3,  permissionType: "admin", grantedAt: new Date("2023-03-24") },
  { _id: 25, userId: 20, fileId: 4,  permissionType: "write", grantedAt: new Date("2023-03-25") }
];

db.Users.insertMany(users);
db.Files.insertMany(files);
db.Permission.insertMany(permissions);