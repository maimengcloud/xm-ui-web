
export default { 
    flow: {

        qxCodeArrDefault:[
            '1',// 索引 0  可看正文 1是 0 否
            '1',// 索引 1  可修改正文 1是 0 否
            '1',// 索引 2  可看附件 1是 0 否
            '1',// 索引 3  可上传附件 1是 0 否
            '1',// 索引 4  可下载附件 1是 0 否
            '1',// 索引 5  可修改计划完成时间 1是 0 否
            '1',// 索引 6  可驳回 1是 0 否
            '1',// 索引 7  可转主办 1是 0 否
            '1',// 索引 8  可转发起人 1是 0 否
            '1',// 索引 9  可找人代办 1是 0 否
            '1',// 索引 10  可委托办理 1是 0 否
            'a1',// 索引 11  字段查看权限 a1全部可看 a0全部不可看 1部分可看
            '1',// 索引 12  暂时不用，取值 1
            'a1',// 索引 13  字段修改权限 a1全部可改 a0全部不可改 1部分可改
            'a1',// 索引 14  权限字段列表竖线分隔 如 f1:r|f2:frw|f3:nr|f4:rw 分别为 f1 只读，f2 读写必填 f3 不可读 f4 可读可写  冒号后的r 代表可读 w代表可写 f代表必填，如frw代表必填且可读可写  全部不配做，则a1代表不配做，默认a1
            '1',// 索引 15  推送任务通知到IM
            '1',// 索引 16  推送任务通知到短信
            '1', // 索引 17  暂时不用，取值 1 
            '1',// 索引18 发起人是否可以重新调整权限 
            '0',//索引19 是否控制流程节点权限
            '1'//索引20 是否总流程权限 1代表流程权限 0代表流程节点权限
            ],
        
        /**
         * 解析流程节点中的权限配置
         * @return  {Array} ['1','1','1','1',xxxxx] 等
         * @param {string} qxCode  1-1-1-1-1-1-1-1-1-1-1 等
         */
        parseQxCode: function (qxCode) {
            if(qxCode==null || qxCode=='' || qxCode==undefined){
                return this.qxCodeArrDefault;
            }else{
                var qxCodeArr=qxCode.split("-")
                return qxCodeArr;
            }
        },
        /**
         * 根据权限码 及 智能表单 字段定义列表 解析字段权限配置
         * @return {Array} 带有 [{fieldIdCamel:'',qx:rw|frw|nr|r}]的智能表单列表
         * @param {Array} qxCodeArr  ['1','1','1','1',xxxxx] 等
         * @param {Array} formFields  [{fieldIdCamel:'',qx:'',id:''，xxxx}] 等
         */
        parseFormFieldsQx: function (qxCodeArr,formFields) {
            var fieldQxList=[];
            if(qxCodeArr.length>=14){
                if(qxCodeArr[14]!='a1'){
                    fieldQxList=qxCodeArr[14].split("|").map(i=>{
                        var field=i.split(":")
                        return {
                            fieldIdCamel:field[0],
                            qx:field[1]
                        }
                    });
                }
            }
            var flowformFields=[];
           if(formFields && formFields.length>0){
               flowformFields=formFields.map(i=>{
                   var field=Object.assign({},i);
                   if(fieldQxList.some(k=>{
                      if( k.fieldIdCamel==field.fieldIdCamel){
                          field.qx=k.qx
                          return true;
                      }else{
                          return false;
                      }
                      })){

                   }else{
                        field.qx='rw' 
                   }
                  
                   return field;
               });
          }else{
              flowformFields=[];
          }
          return flowformFields
        },

        /**
         * 格式化流程节总的权限配置
         * @return {string} 1-1-1-1-1-1-1-1-1-1-1 等 
         * @param {Array} qxCodeArr 
         * @param {Array} flowFormFields 
         * @param {String} qxType mainQx | actQx 默认为actQx
         */
        formatQxCode: function (qxCodeArr,flowFormFields,qxType) {
            var fields=[];
            if(flowFormFields && flowFormFields.length>0){
                if(qxCodeArr[11]=='1'||qxCodeArr[13]=='1'){//部分字段可读或者部分字段可写，则配置
                    fields= flowFormFields.filter(i=> i.qx!='rw')
                }
            }
            var submitFields=[];
            if(fields.length>0){
                submitFields=fields.map(i=>{
                    return i.fieldIdCamel+":"+i.qx
                });
            }
            if(submitFields.length>0){
                qxCodeArr[14]=submitFields.join("|");
            }else{
                qxCodeArr[14]='a1'
            }
            if(qxType=='mainQx'){
                qxCodeArr[20]='1'
            }else{
                qxCodeArr[20]='0'
            }
            return qxCodeArr.join("-") 
        },
    },
    
    form: {


        parseDataQxCode: function (dqxCode) {
            
        },
        parseFormQxCode: function (mainQx) {
            
        }, 
    }


};
