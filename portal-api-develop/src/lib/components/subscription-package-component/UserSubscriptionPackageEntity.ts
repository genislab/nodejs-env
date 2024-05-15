/**
 *
 * Copyright (c) Mentor A Siemens Business. All rights reserved.
 */
import { Entity, Column, Timestamp, PrimaryColumn } from "typeorm";
import { BaseEntity } from "../base-componant/BaseEntity";

@Entity("user_subscription_package")
export class UserSubscriptionPackageEntity extends BaseEntity {

    @PrimaryColumn({ name: "id" })
    id: string;

    @Column({ name: "customer_id" })
    customerId: number;

    @Column({ name: "account_id" })
    accountId: number;

    @Column({ name: "user_id" })
    userId: number;

    @Column({ name: "subscription_package_id" })
    subscriptionPackageId: string;

    @Column({ name: "start_date" })
    startDate: number;

    @Column({ name: "expiration_date" })
    expirationDate: number;

    @Column({ name: "remaining_count" })
    deviceCountRemaining: number;

    @Column({ name: "auto_renewal_flg" })
    autoRenewal: boolean;
    
    @Column({ name: "ms_package_job_id" })
    msPackageJobId : string;

    @Column({ name: "ms_status" })
    msStatus : string;

    @Column({ name: "time_tag", type: "timestamp" })
    timeTag: Timestamp;

    constructor() {
        super();
    }

    createByAttributes(id?: string, userId?: number, subscriptionPackageId?: string, startDate?: number, expirationDate?: number, deviceCountRemaining?: number, autoRenewal?: boolean, msPackageJobId?: string, msStatus ?: string): void {
        if (id == "") { this.id = this.generateUUID(); }
        else { this.id = id }
        this.userId = userId;
        this.subscriptionPackageId = subscriptionPackageId;
        this.startDate = startDate;
        this.expirationDate = expirationDate;
        this.deviceCountRemaining = deviceCountRemaining;
        this.autoRenewal = autoRenewal;
        this.msPackageJobId = msPackageJobId;
        this.msStatus = msStatus;
    }

}
