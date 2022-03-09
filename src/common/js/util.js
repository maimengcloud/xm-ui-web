var SIGN_REGEXP = /([yMdhsmH])(\1*)/g
var DEFAULT_PATTERN = 'yyyy-MM-dd'

function padding(s, len) {
  var len = len - (s + '').length
  for (var i = 0; i < len; i++) {
    s = '0' + s
  }
  return s
}



export default {

  calcTableMaxHeight(cssSelector) {     
    ;
    var table=cssSelector;
    if(typeof cssSelector == 'string'){
      table=document.querySelector(cssSelector);
    }
    var innerHeight=window.innerHeight  
    var defaultInnerHeight=913;  
    var pageHeight=90/defaultInnerHeight*innerHeight
    if(innerHeight<defaultInnerHeight){
      pageHeight=90
    }
    var top=200/defaultInnerHeight*innerHeight;
    if(table!=null){
      var rect=table.getBoundingClientRect()    
      if(rect && rect.top!=0){
        top=rect.top;
      } 
    } 
    var maxTableHeight =innerHeight-top-pageHeight;  
    return maxTableHeight;
  }, 
  getPositionTop(node) { 

      if(!node){
        return 0;
      } 
      var rect=node.getBoundingClientRect() 
      var top=rect.top; 
      if(top==0){
        return 0;
      }
      return top;
  },
  /**
   * 获取时间的前后几分钟
   * @param {starTime,endTime} string yyyy-MM-dd HH:ss string yyyy-MM-dd HH:ss
   * @return {formatdate} string
   */
  timeDifference(starTime, endTime) {
    //转成时间戳
    if (starTime) {
      let starDate = new Date(starTime),
        endDate = new Date(endTime)
      let starStamps = starDate.getTime(),
        endStamps = endDate.getTime(),
        betweenStamps = ''
      betweenStamps = Math.abs((parseInt(endStamps - starStamps)))

      let minute = parseInt(betweenStamps / 60000) //取分钟
      return minute
    } else {
      console.log('时间空')
    }

  },
  /**
   * 获取时间的前后几分钟
   * @param {dateTime,type,minuteNum} string yyyy-MM-dd HH:mm:ss string number
   * @return {formatdate} string
   */
  getAboutTime(dateTime, minuteNum) {
    let string = dateTime.replace(/-/g, "/"),
      date = new Date(string),
      timeStamps = '',
      dateObj = '',
      hour = '',
      minute = '',
      formatdate = ''
    timeStamps = date.setTime(date.getTime() - parseInt(minuteNum) * 60000)
    dateObj = new Date(timeStamps)

    hour = dateObj.getHours()
    if (hour < 10) {
      hour = '0' + hour
    }
    minute = dateObj.getMinutes()
    if (minute < 10) {
      minute = '0' + minute
    }

    formatdate = hour + ":" + minute //设置时间格式
    return formatdate
  },
  //时间2020-09-30
  getDate() {
    var date = new Date()
    var myyear = date.getFullYear();
    var mymonth = date.getMonth() + 1;
    var myweekday = date.getDate();
    if (mymonth < 10) {
      mymonth = "0" + mymonth;
    }
    if (myweekday < 10) {
      myweekday = "0" + myweekday;
    }

    return (myyear + "-" + mymonth + "-" + myweekday);
  },

  getQueryStringByName: function(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
    var r = window.location.search.substr(1).match(reg)
    var context = ''
    if (r != null) {
      context = r[2]
    }
    reg = null
    r = null
    return context == null || context == '' || context == 'undefined' ? '' : context
  },

  fmoney(s, n) {
    n = n > 0 && n <= 20 ? n : 2;
    s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
    var l = s.split(".")[0].split("").reverse(),
      r = s.split(".")[1];
    var t = "";
    for (let i = 0; i < l.length; i++) {
      t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
    }
    return t.split("").reverse().join("") + "." + r;
  },

  isNull(obj) {
    if (obj === null || obj === '' || obj === undefined) {
      return true;
    }
    return false;
  },
  /**
   * 字段转成驼峰命名
   * @param {*} name
   */
  toCamel(name) {
    return name.replace(/\_(\w)/g, function(all, letter) {
      return letter.toUpperCase();
    });
  },
  /**
   * 驼峰转下横线
   * @param {*} name
   */
  toLine(name) {
    return name.replace(/([A-Z])/g, "_$1").toLowerCase();
  },
  formatDate: {

    format: function(date, pattern) {
      pattern = pattern || DEFAULT_PATTERN
      return pattern.replace(SIGN_REGEXP, function($0) {
        switch ($0.charAt(0)) {
          case 'y':
            return padding(date.getFullYear(), $0.length)
          case 'M':
            return padding(date.getMonth() + 1, $0.length)
          case 'd':
            return padding(date.getDate(), $0.length)
          case 'w':
            return date.getDay() + 1
          case 'h':
            return padding(date.getHours(), $0.length)
          case 'H':
            return padding(date.getHours(), $0.length)
          case 'm':
            return padding(date.getMinutes(), $0.length)
          case 's':
            return padding(date.getSeconds(), $0.length)
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
            case 'y':
              _date.setFullYear(_int);
              break
            case 'M':
              _date.setMonth(_int - 1);
              break
            case 'd':
              _date.setDate(_int);
              break
            case 'h':
              _date.setHours(_int);
              break
            case 'm':
              _date.setMinutes(_int);
              break
            case 's':
              _date.setSeconds(_int);
              break
          }
        }
        return _date
      }
      return null
    },

  },

  //type date/daterange
  pickerOptions: function(type) {
    if (type != 'datarange') {
      var shortcuts = [{
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
          date.setTime(date.getTime() + 3600 * 1000 * 24 * 7 * 2);
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
      return {
        shortcuts: shortcuts
      };
    } else {
      var shortcuts = [{
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
          text: "前三周",
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7 * 3);
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
          text: "后三周",
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            end.setTime(start.getTime() + 3600 * 1000 * 24 * 7 * 3);
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
        }
      ]
      return {
        shortcuts: shortcuts
      };;
    }

  },

}
