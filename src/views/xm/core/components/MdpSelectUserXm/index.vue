<template>    
    <el-row>
						<div :class="{'field-box':true,'small':size=='small','medium':size=='medium'}">  
              <div class="avatar-container">
                <div class="avatar-wrapper">
                  <img v-if="avaterCpd.userid" class="user-avatar" :class="{'dashed-circle':avaterCpd.isNull}"   :style="{backgroundColor:avaterCpd.color}" :src="getHeadimgurl(avaterCpd.userid,avaterCpd.headimgurl)" @error="onImgError(avaterCpd.userid,$event)"></img>  
                  <el-avatar v-else class="field-avater" :class="{'dashed-circle':avaterCpd.isNull}"  :icon="avaterCpd.icon" :style="{backgroundColor:avaterCpd.color}">{{avaterCpd.innerText}}</el-avatar> 
							
                </div>
              </div>

              <div class="field-info" :class="{disabled:disabled===true,enabled:disabled!==true}">
                <slot name="field-info" :value="myVal"  >
                  <span :class="{'field-value':label,'field-value-center':!label}" v-if="!avaterCpd.isNull">{{avaterCpd.innerText}} </span>
                  <span :class="{'field-value':label,'field-value-center':!label}" v-else><span class="label-font-color">无</span></span> 
                  <slot name="label">
                    <span class="field-label" v-if="label">{{label}}</span> 
                  </slot> 
                </slot>
							</div>  
              <div v-if="disabled!==true" class="field-oper" :class="{disabled:disabled===true,enabled:disabled!==true}">
                <slot name="oper">
                      <el-select v-model="myVal" @change="onSelectChange" :clearable="clearable" filterable value-key="userid" @visible-change="$emit('visible-change',$event)" @focus="$emit('focus',$event)" @blur="$emit('blur',$event)" @clear="$emit('blur',$event)" @click="$emit('click',$event)">  
                            
                            <el-option :value="myVal" disabled v-if="users && users.length>10">
                                <el-row ><el-button v-if="users && users.length>0" :type="deptUserVisible?'':'primary'" @click.stop="deptUserVisible=false">常用用户</el-button> <el-button :type="deptUserVisible?'primary':''"  @click.stop="deptUserVisible=true">部门用户</el-button>
                                  <el-button v-if="projectId||productId" :type="projectVisible?'primary':''"  @click.stop="projectVisible=true">项目组</el-button> 
                                  <el-button v-if="projectId||productId" :type="productVisible?'primary':''"  @click.stop="productVisible=true">产品组</el-button> 
                                </el-row>
                            </el-option>
                            <el-option class="avatar-container" v-for="(item,index) in users" :key="index" :value="item" :label="item.username">  
                            
                              <div class="avatar-wrapper">
                                    <img class="user-avatar"  :style="{backgroundColor:getMyColor(item)}" :src="getHeadimgurl(item.userid,item.headimgurl)" @error="onImgError(item.userid,$event)"></img>  
                                    <span class="username">{{item.username}}</span>
                                    <i v-if="myVal && myVal.userid==item.userid" class="el-icon-check"></i> 
                                    <i v-else>&nbsp;&nbsp;</i>  
                              </div>
                            </el-option> 
                            <el-option :value="myVal" disabled>
                                <el-row><el-button v-if="users && users.length>0" :type="deptUserVisible?'':'primary'" @click.stop="deptUserVisible=false">常用用户</el-button> <el-button :type="deptUserVisible?'primary':''"  @click.stop="deptUserVisible=true">部门用户</el-button>
                                  <el-button v-if="projectId||productId" :type="projectVisible?'primary':''"  @click.stop="projectVisible=true">项目组</el-button>
                                  <el-button v-if="projectId||productId" :type="productVisible?'primary':''"  @click.stop="productVisible=true">产品组</el-button> 

                                </el-row>
                            </el-option>
                        </el-select> 
                        <slot name="extOper">

                        </slot>
                      </slot>
                  </div>
						</div> 
            <el-dialog v-if="disabled!==true" :visible.sync="deptUserVisible" append-to-body top="20px" width="60%">
               <users-select :visible="deptUserVisible" :isSingleUser="true"  :isSelectByDept="true" @confirm="onTeamUsersConfirm"></users-select>
            </el-dialog>
            
            <el-dialog v-if="disabled!==true" :visible.sync="projectVisible" append-to-body top="20px" width="60%">
               <xm-group-select-for-project :visible="projectVisible" :sel-project="projectId?{id:projectId}:null" :xm-product="productId?{id:productId}:null" :isSelectSingleUser="true" @user-confirm="onTeamUsersConfirm"></xm-group-select-for-project>
            </el-dialog> 
            <el-dialog v-if="disabled!==true" :visible.sync="productVisible" append-to-body top="20px" width="60%">
               <xm-group-select-for-product :visible="productVisible" :sel-project="projectId?{id:projectId}:null" :xm-product="productId?{id:productId}:null" :isSelectSingleUser="true" @user-confirm="onTeamUsersConfirm"></xm-group-select-for-product>
            </el-dialog> 
    </el-row>
  </template>
  
  <script>  
  
  import util  from '@/common/js/util';//全局公共库
  import UsersSelect from '@/views/mdp/sys/user/UsersSelectOnly.vue'
  import XmGroupSelectForProject from '@/views/xm/core/xmGroup/XmGroupSelectForProject.vue'
  import XmGroupSelectForProduct from '@/views/xm/core/xmGroup/XmGroupSelectForProduct.vue'
  var us=localStorage.getItem("mdp-his-users") 
  import imtUtil  from '@/api/imgUtil';//全局公共库
  var users=us?JSON.parse(us):[] 
  export default {
    name: 'mdp-select-user-xm',
    components: { UsersSelect, XmGroupSelectForProject,XmGroupSelectForProduct },
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

          
          
        return obj;
      }
    },
    data(){
        return {
            myVal:{userid:'',username:'',headimgurl:''}, 
            users:[],
            deptUserVisible:false,
            projectVisible:false,
            productVisible:false,
        }
    },
    watch:{ 
        value:{  
          handler(){ 
             this.initData();
          },
          deep:true,
          immediate:true,
           
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
      size:{
          type:String,
          default:'small',// medium/small/mini	 
      },
        projectId:{
          type:String,
          default:''
        },
      
        productId:{
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
               if(v.userid){
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

         initData(){    

            var myVal={userid:'',username:'',headimgurl:''}
            if(this.value){
          
              myVal.userid=this.value[this.useridKey]
              myVal.username=this.value[this.usernameKey]  
              myVal.headimgurl=this.value.headimgurl
              this.myVal={...myVal}
            }else{
              this.myVal={...myVal}
            }
           
          
      }, 
        onSelectChange(item){
          this.onChange([item])
        },
        onChange(data){   
          this.$emit('change',data)
        },
        onTeamUsersConfirm(users){
          this.onChange(users)
          this.myVal=users[0]
          this.projectVisible=false;
          this.productVisible=false; 
          this.deptUserVisible=false;
          var notHad=false;
           users.forEach(u=>{
            if(u.obranchId && !u.branchId){
              u.branchId=u.obranchId
              u.branchName=u.obranchName
            }
					 if(!this.users.some(k=>k.userid==u.userid)){
						 notHad=true;
						 this.users.unshift(u)
					 }
				 })
				 if(notHad){ 
					 var us=JSON.stringify(this.users)
				 	localStorage.setItem("mdp-his-users",us)
				 }
        },
         
    },
    mounted(){  
			this.users=users
      //this.initData();

    }
  }
  </script>
  
<style lang="scss" scoped>  
  @import '@/components/Mdp/index.scss';
</style>
 
  