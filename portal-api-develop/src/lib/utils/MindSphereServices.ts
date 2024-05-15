/**
 *
 * Copyright (c) Mentor A Siemens Business. All rights reserved.
 */
import btoa from 'btoa';
import httpRequest from 'request';
import { Constants } from './Constants';
require('dotenv').config()
export class MindSphereServices {

    static async getMSTechnicalToken(): Promise<string> {
        const clientSecret = process.env.MS_CLIENT_SECRET;
        const clientId = process.env.MS_CLIENT_ID;
        const securityServiceUrl = "https://edgeops.piam.eu1.mindsphere.io/oauth/token?grant_type=client_credentials&response_type=token"
        const stringToEncode = `${clientId}:${clientSecret}`;
        const base64 = btoa(stringToEncode);
        return new Promise(function (resolve, reject) {
            httpRequest.post({
                url: securityServiceUrl,
                headers: { 'Authorization': 'Basic ' + base64, 'accept': '*/*', 'content-type': 'application/x-www-form-urlencoded' }
            }
                , function (error, answer, body) {
                    if (!error) {
                        if (answer.statusCode == 200) {
                            const response = JSON.parse(body);
                            if (response.access_token) {
                                resolve(response.access_token);
                            }
                        }
                        else {
                            reject(answer.statusCode);;
                        }
                    }
                    else {
                        reject(error);
                    }
                }
            );
        });
    }

    static getPackageDownloadURI(token: string, instanceId?: string): Promise<string> {
        if (!instanceId)
            instanceId = "a7aade67-85e5-4755-ad2c-19dcb46cb907";
        // const serviceUrl = `https://gateway.eu1.mindsphere.io/api/firmwarereleasemanagement/v3/firmware/${instanceId}/releases/b7d4d33c-9376-4839-982f-66f2dee1793d/artifacts`;
        const serviceUrl = `https://gateway.eu1.mindsphere.io/api/firmwarereleasemanagement/v3/firmware/${instanceId}/releases/b7d4d33c-9376-4839-982f-66f2dee1793d/deploymentDataset`
        const options = {
            url: serviceUrl,
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };
        // console.log("options", options);
        return new Promise(function (resolve, reject) {
            httpRequest(options
                , function (error, answer, body) {
                    const response = JSON.parse(body);
                    if (response.hasOwnProperty('errors')) {
                        throw new Error(Constants.noFirmwareFound);
                    }
                    try {
                        resolve(response.artifacts[0].uri)
                    } catch (error) {
                        reject(error);
                    }
                }
            );
        });
    }

    static getAvailableFirmware(token: string, instanceId?: string): Promise<any> {
        let serviceUrl = "https://gateway.eu1.mindsphere.io/api/firmwarereleasemanagement/v3/firmware";
        if (instanceId)
            serviceUrl = `https://gateway.eu1.mindsphere.io/api/firmwarereleasemanagement/v3/firmware/${instanceId}`;
        else
            serviceUrl = `https://gateway.eu1.mindsphere.io/api/firmwarereleasemanagement/v3/firmware?deviceTypeId=${process.env.MS_FA_DEVICE_TYPE_ID}`;
        const options = {
            url: serviceUrl,
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };
        return new Promise(function (resolve, reject) {
            httpRequest(options
                , function (error, answer, body) {
                    const response = JSON.parse(body);
                    try {
                        if (instanceId)
                            resolve(response)
                        else
                            resolve(response.content)
                    } catch (error) {
                        reject(error);
                    }
                }
            );
        });
    }

    static async provisionPackage(tenantId : string ,requestId: string, packageId: string, quantity: number): Promise<any> {
        let serviceUrl = "https://gateway.eu1.mindsphere.io/api/packagebuilder/v3/provisionPackageJobs";
        const options = {
            url: serviceUrl,
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${await this.getMSTechnicalToken()}`
            },
            body: {
                'requestId': requestId,
                'tenantId': tenantId,
                'packageId': packageId,
                'requestedQuantity': quantity
            },
            json: true
        };
        return new Promise(function (resolve, reject) {
            httpRequest(options
                , function (error: any, answer: any, body: any) {

                    try {
                        resolve(body)
                    } catch (error) {
                        console.log(error)
                        reject(error);
                    }
                }
            );
        });
    }

    static async getProvisionJobDetails(packageJobId: string): Promise<any> {
        let serviceUrl = "https://gateway.eu1.mindsphere.io/api/packagebuilder/v3/provisionPackageJobs/"+packageJobId;
        const options = {
            url: serviceUrl,
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${await this.getMSTechnicalToken()}`
            },

        };
        return new Promise(function (resolve, reject) {
            httpRequest(options
                , function (error, answer, body) {
                    console.log(body)
                    try {
                        resolve(body)
                    } catch (error) {
                        reject(error);
                    }
                }
            );
        });
    }


    static async deProvisionPackage(tenantId : string ,requestId: string, packageId: string, quantity: number): Promise<any> {
        let serviceUrl = "https://gateway.eu1.mindsphere.io/api/packagebuilder/v3/deprovisionPackageJobs";
        const options = {
            url: serviceUrl,
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${await this.getMSTechnicalToken()}`
            },
            body: {
                'requestId': requestId,
                'tenantId': tenantId,
                'packageId': packageId,
                'requestedQuantity': quantity
            },
            json: true
        };
        return new Promise(function (resolve, reject) {
            httpRequest(options
                , function (error: any, answer: any, body: any) {

                    try {
                        resolve(body)
                    } catch (error) {
                        console.log(error)
                        reject(error);
                    }
                }
            );
        });
    }

    static getDeprovisionJobDetails(token: string, requestId: string): Promise<any> {
        let serviceUrl = "https://gateway.eu1.mindsphere.io/api/packagebuilder/v3/deprovisionPackageJobs/requestId";
        const options = {
            url: serviceUrl,
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.getMSTechnicalToken()}`
            },

        };
        return new Promise(function (resolve, reject) {
            httpRequest(options
                , function (error, answer, body) {
                    try {
                        resolve(body)
                    } catch (error) {
                        reject(error);
                    }
                }
            );
        });
    }


}