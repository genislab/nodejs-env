/**
 *
 * Copyright (c) Mentor A Siemens Business. All rights reserved.
 */
import { IemsEntity } from './IemsEntity';
import { IBaseDTO } from "../base-componant/IBaseDTO";
import { IemsStateEnum } from "../../enums/IemsStateEnum";
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { Constants } from '../../utils/Constants';

export class IemsDto implements IBaseDTO {
    @IsNotEmpty({ message: Constants.valueEmpty })
    @IsString({ message: Constants.valueNotString })
    id: string;
    @IsString({ message: Constants.valueNotString })
    name: string;
    @IsNotEmpty({ message: Constants.valueEmpty })
    @IsNumber(null, { message: Constants.valueNotNumber })
    userId: number;
    customerId: number;
    accountId: number;
    @IsNotEmpty({ message: Constants.valueEmpty })
    @IsString({ message: Constants.valueNotString })
    iemsVmId: string;
    @IsNotEmpty({ message: Constants.valueEmpty })
    @IsString({ message: Constants.valueNotString })
    hostname: string;
    @IsNotEmpty({ message: Constants.valueEmpty })
    @IsString({ message: Constants.valueNotString })
    clientKey: string;
    @IsNotEmpty({ message: Constants.valueEmpty })
    @IsString({ message: Constants.valueNotString })
    clientSecret: string;
    state: IemsStateEnum;
    downloadURI: string;

    constructor() {

    }

    createByEntity(iemsEntity: IemsEntity) {
        this.id = iemsEntity.id;
        this.name = iemsEntity.name;
        this.userId = iemsEntity.userId;
        this.customerId = iemsEntity.customerId;
        this.accountId = iemsEntity.accountId;
        this.iemsVmId = iemsEntity.iemsVmId;
        this.hostname = iemsEntity.hostname;
        this.clientKey = iemsEntity.clientKey;
        this.clientSecret = iemsEntity.clientSecret;
        this.state = iemsEntity.state;
    }
}