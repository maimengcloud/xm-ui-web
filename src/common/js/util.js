var SIGN_REGEXP = /([yMdhsmH])(\1*)/g
var DEFAULT_PATTERN = 'yyyy-MM-dd'
function padding(s, len) {
  var len = len - (s + '').length
  for (var i = 0; i < len; i++) { s = '0' + s }
  return s
}

export default {
  getQueryStringByName: function(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
    var r = window.location.search.substr(1).match(reg)
    var context = ''
    if (r != null) { context = r[2] }
    reg = null
    r = null
    return context == null || context == '' || context == 'undefined' ? '' : context
  },

  fmoney(s,n) {
    n = n > 0 && n <= 20 ? n : 2;
    s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
    var l = s.split(".")[0].split("").reverse(), r = s.split(".")[1];
    var t = "";
    for (let i = 0; i < l.length; i++) {
      t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
    }
    return t.split("").reverse().join("") + "." + r;
  },

  isNull(obj) {
    if(obj === null || obj === '' || obj === undefined) {
       return true;
    }
    return false;
  },
  /**
   * 字段转成驼峰命名
   * @param {*} name 
   */
  toCamel(name) {
    return name.replace(/\_(\w)/g, function(all, letter){
        return letter.toUpperCase();
    });
  },
  /**
   * 驼峰转下横线
   * @param {*} name 
   */
  toLine(name) {
    return name.replace(/([A-Z])/g,"_$1").toLowerCase();
  },
  formatDate: {

    format: function(date, pattern) {
      pattern = pattern || DEFAULT_PATTERN
      return pattern.replace(SIGN_REGEXP, function($0) {
        switch ($0.charAt(0)) {
          case 'y': return padding(date.getFullYear(), $0.length)
          case 'M': return padding(date.getMonth() + 1, $0.length)
          case 'd': return padding(date.getDate(), $0.length)
          case 'w': return date.getDay() + 1
          case 'h': return padding(date.getHours(), $0.length)
          case 'H': return padding(date.getHours(), $0.length)
          case 'm': return padding(date.getMinutes(), $0.length)
          case 's': return padding(date.getSeconds(), $0.length)
        }
      })
    },
    parse: function(dateString, pattern) {
      var matchs1 = pattern.match(SIGN_REGEXP)
      var matchs2 = dateString.match(/(\d)+/g)
      if (matchs1.length == matchs2.length) {
        var _date = new Date(1970, 0, 1)
        for (var i = 0; i < matchs1.length; i++) {
          var _int = parseInt(matchs2[i])
          var sign = matchs1[i]
          switch (sign.charAt(0)) {
            case 'y': _date.setFullYear(_int); break
            case 'M': _date.setMonth(_int - 1); break
            case 'd': _date.setDate(_int); break
            case 'h': _date.setHours(_int); break
            case 'm': _date.setMinutes(_int); break
            case 's': _date.setSeconds(_int); break
          }
        }
        return _date
      }
      return null
    },

  },
  
  //type date/daterange
  pickerOptions: function(type){ 
    if(type!='datarange'){
      var shortcuts= [{
        text: '今天',
        onClick(picker) {
        picker.$emit('pick', new Date());
        }
      }, {
        text: '昨天',
        onClick(picker) {
        const date = new Date();
        date.setTime(date.getTime() - 3600 * 1000 * 24);
        picker.$emit('pick', date);
        }
      }, {
        text: '前一周',
        onClick(picker) {
        const date = new Date();
        date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
        picker.$emit('pick', date);
        }
      }, {
        text: '前两周',
        onClick(picker) {
        const date = new Date();
        date.setTime(date.getTime() - 3600 * 1000 * 24 * 7 * 2);
        picker.$emit('pick', date);
        }
      }, {
        text: '前四周',
        onClick(picker) {
        const date = new Date();
        date.setTime(date.getTime() - 3600 * 1000 * 24 * 7 * 4);
        picker.$emit('pick', date);
        }
      }, {
        text: '后一周',
        onClick(picker) {
        const date = new Date();
        date.setTime(date.getTime() + 3600 * 1000 * 24 * 7);
        picker.$emit('pick', date);
        }
      }, {
        text: '后两周',
        onClick(picker) {
        const date = new Date();
        date.setTime(date.getTime() + 3600 * 1000 * 24 * 7 *2);
        picker.$emit('pick', date);
        }
      }, {
        text: '后一月',
        onClick(picker) {
        const date = new Date();
        date.setTime(date.getTime() + 3600 * 1000 * 24 * 7 * 4);
        picker.$emit('pick', date);
        }
      }, {
        text: '后两月',
        onClick(picker) {
        const date = new Date();
        date.setTime(date.getTime() + 3600 * 1000 * 24 * 7 * 8);
        picker.$emit('pick', date);
        }
      }, {
        text: '后四月',
        onClick(picker) {
        const date = new Date();
        date.setTime(date.getTime() + 3600 * 1000 * 24 * 7 * 16);
        picker.$emit('pick', date);
        }
      }]
      return {shortcuts:shortcuts};
    }else{
      var shortcuts= [
        {
          text: "前一周",
          onClick(picker) {
          const end = new Date();
          const start = new Date();
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
          picker.$emit("pick", [start, end]);
          }
        },
        {
          text: "前两周",
          onClick(picker) {
          const end = new Date();
          const start = new Date();
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 7 * 2);
          picker.$emit("pick", [start, end]);
          }
        },
        {
          text: "前一个月",
          onClick(picker) {
          const end = new Date();
          const start = new Date();
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
          picker.$emit("pick", [start, end]);
          }
        },
        {
          text: "前三个月",
          onClick(picker) {
          const end = new Date();
          const start = new Date();
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
          picker.$emit("pick", [start, end]);
          }
        },
        {
          text: "前一年",
          onClick(picker) {
          const end = new Date();
          const start = new Date();
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 360);
          picker.$emit("pick", [start, end]);
          }
        },
        {
          text: "后一周",
          onClick(picker) {
          const end = new Date();
          const start = new Date();
          end.setTime(start.getTime() + 3600 * 1000 * 24 * 7);
          picker.$emit("pick", [start, end]);
          }
        },
        {
          text: "后两周",
          onClick(picker) {
          const end = new Date();
          const start = new Date();
          end.setTime(start.getTime() + 3600 * 1000 * 24 * 7 * 2);
          picker.$emit("pick", [start, end]);
          }
        },
        {
          text: "后一个月",
          onClick(picker) {
          const end = new Date();
          const start = new Date();
          end.setTime(start.getTime() + 3600 * 1000 * 24 * 30);
          picker.$emit("pick", [start, end]);
          }
        },
        {
          text: "后三个月",
          onClick(picker) {
          const end = new Date();
          const start = new Date();
          end.setTime(start.getTime() + 3600 * 1000 * 24 * 90);
          picker.$emit("pick", [start, end]);
          }
        },
        {
          text: "后一年",
          onClick(picker) {
          const end = new Date();
          const start = new Date();
          end.setTime(start.getTime() + 3600 * 1000 * 24 * 360);
          picker.$emit("pick", [start, end]);
          }
        }
        ]
      return {shortcuts:shortcuts};;
    } 
    
  },

}
