import axios from 'axios';
import axiosInstance from '@/services/api'; // Vérifiez que le chemin est correct

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('API Service', () => {
  it('should set Authorization header if token is present', async () => {
    // Mock localStorage
    const token = 'fake-token';
    Storage.prototype.getItem = jest.fn(() => token);

    // Mock a request
    mockedAxios.get.mockResolvedValue({ data: 'test data' });

    // Perform a request
    const response = await axiosInstance.get('/test-endpoint');

    // Check if the request was made with the Authorization header
    expect(mockedAxios.get).toHaveBeenCalledWith(
      '/test-endpoint',
      expect.objectContaining({
        headers: { Authorization: `Bearer ${token}` }
      })
    );

    // Validate the response
    expect(response.data).toBe('test data');
  });
});
