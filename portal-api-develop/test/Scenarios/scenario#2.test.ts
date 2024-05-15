import {expect} from 'chai';
import {agent as request} from 'supertest';

const auth = 'Bearer ZYDPLLBWSK3MVQJSIYHB1OR2JXCY0X2C5UJ2QAR2MAAIT5Q';
const accountId = 193;
const customer = 'portal.poc.edge.siemens.cloud';

let app;
describe("Scenario#2 Test", function() {
    const iemsId = '360ef820-143e-11ea-8f2c-01148a51cc6a';
    let subPackageId = undefined;
    let packageInfo = undefined;
    let packagesSize = undefined;
    
    this.timeout(10000);

    before(async function() {
        app = await require('../../src/index');
    });


    it('should GET /v1/subscription-packages', async function () {
        const res = await request(app).get('/iemanager/api/v1/subscription-packages')
                                      .set({'Authorization': auth, 'Account_Id': accountId, 'Customer': customer});
        expect(res.status).to.equal(200);
        expect(res.body).not.to.be.empty;
        expect(res.body.data).to.be.an("array");
        expect(res.body.data).not.to.be.empty;
        expect(res.body.errorMsg).to.be.undefined;

        // choose Golden Package
        subPackageId = res.body.data[0].id;
        expect(subPackageId).not.to.be.undefined;
    });

    // save the length of the array
    it('should GET /v1/user-subscription-packages#1', async function () {
        const res = await request(app).get('/iemanager/api/v1/user-subscription-packages')
                                      .set({'Authorization': auth, 'Account_Id': accountId, 'Customer': customer});
        expect(res.status).to.equal(200);
        expect(res.body).not.to.be.empty;
        expect(res.body.data).to.be.an("array");
        expect(res.body.data).not.to.be.empty;
        expect(res.body.errorMsg).to.be.undefined;

        packagesSize = res.body.data.length;
    });

    it('should POST /v1/purchasing-packages', async function () {
        const body = {
            "id": subPackageId
        };
        const res = await request(app).post('/iemanager/api/v1/purchasing-packages')
                                      .set({'Authorization': auth, 'Account_Id': accountId, 'Customer': customer})
                                      .send(body);
        expect(res.status).to.equal(200);
        expect(res.body).not.to.be.empty;
        expect(res.body.data).to.be.an("array");
        expect(res.body.data).not.to.be.empty;
        expect(res.body.errorMsg).to.be.undefined;

        packageInfo = res.body.data[0];
    });

    // the package must be pushed at the end of the array
    it('should GET /v1/user-subscription-packages#2', async function () {
        const res = await request(app).get('/iemanager/api/v1/user-subscription-packages')
                                      .set({'Authorization': auth, 'Account_Id': accountId, 'Customer': customer});
        expect(res.status).to.equal(200);
        expect(res.body).not.to.be.empty;
        expect(res.body.data).to.be.an("array");
        expect(res.body.data).not.to.be.empty;
        expect(res.body.errorMsg).to.be.undefined;

        expect(res.body.data.length).to.be.equal(packagesSize+1);
        // the logic is to add the packages at the end of the array
        let pack = res.body.data[packagesSize];
        expect(pack).not.to.be.undefined;
        expect(pack["subscriptionPackageId"]).to.be.equal(subPackageId);
        expect(pack["deviceCountRemaining"]).to.be.equal(pack["packageQuota"]).to.be.equal(10);
    });
    
    it('should GET /v1/activities', async function () {
        const res = await request(app).get('/iemanager/api/v1/activities')
                                      .set({'Authorization': auth, 'Account_Id': accountId, 'Customer': customer});
        expect(res.status).to.equal(200);
        expect(res.body).not.to.be.empty;
        expect(res.body.data).to.be.an("array");
        expect(res.body.errorMsg).to.be.undefined;

        let activity = res.body.data;
        activity.sort((a, b) => (a["transactionDate"] < b["transactionDate"]) ? 1 : -1);
        expect(activity[0]["transactionType"]).to.be.equal('PACKAGE_SUBSCRIPTION');
    });

    let serial = String(Math.floor( Math.random() * Math.floor(1000000) ));
    it('should POST /v1/iems/:iemsId/devices/checkout', async function () {
        const body = {
            "serialNo": serial,
            "name": "demo_dry_run_02"
        };
        const res = await request(app).post('/iemanager/api/v1/iems/' + iemsId + '/devices/checkout')
                                      .set({'Authorization': auth, 'Account_Id': accountId, 'Customer': customer})
                                      .send(body);
        expect(res.status).to.equal(200);
        expect(res.body).not.to.be.empty;
        expect(res.body.data).to.be.an("array");
        expect(res.body.data).not.to.be.empty;
        expect(res.body.errorMsg).to.be.undefined;
    });
    

    // check that qouts of last device is reduced by 1
    it('should GET /v1/user-subscription-packages#3', async function () {
        const res = await request(app).get('/iemanager/api/v1/user-subscription-packages')
                                      .set({'Authorization': auth, 'Account_Id': accountId, 'Customer': customer});
        expect(res.status).to.equal(200);
        expect(res.body).not.to.be.empty;
        expect(res.body.data).to.be.an("array");
        expect(res.body.data).not.to.be.empty;
        expect(res.body.errorMsg).to.be.undefined;

        expect(res.body.data.length).to.be.equal(packagesSize+1);
        // the logic is to add the packages at the end of the array
        let pack = res.body.data[packagesSize];
        expect(pack).not.to.be.undefined;
        expect(pack["subscriptionPackageId"]).to.be.equal(subPackageId);
        expect(pack["deviceCountRemaining"]).to.be.equal(pack["packageQuota"]-1).to.be.equal(9);
    });

    // better to be tested using a scenario.
    it('should POST /v1/iems/:iemsId/devices/check-in-devices', async function () {
        const res = await request(app).post('/iemanager/api/v1/iems/' + iemsId + '/devices/check-in-devices')
                                      .set({'Authorization': auth, 'Account_Id': accountId, 'Customer': customer});
        expect(res.status).to.equal(200);
        expect(res.body).not.to.be.empty;
        expect(res.body.data).to.be.an("array");
        expect(res.body.data).not.to.be.empty;
        expect(res.body.errorMsg).to.be.undefined;
    });
    
    let packId = undefined;
    // check that number of qoutas of last device didn't change after check-in
    it('should GET /v1/user-subscription-packages#4', async function () {
        const res = await request(app).get('/iemanager/api/v1/user-subscription-packages')
                                      .set({'Authorization': auth, 'Account_Id': accountId, 'Customer': customer});
        expect(res.status).to.equal(200);
        expect(res.body).not.to.be.empty;
        expect(res.body.data).to.be.an("array");
        expect(res.body.data).not.to.be.empty;
        expect(res.body.errorMsg).to.be.undefined;

        expect(res.body.data.length).to.be.equal(packagesSize+1);
        // the logic is to add the packages at the end of the array
        let pack = res.body.data[packagesSize];
        packId = pack['id'];
        expect(pack).not.to.be.undefined;
        expect(pack["subscriptionPackageId"]).to.be.equal(subPackageId);
        expect(pack["deviceCountRemaining"]).to.be.equal(pack["packageQuota"]-1).to.be.equal(9);
    });

    it('should POST /v1/subscription-packages/:packageId/decommission', async function () {
        const res = await request(app).post('/iemanager/api/v1/subscription-packages/' + packId + '/decommission')
                                      .set({'Authorization': auth, 'Account_Id': accountId, 'Customer': customer});
        expect(res.status).to.equal(200);
        expect(res.body).not.to.be.empty;
        expect(res.body.data).to.be.an("array");
        expect(res.body.data).not.to.be.empty;
        expect(res.body.errorMsg).to.be.undefined;

        expect(res.body.data[0]["userSubPackageId"]).to.be.equal(packId);
    });
});