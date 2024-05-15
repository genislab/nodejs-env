/**
 *
 * Copyright (c) Mentor A Siemens Business. All rights reserved.
 */
import { BaseEntity } from "./BaseEntity";

export interface IBaseTransactionEntity extends BaseEntity {

    getTransactionId():string ;
    getTransactionType():string ;
    getTransactionDate():number ;
    getTransactionDetails():string ;

}