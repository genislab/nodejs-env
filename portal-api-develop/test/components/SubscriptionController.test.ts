import {expect} from 'chai';
import {agent as request} from 'supertest';

const auth = 'Bearer ZYDPLLBWSK3MVQJSIYHB1OR2JXCY0X2C5UJ2QAR2MAAIT5Q';
const accountId = 193;
const customer = 'portal.poc.edge.siemens.cloud';
const packageTypeId = '5447076f-ea8d-4d47-a5e7-acae08f60db2' // Golden or Silver

let app;
describe("Subscription Controller Test", function() {
    this.timeout(10000);
    
    before(async function() {
        app = await require('../../src/index');
    });
    
    it('should POST /v1/purchasing-packages', async function () {
        const body = {
            "id": packageTypeId
        };
        const res = await request(app).post('/iemanager/api/v1/purchasing-packages')
                                      .set({'Authorization': auth, 'Account_Id': accountId, 'Customer': customer})
                                      .send(body);
        expect(res.status).to.equal(200);
        expect(res.body).not.to.be.empty;
        expect(res.body.data).to.be.an("array");
        expect(res.body.data).not.to.be.empty;
        expect(res.body.errorMsg).to.be.undefined;
    });

    it('should POST /v1/subscription-packages/:packageId/decommission', async function () {
        const packageId = '13734ea0-15b1-11ea-8fa7-858ed1accf65';
        const res = await request(app).post('/iemanager/api/v1/subscription-packages/' + packageId + '/decommission')
                                      .set({'Authorization': auth, 'Account_Id': accountId, 'Customer': customer});
        expect(res.status).to.equal(200);
        expect(res.body).not.to.be.empty;
        expect(res.body.data).to.be.an("array");
        expect(res.body.data).not.to.be.empty;
        expect(res.body.errorMsg).to.be.undefined;
    });

    it('should GET /v1/subscription-packages', async function () {
        const res = await request(app).get('/iemanager/api/v1/subscription-packages')
                                      .set({'Authorization': auth, 'Account_Id': accountId, 'Customer': customer});
        expect(res.status).to.equal(200);
        expect(res.body).not.to.be.empty;
        expect(res.body.data).to.be.an("array");
        expect(res.body.data).not.to.be.empty;
        expect(res.body.errorMsg).to.be.undefined;
    });

    it('should GET /v1/user-subscription-packages', async function () {
        const res = await request(app).get('/iemanager/api/v1/user-subscription-packages')
                                      .set({'Authorization': auth, 'Account_Id': accountId, 'Customer': customer});
        expect(res.status).to.equal(200);
        expect(res.body).not.to.be.empty;
        expect(res.body.data).to.be.an("array");
        expect(res.body.data).not.to.be.empty;
        expect(res.body.errorMsg).to.be.undefined;
    });
});