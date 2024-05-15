/**
 *
 * Copyright (c) Mentor A Siemens Business. All rights reserved.
 */

export class Constants {
    public static valueNotString = "Value is not a valid string";
    public static valueNotJson = "Value is not a valid string";
    public static valueNotNumber = "Value is not a valid number";
    public static valueEmpty = "Value must not be empty";
    public static noDeviceExistError = "There is Device is not exist ";
    public static noDeviceForIEMError = "there's no device with this serialNo in the specified IEMS.";
    public static noDeviceLicense = "this device hasn't any License ";
    public static alreadyOffboarded = " This Device is already offboaded";
    public static alreadyOnboarded = " This Device is already onboaded";
    public static noPackagesSubscriped = "there is no packages subscriped yet";
    public static allPackagesConsumedError = ' All packages are consumed, please purchase a new package to continue onboarding !';
    public static noIemsFound = "there is no iems found with this id";
    public static noFirmwareFound = "there's no firmware with this id.";
    public static noPackageFound = "there is no packages found with this id";
    public static noConfigurationFound = "There's no configurations for this id.";
    public static invalidType = "Invalid type: Expected type '{0}' but found type '{1}'. In the value of ==> {2}";
    public static invalidKey = "Invalid key: key value '{0}' doesn't exist in our schema. In ==> {1}";
    public static maxArrayExceed = "Expected array size to don't exceed '{0}' but found '{1}' in ==> {2}";
    public static requiredKeyMissed = "It's mandatory to specify these values {0} in ==> {1}";
}