<template> 
<span> 
  <span v-if="showStyle=='origin'" :title="title||placeholder||emptyText">
    <el-select :size="size" :multiple="multiple" :placeholder="placeholder" :disabled="disabled" :style="{width:width?width+'':'auto'}" class="my-select" ref="selectRef" v-model="myVal" @change="onChange" :clearable="clearable" @visible-change="$emit('visible-change',$event)" @focus="$emit('focus',$event)" @blur="$emit('blur',$event)" @clear="$emit('blur',$event)" @click="$emit('click',$event)">
        <slot> 
            <el-option disabled value="" style="margin-bottom:5px;">
              <el-row><el-button @click.stop="$refs['deptUserDialog'].open()" icon="el-icon-user">部门用户</el-button><el-button v-if="projectId" @click.stop="$refs['projectUserDialog'].open()"  icon="el-icon-rank">项目组</el-button> </el-row>
            </el-option>
            <el-option class="avatar-container" v-for="(option,index) in optionsCpd" :key="index" :value="option[props['id']]" :label="option[props['name']]">  
            
            <div class="avatar-wrapper">
                  <el-avatar class="user-avatar"  :style="{backgroundColor:getMyColor(option)}">{{option[props['name']]}}</el-avatar> 
                  <span class="username">{{option[props['name']]}}</span> 
                  <i v-if="multiple==false &&  myVal && myVal==option[props['id']]" class="el-icon-check"></i> 
                  <i v-else>&nbsp;&nbsp;</i>  
            </div>
          </el-option> 
        </slot>
    </el-select>  
  </span>
  <span v-else :title="title||placeholder">
    <span :class="showStyle=='x'?{'field-box-x':true}:{'field-box':true}" @click="showSelect">
      <slot name="avater" class="field-avater" v-if="showStyle=='x'">
        
        <el-avatar :size="size"
          :class="{ 'dashed-circle': false }"
          :icon="avaterCpd.icon"
          :style="{ backgroundColor: avaterCpd.color }"
          >{{ avaterCpd.name }}</el-avatar> 
      </slot>

      <span class="field-info" :class="{disabled:disabled===true,enabled:disabled!==true,hidden:true}">
        <slot name="info">
          <span v-if="showStyle=='x'">
            <div v-if="multiple==true" class="field-value">
              <div  v-if="sels&&sels.length>0">
                {{ sels.map(k=>k.name).join(split) }}
              </div>
              <div class="field-value" v-else-if="myVal && myVal.length>0">
                {{ myVal.join(split) }}
              </div>
              <div>无</div>
            </div> 
            <div v-else class="field-value">
              <div  v-if="sels">
                {{ sels.name }}
              </div>
              <div v-else-if="myVal">
                {{ myVal }}
              </div>
              <div v-else>无</div>
            </div>
            <div class="field-label">{{ label||title||placeholder||emptyText ||'无' }}</div>
          </span>
          <span v-else>
            <div v-if="multiple===true">
              <div v-if="sels&&sels.length>0">
                <el-tag :size="size" v-for="option,idx in sels" :key="idx" :color="option.color" :closable="closable" :effect="effect">{{ option.name }}</el-tag>
              </div>
              <div v-else-if=" !myVal ">
                <el-tag :size="size" v-for="id,idx in myVal" :key="idx" :color="getMyColor({id:id})" :closable="closable" :effect="effect">{{ id }}</el-tag>
              </div>
              <el-tag v-else>{{  placeholder||emptyText ||'无' }}</el-tag>
            </div> 
            <div v-else>
                <el-tag  :size="size" v-if="sels" :color="sels.color" :closable="closable" :effect="effect">{{sels.name||emptyText}}</el-tag>
                <el-tag  :size="size" v-else-if="myVal">{{ myVal }}</el-tag>
                <el-tag   v-else>{{ placeholder||emptyText ||'无'}}</el-tag>
            </div>
          </span> 
        </slot>
      </span>
      <span class="field-oper" :class="{disabled:disabled===true,enabled:disabled!==true,hidden:true}">
        <slot name="oper">
          <el-select  :multiple="multiple" :size="size" :style="{width:width?width+'':'auto'}" class="my-select" ref="selectRef" v-model="myVal" @change="onChange" :clearable="clearable" @visible-change="$emit('visible-change',$event)" @focus="$emit('focus',$event)" @blur="$emit('blur',$event)" @clear="$emit('blur',$event)" @click="$emit('click',$event)">
              <slot>
                  <el-option disabled value="" style="margin-bottom:5px;">
                    <el-row><el-button @click.stop="$refs['deptUserDialog'].open()" icon="el-icon-user">部门用户</el-button><el-button v-if="projectId" @click.stop="$refs['projectUserDialog'].open()"  icon="el-icon-rank">项目组</el-button> </el-row>
                  </el-option> 
                  <el-option class="avatar-container" v-for="(option,index) in optionsCpd" :key="index" :value="option[props['id']]" :label="option[props['name']]">  
                  
                    <div class="avatar-wrapper">
                          <el-avatar class="user-avatar"  :style="{backgroundColor:getMyColor(option)}">{{option[props['name']]}}</el-avatar> 
                          <span class="username">{{option[props['name']]}}</span> 
                           <i v-if="multiple==false &&  myVal && myVal==option[props['id']]" class="el-icon-check"></i> 
                          <i v-else>&nbsp;&nbsp;</i>  
                    </div>
                </el-option> 
              </slot>
          </el-select>   
        </slot>
      </span>
    </span>
  </span>
  
  <mdp-dialog ref="deptUserDialog" title="选择部门用户" width="80%">
      <template v-slot="{visible,data,dialog}">
        <user-select :visible="visible" :multiple="multiple" @select="onUserSelect"></user-select>
      </template>
    </mdp-dialog>
    
  
  <mdp-dialog ref="projectUserDialog" title="选择项目用户" width="80%">
      <template v-slot="{visible,data,dialog}">
        <project-user-select :project-id="projectId" :visible="visible" :multiple="multiple" @select="onUserSelect"/>
      </template>
    </mdp-dialog>
  </span>
</template> 

<script> 
import {MdpSelectMixin } from "../../mdp-ui/mixin/MdpSelectMixin.js"
import UserSelect from './UserSelect.vue'
var userCacheList=[]
export default {
  components: { UserSelect },
  name: 'mdp-select-user',
  mixins:[MdpSelectMixin], 
  props:{
    props:{
      type:Object,
      default:function(){
        return {
          id:'userid',
          name:'username'
        }
      }
    },
    /**
     * 项目编号
     */
     projectId:{
      type:String,
      default:null,
    }, 
  },
  data(){
    return {
      localStorageKey:'mdp-common-user-list',
    }
  },
  methods:{
    
    initItemOptions(){  
      if(userCacheList && userCacheList.length>0){
        this.item={itemType:'4',options:userCacheList}
      }else{
        var usersStr=localStorage.getItem(this.localStorageKey)
        if(usersStr){
          var users=JSON.parse(usersStr)
          this.item={itemType:'4',options:users}
          userCacheList=users
        }else{
          this.item={itemType:'4',options:[]}
        }
      }
    },
    onUserSelect(users){
      var props=this.props||{id:'userid',name:'username'}
      if(this.multiple){
         users.forEach(k=>{
          if(!this.optionsCpd.some(m=>m[props.id]==k[props.id])){
            this.item.options.unshift(k) 
          }
          if(!userCacheList.some(m=>m[props.id]==k[props.id])){
            userCacheList.unshift(k) 
          }
         })
         this.myVal=users.map(k=>k[props['id']])
         this.onChange(this.myVal)
      }else{ 
        if(!this.optionsCpd.some(m=>m[props.id]==users[props.id])){
          this.item.options.unshift(users) 
        }
        if(!userCacheList.some(m=>m[props.id]==users[props.id])){
          userCacheList.unshift(users) 
        }
        this.myVal=users[props['id']] 
        this.onChange(this.myVal)
      }
      this.onClose();
      this.$refs['deptUserDialog'].close();
    },
    onClose(){
      localStorage.setItem(this.localStorageKey,JSON.stringify(userCacheList));
    }
  },
  mounted(){
      this.initData();
      this.initItemOptions();
      
      
  },
  
  beforeDestroy(){ 
    localStorage.setItem(this.localStorageKey,JSON.stringify(userCacheList));
  }
}
</script>
<style lang="scss" scoped>  
  @import '../../mdp-ui/index.scss';
  .my-select{
    width:120px;
  }
</style> 
