/**
 *
 * Copyright (c) Mentor A Siemens Business. All rights reserved.
 */
import { IBaseTransactionDTO } from './../base-componant/IBaseTransactionDTO';
import { IBaseDTO } from "../base-componant/IBaseDTO";
import { IemsConfigurationTransactionEntity } from "./IemsConfigurationTransactionEntity";
import { UtilsService } from '../../utils/UtilsService';
import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { Constants } from '../../utils/Constants';
import { EnumValues } from 'enum-values';
import { TransactionEnum } from '../../enums/TransactionEnum';

export class IemsConfigurationTransactionDto implements IBaseDTO, IBaseTransactionDTO {
    @IsNotEmpty({ message: Constants.valueEmpty })
    @IsString({ message: Constants.valueNotString })
    id: string;
    @IsNotEmpty({ message: Constants.valueEmpty })
    @IsNumber(null, { message: Constants.valueNotNumber })
    userId: number;
    customerId: number;
    accountId: number;
    @IsNotEmpty({ message: Constants.valueEmpty })
    @IsNumber(null, { message: Constants.valueNotNumber })
    transactionTypeId: number;
    transactionType: string;
    @IsNotEmpty({ message: Constants.valueEmpty })
    @IsString({ message: Constants.valueNotString })
    iemsId: string;
    @IsNotEmpty({ message: Constants.valueEmpty })
    @IsString({ message: Constants.valueNotString })
    iemsConfigId: string;
    @IsOptional()
    @IsString({ message: Constants.valueNotString })
    iemsHostname: string;
    @IsNumber(null, { message: Constants.valueNotNumber })
    transactionDate: number;

    constructor() {

    }

    createByEntity(iemsConfigurationTransaction: IemsConfigurationTransactionEntity) {
        this.id = iemsConfigurationTransaction.id;
        this.userId = iemsConfigurationTransaction.userId;
        this.customerId = iemsConfigurationTransaction.customerId;
        this.accountId = iemsConfigurationTransaction.accountId;
        this.transactionTypeId = iemsConfigurationTransaction.transactionTypeId;
        this.transactionType = EnumValues.getNameFromValue(TransactionEnum, this.transactionTypeId)
        this.iemsId = iemsConfigurationTransaction.iemsId;
        this.iemsConfigId = iemsConfigurationTransaction.iemsConfigId;
        this.transactionDate = iemsConfigurationTransaction.transactionDate;
    }

    // interface implementation
    getTransactionId(): string {
        return this.id;
    }
    getTransactionType(): string {
        return UtilsService.resolveTransactionTypeEnumValue(this.transactionTypeId);
    }
    getTransactionDate(): number {
        return this.transactionDate;
    }
    getTransactionDetails(): string {
        let message;
        const dateString = (new Date(Number(this.transactionDate))).toDateString();
        message = `IEMS download transaction took place, for an IEMS instance ${this.iemsId}, and configuration ${this.iemsConfigId}`
        return message;
    }
}