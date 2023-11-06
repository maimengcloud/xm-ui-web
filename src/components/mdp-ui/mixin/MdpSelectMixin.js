import util from "../js/util"
export const MdpSelectMixin = {
     
    computed: { 
        avaterCpd(){  
            var isEmpty= !this.myVal || this.myVal.length==0
            var obj={isNull:isEmpty,icon:this.icon,color:this.color,id:'',name:''} 
            if(isEmpty){
                obj.icon='el-icon-full-screen'
                obj.color='#E4E7ED'
                return obj;
            }else{
                if(this.multiple==true){
                    if(this.sels && this.sels.length>0){
                        return this.sels[0]
                    }else{
                        var val=this.myVal[0] 
                        if(!obj.color){
                            obj.color=this.colorFun?this.colorFun(val):util.getColorById(val) 
                        } 
                        if(!obj.icon){
                            obj.icon=this.iconFun?this.iconFun(val):util.getIconById(val) 
                        }
                        obj.name=val
                        obj.id=val
                    }
                }else{
                    if(this.sels){
                        return this.sels
                    }else{
                        var val=this.myVal 
                        if(!obj.color){
                            obj.color=this.colorFun?this.colorFun(val):util.getColorById(val) 
                        }  
                        if(!obj.icon){
                            obj.icon=this.iconFun?this.iconFun(val):util.getIconById(val) 
                        }
                        obj.name=val
                        obj.id=val
                    }
                } 
            } 
            return obj;
        }, 
        optionsCpd(){
            var options=[] 
            var map=new Map();
            var idKey=this.props?this.props['id']:'id'
            var nameKey=this.props?this.props['name']:'name'
            if(this.initOptions){
                this.initOptions.forEach(k=>map.set(k[idKey],k))
             }
            if(this.options){
                this.options.forEach(k=>map.set(k[idKey],k))
             }
            if(this.plusOptions){
                this.plusOptions.forEach(k=>map.set(k[idKey],k)) 
            }  
            
            if(this.item && this.item.options){ 
                this.item.options.forEach(k=>map.set(k[idKey],k))   
            } 
            var options2=[]
            var needFilter=!!this.filterFun
            var needTran=this.props!=null && (idKey!='id' || nameKey!='name')
            var all=map.values();
            for(let value of all) {
                if(needFilter){
                    if(!this.filterFun(value,options)){
                        continue;
                    }
                }
                var idValue=value[idKey]
                if(needTran){
                    if((idKey in value)){
                        value['id']=idValue
                    }
                    if((nameKey in value)){
                        value['name']=value[nameKey]
                    } 
                }
                

                if(this.colorFun){
                    value.color=this.colorFun(idValue,value,options)
                }else{
                    value.color=this.getColorById(idValue,value,options)
                } 
                if(this.iconFun){
                    value.icon=this.iconFun(idValue,value,options)
                }else{
                    value.icon=this.getIconById(idValue,value,options)
                }  
                options2.push(value)
            }  
            return options2
             
        },
        sels(){  
            if(this.multiple==true){
                if(this.myVal==null || this.myVal==''|| this.myVal.length==0 ){
                    return this.optionsCpd.filter(k=>this.myVal==k[this.props['id']])
                }
                if(this.myVal instanceof Array ){ 
                        return this.optionsCpd.filter(k=>this.myVal.some(v=>v==k[this.props['id']]))  
                }else{
                    return this.optionsCpd.filter(k=>this.myVal==k[this.props['id']])
                }
               
            }else{
                if(this.myVal==null || this.myVal=='' || this.myVal.length==0 ){
                    return null
                }else {
                    return this.optionsCpd.find(k=>k[this.props['id']]==this.myVal)
                }
            }
        },
        codeKey(){ 
           if(this.itemCode){
                return util.getCodeKey(this.itemCode,this.params) 
           }else{
            
            if(this.loadFun){ 
                return util.getCodeKey(this.loadFun.name,this.params)
            }else{
                return "xxxx"
            }
           
           }
        },
     },
     data(){
         return {
            defaultColors:util.getDefaultColors(),
             myVal:[],
             item:{
                itemType:'4',
                 options:[]
             },
             initOptions:[],
         }
     },
     watch:{ 
         codeKey(){
             this.initItemOptions();
         },
         value(val){ 
            this.initMyValByValue(val)
         }
     },
     props: {
        title:{
            type: String,
            default:'',
        },
         itemCode:String,
         disabled:{
             type:Boolean,
             default:false,
         },
         closable:{
             type:Boolean,
             default:false,
         },
         effect:{
             type:String,
             default:'dark'//dark / light / plain	
         }, 
         autoSelect:{
             type:Boolean,
             default:false,
         },
         /**
          * 如果是itemCode，将提交后台过滤部分列表数据
          * 如果是loadFun,将提交后台参与过滤
          */
         params:{
             type:Object,
             default:null,
         },
         value: {
             type:[String,Number,Array],
             default:'',
         },   
         clearable:{
            type:Boolean,
            default:true,
         },
         styleObj:{
           type:Object,
           default:function(){return { marginTop:'5px' }}
        }, 
        
        label: {
            type: String,
            default: "",
        },
        emptyText:{
            type:String,
            default:'请选择'
        },
        options:{
            type:Array,
            default:null
        },
        /**
         * 在加载完options后追加进入列表的plusOptions.
         * 整个列表长度为 options+plusOptions 或者 后台返回的 options+plusOptions
         */
        plusOptions:{
            type:Array,
            default:null,
        },
        width:{
            type:[String,Number],
            default:null
        },
        /**
         * 支持select radio checkbox 三种
         */
        showType:{
            type:String,
            default:'select'
        },
        /**
         * 控制组件的布局
         * origin 原始方式，保持element-ui原组件样式
         * tag 未编辑前以tag显示，鼠标放入后显示原生组件模样
         * x 综合布局，适合于表单追求美观的样式，将颜色+图标+布局进行柔和组成新的组件
         */
        showStyle:{
            type:String,
            default:'origin'
        },
        /**
         * 是否多选
         */
        multiple:{
            type:Boolean,
            default:false,
        },
        /**
         * 分隔符，如果多选，并且指定了分隔符，将接受分格符连接的字符串及返回分给符连接的字符串
         */
        split:{
            type:String,
            default:null
        },
        /**
         * 对列表进行转换，{
                id:'key',
                name:'label'
            },
            将把option.key=>option.id,把option.label=>option.name
         */
        props:{
            type: Object,
            default: function(){
                return {id:'id',name:'name'}
            },
        },
        /**
         * 从接口拉取数据的函数,加载顺序 options,itemCode,loadOption,
         * 其中 params为 params属性
         * loadFun(params).then(res=>options=res.data.data)
         */
        loadFun:{
            type:Function,
            default:null,
        },
        /**
         * 对选项值进行过滤，
         * 返回false将被过滤，返回true将在列表显示
         * true/false=filterFun(option,idx,options)
         */
        filterFun:{
            type:Function,
            default:null
        },
        /**
         * 指定每个选项的颜色,option.color属性
         * option.color=colorFun(option,idx,options) 
         */
        colorFun:{ 
            type:Function,
            default:null
        },
        icon:{
            type:String,
            default:null,
        },
        iconFun:{
            type: Function,
            default: null,
        },
        /**
         * placeholder
         */
         placeholder:{
            type: String,
            default:'请选择',
         },
         /**输入框尺寸	
          * medium/small/mini	
          */
         size:{
            type: String,
            default:'small'
         },
         /**
          * 多选时是否将选中值按文字的形式展示
          */
         collapseTags:{
            type:Boolean,
            default:true, 
         },
         /**
          * 多选时用户最多可以选择的项目数，为 0 则不限制
          */
          multipleLimit:{
            type:Number,
            default:0, 
         },
         /**
          * select input 的 name 属性
          */
          name:{
            type:String,
            default:'', 
         },
         /**
          * select input 的 autocomplete 属性
          */
          autoComplete:{
            type:String,
            default:'off', 
         },
         /**
          * 是否可搜索
          */
          filterable:{
            type:Boolean,
            default:false, 
         },
         /**
          * 搜素的时候，的过滤函数
          */
          filterMethod:{
            type:Function,
            default:null, 
         },
         /**
          * 搜索条件无匹配时显示的文字，也可以使用slot="empty"设置
          */
          noMatchText:{
            type:String,
            default:'', 
         },
         /**
          * 选项为空时显示的文字，也可以使用slot="empty"设置
          */
          noDataText:{
            type:String,
            default:'', 
         },
         /**
          * Select 下拉框的类名
          */
          popperClass:{
            type:String,
            default:'-', 
         },
         /**
          * 多选且可搜索时，是否在选中一个选项后保留当前的搜索关键词
          */
          reserveKeyword:{
            type:Boolean,
            default:false, 
         }, 
         /**
          * 当有时候，传入的值不一定在列表中存在，事先已值值对应的名称，则可以通过initName设置，此时就算下拉列表没有对应的选项，也会反显，而不是显示早的值
          */
         initName:{
            type:String,
            default:null
         }
     },
     methods: { 
        showSelect(){
            if(this.disabled){
              return;
            }
            if(this.$refs["operRef"]){
              if(this.$refs["operRef"].onFieldClick){ 
                this.$refs["operRef"].onFieldClick();
              }
            }
          },   
        isCheck(option){
            if(!option && this.myVal){
                return false
            }else if(option && !option.id && !this.myVal){
                return  false;
            }
            if(this.multiple){
                if(this.myVal instanceof Array){ 
                    return this.myVal.some(k=>k==option.id) 
                }else {
                    return this.myVal==option.id
                }  
            }else{
                return this.myVal==option.id
            }
        },
        filterOptions(itemOptions){
            if(this.filterFun && itemOptions!=null && itemOptions.length>0){
                itemOptions=itemOptions.filter(k=>this.filterFun(k,itemOptions))
            }
            return itemOptions;
        },
        transOptions(itemOptions){
            if(this.props!=null && this.props['id']=='id' && this.props['name']=='name'){
                return itemOptions;
            }
            if(itemOptions!=null && itemOptions.length>0){ 
                itemOptions.forEach(k=>{
                    if((this.props['id'] in k)){
                        k['id']=k[this.props['id']]
                    }
                    if((this.props['name'] in k)){
                        k['name']=k[this.props['name']]
                    }
                    
                })
            }
            return itemOptions;
        },
        colorAndIconOptions(itemOptions){   
            if(!itemOptions){
                return itemOptions
            } 
                itemOptions.forEach((k,idx,all)=>{ 
                    if(this.colorFun){
                        k.color=this.colorFun(k[this.props['id']],k,all)
                    }else{
                        k.color=this.getColorById(k[this.props['id']],k,all)
                    } 
                    if(this.iconFun){
                        k.icon=this.iconFun(k[this.props['id']],k,all)
                    }else{
                        k.icon=this.getIconById(k[this.props['id']],k,all)
                    }  
                }) 
            return itemOptions;
        },
        iconOptions(itemOptions){
            if(this.iconFun){
                itemOptions.forEach((k,idx,all)=>{ 
                    k.color=this.iconFun(k[this.props['id']],k,all) 
                })
            }else{
                itemOptions.forEach((k,idx,all)=>{
                    if(!k.icon){
                        k.icon=this.getIconById(k[this.props['id']],k,all)
                    }
                })
            }
            return itemOptions;
        },
        getColorById(id,option,itemOptions){ 
              return util.getColorById(id);
        },
        getIconById(id,option,itemOptions){ 
             if(id){
                return ''
             }else{
                return "el-icon-full-screen"
             }

       },
        afterLoad(itemOptions){

            return itemOptions;
        },
        clearCache(){
            this.$mdp.clearDictCache(this.itemCode,this.params)  
            this.item.options=[]
        },
         initItemOptions(){ 
            if(this.itemCode){
                this.$mdp.ajaxGetDictOptions (this.itemCode,this.params).then(res=>{
                    if(res.tips.isOk){
                       var item=res.data
                       var itemOptions=item.options?item.options:[] 
                       item.options=this.afterLoad(itemOptions)
                        this.item=item
                    }else{
                        this.item={itemType:'4'}
                        this.item.options=[]
                    }
                    
                })
            }else if(this.loadFun){
                this.loadFun(this.params).then(res=>{
                    this.item={itemType:'4'}
                    var itemOptions=res.data.data
                    this.item.options=this.afterLoad(itemOptions)
                })
            }
             
         },
         onChange(val){    
            if(val==this.value){
                return;
            }
            if(!val){
                this.$emit("input",val)
                this.$emit("change",val)
                this.$emit("change2",null)
                return;
            }
            if(this.multiple==true ){
                if(this.split){ 
                    var valJoin=val.join(this.split)
                    if(valJoin!=this.value){
                        
                        this.$emit("input",valJoin)
                        this.$emit('change',valJoin)
                    }  
                }else{
                    this.$emit("input",val)
                    this.$emit('change',val)
                }
                
            }else{
                this.$emit("input",val)
                this.$emit('change',val)
            }   
           this.onChange2(val)
         },
         onChange2(data){ 
            var options=null 
          
            if(this.multiple==true ){ 
                options=this.optionsCpd.filter(k=>data.some(d=>d==k[this.props['id']]))
            }else{
                options=this.optionsCpd.find(k=>data==k[this.props['id']])
            }  
             this.$emit("change2",options)
         },
         initData(){  
            this.initMyValByValue(this.value,true)
         }, 
         /**
          * 只能初始化时执行一次，否则性能有问题
          * @returns 
          */
         initOptionsByInitName(myVal,myName){ 
            debugger
            this.initOptions=myVal.map((v,idx)=>{
                var option={}
                option[this.props['id']]=v
                option[this.props['name']]=myName[idx]
                return option
            })
         },
         initMyValByValue(val,isFirst){  
            if( this.myVal==val){
                return;
            } 
            if(!val){
                this.myVal=null
                return;
            }
           
            var initName=this.initName
             if(this.multiple==true){
                if(!val){
                    this.myVal=null
                    return;
                }
                    if(this.split){
                        if(typeof val == "string"){
                            this.myVal=val.split(this.split)
                            if(initName){
                                 this.initOptionsByInitName(this.myVal,initName.split(this.split))
                            }
                           
                        }else if(val instanceof Array){
                            this.myVal=val
                            if(initName){
                                this.initOptionsByInitName(this.myVal,initName)
                            }
                        }else {
                            this.myVal=[val]
                            if(initName){
                                this.initOptionsByInitName(this.myVal,[initName])
                            }
                        }
                    }else{
                       if(val instanceof Array){
                            this.myVal=val
                            if(initName){
                                this.initOptionsByInitName(this.myVal,initName)
                            }
                        }else {
                            this.myVal=[val+'']
                            if(initName){
                                this.initOptionsByInitName(this.myVal,[initName])
                            }
                        }
                    } 
            }else{
                this.myVal=val+''
                if(initName){
                    this.initOptionsByInitName([this.myVal],[initName])
                }
            }
            
         },
         getMyColor(option){
           return option.color?option.color:(this.colorFun?this.colorFun(option[this.props['id']]):this.getColorById(option[this.props['id']]))
         },
         getMyIcon(option){
            return option.icon?option.icon:(this.iconFun?this.iconFun(option[this.props['id']]):this.getIconById(option[this.props['id']]))
        },
        focus(){
            var selectRef=this.$refs['selectRef']
            selectRef.focus();
        },
        blur(){
            var selectRef=this.$refs['selectRef']
            selectRef.blur();
        }
     },
     
}