<template>    
    <el-row>
						<div class="field-box">  
							<el-avatar class="avater" :class="{'dashed-circle':avaterCpd.isNull}"   :style="{backgroundColor:avaterCpd.color}" :src="getHeadimgurl(avaterCpd.userid,avaterCpd.headimgurl)" @error="onImgError(avaterCpd.userid,$event)">{{avaterCpd.innerText}}</el-avatar> 
							
              <div class="field-info"  :class="{disabled:disabled===true,enabled:disabled!==true}">
                <slot name="info" :value="myVal">
								<span class="field-value" v-if="!avaterCpd.isNull">{{avaterCpd.innerText}} </span>
								<span class="field-value" v-else><span class="label-font-color">无</span></span> 
                <slot name="label">
								  <span class="field-label">{{label}}</span>  
                </slot>
                </slot>
							</div>  
              <div v-if="disabled!==true" class="field-oper" :value="myVal"  :class="{disabled:disabled===true,enabled:disabled!==true}">
                <slot name="oper">
                    <el-select v-model="myVal" @change="onSelectChange" :clearable="clearable" value-key="userid" @visible-change="$emit('visible-change',$event)" @focus="$emit('focus',$event)" @blur="$emit('blur',$event)" @clear="$emit('blur',$event)" @click="$emit('click',$event)">  
                          <el-option disabled value="" style="margin-bottom:5px;">
                              <el-row><el-button :type="deptUserVisible?'':'primary'" @click.stop="deptUserVisible=false">常用用户</el-button> <el-button :type="deptUserVisible?'primary':''"  @click.stop="deptUserVisible=true">部门用户</el-button><el-button v-if="projectId" :type="projectVisible?'primary':''"  @click.stop="projectVisible=true">项目组</el-button> </el-row>
                          </el-option>
                          <el-option class="avatar-container" v-for="(item,index) in users" :key="index" :value="item" :label="item.username">  
                          
                            <div class="avatar-wrapper">
                                  <el-avatar class="user-avatar"  :style="{backgroundColor:getMyColor(item)}" :src="getHeadimgurl(item.userid,item.headimgurl)" @error="onImgError(item.userid,$event)">{{item.username}}</el-avatar> 
                                  <span class="username">{{item.username}}</span>
                                  <i v-if=" myVal && myVal.userid==item.userid" class="el-icon-check"></i> 
                                  <i v-else>&nbsp;&nbsp;</i>  
                            </div>
                          </el-option> 
                      </el-select> 
                      <slot name="extOper">

                      </slot>
                      </slot>
                  </div> 
						</div> 
            <el-dialog :visible.sync="deptUserVisible" append-to-body top="20px" width="60%">
               <users-select :visible="deptUserVisible" :isSingleUser="true"  :isSelectByDept="true" @confirm="onConfirmUsers"></users-select>
            </el-dialog>
           
    </el-row>
  </template>
  
  <script>  
  
  import util  from '@/common/js/util';//全局公共库
  
  import imtUtil  from '@/api/imgUtil';//全局公共库
  import UsersSelect from '@/views/mdp/sys/user/UsersSelectOnly.vue'
  export default {
    name: 'mdp-select-user-x',
    components: { UsersSelect,  },
    computed: { 
      
      avaterCpd(){  
        var isEmpty=this.isEmpty(this.myVal)
        var username=isEmpty?"":(this.myVal.username?this.myVal.username:this.myVal.userid)
        var obj={isNull:isEmpty,icon:'el-icon-user',color:'#E4E7ED',innerText:username,userid:'',headimgurl:''} 
        if(!isEmpty){
            obj.headimgurl=this.myVal.headimgurl
            obj.userid=this.myVal.userid
          }
          if(this.getColor||this.color){
            if(this.getColor){
               obj.color= this.getColor(this.myVal)
            }else{
              obj.color=this.color
            }
           
          }else{
            if(!isEmpty){ 
                 obj.color= util.getColor(this.myVal.userid) 
            } 
          } 


          if(this.getIcon||this.icon){
            if(this.getIcon){
              obj.icon= this.getIcon(this.myVal)
            }else if(this.icon){
             obj.icon=this.icon
            }
          } 

          debugger;
          
        return obj;
      }
    },
    data(){
        return {
            myVal:{userid:'',username:'',headimgurl:''}, 
            users:[],
            deptUserVisible:false,
            projectVisible:false,
        }
    },
    watch:{ 
        value:{  
          handler(){
             this.initData();
          },
          deep:true,
           
        },  
        
      myVal(){
         if(!this.myVal||!this.myVal.userid){
              if(this.value && this.value[this.useridKey]){
                this.value[this.useridKey]=""
                this.value[this.usernameKey]=""
                this.$emit('input',this.value)
              }
             
            }else{
              if(this.value){
                 if(this.value[this.useridKey]!=this.myVal.userid){ 
                  this.value[this.useridKey]=this.myVal.userid
                  this.value[this.usernameKey]=this.myVal.username 
                  this.$emit('input',this.value) 
                }
              }
             
            } 
        
      }
    },
    props: {
        projectId:{
          type:String,
          default:''
        },
      
        disabled:{
            type:Boolean,
            default:false,
        },
       label:{
        type:String,
        default:''
       },
        clearable:{
            type:Boolean,
            default:false,
        }, 
      value: {
        
      },     
    useridKey: {
      type: String,
      default: 'userid'
    },  
    
    usernameKey: {
      type: String,
      default: 'username'
    }, 
     
    },
    methods: {     
      ...imtUtil,
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
        getMyColor(item){ 

            if(item&&item.userid){
            
              if(this.getColor){
                  return this.getColor(item.userid)
              } 
              return util.getColor(item.userid)
              
            }else{
              if(this.getColor){
                  return this.getColor("0")
              }else{
                return util.getColor(0)
              }
            } 
          
        },
        getMyIcon(item){
          if(item){ 
            if(this.getIcon){
                return this.getIcon(item)
            } 
            return "el-icon-user";
          }else{
            if(this.getIcon){
                return this.getIcon(this.myVal)
            }else{
              return "el-icon-user"
            }
          }
        }, 

         initData(){  
            var myVal={}
            if(this.value){
              myVal.userid=this.value[this.useridKey]
              myVal.username=this.value[this.usernameKey]  
              this.myVal=myVal
            }else{
              this.myVal={userid:'',username:'',headimgurl:''}
            }
          
      }, 
        onSelectChange(item){
          this.onChange([item])
        },
        onChange(data){   
          this.$emit('change',data)
        },
        onConfirmUsers(users){ 
          this.onChange(users)
          this.myVal=users[0]
          this.deptUserVisible=false;
          var notHad=false;
           users.forEach(u=>{
					 if(!this.users.some(k=>k.userid==u.userid)){
						 notHad=true;
						 this.users.unshift(u)
					 }
				 })
				 if(notHad){ 
					 var us=JSON.stringify(this.users)
				 	localStorage.setItem("mdp-his-users",us)
				 }
        }
    },
    mounted(){
      var us=localStorage.getItem("mdp-his-users")
			this.users=us?JSON.parse(us):[]
			 
      this.initData();

    }
  }
  </script>
  
<style lang="scss" scoped>  
  @import '../Mdp/index.scss';
</style>

 
  