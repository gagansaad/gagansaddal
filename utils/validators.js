
const commonRegex = require(`./commonRegex`);

exports.isValidString = (str = ``) => {
    return Boolean(str && (typeof str === `string`) && str.trim());
}
exports.isValidNumber = (str = ``) => {
    return Boolean(str && (typeof str === `Number`));
}
exports.isValidBoolean = (str = ``) => {
    return Boolean(str && (typeof str === `boolean`));
}
exports.isValidMongoObjId = (mongoose, objectId = ``) => {
    return Boolean(mongoose.Types.ObjectId.isValid(objectId))
}

exports.isValidEmailAddress = (emailAddress = null) => {
    const stringifiedEmailAddress = String(emailAddress);

    return Boolean(emailAddress
        && stringifiedEmailAddress
        && stringifiedEmailAddress.match(commonRegex.emailAddressRegex));
}
exports.isValidUrl = (website = null) => {
    const stringifiedWebsite = String(website);

    return Boolean(website
        && stringifiedWebsite
        && stringifiedWebsite.match(commonRegex.urlvalidate));
}

exports.isValidIndianMobileNumber = (mobileNumber = null) => {
    return (mobileNumber
        && String(mobileNumber)
        && String(mobileNumber).match(commonRegex.indianMobileNumberRegex));
}

exports.isValidDate = (date=null) => {
    const dateObj = new Date(date);

    if(dateObj.getTime() - dateObj.getTime() === 0) return true;
    else return false;
}