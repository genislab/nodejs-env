/**
 *
 * Copyright (c) Mentor A Siemens Business. All rights reserved.
 */
import { Entity, Column, Timestamp, PrimaryColumn } from "typeorm";
import { BaseEntity } from "../base-componant/BaseEntity";


@Entity("subscription_package")
export class SubscriptionPackageEntity extends BaseEntity {

    @PrimaryColumn({ name: "id" })
    id: string;

    @Column({ name: "name" })
    name: string;

    @Column({ name: "ms_package_id" })
    msPackageId: string;

    @Column({ name: "offer_expiration" })
    offerExpiration: number;

    @Column({ name: "duration" })
    duration: number;

    @Column({ name: "quota" })
    quota: number;

    @Column({ name: "time_tag", type: "timestamp" })
    timeTag: Timestamp;

    constructor() {
        super();
    }

    createByAttributes(msPackageId ?:string, name?: string,offerExpiration ?: number, duration?: number, quota?: number): void {
        
        this.id = this.generateUUID();
        this.name = name;
        this.msPackageId = msPackageId;
        this.offerExpiration = offerExpiration;
        this.duration = duration;
        this.quota = quota;
    }

}