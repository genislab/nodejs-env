/**
 *
 * Copyright (c) Mentor A Siemens Business. All rights reserved.
 */
import { IBaseDTO } from "../base-componant/IBaseDTO";
import { LicenceEntity } from "./LicenceEntity";
import { LicenceStatusEnum } from "../../enums/LicenceStatusEnum";


export class LicenceDto implements IBaseDTO {
    
    id: string;
    userSubscriptionPackageId : string;
    status: LicenceStatusEnum

    constructor(){
        
    }
    createByEntity(entity: LicenceEntity): void {
        this.id = entity.id;
        this.userSubscriptionPackageId =  entity.UserSubscriptionPackageId;
        this.status = entity.status;
    }

}