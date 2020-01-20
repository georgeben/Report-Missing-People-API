/* eslint-disable prefer-arrow-callback */
/* eslint-disable func-names */
/* eslint-disable no-undef */
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');

const { expect } = chai;

chai.use(chaiHttp);

// before(() => mongoUnit.load(testCases));

describe('users endpoint', () => {
  const testUser = {
    fullname: 'John Okafor',
    email: 'test@email.com',
    password: '1234',
  };

  it('should create a user', function (done) {
    // this.skip();
    chai
      .request(server)
      .post('/api/v1/auth/signup')
      .set('Accept', 'application/json')
      .send(testUser)
      .end((err, res) => {
        const createdUser = res.body.data.user;
        expect(res.status).to.equal(201);
        expect(createdUser.email).to.equal(testUser.email);
        expect(createdUser.fullname).to.equal(testUser.fullname);
        expect(createdUser.verifiedEmail).to.equal(false);
        expect(createdUser.completedProfile).to.equal(false);
        done();
      });
  });

  it('should not create a user with invalid email', (done) => {
    const testUserWithInvalidEmail = {
      fullname: 'John Okafor',
      email: 'test@email',
      password: '1234',
    };
    chai
      .request(server)
      .post('/api/v1/auth/signup')
      .set('Accept', 'application/json')
      .send(testUserWithInvalidEmail)
      .end((err, res) => {
        expect(res.status).to.equal(422);
        done();
      });
  });

  it('should allow a registered user to sign in', (done) => {
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
        expect(res.status).to.equal(200);
        expect(res.body.data.user.email).to.equal(testUser.email);
        done();
      });
  });

  it('should not allow a user with wrong credentials to login', (done) => {
    const loginDetails = {
      email: testUser.email,
      password: 'wrong password',
    };
    chai
      .request(server)
      .post('/api/v1/auth/login')
      .set('Accept', 'application/json')
      .send(loginDetails)
      .end((err, res) => {
        expect(res.status).to.equal(401);
        expect(res.body).to.have.property('error');
        done();
      });
  });

  it('should not allow a non existent user to login', (done) => {
    const loginDetails = {
      email: 'idontexist@email.com',
      password: 'wrong password',
    };
    chai
      .request(server)
      .post('/api/v1/auth/login')
      .set('Accept', 'application/json')
      .send(loginDetails)
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body).to.have.property('error');
        done();
      });
  });

  it('should not send a password reset email to a non-existent account', (done) => {
    chai
      .request(server)
      .post('/api/v1/auth/forgot-password')
      .set('Accept', 'application/json')
      .send({ email: 'idontexist@email.com' })
      .end((err, res) => {
        expect(res.status).to.equal(404);
        expect(res.body).to.have.property('error');
        done();
      });
  });
});
