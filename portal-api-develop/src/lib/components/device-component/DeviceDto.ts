/**
 *
 * Copyright (c) Mentor A Siemens Business. All rights reserved.
 */
import { IBaseDTO } from "../base-componant/IBaseDTO";
import { DeviceEntity } from "./DeviceEntity";
import { DeviceStatusEnum } from "../../enums/DeviceStatusEnum";
import { IsString, IsOptional, IsNotEmpty } from "class-validator";
import { Constants } from "../../utils/Constants";



export class DeviceDto implements IBaseDTO {

    id :string;
    @IsString({ message: Constants.valueNotString })
    @IsNotEmpty({ message: Constants.valueEmpty })
    serialNo: string;
    @IsOptional()
    @IsString({ message: Constants.valueNotString })
    name: string;
    @IsOptional()
    @IsString({ message: Constants.valueNotString })
    iemsId : string;
    @IsOptional()
    @IsString({ message: Constants.valueNotString })
    licenseId:string;
    licenseStatus : string;
    status: DeviceStatusEnum;
 

    constructor(){

    }

    createByEntity(entity: DeviceEntity): void {
        this.id = entity.id;
        this.serialNo = entity.serialNo;
        this.name = entity.name;
        this.iemsId = entity.iemsId;
        this.licenseId = entity.licenseId;
        this.status = entity.status;
    }


}