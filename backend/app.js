var mongoClient = require("mongodb").MongoClient;
mongoClient.connect("mongodb://polarbear:uKjxQeZlDNkQpQPiAuNbbBQOCqu8iYllYmrBvahDibtl8vzGyDEIyQIMgd7zZPxqsRfQZglNn1qz0wj3IRJ7TQ==@polarbear.documents.azure.com:10255/?ssl=true", function (err, db) {
  db.close();
});