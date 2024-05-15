/**
 *
 * Copyright (c) Mentor A Siemens Business. All rights reserved.
 */
import { IBaseTransactionEntity } from './../base-componant/IBaseTransactionEntity';
import { Column, Entity, Timestamp, PrimaryColumn } from 'typeorm';
import { BaseEntity } from '../base-componant/BaseEntity';
import { UtilsService } from '../../utils/UtilsService';

@Entity("iems_transaction")
export class IemsConfigurationTransactionEntity extends BaseEntity implements IBaseTransactionEntity {

  constructor() { super() }

  @PrimaryColumn()
  id: string;

  @Column({ name: "user_id" })
  userId: number;

  @Column({ name: "customer_id" })
  customerId: number;

  @Column({ name: "account_id" })
  accountId: number;

  @Column({ name: "transaction_type_id" })
  transactionTypeId: number;

  @Column({ name: "iems_id" })
  iemsId: string;

  @Column({ name: "iems_config_id" })
  iemsConfigId: string;

  @Column({ name: "transaction_date" })
  transactionDate: number;

  @Column({ name: "time_tag", type: "timestamp" })
  timeTag: Timestamp;


  createByAttributes(userId?: number, customerId?: number, accountId?: number, transactionTypeId?: number, iemsId?: string, iemsConfigId?: string, transactionDate?: number): void {
    this.id = this.generateUUID();
    this.userId = userId;
    this.customerId = customerId;
    this.accountId = accountId;
    this.transactionTypeId = transactionTypeId;
    this.iemsId = iemsId;
    this.iemsConfigId = iemsConfigId;
    this.transactionDate = transactionDate;
  }
  
  // interface implementation
  getTransactionId(): string {
    return this.id;
  }
  getTransactionType(): string {
    return UtilsService.resolveTransactionTypeEnumValue(this.transactionTypeId);
  }
  getTransactionDate(): number {
    return this.transactionDate;
  }
  getTransactionDetails(): string {
    return `IEMS configuration transaction took plact for user with id ${this.userId} and configuration with id ${this.iemsConfigId}`;
  }
}