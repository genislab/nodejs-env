/**
 *
 * Copyright (c) Mentor A Siemens Business. All rights reserved.
 */
import { SubscriptionUserTransactionEntity } from './SubscriptionUserTransactionEntity';
import { IBaseDTO } from "../base-componant/IBaseDTO";
import { EnumValues } from 'enum-values';
import { TransactionEnum } from '../../enums/TransactionEnum';
import { UtilsService } from '../../utils/UtilsService';
import { IBaseTransactionDTO } from '../base-componant/IBaseTransactionDTO';

export class SubscriptionUserTransactionDto implements IBaseDTO, IBaseTransactionDTO {

    id: string;
    customerId: number;
    accountId: number;
    userId: number;
    transactionTypeId: number;
    transactionType: string;
    userSubPackageId: string;
    transactionDate: number;

    constructor() { }

    createByEntity(entity: SubscriptionUserTransactionEntity): void {
        this.id = entity.id;
        this.customerId = entity.customerId;
        this.accountId = entity.accountId;
        this.userId = entity.userId;
        this.transactionTypeId = entity.transactionTypeId;
        this.transactionType = EnumValues.getNameFromValue(TransactionEnum, this.transactionTypeId)
        this.userSubPackageId = entity.UserSubPackageId;
        this.transactionDate = entity.transactionDate;
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
        if (this.transactionTypeId == TransactionEnum.DECOMMISSION_PACKAGE)
            return this.formulatePackageDecomissionTransactionMessage();
        else if (this.transactionTypeId == TransactionEnum.PACKAGE_SUBSCRIPTION)
            return this.formulatePackageSubscriptionTransactionMessage();
    }
    private formulatePackageDecomissionTransactionMessage(): string {
        let message;
        message = `Decommission package took place,
                    for a subscription package ${this.userSubPackageId} ,
                    the package will not be auto-renewed
                    `
        return message;
    }

    private formulatePackageSubscriptionTransactionMessage(): string {
        let message;
        message = `Subscription transaction took place, for a subscription package ${this.userSubPackageId}`
        return message;
    }
}