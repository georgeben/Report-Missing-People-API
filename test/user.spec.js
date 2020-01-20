/* eslint-disable no-undef */
const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoUnit = require('mongo-unit');
const server = require('../server');
const testData = require('./testUsers.json');

const { expect } = chai;

chai.use(chaiHttp);


describe('user endpoint', () => {
  const testUser = {
    fullname: 'John Okafor',
    email: 'testemail@email.com',
    password: '1234',
  };
  before(() => {
    mongoUnit.load(testData);
  });
  after(() => mongoUnit.drop(testData));

  it('should fetch the correct user details', (done) => {
    const loginDetails = {
      email: testUser.email,
      password: testUser.password,
    };
    chai
      .request(server)
      .post('/api/v1/auth/login')
      .set('Accept', 'application/json')
      .send(loginDetails)
      .end((err, res) => {
        const { token } = res.body.data;
        chai
          .request(server)
          .get('/api/v1/users/')
          .set('Accept', 'application/json')
          .set('authorization', `Bearer ${token}`)
          .end((error, result) => {
            expect(result.status).to.equal(200);
            expect(result.body.data.user.email).to.equal(testUser.email);
            done();
          });
      });
  });

  it('should update user profile', (done) => {
    const loginDetails = {
      email: testUser.email,
      password: testUser.password,
    };
    const updatedData = {
      residentialAddress: {
        formatted_address: 'New address',
        location: {
          coordinates: [3.5718512, 6.471745899999999],
          type: 'Point',
        },
        state: 'Lagos',
        country: 'Nigeria',
      },
    };
    chai
      .request(server)
      .post('/api/v1/auth/login')
      .set('Accept', 'application/json')
      .send(loginDetails)
      .end((err, res) => {
        const { token } = res.body.data;
        chai
          .request(server)
          .put('/api/v1/users/')
          .set('Accept', 'application/json')
          .set('authorization', `Bearer ${token}`)
          .send(updatedData)
          .end((error, result) => {
            expect(result.status).to.equal(200);
            expect(result.body.data.residentialAddress.formatted_address).to.equal(
              updatedData.residentialAddress.formatted_address,
            );
            done();
          });
      });
  });
});
