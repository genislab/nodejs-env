/**
 *
 * Copyright (c) Mentor A Siemens Business. All rights reserved.
 */
import { IBaseDTO } from "../base-componant/IBaseDTO";
import { UserSubscriptionPackageEntity } from "./UserSubscriptionPackageEntity";
import { Constants } from "../../utils/Constants";
import { IsNotEmpty, IsString, IsOptional, IsNumber } from "class-validator";


export class UserSubscriptionPackageDto implements IBaseDTO {

    id: string;
    customerId: number;
    accountId: number;
    userId: number;
    @IsString({ message: Constants.valueNotString })
    @IsNotEmpty({ message: Constants.valueEmpty })
    subscriptionPackageId: string;
    @IsOptional()
    @IsNumber(null, { message: Constants.valueNotNumber })
    startDate: number;
    @IsOptional()
    @IsNumber(null, { message: Constants.valueNotNumber })
    expirationDate: number;
    @IsOptional()
    @IsNumber(null, { message: Constants.valueNotNumber })
    deviceCountRemaining: number;
    @IsOptional()
    @IsNumber(null, { message: Constants.valueNotNumber })
    packageQuota: number;
    @IsOptional()
    @IsString({ message: Constants.valueNotString })
    packageName: string;
    autoRenewal: boolean;
    msPackageJobId : string;
    msStatus : string;

    constructor() { }

    creatByAttribuites(userId: number, customerId: number, accountId: number, subscriptionPackageId: string, startDate: number, expirationDate: number, deviceCountRemaining: number, autoRenewal: boolean, msPackageJobId?: string, msStatus ?: string) {

        this.userId = userId;
        this.customerId = customerId;
        this.accountId = accountId;
        this.subscriptionPackageId = subscriptionPackageId;
        this.startDate = startDate;
        this.expirationDate = expirationDate;
        this.deviceCountRemaining = deviceCountRemaining;
        this.autoRenewal = autoRenewal;
        this.msPackageJobId = msPackageJobId || "";
        this.msStatus = msStatus || "";

    }

    createByEntity(entity: UserSubscriptionPackageEntity) {
        this.id = entity.id;
        this.userId = entity.userId;
        this.customerId = entity.customerId;
        this.accountId = entity.accountId;
        this.subscriptionPackageId = entity.subscriptionPackageId;
        this.startDate = entity.startDate;
        this.expirationDate = entity.expirationDate;
        this.deviceCountRemaining = entity.deviceCountRemaining;
        this.autoRenewal = entity.autoRenewal;
        this.msPackageJobId = entity.msPackageJobId;
        this.msStatus = entity.msStatus;
    }

}