<template>
  <section>
    <el-row class="page-container border padding"> 
          <el-row class="page-header" >
            <el-select v-model="filters.procCategory" clearable filterable placeholder="请选择分类">
              <el-option v-for="item in categorys" :key="item" :label="item" :value="item"></el-option>
            </el-select>
            <el-input v-model="filters.key" style="width:270px;" placeholder="模糊查询">
              <template slot="append">
                <el-button type="primary"   v-on:click="searchProcdefs" icon="el-icon-search">查询</el-button>
              </template>
            </el-input>
            <el-button @click.native="showTagSelect(false)" icon="el-icon-search" style="margin-left: 13px;" class="hidden-sm-and-down">标签</el-button>
            <el-button @click.native="showTagSelect(true)" icon="el-icon-plus" class="hidden-sm-and-down">标签</el-button>
            <el-button @click="handleDownload" icon="el-icon-download" class="hidden-md-and-down">导出数据</el-button>
          </el-row>
          <!--列表 Procdef act_re_procdef-->
          <el-row class="page-main padding-top">
          <el-table
            ref="table" :height="tableHeight"
            :data="procdefs"
            highlight-current-row
            v-loading="listLoading"
            border
            @selection-change="selsChange"
            @row-click="rowClick"
            style="width: 100%;"
          >
            <el-table-column type="selection" width="40"></el-table-column>
            <el-table-column type="index" width="40"></el-table-column>
            <el-table-column sortable prop="category" label="分类" min-width="100" show-overflow-tooltip></el-table-column>
            <el-table-column sortable prop="name" label="模型名称" min-width="150" show-overflow-tooltip></el-table-column>
            <el-table-column
              sortable
              prop="suspensionState"
              label="状态"
              min-width="80"
              show-overflow-tooltip
              :formatter="formatterSuspensionState"
            ></el-table-column>

            <el-table-column prop="tagNames" label="标签" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-tag
                  v-for="tagName in (scope.row.tagNames?scope.row.tagNames.split(','):[])"
                  :key="tagName"
                >{{tagName}}</el-tag>
              </template>
            </el-table-column>
            <el-table-column sortable prop="key" label="业务编码" min-width="80" show-overflow-tooltip></el-table-column>
            <el-table-column sortable prop="version" label="版本" min-width="80" show-overflow-tooltip></el-table-column>
            <el-table-column
              sortable
              prop="deploymentId"
              label="部署编号"
              min-width="80"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              sortable
              prop="resourceName"
              label="模型文件名称"
              min-width="80"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              sortable
              prop="description"
              label="描述"
              min-width="80"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column label="操作" width="220" fixed="right" >
              <template slot-scope="scope">
                <el-button @click="showDiagram( scope.row,scope.$index)">流程图</el-button>
                <el-button
                  v-if="scope.row.suspensionState=='1' "
                  type="danger"
                  @click="handleSuspend(scope.row,scope.$index)"
                >挂起</el-button>
                <el-button
                  v-if="scope.row.suspensionState!='1' "
                  @click="handleActivate(scope.row,scope.$index)"
                >激活</el-button>
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
          <!--流程图界面-->
          <el-dialog
            title="流程图"
            :visible.sync="diagramVisible"
            width="80%"
            :close-on-click-modal="false"
          >
            <el-image :fit="'contain'" :src="diagramUrl">
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline"></i>
              </div>
              <div slot="placeholder" class="image-slot">
                正在全力加载中。。。。。。。。。。
                <i class="el-icon-loading"></i>
              </div>
            </el-image>
          </el-dialog>
          <el-dialog append-to-body title="标签条件" :visible.sync="tagSelectVisible" width="60%">
            <tag-mng
              :tagIds="filters.tags?filters.tags.map(i=>i.tagId):[]"
              :jump="true"
              @select-confirm="onTagSelected"
            ></tag-mng>
          </el-dialog>
          </el-row> 
      </el-row>
  </section>
</template>

<script>
import util from "../../../../../common/js/util"; //全局公共库
import config from "../../../../../common/config"; //全局公共库
//import { selectCacheOptions,getDefaultValue,getCodeName } from '../../../../../api/common/code';//下拉框数据查询
import {
  suspendProcdef,
  activateProcdef,
  listProcdef,
  listCategorys
} from "../../../../../api/mdp/workflow/re/procdef";
import Sticky from "@/components/Sticky"; // 粘性header组件
import { mapGetters } from "vuex";
import CategoryTree from "@/views/mdp/arc/category/CategoryTree"; //修改界面
import TagMng from "@/views/mdp/arc/tag/TagMng";
import { batchInsertOrDeleteTags } from "@/api/mdp/workflow/re/procdefTag";

export default {
  name: "ProcdefSuspend",
  computed: {
    ...mapGetters(["userInfo"])
  },
  data() {
    return {
      filters: {
        key: "",
        procCategory: "",
        categoryTreeNodes: [],
        tags: []
      },
      procdefs: [], //查询结果
      pageInfo: {
        //分页数据
        total: 0, //服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
        pageSize: 10, //每页数据
        pageNum: 1, //当前页码、从1开始计算
        orderFields: [], //排序列 如 ['sex','student_id']，必须为数据库字段
        orderDirs: [], //升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
        count: true
      },
      listLoading: false, //查询中...
      sels: [], //列表选中数据
      options: {}, //下拉选择框的所有静态数据 options.sex,options.project

      addFormVisible: false, //新增procdef界面是否显示
      //新增procdef界面初始化数据
      addForm: {
        id: "",
        rev: "",
        category: "",
        name: "",
        key: "",
        version: "",
        deploymentId: "",
        resourceName: "",
        dgrmResourceName: "",
        description: "",
        hasStartFormKey: "",
        hasGraphicalNotation: "",
        suspensionState: "",
        tenantId: "",
        engineVersion: ""
      },

      /**begin 自定义属性请在下面加 请加备注**/
      diagramVisible: false, //显示流程图
      diagramUrl: "", //显示流程图的路径
      categorys: [],
      tagSelectVisible: false,
      isBatchSetProcTags: false,
			tableHeight:300,
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
      this.pageInfo.count = true;
      this.pageInfo.pageNum = 1;
      this.getProcdefs();
    },
    handleCurrentChange(pageNum) {
      this.pageInfo.pageNum = pageNum;
      this.getProcdefs();
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
      this.getProcdefs();
    },

    handleFiltersTagClose: function(tag, paramsName) {
      if (paramsName == "key") {
        this.filters.key = null;
      } else if (paramsName == "categoryTreeNodes") {
        this.filters.categoryTreeNodes = this.filters.categoryTreeNodes.filter(
          i => i.id != tag.id
        );
        this.$refs.categoryTree.$refs.nodeTree.setChecked(tag.id, false, false);
      } else if (paramsName == "procCategory") {
        this.filters.procCategory = null;
      } else if (paramsName == "tags") {
        this.filters.tags = this.filters.tags.filter(i => i.tagId != tag.tagId);
      }
    },

    onTagSelected(tags) {
      this.tagSelectVisible = false;
      if (this.isBatchSetProcTags == true) {
        //TOD 批量更新后台数据标签
        if (!tags || tags.length == 0) {
          this.$message.error("最少选中一个标签");
          this.isBatchSetProcTags = false;
          return;
        }
        var procinstTagsVos = [];
        this.sels.forEach(row => {
          var procinstTags = {
            procDefId: row.procDefId,
            procInstId: row.procInstId,
            branchId: row.branchId,
            userid: this.userInfo.userid,
            tags: tags.map(i => {
              return { tagId: i.tagId, tagName: i.tagName };
            })
          };
          procinstTagsVos.push(procinstTags);
        });
        var params = procinstTagsVos;

        batchInsertOrDeleteTags(params)
          .then(res => {
            this.isBatchSetProcTags = false;
            if (res.data.tips.isOk) {
              var tagIds = tags.map(i => i.tagId).join(",");
              var tagNames = tags.map(i => i.tagName).join(",");
              this.sels.forEach(row => {
                row.tagIds = tagIds;
                row.tagNames = tagNames;
              });
              this.$message.success("打标签成功");
            } else {
              this.$message.error(res.data.tips.msg);
            }
          })
          .catch(e => (this.isBatchSetProcTags = false));
      } else {
        if (tags == null) {
          this.filters.tags = null;
        } else {
          this.filters.tags = tags;
        }
      }
    },
    handleCategoryCheckChange(data, checked, indeterminate) {
      if (data.id == "C0") {
        //选择了根节点，默认不按分类查询
        this.filters.categoryTreeNodes = null;
        return;
      }
      var node = this.$refs.categoryTree.$refs.nodeTree.getCheckedNodes();
      console.log("node-------------" + JSON.stringify(node));
      this.filters.categoryTreeNodes = node;
    },
    showTagSelect: function(isBatchSetProcTags) {
      if (isBatchSetProcTags == true) {
        if (this.sels.length == 0) {
          this.$message.error("请选中流程任务");
          return false;
        }
        this.tagSelectVisible = true;
      } else {
        this.tagSelectVisible = true;
      }
      this.isBatchSetProcTags = isBatchSetProcTags;
    },
    searchProcdefs() {
      this.pageInfo.pageNum = 1;
      this.pageInfo.total = 0;
      this.pageInfo.count = true;
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
      if (
        this.filters.procCategory != "" &&
        this.filters.procCategory != null
      ) {
        params.category = this.filters.procCategory;
      }

      if (
        this.filters.categoryTreeNodes != null &&
        this.filters.categoryTreeNodes.length > 0
      ) {
        params.categoryIds = this.filters.categoryTreeNodes.map(i => i.id);
      }

      if (this.filters.tags != null && this.filters.tags.length > 0) {
        params.tagIds = this.filters.tags.map(i => i.tagId);
      }
      params.tenantId = this.userInfo.branchId;
      this.listLoading = true;
      listProcdef(params)
        .then(res => {
          var tips = res.data.tips;
          if (tips.isOk) {
            this.pageInfo.total = res.data.total;
            this.pageInfo.count = false;
            this.procdefs = res.data.data;
          } else {
            this.$message({showClose: true, message: tips.msg, type: "error" });
          }
          this.listLoading = false;
        })
        .catch(() => {
          this.listLoading = false;
        });
    },

    //选择行procdef
    selsChange: function(sels) {
      this.sels = sels;
    },

    //激活procdef
    handleActivate: function(row, index) {
      this.$confirm("确认删除该记录吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          this.listLoading = true;
          let params = { id: row.id };
          activateProcdef(params).then(res => {
            this.listLoading = false;
            var tips = res.data.tips;
            if (tips.isOk) {
              this.pageInfo.total = 0;
              this.pageInfo.count = true;
              this.getProcdefs();
            }
            this.$message({showClose: true,
              message: tips.msg,
              type: tips.isOk ? "success" : "error"
            });
          });
        })
        .catch(() => {
          this.listLoading = false;
        });
    },
    //激活挂起
    handleSuspend: function(row, index) {
      this.$confirm("确认删除该记录吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          this.listLoading = true;
          let params = { id: row.id };
          suspendProcdef(params).then(res => {
            this.listLoading = false;
            var tips = res.data.tips;
            if (tips.isOk) {
              this.pageInfo.total = 0;
              this.pageInfo.count = true;
              this.getProcdefs();
            }
            this.$message({showClose: true,
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

    showDiagram: function(row, index) {
      this.diagramVisible = true;
      this.diagramUrl =
        "/" +
        process.env.BASE_API +
        "/" +
        process.env.VERSION +
        "/" +
        config.getWorkflowBasePath() +
        "/mdp/workflow/re/procdef/diagram/" +
        row.id;
    },
    formatterSuspensionState(row, column, cellValue) {
      return cellValue == 1 ? "激活的" : "挂起的";
    },
    handleDownload() {
      console.log(JSON.stringify(this.procdefs));
      import("@/vendor/Export2Excel").then(excel => {
        const tHeader = [
          "状态",
          "派生版本",
          "hasGraphicalNotation",
          "标签编号",
          "主要操作---mainQx",
          "描述",
          "智能表单展示方式",
          "标签名称",
          "参数编号",
          "主办人",
          "部署编号",
          "表单来源",
          "主键",
          "hasStartFormKey",
          "derivedFromRoot",
          "业务编码",
          "引擎版本",
          "表单编号",
          "版次 --- rev",
          "是否关联自定义表单",
          "模型文件名称",
          "版本",
          "流程定义编号",
          "模型名称",
          "模型名称",
          "图片名称",
          "工作编号----tenantId",
          "所属分类",
          "监控人"
        ];
        const filterVal = [
          "suspensionState",
          "derivedVersion",
          "hasGraphicalNotation",
          "tagIds",
          "mainQx",
          "description",
          "formShowType",
          "tagNames",
          "paramsId",
          "sponsors",
          "deploymentId",
          "derivedFrom",
          "id",
          "hasStartFormKey",
          "derivedFromRoot",
          "key",
          "engineVersion",
          "formId",
          "rev",
          "isRefForm",
          "resourceName",
          "version",
          "procDefId",
          "mainTitle",
          "name",
          "dgrmResourceName",
          "tenantId",
          "category",
          "monitors"
        ];
        const list = this.procdefs;
        const data = this.formatJson(filterVal, list);
        var filename = "模型激活/挂起";
        if (this.formDefSelected) {
          filename = this.formDefSelected.formName
            ? this.formDefSelected.formName
            : this.formDefSelected.id + "模型激活/挂起";
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
    //在下面添加其它组件
    sticky: Sticky,
    CategoryTree,
    TagMng
  },
  mounted() {
    listCategorys({ tenantId: this.userInfo.branchId }).then(res => {
      this.categorys = res.data.data;
    });

    this.$nextTick(()=>{
        var clientRect=this.$refs.table.$el.getBoundingClientRect();
        var subHeight=70/1000 * window.innerHeight;
        this.tableHeight =  window.innerHeight -clientRect.y - this.$refs.table.$el.offsetTop-subHeight;
    })
    this.getProcdefs();
  }
};
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
