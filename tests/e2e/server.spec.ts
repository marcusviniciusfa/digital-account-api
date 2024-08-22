import axios from 'axios';

describe('servidor', () => {
  it('deve estar disponível na porta 3000 com o endpoint base /api/v1', async () => {
    const response = await axios.get('http://localhost:3000/api/v1');
    expect(response.status).toBe(200);
  });
});
