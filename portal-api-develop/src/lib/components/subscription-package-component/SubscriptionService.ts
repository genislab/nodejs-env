/**
 *
 * Copyright (c) Mentor A Siemens Business. All rights reserved.
 */
import { getManager } from "typeorm";
import { SubscriptionPackageDao } from "./SubscriptionPackageDao";
import { UserSubscriptionPackageDao } from "./UserSubscriptionPackageDao";
import { UserSubscriptionPackageEntity } from "./UserSubscriptionPackageEntity";
import { SubscriptionUserTransactionEntity } from "./SubscriptionUserTransactionEntity";
import { UserSubscriptionPackageDto } from "./UserSubscriptionPakageDto";
import { TransactionEnum } from "../../enums/TransactionEnum";
import { SubscriptionPackageDto } from "./SubscriptionPackageDto";
import { SubscriptionUserTransactionDao } from "./SubscriptionUserTransactionDao";
import { LicenceDto } from "./LicenceDto";
import { LicenceDao } from "./LicenceDao";
import { LicenceEntity } from "./LicenceEntity";
import { UtilsService } from "../../utils/UtilsService";
import { SubscriptionUserTransactionDto } from "./SubscriptionUserTransactionDto";
import { Transactional } from "typeorm-transactional-cls-hooked";
import { Constants } from "../../utils/Constants";
import { MindSphereServices } from '../../utils/MindSphereServices';
import { v1 as uuid } from 'uuid';




export class SubscriptionService {

    readonly licenceDao = getManager().getCustomRepository(LicenceDao);
    readonly userSubscriptionDao = getManager().getCustomRepository(UserSubscriptionPackageDao);
    readonly subscriptionTransactionDao = getManager().getCustomRepository(SubscriptionUserTransactionDao);
    readonly packageDao = getManager().getCustomRepository(SubscriptionPackageDao);
    constructor() {

    }

    @Transactional()
    async getAllPackages(): Promise<Array<SubscriptionPackageDto>> {
        let packages = await this.packageDao.getAllPackage();

        let packageDtoList = new Array<SubscriptionPackageDto>();

        packages.forEach(element => {
            let dto = new SubscriptionPackageDto();
            dto.createByEntity(element);
            packageDtoList.push(dto);
        });

        return packageDtoList;
    }

    @Transactional()
    async getPackageById(id: string): Promise<SubscriptionPackageDto> {
        let packageEntity = await this.packageDao.getPackageById(id);
        const dto = new SubscriptionPackageDto();
        dto.createByEntity(packageEntity);
        return dto;
    }


    @Transactional()
    async purchase(userId: number, packageId: string, customerId: number, accountId: number, tenatId :string): Promise<SubscriptionUserTransactionDto> {

        // get the package details from subscription package table
        let packageEntity = await this.packageDao.getPackageById(packageId);
        if (!packageEntity) {
            throw new Error(Constants.noPackageFound);
        }
        //create record in User subscription package
        let userPackageDto = new UserSubscriptionPackageDto();
        userPackageDto.creatByAttribuites(userId, customerId, accountId, packageId, new Date().getTime(), UtilsService.addDays(new Date().getTime(), packageEntity.duration), packageEntity.quota, true);

        //Provision package bulier
        let requestId = uuid();
        let response = await MindSphereServices.provisionPackage(tenatId,requestId,packageEntity.msPackageId,1);


        //Create user subscriped package record
        userPackageDto.id = requestId;
        userPackageDto.msPackageJobId =  response["packageJobId"];
        return await this.updateUserSubscripedPackage(userPackageDto, TransactionEnum.PACKAGE_SUBSCRIPTION);
    }

    @Transactional()
    async getSubscripedPackagesByUserId(userId: number, dateFrom?: number, dateTo?: number): Promise<Array<UserSubscriptionPackageDto>> {
        let packages = await this.userSubscriptionDao.getSubscripedPackagesByUserId(userId, dateFrom, dateTo);
        const availablePackages = await this.getAllPackages();
        let availablePackagesDictionary = {};
        availablePackages.forEach(element => {
            availablePackagesDictionary[element.id] =
                {
                    "name": element.name,
                    "quota": element.quota
                }
        });
        let dtos = new Array<UserSubscriptionPackageDto>();
       
       for (let element of packages){
            let dto = new UserSubscriptionPackageDto();
            dto.createByEntity(element);
            dto.packageName = availablePackagesDictionary[element.subscriptionPackageId].name;
            dto.packageQuota = availablePackagesDictionary[element.subscriptionPackageId].quota;
            dtos.push(dto);
       }

        return dtos;
    }


    @Transactional()
    async decommissionPackage(tenatId: string, id: string): Promise<SubscriptionUserTransactionDto> {
        // get all licenses belongs to that package
        const licenses = await this.getActiveLicencePerPackage(id);
        if (licenses.length > 0) {
            throw new Error("All licenses must be checked-in first before decommissioning susbcription package");
        }
        let userSubscriptionPackage = await this.getUserSubscripedPackageById(id);
        const subpackage = await this.getPackageById(userSubscriptionPackage.subscriptionPackageId);
        userSubscriptionPackage.autoRenewal = false;

     // let response = await MindSphereServices.provisionPackage(tenatId,userSubscriptionPackage.id,subpackage.msPackageId ,1);

        return await this.updateUserSubscripedPackage(userSubscriptionPackage, TransactionEnum.DECOMMISSION_PACKAGE);
    }

    @Transactional()
    async getUserSubscripedPackageById(id: string): Promise<UserSubscriptionPackageDto> {
        let userPackage = await this.userSubscriptionDao.getById(id);
        if (!userPackage) {
            throw new Error(Constants.noPackagesSubscriped);
        }
        let dto = new UserSubscriptionPackageDto();
        dto.createByEntity(userPackage);
            if (dto.msStatus == "IN_PROGRESS"){
                let response = await MindSphereServices.getProvisionJobDetails(dto.msPackageJobId);
                dto.msStatus = response["status"];
            }
        return dto
    }

    @Transactional()
    //Create OR Update UserSubscription packages
    async updateUserSubscripedPackage(userSubscripedPackage: UserSubscriptionPackageDto, transactionType: number): Promise<SubscriptionUserTransactionDto> {
        let entity = new UserSubscriptionPackageEntity();
        let id = "";
        if (userSubscripedPackage.id) {
            id = userSubscripedPackage.id;
        }
        let response = await MindSphereServices.getProvisionJobDetails(userSubscripedPackage.msPackageJobId);
        userSubscripedPackage.msStatus = response["status"];
        entity.createByAttributes(id, userSubscripedPackage.userId, userSubscripedPackage.subscriptionPackageId, userSubscripedPackage.startDate, userSubscripedPackage.expirationDate, userSubscripedPackage.deviceCountRemaining, userSubscripedPackage.autoRenewal, userSubscripedPackage.msPackageJobId, userSubscripedPackage.msStatus);
        let updatedEntity = await this.userSubscriptionDao.createUpdateUserPackage(entity);
        userSubscripedPackage.createByEntity(updatedEntity);
        let trans = new SubscriptionUserTransactionEntity();
        trans.createByAttributes(userSubscripedPackage.customerId, userSubscripedPackage.accountId, userSubscripedPackage.userId, transactionType, userSubscripedPackage.id, new Date().getTime());
        let createdTrans = await this.subscriptionTransactionDao.createUpdateUserPackageTransaction(trans);
        const subscriptionTransactionDto = new SubscriptionUserTransactionDto();
        subscriptionTransactionDto.createByEntity(createdTrans);
        return subscriptionTransactionDto;

    }

    @Transactional()
    async getAvaliableLicencePerPackage(userSubscripedPackageId: string): Promise<Array<LicenceDto>> {
        let licenceList = await this.licenceDao.getLicencebySubscriptionId(userSubscripedPackageId);

        let licenceDTOs = new Array<LicenceDto>();
        if (licenceList) {
            for (let lic of licenceList) {
                let dto = new LicenceDto();
                dto.createByEntity(lic);
                licenceDTOs.push(dto);
            }
        }
        return licenceDTOs;

    }

    @Transactional()
    async getActiveLicencePerPackage(userSubscripedPackageId: string): Promise<Array<LicenceDto>> {
        let licenceList = await this.licenceDao.getActiveLicencesbySubscriptionPackageId(userSubscripedPackageId);

        let licenceDTOs = new Array<LicenceDto>();
        if (licenceList) {
            for (let lic of licenceList) {
                let dto = new LicenceDto();
                dto.createByEntity(lic);
                licenceDTOs.push(dto);
            }
        }
        return licenceDTOs;

    }

    @Transactional()
    async createLicence(userId: number, licence: LicenceDto): Promise<LicenceDto> {
        // Create new licence
        let licenceEntity = new LicenceEntity();
        licenceEntity.createByAttributes(licence.id, licence.userSubscriptionPackageId, licence.status);
        let createdLicence = await this.licenceDao.createUpdateLicence(licenceEntity);
        let dto = new LicenceDto();
        dto.createByEntity(createdLicence);

        return dto;

    }

    @Transactional()
    async getLicenceById(licenceId: string): Promise<LicenceDto> {
        let licenceDto = new LicenceDto();
        let licence = await this.licenceDao.getById(licenceId);
        licenceDto.createByEntity(licence);

        return licenceDto;

    }

    @Transactional()
    async getAllTransactions(userId: number, fromDate: number, toDate?: number): Promise<Array<SubscriptionUserTransactionDto>> {

        const transactions = await this.subscriptionTransactionDao.getAllTransactions(userId, fromDate, toDate);
        let transactionDtoList = new Array<SubscriptionUserTransactionDto>();

        transactions.forEach(function (element) {
            let dto = new SubscriptionUserTransactionDto();
            dto.createByEntity(element);
            transactionDtoList.push(dto)
        });

        return transactionDtoList;
    }

    @Transactional()
    async getTransactionById(id: string): Promise<SubscriptionUserTransactionDto> {

        const transactionEntity = await this.subscriptionTransactionDao.getTransactionById(id);
        const dto = new SubscriptionUserTransactionDto();
        dto.createByEntity(transactionEntity);

        return dto;
    }
}