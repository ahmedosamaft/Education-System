
module.exports.filterObj = (obj,isUser, ...allowedFields) => {
  const newObj = {};
  if (isUser) obj = obj._doc;
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};
