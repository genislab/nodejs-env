/**
 *
 * Copyright (c) Mentor A Siemens Business. All rights reserved.
 */
import { v1 as uuid } from 'uuid';

export abstract class BaseEntity  {

    abstract createByAttributes():void;
    generateUUID():string {
        return uuid();
    }
}
