db = db.getSiblingDB('marketplace')

db.createUser({
    user: 'some_user',
    pwd: 'random_pass',
    roles: [
      {
        role: 'dbOwner',
        db: 'sample_db',
      },
    ],
});

db.createCollection('users');
db.users.insertOne(
    {
        name: 'Bill Palmer'
    }
);