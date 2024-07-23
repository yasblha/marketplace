const mongoose = {
  connect: jest.fn().mockResolvedValue({
    connection: {
      readyState: 1,
      close: jest.fn().mockResolvedValue(true),
    },
  }),
  connection: {
    readyState: 1,
    close: jest.fn().mockResolvedValue(true),
  },
  Schema: jest.fn(),
  model: jest.fn(),
  Types: {
    ObjectId: jest.fn(),
  },
};

module.exports = mongoose;
