/**
 *
 * Copyright (c) Mentor A Siemens Business. All rights reserved.
 */
import { IBaseTransactionEntity } from './../base-componant/IBaseTransactionEntity';

import { Entity, Column, Timestamp, PrimaryColumn } from "typeorm";
import { BaseEntity } from "../base-componant/BaseEntity";
import { UtilsService } from '../../utils/UtilsService';

@Entity("user_subscription_transaction")
export class SubscriptionUserTransactionEntity extends BaseEntity implements IBaseTransactionEntity {
    @PrimaryColumn({name:"id"})
    id: string;

    @Column({ name: "customer_id" })
    customerId: number;

    @Column({ name: "account_id" })
    accountId: number;

    @Column({ name: "user_id" })
    userId: number;

    @Column({ name: "transaction_type_id" })
    transactionTypeId: number;

    @Column({ name: "user_subscription_package_id" })
    UserSubPackageId: string;

    @Column({ name: "transaction_date" })
    transactionDate: number;

    @Column({ name: "time_tag", type: "timestamp" })
    timeTag: Timestamp;


    constructor() {
        super();
    }

    createByAttributes(customerId?: number, accountId?: number, userId?: number, transactionType?: number, userSubPackageId?: string, transactionDate?: number): void {
        this.id = this.generateUUID();
        this.userId = userId;
        this.transactionTypeId = transactionType;
        this.UserSubPackageId = userSubPackageId;
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
        return `Subscription user transaction took place for user with id ${this.userId} and a package with id ${this.UserSubPackageId}`;
    }
}