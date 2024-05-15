/**
 *
 * Copyright (c) Mentor A Siemens Business. All rights reserved.
 */
import { ConfigurationBuilder } from "./ConfigurationBuilder";

(async () => {
    try {
       
        let configurationBuilder = ConfigurationBuilder.getInstance();
        let config = "test";
        const generatedIsoPath = await configurationBuilder.build(config);
        console.log(generatedIsoPath);
    } catch (e) {
        // Deal with the fact the chain failed
        console.log("error", e)
    }
})();