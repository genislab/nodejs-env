import {expect} from 'chai';
import {agent as request} from 'supertest';

const auth = 'Bearer ZYDPLLBWSK3MVQJSIYHB1OR2JXCY0X2C5UJ2QAR2MAAIT5Q';
const accountId = 193;
const customer = 'portal.poc.edge.siemens.cloud';
const iemsId = '360ef820-143e-11ea-8f2c-01148a51cc6a';

let app;
describe("Iems Controller Test", function() {
    this.timeout(10000);
    
    before(async function() {
        app = await require('../../src/index');
    })
    it('should GET /v1/iems', async function () {
        const res = await request(app).get('/iemanager/api/v1/iems')
                                      .set({'Authorization': auth, 'Account_Id': accountId, 'Customer': customer});
        expect(res.status).to.equal(200);
        expect(res.body).not.to.be.empty;
        expect(res.body.data).to.be.an("array");
        expect(res.body.data).not.to.be.empty;
        expect(res.body.errorMsg).to.be.undefined;
    });
    
    it('should GET /v1/iems/:id', async function () {
        const res = await request(app).get('/iemanager/api/v1/iems/' + iemsId)
                                      .set({'Authorization': auth, 'Account_Id': accountId, 'Customer': customer});
        expect(res.status).to.equal(200);
        expect(res.body).not.to.be.empty;
        expect(res.body.data).to.be.an("object");
        expect(res.body.data).not.to.be.empty;
        expect(res.body.errorMsg).to.be.undefined;
    });
    
    it('should GET /v1/transactions/iems', async function () {
        const res = await request(app).get('/iemanager/api/v1/transactions/iems')
                                      .set({'Authorization': auth, 'Account_Id': accountId, 'Customer': customer});
        expect(res.status).to.equal(200);
        expect(res.body).not.to.be.empty;
        expect(res.body.data).to.be.an("array");
        expect(res.body.data).not.to.be.empty;
        expect(res.body.errorMsg).to.be.undefined;
    });
    
    it('should GET /v1/firmwares', async function () {
        const res = await request(app).get('/iemanager/api/v1/firmwares')
                                      .set({'Authorization': auth, 'Account_Id': accountId, 'Customer': customer});
        expect(res.status).to.equal(200);
        expect(res.body).not.to.be.empty;
        expect(res.body.data).to.be.an("array");
        expect(res.body.data).not.to.be.empty;
        expect(res.body.errorMsg).to.be.undefined;
    });
    
    it('should GET /v1/firmwares/:iemsId/uri', async function () {
        const res = await request(app).get('/iemanager/api/v1/firmwares/' + iemsId + '/uri')
                                      .set({'Authorization': auth, 'Account_Id': accountId, 'Customer': customer});
        expect(res.status).to.equal(200);
        expect(res.body).not.to.be.empty;
        expect(res.body.data).to.be.an("array");
        expect(res.body.data).not.to.be.empty;
        expect(res.body.errorMsg).to.be.undefined;
    });
    
    it('should GET /v1/configurations', async function () {
        const res = await request(app).get('/iemanager/api/v1/configurations')
                                      .set({'iems-id': iemsId, 'Account_Id': accountId});
        expect(res.status).to.equal(200);
        expect(res.body).not.to.be.empty;
        expect(res.body.data).to.be.an("array");
        expect(res.body.data).not.to.be.empty;
        expect(res.body.errorMsg).to.be.undefined;
    });
    
    it('should GET /v1/iems/:iemsId/configurations', async function () {
        const res = await request(app).get('/iemanager/api/v1/iems/' + iemsId + '/configurations')
                                      .set({'Account_Id': accountId});
        expect(res.status).to.equal(200);
        expect(res.body).not.to.be.empty;
        expect(res.body.data).to.be.an("array");
        expect(res.body.data).not.to.be.empty;
        expect(res.body.errorMsg).to.be.undefined;
    });
});