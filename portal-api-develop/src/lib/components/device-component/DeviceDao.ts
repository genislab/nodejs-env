/**
 *
 * Copyright (c) Mentor A Siemens Business. All rights reserved.
 */
import { DeviceEntity } from "./DeviceEntity";
import { EntityRepository, Repository } from "typeorm";
import { BaseRepository } from "typeorm-transactional-cls-hooked";



@EntityRepository(DeviceEntity)
export class DeviceDao extends BaseRepository<DeviceEntity>{

    async getDevicebyUserIdAndstatus(userId : number,iemsId:string, status ?: number) : Promise<Array<DeviceEntity>>{
        
        let  devices ;
        if(status)
            devices = await this.find({where: {'iemsId' : iemsId, 'status' : status }});
        else
            devices = await this.find({where: {'iemsId' : iemsId }});

        return devices;    
    }


    async getDeviceId(iemsId : string, deviceId : string) : Promise<DeviceEntity>{
        
        let  device = await this.findOne({where: {'iemsId' : iemsId , 'id' : deviceId }});
        return device;    
    }

    async getDeviceSerialNo(iemsId: string, deviceSN : string) : Promise<DeviceEntity>{
        let  device = await this.findOne({where: {'iemsId': iemsId, 'serialNo' : deviceSN }});
        return device;    
    }


    async createDevice(device : DeviceEntity) : Promise<DeviceEntity>{
        return await this.save(this.create(device));
    }
}