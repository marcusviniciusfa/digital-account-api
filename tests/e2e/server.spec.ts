import axios from 'axios';

describe('server ', () => {
  it('should be available on port 3000 with the base endpoint /api/v1', async () => {
    const response = await axios.get('http://localhost:3000/api/v1');
    expect(response.status).toBe(200);
  });
});
