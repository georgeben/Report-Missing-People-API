/* eslint-disable no-undef */
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');

const { expect } = chai;

chai.use(chaiHttp);

describe('stats endpoint', () => {
  it('should get API stats', (done) => {
    chai
      .request(server)
      .get('/api/v1/stats')
      .set('Accept', 'application/json')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.data).to.be.an('object');
        expect(res.body.data).to.have.property('countryCount');
        expect(res.body.data).to.have.property('subscribersCount');
        expect(res.body.data).to.have.property('reportedCasesCount');
        done();
      });
  });
});
