import axiosInstance from '@/services/api';

describe('API Service', () => {
  it('should have a base URL', () => {
    expect(axiosInstance.defaults.baseURL).toBeDefined();
  });
});
