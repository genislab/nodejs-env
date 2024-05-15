/**
 *
 * Copyright (c) Mentor A Siemens Business. All rights reserved.
 */
import { IemsStateEnum } from '../../enums/IemsStateEnum';
import { Column, Entity, Timestamp, PrimaryColumn } from 'typeorm';
import { BaseEntity } from "../base-componant/BaseEntity";

@Entity("iems")
export class IemsEntity extends BaseEntity {


  constructor() {
    super();
  }


  @PrimaryColumn({ name: "id" })
  id: string;

  @Column({ name: "name" })
  name: string

  @Column({ name: "user_id" })
  userId: number;

  @Column({ name: "customer_id" })
  customerId: number;

  @Column({ name: "account_id" })
  accountId: number;

  @Column({ name: "iems_vm_image_id" })
  iemsVmId: string

  @Column({ name: "hostname" })
  hostname: string

  @Column({ name: "client_key" })
  clientKey: string

  @Column({ name: "client_secret" })
  clientSecret: string

  @Column({ name: "state" })
  state: IemsStateEnum

  @Column({ name: "time_tag", type: "timestamp" })
  timeTag: Timestamp;

  createByAttributes(id?: string, name?: string, userId?: number, customerId?: number, accountId?: number, iemsVmId?: string, hostname?: string, clientKey?: string, clientSecret?: string, state?: IemsStateEnum): void {
    // this.id = this.generateUUID();
    if (!id || id == "") { this.id = this.generateUUID(); }
    else { this.id = id }
    this.name = name;
    this.userId = userId;
    this.customerId = customerId;
    this.accountId = accountId;
    this.iemsVmId = iemsVmId;
    this.hostname = hostname;
    this.clientKey = clientKey;
    this.clientSecret = clientSecret;
    this.state = state;
  }

}