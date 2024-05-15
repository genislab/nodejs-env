/**
 *
 * Copyright (c) Mentor A Siemens Business. All rights reserved.
 */
import { EntityRepository, Repository } from "typeorm";
import { IemsConfigurationEntity } from "./IemsConfigurationEntity";

@EntityRepository(IemsConfigurationEntity)
export class IemsConfigurationDao extends Repository<IemsConfigurationEntity>{
    async getConfigurationbyUserIdAndConfigurationId(userId: number, id?: string, iemsIdList?: string[]): Promise<Array<IemsConfigurationEntity>> {

        let configurations = new Array<IemsConfigurationEntity>();
        if (id)
            configurations = await this.find({ where: { 'id': id } });
        else if (iemsIdList && iemsIdList.length > 0) {
            configurations = await this.createQueryBuilder("IemsConfigurationEntity")
                .where("IemsConfigurationEntity.iemsId IN (:iemsIdList)", { iemsIdList: iemsIdList })
                .orderBy("IemsConfigurationEntity.id")
                .getMany();
        }
        return configurations;
    }

    async getMaxConfigurationVersion(iemsId: string): Promise<number> {

        const values = await this.find({
            select: ["version"],
            where: { 'iemsId': iemsId }
        });
        if (values) {
            let max = 1;
            values.forEach(element => {
                if (element.version > max)
                    max = element.version;
            });
            return max;
        } else
            return 0;

    }

    async getConfigurationbyUserIdAndIemsId(userId: number, iemsId?: string): Promise<Array<IemsConfigurationEntity>> {

        let configurations;
        if (iemsId) {
            configurations = await this.find({ where: { 'userId': userId, 'iemsId': iemsId } });
        }

        return configurations;
    }
}