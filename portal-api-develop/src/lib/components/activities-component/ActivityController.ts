/**
 *
 * Copyright (c) Mentor A Siemens Business. All rights reserved.
 */
import { ActivityService } from './../activities-component/ActivityService';

import { Body, Get, Post, Req, Res, JsonController, QueryParam } from 'routing-controllers';
import { APIResponse } from '../../utils/APIResponse';
import { Response, Request } from 'express';
import hal from 'hal';
require('dotenv').config()

@JsonController("")
export class ActivityController {


  constructor() {
  }

  activityService = new ActivityService();

  @Get("/v1/activities")
  async getAll(@Req() request: Request, @Res() response: Response, @QueryParam("transaction-type") transactionType: number, @QueryParam("date-from") dateFrom: number, @QueryParam("date-to") dateTo: number) {
    let responseBody = new APIResponse();
    try {
      const userId = Number(request.headers['account_id']);
      const host = request.get('host');
      let activities = await this.activityService.getAllActivities(userId, dateFrom, dateTo, transactionType);
      /**
       * format to hal
       */
      // let halActivitiesList = [];
      // activities.forEach(element => {
      //   halActivitiesList.push(new hal.Resource(element, `${host}${process.env.API_PREFIX}/v1/activities/${element.transactionId}`));
      // });
      let halResponse = new hal.Resource({}, `${host}${process.env.API_PREFIX}/v1/activities`)
      halResponse.embed("activities", activities);
      responseBody.data.push(halResponse);
      response.send(responseBody);
    } catch (e) {
      responseBody.errorMsg = String(e);
      response.send(responseBody);
    }
    return response;
  }
}