<template>     
       <el-row class="border padding">
 
        <template>
        
          <slot name="query" :page="this">
            
        
        <el-row>
          <span  v-for="col,idx in commonColumnConfigs" :key="col.property+'_'+idx" > 
              <el-input style="width: 20%;" clearable  v-if="col.colType=='String'" v-model="filters[col.property]" :placeholder="col.label+'查询 输入 *陈* >10 <9 等'" title="支持>、<、 >=、<=、!=、*陈*、$IS NULL、$IN 1,2,3、between 1,5等操作符"/>
              <el-date v-else-if="col.colType=='Date'" type="date" placeholder="选择日期" v-model="filters[col.property]"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"/>
              <mdp-select  v-else-if="col.colType=='boolean' || col.colType=='Boolean'" type="radio" v-model="filters[col.property]" :disabled="disabledJudge(col.colType)" :options="[{id:'0',name:'否'},{id:'1',name:'是'}]"/>
              <el-input-number v-else-if="col.colType=='Number'" v-model="filters[col.property]"/>
              <el-input-number v-else-if="col.colType=='Integer' || col.colType=='int'" v-model="filters[col.property]" :precision="0" />
              <el-input style="width: 20%;" clearable v-else v-model="filters[col.property]" :placeholder="col.label+'查询 输入 *陈* >10 <9 等'" title="支持>、<、 >=、<=、!=、*陈*、$IS NULL、$IN 1,2,3、between 1,5等操作符"/>
                  &nbsp;&nbsp;
          </span>   
          <el-button v-loading="load.list" :disabled="load.list==true" @click="searchTableDatas()" icon="el-icon-search" type="primary">查询</el-button>
          <span style="float:right;" v-if="currOpType=='mng'">
              <el-button :disabled="disabledJudge('addBtn') || !checkBtnQx('addBtn',menuDefId) " type="primary" @click="showForm({parentOpType:currOpType,subOpType:'add',formData:addForm})" icon="el-icon-plus"> </el-button>
              <el-button :disabled="disabledJudge('delBtn') || !checkBtnQx('delBtn',menuDefId) || sels.length===0 || load.del==true" type="danger" v-loading="load.del" @click="batchDel" icon="el-icon-delete"></el-button>
          </span>
          <span style="float:right;" v-else-if="currOpType=='select' &&  multiple==true">
              <el-button :disabled="disabledJudge('selectBtn') || sels.length===0" type="primary" @click="selectListConfirm" icon="el-icon-check">确认选择</el-button>
          </span>
        
        </el-row>
        
      </slot>
    </template> 
        <el-row> 
            <mdp-hi-query :column-configs="columnConfigs" v-model="hiQueryParams" @change="onHiQueryParamsChange"/>
            <el-button type="text" icon="el-icon-zoom-out" @click="searchReset()">重置查询</el-button>&nbsp;&nbsp;&nbsp; 
        </el-row>
        <el-row>
          <!--列表 Role 角色管理-->
          <el-table :ref="refId+'Table'" :height="100" v-adaptive="{bottomOffset: bottomOffset}" :data="tableDatas" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
            <slot>
              <template  v-if="currOpType=='select' && multiple==true">
                <el-table-column type="selection" label="全选" />
              </template> 
             <template  v-for="col,idx in columnConfigs">
              <el-table-column :key="col.property+'_'+idx" :prop="col.property"  :label="col.label" min-width="120" show-overflow-tooltip :col-type="col.colType" v-if="showCol(col.property)">
                <template  slot-scope="scope">
                    <mdp-input show-style="tag" v-if="col.colType=='String'" v-model="scope.row[col.property]" :disabled="!edit||disabledJudge(col.colType)"/>
                    <mdp-date show-style="tag" v-else-if="col.colType=='Date'" type="date" placeholder="选择日期" v-model="scope.row[col.property]"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd" :disabled="!edit||disabledJudge(col.colType)"/>
                    <mdp-select show-style="tag"  v-else-if="col.colType=='boolean' || col.colType=='Boolean'" type="radio" v-model="scope.row[col.property]" :disabled="!edit||disabledJudge(col.colType)" :options="[{id:'0',name:'否'},{id:'1',name:'是'}]" />
                    <mdp-number show-style="tag" v-else-if="col.colType=='Number'" v-model="scope.row[col.property]" :disabled="!edit||disabledJudge(col.colType)"/>
                    <mdp-number show-style="tag" v-else-if="col.colType=='Integer' || col.colType=='int'" v-model="scope.row[col.property]" :precision="0" :disabled="!edit||disabledJudge(col.colType)"/>
                    <mdp-input show-style="tag" v-else v-model="scope.row[col.property]"  :disabled="!edit||disabledJudge(col.colType)"/>
                 </template>
              </el-table-column>
            </template>  
            <template v-if=" formDefId && showFormExpand">
              <mdp-column-expand :form-def-id="formDefId" :data-field="dataField"></mdp-column-expand>
            </template>
            </slot>
            <slot name="operColumn" :page="this"> 
            <el-table-column label="操作" :width="currOpType=='mng'?350:200" fixed="right">
                <template slot="header" slot-scope="scope">
                    <el-button icon="el-icon-download" @click="export2Excel()">导出</el-button>
                    <mdp-table-configs :column-configs="columnConfigs" v-model="checkedColumns"/>
                </template> 
                <slot name="moreOper" :page="this"> 
                </slot>
                <template scope="scope" v-if="currOpType=='mng'"  > 
                    <el-button :disabled="disabledJudge('editBtn') || !checkBtnQx('editBtn',menuDefId) " type="primary" @click="showForm({parentOpType:currOpType,subOpType:'edit',formData:scope.row})" icon="el-icon-edit" title="修改一条数据"></el-button>
                    <el-button :disabled="disabledJudge('addBtn') || !checkBtnQx('addBtn',menuDefId) " type="success" @click="copy(scope.row)" icon="el-icon-document-copy" title="拷贝并新增一条除了主键不一样其它都一样的数据"></el-button>
                    <el-button :disabled="disabledJudge('delBtn') || !checkBtnQx('delBtn',menuDefId) " type="danger" @click="handleDel(scope.row,scope.$index)" icon="el-icon-delete"  title="删除一条数据"></el-button>
                </template>

                <template scope="scope" v-else-if="currOpType=='list'" >
                    <el-button   type="primary" @click="showForm({parentOpType:currOpType,subOpType:'detail',formData:scope.row})" icon="el-icon-view"></el-button>
                </template>

                <template scope="scope" v-else-if="currOpType=='select' && multiple!=true" >
                    <el-button   type="primary" @click="selectConfirm(scope.row)" icon="el-icon-check">选择</el-button>
                </template>
            </el-table-column>  
          </slot>
          </el-table>
        </el-row> 
        <el-row>
          <el-pagination
            layout="slot,total, sizes, prev, next,pager,jumper"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
            :page-sizes="[10,20, 50, 100, 500]"
            :current-page="pageInfo.pageNum"
            :page-size="pageInfo.pageSize"
            :total="pageInfo.total"
            style="float:right;"
          > 
          </el-pagination>
        </el-row>
      </el-row>
 </template>

<script> 
import {MdpTableMixin} from "../mixin/MdpTableMixin.js"
export default {
  name: 'mdp-table',
  mixins:[MdpTableMixin], 
  computed:{
  },
  props:{   
    /**
     * 操作后台数据的api列表
     * crudApis:{
     *  list:xxxx,
     *  add: xxxx,
     *  edit: xxxx,
     *  del: xxxx,
     *  editSomeFields:xxx,
     * }
     */
    crudApis:{
      type:Object,
      default:null,
    },
    /**
     * 是否多选
     */
    multiple:{
      type:Boolean,
      default:false,
    },
    /**
     * 是否可以进行高级查询
     */
    showHiQuery:{
      type:Boolean,
      default:true
    },
    /**
     * 是否可以进行常规查询
     */
    showCommonQuery:{
      type: Boolean,
      default:true,
    },
    edit:{
      type:Boolean,
      default:false
    }
  },
  data(){
    return {  
      formDefId:'',
      commonQueryNum:3,

    }
  },
  methods:{

    initCurrData(){ 
      this.currOpType='select'
      if(!this.crudApis){
        //throw new Error("crudApis 不能为空");
      } 
      Object.assign(this.apis,this.crudApis)
      if(!this.columnCfgs || this.columnCfgs.length<=0){
        //throw new Error("columnCfgs不能为空，columnCfgs=[{property(必须),label(必须),colType,colPrefix,isCommon}]");
      } 
    },
    onPageShow(visible){ 
      if(visible==true){
        this.initCurrData();
        this.$nextTick(()=>{
          this.initTableColumnConfigs();
          this.searchTableDatas();
        })
      }
    },
    show(){
      this.pageShow=true;
    },
    selectConfirm:function(row){
        this.$emit('select',row)
        this.pageShow=false
    },
    selectListConfirm:function(){
        this.$emit('select',this.sels)
        this.pageShow=false
    },
  },
  mounted(){   
    this.pageShow=this.visible
    this.onPageShow(this.pageShow)
  },
  updated(){ 
    
  }
}
</script>
<style lang="scss" scoped>  
</style> 
