/**
 *
 * Copyright (c) Mentor A Siemens Business. All rights reserved.
 */
import { BaseEntity } from "./BaseEntity";

export interface IBaseTransactionDTO {

    createByEntity(entity : BaseEntity):void ;
    getTransactionId():string ;
    getTransactionType():string ;
    getTransactionDate():number ;
    getTransactionDetails():string ;

}