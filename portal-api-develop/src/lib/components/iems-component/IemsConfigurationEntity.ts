/**
 *
 * Copyright (c) Mentor A Siemens Business. All rights reserved.
 */
import { Column, Entity, Timestamp, PrimaryColumn } from 'typeorm';
import { BaseEntity } from '../base-componant/BaseEntity';

@Entity("iems_config")
export class IemsConfigurationEntity extends BaseEntity {

  constructor() {
    super();
  }

  @PrimaryColumn()
  id: string;

  @Column({ name: "iems_id" })
  iemsId: string;


  @Column({ name: "meta_data" })
  metaData: string;


  @Column({ name: "version" })
  version: number;

  @Column({ name: "physical_resource_name" })
  physicalResourceName: string;

  @Column({ name: "date" })
  date: number;

  @Column({ name: "time_tag", type: "timestamp" })
  timeTag: Timestamp;


  createByAttributes(iemsId?: string, metadata?: string, version?: number, physicalResourceName?: string, date?: number): void {
    this.id = this.generateUUID();
    this.iemsId = iemsId;
    this.metaData = metadata;
    this.version = version;
    this.physicalResourceName = physicalResourceName;
    this.date = date;
  }

}