import util from "../js/util"
import { mapGetters } from 'vuex' 
export const MdpTableMixin = {
     
    computed: {  
        ...mapGetters([
            'userInfo'
        ]),
        
        commonColumnConfigs:function(){
            var cols= this.columnConfigs.filter(c=>c.isCommon)
            if(cols.length==0){
            cols=this.columnConfigs.filter(c=>c.property);
            }
            var sliceNum=cols.length>this.commonQueryNum?this.commonQueryNum:cols.length
            cols=cols.slice(0,sliceNum)
            return cols;
        }
     },
     data(){
         return { 
            filters:{//查询参数

            },
            defaultFilters:{//默认查询参数,第一次打开界面的时候用到，恢复默认值的时候用到

            },
            tableDatas:[],//表格列表数据
            pageInfo:{//分页数据
                total:0,//服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
                pageSize:10,//每页数据
                count:false,//是否需要重新计算总记录数
                pageNum:1,//当前页码、从1开始计算
                orderFields:[],//排序列 如 ['sex','student_id']，必须为数据库字段
                orderDirs:[]//升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
            },
            load:{ list: false, edit: false, del: false, add: false,batchAdd:false,batchDel:false,batchEdit:false,editSomeFields:false },//查询中...
            sels: [],//列表选中数据
            pkNames:[/** branchId1,branchId2 */],//表格主键的java属性名称，驼峰命名，默认为id,
            dataBak:null,//数据被修改前进行备份
            menuDefId:'',//menu_def.id 菜单表菜单编号，用于菜单权限判断，按钮权限判断
            menuDefName:'',//menu_def.name 功能名称，用于导出excel等文件名
            expandId:'',//智能表单定义编号，用于低代码，扩展表字段，自定义表单等
            refId:'',//引用编号，<table :ref="refId+'Table'"> <form :ref="refId+'Form'">
            columnConfigs:[],//列字段配置信息，根据表格头自动初始化
            hiQueryParams:{},//高级查询条件，需要转换为hiQueryParams="json字符串格式"提交到后台,树状结构，{cid:'',label:'',property:'',children:[]}
            checkedColumns:[],//选中的表格属性列表，如[id,branchName,xx,xxx,...]
            defaultCheckColumnNum:8,//默认展示的表格列数，前8列
            addForm:{},//新增页面的数据
            editForm:{},//编辑页面数据
            //增删改查(含批量)接口
            apis:{
                list:null,
                add:null,
                del:null,
                edit:null,
                editSomeFields:null,
                batchAdd:null,
                batchDel:null,
                batchEdit:null,
            },
            defaultDisabledRules:{
                addBtn:false,
                delBtn:false,
                detailBtn:false,
                searchBtn:false,
                exportBtn:false,
                importBtn:false,
                printBtn:false,
                selectBtn:false, 
                selectConfirmBtn:false,
            },//判断是否可编辑
            disabledRules:{//初始化时会将defaultDisabledRules覆盖进 disabledRules

            },
            /**
             * 当前页面的currOpType,操作类型 list -列表，detail-明细，add-新增，edit-修改，mng-综合管理,select-查询并选择确认
             */
            currOpType: "mng",
            /**
             * 作废，改成v-adaptive指令解决表格离底部距离问题
             */
            tableHeight:500,
            
            pageVisible:false,

            /**
             * 是否可编辑模式
             */
            editable:true,

            
            /**
             * 自定义表单编号，用于加载表单配置信息
             */
            expandId: '',

            /**
             * 用于存储自定义表单的数据的字段名称，驼峰命名，后台自动转为下横线
             */
            expandFieldName: 'extInfos',

            /**
             * 是否显示 自定义表单信息
             */
            showExpand: false,

            formDef:{},
            formFields:[]
         }
     },
     watch:{   
        visible(val){ 
            this.pageVisible=val; 
        },
        pageVisible(val){
             
            this.$emit('update:visible',val)
            this.$emit(val?'open':'close',val)
            if(val==true){ 
                this.$nextTick(()=>{
                    this.onOpen();
                })
                
            }else{
                this.onClose();
            }
            
        }
     },
     props: {   
        /**
         * 弹框时显示或者关闭
         */
        visible:{
            type:Boolean,
            default:false
        },
        /**
         * 上级页面的currOpType，用于多级权限判断，参考currOpType
         */
        parentOpType:{//
            type:String,
            default:null
        },
        /**
         * 当前页面的currOpType,操作类型 list -列表，detail-明细，add-新增，edit-修改，mng-综合管理,select-查询并选择确认
         */
        subOpType:{
            type:String,
            default:null,
        },
        bottomOffset:{
            type:[String,Number],
            default:45
        }, 
        
        /**
         * subOpType='select' 时有效
         * 是否多选
         */
         multiple:{
            type:Boolean,
            default:false,
        },
        /**
         * 用于初始话高级查询，常用查询等
         * {label:'列名',
         * property:'属性名',
         * sortNo:'排序从0-999，越小越靠前',
         * isCommon:'是否常用',
         * colType:'数据库字段类型 string/int/date/datatime/',
         * showHq:'是否显示在高级查询true/false',
         * showCol:'是否在表格中显示该列true/false',
         * sqlOper:'默认查询规则，默认eq gt/lt/ge/le/eq/ne/left_like/right_like/like/in/nin/bwtween/sql',
         * sqlVal:'默认值，多选的话逗号分隔'
         * beginVal:'如果sqlOper=between,值存于beginVal及envVal中',
         * endVal:'',
         * pk:'是否为主键，true/false',
         * itemCode:'字典表中itemCode字段，填写了该值将从字典表加载下拉列表'
         * colPrefix:'属性需要添加前缀是使用，比如res.id=xxxxx,此次填写res.',
         * disabledHq:'是否允许编辑查询条件',
         * }
         */
        columnCfgs:{
            type:Array,
            default: null,
        },
        /**
         * 需要从外部传入表格的参数，由此进入
         * params={defaultFilters,filters,其它参数}
         */
        params:{
            type:Object,
            default:null,
        },
        /**
         * 显示风格
         * origin,tag,x
         */
        showStyle:{
            type:String,
            default:null
        }
        
     },
     mounted(){ 
        this.initTableColumnConfigs();
        this.getFormFields();
        this.initData();
     },
     methods: { 
        onOpen(){ 
            this.initTableColumnConfigs();//有些情况下表格初始化未成功，在页面打开的时候，重新初始化未初始成功的表格配置信息
            this.initCurrData();
        },
        onClose(){

        },
        onFormClose(){ 
            var formDialog=this.$refs[this.refId+'FormDialog']
            if(formDialog){
                formDialog.close();
            } 
        },
        /**
         * 页面初始话进行数据初始处理。该函数由组件自行扩展，添加一些需要的其它逻辑判断
         */
         initCurrData(){ 
            this.initDefaultFilters();
            Object.assign(this.filters,this.defaultFilters)
            this.disabledRulesInit(this.disabledRules)
            this.searchTableDatas();
         },

         /**
          * 此函数由组件扩展,给defaultFilters添加其它的额外默认参数
          */
         initDefaultFilters(){
            debugger
            if(this.params){
                Object.assign(this.defaultFilters,this.params)
            }
         },
        /**
         * 检查参数是否满足调用后台接口的条件
         * 
         * @param params 提交给后台的参数池,map类型
         * @returns true / false
         */
        preQueryParamCheck(params){
            return true;
        },
        
        /**
          * 设置某个关键词、按钮、输入框禁用 disabledRules['addBtn']=false
          * 判断某个对象是否可编辑 this.disabledJudge('addBtn')==false
          */
         disabledRulesInit(disabledRules){

        },
         initData(){ 
            if(this.subOpType){
                this.currOpType=this.subOpType
            } 
            this.disabledInit()  
            this.$nextTick(()=>{   
                this.initCurrData();   
            })
            
         },

        handleSizeChange(pageSize) { 
            this.pageInfo.pageSize=pageSize; 
            this.loadTableDatas();
        },
        handleCurrentChange(pageNum) {
            this.pageInfo.pageNum = pageNum;
            this.loadTableDatas();
        }, 
        // 表格排序 obj.order=ascending/descending,需转化为 asc/desc ; obj.prop=表格中的排序字段,字段驼峰命名
        sortChange( obj ){
            if(obj.order==null){
                this.pageInfo.orderFields=[];
                this.pageInfo.orderDirs=[]; 
            }else{
                var dir='asc';
                if(obj.order=='ascending'){
                    dir='asc'
                }else{
                    dir='desc';
                }
                 
                this.pageInfo.orderFields=[util.toLine(obj.prop)]; 
                this.pageInfo.orderDirs=[dir];
            }
            this.loadTableDatas();
        },
        //选择行
        selsChange: function (sels) {
            this.sels = sels;
        }, 
        searchTableDatas(){
            
             this.pageInfo.count=true; 
             this.pageInfo.total=0;
             this.pageInfo.pageNum=1;
             this.loadTableDatas();
        },
        searchReset() {
            this.filters=Object.assign({},this.defaultFilters)
            this.hiQueryParams={}
            this.searchTableDatas();
        },
        /**
         * 根据表格头初始化columnConfigs
         * {label:'列名',
         * property:'属性名',
         * sortNo:'排序从0-999，越小越靠前',
         * isCommon:'是否常用',
         * colType:'数据库字段类型 string/int/date/datatime/',
         * showHq:'是否显示在高级查询true/false',
         * showCol:'是否在表格中显示该列true/false',
         * sqlOper:'默认查询规则，默认eq gt/lt/ge/le/eq/ne/left_like/right_like/like/in/nin/bwtween/sql',
         * sqlVal:'默认值，多选的话逗号分隔'
         * beginVal:'如果sqlOper=between,值存于beginVal及envVal中',
         * endVal:'',
         * pk:'是否为主键，true/false', 
         * itemCode:'字典表中itemCode字段，填写了该值将从字典表加载下拉列表'
         * colPrefix:'属性需要添加前缀是使用，比如res.id=xxxxx,此次填写res.',
         * disabledHq:'是否允许编辑查询条件',
         * }
         * @returns 
         */
        initTableColumnConfigs(){ 
            if(this.columnConfigs && this.columnConfigs.length>0){
                return;
            }
            var columnConfigs=[]
            if(this.columnCfgs && this.columnCfgs.length>0){
                columnConfigs.push(...this.columnCfgs)
            }else{ 
                var table=this.$refs[this.getRefId()+'Table'];
                if(!table){
                    table=this.$refs['table']
                }
                if(!table){
                    return;
                }
               
                table.$children.forEach(k=>{
                    
                    var column={}
                    if(k.columnConfig){
                        if(k.$attrs){ 
                            Object.keys(k.$attrs).forEach(key=>column[util.toMCamel(key)]=k.$attrs[key])
                        } 
                        column.property=k.columnConfig.property
                        column.label=k.columnConfig.label 
                        column.showCol=true
                        columnConfigs.push(column)
                    } 
                }) 
            }
            
            this.columnConfigs=columnConfigs
            if( !this.pkNames || this.pkNames.length<=0){
                this.pkNames=this.columnConfigs.filter(k=>k.pk==true).map(k=>k.property)
            }
           
            var colsIsCommon=this.columnConfigs.filter(c=>c.isCommon==true && c.property).map(c=>c.property) 
            var colsUnCommon=this.columnConfigs.filter(c=>c.isCommon!=true && c.property).map(c=>c.property)
            var defNum=this.defaultCheckColumnNum;
          
            var checkNum=this.columnConfigs.length<defNum?this.columnConfigs.length:defNum 
            if(colsIsCommon.length>0 && checkNum<=colsIsCommon.length){
                this.checkedColumns=colsIsCommon.splice(0,checkNum)
            }else{
                colsIsCommon.push(...colsUnCommon.splice(0,checkNum-colsIsCommon.length))
                this.checkedColumns=colsIsCommon
            } 

        }, 

        getQueryParams(){
            let params = {
                pageSize: this.pageInfo.pageSize,
                pageNum: this.pageInfo.pageNum,
                total: this.pageInfo.total,
                count:this.pageInfo.count
            };
            if(this.pageInfo!=null){
                params = {
                    pageSize: this.pageInfo.pageSize,
                    pageNum: this.pageInfo.pageNum,
                    total: this.pageInfo.total,
                    count:this.pageInfo.count
                };
            }
            
            if(this.pageInfo.orderFields!=null && this.pageInfo.orderFields.length>0){
                let orderBys=[];
                for(var i=0;i<this.pageInfo.orderFields.length;i++){ 
                    orderBys.push(this.pageInfo.orderFields[i]+" "+this.pageInfo.orderDirs[i])
                }  
                params.$orderBy= orderBys.join(",")
            }
            if(this.params && this.params.filters){
                Object.assign(this.filters,this.params.filters)
            }
            Object.assign(params,this.filters)
            this.encodeHiQueryParams(params)
            return params;
        },
        /**
         * 对高级查询的参数进行编码，加入到参数池中用于提交给后台接口
         * params.hiQueryParams=encodeURI(JSON.stringify(hiParams))
         * @param {*} params 
         */
        encodeHiQueryParams(params){
            var hiQueryParams=this.filterHiQueryParams(this.hiQueryParams)
            if(hiQueryParams&&hiQueryParams.cid){
                params.hiQueryParams=encodeURI(JSON.stringify(hiQueryParams))
            }
            return params
        },
        /**
         * 对高级查询的条件进行过滤默认的无效条件，减少提交后台接口的体积
         * @param {*} hi 
         * @returns 
         */
        filterHiQueryParams(hi){
            var that=this;
            var condition={};
            if(hi==null || !hi.cid){
                return null;
            }else{
                if(hi.children&&hi.children.length>0){
                    if(hi.sqlLink=='AND'||hi.sqlLink=='OR'){
                        condition={cid:hi.cid,sqlLink:hi.sqlLink,children:[]}
                        hi.children.forEach(k=>{
                            var child=that.filterHiQueryParams(k);
                            if(child!=null && child.cid){
                                condition.children.push(child);
                            } 
                        })
                        return condition;
                    }else{
                        return null;
                    }
                }else{
                    if(hi.sqlLink=='AND'||hi.sqlLink=='OR'){
                        return null;
                    }else{
                        if(hi.sqlOper=='=' && !hi.sqlVal){
                            return null;
                        }else if(!hi.sqlOper){
                            return null;
                        }else if(hi.sqlOper!='$IS NULL' && hi.sqlOper!='$IS NOT NULL'){
                            if(hi.sqlVal==null || hi.sqlVal==''){
                                return null;
                            }
                        }
                        condition={cid:hi.cid,property:hi.property,sqlOper:hi.sqlOper,colType:hi.colType,sqlVal:hi.sqlVal,endVal:hi.endVal,colPrefix:hi.colPrefix}
                        return condition;
                    }
                }
            }
        },
        getFormFields(){
            if(this.expandId){
                this.$mdp.listFormFieldCacheFirst({formId:this.expandId}).then(res=>{
                    var tips=res.data.tips;
                    var data=res.data.data;
                    if(tips.isOk && data){
                        this.formDef=data.formDef
                        this.formFields=data.formFields
                    }
                })
            }
        },
        //获取列表 Item 数据项定义
        loadTableDatas() { 
            var apiName="apis.list"
            var params = this.getQueryParams();//查询条件
            if(!this.preQueryParamCheck(params)){
                return;
            }
            if(!this.apiCheck(this.apis.list,apiName)){
                return;
            }
            this.load.list = true;
            var func = this.apis.list;
            func(params).then((res) => {
                this.getResult(res,apiName)
                this.load.list = false;
            }).catch( err => {
                this.load.list = false  
                }
            );
        },
        getResult(res,apiName){
            var tips=res.data.tips;
            if(tips.isOk){ 
                this.pageInfo.total = res.data.total;
                this.pageInfo.count=false;
                var tableDatas = res.data.data; 
                this.tableDatas=tableDatas
                this.parseExpand(tableDatas,this.expandFieldName)
                this.afterList(res.data.data,tips.isOk,apiName)
                
            }else{
                this.$notify({ message: tips.msg, type: 'error' });
            }  
        },
        parseExpand(tableDatas,expandFieldName){
            if(expandFieldName && tableDatas && tableDatas.length>0){
                tableDatas.forEach(d=>{
                        if(d[expandFieldName] && d[expandFieldName] instanceof String){
                            d[expandFieldName]=JSON.parse(d[expandFieldName])
                        }
                        if(d[expandFieldName] instanceof Array){
                            d[expandFieldName].forEach(k=>{
                                d[expandFieldName+"."+k.id]=k.value
                            })
                        } 
                    })
                }   
        },
        //页面数据加载完后需要对数据进行加工处理的
        afterList(tableDatas,isOk,apiName){ 
         },
        apiCheck(func,apiName){ 
            if(!func){
                this.$notify({ message: apiName+"为空", type: 'error' });
                return false;
            }
             
            return true;
        },
        openForm(res){    
            let {parentOpType,formRefId,subOpType,formData} = res
            if(!formRefId){
                formRefId=this.getRefId()+"FormDialog"
            }
            if(!parentOpType){
                parentOpType=this.currOpType
            }
            var form=this.$refs[formRefId]
            if(form){
                res.parentOpType=parentOpType
                res.formRefId=formRefId 
                res.expandId=this.expandId
                res.showExpand=this.showExpand
                res.expandFieldName=this.expandFieldName
                form.open(res);
            }else{

            }
            
        },
        //表单新增/修改提交后的回调
        afterFormSubmit(res,isOk,currOpType){
            if(isOk){
                this.searchTableDatas();
            }
            this.$emit("form-submit",res,isOk,currOpType)
        },
        //表单新增/修改时取消或者关闭
        onFormCancel(currOpType){
            this.$emit("form-cancel",currOpType)
        },
        //单条新增/批量新增后回调此函数
        afterAddSubmit(res,isOk,apiName){ 
            if(isOk){
                this.searchTableDatas();
            }
            this.$emit("add-submit",res,isOk,apiName)
        },
        //单条修改/批量修改后回调此函数
        afterEditSubmit(res,isOk,apiName){ 
            if(isOk){
                this.searchTableDatas();
            } 
            this.$emit("edit-submit",res,isOk,apiName)
        }, 
        //单条删除/批量删除后回调此函数
        afterDelSubmit(res,isOk,apiName){ 
            if(isOk){
                this.searchTableDatas();
            }
            this.$emit("del-submit",res,isOk,apiName)
        },
        //
        afterEditSomeFields(res,isOk,params,row){
            if(isOk){
                this.searchTableDatas(); 
            } 
            this.$emit("fields-change",res,isOk,params,row)
        },
        //选择行
        selsChange: function (sels) {
            this.sels = sels;
        }, 
        //即将作废
        showAdd(){

        },
        //即将作废
        showEdit(){

        },
        //即将作废
        showDetail(){

        },
        //删除
        handleDel: function (row,index) { 
            
            this.$confirm('确认删除该记录吗?', '提示', {
                type: 'warning'
            }).then(() => { 
                var apiName="apis.del"
                if(!this.apiCheck(this.apis.del,apiName)){
                    return;
                }  
                this.load.del=true;
                this.load.batchDel=true;
                let params = {};
                this.getPkNames().forEach(k=>{
                    params[k]=row[k]
                })
                var func = this.apis.del;
                func(params).then((res) => {
                    this.load.del=false;
                    this.load.batchDel=false;
                    var tips=res.data.tips;
                    if(tips.isOk){ 
                        this.pageInfo.count=true;
                    }
                    this.$notify({ message: tips.msg, type: tips.isOk?'success':'error' }); 
                    this.afterDelSubmit(res,tips.isOk,apiName)
                }).catch( err  => {
                    this.load.del=false  
                    this.load.batchDel=false;
                    this.afterDelSubmit(err,false,apiName)
                    }
                );
            });
        },
        //批量删除
        batchDel: function () {
            if(this.sels==null || this.sels.length==0){
                this.$notify({ message: "未选择待删除数据", type: 'error' });
                return;
            }
            this.$confirm('确认删除选中记录吗？', '提示', {
                type: 'warning'
            }).then(() => { 
                var apiName="apis.batchDel"
                if(!this.apiCheck(this.apis.batchDel,apiName)){
                    return;
                }  
                this.load.batchDel=true;
                let params = this.getDelPks(this.sels);
                var func = this.apis.batchDel;
                func(params).then((res) => {
                    this.load.batchDel=false;
                    var tips=res.data.tips;
                    if( tips.isOk ){ 
                        this.pageInfo.count=true;
                    }
                    this.$notify({ message: tips.msg, type: tips.isOk?'success':'error'});
                    this.afterDelSubmit(res,tips.isOk,apiName)
                }).catch( err  => {
                    this.load.batchDel=false 
                    this.afterDelSubmit(res,false,apiName);
                    } 
                );
            });
        },
        /**
         * 获取主键,填值到params中。 
         * @param {*} rows 
         * @returns 
         */
        setPks(rows,params){
            params.$pks=this.getPks(rows)
             
        },
        getPkNames(){
            var pkNames=this.pkNames&&this.pkNames.length>0?this.pkNames:['id']
            return pkNames;
        },
        
        /**
         * 获取主键列表
         * @param {} rows 
         * @returns 
         */
         getDelPks(rows){ 
            var pkNames=this.getPkNames(); 
            var pks=rows.map(k=>{
                var pk={}
                pkNames.forEach(name=>{
                    pk[name]=k[name]
                })
                return pk;
            }) 
            return pks 
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
         * 对修改的字段进行判断，返回false ,将取消更新数据库
         * @param {*} row 当前选中的行
         * @param {*} fieldName 修改的字段名
         * @param {*} $event 修改后的值
         * @param {*} params 将要提交服务器的参数
         * @returns true/false 返回false ,将取消更新数据库
         */
        editSomeFieldsCheck(row,fieldName,$event,params){
            params[fieldName]=$event
            return true;
        },
        editSomeFields(row,fieldName,$event){
            var params={};
            var that=this;
            if(this.sels.length>0){
                if(!this.sels.some(k=>that.justPkIsMatch(k,row))){
                    this.$notify({position:'bottom-left',showClose:true,message:'请操作选中的行或者取消选中的行再操作其它行',type:'warning'})
                    return;
                }
                this.setPks(this.sels,params);
            }else{
                this.setPks([row],params)
            }
            if(!this.editSomeFieldsCheck(row,fieldName,$event,params)){
                if(this.dataBak){
                    if(this.justPkIsMatch(this.dataBak,row)){//进行数据恢复
                        Object.assign(row,this.dataBak)
                    }
                }
                return;
            }
            var apiName="apis.editSomeFields"
            if(!this.apiCheck(this.apis.editSomeFields,apiName)){
                return;
            }  

            this.load.editSomeFields=true; 
            var func = this.apis.editSomeFields; 
            func(params).then(res=>{
                var tips = res.data.tips;
                if(tips.isOk){   
                    this.afterEditSomeFields(res,tips.isOk,params,row)
                }else{ 
                    if(this.dataBak && this.justPkIsMatch(row,this.dataBak)){
                        Object.assign(row,this.dataBak)
                    } 
                    this.$notify({position:'bottom-left',showClose:true,message:tips.msg,type:tips.isOk?'success':'error'})
                }
                
            }).catch(err=>{
                this.load.editSomeFields=false;  
            });
        },
        rowClick: function(row, event, column){
            this.dataBak=Object.assign({},row)
            this.$emit('row-click',row, event, column);//  @row-click="rowClick"
        },
        selectConfirm:function(row){
            this.$emit('select',row) 
            this.$emit('change',row)
            this.$emit('change2',row)
        },
        selectListConfirm:function(){
            this.$emit('select',this.sels)
            this.$emit('change',this.sels)
            this.$emit('change2',this.sels)
        },
        onCheckedColumnsChange(checkedColumns){ 
            this.checkedColumns=checkedColumns
        },
        getRefId(){
            if(this.refId){
                return this.refId
            }else{
                this.refId=util.createSeqNo('auto_ref_')
                return this.refId;
            }
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
            return this.$mdp.checkBtnQx(btnId,menuDefId)
        },
        /**
         * 判断当前列是否应该显示
         * @param {*} property 
         * @returns 
         */
        showCol(property){ 
            if(!this.checkedColumns || this.checkedColumns.length==0){
                return true;
            }
            return this.checkedColumns.some(k=>k==property)
        },
        /**
         * 监听高级查询参数编号
         */
         onHiQueryParamsChange(hiQueryParams){
            this.hiQueryParams=hiQueryParams
            this.searchTableDatas();
         },
         export2Excel(){
            var cols= this.columnConfigs.filter(k=>k.property)
            if(cols.length<=0){
                return;
            }
            import("@/vendor/Export2Excel").then(excel => {
                const tHeader = cols.map(c=>c.label);
                const filterVal = cols.map(c=>c.property);
                const list = this.tableDatas;
                const data = this.formatJson(filterVal, list); 
                var fieldName=(this.menuDefName?this.menuDefName:this.getRefId())+"_"+util.formatDate(new Date(),'yyyyMMddHHmmss');
                excel.export_json_to_excel({
                  header: tHeader,
                  data,
                  filename: fieldName,
                  autoWidth: true,
                  bookType: "xlsx"
                });
              });
         },
         formatJson(filterVal, jsonData) {
            return jsonData.map(v =>
                filterVal.map(j => { 
                    return v[j]; 
                })
            );
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
            
         /**
          * 拷贝一条除了主键不一样，其它都一样的数据,如果存在多个主键，只需要更改第一个主键数据即可
          * @param {*} row 
          */
         copy(row){ 
            var params=Object.assign({},row)
             var pkNames=this.getPkNames();
            var firstPkName=pkNames[0] 
            params[firstPkName]=row[firstPkName]+"_1"
            var func=this.apis.add
            func(params).then(res=>{
                var tips = res.data.tips
                if(tips.isOk){
                    this.searchTableDatas();
                }else{
                    this.$message.error(tips.msg)
                }
            })
         }
        /**end 自定义函数请在上面加**/
     },
}