<template>    
    <el-row>
						<div class="field-box">  
							<el-avatar class="avater" :icon="getMyIcon(myVal)" :style="{backgroundColor:getMyColor(myVal)}">{{getMyAvaterInfo(myVal)}}</el-avatar> 
							
              <div class="field-info">
                <slot name="field-info" :value="myVal">
								<span class="field-value">{{showMyValue( myVal )}} </span>
                <slot name="label">
								  <span class="field-label">{{label}}</span>
                </slot>
                </slot>
							</div>   
							<div v-if="disabled!==true" class="my-select" name="select" :value="myVal">
                 <el-select v-model="myVal" @change="onSelectChange" :clearable="clearable" filterable>  
                      
                      <el-option value="" disabled v-if="users && users.length>10">
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
                      <el-option value="" >
                          <el-row><el-button :type="deptUserVisible?'':'primary'" @click.stop="deptUserVisible=false">常用用户</el-button> <el-button :type="deptUserVisible?'primary':''"  @click.stop="deptUserVisible=true">部门用户</el-button><el-button v-if="projectId" :type="projectVisible?'primary':''"  @click.stop="projectVisible=true">项目组</el-button> </el-row>
                      </el-option>
                  </el-select> 
              </div>
						</div> 
            <el-dialog :visible.sync="deptUserVisible" append-to-body top="20px" width="60%">
               <users-select :visible="deptUserVisible" :isSingleUser="true"  :isSelectByDept="true" @confirm="onConfirmUsers"></users-select>
            </el-dialog>
            
            <el-dialog :visible.sync="projectVisible" append-to-body top="20px" width="60%">
               <xm-group-select :sel-project="{id:projectId}" :isSelectSingleUser="true" @user-confirm="onProjectUsersConfirm"></xm-group-select>
            </el-dialog>
    </el-row>
  </template>
  
  <script>  
  
  import util  from '@/common/js/util';//全局公共库
  import UsersSelect from '@/views/mdp/sys/user/UsersSelectOnly.vue'
  import XmGroupSelect from '@/views/xm/core/xmGroup/XmGroupSelect.vue'
  export default {
    name: 'user-field',
    components: { UsersSelect, XmGroupSelect },
    computed: { 
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
          }
           
        },  
        
      myVal(){
        if(this.value instanceof String){
               this.$emit('input',this.myVal)
          }else if(this.value instanceof Object){
            if(!this.myVal||!this.myVal.userid){
              if(this.value[this.useridKey]){
                this.value[this.useridKey]=""
                this.value[this.usernameKey]=""
                this.$emit('input',this.value)
              }
             
            }else{
              if(this.value[this.useridKey]!=this.myVal.userid){ 
                this.value[this.useridKey]=this.myVal.userid
                this.value[this.usernameKey]=this.myVal.userid 
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
      showMyValue(myVal){
        if(!myVal){
          return ""
        }else{
         if(this.value instanceof String){
               return myVal
          }else if(this.value instanceof Object){
            if(!myVal||!myVal.userid){
              return ""
            }
            if(myVal.username){
              return myVal.username
            }else if(myVal.userid){
              return myVal.userid
            }else{
              return ""
            }
          }
        }
      },
        getMyAvaterInfo(item){
          return this.showMyValue(item)
        },
        getMyColor(item){
           if(this.value instanceof String){ 
            if(item){
            
              if(this.getColor){
                  return this.getColor(item)
              } 
              return util.getColor(item)
              
            }else{
              if(this.getColor){
                  return this.getColor("0")
              }else{
                return util.getColor(0)
              }
            }


          }else if(this.value instanceof Object){

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
           if(this.value instanceof String){
              this.myVal=this.value
          }else if(this.value instanceof Object){
            this.myVal={}
            this.myVal.userid=this.value[this.useridKey]
            this.myVal.username=this.value[this.usernameKey] 
          }
          
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
 


.field-box {  
    display: flex;
    margin-right:5px;
    align-items: center;
	  cursor: pointer;
    .avater { 
		  background-color:#FF9F73;
    }

    .field-info {
        margin-left: 10px;
        display: flex;
        flex-direction: column;
        .field-value {  
            font-size: 16px;  
        } 
        .field-label{   
          font-size: 14px;
          color: #C0C4CC;
        }
        
    }
	.my-select{
    margin-left: 5px;
    margin-right:5px;
    max-width: 120px;
		display: none;  
	}
	.btn{
		margin-top: 0px;
		visibility:hidden; 
	} 
	 
}
 .field-box:hover .btn{
		visibility: visible !important;
}
 .field-box:hover .my-select{
  
    margin-left: 5px;
    display: inline;
} 



.avatar-container {
    height: 50px;
    display: flex;
    align-items: center;
    .avatar-wrapper {
        cursor: pointer;
        display: flex;
        flex-direction: row;
        align-items: center;
        .user-avatar {
            height: 34px;
            width: 34px;
            border-radius: 50%;
            margin-right: 12px;
        }
        .username{
            color: #7D7D7D;
            font-size: 14px; 
        }
        .el-icon-caret-bottom {
            font-size: 22px;
        }
    }
}
</style>
  