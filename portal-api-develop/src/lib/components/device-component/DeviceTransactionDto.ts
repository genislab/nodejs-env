/**
 *
 * Copyright (c) Mentor A Siemens Business. All rights reserved.
 */
import { IBaseDTO } from "../base-componant/IBaseDTO";
import { DeviceTransactionEntity } from "./DeviceTransactionEntity";
import { EnumValues } from 'enum-values';
import { TransactionEnum } from "../../enums/TransactionEnum";
import { UtilsService } from "../../utils/UtilsService";
import { IBaseTransactionDTO } from "../base-componant/IBaseTransactionDTO";

export class DeviceTransactionDto implements IBaseDTO, IBaseTransactionDTO {

    id: string;
    customerId: number;
    accountId: number;
    userId: number;
    transactionTypeId: number;
    transactionType: string;
    ieDeviceId: string;
    licenceId: string;
    transactionDate: number;

    constructor() { }

    createByEntity(entity: DeviceTransactionEntity): void {
        this.id = entity.id;
        this.userId = entity.userId;
        this.transactionTypeId = entity.transactionTypeId;
        this.transactionType = EnumValues.getNameFromValue(TransactionEnum, this.transactionTypeId)
        this.ieDeviceId = entity.ieDeviceId;
        this.licenceId = entity.licenseId;
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
        if (this.transactionTypeId == TransactionEnum.OFFBOARDING_DEVICE)
            return this.formulateCheckinTransactionMessage();
        else
            return this.formulateCheckOutTransactionMessage();
    }

    private formulateCheckinTransactionMessage(): string {
        let message;
        message = `License checkin transaction took place ,
                    for an industrial edge device ${this.ieDeviceId}
                    `
        return message;
    }

    private formulateCheckOutTransactionMessage(): string {
        let message;
        message = `License checkout transaction took place, for an industrial edge device ${this.ieDeviceId}, using lincense ${this.licenceId}`
        return message;
    }

}