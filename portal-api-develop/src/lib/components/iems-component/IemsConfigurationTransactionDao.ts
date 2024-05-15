/**
 *
 * Copyright (c) Mentor A Siemens Business. All rights reserved.
 */
import { EntityRepository, Repository, Between, MoreThan, LessThan } from "typeorm";
import { IemsConfigurationTransactionEntity } from "./IemsConfigurationTransactionEntity";

@EntityRepository(IemsConfigurationTransactionEntity)
export class VMConfigurationTransactionDao extends Repository<IemsConfigurationTransactionEntity>{
    async getTransactionbyUserIdAndTransactionId(userId : number, id?: string, dateFrom?: number, dateTo?: number) : Promise<Array<IemsConfigurationTransactionEntity>>{
        
        let  transactions, conditions = {};
        if(id)
            conditions['id'] = id ;
        else
            conditions['userId'] = userId;

        if (dateFrom && dateTo) {
            conditions['transactionDate'] = Between(dateFrom, dateTo);
        } else if (dateFrom) {
            conditions['transactionDate'] = MoreThan(dateFrom);
        } else if (dateTo) {
            conditions['transactionDate'] = LessThan(dateTo);
        }
        
        transactions = await this.find({where: conditions});

        return transactions;    
    }
}