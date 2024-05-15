/**
 *
 * Copyright (c) Mentor A Siemens Business. All rights reserved.
 */
import { TransactionEnum } from "../enums/TransactionEnum";


export abstract class UtilsService {

    static addDays(date: number, days: number) : number {
        let result = new Date(date);
        result.setDate(result.getDate() + days);
        return result.getTime();
      }

    static resolveTransactionTypeEnumValue(id: number) : string {
        return TransactionEnum[id];
      }
}