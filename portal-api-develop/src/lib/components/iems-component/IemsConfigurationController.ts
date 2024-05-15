/**
 *
 * Copyright (c) Mentor A Siemens Business. All rights reserved.
 */
import { AWSServices } from './../../utils/AWSServices';

import { Body, Get, Post, Req, Res, JsonController, QueryParam, Param, HeaderParam } from 'routing-controllers';
import { IemsConfigurationService } from './IemsConfigurationService';
import { APIResponse } from '../../utils/APIResponse';
import { Response, Request } from 'express';
import { IemsConfigurationDto } from './IemsConfigurationDto';
import hal from 'hal';
import { MindSphereServices } from '../../utils/MindSphereServices';
import { Constants } from '../../utils/Constants';
require('dotenv').config()

@JsonController("")
export class IemsConfigurationController {


  constructor() {
  }

  configService = new IemsConfigurationService();

  @Get("/v1/configurations")
  async getAll(@Req() request: Request, @Res() response: Response, @HeaderParam("Account_Id") userId: number, @QueryParam("iems-id") iemsId: string) {
    let responseBody = new APIResponse();
    try {
      const host = request.get('host');
      let configDtoList = await this.configService.getAllConfigByIems(userId, iemsId);

      /**
       * format to hal
       */
      let halConfigDtoList = [];
      configDtoList.forEach(element => {
        let halResource = new hal.Resource(element, `${host}${process.env.API_PREFIX}/v1/configurations/${element.id}`);
        halConfigDtoList.push(halResource);
      });
      let halResponse = new hal.Resource({}, `${host}${process.env.API_PREFIX}/v1/configurations`)
      halResponse.embed("configurations", halConfigDtoList);

      responseBody.data.push(halResponse);
      response.send(responseBody);
    } catch (e) {
      responseBody.errorMsg = String(e);
      response.send(responseBody);
    }
    return response;
  }

  @Get("/v1/configurations/:id")
  async get(@Req() request: Request, @HeaderParam("Account_Id") userId: number, @Res() response: Response) {
    let responseBody = new APIResponse();
    try {
      const host = request.get('host');
      const id = (request.params.id);
      let configDtos = await this.configService.getAllConfig(userId, id);
      if (!configDtos || configDtos.length == 0) {
        throw new Error(Constants.noConfigurationFound);
      }
      let configDto = configDtos[0];
      const halResource = new hal.Resource(configDto, `${host}${process.env.API_PREFIX}/v1/configurations/${configDto.id}`);
      responseBody.data.push(halResource);
      response.send(responseBody);
    } catch (e) {
      responseBody.errorMsg = String(e);
      response.send(responseBody);
    }
    return response;
  }

  @Get("/v1/iems-download/:instanceId")
  async download(@Req() request: Request, @HeaderParam("Account_Id") userId: number, @Res() response: Response, @QueryParam("version") version: number) {
    let responseBody = new APIResponse();
    try {
      const host = request.get('host');
      const instanceId = (request.params.instanceId);
      const token = await MindSphereServices.getMSTechnicalToken();
      const downloadURI = await MindSphereServices.getPackageDownloadURI(token, instanceId);
      let iemsDto = (await this.configService.downloadIems(userId, version, instanceId));

      /**
      * format to hal
      */
      // const halResource = new hal.Resource(iemsDto, `${host}${process.env.API_PREFIX}/v1/iems/${iemsDto.id}`);

      let halResource = new hal.Resource(iemsDto, `${host}${process.env.API_PREFIX}/v1/iems-download/${instanceId}`)
      halResource.link("downloadUri", downloadURI);
      halResource.link("iems", `${host}${process.env.API_PREFIX}/v1/iems/${iemsDto.id}`);

      responseBody.data.push(halResource);
      response.send(responseBody);
    } catch (e) {
      responseBody.errorMsg = String(e);
      response.send(responseBody);
    }
    return response;
  }

  @Get("/v1/firmwares/:iemsId/uri")
  async getFirmwareDownloadURI(@Req() request: Request, @HeaderParam("Account_Id") userId: number, @Res() response: Response) {
    let responseBody = new APIResponse();
    try {
      const host = request.get('host');
      const iemsId = (request.params.iemsId);
      const token = await MindSphereServices.getMSTechnicalToken();
      const iemsDto = await this.configService.getIemsById(iemsId);
      const downloadURI = await MindSphereServices.getPackageDownloadURI(token, iemsDto.iemsVmId);
      /**
     * format to hal
     */
      const halResource = new hal.Resource({}, `${host}${process.env.API_PREFIX}/v1/firmwares/${iemsId}/uri`);
      halResource.link("downloadUri", downloadURI);

      responseBody.data.push(halResource);

      response.send(responseBody);
    } catch (e) {
      responseBody.errorMsg = String(e);
      response.send(responseBody);
    }
    return response;
  }

  @Get("/v1/configurations/:resourceName/uri")
  async getIsoConfigDownloadURI(@Req() request: Request, @HeaderParam("Account_Id") userId: number, @Res() response: Response) {
    let responseBody = new APIResponse();
    try {
      const host = request.get('host');
      const resourceName = (request.params.resourceName);
      const downloadURI = await AWSServices.getSignedLink(resourceName, process.env.AWS_BUCKET, process.env.AWS_FA_BUCKET);

      /**
     * format to hal
     */
      const halResource = new hal.Resource({}, `${host}${process.env.API_PREFIX}/v1/configurations/${resourceName}/uri`);
      halResource.link("downloadUri", downloadURI);

      responseBody.data.push(halResource);

      // responseBody.data.push(uri);
      response.send(responseBody);
    } catch (e) {
      responseBody.errorMsg = String(e);
      response.send(responseBody);
    }
    return response;
  }

  @Get("/v1/firmwares")
  async getAvailableFirmwares(@Req() request: Request, @HeaderParam("Account_Id") userId: number, @Res() response: Response, @QueryParam("id") id: string) {
    let responseBody = new APIResponse();
    try {
      const host = request.get('host');
      const token = await MindSphereServices.getMSTechnicalToken();
      const availableFirmWare = await MindSphereServices.getAvailableFirmware(token, id);

      /**
       * format to hal
       */
      let halFirmwareList = [];
      availableFirmWare.forEach(element => {
        let halResource = new hal.Resource(element, `${host}${process.env.API_PREFIX}/v1/firmwares/${element.id}`);
        halFirmwareList.push(halResource);
      });
      let halResponse = new hal.Resource({}, `${host}${process.env.API_PREFIX}/v1/firmwares`)
      halResponse.embed("firmwares", halFirmwareList);

      responseBody.data.push(halResponse);
      response.send(responseBody);
    } catch (e) {
      responseBody.errorMsg = String(e);
      response.send(responseBody);
    }
    return response;
  }

  @Get("/v1/firmwares/:id")
  async getFirmwareById(@Req() request: Request, @HeaderParam("Account_Id") userId: number, @Res() response: Response) {
    let responseBody = new APIResponse();
    try {
      const host = request.get('host');
      const id = (request.params.id);
      const token = await MindSphereServices.getMSTechnicalToken();
      const availableFirmWare = await MindSphereServices.getAvailableFirmware(token, id);

      /**
       * format to hal
       */
      let halResource = new hal.Resource(availableFirmWare, `${host}${process.env.API_PREFIX}/v1/firmwares/${availableFirmWare.id}`);

      responseBody.data.push(halResource);
      response.send(responseBody);
    } catch (e) {
      responseBody.errorMsg = String(e);
      response.send(responseBody);
    }
    return response;
  }

  @Get("/v1/iems/:iemsId/configurations")
  async getAllByIemsId(@Req() request: Request, @Res() response: Response, @HeaderParam("Account_Id") userId: number) {
    let responseBody = new APIResponse();
    try {
      const host = request.get('host');
      const iemsId = String(request.params.iemsId);
      let configDtoList = await this.configService.getAllConfigByIems(userId, iemsId);

      /**
      * format to hal
      */
      let halConfigDtoList = [];
      configDtoList.forEach(element => {
        let halResource = new hal.Resource(element, `${host}${process.env.API_PREFIX}/v1/configurations/${element.id}`);
        halConfigDtoList.push(halResource);
      });
      let halResponse = new hal.Resource({}, `${host}${process.env.API_PREFIX}/v1/iems/${iemsId}/configurations`)
      halResponse.embed("configurations", halConfigDtoList);


      responseBody.data.push(halResponse);
      response.send(responseBody);
    } catch (e) {
      responseBody.errorMsg = String(e);
      response.send(responseBody);
    }
    return response;
  }
  
  @Post("/v1/iems/:iemsId/configurations")
  async post(@Req() request: Request, @HeaderParam("Account_Id") userId: number, @Body() body: IemsConfigurationDto, @Res() response: Response) {
    let responseBody = new APIResponse();
    try {
      const host = request.get('host');
      const iemsId = String(request.params.iemsId);
      let configDto = await this.configService.addConfiguration(body, userId, iemsId);
      // let halConfigDto = new hal.Resource(createdConfigDto, `${process.env.SERVER_IP}/${process.env.API_PREFIX}/v1/users/${userId}/configuration/${createdConfigDto.id}`);
      // responseBody.setData(halConfigDto);

      /**
      * format to hal
      */
      const halResource = new hal.Resource(configDto, `${host}${process.env.API_PREFIX}/v1/configurations/${configDto.id}`);
      responseBody.data.push(halResource);
      response.send(responseBody);
    } catch (e) {
      responseBody.errorMsg = String(e);
      response.send(responseBody);
    }
    return response;
  }

  @Get("/v1/transactions/iems")
  async getAllTransactions(@Req() request: Request, @HeaderParam("Account_Id") userId: number, @Res() response: Response, @QueryParam("id") id: string) {
    let responseBody = new APIResponse();
    try {
      const host = request.get('host');
      let vmConfigTransactionDtoList = await this.configService.getAllTransactions(userId, id);
      let halVmConfigTransactionDtoList = [];
      // vmConfigTransactionDtoList.forEach(element => {
      //   halVmConfigTransactionDtoList.push(new hal.Resource(element, `${process.env.SERVER_IP}/${process.env.API_PREFIX}/v1/users/${userId}/iems-transactions/downloads?id=${element.id}`));
      // });
      // responseBody.data = halVmConfigTransactionDtoList;
      /**
       * format to hal
       */
      vmConfigTransactionDtoList.forEach(element => {
        let halResource = new hal.Resource(element, `${host}${process.env.API_PREFIX}/v1/transactions/iems?id=${element.id}`);
        halVmConfigTransactionDtoList.push(halResource);
      });
      let halResponse;
      if (id) {
        halResponse = new hal.Resource({}, `${host}${process.env.API_PREFIX}/v1/transactions/iems?id=${id}`)
      } else {
        halResponse = new hal.Resource({}, `${host}${process.env.API_PREFIX}/v1/transactions/iems`);
      }
      halResponse.embed("transactions", halVmConfigTransactionDtoList);

      responseBody.data.push(halResponse);
      response.send(responseBody);
    } catch (e) {
      responseBody.errorMsg = String(e);
      response.send(responseBody);
    }
    return response;
  }

  @Get("/v1/iems")
  async getAllIems(@Req() request: Request, @HeaderParam("Account_Id") userId: number, @Res() response: Response) {
    let responseBody = new APIResponse();
    try {
      const host = request.get('host');
      let iemsDtoList = await this.configService.getAllIemsByUserId(userId);
      let halConfigDtoList = [];
      // iemsDtoList.forEach(element => {
      //   halConfigDtoList.push(new hal.Resource(element, `${process.env.SERVER_IP}/${process.env.API_PREFIX}/v1/iems/${element.id}`));
      // });

      /**
       * format to hal
       */
      iemsDtoList.forEach(element => {
        let halResource = new hal.Resource(element, `${host}${process.env.API_PREFIX}/v1/iems/${element.id}`);
        halConfigDtoList.push(halResource);
      });
      let halResponse = new hal.Resource({}, `${host}${process.env.API_PREFIX}/v1/iems`)
      halResponse.embed("iems", halConfigDtoList);

      responseBody.data.push(halResponse);
      response.send(responseBody);
    } catch (e) {
      responseBody.errorMsg = String(e);
      response.send(responseBody);
    }
    return response;
  }

  @Get("/v1/iems/:id")
  async getIemsById(@Req() request: Request, @HeaderParam("Account_Id") userId: number, @Param("id") id: string, @Res() response: Response) {
    let responseBody = new APIResponse();
    try {
      const host = request.get('host');
      let iemsDto = await this.configService.getIemsById(id);

      /**
       * format to hal
       */
      const halResource = new hal.Resource(iemsDto, `${host}${process.env.API_PREFIX}/v1/iems/${iemsDto.id}`);
      responseBody.data.push(halResource);
      response.send(responseBody);
    } catch (e) {
      responseBody.errorMsg = String(e);
      response.send(responseBody);
    }
    return response;
  }
}