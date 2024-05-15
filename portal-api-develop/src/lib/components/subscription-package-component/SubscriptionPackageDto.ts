/**
 *
 * Copyright (c) Mentor A Siemens Business. All rights reserved.
 */
import { IBaseDTO } from "../base-componant/IBaseDTO";
import { SubscriptionPackageEntity } from "./SubscriptionPackageEntity";

export class SubscriptionPackageDto implements IBaseDTO {

    id: string;
    customerId : number;
    accountId: number;
    name : string;
    duration: number;
    quota: number;
    msPackageId : string;


    constructor(){  }

    createByEntity(entity: SubscriptionPackageEntity): void {
        this.id = entity.id;
        this.name = entity.name;
        this.duration = entity.duration;
        this.quota = entity.quota;
        this.msPackageId = entity.msPackageId;
    }

}