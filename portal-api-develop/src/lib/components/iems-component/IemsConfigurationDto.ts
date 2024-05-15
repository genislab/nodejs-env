/**
 *
 * Copyright (c) Mentor A Siemens Business. All rights reserved.
 */
import { IemsConfigurationEntity } from "./IemsConfigurationEntity";
import { IBaseDTO } from "../base-componant/IBaseDTO";
import { IsString, IsNumber, IsOptional} from "class-validator";
import { Constants } from "../../utils/Constants";


export class IemsConfigurationDto implements IBaseDTO {

  @IsOptional()
  @IsString({ message: Constants.valueNotString })
  id: string;
  @IsOptional()
  @IsString({ message: Constants.valueNotString })
  iemsId: string;
  
  metadata: string;
  
  @IsOptional()
  @IsNumber(null, { message: Constants.valueNotNumber })
  version: number;
  
  @IsOptional()
  @IsNumber(null, { message: Constants.valueNotNumber })
  date: number;

  @IsOptional()
  @IsString({ message: Constants.valueNotString })
  physicalResourceName: string;


  constructor() {

  }

  createByEntity(iemsConfiguration: IemsConfigurationEntity) {
    this.id = iemsConfiguration.id
    this.iemsId = iemsConfiguration.iemsId;
    this.metadata = iemsConfiguration.metaData;
    this.version = iemsConfiguration.version;
    this.physicalResourceName = iemsConfiguration.physicalResourceName;
    this.date = iemsConfiguration.date;
  }
}