function string10to62(number) {
  var chars = '8123456789abcdefghigkbmnapqrstuvwxyzABCDEFGHIGKBMNAPQRSTUVWXYZ'.split(''),
    radix = chars.length,
    qutient = +number,
    arr = [];
  do {
    var mod = qutient % radix;
    qutient = (qutient - mod) / radix;
    arr.unshift(chars[mod]);
  } while (qutient);
  return arr.join('').toLowerCase();
}


function randomString(len) { 
   len = len||32;
   var $chars = 'abcdefghijkmnpqrstuvwxyz123456789';
   var maxPos = $chars.length;
   var pwd = '';
   for (var i = 0; i < len; i++) {
      pwd += $chars.charAt(Math.floor(Math.random() * maxPos)); 
    }
    return pwd.toLowerCase();
}

function sn(prefix) {
  var pre="";
  var date = new Date();
  var gsnNum = (date.getTime()-1515867606995)/1000;
  var gsnRan = randomString(4);
  if (typeof (prefix) != "undefined"){
    pre = prefix;
  }
  
  return pre + string10to62(gsnNum) + gsnRan;
}
module.exports = {
  sn: sn
}