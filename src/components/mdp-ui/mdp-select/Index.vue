<template> 
<span>
  <span v-if="showStyle=='origin'||showStyle==''||!showStyle" :title="title||placeholder">
    <el-select v-if="showType=='select'"  :multiple-limit="multipleLimit" :auto-complete="autoComplete" :filter-method="filterMethod" :collapse-tags="collapseTags" :filterable="filterable" :name="name" :no-data-text="noDataText" :no-match-text="noMatchText" :popper-class="popperClass" :reserve-keyword="reserveKeyword" :size="size" :multiple="multiple" :placeholder="placeholder" :disabled="disabled" :style="{width:width?width+'':'auto'}" class="my-select" ref="selectRef" v-model="myVal" @change="onChange" :clearable="clearable" @visible-change="$emit('visible-change',$event)" @focus="$emit('focus',$event)" @blur="$emit('blur',$event)" @clear="$emit('clear',$event)" @click="$emit('click',$event)" @remove-tag="$emit('remove-tag',$event)">
        <slot>
          
            <el-option disabled value="" style="margin-bottom:5px;" v-if="itemCode">
              <el-row><el-button @click.stop="$refs['mdpMetaDialog'].open({itemCode:itemCode})" icon="el-icon-setting">配置字典</el-button></el-row>
            </el-option>
            <el-option :style="styleObj" v-for="(option,index) in optionsCpd" :key="index" :value="option.id" :label="option.name"> 
            <slot :option="option" :item="item"> 
                    <span :style="{backgroundColor:getMyColor(option)}" class="padding el-tag--dark">  
                            <i  :class="getMyIcon(option)" ></i> 
                        {{option.name}}
                    </span>  
                    <i v-if="isCheck(option)" class="el-icon-check"></i> 
                    <i v-else>&nbsp;&nbsp;</i> 
            </slot>
            </el-option>
            
        </slot>
    </el-select>  
    <span v-else-if="showType=='radio'">
        <el-radio :size="size" v-for="(option,index) in optionsCpd" v-model="myVal" :label="option.id" :key="index" @change="onChange" @focus="$emit('focus',$event)" @blur="$emit('blur',$event)" @clear="$emit('clear',$event)" @click="$emit('click',$event)">{{ option.name }}</el-radio> 
    </span>
    <span v-else-if="showType=='checkbox' && multiple==true">  
        <el-checkbox-group :size="size" v-model="myVal" @change="onChange" @focus="$emit('focus',$event)" @blur="$emit('blur',$event)" @clear="$emit('blur',$event)" @click="$emit('click',$event)">
            <el-checkbox  v-for="(option,index) in optionsCpd"  :label="option.id"  :key="index" :disabled="disabled">{{ option.name }}</el-checkbox > 
        </el-checkbox-group>
    </span>
    <span v-else-if="showType=='checkbox' && multiple==false">
            <el-checkbox :size="size" v-if="optionsCpd && optionsCpd.length>1" v-model="myVal" @change="onChange" :true-label="optionsCpd[0].id" :false-label="optionsCpd[1].id" @focus="$emit('focus',$event)" @blur="$emit('blur',$event)" @clear="$emit('clear',$event)" @click="$emit('click',$event)">{{ optionsCpd[0].name }}</el-checkbox > 
    </span>   
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
              <div>{{ noMatchText || '无'}}</div>
            </div> 
            <div v-else class="field-value">
              <div  v-if="sels">
                {{ sels.name }}
              </div>
              <div v-else-if="myVal">
                {{ myVal }}
              </div>
              <div v-else>{{ noMatchText || '无'}}</div>
            </div>
            <div class="field-label">{{ label||title||placeholder ||'无' }}</div>
          </span>
          <span v-else>
            <div v-if="multiple===true">
              <div v-if="sels && sels.length>0">
                <el-tag :size="size" v-for="option,idx in sels" :key="idx" :color="option.color" :closable="closable" :effect="effect">{{ option.name }}</el-tag>
              </div>
              <div v-else-if="myVal && myVal.length>0">
                <el-tag :size="size" v-for="id,idx in myVal" :key="idx" :color="getMyColor({id:id})" :closable="closable" :effect="effect">{{ id }}</el-tag>
              </div>
              <el-tag v-else>{{  noMatchText ||'无' }}</el-tag>
            </div> 
            <div v-else>
                <el-tag  :size="size" v-if="sels" :color="sels.color" :closable="closable" :effect="effect">{{sels.name||noMatchText}}</el-tag>
                <el-tag  :size="size" v-else-if="myVal">{{ myVal }}</el-tag>
                <el-tag   v-else>{{ noMatchText ||'无'}}</el-tag>
            </div>
          </span> 
        </slot>
      </span>
      <span class="field-oper" :class="{disabled:disabled===true,enabled:disabled!==true,hidden:true}">
        <slot name="oper">
          <el-select :multiple="multiple" :multiple-limit="multipleLimit" :auto-complete="autoComplete" :filter-method="filterMethod" :collapse-tags="collapseTags" :filterable="filterable" :name="name" :no-data-text="noDataText" :no-match-text="noMatchText" :popper-class="popperClass" :reserve-keyword="reserveKeyword" :size="size" v-if="showType=='select'" :style="{width:width?width+'':'auto'}" class="my-select" ref="selectRef" v-model="myVal" @change="onChange" :clearable="clearable" @visible-change="$emit('visible-change',$event)" @focus="$emit('focus',$event)" @blur="$emit('blur',$event)" @clear="$emit('blur',$event)" @click="$emit('click',$event)" @remove-tag="$emit('remove-tag',$event)">
              <slot>
                
                <el-option disabled value="" style="margin-bottom:5px;" v-if="itemCode">
                    <el-row><el-button @click.stop="$refs['mdpMetaDialog'].open({itemCode:itemCode})" icon="el-icon-setting">配置字典</el-button></el-row>
                  </el-option>
                  <el-option :style="styleObj" v-for="(option,index) in optionsCpd" :key="index" :value="option.id" :label="option.name"> 
                  <slot :option="option" :item="item"> 
                          <span :style="{backgroundColor:option.color}" class="padding el-tag--dark">  
                                  <i  :class="option.icon" ></i> 
                              {{option.name}}
                          </span>  
                          <i v-if="isCheck(option)" class="el-icon-check"></i> 
                          <i v-else>&nbsp;&nbsp;&nbsp;</i> 
                  </slot>
                  </el-option>
              </slot>
          </el-select>   
          <div v-else-if="showType=='radio'">
              <el-radio :size="size" v-for="(option,index) in optionsCpd" v-model="myVal" @input="onChange" :label="option.id" :key="index" @focus="$emit('focus',$event)" @blur="$emit('blur',$event)" @clear="$emit('clear',$event)" @click="$emit('click',$event)">{{ option.name }}</el-radio> 
          </div>
          <div v-else-if="showType=='checkbox' && multiple==true"> 
              <el-checkbox-group :size="size" v-model="myVal" @change="onChange" @focus="$emit('focus',$event)" @blur="$emit('blur',$event)" @clear="$emit('blur',$event)" @click="$emit('click',$event)">
                  <el-checkbox  v-for="(option,index) in optionsCpd"  :label="option.id" :key="index">{{ option.name }}</el-checkbox > 
              </el-checkbox-group>
          </div>
          <div v-else-if="showType=='checkbox' && multiple==false">
                  <el-checkbox :size="size" v-if="optionsCpd.length>1" v-model="myVal" @change="onChange" :true-label="optionsCpd[0].id" :false-label="optionsCpd[1].id" @focus="$emit('focus',$event)" @blur="$emit('blur',$event)" @clear="$emit('clear',$event)" @click="$emit('click',$event)">{{ optionsCpd[0].name }}</el-checkbox > 
          </div>  
        </slot>
      </span>
    </span>
  </span>
  <mdp-dialog ref="mdpMetaDialog">
    <template v-slot="{visible,data}">
      <mdp-meta-item v-if="data.itemCode" :visible="visible" sub-op-type="mng" :item-code="data.itemCode" @form-submit="onDictSubmit" @option-form-submit="onDictSubmit">

      </mdp-meta-item>
    </template>
  </mdp-dialog>
</span>
</template> 

<script> 
import {MdpSelectMixin} from "../mixin/MdpSelectMixin.js"
export default {
  name: 'mdp-select',
  mixins:[MdpSelectMixin], 
  mathod:{
    onDictSubmit(){
      this.clearCache()
      this.initItemOptions()
    }
  },
  mounted(){
      this.initData();
      this.initItemOptions();
  },
  
}
</script>
<style lang="scss" scoped>  
  @import '../index.scss';
  .my-select{
    width:120px;
  }
</style> 
