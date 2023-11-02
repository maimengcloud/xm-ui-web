<template> 
  <span> 
    <span v-if="showStyle=='origin'" :title="title||placeholder||emptyText">
      <el-select :size="size" :multiple="multiple" :placeholder="placeholder" :disabled="disabled" :style="{width:width?width+'':'auto'}" class="my-select" ref="selectRef" v-model="myVal" @change="onChange" :clearable="clearable" @visible-change="$emit('visible-change',$event)" @focus="$emit('focus',$event)" @blur="$emit('blur',$event)" @clear="$emit('blur',$event)" @click="$emit('click',$event)">
          <slot> 
              <el-option disabled value="" style="margin-bottom:5px;">
                <el-row><el-button @click.stop="$refs['tableDialog'].open()" icon="el-icon-search">更多数据</el-button> </el-row>
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
                      <el-row><el-button @click.stop="$refs['tableDialog'].open()" icon="el-icon-search">更多数据</el-button> </el-row>
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
    <mdp-dialog ref="tableDialog" title="选择数据" width="80%">
        <template v-slot="{visible,data,dialog}">
           <mdp-table :multiple="multiple" sub-op-type="select" :visible="visible" :crud-apis="{list:loadFun}" :props="props" :column-cfgs="columnConfigs" @select="onTableDataSelect"> 
          </mdp-table>
        </template>
      </mdp-dialog>
    </span>
  </template> 
  
  <script> 
  import {MdpSelectMixin } from "../../mdp-ui/mixin/MdpSelectMixin.js"
   var tableDataCacheMap=new Map();
  export default {
    components: {  },
    name: 'mdp-select-table',
    mixins:[MdpSelectMixin], 
    computed:{
      columnConfigs(){
        if(this.columnCfgs && this.columnCfgs.length>0){
          return this.columnCfgs
        }else{
          var props=this.props
          if(!props){
            props={id:'id',name:'name'}
          } 
          var idColumn={property:props['id'],label:'编号'}
          var nameColumn={property:props['name'],label:'名称'}
          var columnConfigs=[]
          columnConfigs.push(idColumn)
          columnConfigs.push(nameColumn)
          return columnConfigs; 
        }
      }
    },
    props:{
      columnCfgs:{
        type:Array,
        default:null,
      }
    },
    data(){
      return { 
      }
    },
    methods:{
      getCacheList(){
        var tableDataCacheList=tableDataCacheMap.get(this.codeKey)
        if(!tableDataCacheList){
          tableDataCacheList=[]
          tableDataCacheMap.set(this.codeKey,tableDataCacheList)
        }
        return tableDataCacheList
      },
      setCacheList(datas){
        
        var tableDataCacheList=tableDataCacheMap.get(this.codeKey)
        if(!tableDataCacheList){
          tableDataCacheList=[] 
        }
        var notExists=datas.filter(d=>!tableDataCacheList.some(c=>c[this.props['id']]==d[this.props['id']]))
        tableDataCacheList.push(...notExists)
        tableDataCacheMap.set(this.codeKey,tableDataCacheList)
      },
      initItemOptions(){   
        
        var tableDataCacheList=this.getCacheList();
        if(tableDataCacheList && tableDataCacheList.length>0){
          this.item={itemType:'4',options:tableDataCacheList}
        }else{
          var tableDatasStr=localStorage.getItem(this.codeKey)
          if(tableDatasStr){
            var tableDatas=JSON.parse(tableDatasStr)
            this.item={itemType:'4',options:tableDatas}
            this.setCacheList(tableDatas)
          }else{
            this.item={itemType:'4',options:[]}
          }
        }
        if(this.value){
          var mVals=[]
            if(this.value instanceof Array){
              mVals=this.value
            }else if(this.value instanceof String){
              mVals=this.value.split(this.split)
            }
            var notExistsVals=mVals.filter(v=>!this.item.options.some(k=>k[this.props['id']]==v))
            if(notExistsVals && notExistsVals.length>0){
              var params={pageSize:10,pageNum:1}
              params[this.props['id']]="$IN"+notExistsVals.join(",")
              this.loadFun(params).then(res=>{
                var tips = res.data.tips
                if(tips.isOk && res.data.data.length>0){
                  this.item.options.push(...res.data.data)
                  this.setCacheList(res.data.data)
                }
              })
            }
        }
      },
      onTableDataSelect(tableDatas){
        var props=this.props 
        this.setCacheList(tableDatas)
        if(this.multiple){
           tableDatas.forEach(k=>{
            if(!this.optionsCpd.some(m=>m[props.id]==k[props.id])){
              this.item.options.unshift(k) 
            } 
           })
           this.myVal=tableDatas.map(k=>k[props['id']])
           this.onChange(this.myVal)
        }else{ 
          if(!this.optionsCpd.some(m=>m[props.id]==tableDatas[props.id])){
            this.item.options.unshift(tableDatas) 
          } 
          this.myVal=tableDatas[props['id']] 
          this.onChange(this.myVal)
        }
        this.onClose();
        this.$refs['tableDialog'].close();
      },
      onClose(){
        var tableDataCacheList=this.getCacheList();
        localStorage.setItem(this.codeKey,JSON.stringify(tableDataCacheList));
      },
       
    },
    mounted(){
        this.initData();
        this.initItemOptions();
        
        
    },
    
    beforeDestroy(){ 
      var tableDataCacheList=this.getCacheList();
      localStorage.setItem(this.codeKey,JSON.stringify(tableDataCacheList));
    }
  }
  </script>
  <style lang="scss" scoped>  
    @import '../../mdp-ui/index.scss';
    .my-select{
      width:120px;
    }
  </style> 
  