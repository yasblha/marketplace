module.exports = {
  createTransport: jest.fn(() => ({
    sendMail: jest.fn().mockResolvedValue({ response: 'ok' })
  })),
};
