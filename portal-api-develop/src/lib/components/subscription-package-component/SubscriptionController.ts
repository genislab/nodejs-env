/**
 *
 * Copyright (c) Mentor A Siemens Business. All rights reserved.
 */
import { JsonController, Post, Req, Res, Param, Body, Get, HeaderParam, QueryParam } from "routing-controllers";
import { SubscriptionPackageDto } from "./SubscriptionPackageDto";
import { APIResponse } from "../../utils/APIResponse";
import { SubscriptionService } from "./SubscriptionService";
import { Response, Request } from "express";
import hal from 'hal';



@JsonController()
export class SubscriptionController {

  constructor() {
  }

  subscriptionService = new SubscriptionService();

  @Post("/v1/purchasing-packages/:tenantId")
  async purchase(@Req() request: Request, @Body() body: SubscriptionPackageDto, @Res() response: Response, @HeaderParam("Account_Id") userId: number, @Param("tenantId") tenantId: string) {
    let responseBody = new APIResponse();
    try {
      const host = request.get('host');
      let transaction = await this.subscriptionService.purchase(userId, body.id, userId,userId, tenantId);
      /**
      * format to hal
      */
      let halResource = new hal.Resource(transaction, `${host}${process.env.API_PREFIX}/v1/subscription-transactions/${transaction.id}`);
      responseBody.data.push(halResource);
      response.send(responseBody);
    } catch (e) {
      responseBody.errorMsg = String(e);
      response.send(responseBody);
    }
    return response;
  }


  @Post("/v1/subscription-packages/:packageId/decommission/:tenantId")
  async decomission(@Req() request: Request, @Body() body: SubscriptionPackageDto, @Res() response: Response, @HeaderParam("Account_Id") userId: number, @Param("packageId") id: string, @Param("tenantId") tenantId: string) {
    let responseBody = new APIResponse();
    try {
      const host = request.get('host');
      let transaction = await this.subscriptionService.decommissionPackage(tenantId, id);
      /**
     * format to hal
     */
      let halResource = new hal.Resource(transaction, `${host}${process.env.API_PREFIX}/v1/subscription-transactions/${transaction.id}`);
      responseBody.data.push(transaction);
      response.send(responseBody);
    } catch (e) {
      responseBody.errorMsg = String(e);
      response.send(responseBody);
    }
    return response;
  }

  @Get("/v1/subscription-transactions/:id")
  async getSubscriptionTransactionById(@Req() request: Request, @Res() response: Response, @Param("id") id: string) {
    let responseBody = new APIResponse();
    try {
      const host = request.get('host');
      const transaction = await this.subscriptionService.getTransactionById(id);
      /**
       * format to hal
       */
      let halResource = new hal.Resource(transaction, `${host}${process.env.API_PREFIX}/v1/subscription-transactions/${transaction.id}`);
      responseBody.data.push(halResource);
      response.send(responseBody);
    } catch (e) {
      responseBody.errorMsg = String(e);
      response.send(responseBody);
    }
    return response;
  }

  @Get("/v1/subscription-packages")
  async getAll(@Req() request: Request, @Res() response: Response) {
    let responseBody = new APIResponse();
    try {
      const host = request.get('host');
      let packages = await this.subscriptionService.getAllPackages();

      /**
      * format to hal
      */
      let halSubscriptionPackagesList = [];
      packages.forEach(element => {
        let halResource = new hal.Resource(element, `${host}${process.env.API_PREFIX}/v1/subscription-packages/${element.id}`);
        halSubscriptionPackagesList.push(halResource);
      });
      let halResponse = new hal.Resource({}, `${host}${process.env.API_PREFIX}/v1/subscription-packages`)
      halResponse.embed("packages", halSubscriptionPackagesList);

      responseBody.data.push(halResponse);
      response.send(responseBody);
    } catch (e) {
      responseBody.errorMsg = String(e);
      response.send(responseBody);
    }
    return response;
  }

  @Get("/v1/subscription-packages/:id")
  async getSubscriptionPackageById(@Req() request: Request, @Res() response: Response, @Param("id") id: string) {
    let responseBody = new APIResponse();
    try {
      const host = request.get('host');
      const subscriptionPackage = await this.subscriptionService.getPackageById(id);
      /**
       * format to hal
       */
      let halResource = new hal.Resource(subscriptionPackage, `${host}${process.env.API_PREFIX}/v1/subscription-packages/${subscriptionPackage.id}`);
      responseBody.data.push(halResource);
      response.send(responseBody);
    } catch (e) {
      responseBody.errorMsg = String(e);
      response.send(responseBody);
    }
    return response;
  }

  @Get("/v1/user-subscription-packages")
  async getByUserId(@Req() request: Request, @Res() response: Response, @HeaderParam("Account_Id") userId: number, @QueryParam("date-from") dateFrom: number, @QueryParam("date-to") dateTo: number) {
    let responseBody = new APIResponse();
    try {
      const host = request.get('host');
      let packages = await this.subscriptionService.getSubscripedPackagesByUserId(userId, dateFrom, dateTo);

      /**
      * format to hal
      */
      let halUserSubscriptionPackagesList = [];
      packages.forEach(element => {
        let halResource = new hal.Resource(element, `${host}${process.env.API_PREFIX}/v1/user-subscription-packages/${element.id}`);
        halUserSubscriptionPackagesList.push(halResource);
      });
      let halResponse = new hal.Resource({}, `${host}${process.env.API_PREFIX}/v1/user-subscription-packages`)
      halResponse.embed("packages", halUserSubscriptionPackagesList);

      responseBody.data.push(halResponse);
      response.send(responseBody);
    } catch (e) {
      responseBody.errorMsg = String(e);
      response.send(responseBody);
    }
    return response;
  }

  @Get("/v1/user-subscription-packages/:id")
  async getUserSubscriptionPackageById(@Req() request: Request, @Res() response: Response, @HeaderParam("Account_Id") userId: number, @Param("id") id: string) {
    let responseBody = new APIResponse();
    try {
      const host = request.get('host');
      let userSubscribedpackage = await this.subscriptionService.getUserSubscripedPackageById(id);
      /**
       * format to hal
       */
      let halResource = new hal.Resource(userSubscribedpackage, `${host}${process.env.API_PREFIX}/v1/user-subscription-packages/${userSubscribedpackage.id}`);
      responseBody.data.push(halResource);
      response.send(responseBody);
    } catch (e) {
      responseBody.errorMsg = String(e);
      response.send(responseBody);
    }
    return response;
  }


}