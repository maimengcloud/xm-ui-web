import util from "../js/util"
import { mapGetters } from 'vuex' 
export const MdpFormMixin = {
     
    computed: {  
        ...mapGetters([
            'userInfo'
        ])
     },
     data(){
         return { 
             
            load:{ list: false, edit: false, del: false, add: false,batchAdd:false,batchDel:false,batchEdit:false,editSomeFields:false },//查询中...
            
            pkNames:[/** branchId1,branchId2 */],//表格主键的java属性名称，驼峰命名，默认为id,
            dataBak:null,//数据被修改前进行备份
            _dataInit:null,
            menuDefId:'',//menu_def.id 菜单表菜单编号，用于菜单权限判断，按钮权限判断
             editForm:{},//编辑页面数据
            //增删改查(含批量)接口
            apis:{ 
                add:null, 
                edit:null,
                editSomeFields:null, 
                queryById:null,
            },
            defaultDisabledRules:{
                addBtn:false,
                delBtn:false,
                detailBtn:false,
                searchBtn:false,
                exportBtn:false,
                importBtn:false,
                printBtn:false,
            },//判断是否可编辑
            disabledRules:{//初始化时会将defaultDisabledRules覆盖进 disabledRules

            },
            /**
             * 当前页面的currOpType,操作类型 list -列表，detail-明细，add-新增，edit-修改，mng-综合管理
             */
            currOpType: "detail",
            pageVisible: null,
            

            /**
             * 是否可编辑模式
             */
             editable:true,
         }
     },
     watch:{   
        visible(val){
            if(val==this.pageVisible){
                return;
            }
            this.pageVisible=val
        },
        pageVisible(val){ 
            this.$emit("update:visible",val)
            this.$emit(val?'open':'close',val) 
            if(val==true){
                this.onOpen()
            }else{
                
                this.$emit('cancel',this.currOpType); //兼容旧版，以后不需要这个事件了，改成 @close
                this.onClose()
            }
        }
     },
     props: {   
        /**
         * 上级页面的currOpType，用于多级权限判断，参考currOpType
         */
        parentOpType:{//
            type:String,
            default:null
        },
        subOpType:{
            type: String,
            default: null,
        }, 
        /**
         * 控制页面是否进行显示，用于弹框时
         */
        visible:{
            type:Boolean,
            default:false
        },
        /**
         * 表单数据
         */
        formData:{
            type: Object,
            default:null,
        },
        /**
         * 是否显示按钮烂
         */
        showBtn:{
            type:Boolean,
            default:true
        },
        /**
         * 自定义表单编号，用于加载表单配置信息,建议用表名进行编码
         */
        expandId:{
            type:String,
            default:null,
        },
        /**
         * 用于存储自定义表单的数据的字段名称，驼峰命名，后台自动转为下横线
         */
        expandFieldName:{
            type:String,
            default:'extInfos'
        },
        /**
         * 是否显示 自定义表单信息
         */
        showExpand:{
            type:Boolean,
            default:false
        }
        
     },
     methods: { 
        /**
         * 页面打开时
         */
        onOpen(){  
            this.$nextTick(()=>{ 
                var form=this.$refs['editFormRef'];
                if(!form){ 
                    form=this.$refs['editForm'];
                }
                if(form){
                    form.resetFields();
                } 
                if(this._dataInit){
                    this.editForm={...this._dataInit}
                }
                this.initData()    
            }) 
        },
        open(){
            this.pageVisible=true;
        },
        close(){
            this.pageVisible=false;
        },
        /**
         * 页面关闭时
         */
        onClose(){
            var form=this.$refs['editFormRef'];
            if(!form){ 
                form=this.$refs['editForm'];
            } 
            if(form){
                form.resetFields(); 
            }
            
        },
         //由组件扩展添加其它的初始页面的逻辑(mounted+onOpen都会调用此函数，建议只添加公共逻辑)
         initCurrData(){
            
         },
        /**
         * 检查参数是否满足调用后台接口的条件
         * @returns true / false
         */
        preParamCheck(params){
            return true;
        },
        
        /**
          * 设置某个关键词、按钮、输入框禁用 disabledRules['addBtn']=false
          * 判断某个对象是否可编辑 this.disabledJudge('addBtn')==false
          */
         disabledRulesInit(disabledRules){

        },
        initData(){  
            this.currOpType=this.subOpType
            this.disabledInit();
            if(this.formData){
                Object.assign(this.editForm,this.formData)
            }
            this.$nextTick(()=>{ 
                this.disabledRulesInit(this.disabledRules) 
                this.initCurrData(); 
                this.dataBak=Object.assign({},this.editForm)
            })
         },  
        /**
         * 取消按钮点击 父组件监听@cance" 监听，逐渐作废，改成close ，父组件监听@close
         *  */ 
        handleCancel:function(){
            this.pageVisible=false;
        },
        apiCheck(func,apiName){ 
            if(!func){
                this.$notify({ message: apiName+"为空", type: 'error' });
                return false;
            }
             
            return true;
        },
        stringOfExpand(params,expandFieldName){
            if(params && params[expandFieldName] && params[expandFieldName] instanceof Object){
                params[expandFieldName]=JSON.stringify(params[expandFieldName])
            } 
        },
 
        //新增、编辑提交@submit="afterFormSubmit"
        saveSubmit: function () {
            var form=this.$refs['editFormRef'];
            if(!form){ 
                form=this.$refs['editForm'];
            } 
            form.validate((valid) => {
                if (valid) {
                    this.$confirm('确认提交吗？', '提示', {}).then(() => { 
                        this.load.edit=true
                        let params = Object.assign({}, this.editForm);
                        this.stringOfExpand(params,this.expandFieldName)
                        if(!this.preParamCheck(params)){
                            this.load.edit=false
                            return;
                        } 
                        var func=this.apis.add
                        if(this.currOpType=='edit'){
                            func=this.apis.edit
                        }
                        func(params).then((res) => { 
                            this.load.edit=false
                            var tips=res.data.tips;
                            if(tips.isOk){  
                                this.afterSubmit(res,tips.isOk,this.currOpType);
                            }
                            this.$notify({ position:'bottom-left',showClose:true, message: tips.msg, type: tips.isOk?'success':'error' });
                        }).catch( err =>this.load.edit=false);
                    });
                }else{
                    this.$notify({ showClose:true, message: "表单验证不通过，请修改表单数据再提交", type: 'error' });
                }
            });
        }, 
        /**
         * 将一个对象的主键赋值给参数
         * @param {*} row 
         * @param {*} params 
         */
        setPk(row,params){
            var pkNames=this.pkNames&&this.pkNames.length>0?this.pkNames:[id]
            pkNames.forEach(k=>params[k]=row[k])
        },
           
        /**
         * 批量接口【editSomeFields用到】获取主键,填值到params中。 
         * @param {*} rows 
         * @returns 
         */
        setPks(rows,params){
            params.$pks=this.getPks(rows)
             
        },
        getPkNames(){
            var pkNames=this.pkNames&&this.pkNames.length>0?this.pkNames:[id]
            return pkNames;
        },
        /**
         * 获取主键列表
         * @param {} rows 
         * @returns 
         */
        getPks(rows){
            var pkNames=this.getPkNames();
            if(pkNames.length>1){
                var pks=rows.map(k=>{
                    var pk={}
                    pkNames.forEach(name=>{
                        pk[name]=k[name]
                    })
                    return pk;
                 }) 
                 return pks
            }else if(pkNames.length==1){
                var pks=rows.map(k=>{
                    var pk= k[pkNames[0]]
                    return pk;
                 }) 
                 return pks
            }
            return null;
        },
        /**
         * 判断两个对象的主键及值是否相等 
         * @param {*} from 
         * @param {*} to 
         * @returns 
         */
        justPkIsMatch(from,to){
            var isMatch=true;
            for(var i=0;i++;i<that.pkNames.length){
                isMatch=k[pkNames[i]]==row[pkNames[i]]
                if(isMatch==false){
                    break;
                }
            }
            return isMatch;
        },
        /**
         * 对修改的字段进行判断，返回false ,将取消更新数据库,由组件扩展
         * @param {*} row 当前选中的行
         * @param {*} fieldName 修改的字段名
         * @param {*} $event 修改后的值
         * @param {*} params 将要提交服务器的参数
         * @returns true/false 返回false ,将取消更新数据库
         */
        editSomeFieldsCheck(row,fieldName,$event,params){
            if(this.currOpType=='add'){
                return false;
            }
            params[fieldName]=$event
            return true;
        },
        editSomeFields(row,fieldName,$event){ 
            if(this.currOpType=='add' || this.currOpType=='detail'){
                return;
            }
            var params={};
            var that=this;
            var sels=[row] 
            if(!this.editSomeFieldsCheck(row,fieldName,$event,params)){ 
                
                if(this.dataBak){
                    if(this.justPkIsMatch(this.dataBak,row)){//进行数据恢复
                        Object.assign(row,this.dataBak)
                    }
                }
                return;
            }
            this.setPks(sels,params); 
            var apiName="apis.editSomeFields"
            if(!this.apiCheck(this.apis.editSomeFields,apiName)){
                return;
            }   
            this.load.editSomeFields=true; 
            var func = this.apis.editSomeFields; 
            func(params).then(res=>{
                var tips = res.data.tips;
                if(tips.isOk){ 
                    Object.assign(row,params)
                    that.afterEditSomeFields(res,tips.isOk,params,row)
                    that.dataBak=Object.assign({},this.editForm)
                }else{ 
                    if(this.dataBak && this.justPkIsMatch(row,this.dataBak)){
                        Object.assign(row,this.dataBak)
                    } 
                    that.$notify({position:'bottom-left',showClose:true,message:tips.msg,type:tips.isOk?'success':'error'})
                }
                
            }).catch(err=>{
                this.load.editSomeFields=false; 
            });
        }, 
        afterSubmit(res,isOk,currOpType){ 
            if(isOk && currOpType=='add'){
                var tips=res.data.tips 
                this.currOpType=='edit' 
                if(res.data.data){
                    this.editForm=Object.assign(this.editForm,res.data.data)
                } 
            }
            if(isOk){
                this.pageVisible=false
                this.$emit("submit",res,isOk,currOpType)
            }
            
        },
        afterEditSomeFields(res,isOk,params,row){
            this.$emit("fields-change",res,isOk,params,row)
        },
        /**
         * 检查按钮是否具有权限
         * btnId 按钮编号 来源于menu_def.id 按钮
         * menuDefId: 来源于menu_def.id 菜单
         */
        checkBtnQx(btnId,menuDefId){
            if(!menuDefId){
                if(this.menuDefId){
                    menuDefId=this.menuDefId
                }else{
                    return true;
                }
            }
            return this.$mdp.checkBtnQx(tnId,menuDefId)
        }, 
         
        /**
         * 判断字段、按钮等是否可编辑
         * @param {*} key 
         */ 
        disabledJudge(key){ 
            if(key in this.disabledRules){
                return this.disabledRules[key]
            }else{
                return false;
            }
        },
        disabledInit(){  
            var disabledRules=Object.assign(this.disabledRules,this.defaultDisabledRules);  
            Object.keys(this.editForm).forEach(key=>disabledRules[key]=false)
            if( !this.currOpType  || this.currOpType.indexOf('detail')>=0||this.currOpType.indexOf('list')>=0){
                Object.keys(disabledRules).forEach(key=>disabledRules[key]=true) 
            }else if(this.currOpType.indexOf('select')>=0){
                Object.keys(disabledRules).forEach(key=>disabledRules[key]=true)  
                disabledRules.selectBtn=false 
            }else if(this.currOpType.indexOf('add')>=0){
                Object.keys(disabledRules).forEach(key=>disabledRules[key]=false)
            }else if(this.currOpType.indexOf('edit')>=0){
                Object.keys(disabledRules).forEach(key=>disabledRules[key]=false)
            }else if(this.currOpType.indexOf('mng')>=0){
                Object.keys(disabledRules).forEach(key=>disabledRules[key]=false)
            }
                this.disabledRules=disabledRules
        },
        /**end 自定义函数请在上面加**/
     },
     mounted(){  
        if(this.editForm){
            this._dataInit={...this.editForm}
        }
        this.disabledInit();
        this.initData();
        this.disabledRulesInit();
     }
}