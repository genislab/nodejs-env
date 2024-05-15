/**
 *
 * Copyright (c) Mentor A Siemens Business. All rights reserved.
 */
import { IBaseTransactionEntity } from './../base-componant/IBaseTransactionEntity';
import { Entity, PrimaryGeneratedColumn, Column, Timestamp, PrimaryColumn } from "typeorm";
import { BaseEntity } from "../base-componant/BaseEntity";
import { UtilsService } from '../../utils/UtilsService';



@Entity("ie_device_transaction")
export class DeviceTransactionEntity extends BaseEntity implements IBaseTransactionEntity {

    @PrimaryColumn({ name: "id" })
    id: string;

    @Column({ name: "customer_id" })
    customerId: number;

    @Column({ name: "account_id" })
    accountId: number;

    @Column({ name: "user_id" })
    userId: number;

    @Column({ name: "transaction_type_id" })
    transactionTypeId: number;

    @Column({ name: "ie_device_id" })
    ieDeviceId: string;

    @Column({ name: "license_id" })
    licenseId: string;

    @Column({ name: "transaction_date" })
    transactionDate: number;

    @Column({ name: "time_tag", type: "timestamp" })
    timeTag: Timestamp;

    constructor() {
        super();
    }

    createByAttributes(customerId?: number, accountId?: number, userId?: number, transactionTypeId?: number, ieDeviceId?: string, licenseId?: string, details?: string, transactionDate?: number): void {
        this.id = this.generateUUID();
        this.customerId = customerId;
        this.accountId = accountId;
        this.userId = userId;
        this.transactionTypeId = transactionTypeId;
        this.ieDeviceId = ieDeviceId;
        this.licenseId = licenseId;
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
        return `Device transaction took place for user with id ${this.userId} and device with id ${this.ieDeviceId} and license with id ${this.licenseId}`;
    }

}