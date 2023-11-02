<template> 
<span> 
  <span v-if="showStyle=='origin'" :title="title||placeholder||emptyText">
    <el-select :size="size" :multiple="multiple" :placeholder="placeholder" :disabled="disabled" :style="{width:width?width+'':'auto'}" class="my-select" ref="selectRef" v-model="myVal" @change="onChange" :clearable="clearable" @visible-change="$emit('visible-change',$event)" @focus="$emit('focus',$event)" @blur="$emit('blur',$event)" @clear="$emit('blur',$event)" @click="$emit('click',$event)">
        <slot> 
            <el-option disabled value="" style="margin-bottom:5px;">
              <el-row><el-button @click.stop="$refs['cateDialog'].open()" icon="el-icon-setting">分类树</el-button></el-row>
            </el-option>
            <el-option class="avatar-container" v-for="(option,index) in optionsCpd" :key="index" :value="option[props['id']]" :label="option[props['name']]">  
            
            <div class="avatar-wrapper">
                  <el-avatar class="user-avatar"  :style="{backgroundColor:getMyColor(option)}">{{option[props['name']]}}</el-avatar> 
                  <span class="username">{{option[props['name']]}}</span> 
                  <i v-if="multiple==true &&  myVal && myVal.some(k=>k==option[props['id']])" class="el-icon-check"></i> 
                  <i v-else-if="multiple==false &&  myVal && myVal==option[props['id']]" class="el-icon-check"></i> 
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
              <div v-else-if="!myVal && myVal!=''">
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
          <el-select :size="size" :style="{width:width?width+'':'auto'}" class="my-select" ref="selectRef" v-model="myVal" @change="onChange" :clearable="clearable" @visible-change="$emit('visible-change',$event)" @focus="$emit('focus',$event)" @blur="$emit('blur',$event)" @clear="$emit('blur',$event)" @click="$emit('click',$event)">
              <slot>
                  <el-option disabled value="" style="margin-bottom:5px;">
                    <el-row><el-button @click.stop="$refs['cateDialog'].open()">分类树</el-button></el-row>
                  </el-option> 
                  <el-option class="avatar-container" v-for="(option,index) in optionsCpd" :key="index" :value="option[props['id']]" :label="option[props['name']]">  
                  
                    <div class="avatar-wrapper">
                          <el-avatar class="user-avatar"  :style="{backgroundColor:getMyColor(option)}">{{option[props['name']]}}</el-avatar> 
                          <span class="username">{{option[props['name']]}}</span> 
                          <i v-if="multiple==true &&  myVal && myVal.some(k=>k==option[props['id']])" class="el-icon-check"></i> 
                          <i v-else-if="multiple==false &&  myVal && myVal==option[props['id']]" class="el-icon-check"></i> 
                          <i v-else>&nbsp;&nbsp;</i>  
                    </div>
                </el-option> 
              </slot>
          </el-select>   
        </slot>
      </span>
    </span>
  </span>
  
  <mdp-dialog ref="cateDialog" title="选择分类" width="80%">
      <template v-slot="{visible,data,dialog}">
        <mdp-cate-tree :crely-type="crelyType" :crely-id="crelyId" :crely-stype="crelyStype" :crely-sid="crelySid" show-confirm :visible="visible" showFilter :multiple="multiple"  show-checkbox :expand-on-click-node="false" @confirm="onCateSelect"/>
      </template>
    </mdp-dialog>
  </span>
</template> 

<script> 
import {MdpSelectMixin } from "../../mdp-ui/mixin/MdpSelectMixin.js" 

 var cateCacheList=[]
export default {
  components: {   },
  name: 'mdp-select-cate',
  mixins:[MdpSelectMixin], 
  props:{
    
			/**
			 * 上级分类
			 */
			pid:{
				type:String,
				default:''
			},
			crelyType:{
				type:String,
				default:''
			},
			crelyId:{
				type:String,
				default:''
			},
			crelyStype:{
				type:String,
				default:'',
			},
			crelySid:{
				type:String,
				default:''
			}
  },
  data(){
    return {
      localStorageKey:'mdp-common-cate-list',
    }
  },
  methods:{
    
    initItemOptions(){  
      if(cateCacheList && cateCacheList.length>0){
        this.item={itemType:'4',options:cateCacheList}
      }else{
        var catesStr=localStorage.getItem(this.localStorageKey)
        if(catesStr){
          var cates=JSON.parse(catesStr)
          this.item={itemType:'4',options:cates}
          cateCacheList=cates
        }else{
          this.item={itemType:'4',options:[]}
        }
      }
    },
    onCateSelect(cates){   
      var props=this.props||{id:'id',name:'name'}
      if(this.multiple){
         cates.forEach(k=>{
          if(!this.optionsCpd.some(m=>m[props.id]==k[props.id])){
            this.item.options.unshift(k) 
          }
          if(!cateCacheList.some(m=>m[props.id]==k[props.id])){
            cateCacheList.unshift(k) 
          }
         })
         this.myVal=cates.map(k=>k[props['id']])
         this.onChange(this.myVal)
      }else{ 
        if(!this.optionsCpd.some(m=>m[props.id]==cates[props.id])){
          this.item.options.unshift(cates) 
        }
        if(!cateCacheList.some(m=>m[props.id]==cates[props.id])){
          cateCacheList.unshift(cates) 
        }
        this.myVal=cates[props['id']] 
        this.onChange(this.myVal)
      }
      this.onClose();
      this.$refs['cateDialog'].close();
    },
    onClose(){
      localStorage.setItem(this.localStorageKey,JSON.stringify(cateCacheList));
    }
  },
  mounted(){
      this.initData();
      this.initItemOptions();
      
      
  },
  
  beforeDestroy(){ 
    localStorage.setItem(this.localStorageKey,JSON.stringify(cateCacheList));
  }
}
</script>
<style lang="scss" scoped>  
  @import '../../mdp-ui/index.scss';
  .my-select{
    width:120px;
  }
</style> 
