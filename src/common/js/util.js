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

  /**
   * 通过字典值获取其名称
   * 界面上可以
   * {{formatDicts(dicts,'xxx',scope.row.xxx)}}
   * @param {*} dicts 
   * @param {*} itemCode 
   * @param {*} cellValue 
   * @returns 
   */
  formatDicts: function(dicts,itemCode,cellValue){ 
    let key=itemCode;
    if( dicts[key]==undefined ||  dicts[key]==null ||  dicts[key].length==0   ){
      return cellValue;
    }
    let dict=dicts[key].find(i=>i.id===cellValue)
    if(dict){
      return dict.name
    }else{
      return cellValue
    } 
  }, 

  /**
   * 通过字典值获取其名称，返回根值相同的字典,并自动计算其对应显示样式
   * 界面上可以类似使用
   * 显示：
      <el-tag v-for="(item,index) in formatDictsWithClass(dicts,'xxxx',scope.row.xxxx)" :key="index" :type="item.className">{{item.name}}</el-tag>
   
   * 下拉框：
      <el-select v-model="editForm.xxxx" @change="editSomeFields(editForm,'xxxx',$event)">
        <el-option style="margin-top:5px;" v-for="(item,index) in dicts['xxxx']" :key="index" :value="item.id" :label="item.name">
           <span :style="{backgroundColor:item.color}"> 
              <i  v-if="item.icon" :class="item.icon"></i>
              {{item.name}}
           </span> 
        </el-option>
      </el-select>

      0|xx|#909399
      1|xx|#409EFF
      2|xx|#67C23A
      3|xx|#E6A23C
      4|xx|#F56C6C
      5|xx|#00ced1
      6|xx|#c71585
      7|xx|#ff8c00
      8|xx|#c7158577
      9|xx|#ffd700
   * 
   * @param {*} dicts 
   * @param {*} itemCode 
   * @param {*} cellValue 
   * @returns [{id:'',name:'',className:'',color:'',icon:''}]
   */ 
  formatDictsWithClass: function(dicts,itemCode,cellValue){ 
    
    var classNames=['info','primary','success','warning','danger']; 
    var colors=['#909399','#409EFF','#67C23A','#E6A23C','#F56C6C','#00ced1','#c71585','#ff8c00','#c7158577','#ffd700'];

    let key=itemCode;
    if(!cellValue){
      return [];
    }
    var cellValueInt=parseInt(cellValue)
      if( isNaN(cellValueInt) ){
        cellValueInt=cellValue.chartCodeAt(cellValue.length-1)
      }
      var colorIndex=cellValueInt % 10
      if(cellValueInt > 0 && colorIndex==0){
        colorIndex=1
      }
      var typeIndex=cellValueInt % 5
      if(cellValueInt > 0 && typeIndex==0){
        typeIndex=1
      }
    if(dicts[key]==undefined || dicts[key]==null || dicts[key].length==0   ){
      
      return [{id:cellValue,name:cellValue,className:classNames[typeIndex],color:colors[colorIndex]}];
    }
    let data=dicts[key].find(i=>i.id===cellValue) 
    if(data){ 
      data['className']=classNames[typeIndex]
      if(!data.color){
        data.color=colors[colorIndex]
      } 
      return [data];
    }else{
      return [{id:cellValue,name:cellValue,className:classNames[typeIndex],color:colors[colorIndex]}]
    }

  },  

  getColor(cellValue){ 
    var colors=['#909399','#409EFF','#67C23A','#E6A23C','#F56C6C','#00ced1','#c71585','#ff8c00','#c7158577','#ffd700'];
    if(!cellValue){
      return colors[0]
    } 
    var cellValueInt=parseInt(cellValue)
      if( isNaN(cellValueInt) ){
        
        if(cellValue instanceof String && cellValue.length>0){
          cellValueInt=cellValue.chartCodeAt(cellValue.length-1)
        }else if(cellValue instanceof Object){
          if(cellValue['userid']){
            cellValueInt=cellValue['userid'].chartCodeAt(cellValue['userid'].length-1)
          }else{
            cellValueInt=0;
          }
          
        }else{
          cellValueInt=0;
        }
       
      }
      var colorIndex=cellValueInt % 10
      if(cellValueInt > 0 && colorIndex==0){
        colorIndex=1
      }
      return  colors[colorIndex]
  },

  getType(cellValue){ 
    var classNames=['info','primary','success','warning','danger']; 

    if(!cellValue){
      return classNames[0]
    }
    var cellValueInt=parseInt(cellValue)
      if( isNaN(cellValueInt) ){
        cellValueInt=cellValue.chartCodeAt(cellValue.length-1)
      } 
      var typeIndex=cellValueInt % 5
      if(cellValueInt > 0 && typeIndex==0){
        typeIndex=1
      }
      return classNames[typeIndex]
  },
  calcTableMaxHeight(cssSelector) {     
    var table=cssSelector;
    if(typeof cssSelector == 'string'){
      table=document.querySelector(cssSelector);
    } 
    var innerHeight=window.innerHeight  
    var defaultInnerHeight=616;  
    var pageHeight=32/defaultInnerHeight*innerHeight 
    var top=150/defaultInnerHeight*innerHeight;
    var bottomHeight=36/defaultInnerHeight*innerHeight
    if(innerHeight>=916){
      bottomHeight=20/defaultInnerHeight*innerHeight
    }else if(innerHeight>=800){
      bottomHeight=26/defaultInnerHeight*innerHeight
    }else if(innerHeight>=700){
      bottomHeight=32/defaultInnerHeight*innerHeight
    }
    
    if(table!=null){  
      var rect=table.getBoundingClientRect()    
      if(rect && rect.top!=0){ 
        top=rect.top;
      } 
    } 
    var maxTableHeight =innerHeight-top-pageHeight-bottomHeight;  
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
  formatDate: function(date, pattern) {
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
    parseDate: function(dateString, pattern) {
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

  //type date/daterange
  getPickerOptions: function(type) {
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
