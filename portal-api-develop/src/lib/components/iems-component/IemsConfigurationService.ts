/**
 *
 * Copyright (c) Mentor A Siemens Business. All rights reserved.
 */
import { AWSServices } from './../../utils/AWSServices';
import { IemsDto } from './IemsDto';
import { IemsEntity } from './IemsEntity';
import { getManager } from "typeorm";
import { IemsConfigurationDao } from "./IemsConfigurationDao";
import { IemsConfigurationDto } from "./IemsConfigurationDto";
import { IemsConfigurationEntity } from "./IemsConfigurationEntity";
import { IemsConfigurationTransactionDto } from "./IemsConfigurationTransactionDto";
import { ConfigurationBuilder } from "../../../bin/iems_configuration_builder/ConfigurationBuilder";
import { VMConfigurationTransactionDao } from "./IemsConfigurationTransactionDao";
import { TransactionEnum } from "../../enums/TransactionEnum";
import { IemsDao } from './IemsDao';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { IemsConfigurationTransactionEntity } from './IemsConfigurationTransactionEntity';
import { SchemaValidatorService } from '../../utils/SchemaValidatorService';
import { Constants } from '../../utils/Constants';

export class IemsConfigurationService {
    configurationBuilder: ConfigurationBuilder;
    schemaValidatorService: SchemaValidatorService;
    readonly configDao = getManager().getCustomRepository(IemsConfigurationDao);
    readonly iemsDao = getManager().getCustomRepository(IemsDao);
    readonly vmConfigurationTransactionDao = getManager().getCustomRepository(VMConfigurationTransactionDao);


    constructor() {
        this.configurationBuilder = ConfigurationBuilder.getInstance();
        this.schemaValidatorService = new SchemaValidatorService();
        
        const schemaPath = `schemas/confSchema.json`;
        this.schemaValidatorService.loadSchema(schemaPath);
    }

    @Transactional()
    async getAllConfig(userId?: number, id?: string): Promise<Array<IemsConfigurationDto>> {

        let configs: IemsConfigurationEntity[];
        if (id)
            configs = await this.configDao.getConfigurationbyUserIdAndConfigurationId(userId, id);
        else {
            const iemsIdList = await this.getAllIemsIdsByUserId(userId);
            configs = await this.configDao.getConfigurationbyUserIdAndConfigurationId(userId, id, iemsIdList);
        }

        let configDtoList = new Array<IemsConfigurationDto>();
        configs.forEach(function (element) {
            let dto = new IemsConfigurationDto();
            dto.createByEntity(element);
            configDtoList.push(dto)
        });
        return configDtoList;
    }

    @Transactional()
    async getAllIemsIdsByUserId(userId?: number): Promise<Array<string>> {
        let iemsEntitiesHoldingIds = await this.iemsDao.getIemsIdsByUserId(userId);
        let ids = []
        iemsEntitiesHoldingIds.forEach(element => {
            ids.push(element.id);
        });
        return ids;
    }

    @Transactional()
    async getAllIemsByUserId(userId?: number): Promise<Array<IemsDto>> {
        let iemsList = await this.iemsDao.getIemsByUserId(userId);
        let iemsDtoList = new Array<IemsDto>();
        iemsList.forEach(function (element) {
            let dto = new IemsDto();
            dto.createByEntity(element);
            iemsDtoList.push(dto)
        });
        return iemsDtoList;
    }

    @Transactional()
    async getIemsById(id: string): Promise<IemsDto> {
        let iemses = await this.iemsDao.getIemsById(id);
        if (!iemses || iemses.length == 0) {
            throw new Error(Constants.noIemsFound);
        }
        let iems = iemses[0];
        let iemsDto = new IemsDto();
        iemsDto.createByEntity(iems);
        return iemsDto;
    }

    @Transactional()
    async getMaxConfigurationVersionPerIems(iemsId: string): Promise<number> {
        return await this.configDao.getMaxConfigurationVersion(iemsId);
    }

    @Transactional()
    async getAllConfigByIems(userId?: number, iemsId?: string): Promise<Array<IemsConfigurationDto>> {
        if (!iemsId) {
            return this.getAllConfig(userId);
        } else {
            let configs = await this.configDao.getConfigurationbyUserIdAndIemsId(userId, iemsId);
            let configDtoList = new Array<IemsConfigurationDto>();
            configs.forEach(function (element) {
                let dto = new IemsConfigurationDto();
                dto.createByEntity(element);
                configDtoList.push(dto)
            });

            return configDtoList;
        }
    }

    @Transactional()
    async downloadIems(userId?: number, version?: number, instanceId?: string): Promise<IemsDto> {
        // start
        const iems = new IemsEntity();
        // fake implementation
        iems.createByAttributes(
            "",
            "test",
            userId,
            userId,
            userId,
            instanceId,
            "iems.mentor.io",
            "ZYDPLLBWSK3MVQJSIYHB1OR2JXCY0X2C5UJ2QAR2MAAIT5Q",
            "YXBpVXJsOiAiaHR0cHM6Ly9teS5hcGkuY29tL2FwaS92MSIKdXNlcm5hbWU6IHt7dXNlcm5hbWV9fQpwYXNzd29yZDoge3twYXNzd29yZH19",
            1
        );
        const newIems = this.iemsDao.create(iems)
        const createdIems = new IemsDto();
        createdIems.createByEntity(await this.iemsDao.save(newIems));
        // end
        return createdIems;
    }

    @Transactional()
    async addConfiguration(configDto: IemsConfigurationDto, userId: number, iemsId: string): Promise<IemsConfigurationDto> {
        let configObject = configDto.metadata;
        let confValidation = this.schemaValidatorService.validateConfiguration(configObject);
        if (confValidation !== '') {
            throw new Error(confValidation);
        }
        configObject["iemsId"] = iemsId;
        const generatedIsoPath = await this.configurationBuilder.build(JSON.stringify(configObject));
        // const generatedIsoPath = await this.configurationBuilder.build(JSON.stringify(configDto.metadata));
        const fullGeneratedIsoPath = `${process.cwd()}/src/bin/iems_configuration_builder/temp/${generatedIsoPath}`;
        await AWSServices.uploadFile(fullGeneratedIsoPath, generatedIsoPath, process.env.AWS_BUCKET, process.env.AWS_FA_BUCKET);
        const configuration = new IemsConfigurationEntity();
        const maxVersion = await this.getMaxConfigurationVersionPerIems(iemsId);
        configuration.createByAttributes(iemsId, JSON.stringify(configDto.metadata), maxVersion + 1, generatedIsoPath, Date.now());
        const newConfig = this.configDao.create(configuration)
        const createdConfig = new IemsConfigurationDto();
        createdConfig.createByEntity(await this.configDao.save(newConfig));
        const transaction = new IemsConfigurationTransactionDto();
        transaction.iemsConfigId = newConfig.id;
        transaction.transactionTypeId = TransactionEnum.IEMS_CONFIGURATION_TRANSACTION;
        transaction.userId = userId;
        transaction.accountId = userId;
        transaction.customerId = userId;
        transaction.iemsId = iemsId;
        await this.addTransaction(transaction);

        const iems = await this.getIemsById(iemsId);
        this.updateIemsWithConfigurations(configDto.metadata, iems);

        //
        const iemsEntity = new IemsEntity();
        // fake implementation
        iemsEntity.createByAttributes(
            iems.id,
            iems.name,
            iems.userId,
            iems.customerId,
            iems.accountId,
            iems.iemsVmId,
            iems.hostname,
            iems.clientKey,
            iems.clientSecret,
            iems.state
        );
        const newIems = this.iemsDao.create(iemsEntity)
        await this.iemsDao.save(newIems);
        //

        return createdConfig;
    }

    private updateIemsWithConfigurations(configurations, iems) {
        if (configurations.hostname)
            iems.hostname = configurations.hostname;
    }
    @Transactional()
    async getAllTransactions(userId?: number, id?: string, dateFrom?: number, dateTo?: number): Promise<Array<IemsConfigurationTransactionDto>> {
        let transactions = await this.vmConfigurationTransactionDao.getTransactionbyUserIdAndTransactionId(userId, id, dateFrom, dateTo);
        let transactionDtoList = new Array<IemsConfigurationTransactionDto>();

        // transactions.forEach(function (element) {
        //     let dto = new IemsConfigurationTransactionDto();
        //     dto.createByEntity(element);
        //     transactionDtoList.push(dto);
        // });

        for (const transaction of transactions) {
            const iems = await this.getIemsById(transaction.iemsId);
            let dto = new IemsConfigurationTransactionDto();
            dto.createByEntity(transaction);
            dto.iemsHostname = iems.hostname;
            transactionDtoList.push(dto);
        }

        return transactionDtoList;
    }

    @Transactional()
    async addTransaction(iemsConfigurationTransactionDto: IemsConfigurationTransactionDto): Promise<IemsConfigurationTransactionDto> {

        const vmConfigurationTransaction = new IemsConfigurationTransactionEntity();
        vmConfigurationTransaction.createByAttributes(iemsConfigurationTransactionDto.userId, iemsConfigurationTransactionDto.customerId, iemsConfigurationTransactionDto.accountId,
            iemsConfigurationTransactionDto.transactionTypeId, iemsConfigurationTransactionDto.iemsId, iemsConfigurationTransactionDto.iemsConfigId, Date.now());
        const newVMConfigurationTransaction = this.vmConfigurationTransactionDao.create(vmConfigurationTransaction)
        const createdcreatedVMConfigurationTransaction = new IemsConfigurationTransactionDto();
        createdcreatedVMConfigurationTransaction.createByEntity(await this.vmConfigurationTransactionDao.save(newVMConfigurationTransaction));
        return createdcreatedVMConfigurationTransaction;

    }
}