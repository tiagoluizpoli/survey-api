// init-mongo.js

db = db.getSiblingDB('clean-node-api');
db.createUser({
  user: 'root',
  pwd: 'example',
  roles: [{ role: 'readWrite', db: 'clean-node-api' }],
});
