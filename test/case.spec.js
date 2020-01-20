/* eslint-disable no-undef */
const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoUnit = require('mongo-unit');
const server = require('../server');
const testCases = require('./testCases.json');

const { expect } = chai;

chai.use(chaiHttp);

before(() => mongoUnit.load(testCases));

describe('case endpoints', () => {
  it('should retrieve all reported cases', (done) => {
    chai
      .request(server)
      .get('/api/v1/cases')
      .set('Accept', 'application/json')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.data).to.be.an('array');
        expect(res.body.data.length).to.equal(testCases.cases.length);
        done();
      });
  });

  it('should return a single reported case', (done) => {
    const testSlug = testCases.cases[0].slug;
    chai
      .request(server)
      .get(`/api/v1/cases/${testSlug}`)
      .set('Accept', 'application/json')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.data.case.slug).to.equal(testSlug);
        done();
      });
  });
});
