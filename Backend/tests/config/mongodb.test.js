require('dotenv').config();
const mongoose = require('mongoose');

describe('MongoDB Connection', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }, 60000); // Augmentez le délai d'attente à 60 secondes

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should connect to MongoDB successfully', async () => {
    expect(mongoose.connection.readyState).toBe(1);
  });
});
