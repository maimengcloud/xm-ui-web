<template>
  <section>
    <el-row class="page-container border">
      <el-row  class="page-header">
        <el-select v-model="filters.category" clearable filterable placeholder="请选择分类">
          <el-option v-for="item in categorys" :key="item" :label="item" :value="item"></el-option>
        </el-select>
        <el-input v-model="filters.key" style="width:270px;margin-right: 13px;" placeholder="模糊查询">
          <template slot="append">
            <el-button type="primary"   v-on:click="searchDeployments" icon="el-icon-search">查询</el-button>
          </template>
        </el-input>
        <el-button @click="handleDownload" icon="el-icon-download" style="">导出数据</el-button>
      </el-row>
      <el-row class="page-main">
        <!--列表 Deployment act_re_deployment-->
        <el-table
          ref="table" :height="tableHeight"
          :data="deployments"
          highlight-current-row
          v-loading="listLoading"
          border
          @selection-change="selsChange"
          @row-click="rowClick"
          style="width: 100%;"
        >
          <el-table-column type="selection" width="40"></el-table-column>
          <el-table-column type="index" width="40"></el-table-column>

          <el-table-column sortable prop="category" label="分类" min-width="80" show-overflow-tooltip></el-table-column>
          <el-table-column sortable prop="key" label="业务编码" min-width="150"  show-overflow-tooltip></el-table-column>
          <el-table-column sortable prop="name" label="发布包名" min-width="300"  show-overflow-tooltip></el-table-column>
          <el-table-column
            sortable
            prop="deployTime"
            label="发布时间"
            min-width="80"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column label="操作" width="150" fixed="right">
            <template slot-scope="scope">
              <el-button type="danger" @click="handleDel(scope.row,scope.$index)">下架当前版本</el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination
          layout="total, sizes, prev, pager, next"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          :page-sizes="[10,20, 50, 100, 500]"
          :current-page="pageInfo.pageNum"
          :page-size="pageInfo.pageSize"
          :total="pageInfo.total"
          style="float:right;"
        ></el-pagination>
        <!--显示某个发布包下包含的模型界面-->
        <el-dialog
          title="新增"
          :visible.sync="addFormVisible"
          width="50%"
          :close-on-click-modal="false"
        >
          <deployment-add
            :deployment="addForm"
            :visible="addFormVisible"
            @cancel="addFormVisible=false"
            @submit="afterAddSubmit"
          ></deployment-add>
        </el-dialog>
      </el-row>
    </el-row>
  </section>
</template>

<script>
import util from "../../../../../common/js/util"; //全局公共库
//import { selectCacheOptions,getDefaultValue,getCodeName } from '../../../../../api/common/code';//下拉框数据查询
import {
  listDeployment,
  delDeployment,
  batchDelDeployment
} from "../../../../../api/mdp/workflow/re/deployment";
import { listCategorys } from "@/api/mdp/workflow/re/procdef";
import Sticky from "@/components/Sticky"; // 粘性header组件
import { mapGetters } from "vuex";
export default {
  props: ["modelKey"],
  name: "DeploymentMng",
  computed: {
    ...mapGetters(["userInfo"])
  },
  watch: {
    modelKey: function(modelKey) {
      this.getDeployments();
    }
  },
  data() {
    return {
      filters: {
        key: "",
        category: ""
      },
      deployments: [], //查询结果
      pageInfo: {
        //分页数据
        total: 0, //服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
        pageSize: 10, //每页数据
        pageNum: 1, //当前页码、从1开始计算
        orderFields: ["res.key_"], //排序列 如 ['sex','student_id']，必须为数据库字段
        orderDirs: ["asc"] //升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
      },
      listLoading: false, //查询中...
      sels: [], //列表选中数据
      options: {}, //下拉选择框的所有静态数据 options.sex,options.project

      addFormVisible: false, //新增deployment界面是否显示
      //新增deployment界面初始化数据
      addForm: {
        id: "",
        name: "",
        category: "",
        tenantId: "",
        deployTime: "",
        key: "",
        engineVersion: ""
      },

      editFormVisible: false, //编辑界面是否显示
      //编辑deployment界面初始化数据
      editForm: {
        id: "",
        name: "",
        category: "",
        tenantId: "",
        deployTime: "",
        key: "",
        engineVersion: ""
      },
      categorys: [],
			tableHeight:300,
      /**begin 自定义属性请在下面加 请加备注**/

      /**end 自定义属性请在上面加 请加备注**/
    };
  }, //end data
  methods: {
    //获取代码对应的名称 用于数据反显 如 getCodeName(options.sex,'1');
    getCodeName(options, codeValue) {
      if (!options) return codeValue;
      let code = options.filter(i => i.codeValue == codeValue);
      if (code.length > 0) {
        return code[0].codeName;
      } else {
        return codeValue;
      }
    },
    handleSizeChange(pageSize) {
      this.pageInfo.pageSize = pageSize;
      this.pageInfo.total = 0;
      this.pageInfo.pageNum = 1;
      this.getDeployments();
    },
    handleCurrentChange(pageNum) {
      this.pageInfo.pageNum = pageNum;
      this.getDeployments();
    },
    // 表格排序 obj.order=ascending/descending,需转化为 asc/desc ; obj.prop=表格中的排序字段,字段驼峰命名
    sortChange(obj) {
      var dir = "asc";
      if (obj.order == "ascending") {
        dir = "asc";
      } else {
        dir = "desc";
      }
      if (obj.prop == "xxx") {
        this.pageInfo.orderFields = ["xxx"];
        this.pageInfo.orderDirs = [dir];
      }
      this.getDeployments();
    },
    searchDeployments() {
      this.pageInfo.pageNum = 1;
      this.pageInfo.total = 0;
      this.getDeployments();
    },
    //获取列表 Deployment act_re_deployment
    getDeployments() {
      let params = {
        pageSize: this.pageInfo.pageSize,
        pageNum: this.pageInfo.pageNum,
        total: this.pageInfo.total
      };
      if (
        this.pageInfo.orderFields != null &&
        this.pageInfo.orderFields.length > 0
      ) {
        let orderBys = [];
        for (var i = 0; i < this.pageInfo.orderFields.length; i++) {
          orderBys.push(
            this.pageInfo.orderFields[i] + " " + this.pageInfo.orderDirs[i]
          );
        }
        params.orderBy = orderBys.join(",");
      }
      if (this.filters.key !== "") {
        params.filtersKey = "%" + this.filters.key + "%";
      }

      if (this.modelKey !== "") {
        params.key = this.modelKey;
      }
      if (this.filters.category !== "") {
        params.category = this.filters.category;
      }
      params.tenantId = this.userInfo.branchId;
      this.listLoading = true;
      listDeployment(params)
        .then(res => {
          var tips = res.data.tips;
          if (tips.isOk) {
            this.pageInfo.total = res.data.total;
            this.deployments = res.data.data;
          } else {
            this.$message({ message: tips.msg, type: "error" });
          }
          this.listLoading = false;
        })
        .catch(() => {
          this.listLoading = false;
        });
    },

    //显示编辑界面 Deployment act_re_deployment
    showEdit: function(row, index) {
      this.editFormVisible = true;
      this.editForm = Object.assign({}, row);
    },
    //显示新增界面 Deployment act_re_deployment
    showAdd: function() {
      this.addFormVisible = true;
      //this.addForm=Object.assign({}, this.editForm);
    },
    afterAddSubmit() {
      this.addFormVisible = false;
      this.pageInfo.total = 0;
      this.getDeployments();
    },
    afterEditSubmit() {
      this.editFormVisible = false;
    },
    //选择行deployment
    selsChange: function(sels) {
      this.sels = sels;
    },
    //删除deployment
    handleDel: function(row, index) {
      this.$confirm(
        "取消发布会导致该发布包下的所有流程无法使用，确认取消发布吗?",
        "提示",
        {
          type: "warning"
        }
      )
        .then(() => {
          this.listLoading = true;
          let params = row;
          delDeployment(params).then(res => {
            this.listLoading = false;
            var tips = res.data.tips;
            if (tips.isOk) {
              this.pageInfo.total = 0;
              this.getDeployments();
            }
            this.$message({
              message: tips.msg,
              type: tips.isOk ? "success" : "error"
            });
          });
        })
        .catch(() => {
          this.listLoading = false;
        });
    },
    //批量删除deployment
    batchDel: function() {
      var ids = this.sels.map(item => item.id);
      this.$confirm("确认删除选中记录吗？", "提示", {
        type: "warning"
      })
        .then(() => {
          this.listLoading = true;
          batchDelDeployment(ids).then(res => {
            this.listLoading = false;
            var tips = res.data.tips;
            if (tips.isOk) {
              this.pageInfo.total = 0;
              this.getDeployments();
            }
            this.$message({
              message: tips.msg,
              type: tips.isOk ? "success" : "error"
            });
          });
        })
        .catch(() => {
          this.listLoading = false;
        });
    },
    rowClick: function(row, event, column) {
      this.$emit("row-click", row, event, column); //  @row-click="rowClick"
    },
    /**begin 自定义函数请在下面加**/
    handleDownload() {
      console.log(JSON.stringify(this.deployments));
      import("@/vendor/Export2Excel").then(excel => {
        const tHeader = [
          "状态",
          "发布包名",
          "工作编号",
          "来源",
          "父部署编号",
          "主键",
          "发布时间",
          "分类",
          "根来源",
          "版本",
          "业务编码"
        ];
        const filterVal = [
          "engineVersion",
          "name",
          "tenantId",
          "derivedFrom",
          "parentDeploymentId",
          "id",
          "deployTime",
          "category",
          "derivedFromRoot",
          "version",
          "key"
        ];
        const list = this.deployments;
        const data = this.formatJson(filterVal, list);
        var filename = "发布包管理";
        if (this.formDefSelected) {
          filename = this.formDefSelected.formName
            ? this.formDefSelected.formName
            : this.formDefSelected.id + "发布包管理";
        }
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: filename,
          autoWidth: true,
          bookType: "xlsx"
        });
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          if (j === "timestamp") {
            return parseTime(v[j]);
          } else {
            return v[j];
          }
        })
      );
    }
    /**end 自定义函数请在上面加**/
  }, //end methods
  components: {
    //'deployment-add':DeploymentAdd,
    //'deployment-edit':DeploymentEdit
    //在下面添加其它组件
    sticky: Sticky
  },
  mounted() {
    listCategorys({ tenantId: this.userInfo.branchId }).then(res => {
      this.categorys = res.data.data;
    });
    this.$nextTick(() => {

      var clientRect=this.$refs.table.$el.getBoundingClientRect();
      var subHeight=70/1000 * window.innerHeight;
      this.tableHeight =  window.innerHeight -clientRect.y - this.$refs.table.$el.offsetTop-subHeight;
      this.getDeployments();
    });
  }
};
</script>

<style scoped>
</style>

<style>
  .el-input-group__append, .el-input-group__prepend {
      background-color: #409EFF!important;
      color: #ffffff!important;
      vertical-align: middle;
      display: table-cell;
      position: relative;
      border: 1px solid #409EFF!important;
      padding: 0 20px;
      width: 1px;
      white-space: nowrap;
  }
</style>
