/**
 *
 * Copyright (c) Mentor A Siemens Business. All rights reserved.
 */
import { BaseEntity } from "./BaseEntity";

export interface IBaseDTO {

    createByEntity(entity : BaseEntity):void ;

}