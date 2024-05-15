/**
 *
 * Copyright (c) Mentor A Siemens Business. All rights reserved.
 */
import { JsonController, Get, Req, Res, QueryParam, Param, Post, Body, HeaderParam } from "routing-controllers";
import { Request, Response } from "express";
import { APIResponse } from "../../utils/APIResponse";
import { DeviceService } from "./DeviceService";
import { DeviceDto } from "./DeviceDto";
import hal from 'hal';


@JsonController()
export class DeviceController {

  
  readonly deviceService = new DeviceService();
  constructor() {
  }
  
  @Get("/v1/iems/:iemsId/devices")
  async getAll(@Req() request: Request, @Res() response: Response, @HeaderParam("Account_Id") userId: number, @Param("iemsId") iemsId: string, @QueryParam("status") status: number) {
    let responseBody = new APIResponse();
    try {
      const host = request.get('host');
      let deviceDtoList = await this.deviceService.getDevicebyUserIdAndstatus(userId, iemsId, status);

      /**
     * format to hal
     */
      let halDeviceDtoList = [];
      deviceDtoList.forEach(element => {
        let halResource = new hal.Resource(element, `${host}${process.env.API_PREFIX}/v1/devices/${element.id}`);
        halDeviceDtoList.push(halResource);
      });
      let halResponse = new hal.Resource({}, `${host}${process.env.API_PREFIX}/v1/iems/${iemsId}/devices`)
      halResponse.embed("devices", halDeviceDtoList);


      responseBody.data = halResponse;
      response.send(responseBody);
    } catch (e) {
      responseBody.errorMsg = String(e);
      response.send(responseBody);
    }
    return response;
  }

  @Get("/v1/devices/:id")
  async getDeviceById(@Req() request: Request, @Res() response: Response, @HeaderParam("Account_Id") userId: number, @Param("id") id: string) {
    let responseBody = new APIResponse();
    try {
      const host = request.get('host');
      let deviceDto = await this.deviceService.getDeviceById(null, id);

      /**
     * format to hal
     */
      let halResource = new hal.Resource(deviceDto, `${host}${process.env.API_PREFIX}/v1/devices/${deviceDto.id}`);
      responseBody.data.push(halResource);
      response.send(responseBody);
    } catch (e) {
      responseBody.errorMsg = String(e);
      response.send(responseBody);
    }
    return response;
  }

  @Get("/v1/transactions/devices/:fromDate")
  async getTransactions(@Req() request: Request, @Res() response: Response, @HeaderParam("Account_Id") userId: number, @Param("fromDate") fromDate: number, @QueryParam("toDate") toDate: number) {
    let responseBody = new APIResponse();
    try {
      const host = request.get('host');
      let transactions = await this.deviceService.getTransactionsbyUserIdAndDecive(userId, fromDate, toDate);

      /**
      * format to hal
      */
      let halDeviceTransactionist = [];
      transactions.forEach(element => {
        let halResource = new hal.Resource(element, `${host}${process.env.API_PREFIX}/v1/device-transactions/${element.id}`);
        halDeviceTransactionist.push(halResource);
      });
      let halResponse = new hal.Resource({}, `${host}${process.env.API_PREFIX}/v1/transactions/devices/${fromDate}?toDate=${toDate}`)
      halResponse.embed("transactions", halDeviceTransactionist);

      responseBody.data.push(halResponse);
      response.send(responseBody);
    } catch (e) {
      responseBody.errorMsg = String(e);
      response.send(responseBody);
    }
    return response;
  }

  @Get("/v1/device-transactions/:id")
  async getTransactionsById(@Req() request: Request, @Res() response: Response, @HeaderParam("Account_Id") userId: number) {
    let responseBody = new APIResponse();
    try {
      const host = request.get('host');
      const id = (request.params.id);
      let transactionDto = await this.deviceService.getTransactionsbyId(id);

      /**
      * format to hal
      */
      const halResource = new hal.Resource(transactionDto, `${host}${process.env.API_PREFIX}/v1/device-transactions/${transactionDto.id}`);
      responseBody.data.push(halResource);
      response.send(responseBody);
    } catch (e) {
      responseBody.errorMsg = String(e);
      response.send(responseBody);
    }
    return response;
  }

  @Post("/v1/iems/:iemsId/devices/checkout")
  async onboarding(@Req() request: Request, @Body() device: DeviceDto, @Res() response: Response, @HeaderParam("Account_Id") userId: number, @Param("iemsId") iemsId: string) {
    let responseBody = new APIResponse();
    try {
      const host = request.get('host');
      let deviceTrans = await this.deviceService.onBoard(userId, iemsId, device);
      // responseBody.data.push(deviceTrans);
      /**
      * format to hal
      */
      let halResource = new hal.Resource(deviceTrans, `${host}${process.env.API_PREFIX}/v1/device-transactions/${deviceTrans.id}`);
      responseBody.data.push(halResource);
      response.send(responseBody);
    } catch (e) {
      responseBody.errorMsg = String(e);
      response.send(responseBody);
    }
    return response;
  }


  @Post("/v1/iems/:iemsId/devices/check-in")
  async offBoarding(@Req() request: Request, @Body() device: DeviceDto, @Res() response: Response, @HeaderParam("Account_Id") userId: number, @Param("iemsId") iemsId: string) {
    let responseBody = new APIResponse();
    try {
      const host = request.get('host');
      let deviceTrans = await this.deviceService.offBoard(userId, iemsId, device);
      /**
      * format to hal
      */
      let halResource = new hal.Resource(deviceTrans, `${host}${process.env.API_PREFIX}/v1/device-transactions/${deviceTrans.id}`);
      responseBody.data.push(halResource);
      response.send(responseBody);
    } catch (e) {
      responseBody.errorMsg = String(e);
      response.send(responseBody);
    }
    return response;
  }

  @Post("/v1/iems/:iemsId/devices/check-in-devices")
  async offBoardingAll(@Req() request: Request, @Res() response: Response, @HeaderParam("Account_Id") userId: number, @Param("iemsId") iemsId: string) {
    let responseBody = new APIResponse();
    try {
      const host = request.get('host');
      let deviceTransactions = await this.deviceService.offBoardAll(userId, iemsId);
      /**
      * format to hal
      */
      let halDeviceTransactionist = [];
      deviceTransactions.forEach(element => {
        let halResource = new hal.Resource(element, `${host}${process.env.API_PREFIX}/v1/device-transactions/${element.id}`);
        halDeviceTransactionist.push(halResource);
      });
      let halResponse = new hal.Resource({}, `${host}${process.env.API_PREFIX}/v1/iems/:iemsId/devices/check-in-devices`)
      halResponse.embed("transactions", halDeviceTransactionist);

      responseBody.data.push(halResponse);
      response.send(responseBody);
    } catch (e) {
      responseBody.errorMsg = String(e);
      response.send(responseBody);
    }
    return response;
  }


}

