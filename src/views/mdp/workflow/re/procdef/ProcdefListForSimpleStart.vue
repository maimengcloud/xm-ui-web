<template>
  <section>
    <el-row v-if="flowStartVisible==false" class="page-container border">
      <el-row class="page-header">
        <el-input v-model="filters.key" style="width:270px;" placeholder="模糊查询">
        </el-input>
        <el-button type="primary" v-loading="listLoading" :disabled="listLoading" v-on:click="searchProcdefs"
                   icon="el-icon-search">查询</el-button>
        <el-tag type="info" v-if="this.procdefs.length==0">如果没有找到流程，请将业务编码【{{this.filters.params.bizKey}}】与流程进行关联
        </el-tag>
      </el-row>
      <el-row class="page-main">
        <!--列表 Procdef act_re_procdef-->
        <el-table ref="procdefsTable" :height="tableHeight" :data="procdefs" highlight-current-row
          v-loading="listLoading" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
          <el-table-column type="selection" width="40"></el-table-column>
          <el-table-column type="index" width="40"></el-table-column>
          <el-table-column sortable prop="category" label="分类" min-width="80"></el-table-column>
          <el-table-column sortable prop="name" label="流程名称" min-width="200"></el-table-column>
          <el-table-column sortable prop="tagNames" label="标签" min-width="150">
            <template slot-scope="scope">
              <el-tag v-for="tagName in (scope.row.tagNames?scope.row.tagNames.split(','):[])" :key="tagName">
                {{tagName}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column sortable prop="description" label="描述" min-width="200"></el-table-column>
          <el-table-column sortable prop="version" label="版本" min-width="80"></el-table-column>
          <el-table-column label="操作" :min-width="screenWidth>=500?200:80" fixed="right">
            <template slot-scope="scope">

              <el-button v-show="isSelectModel" @click="rowClick(scope.row,scope.$index)">选中</el-button>
              <el-button type="primary" v-show="!isSelectModel" @click="showFlowStart(scope.row,scope.$index)">发起
              </el-button>
              <el-button class="hidden-sm-and-down" @click="showDiagram( scope.row,scope.$index)">流程图</el-button>

            </template>
          </el-table-column>
        </el-table>

        <el-pagination layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange"
          @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum"
          :page-size="pageInfo.pageSize" :total="pageInfo.total" style="float:right;">
        </el-pagination>

        <!--流程图界面-->
        <el-dialog title="流程图" :visible.sync="diagramVisible" width="80%" :close-on-click-modal="false">

          <el-image :fit="'contain'" :src="diagramUrl">
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline"></i>
            </div>
            <div slot="placeholder" class="image-slot">
              正在全力加载中。。。。。。。。。。<i class="el-icon-loading"></i>
            </div>
          </el-image>
        </el-dialog>
      </el-row>
    </el-row>
    <el-row v-else-if="flowStartVisible==true">
      <procinst-parames-start-set :procdef="addForm" :visible="flowStartVisible" :params="filters.params"
        @cancel="startCancel"></procinst-parames-start-set>
    </el-row>
  </section>
</template>

<script>
  import util from '@/common/js/util'; //全局公共库
  import config from '@/common/config'; //全局公共库
  //import { selectCacheOptions,getDefaultValue,getCodeName } from '../../../../../api/common/code';//下拉框数据查询
  import {
    listProcdef
  } from '@/api/mdp/workflow/re/procdef';
  import ProcinstParamesStartSet from "../../ru/procinstParames/ProcinstParamesStartSet"
  import Sticky from '@/components/Sticky' // 粘性header组件
  import {
    mapGetters
  } from 'vuex'
  export default {
    name: 'ProcdefListForBizStart',
    props: ['params', 'isSelectModel'],
    computed: {
      ...mapGetters([
        'userInfo'
      ]),
      screenWidth: function() {
        return screen.width;
      },
    },
    watch: {
      params: function(params) {

        this.filters.params = params;
        this.searchProcdefs();
      }
    },
    data() {
      return {
        filters: {
          key: '',
          procCategory: '',
          categoryTreeNodes: [],
          tags: [],

          params: {
            mainTitle: '',
            mainContext: '',
            bizUrl: '', //前端跳转  //自带参数，建议只带主键
            bizKey: '', //用于选中流程模型并原样输出到restUrl
            restUrl: '', //后端接口同步
            formId: '', //form 表单编号
            formDataId: '', //form表单对应的数据
            extVars: { //不用提交给工作流的变量池
            },
            flowVars: { //提交进流程实例变量的变量池,flowVars所有变量将post方式推送回restUrl指定的地址

            }

          }
        },
        procdefs: [], //查询结果
        pageInfo: { //分页数据
          total: 0, //服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
          pageSize: 10, //每页数据
          pageNum: 1, //当前页码、从1开始计算
          orderFields: [], //排序列 如 ['sex','student_id']，必须为数据库字段
          orderDirs: [], //升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
          count: true,
        },
        listLoading: false, //查询中...
        sels: [], //列表选中数据
        options: {}, //下拉选择框的所有静态数据 options.sex,options.project

        addFormVisible: false, //新增procdef界面是否显示
        //新增procdef界面初始化数据
        addForm: {
          id: '',
          rev: '',
          category: '',
          name: '',
          key: '',
          version: '',
          deploymentId: '',
          resourceName: '',
          dgrmResourceName: '',
          description: '',
          hasStartFormKey: '',
          hasGraphicalNotation: '',
          suspensionState: '',
          tenantId: '',
          engineVersion: ''
        },
        drawer: false,

        /**begin 自定义属性请在下面加 请加备注**/
        diagramVisible: false, //显示流程图
        diagramUrl: '', //显示流程图的路径
        flowStartVisible: false, //发起流程
        categorys: [],
        tagSelectVisible: false,
        isBatchSetProcTags: false,
        tableHeight: 300,
        /**end 自定义属性请在上面加 请加备注**/
      }
    }, //end data
    methods: {
      //获取代码对应的名称 用于数据反显 如 getCodeName(options.sex,'1');
      getCodeName(options, codeValue) {
        if (!options) return codeValue;
        let code = options.filter(i => i.codeValue == codeValue);
        if (code.length > 0) {
          return code[0].codeName
        } else {
          return codeValue
        }
      },

      dialogWidth: function() {
        if (screen.width > 500) {
          return "80%";
        } else {
          return "100%";
        }
      },
      handleSizeChange(pageSize) {
        this.pageInfo.pageSize = pageSize;
        this.pageInfo.total = 0;
        this.pageInfo.count = true
        this.pageInfo.pageNum = 1;
        this.getProcdefs();
      },
      handleCurrentChange(pageNum) {
        this.pageInfo.pageNum = pageNum;
        this.getProcdefs();
      },
      // 表格排序 obj.order=ascending/descending,需转化为 asc/desc ; obj.prop=表格中的排序字段,字段驼峰命名
      sortChange(obj) {
        var dir = 'asc';
        if (obj.order == 'ascending') {
          dir = 'asc'
        } else {
          dir = 'desc';
        }
        if (obj.prop == 'xxx') {
          this.pageInfo.orderFields = ['xxx'];
          this.pageInfo.orderDirs = [dir];
        }
        this.getProcdefs();
      },
      searchProcdefs() {
        this.pageInfo.pageNum = 1;
        this.pageInfo.total = 0;
        this.pageInfo.count = true
        this.getProcdefs();
      },

      //获取列表 Procdef act_re_procdef
      getProcdefs() {
        let params = {
          pageSize: this.pageInfo.pageSize,
          pageNum: this.pageInfo.pageNum,
          total: this.pageInfo.total,
          count: this.pageInfo.count
        };
        if (this.pageInfo.orderFields != null && this.pageInfo.orderFields.length > 0) {
          let orderBys = [];
          for (var i = 0; i < this.pageInfo.orderFields.length; i++) {
            orderBys.push(this.pageInfo.orderFields[i] + " " + this.pageInfo.orderDirs[i])
          }
          params.orderBy = orderBys.join(",")
        }
        if (this.filters.key !== "") {
          params.filtersKey = '%' + this.filters.key + '%'
        }
        if (this.filters.category !== "") {
          params.category = this.filters.category
        }
        if (this.filters.params.formId != "" && this.filters.params.formId != null) {
          params.formId = this.filters.params.formId
        }

        if (this.filters.procCategory != '' && this.filters.procCategory != null) {
          params.category = this.filters.procCategory
        }

        if (this.filters.categoryTreeNodes != null && this.filters.categoryTreeNodes.length > 0) {
          params.categoryIds = this.filters.categoryTreeNodes.map(i => i.id)
        }

        if (this.filters.tags != null && this.filters.tags.length > 0) {
          params.tagIds = this.filters.tags.map(i => i.tagId)
        }

        if (this.filters.params != null && this.filters.params.bizKey != null && this.filters.params.bizKey != '') {
          params.bizKey = this.filters.params.bizKey
        }
        params.tenantId = this.userInfo.branchId
        params.includeContext = "1";
        params.suspensionState = 1;
        this.listLoading = true;
        listProcdef(params).then((res) => {
          var tips = res.data.tips;
          if (tips.isOk) {
            this.pageInfo.total = res.data.total
            this.pageInfo.count = false
            if (res.data.data.length == 1) {
              this.addForm = res.data.data[0]
              this.flowStartVisible = true;
            } else if (res.data.data.length > 1) {
              this.flowStartVisible = false;
              this.$message.success("请选中一个流程")
            }
            this.procdefs = res.data.data;
          } else {
            this.$message({
              message: tips.msg,
              type: 'error'
            });
          }
          this.listLoading = false;
        }).catch(() => {
          this.listLoading = false;

        });
      },

      //选择行procdef
      selsChange: function(sels) {
        this.sels = sels;
      },

      rowClick: function(row, event, column) {
        this.$emit('row-click', row, event, column); //  @row-click="rowClick"
      },
      /**begin 自定义函数请在下面加**/

      showDiagram: function(row, index) {
        this.diagramVisible = true;
        this.diagramUrl = "/" + process.env.BASE_API + "/" + process.env.VERSION + "/" + config
        .getWorkflowBasePath() + "/mdp/workflow/re/procdef/diagram/" + row.id
      },
      showFlowStart: function(row, index) {
        this.addForm = row;
        this.flowStartVisible = true;


      },
      startCancel() {
        this.$emit("closeTab");
      }
      /**end 自定义函数请在上面加**/

    }, //end methods
    components: {
      //在下面添加其它组件
      'procinst-parames-start-set': ProcinstParamesStartSet,
      'sticky': Sticky,
    },
    mounted() {

      if (this.params) {
        this.filters.params = this.params;
        this.searchProcdefs();
      }
      this.$nextTick(() => {

        var clientRect = this.$refs.procdefsTable.$el.getBoundingClientRect();
        var subHeight = 60 / 1000 * window.innerHeight;
        this.tableHeight = window.innerHeight - clientRect.y - this.$refs.procdefsTable.$el.offsetTop - subHeight;
      })


    }
  }
</script>

<style scoped>
  .filters-show {
    margin-left: 20px;
    margin-top: 10px;
    margin-bottom: 0px;
  }

  .filters-label {
    font-size: 14px;
    color: black;
    font-weight: bold;
  }
</style>

<style>
  .el-input-group__append,
  .el-input-group__prepend {
    background-color: #409EFF !important;
    color: #ffffff !important;
    vertical-align: middle;
    display: table-cell;
    position: relative;
    border: 1px solid #409EFF !important;
    padding: 0 20px;
    width: 1px;
    white-space: nowrap;
  }
</style>
