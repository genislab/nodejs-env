/**
 *
 * Copyright (c) Mentor A Siemens Business. All rights reserved.
 */
import { IsoGenerator } from "../isogen/IsoGenerator"
import fs from 'fs';

export class ConfigurationBuilder {
    private static instance: ConfigurationBuilder;
    private isoGenerator: IsoGenerator;
    private rootDir = `${process.cwd()}/src/bin/iems_configuration_builder/temp`;
    private constructor() {
        if (!fs.existsSync(this.rootDir)) {
            fs.mkdirSync(this.rootDir);
        }
        this.isoGenerator = IsoGenerator.getInstance();
    }

    public static getInstance(): ConfigurationBuilder {
        if (!ConfigurationBuilder.instance) {
            ConfigurationBuilder.instance = new ConfigurationBuilder();
        }
        return ConfigurationBuilder.instance;
    }
    public async build(configuration: string) {
        const uuidv1 = require('uuid/v1');
        const fileName = uuidv1();
        const tempDir = `${process.cwd()}/src/bin/iems_configuration_builder/temp/${fileName}`
        const path = `${tempDir}/${fileName}.json`;
        const isoPath = `${process.cwd()}/src/bin/iems_configuration_builder/temp/${fileName}.iso`
        fs.mkdirSync(tempDir);
        fs.writeFile(path, configuration, (err) => {
            if (err) throw err;

            // success case, the file was saved
            console.log('configuration saved!');
        });

        const result = await this.isoGenerator.generate(tempDir, isoPath);
        console.log(result);
        return `${fileName}.iso`;
    }
}
