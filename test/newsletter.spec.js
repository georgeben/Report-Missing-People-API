/* eslint-disable no-undef */
const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoUnit = require('mongo-unit');
const server = require('../server');

const { expect } = chai;

chai.use(chaiHttp);

/*
 TODO Check that emails are sent when someone subscribes to newsletter
 - User testmail.app to check that emails are sent
 - use nodemailer to send emails during testing, not send grid

*/


describe('newsletter endpoint', () => {
  afterEach(() => mongoUnit.drop());
  it('should fetch all newsletter subscribers', (done) => {
    chai
      .request(server)
      .get('/api/v1/newsletter')
      .set('Accept', 'application/json')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.data).to.be.an('array');
        done();
      });
  });

  it('should add a newsletter subscriber', (done) => {
    const testSubscriber = {
      email: 'useremail@gmail.com',
      frequency: 'DAILY',
      address: {
        formatted_address: 'Aja, Lagos, Nigeria',
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
      .post('/api/v1/newsletter')
      .set('Accept', 'application/json')
      .send(testSubscriber)
      .end((err, res) => {
        expect(res.status).to.equal(201);
        expect(res.body.data.email).to.equal(testSubscriber.email);
        done();
      });
  });
});
