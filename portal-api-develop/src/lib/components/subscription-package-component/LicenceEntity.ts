/**
 *
 * Copyright (c) Mentor A Siemens Business. All rights reserved.
 */
import { Entity, PrimaryGeneratedColumn, Column, Timestamp, PrimaryColumn } from "typeorm";
import { BaseEntity } from "../base-componant/BaseEntity";
import { LicenceStatusEnum } from "../../enums/LicenceStatusEnum";


@Entity("license")
export class LicenceEntity extends BaseEntity {

    
    @PrimaryColumn({ name: "id" })
    id: string;
    @Column({ name: "user_subscription_package_id" })
    UserSubscriptionPackageId: string;
    @Column({ name: "status" })
    status: LicenceStatusEnum;
    @Column({ name: "time_tag", type: "timestamp" })
    timeTag: Timestamp;

    constructor() { 
        super();
    }

    createByAttributes(id?:string ,UserSubscriptionPackageId?: string, status?: LicenceStatusEnum): void {
        if (!id ||id == "") { this.id = this.generateUUID(); }
        else { this.id = id }
        this.UserSubscriptionPackageId = UserSubscriptionPackageId;
        this.status = status;
    }

}
