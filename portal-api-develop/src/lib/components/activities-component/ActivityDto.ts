/**
 *
 * Copyright (c) Mentor A Siemens Business. All rights reserved.
 */
import { IBaseTransactionEntity } from './../base-componant/IBaseTransactionEntity';
import { IBaseDTO } from "../base-componant/IBaseDTO";

export class ActivityDto implements IBaseDTO {
  transactionId : string;
  transactionType: string;
  transactionDate: number;
  transactionDetails: string;

  constructor() {

  }

  createByEntity(activity: IBaseTransactionEntity) {
    this.transactionId = activity.getTransactionId();
    this.transactionType = activity.getTransactionType();
    this.transactionDate = activity.getTransactionDate();
    this.transactionDetails = activity.getTransactionDetails();
  }
}