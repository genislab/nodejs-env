/**
 *
 * Copyright (c) Mentor A Siemens Business. All rights reserved.
 */
require('dotenv').config()
const execSync = require('child_process').execSync;

export class WindowsAdapter {
    generate(input: string, output: string) {
        let command = `${process.env.WIN_MKISO_PATH}\\mkisofs.exe -r -o ${output} ${input}`
        let res = execSync(command);
        console.log("res", res);
        return res;
    }
}