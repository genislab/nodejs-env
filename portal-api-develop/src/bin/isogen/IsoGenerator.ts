/**
 *
 * Copyright (c) Mentor A Siemens Business. All rights reserved.
 */
import mkiso from 'mkiso';
import { WindowsAdapter } from "./WindowsAdapter";

export class IsoGenerator {
    private static instance: IsoGenerator;
    private windowsAdapter: WindowsAdapter;
    private constructor() {
        this.windowsAdapter = new WindowsAdapter();
    }

    public static getInstance(): IsoGenerator {
        if (!IsoGenerator.instance) {
            IsoGenerator.instance = new IsoGenerator();
        }
        return IsoGenerator.instance;
    }
    public async generate(directoryPath, outputIsoPath) {
        try {
            const isWin = process.platform === "win32";
            let result;
            if (isWin) {
                result = this.windowsAdapter.generate(directoryPath, outputIsoPath);
            } else {
                result = await mkiso(directoryPath)
                    .output(outputIsoPath)
                    .exec();
            }
            return result;
        }
        catch (err) {
            console.log('Error: ', err.message);
        }
    }
}