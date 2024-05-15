/**
 *
 * Copyright (c) Mentor A Siemens Business. All rights reserved.
 */
import { LicenceEntity } from "./LicenceEntity";
import { EntityRepository } from "typeorm";
import { BaseRepository } from "typeorm-transactional-cls-hooked";

@EntityRepository(LicenceEntity)
export class LicenceDao extends BaseRepository<LicenceEntity>{

    async getLicencebySubscriptionId(subscriptionPackageId ?: string) : Promise<Array<LicenceEntity>>{
        
        let licences = await this.find({where: {'user_subscription_package_id' : subscriptionPackageId, 'status' : 'inactive' }});
        return licences;    
    }

    async getActiveLicencesbySubscriptionPackageId(subscriptionPackageId ?: string) : Promise<Array<LicenceEntity>>{
        
        let licences = await this.find({where: {'UserSubscriptionPackageId' : subscriptionPackageId, 'status' : 'active' }});
        return licences;    
    }

    async createUpdateLicence(licence : LicenceEntity) : Promise<LicenceEntity>{
        return await this.save(this.create(licence));
    }

    async getById(licenceId : string) : Promise<LicenceEntity> {

        return await this.findOne({where: {'id' : licenceId}});
    }
}
