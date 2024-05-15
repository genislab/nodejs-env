/**
 *
 * Copyright (c) Mentor A Siemens Business. All rights reserved.
 */
import { EntityRepository, Repository, MoreThan, LessThan, Between } from "typeorm";
import { SubscriptionUserTransactionEntity } from "./SubscriptionUserTransactionEntity";
import { BaseRepository } from "typeorm-transactional-cls-hooked";


@EntityRepository(SubscriptionUserTransactionEntity)
export class SubscriptionUserTransactionDao extends BaseRepository<SubscriptionUserTransactionEntity>{

    async createUpdateUserPackageTransaction(userPackageTrans: SubscriptionUserTransactionEntity): Promise<SubscriptionUserTransactionEntity> {
        return await this.save(this.create(userPackageTrans));
    }

    async getAllTransactions(userId: number, dateFrom: number, dateTo?: number): Promise<Array<SubscriptionUserTransactionEntity>> {

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

        let trans = await this.find({ where: condations });

        return trans;
    }

    async getTransactionById(id: string): Promise<SubscriptionUserTransactionEntity> {

        let condations = {
            'id': id
        };

        let trans = await this.find({ where: condations });
        return trans[0];
    }
}
