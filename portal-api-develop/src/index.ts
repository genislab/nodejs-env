/**
 *
 * Copyright (c) Mentor A Siemens Business. All rights reserved.
 */
import { ActivityController } from './lib/components/activities-component/ActivityController';
import body_parser from 'body-parser';
require('dotenv').config()
import "reflect-metadata"; 
import { IemsConfigurationController } from "./lib/components/iems-component/IemsConfigurationController";
import { createExpressServer } from 'routing-controllers';
import { createConnection } from "typeorm";
import { DeviceController } from "./lib/components/device-component/DeviceController";
import { SubscriptionController } from "./lib/components/subscription-package-component/SubscriptionController";
import { initializeTransactionalContext, patchTypeORMRepositoryWithBaseRepository } from 'typeorm-transactional-cls-hooked';
const express = require('express');
let server;
module.exports = (async () => {
    const cc = await createConnection().then(async connection => {
        console.log("Connected successfully to DB");
    }).catch
    (error => {
        console.log("error", error);
    });

    initializeTransactionalContext();
    patchTypeORMRepositoryWithBaseRepository();

     // create express app
    const app = createExpressServer({
        routePrefix: process.env.API_PREFIX,
        cors: true,
        controllers: [IemsConfigurationController, DeviceController, SubscriptionController, ActivityController] // we specify controllers we want to use

    });
    app.disable('etag');
    const swaggerUi = require('swagger-ui-express');
    const swaggerDocument = require('./swagger.json');

    app.use('/iemanager/api/v1/api-docs', function (req, res, next) {
        swaggerDocument.host = req.get('host');
        req.swaggerDoc = swaggerDocument;
        next();
    }, swaggerUi.serve, swaggerUi.setup());
    app.use(body_parser.json())
    app.use(body_parser.urlencoded({ extended: true }));
    app.use('/iemanager/resources/v1', express.static(`${process.cwd()}/src/bin/iems_configuration_builder/temp`));

    server = await app.listen(process.env.SERVER_PORT, function () {
        var host = server.address().address
        var port = server.address().port
        // gport = port;
        console.log("IEM server listening at http://%s:%s", host, port);
        console.log("SERVER_IP", process.env.SERVER_IP);
    })

    return server;
})();
