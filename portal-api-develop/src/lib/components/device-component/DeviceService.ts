/**
 *
 * Copyright (c) Mentor A Siemens Business. All rights reserved.
 */
import { DeviceDto } from "./DeviceDto";
import { DeviceDao } from "./DeviceDao";
import { getManager } from "typeorm";
import { DeviceEntity } from "./DeviceEntity";
import { DeviceTransactionDto } from "./DeviceTransactionDto";
import { DeviceTransactionDao } from "./DeviceTransactionDao";
import { SubscriptionService } from "../subscription-package-component/SubscriptionService";
import { UserSubscriptionPackageDto } from "../subscription-package-component/UserSubscriptionPakageDto";
import { LicenceDto } from "../subscription-package-component/LicenceDto";
import { DeviceTransactionEntity } from "./DeviceTransactionEntity";
import { TransactionEnum } from "../../enums/TransactionEnum";
import { LicenceStatusEnum } from "../../enums/LicenceStatusEnum";
import { DeviceStatusEnum } from "../../enums/DeviceStatusEnum";
import { Transactional } from "typeorm-transactional-cls-hooked";
import { Constants } from "../../utils/Constants";
import { SchemaValidatorService } from "../../utils/SchemaValidatorService";


export class DeviceService {

    readonly deviceDao = getManager().getCustomRepository(DeviceDao);
    readonly deviceTransactionDao = getManager().getCustomRepository(DeviceTransactionDao);
    subscriptionService = new SubscriptionService();
    constructor() {
    }

    @Transactional()
    async getDevicebyUserIdAndstatus(userId: number, iemsId: string, status?: number): Promise<Array<DeviceDto>> {

        let devices = await this.deviceDao.getDevicebyUserIdAndstatus(userId, iemsId, status);
        let deviceDtoList = new Array<DeviceDto>();

        for (let element of devices) {
            let dto = new DeviceDto();
            dto.createByEntity(element);
            dto.licenseStatus = (await this.subscriptionService.getLicenceById(element.licenseId)).status;
            deviceDtoList.push(dto)
        }
        return deviceDtoList;
    }

    /**
     * Create a new device but return the exist one if the Serial No repeated 
     * @param deviceDto 
     */
    @Transactional()
    async createDevice(deviceDto: DeviceDto): Promise<DeviceDto> {

        let device = new DeviceEntity();

        device.createByAttributes(deviceDto.id, deviceDto.serialNo, deviceDto.name, deviceDto.iemsId, deviceDto.licenseId, deviceDto.status);

        let creatdDto = new DeviceDto;
        creatdDto.createByEntity(await this.deviceDao.createDevice(device));

        return creatdDto;
    }

    @Transactional()
    async getDeviceById(iemsId: string, deviceId?: string): Promise<DeviceDto> {

        let device = await this.deviceDao.getDeviceId(iemsId, deviceId);

        if (!device) {
            throw new Error("there is no device with id  " + deviceId);
        }
        let creatdDto = new DeviceDto;
        creatdDto.createByEntity(device);

        return creatdDto;
    }


    @Transactional()
    async getDeviceByNo(iemsId?: string, deviceSN?: string): Promise<DeviceDto> {
        let device = await this.deviceDao.getDeviceSerialNo(iemsId, deviceSN);

        if (!device) {
            return null;
        }
        let creatdDto = new DeviceDto;
        creatdDto.createByEntity(device);
        return creatdDto;
    }

    @Transactional()
    async getTransactionsbyUserIdAndDecive(userId: number, fromDate: number, toDate?: number, deviceId?: string): Promise<Array<DeviceTransactionDto>> {

        let devices = await this.deviceTransactionDao.getDeviceTransbyUserIdAndstatus(userId, fromDate, toDate, deviceId);

        let deviceDtoList = new Array<DeviceTransactionDto>();

        devices.forEach(function (element) {
            let dto = new DeviceTransactionDto();
            dto.createByEntity(element);
            deviceDtoList.push(dto)
        });

        return deviceDtoList;
    }

    @Transactional()
    async getTransactionsbyId(id?: string): Promise<DeviceTransactionDto> {

        let deviceTransaction = await this.deviceTransactionDao.getDeviceTransbyId(id);
        let dto = new DeviceTransactionDto();
        dto.createByEntity(deviceTransaction);

        return dto;
    }



    @Transactional()
    async onBoard(userId: number, iemsId: string, device: DeviceDto): Promise<DeviceTransactionDto> {
        let trans = new DeviceTransactionDto();
        let subcriptionService = new SubscriptionService();
        let subscripedPackage = new UserSubscriptionPackageDto();
        let tmpDevice = await this.getDeviceByNo(iemsId, device.serialNo);
        if (tmpDevice && tmpDevice.id) {
            device = tmpDevice;
        }

        if (device && device.status == DeviceStatusEnum.ONBOARDED.toLowerCase()) {
            throw new Error(Constants.alreadyOnboarded);
        } else {
            device.iemsId = iemsId;
            //get USerSubscribtion backage
            let userSubscripedPackages = await subcriptionService.getSubscripedPackagesByUserId(userId);
            if (!userSubscripedPackages || userSubscripedPackages.length == 0) {
                throw new Error(Constants.noPackagesSubscriped);
            } else {
                for (let i = 0; i < userSubscripedPackages.length; i++) {
                    if (userSubscripedPackages[i].deviceCountRemaining > 0) {
                        subscripedPackage = userSubscripedPackages[i];
                        break;
                    }
                }
                if (!subscripedPackage.id || subscripedPackage.deviceCountRemaining == 0) {
                    throw new Error(Constants.allPackagesConsumedError);
                }

            }

            //check-out licence
            let userSubscriptionService = new SubscriptionService();
            // let licenceList = await userSubscriptionService.getAvaliableLicencePerPackage(subscripedPackage.id);
            let licenceDto = new LicenceDto();
            // if (licenceList && licenceList.length > 0) {
            //     licenceDto = licenceList.pop();
            // } else {
            licenceDto.status = LicenceStatusEnum.ACTVE;
            licenceDto.userSubscriptionPackageId = subscripedPackage.id;
            licenceDto = await userSubscriptionService.createLicence(userId, licenceDto);
            // }

            //update subcription package
            subscripedPackage.deviceCountRemaining = subscripedPackage.deviceCountRemaining - 1;
            await subcriptionService.updateUserSubscripedPackage(subscripedPackage, TransactionEnum.CHECKOUT_LICENCE);

            //create a new device 
            device.licenseId = licenceDto.id;
            device.status = DeviceStatusEnum.ONBOARDED;
            if (!device.name || device.name == '') {
                device.name = device.serialNo;
            }

            //Create or Update
            device = await this.createDevice(device);

            //add onboard transaction
            let transEntity = new DeviceTransactionEntity();
            transEntity.createByAttributes(subscripedPackage.customerId, subscripedPackage.accountId, subscripedPackage.userId, TransactionEnum.ONBOARDING_DEVICE, device.id, licenceDto.id, "", new Date().getTime());
            transEntity = await this.deviceTransactionDao.createDeviceTransaction(transEntity);
            trans.createByEntity(transEntity);
        }
        return trans;

    }

    @Transactional()
    async offBoard(userId: number, iemsId: string, device: DeviceDto): Promise<DeviceTransactionDto> {
        let trans = new DeviceTransactionDto();
        const deviceService = new DeviceService();
        const subscripeService = new SubscriptionService();
        device = await deviceService.getDeviceByNo(iemsId, device.serialNo);
        if (!device) {
            throw new Error(Constants.noDeviceForIEMError);
        }
        if (!device.licenseId) {
            throw new Error(Constants.noDeviceLicense);
        } else if (device.status == DeviceStatusEnum.OFFBOARDED) {
            throw new Error(Constants.alreadyOffboarded);
        }
        let licenceDto = await subscripeService.getLicenceById(device.licenseId);
        licenceDto.status = LicenceStatusEnum.INACTIVE;
        licenceDto = await subscripeService.createLicence(userId, licenceDto);

        // TBD
        // let subscripedPackage = await subscripeService.getUserSubscripedPackageById(licenceDto.userSubscriptionPackageId);
        // subscripedPackage.deviceCountRemaining = subscripedPackage.deviceCountRemaining;
        // subscripedPackage = await subscripeService.updateUserSubscripedPackage(subscripedPackage);

        device.status = DeviceStatusEnum.OFFBOARDED;
        await deviceService.createDevice(device)

        //add offboard transaction

        let transEntity = new DeviceTransactionEntity();
        const subscripedPackage = await subscripeService.getUserSubscripedPackageById(licenceDto.userSubscriptionPackageId);
        transEntity.createByAttributes(subscripedPackage.customerId, subscripedPackage.accountId, subscripedPackage.userId, TransactionEnum.OFFBOARDING_DEVICE, device.id, licenceDto.id, "", new Date().getTime());
        transEntity = await this.deviceTransactionDao.createDeviceTransaction(transEntity);
        trans.createByEntity(transEntity);



        return trans;

    }

    @Transactional()
    async offBoardAll(userId: number, iemsId: string): Promise<Array<DeviceTransactionDto>> {
        // get all devices belong to that iems id
        const devices = await this.getDevicebyUserIdAndstatus(userId, iemsId);
        let transactions = new Array<DeviceTransactionDto>();
        for (const device of devices) {
            try {
                const transaction = await this.offBoard(userId, iemsId, device);
                transactions.push(transaction);
            } catch (e) {
                continue;
            }
        }
        return transactions;
    }
}