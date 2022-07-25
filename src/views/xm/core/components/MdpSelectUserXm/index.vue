<template>    
    <el-row>
						<div class="field-box">  
							<el-avatar class="field-avater" :class="{'dashed-circle':avaterCpd.isNull}"  :icon="avaterCpd.icon" :style="{backgroundColor:avaterCpd.color}">{{avaterCpd.innerText}}</el-avatar> 
							
              <div class="field-info" :class="{disabled:disabled===true,enabled:disabled!==true}">
                <slot name="field-info" :value="myVal"  >
								<span class="field-value" v-if="!avaterCpd.isNull">{{avaterCpd.innerText}} </span>
								<span class="field-value" v-else><span class="label-font-color">无</span></span> 
                <slot name="label">
								  <span class="field-label">{{label}}</span> 
                </slot> 
                </slot>
							</div>  
              <div v-if="disabled!==true" class="field-oper" :class="{disabled:disabled===true,enabled:disabled!==true}">
                    <el-select v-model="myVal" @change="onSelectChange" :clearable="clearable" filterable value-key="userid">  
                          
                          <el-option :value="myVal" disabled v-if="users && users.length>10">
                              <el-row><el-button :type="deptUserVisible?'':'primary'" @click.stop="deptUserVisible=false">常用用户</el-button> <el-button :type="deptUserVisible?'primary':''"  @click.stop="deptUserVisible=true">部门用户</el-button><el-button v-if="projectId" :type="projectVisible?'primary':''"  @click.stop="projectVisible=true">项目组</el-button> </el-row>
                          </el-option>
                          <el-option class="avatar-container" v-for="(item,index) in users" :key="index" :value="item" :label="item.username">  
                          
                            <div class="avatar-wrapper">
                                  <el-avatar class="user-avatar"  :style="{backgroundColor:getMyColor(item)}">{{item.username}}</el-avatar> 
                                  <span class="username">{{item.username}}</span>
                                  <i v-if="myVal.userid==item.userid" class="el-icon-check"></i> 
                                  <i v-else>&nbsp;&nbsp;</i>  
                            </div>
                          </el-option> 
                          <el-option :value="myVal" disabled>
                              <el-row><el-button :type="deptUserVisible?'':'primary'" @click.stop="deptUserVisible=false">常用用户</el-button> <el-button :type="deptUserVisible?'primary':''"  @click.stop="deptUserVisible=true">部门用户</el-button><el-button v-if="projectId||productId" :type="projectVisible?'primary':''"  @click.stop="projectVisible=true">项目组</el-button> </el-row>
                          </el-option>
                      </el-select> 
                  </div>
						</div> 
            <el-dialog v-if="disabled!==true" :visible.sync="deptUserVisible" append-to-body top="20px" width="60%">
               <users-select :visible="deptUserVisible" :isSingleUser="true"  :isSelectByDept="true" @confirm="onConfirmUsers"></users-select>
            </el-dialog>
            
            <el-dialog v-if="disabled!==true" :visible.sync="projectVisible" append-to-body top="20px" width="60%">
               <xm-group-select :sel-project="{id:projectId}" :xm-product="{id:productId}" :isSelectSingleUser="true" @user-confirm="onProjectUsersConfirm"></xm-group-select>
            </el-dialog>
    </el-row>
  </template>
  
  <script>  
  
  import util  from '@/common/js/util';//全局公共库
  import UsersSelect from '@/views/mdp/sys/user/UsersSelectOnly.vue'
  import XmGroupSelect from '@/views/xm/core/xmGroup/XmGroupSelect.vue'
  export default {
    name: 'mdp-select-user-xm',
    components: { UsersSelect, XmGroupSelect },
    computed: { 
      avaterCpd(){  
        var isEmpty=this.isEmpty(this.myVal)
        var username=isEmpty?"":this.myVal.username?this.myVal.username:this.myVal.userid
        var obj={isNull:isEmpty,icon:'el-icon-user',color:'#E4E7ED',innerText:username} 
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
            myVal:null, 
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
              if(this.value[this.useridKey]){
                this.value[this.useridKey]=""
                this.value[this.usernameKey]=""
                this.$emit('input',this.value)
              }
             
            }else{
              if(this.value[this.useridKey]!=this.myVal.userid){ 
                this.value[this.useridKey]=this.myVal.userid
                this.value[this.usernameKey]=this.myVal.username 
                this.$emit('input',this.value) 
              }
            } 
        
      }
    },
    props: {
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
            myVal.userid=this.value[this.useridKey]
            myVal.username=this.value[this.usernameKey]  
            this.myVal=myVal
          
      }, 
        onSelectChange(item){
          this.onChange([item])
        },
        onChange(data){   
          this.$emit('change',data)
        },
        onProjectUsersConfirm(users){
          this.onChange(users)
          this.myVal=users[0]
          this.projectVisible=false;
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
  @import '@/components/Mdp/index.scss';
</style>
 
  