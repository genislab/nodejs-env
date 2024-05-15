/**
 *
 * Copyright (c) Mentor A Siemens Business. All rights reserved.
 */
import { IemsEntity } from './IemsEntity';
import { EntityRepository, Repository } from "typeorm";

@EntityRepository(IemsEntity)
export class IemsDao extends Repository<IemsEntity>{
    async getIemsIdsByUserId(userId: number): Promise<Array<IemsEntity>> {

        return await this.find({
            select: ["id"],
            where: { 'userId': userId }
        });
    }

    async getIemsByUserId(userId: number): Promise<Array<IemsEntity>> {

        return await this.find({
            where: { 'userId': userId }
        });
    }

    async getIemsById(id: string): Promise<Array<IemsEntity>> {

        let x = await this.find({
            where: { 'id': id }
        });
        return x;
    }
}