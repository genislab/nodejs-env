/**
 *
 * Copyright (c) Mentor A Siemens Business. All rights reserved.
 */
import { UserSubscriptionPackageEntity } from "./UserSubscriptionPackageEntity";
import { EntityRepository, MoreThan, Between, LessThan } from "typeorm";
import { BaseRepository } from "typeorm-transactional-cls-hooked";



@EntityRepository(UserSubscriptionPackageEntity)
export class UserSubscriptionPackageDao extends BaseRepository<UserSubscriptionPackageEntity>{

    async createUpdateUserPackage(userPackage: UserSubscriptionPackageEntity): Promise<UserSubscriptionPackageEntity> {
        return await this.save(this.create(userPackage));
    }

    async getSubscripedPackagesByUserId(userId: number, dateFrom?: number, dateTo?: number): Promise<Array<UserSubscriptionPackageEntity>> {
        let conditions = { 'userId': userId, 'remainingCount': MoreThan(0) };
        if (dateFrom && dateTo) {
            conditions['startDate'] = Between(dateFrom, dateTo);
        } else if (dateFrom) {
            conditions['startDate'] = MoreThan(dateFrom);
        } else if (dateTo) {
            conditions['startDate'] = LessThan(dateTo);
        }
        
        return await this.find({
            where: conditions,
            order: { 'expirationDate': 'DESC' }
        });
    }

    async getById(id: string): Promise<UserSubscriptionPackageEntity> {
        return await this.findOne({ where: { 'id': id } });
    }
}