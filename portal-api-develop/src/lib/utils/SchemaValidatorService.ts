/**
 *
 * Copyright (c) Mentor A Siemens Business. All rights reserved.
 */
import fs from 'fs';
import { Constants } from './Constants';
import { Formatter } from './Formatter';
export class SchemaValidatorService {
    schema: object;
    errMsg: string = '';
    constructor() {
    }
    loadSchema(schemaPath): void {
        this.schema = JSON.parse(fs.readFileSync(`${process.cwd()}/${schemaPath}`, { encoding: 'utf8' }));
    }
    // checks for mandatory only!!
    validate(confObject, schemaObj): boolean {
        let check = true;
        if (schemaObj['type'] === 'array') {
            if ( !(confObject instanceof Array) ) {
                this.errMsg = Formatter.format(Constants.invalidType, ['array', typeof confObject, JSON.stringify(confObject)]);
                return false;
            }
            // it's an array
            if ( confObject.length > schemaObj['max'] ) {
                this.errMsg = Formatter.format(Constants.maxArrayExceed, [schemaObj['max'], confObject.length, JSON.stringify(confObject)]);
                return false;
            }
            for (let key in confObject) {
                check = check && this.validate(confObject[key], schemaObj['items']);
            }
        } else if (schemaObj['type'] === 'object') {
            if ( !(confObject instanceof Object) ) {
                this.errMsg = Formatter.format(Constants.invalidType, ['object', typeof confObject, JSON.stringify(confObject)]);
                return false;
            }
            // it's an object
            for (let key in confObject) {
                if ( !schemaObj['properties'].hasOwnProperty(key) ) {
                    this.errMsg = Formatter.format(Constants.invalidKey, [key, JSON.stringify(confObject)]);
                    return false;
                }
                let index = schemaObj['required'].indexOf(key);
                if (index > -1) {
                    schemaObj['required'].splice(index, 1);
                }
                check = check && this.validate(confObject[key], schemaObj['properties'][key]);
            }
            if (schemaObj['required'].length > 0) {
                this.errMsg = Formatter.format(Constants.requiredKeyMissed, [schemaObj['required'], JSON.stringify(confObject)]);
                return false;
            }
        } else if (typeof confObject !== schemaObj['type']) {
            this.errMsg = Formatter.format(Constants.invalidType, [schemaObj['type'], typeof confObject, JSON.stringify(confObject)]);
            check = false;
        }
        return check;
    }

    validateConfiguration(confObject): string {
        this.errMsg = '';
        let schemaObj = JSON.parse(JSON.stringify(this.schema));
        if (! this.validate(confObject, schemaObj)) {
            return this.errMsg;
        }
        return '';
    }
}