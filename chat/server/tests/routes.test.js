import request from 'supertest';
import app from '../server.js';

describe('Server Routes', () => {
  it('should get groups and channels', async () => {
    const response = await request(app).get('/get-groups-and-channels');
    expect(response.statusCode).toBe(200);
  });

  it('should create a new group', async () => {
    const response = await request(app).post('/create-group').send({ groupName: 'Test Group' });
    expect(response.statusCode).toBe(200);
  });
});
