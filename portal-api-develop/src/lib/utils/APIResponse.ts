/**
 *
 * Copyright (c) Mentor A Siemens Business. All rights reserved.
 */

export class APIResponse {

    constructor(){
        
    }

    data : Array<any> = [];
    errorMsg : string;

    setData(data : any ){
        this.data = data;
    }
}