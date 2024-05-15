import {expect} from 'chai';
import {agent as request} from 'supertest';

const auth = 'Bearer ZYDPLLBWSK3MVQJSIYHB1OR2JXCY0X2C5UJ2QAR2MAAIT5Q';
const accountId = 193;
const customer = 'portal.poc.edge.siemens.cloud';

let app;
describe("Scenario#1 Test", function() {
    let firmwareId = '';
    let iemsInfo = {};
    let configInfo = {};
    let transIems = undefined;
    
    this.timeout(10000);

    before(async function() {
        app = await require('../../src/index');
    });

    
    it('should GET /v1/firmwares', async function () {
        const res = await request(app).get('/iemanager/api/v1/firmwares')
                                      .set({'Authorization': auth, 'Account_Id': accountId, 'Customer': customer});
        expect(res.status).to.equal(200);
        expect(res.body).not.to.be.empty;
        expect(res.body.data).to.be.an("array");
        expect(res.body.data).not.to.be.empty;
        expect(res.body.errorMsg).to.be.undefined;

        firmwareId = res.body.data[0]["id"];
    });

    it('should GET /api/v1/iems-download/{instanceId}', async function() {
        const res = await request(app).get('/iemanager/api/v1/iems-download/' + firmwareId)
                                      .set({'Authorization': auth, 'Account_Id': accountId, 'Customer': customer});
        
        expect(res.status).to.equal(200);
        expect(res.body).not.to.be.empty;
        expect(res.body.data).to.be.an("object");
        expect(res.body.data).not.to.be.empty;
        expect(res.body.errorMsg).to.be.undefined;

        iemsInfo = res.body.data;
        delete iemsInfo['_links'];
        delete iemsInfo['state'];
        delete iemsInfo['downloadURI'];
    });

    it('should GET /v1/iems/:id', async function () {
        const res = await request(app).get('/iemanager/api/v1/iems/' + iemsInfo['id'])
                                      .set({'Authorization': auth, 'Account_Id': accountId, 'Customer': customer});

        expect(res.status).to.equal(200);
        expect(res.body).not.to.be.empty;
        expect(res.body.data).to.be.an("object");
        expect(res.body.data).not.to.be.empty;
        expect(res.body.errorMsg).to.be.undefined;

        const iems = res.body.data;
        delete iems['_links'];
        delete iems['state'];
        expect(iems).to.be.eql(iemsInfo);
    });

    it('should GET /v1/iems', async function() {
        const res = await request(app).get('/iemanager/api/v1/iems/')
                                      .set({'Authorization': auth, 'Account_Id': accountId, 'Customer': customer});

        expect(res.status).to.equal(200);
        expect(res.body).not.to.be.empty;
        expect(res.body.data).to.be.an("array");
        expect(res.body.data).not.to.be.empty;
        expect(res.body.errorMsg).to.be.undefined;

        let iems = {};
        res.body.data.forEach(element => {
            if (element['id'] == iemsInfo['id']) {
                expect(iems).to.be.empty;
                iems = element;
                delete iems['_links'];
                delete iems['state'];
            }
        });
        
        expect(iems).to.be.eql(iemsInfo)
    });
    
    it('should POST /api/v1/iems/{iemsId}/configurations', async function () {
        const body = {
            "name": "example-configuration",
            "metadata": {
              "keyboard-config": "en",
              "hostname": "example.host.mentor.com",
              "dhcb": "yes",
              "dhcp-settings": {
                "automatic-dns": "yes",
                "dns-ips": [
                  "137.202.38.2"
                ]
              },
              "proxy": "enabled",
              "proxy-credentials": {
                "url": "139.126.38.2",
                "username": "admin",
                "password": "P@$w0Rd"
              },
              "user-credentials": {
                "client-id": "ZYDPLLBWSK3MVQJSIYHB1OR2JXCY0X2C5UJ2QAR2MAAIT5Q",
                "acessToken": "YXBpVXJsOiAiaHR0cHM6Ly9teS5hcGkuY29tL2FwaS92MSIKdXNlcm5hbWU6IHt7dXNlcm5hbWV9fQpwYXNzd29yZDoge3twYXNzd29yZH19"
              }
            }
          };
        const res = await request(app).post('/iemanager/api/v1/iems/'+ iemsInfo['id'] + '/configurations')
                                      .set({'Authorization': auth, 'Account_Id': accountId, 'Customer': customer})
                                      .send(body);
        expect(res.status).to.equal(200);
        expect(res.body).not.to.be.empty;
        expect(res.body.data).to.be.an("object");
        expect(res.body.data).not.to.be.empty;
        expect(res.body.errorMsg).to.be.undefined;

        configInfo = res.body.data;
        delete configInfo['_links'];
    });
    
    it('should GET /api/v1/configurations/{id}', async function () {
        const res = await request(app).get('/iemanager/api/v1/configurations/' + configInfo['id'])
                                      .set({'Account_Id': accountId});
        expect(res.status).to.equal(200);
        expect(res.body).not.to.be.empty;
        expect(res.body.data).to.be.an("object");
        expect(res.body.data).not.to.be.empty;
        expect(res.body.errorMsg).to.be.undefined;

        const conf = res.body.data;
        delete conf['_links'];

        expect(conf).to.be.eql(configInfo);
    });
    
    it('should GET /v1/transactions/iems', async function () {
        const res = await request(app).get('/iemanager/api/v1/transactions/iems')
                                      .set({'Authorization': auth, 'Account_Id': accountId, 'Customer': customer});
        expect(res.status).to.equal(200);
        expect(res.body).not.to.be.empty;
        expect(res.body.data).to.be.an("array");
        expect(res.body.data).not.to.be.empty;
        expect(res.body.errorMsg).to.be.undefined;

        res.body.data.forEach(element => {
            if (element['iemsConfigId'] == configInfo['id']) {
                transIems = element;
            }
        });
        expect(transIems).not.to.be.undefined;
    });
    
    it('should GET /v1/activities', async function () {
        const res = await request(app).get('/iemanager/api/v1/activities')
                                      .set({'Authorization': auth, 'Account_Id': accountId, 'Customer': customer, 'transaction-type': 3});
        expect(res.status).to.equal(200);
        expect(res.body).not.to.be.empty;
        expect(res.body.data).to.be.an("array");
        expect(res.body.errorMsg).to.be.undefined;

        let activity = undefined;
        res.body.data.forEach(element => {
            if(element['transactionId'] == transIems['id']) {
                activity = element;
            }
        });
        expect(activity).not.to.be.undefined;
        expect(activity['transactionType']).to.be.equal(transIems['transactionType']);
    });

    it('should GET /v1/iems/:iemsId/devices', async function () {
        const res = await request(app).get('/iemanager/api/v1/iems/' + iemsInfo['id'] + '/devices')
                                      .set({'Authorization': auth, 'Account_Id': accountId, 'Customer': customer});
        expect(res.status).to.equal(200);
        expect(res.body).not.to.be.empty;
        expect(res.body.data).to.be.an("array");
        expect(res.body.data).to.be.empty;
        expect(res.body.errorMsg).to.be.undefined;
    });

    let serial = String(Math.floor( Math.random() * Math.floor(1000000) ));
    let checkoutDate = undefined;
    let checkinDate = undefined;
    it('should POST /v1/iems/:iemsId/devices/checkout', async function () {
        const body = {
            "serialNo": serial,
            "name": "demo_dry_run_02"
        };
        const res = await request(app).post('/iemanager/api/v1/iems/' + iemsInfo['id'] + '/devices/checkout')
                                      .set({'Authorization': auth, 'Account_Id': accountId, 'Customer': customer})
                                      .send(body);
        expect(res.status).to.equal(200);
        expect(res.body).not.to.be.empty;
        expect(res.body.data).to.be.an("array");
        expect(res.body.data).not.to.be.empty;
        expect(res.body.errorMsg).to.be.undefined;

        checkoutDate = res.body.data[0]['transactionDate'];
    });


    it('should GET /v1/iems/:iemsId/devices', async function () {
        const res = await request(app).get('/iemanager/api/v1/iems/' + iemsInfo['id'] + '/devices')
                                      .set({'Authorization': auth, 'Account_Id': accountId, 'Customer': customer});
        expect(res.status).to.equal(200);
        expect(res.body).not.to.be.empty;
        expect(res.body.data).to.be.an("array");
        expect(res.body.data).not.to.be.empty;
        expect(res.body.data.length).to.be.equal(1);
        expect(res.body.errorMsg).to.be.undefined;
    });

    it('should POST /v1/iems/:iemsId/devices/check-in', async function () {
        const body = {
            "serialNo": serial
        };
        const res = await request(app).post('/iemanager/api/v1/iems/' + iemsInfo['id'] + '/devices/check-in')
                                      .set({'Authorization': auth, 'Account_Id': accountId, 'Customer': customer})
                                      .send(body);
        expect(res.status).to.equal(200);
        expect(res.body).not.to.be.empty;
        expect(res.body.data).to.be.an("array");
        expect(res.body.data).not.to.be.empty;
        expect(res.body.errorMsg).to.be.undefined;
        
        checkinDate = res.body.data[0]['transactionDate'];
    });

    it('should GET /v1/transactions/devices/:fromDate', async function () {
        const fromDate = 1572875291000;
        const res = await request(app).get('/iemanager/api/v1/transactions/devices/' + fromDate)
                                      .set({'Authorization': auth, 'Account_Id': accountId, 'Customer': customer});
        expect(res.status).to.equal(200);
        expect(res.body).not.to.be.empty;
        expect(res.body.data).to.be.an("array");
        expect(res.body.data).not.to.be.empty;

        let checkoutTransaction;
        let checkinTransaction;
        res.body.data.forEach(element => {
            if(element['transactionDate'] == checkoutDate) {
                checkoutTransaction = element;
            }
            if(element['transactionDate'] == checkinDate) {
                checkinTransaction = element;
            }
        });

        expect(checkoutTransaction).not.to.be.undefined;
        expect(checkinTransaction).not.to.be.undefined;
    });
});