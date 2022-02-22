//jshint esversion:6
module.exports.getDate = function(){
//can also say just exports.getDate
//don't add pharantesis cause it will call the function
  const today = new Date();
  const options ={
    weekday: "long",
    day:"numeric",
    month: "long"
  };
  return today.toLocaleDateString("en-US", options);
}

module.exports.getDay = function(){
  const today = new Date();
  const options ={
    weekday: "long",
  };
  return today.toLocaleDateString("en-US", options);
}
