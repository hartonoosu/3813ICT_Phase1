import * as chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../server.js';  

chai.use(chaiHttp);
const { expect } = chai;

// Test for Get Groups and Channels Endpoint
describe('GET /get-groups-and-channels', () => {
  it('should return all groups and channels', (done) => {
    chai.request(app) // Notice chai.request(app) is used directly
      .get('/get-groups-and-channels')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        expect(res.body.length).to.be.greaterThan(0);
        done();
      });
  });
});

// Test for Creating a New User Endpoint
describe('POST /createUser', () => {
  it('should create a new user', (done) => {
    chai.request(app)
      .post('/createUser')
      .send({
        username: 'testuser',
        useremail: 'test@example.com',
        userrole: 'user',
        usergroup: 'default_group'
      })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.have.property('username', 'testuser');
        done();
      });
  });
});
