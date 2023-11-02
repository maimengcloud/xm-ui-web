<template> 
<span> 
  <span v-if="showStyle=='origin'" :title="title||placeholder||emptyText">
    <el-select collapse-tags :size="size" :multiple="multiple" :placeholder="placeholder" :disabled="disabled" :style="{width:width?width+'':'auto'}" class="my-select" ref="selectRef" v-model="myVal" @change="onChange" :clearable="clearable" @visible-change="$emit('visible-change',$event)" @focus="$emit('focus',$event)" @blur="$emit('blur',$event)" @clear="$emit('blur',$event)" @click="$emit('click',$event)">
        <slot> 
            <el-option disabled value="" style="margin-bottom:5px;">
              <el-row><el-button @click.stop="$refs['tagDialog'].open()" icon="el-icon-setting">更多标签</el-button></el-row>
            </el-option>
            <el-option class="avatar-container" v-for="(option,index) in optionsCpd" :key="index" :value="option[props['id']]" :label="option[props['name']]">  
            
            <div class="avatar-wrapper">
                  <el-avatar class="user-avatar"  :style="{backgroundColor:getMyColor(option)}">{{option[props['name']]}}</el-avatar> 
                  <span class="username">{{formatOptionName(option)}}</span> 
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
              <div v-else-if=" !myVal && myVal!=''">
                <el-tag :size="size" v-for="id,idx in myVal" :key="idx"  :closable="closable" :effect="effect">{{ id }}</el-tag>
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
          <el-select :size="size" collapse-tags :multiple="multiple"	:style="{width:width?width+'':'auto'}" class="my-select" ref="selectRef" v-model="myVal" @change="onChange" :clearable="clearable" @visible-change="$emit('visible-change',$event)" @focus="$emit('focus',$event)" @blur="$emit('blur',$event)" @clear="$emit('blur',$event)" @click="$emit('click',$event)">
              <slot>
                  <el-option disabled value="" style="margin-bottom:5px;">
                    <el-row><el-button @click.stop="$refs['tagDialog'].open()" icon="el-icon-setting">更多标签</el-button></el-row>
                  </el-option> 
                  <el-option class="avatar-container" v-for="(option,index) in optionsCpd" :key="index" :value="option[props['id']]" :label="option[props['name']]">  
                  
                    <div class="avatar-wrapper">
                          <el-avatar class="user-avatar"  :style="{backgroundColor:getMyColor(option)}">{{option[props['name']]}}</el-avatar> 
                          <span class="username">{{formatOptionName(option)}}</span> 
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
  
  <mdp-dialog ref="tagDialog" title="选择标签" width="80%">
      <template v-slot="{visible,data,dialog}">
        <tag-select :visible="visible" :multiple="multiple" @select="onTagSelect"></tag-select>
      </template>
    </mdp-dialog>
  </span>
</template> 

<script> 
import {MdpSelectMixin } from "../../mdp-ui/mixin/MdpSelectMixin.js"
import TagSelect from './TagSelect.vue'
var tagCacheList=[]
var lock=0;
export default {
  components: { TagSelect },
  name: 'mdp-select-tag',
  mixins:[MdpSelectMixin], 
  props:{
    props:{
      type:Object,
      default:function(){
        return {
          id:'tagId',
          name:'tagName'
        }
      },
    }, 
  },
  data(){
    return {
      sessionStorageKey:'mdp-common-arc-tag-list',
    }
  },
  methods:{
    
    initItemOptions(){   
      var that=this;
      let func=function(){
        if(tagCacheList && tagCacheList.length>0){
          that.item={itemType:'4',options:tagCacheList}
        }else{ 
          var tagsStr=sessionStorage.getItem(that.sessionStorageKey)
          if(tagsStr){
            var tags=JSON.parse(tagsStr)
            that.item={itemType:'4',options:tags}
            tagCacheList=tags
          }else{ 
            if(lock==0){
              lock=1
              that.$mdp.getAllTag({}).then(res=>{ 
                
                var tips = res.data.tips
                if(tips.isOk){
                  lock=2;
                  that.item={itemType:'4',options:res.data.data}
                  tagCacheList=res.data.data
                  sessionStorage.setItem(that.sessionStorageKey,JSON.stringify(tagCacheList))
                }else{
                  lock=3;
                  that.item={itemType:'4',options:[]}
                }
              })
            }else if(lock==1){
              setTimeout(()=>{
                func();
              },2000)
            }else if(lock==2){
              that.item={itemType:'4',options:tagCacheList}
            }
            
          }
        }
        
      }
      func();
    },
    onTagSelect(tags){  
      
      var props=this.props||{id:'tagId',name:'tagName'}
      if(this.multiple){
         tags.forEach(k=>{
          if(!this.optionsCpd.some(m=>m[props.id]==k[props.id])){
            this.item.options.unshift(k) 
          }
          if(!tagCacheList.some(m=>m[props.id]==k[props.id])){
            tagCacheList.unshift(k) 
          }
         })
         this.myVal=tags.map(k=>k[props['id']])
         this.onChange(this.myVal)
      }else{ 
        if(!this.optionsCpd.some(m=>m[props.id]==tags[props.id])){
          this.item.options.unshift(tags) 
        }
        if(!tagCacheList.some(m=>m[props.id]==tags[props.id])){
          tagCacheList.unshift(tags) 
        }
        this.myVal=tags[props['id']] 
        this.onChange(this.myVal)
      }
      this.onClose();
      this.$refs['tagDialog'].close();
    },
    formatOptionName(option){
      if(option['categoryName']){
        return option['categoryName']+'-'+option[this.props['name']]
      } else {
        return option[this.props['name']]
      }
    },
    onClose(){
    }
  },
  mounted(){
      this.initData();
      this.initItemOptions();
      
      
  },
  
  beforeDestroy(){ 
  }
}
</script>
<style lang="scss" scoped>  
  @import '../../mdp-ui/index.scss';
  .my-select{
    width:120px;
  }
</style> 
