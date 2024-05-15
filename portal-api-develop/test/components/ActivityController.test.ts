import {expect} from 'chai';
import {agent as request} from 'supertest';

const auth = 'Bearer oG0Cs9tvWYN2UheHnfDr9A0zTRI5z5Uu6ATWLG4iBqc';
const accountId = 193;
const customer = 'portal.poc.edge.siemens.cloud';

let app;
describe("Activity Controller Test", function() {
    this.timeout(10000);

    before(async function() {
        app = await require('../../src/index');
    });
    it('should GET /v1/activities', async function () {
        const res = await request(app).get('/iemanager/api/v1/activities')
                                      .set({'Authorization': auth, 'Account_Id': accountId, 'Customer': customer});
        expect(res.status).to.equal(200);
        expect(res.body).not.to.be.empty;
        expect(res.body.data).to.be.an("array");
        expect(res.body.errorMsg).to.be.undefined;
    });
});