/**
 *
 * Copyright (c) Mentor A Siemens Business. All rights reserved.
 */
import { EntityRepository, Repository } from "typeorm";
import { SubscriptionPackageEntity } from "./SubscriptionPackageEntity";


@EntityRepository(SubscriptionPackageEntity)
export class SubscriptionPackageDao extends Repository<SubscriptionPackageEntity>{

    async getPackageById(packageId : string) : Promise<SubscriptionPackageEntity>{

        return await this.findOne({where: {'id' : packageId }})
    }

    async getAllPackage() : Promise<Array<SubscriptionPackageEntity>>{

        return await this.find()
    }
   

}
