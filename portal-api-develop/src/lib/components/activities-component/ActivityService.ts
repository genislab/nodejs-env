/**
 *
 * Copyright (c) Mentor A Siemens Business. All rights reserved.
 */
import { IemsConfigurationService } from './../iems-component/IemsConfigurationService';
import { IemsConfigurationTransactionDto } from './../iems-component/IemsConfigurationTransactionDto';
import { DeviceService } from './../device-component/DeviceService';
import { ActivityDto } from './ActivityDto';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { DeviceTransactionDto } from '../device-component/DeviceTransactionDto';
import { SubscriptionUserTransactionDto } from '../subscription-package-component/SubscriptionUserTransactionDto';
import { SubscriptionService } from '../subscription-package-component/SubscriptionService';

export class ActivityService {
  iemsConfigurationService: IemsConfigurationService;
  deviceService: DeviceService;
  subscriptionService: SubscriptionService;
  constructor() {
    this.iemsConfigurationService = new IemsConfigurationService();
    this.deviceService = new DeviceService();
    this.subscriptionService = new SubscriptionService();
  }

  @Transactional()
  async getAllActivities(userId: number, dateFrom: number, dateTo: number, transactionType?: number): Promise<Array<ActivityDto>> {
    let activities = new Array<ActivityDto>();
    let iemsConfigurationActivities = new Array<IemsConfigurationTransactionDto>();
    let deviceActivities = new Array<DeviceTransactionDto>();
    let subscriptionTransaction = new Array<SubscriptionUserTransactionDto>();
    if (transactionType) {
      if (transactionType == 1) {
        iemsConfigurationActivities = await this.iemsConfigurationService.getAllTransactions(userId, null, dateFrom, dateTo);
      } else if (transactionType == 2) {
        deviceActivities = await this.deviceService.getTransactionsbyUserIdAndDecive(userId, dateFrom, dateTo);
      } else if (transactionType == 3) {
        subscriptionTransaction = await this.subscriptionService.getAllTransactions(userId, dateFrom, dateTo);
      }
    } else {
      iemsConfigurationActivities = await this.iemsConfigurationService.getAllTransactions(userId, null, dateFrom, dateTo);
      deviceActivities = await this.deviceService.getTransactionsbyUserIdAndDecive(userId, dateFrom, dateTo);
      subscriptionTransaction = await this.subscriptionService.getAllTransactions(userId, dateFrom, dateTo);
    }
    iemsConfigurationActivities.forEach(element => {
      let activity = new ActivityDto();
      activity.transactionId = element.getTransactionId();
      activity.transactionType = element.getTransactionType();
      activity.transactionDetails = element.getTransactionDetails();
      activity.transactionDate = element.getTransactionDate();
      activities.push(activity);
    });

    deviceActivities.forEach(element => {
      let activity = new ActivityDto();
      activity.transactionId = element.getTransactionId();
      activity.transactionType = element.getTransactionType();
      activity.transactionDetails = element.getTransactionDetails();
      activity.transactionDate = element.getTransactionDate();
      activities.push(activity);
    });

    subscriptionTransaction.forEach(element => {
      let activity = new ActivityDto();
      activity.transactionId = element.getTransactionId();
      activity.transactionType = element.getTransactionType();
      activity.transactionDetails = element.getTransactionDetails();
      activity.transactionDate = element.getTransactionDate();
      activities.push(activity);
    });

    return activities;
  }
}