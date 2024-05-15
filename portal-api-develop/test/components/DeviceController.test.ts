import {expect} from 'chai';
import {agent as request} from 'supertest';

const auth = 'Bearer ZYDPLLBWSK3MVQJSIYHB1OR2JXCY0X2C5UJ2QAR2MAAIT5Q';
const accountId = 193;
const customer = 'portal.poc.edge.siemens.cloud';
const iemsId = '360ef820-143e-11ea-8f2c-01148a51cc6a';

let app;
describe("Device Controller Test", function() {
    this.timeout(10000);
    
    before(async function() {
        app = await require('../../src/index');
    });
    it('should GET /v1/iems/:iemsId/devices', async function () {
        const res = await request(app).get('/iemanager/api/v1/iems/' + iemsId + '/devices')
                                      .set({'Authorization': auth, 'Account_Id': accountId, 'Customer': customer, 'iemsId': iemsId});
        expect(res.status).to.equal(200);
        expect(res.body).not.to.be.empty;
        expect(res.body.data).to.be.an("array");
        expect(res.body.data).not.to.be.empty;
        expect(res.body.errorMsg).to.be.undefined;
    });

    it('should GET /v1/transactions/devices/:fromDate', async function () {
        const fromDate = 1572875291000;
        const res = await request(app).get('/iemanager/api/v1/transactions/devices/' + fromDate)
                                      .set({'Authorization': auth, 'Account_Id': accountId, 'Customer': customer, 'iemsId': iemsId});
        expect(res.status).to.equal(200);
        expect(res.body).not.to.be.empty;
        expect(res.body.data).to.be.an("array");
        expect(res.body.data).not.to.be.empty;
    });

    // // better to be tested using a scenario.
    // it('should POST /v1/iems/:iemsId/devices/checkout', async function () {
    //     const body = {
    //         "serialNo": "100102",
    //         "name": "demo_dry_run_02"
    //     };
    //     const res = await request(app).post('/iemanager/api/v1/iems/' + iemsId + '/devices/checkout')
    //                                   .set({'Authorization': auth, 'Account_Id': accountId, 'Customer': customer, 'iemsId': iemsId})
    //                                   .send(body);
    //     expect(res.status).to.equal(200);
    //     expect(res.body).not.to.be.empty;
    //     expect(res.body.data).to.be.an("array");
    //     // expect(res.body.data).not.to.be.empty;
    //     // expect(res.body.errorMsg).to.be.undefined;
    // });

    // // better to be tested using a scenario.
    // it('should POST /v1/iems/:iemsId/devices/check-in', async function () {
    //     const body = {
    //         "serialNo": "100102"
    //     };
    //     const res = await request(app).post('/iemanager/api/v1/iems/' + iemsId + '/devices/check-in')
    //                                   .set({'Authorization': auth, 'Account_Id': accountId, 'Customer': customer, 'iemsId': iemsId})
    //                                   .send(body);
    //     expect(res.status).to.equal(200);
    //     expect(res.body).not.to.be.empty;
    //     expect(res.body.data).to.be.an("array");
    //     // expect(res.body.data).not.to.be.empty;
    //     // expect(res.body.errorMsg).to.be.undefined;
    // });

    // // better to be tested using a scenario.
    // it('should POST /v1/iems/:iemsId/devices/check-in-devices', async function () {
    //     const res = await request(app).post('/iemanager/api/v1/iems/' + iemsId + '/devices/check-in-devices')
    //                                   .set({'Authorization': auth, 'Account_Id': accountId, 'Customer': customer, 'iemsId': iemsId});
    //     expect(res.status).to.equal(200);
    //     expect(res.body).not.to.be.empty;
    //     expect(res.body.data).to.be.an("array");
    //     expect(res.body.data).not.to.be.empty;
    //     expect(res.body.errorMsg).to.be.undefined;
    // });
});