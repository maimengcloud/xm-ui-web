import util from "../js/util.js"

export const MdpFieldMixin = {
     
    computed: {
        avaterCpd(){  
            var isEmpty=this.isEmpty(this.myVal)
            var obj={isNull:isEmpty,icon:this.icon?this.icon:'el-icon-full-screen',color:this.color?this.color:'#E4E7ED',innerText:''} 
            if(isEmpty){
                return obj;
            }else{
                if(this.color){
                    obj.color=this.color
                }else{
                    obj.color= util.getColorById(this.myVal) 
                }

                if(this.icon){
                    obj.icon=this.icon
                }else{
                    obj.icon=''
                } 
                obj.innerText=this.myVal
            } 
            return obj;
        }, 
     },
     data(){
         return { 
            myVal:null,
         }
     },
     watch:{  
        showAvater:{
            type:Boolean,
            default:true,
        },
        value(val){
            if(val==this.myVal){
                return;
            }
            this.myVal=val
        },
        myVal(val){
            if(val==this.value){
                return;
            }
            this.$emit('input',this.myVal)
        }
     },
     props: { 
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
         value: {
             type:[String,Number],
             default:''
         },   
         clearable:{
            type:Boolean,
            default:true,
         },
         styleObj:{
           type:Object,
           default:function(){return { marginTop:'5px' }}
        }, 
        /**
         * 输入域的名字
         */
        label: {
            type: String,
            default: "",
        },
        /**
         * 空值时显示的内容
         */
        placeholder:{
            type: String,
            default:''
        }, 
        /**
         * 直接指定颜色
         */
        color:String,
        /**
         * 直接指定图标
         */
        icon:String,
        
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
        
         /**输入框尺寸	
          * medium/small/mini	
          */
        size:{
            type: String,
            default:'small'
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
         initData(){
              
             if(this.value==this.myVal){
                return;
             }
             this.myVal=this.value
         },  
         onChange(currentVal,oldVal){ 
            this.$emit('change',currentVal,oldVal)
         },
        isEmpty(v) { 
          switch (typeof v) {
          case 'undefined':
              return true;
          case 'string':
              if(v.length == 0) return true;
              break; 
          case 'object':
              if (null === v || v.length === 0) return true;
              for (var i in v) {
                  return false;
              }
              return true;
          }
          return false;
        },  
     },
     mounted(){
        this.initData();
     }
}