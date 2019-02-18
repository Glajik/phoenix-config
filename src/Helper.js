const Helper = {  
  makeObjectFromValues: (values, fields) => fields.reduce(
    (acc, field, index) => ({ ...acc, [field]: values[index] }),
    {}
  ),

  makeValuesFromObject: (object, fields) => fields.map(field => object[field] || ''),

  find: (key, array) => array.reduce((acc, value, index) => acc >= 0 || value !== key ? acc : index, -1),

  has: (key, array) => array.some(value => value === key),

  hasInObject: (value, object) => Object.keys(object).some(prop => object[prop] === value),
    
  convertToObjectColl: (valuesColl, fields) => valuesColl.map(values => Helper.makeObjectFromValues(values, fields)),
  convertToValuesColl: (objectColl, fields) => objectColl.map(obj => Helper.makeValuesFromObject(obj, fields)),

  regexpColl: {
    folderId: /^(?:https:\/\/)(?:drive.google.com\/drive\/folders\/)([\d\w-]+)$/,
    // fileId: /^(?:https:\/\/drive\.google\.com\/open\?id=)([\w-]{33})$/,
    fileId: /^(?:https:\/\/drive\.google\.com\/file\/d\/)([\w-]{33})(?:\/[\w=?]*)$/,
  },

  isFolderUrl: url => Helper.regexpColl.folderId.test(url),
  getFolderIdFromUrl: (url) => Helper.regexpColl.folderId.exec(url)[1],

  isFileUrl: url => Helper.regexpColl.fileId.test(url),
  getFileIdFromUrl: (url) => Helper.regexpColl.fileId.exec(url)[1],

  makeUrlFromFileId: fileId => `https://drive.google.com/file/d/${fileId}/view`,

  loggerLogAllProps: (o) => Object.keys(o).forEach(key => Logger.log(`${key} = ${o[key]}, ${typeof(o[key])}`)),

  partialDeepEqual: (compObj, refObj) => Object.keys(compObj)
    .map(prop => refObj[prop] && refObj[prop] == compObj[prop])
    .reduce((acc, boolValue) => acc && boolValue, true
  ),

  hasAllPropertiesInList: (objColl, keys) => 
    keys.map(prop => objColl[prop] && true)
    .reduce((acc, boolValue) => acc && boolValue, true
  ),
};