/**
 *
 * Copyright (c) Mentor A Siemens Business. All rights reserved.
 */
import { Entity, PrimaryGeneratedColumn, Column, Timestamp, PrimaryColumn } from "typeorm";
import { BaseEntity } from "../base-componant/BaseEntity";
import { DeviceStatusEnum } from "../../enums/DeviceStatusEnum";

@Entity("ie_device")
export class DeviceEntity extends BaseEntity {

    @PrimaryColumn()
    id: string;

    @Column({ name: "serial_no" })
    serialNo: string;

    @Column({ name: "name" })
    name: string;

    @Column({ name: "iems_id" })
    iemsId: string;

    @Column({ name: "license_id" })
    licenseId: string;

    @Column({ name: "status", type: "int" })
    status: DeviceStatusEnum;

    @Column({ name: "time_tag", type: "timestamp" })
    timeTag: Timestamp;


    constructor() {
        super();
    }

    createByAttributes(id?: string, serialNo?: string, name?: string, iemsId?: string, licenseId?: string, status?: DeviceStatusEnum): void {
        if (!id || id == "") { this.id = this.generateUUID(); }
        else { this.id = id }
        this.serialNo = serialNo;
        this.iemsId = iemsId;
        this.name = name;
        this.licenseId = licenseId;
        this.status = status;
    }

}