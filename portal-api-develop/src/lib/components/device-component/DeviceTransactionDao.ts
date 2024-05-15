/**
 *
 * Copyright (c) Mentor A Siemens Business. All rights reserved.
 */
import { EntityRepository, Repository, MoreThan, LessThan, Between } from "typeorm";
import { DeviceTransactionEntity } from "./DeviceTransactionEntity";
import { BaseRepository } from "typeorm-transactional-cls-hooked";


@EntityRepository(DeviceTransactionEntity)
export class DeviceTransactionDao extends BaseRepository<DeviceTransactionEntity>{

    async getDeviceTransbyUserIdAndstatus(userId: number, dateFrom: number, dateTo?: number, deviceId?: String): Promise<Array<DeviceTransactionEntity>> {

        let condations = {
            'userId': userId
        };

        if (dateFrom && dateTo) {
            condations['transactionDate'] = Between(dateFrom, dateTo);
        } else if (dateFrom) {
            condations['transactionDate'] = MoreThan(dateFrom);
        } else if (dateTo) {
            condations['transactionDate'] = LessThan(dateTo);
        }
        if (deviceId)
            condations['ieDeviceId'] = LessThan(deviceId);

        let devicesTrans = await this.find({ where: condations });

        return devicesTrans;
    }

    async getDeviceTransbyId(id: string): Promise<DeviceTransactionEntity> {

        let condations = {
            'id': id
        };
        let devicesTranaction = await this.find({ where: condations });

        return devicesTranaction[0];
    }
    async createDeviceTransaction(deviceTrans: DeviceTransactionEntity): Promise<DeviceTransactionEntity> {
        return await this.save(this.create(deviceTrans));
    }
}
