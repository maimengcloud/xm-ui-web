<template>
  <section>
    <el-row>
      <!--
      <el-button
        type="danger"
        v-loading="load.del"
        @click="batchDel"
        :disabled="this.sels.length === 0 || load.del == true"
        icon="el-icon-delete"
        >批量删除</el-button
      >
      -->
      <el-button
        type="warning"
        @click="saveBatchEdit"
        v-loading="load.edit"
        icon="el-icon-finished"
        >批量保存</el-button
      >
      <!--
      <el-button
        type="success"
        @click="handlePopover(null, 'add')"
        icon="el-icon-plus"
      ></el-button>
      -->
      <el-button @click="noBatchEdit" v-loading="load.edit" icon="el-icon-back"
        >返回</el-button
      >
      <div style="float: right; margin-right: 10px">
        <el-input
          v-model="filters.key"
          style="width: 200px"
          placeholder="模糊查询"
        >
          <template slot="append">
            <el-button
              type="primary"
              v-loading="load.list"
              :disabled="load.list == true"
              v-on:click="searchXmPhases"
              icon="el-icon-search"
            ></el-button>
          </template>
        </el-input>
      </div>
    </el-row>
    <el-row class="padding-top">
      <span style="margin-left: 10px; font-size: 14px">项目总预算：</span
      ><el-tag type="success">
        {{ toFixed(selProject.planTotalCost / 10000, 2) }}万，剩{{
          toFixed(budgetData.surplusPlanCostAt / 10000, 2)
        }}万</el-tag
      >
      <span style="margin-left: 10px; font-size: 14px">非人力总预算：</span
      ><el-tag
        :type="budgetData.surplusPlanNouserAt > 0 ? 'warning' : 'danger'"
        >{{ toFixed(selProject.planNouserAt / 10000, 2) }}万，剩{{
          toFixed(budgetData.surplusPlanNouserAt / 10000, 2)
        }}万</el-tag
      >
      <span style="margin-left: 10px; font-size: 14px">内部人力总预算：</span
      ><el-tag
        :type="
          budgetData.surplusPlanIuserAt > 0 ? 'warning' : 'danger'
        "
        >{{ toFixed(selProject.planIuserAt / 10000, 2) }}万，剩{{
          toFixed(budgetData.surplusPlanIuserAt / 10000, 2)
        }}万</el-tag
      >
      <span style="margin-left: 10px; font-size: 14px">外购人力总预算：</span
      ><el-tag
        :type="budgetData.surplusPlanOuserAt > 0 ? 'warning' : 'danger'"
        >{{ toFixed(selProject.planOuserAt / 10000, 2) }}万，剩{{
          toFixed(budgetData.surplusPlanOuserAt / 10000, 2)
        }}万</el-tag
      >
    </el-row>
    <el-row class="padding-top">
      <!--列表 XmPhase xm_project_phase-->
      <el-table
        ref="table"
        lazy
        :load="loadXmPhaseLazy"
        :height="tableHeight"
        class="drag-table"
        :summary-method="getSummariesForBatchEdit"
        :data="projectPhaseTreeData"
        :show-summary="true"
        row-key="id"
        :tree-props="{ children: 'children', hasChildren: 'childrenCnt' }"
        @sort-change="sortChange"
        highlight-current-row
        v-loading="load.list"
        border
        @selection-change="selsChange"
        @row-click="rowClick"
        style="width: 100%"
      >
        <el-table-column type="selection" width="50"></el-table-column>
        <el-table-column prop="seqNo" label="序号/名称" min-width="200">
          <template slot-scope="scope"> 
              <!-- 有问题，暂时不支持
							<el-popover
								placement="top"
								width="400"
								trigger="click">
								<div style="text-align: center; margin: 0">
									<div :ref="'phase_'+scope.$index" :data-phase-id="scope.row.id"></div>
									<el-button type="primary"    @click="handlePopover(scope.row,'highestPmenuId')">成为顶级节点</el-button> 
									
									<el-button type="danger"    @click="handlePopover(scope.row,'delete')">删除当前行</el-button> 
									<el-button type="success"    @click="handlePopover(scope.row,'addSub')">增加子行</el-button>
									
								</div>
								<el-button slot="reference" :type="scope.row.opType?'success':'plain'"   icon="el-icon-edit"></el-button> 
							</el-popover>
							-->
              
              <el-input
                style="width: 100px;"
                v-model="scope.row.seqNo"
                @change="fieldChange(scope.row, 'seqNo')"
              ></el-input>
              <el-input  style="width: 100%"
              v-model="scope.row.name"
              @change="fieldChange(scope.row, 'name')"
            ></el-input> 
          </template>
        </el-table-column> 
        <el-table-column prop="beginDate" label="起始时间" width="160">
          <template slot-scope="scope">
            <div>
              <el-date-picker
                style="width: 100%"
                v-model="scope.row.beginDate"
                align="right"
                type="date"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd"
                placeholder="选择日期"
                :picker-options="pickerOptions"
                @change="fieldChange(scope.row, 'beginDate')"
              >
              </el-date-picker>
              <br />
              <el-date-picker
                style="width: 100%"
                v-model="scope.row.endDate"
                align="right"
                type="date"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd"
                placeholder="选择日期"
                :picker-options="pickerOptions"
                @change="fieldChange(scope.row, 'endDate')"
              >
              </el-date-picker>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="budgetHours"
          label="工期.H"
          width="100"
        >
          <template slot-scope="scope">
            <el-row>  
                <el-input-number 
                  style="width: 100%"
                  v-model="scope.row.budgetHours"
                  :precision="1"
                  :step="8"
                  type="number"
                  :controls="false"
                  @change="fieldChange(scope.row, 'budgetHours')"
                ></el-input-number> 
            </el-row>
          </template>
        </el-table-column>
        
        <el-table-column
          prop="budgetHours"
          label="预计工作量及成本"
          min-width="300"
        >
        <el-table-column
          prop="budgetHours"
          label="人数"
          min-width="100"
        >
          <template slot-scope="scope"> 
                <el-row>
                  <el-col :span="24">
                    内购
                    <el-input
                      style="width: 80px"
                      v-model="scope.row.budgetIuserCnt"
                      :precision="2"
                      step="1"
                      type="number"
                      @change="
                        fieldChange(scope.row, 'budgetIuserCnt')
                      "
                    ></el-input
                    > 
                  </el-col>  
                  <el-col :span="24">
                    外购
                    <el-input
                      style="width: 80px"
                      v-model="scope.row.budgetOuserCnt"
                      :precision="2"
                      step="1"
                      type="number"
                      @change="fieldChange(scope.row, 'budgetOuserCnt')"
                    ></el-input
                    > 
                  </el-col>  
                </el-row> 
          </template>
        </el-table-column> 
        <el-table-column label="单价.元/人时" width="120">
          <template slot-scope="scope">
             <el-input
                style="width: 80px"
                v-model="scope.row.budgetOuserPrice"
                :precision="2"
                step="10"
                type="number"
                @change="
                  fieldChange(scope.row, 'budgetOuserPrice')
                "
              ></el-input>
          </template>
        </el-table-column>
        <el-table-column label="预算合计" width="120">
          <template slot-scope="scope">
            {{
              (
                scope.row.budgetIuserAt +
                scope.row.budgetOuserAt +
                scope.row.budgetNouserAt
              ).toFixed(0)
            }}元
          </template>
        </el-table-column>
        </el-table-column>

        <el-table-column prop="remark" label="备注" min-width="100">
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.remark"
              type="textarea"
              @change="fieldChange(scope.row, 'remark')"
            ></el-input>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        layout="total, sizes, prev, pager, next"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        :page-sizes="[1, 2, 10, 20, 50, 100, 500]"
        :current-page="pageInfo.pageNum"
        :page-size="pageInfo.pageSize"
        :total="pageInfo.total"
        style="float: right"
      ></el-pagination>
    </el-row>
  </section>
</template>

<script>
import util from "@/common/js/util"; //全局公共库
import treeTool from "@/common/js/treeTool"; //全局公共库
//import Sticky from '@/components/Sticky' // 粘性header组件
import { initSimpleDicts } from '@/api/mdp/meta/item'; //下拉框数据查询
import {
  listXmPhase,
  delXmPhase,
  batchDelXmPhase,
  batchImportFromTemplate,
  batchSaveBudget,
  loadTasksToXmPhase,
} from "@/api/xm/core/xmPhase";

import { sn } from "@/common/js/sequence";
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters(["userInfo", "roles"]),
    projectPhaseTreeData() {  
      var projectPhaseTreeData = treeTool.translateDataToTree(this.xmPhases,"parentPhaseId","id");  
      return projectPhaseTreeData;
    },
    budgetData() {
      var rows = this.xmPhases;
      var surplusPlanCostAt =
        this.getFloatValue(this.selProject.planIuserAt) +
        this.getFloatValue(this.selProject.planOuserAt) +
        this.getFloatValue(this.selProject.planNouserAt);
      var surplusPlanIuserAt = this.getFloatValue(
        this.selProject.planIuserAt
      );
      var surplusPlanOuserAt = this.getFloatValue(
        this.selProject.planOuserAt
      );
      var surplusPlanNouserAt = this.getFloatValue(
        this.selProject.planNouserAt
      );
      var surplusPlanUserAt =
        this.getFloatValue(this.selProject.planIuserAt) +
        this.getFloatValue(this.selProject.planOuserAt);

      const total = {
        surplusPlanCostAt: surplusPlanCostAt,
        surplusPlanIuserAt: surplusPlanIuserAt,
        surplusPlanOuserAt: surplusPlanOuserAt,
        surplusPlanNouserAt: surplusPlanNouserAt,
        surplusPlanUserAt: surplusPlanUserAt,

        budgetNouserAt: 0,
        budgetIuserAt: 0,
        budgetOuserAt: 0,
        budgetUserAt: 0,

        budgetIuserWorkload: 0,
        budgetOuserWorkload: 0,

        actWorkload: 0,
        actIuserAt: 0,
        actNouserAt: 0,
        actOuserAt: 0,
      };
      //budgetHours:'',budgetStaffNu:'',ctime:'',budgetNouserAt:'',budgetIuserAt:'',budgetOuserAt

      rows.forEach((row2) => {
        var row = row2;
        if (this.valueChangeRows.length != 0) {
          var changeRows = this.valueChangeRows.filter((i) => i.id == row2.id);
          if (changeRows && changeRows.length > 0) {
            row = changeRows[0];
          }
        }
        if(row.lvl<=1){
            total.budgetNouserAt =
          total.budgetNouserAt +
          this.getFloatValue(row.budgetNouserAt);
        total.budgetIuserAt =
          total.budgetIuserAt +
          this.getFloatValue(row.budgetIuserAt);
        total.budgetOuserAt =
          total.budgetOuserAt +
          this.getFloatValue(row.budgetOuserAt);
        total.budgetIuserWorkload =
          total.budgetIuserWorkload +
          this.getFloatValue(row.budgetIuserWorkload);
        total.budgetOuserWorkload =
          total.budgetOuserWorkload +
          this.getFloatValue(row.budgetOuserWorkload);

        total.actWorkload =
          total.actWorkload + this.getFloatValue(row.actWorkload);
        total.actIuserAt =
          total.actIuserAt + this.getFloatValue(row.actIuserAt);
        total.actNouserAt =
          total.actNouserAt + this.getFloatValue(row.actNouserAt);
        total.actOuserAt =
          total.actOuserAt + this.getFloatValue(row.actOuserAt);
        }
        
      });
      total.budgetUserAt =
        total.budgetIuserAt + total.budgetOuserAt;
      total.surplusPlanCostAt = this.getFloatValue(
        total.surplusPlanCostAt -
          total.budgetNouserAt -
          total.budgetUserAt
      );
      total.surplusPlanIuserAt =
        total.surplusPlanIuserAt - total.budgetIuserAt;
      total.surplusPlanOuserAt =
        total.surplusPlanOuserAt - total.budgetOuserAt;
      total.surplusPlanNouserAt =
        total.surplusPlanNouserAt - total.budgetNouserAt;
      total.surplusPlanUserAt =
        total.surplusPlanUserAt - total.budgetUserAt;
      return total;
    },
  },
  props: ["selProject"],
  watch: {
    selProject: function (selProject, old) {
      if (!selProject) {
        this.xmPhases = [];
      } else {
        if ((!old && selProject.id) || (old && selProject.id != old.id)) {
          this.searchXmPhases();
        }
      }
    },
  },
  data() {
    return {
      filters: {
        key: "",
      },
      xmPhases: [], //查询结果
      pageInfo: {
        //分页数据
        total: 0, //服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
        pageSize: 500, //每页数据
        count: false, //是否需要重新计算总记录数
        pageNum: 1, //当前页码、从1开始计算
        orderFields: [], //排序列 如 ['sex','student_id']，必须为数据库字段
        orderDirs: [], //升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
      },
      load: { list: false, edit: false, del: false, add: false }, //查询中...
      sels: [], //列表选中数据
      dicts: {
        xmPhaseStatus: [],
      }, //下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]}

      addFormVisible: false, //新增xmPhase界面是否显示
      //新增xmPhase界面初始化数据
      addForm: {
        id: "",
        name: "",
        remark: "",
        parentPhaseId: "",
        branchId: "",
        taskType: "kf",
        planType: "m1",
        projectId: "",
        beginDate: "",
        endDate: "",
        budgetHours: "",
        budgetStaffNu: "",
        ctime: "",
        budgetNouserAt: "",
        budgetIuserAt: "",
        budgetOuserAt: "",
        baselineId: "",
        bizProcInstId: "",
        bizFlowState: "",
        budgetIuserCnt: "",
        budgetOuserCnt: "",
        seqNo: "",
        budgetIuserPrice: 80,
        budgetOuserPrice: 100,
        budgetIuserWorkload: 0,
        budgetOuserWorkload: 0,
      },

      editFormVisible: false, //编辑界面是否显示
      //编辑xmPhase界面初始化数据
      editForm: {
        id: "",
        name: "",
        remark: "",
        parentPhaseId: "",
        branchId: "",
        projectId: "",
        beginDate: "",
        endDate: "",
        budgetHours: "",
        budgetStaffNu: "",
        ctime: "",
        budgetNouserAt: "",
        budgetIuserAt: "",
        budgetOuserAt: "",
        baselineId: "",
        bizProcInstId: "",
        bizFlowState: "",
        budgetIuserCnt: "",
        budgetOuserCnt: "",
        seqNo: "",
        budgetIuserPrice: 80,
        budgetOuserPrice: 100,
        budgetIuserWorkload: 0,
        budgetOuserWorkload: 0,
      },

      editFormInit: {
        id: "",
        name: "",
        remark: "",
        parentPhaseId: "",
        branchId: "",
        taskType: "kf",
        planType: "m1",
        projectId: "",
        beginDate: "",
        endDate: "",
        budgetHours: "",
        budgetStaffNu: "",
        ctime: "",
        budgetNouserAt: "",
        budgetIuserAt: "",
        budgetOuserAt: "",
        baselineId: "",
        bizProcInstId: "",
        bizFlowState: "",
        budgetIuserCnt: "",
        budgetOuserCnt: "",
        seqNo: "",
        budgetIuserPrice: 80,
        budgetOuserPrice: 100,
        budgetIuserWorkload: 0,
        budgetOuserWorkload: 0,
      },
      parentProjectPhase: null,
      /**begin 自定义属性请在下面加 请加备注**/
      phaseTemplateVisible: false,
      xmRecordVisible: false,
      valueChangeRows: [],
      batchEditVisible: false,
      menuVisible: false, //由需求自动创建计划
      tableHeight: 300,
      pickerOptions: util.pickerOptions("date"),
      gstcVisible: false,
      ganrrColumns: {
        children: "children",
        name: "name",
        id: "id",
        pid: "parentPhaseId",
        startDate: "beginDate",
        endDate: "endDate",
      },
      /**end 自定义属性请在上面加 请加备注**/
    };
  }, //end data
  methods: {
    handleSizeChange(pageSize) {
      this.pageInfo.pageSize = pageSize;
      this.getXmPhases();
    },
    handleCurrentChange(pageNum) {
      this.pageInfo.pageNum = pageNum;
      this.getXmPhases();
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
      this.getXmPhases();
    },
    searchXmPhases() {
      this.pageInfo.count = true;
      this.getXmPhases();
    },

    getParams(params) {
      if (this.filters.key) {
        params.key = "%" + this.filters.key + "%";
      }
      if (this.selProject != null && this.selProject != undefined) {
        params.projectId = this.selProject.id;
      }
      params.isTop = "1";
      return params;
    },
    loadXmPhaseLazy(row, treeNode, resolve) {
      if (row.children && row.children.length > 0) {
        this.xmPhases.push(...row.children);
        resolve(row.children);
      } else {
        var params = { parentPhaseId: row.id };
        params = this.getParams(params);
        params.isTop = "";
        this.load.list = true;
        var func = listXmPhase;
        func(params)
          .then((res) => {
            this.load.list = false;
            var tips = res.data.tips;
            if (tips.isOk) {
              this.xmPhases.push(...res.data.data);
              resolve(res.data.data);
            } else {
              resolve([]);
            }
          })
          .catch((err) => (this.load.list = false));
      }
    },
    //获取列表 XmPhase xm_project_phase
    getXmPhases() {
      this.valueChangeRows = [];
      let params = {
        pageSize: this.pageInfo.pageSize,
        pageNum: this.pageInfo.pageNum,
        total: this.pageInfo.total,
        count: this.pageInfo.count,
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
      params = this.getParams(params);
      this.load.list = true;
      listXmPhase(params)
        .then((res) => {
          var tips = res.data.tips;
          if (tips.isOk) {
            this.pageInfo.total = res.data.total;
            this.pageInfo.count = false;
            this.xmPhases = res.data.data;
          } else {
            this.$notify({
              showClose: true,
              message: tips.msg,
              type: "error",
            });
          }
          this.load.list = false;
        })
        .catch((err) => (this.load.list = false));
    },

    //显示编辑界面 XmPhase xm_project_phase
    showEdit: function (row, index) {
      if (
        !this.roles.some((i) => i.roleid == "projectAdmin") &&
        !this.roles.some((i) => i.roleid == "teamAdmin")
      ) {
        this.$notify({
          showClose: true,
          message: "只有项目经理、小组组长可以操作计划",
          type: "error",
        });
        return;
      }
      this.editForm = Object.assign({}, row);
      this.editFormVisible = true;
    },
    //显示新增界面 XmPhase xm_project_phase
    showAdd: function () {
      if (
        !this.roles.some((i) => i.roleid == "projectAdmin") &&
        !this.roles.some((i) => i.roleid == "teamAdmin")
      ) {
        this.$notify({
          showClose: true,
          message: "只有项目经理、小组组长可以操作计划",
          type: "error",
        });
        return;
      }
      this.parentProjectPhase = null;
      this.addForm.projectId = this.selProject.id;
      this.addForm.branchId = this.selProject.branchId;
      this.addFormVisible = true;
      //this.addForm=Object.assign({}, this.editForm);
    },

    showSubAdd: function (parentProjectPhase) {
      if (
        !this.roles.some((i) => i.roleid == "projectAdmin") &&
        !this.roles.some((i) => i.roleid == "teamAdmin")
      ) {
        this.$notify({
          showClose: true,
          message: "只有项目经理、小组组长可以操作计划",
          type: "error",
        });
        return;
      }
      var myrow = JSON.parse(JSON.stringify(parentProjectPhase));
      myrow.children = [];
      this.parentProjectPhase = myrow;
      this.addForm.projectId = this.selProject.id;
      this.addForm.branchId = this.selProject.branchId;
      this.addFormVisible = true;
      //this.addForm=Object.assign({}, this.editForm);
    },
    afterAddSubmit() {
      this.addFormVisible = false;
      this.pageInfo.count = true;
      this.getXmPhases();
    },
    afterEditSubmit() {
      this.editFormVisible = false;
    },
    afterPhaseTemplateSelected(phaseTemplates) {
      if (phaseTemplates == null || phaseTemplates.length == 0) {
        this.phaseTemplateVisible = false;
        return;
      }
      var phaseTemplates2 = JSON.parse(JSON.stringify(phaseTemplates));
      this.load.add = true;
      let parents = phaseTemplates2.filter((value) => {
        //如果我的上级为空，则我是最上级
        if (
          value.parentPhaseId == "undefined" ||
          value.parentPhaseId == null ||
          value.parentPhaseId == ""
        ) {
          return true;

          //如果我的上级不在列表中，我作为最上级
        } else if (phaseTemplates2.some((i) => value.parentPhaseId == i.id)) {
          return false;
        } else {
          return true;
        }
      });
      if (
        this.parentProjectPhase != null &&
        this.parentProjectPhase != undefined
      ) {
        parents.forEach((i) => (i.parentPhaseId = this.parentProjectPhase.id));
      } else {
        parents.forEach((i) => (i.parentPhaseId = null));
      }
      let children = phaseTemplates2.filter((value) => {
        if (phaseTemplates2.some((i) => value.parentPhaseId == i.id)) {
          return true;
        } else {
          return false;
        }
      });
      let translator = (parents, children) => {
        parents.forEach((parent) => {
          var newId = sn();
          var myChildren = [];
          if (children != null && children.length > 0) {
            myChildren = children.filter(
              (current) => current.parentPhaseId === parent.id
            );
          }
          myChildren.forEach((current, index) => {
            current.parentPhaseId = newId;
            var mySubChildren = children.filter(
              (c) => c.parentPhaseId === current.id
            );
            translator([current], mySubChildren);
          });
          parent.id = newId;
        });
      };

      translator(parents, children);
      phaseTemplates2.forEach((i) => {
        i.projectId = this.selProject.id;
        i.projectName = this.selProject.name;
        i.branchId = this.selProject.branchId;
        i.budgetAt = 0;
        i.budgetNouserAt = 0;
        i.budgetIuserAt = 0;
        i.budgetOuserAt = 0;
        i.budgetWorkload = 0;
        i.budgetStaffNu = 0;
        i.budgetHours = 160;
        i.budgetIuserWorkload = 0;
        i.budgetOuserWorkload = 0;
        i.budgetIuserPrice = this.selProject.planIuserPrice;
        i.budgetOuserPrice = this.selProject.planOuserPrice;
        i.budgetOuserCnt = 0;
        i.budgetIuserCnt = 0;
        const ctime = new Date();
        var beginDate = new Date();
        const endDate = new Date();
        endDate.setTime(ctime.getTime() + 3600 * 1000 * 24 * 7 * 4); //两周后
        i.ctime = util.formatDate.format(ctime, "yyyy-MM-dd HH:mm:ss");
        i.beginDate = util.formatDate.format(beginDate, "yyyy-MM-dd HH:mm:ss");
        i.endDate = util.formatDate.format(endDate, "yyyy-MM-dd HH:mm:ss");
      });
      batchImportFromTemplate(phaseTemplates2)
        .then((res) => {
          this.phaseTemplateVisible = false;
          this.load.add = false;
          var tips = res.data.tips;
          if (tips.isOk) {
            this.getXmPhases();
          } else {
            this.$notify({
              showClose: true,
              message: tips.msg,
              type: "error",
            });
          }
        })
        .catch((err) => (this.load.add = false));
    },
    //选择行xmPhase
    selsChange: function (sels) {
      this.sels = sels;
    },
    //删除xmPhase
    handleDel: function (row, index) {
      if (
        !this.roles.some((i) => i.roleid == "projectAdmin") &&
        !this.roles.some((i) => i.roleid == "teamAdmin")
      ) {
        this.$notify({
          showClose: true,
          message: "只有项目经理、小组组长可以操作计划",
          type: "error",
        });
        return;
      }
      if (!!row.bizFlowState) {
        this.$notify({
          showClose: true,
          message: "初始状态的计划可以直接删除，其它状态请发起审核流程进行删除",
          type: "error",
        });
        return;
      }

      if (command.data.children && command.data.length > 0) {
        this.$notify({
          showClose: true,
          message: "该计划存在子计划，不允许删除",
          type: "error",
        });
        return;
      }
      this.$confirm("确认删除该记录吗?", "提示", {
        type: "warning",
      }).then(() => {
        this.load.del = true;
        let params = { id: row.id };
        delXmPhase(params)
          .then((res) => {
            this.load.del = false;
            var tips = res.data.tips;
            if (tips.isOk) {
              this.pageInfo.count = true;
              this.getXmPhases();
            }
            this.$notify({
              showClose: true,
              message: tips.msg,
              type: tips.isOk ? "success" : "error",
            });
          })
          .catch((err) => (this.load.del = false));
      });
    },
    //批量删除xmPhase
    batchDel: function () {
      if (
        !this.roles.some((i) => i.roleid == "projectAdmin") &&
        !this.roles.some((i) => i.roleid == "teamAdmin")
      ) {
        this.$notify({
          showClose: true,
          message: "只有项目经理、小组组长可以操作计划",
          type: "error",
        });
        return;
      }
      var phases = this.sels.filter((i) => {
        if (
          i.bizFlowState == "" ||
          i.bizFlowState == null ||
          i.bizFlowState == undefined
        ) {
          return true;
        }
        if (
          i.bizFlowState == "0" ||
          i.bizFlowState == "3" ||
          i.bizFlowState == "3"
        ) {
          return true;
        }
        return false;
      });
      var phases = JSON.parse(JSON.stringify(phases));
      phases.forEach((i) => (i.children = null));
      this.$confirm(
        "将删除未审核的数据，审批中的数据将保留,确认删除选中记录吗？",
        "提示",
        {
          type: "warning",
        }
      ).then(() => {
        this.load.del = true;
        batchDelXmPhase(phases)
          .then((res) => {
            this.load.del = false;
            var tips = res.data.tips;
            if (tips.isOk) {
              this.pageInfo.count = true;
              this.getXmPhases();
            }
            this.$notify({
              showClose: true,
              message: tips.msg,
              type: tips.isOk ? "success" : "error",
            });
          })
          .catch((err) => (this.load.del = false));
      });
    },
    showPhaseTemplate: function (parentPhase) {
      if (
        !this.roles.some((i) => i.roleid == "projectAdmin") &&
        !this.roles.some((i) => i.roleid == "teamAdmin")
      ) {
        this.$notify({
          showClose: true,
          message: "只有项目经理、小组组长可以操作计划",
          type: "error",
        });
        return;
      }
      this.parentProjectPhase = parentPhase;
      this.phaseTemplateVisible = true;
    },
    clearSelectPhase() {
      this.editForm = this.editFormInit;
      this.$emit("clear-select", null); //  @row-click="rowClick"
    },
    rowClick: function (row, event, column) {
      var myrow = JSON.parse(JSON.stringify(row));
      myrow.children = [];
      this.parentProjectPhase = myrow;
      this.editForm = myrow;
      this.$emit("row-click", myrow, event, column); //  @row-click="rowClick"
    },
    /**begin 自定义函数请在下面加**/
    translateDataToTree(data2) {
      var data = JSON.parse(JSON.stringify(data2));
      let parents = data.filter((value) => {
        //如果我的上级为空，则我是最上级
        var calcData = this.getRowSum(value);
        value.budgetAt = calcData.budgetAt;
        value.actCostAt = calcData.actCostAt;
        if (
          value.parentPhaseId == "undefined" ||
          value.parentPhaseId == null ||
          value.parentPhaseId == ""
        ) {
          return true;

          //如果我的上级不在列表中，我作为最上级
        } else if (data.some((i) => value.parentPhaseId == i.id)) {
          return false;
        } else {
          return true;
        }
      });
      let children = data.filter((value) => {
        if (data.some((i) => value.parentPhaseId == i.id)) {
          return true;
        } else {
          return false;
        }
      });
      let translator = (parents2, children2) => {
        parents2.forEach((parent) => {
          parent.children = children2.filter(
            (i) => i.parentPhaseId == parent.id
          );

          if (typeof parent.childrenCnt === "undefined") {
            parent.childrenCnt = parent.children.length;
          } else {
            if (parent.childrenCnt == 0) {
              parent.childrenCnt = parent.children.length;
            }
          }
          parent.children.forEach((c) => {
            translator([c], children2);
          });
        });
      };
      translator(parents, children);

      return parents;
    },

    //从任务中汇总进度/实际费用等数据
    loadTasksToXmPhase: function (phases) {
      var phaseIds = phases.map((i) => i.id);
      var params = {
        projectId: this.selProject.id,
      };
      if (phases && phases.length > 0) {
        params.phaseIds = phases.map((i) => i.id);
      }
      loadTasksToXmPhase(params).then((res) => {
        var tips = res.data.tips;
        if (tips.isOk) {
          this.getXmPhases();
        }
        this.$notify({
          showClose: true,
          message: tips.msg,
          type: tips.isOk ? "success" : "error",
        });
      });
    },
    getFloatValue(value, digit) {
      if (value == null || value == "" || value == undefined) {
        value = 0;
        return value;
      }
      if (!digit) {
        digit = 2;
      }
      if (typeof value == "string") {
        return parseFloat(value);
      } else {
        return value;
      }
    },
    getRowSum(row) {
      if (
        row.budgetNouserAt == null ||
        row.budgetNouserAt == "" ||
        row.budgetNouserAt == undefined
      ) {
        row.budgetNouserAt = 0;
      }

      if (
        row.budgetIuserAt == null ||
        row.budgetIuserAt == "" ||
        row.budgetIuserAt == undefined
      ) {
        row.budgetIuserAt = 0;
      }

      if (
        row.budgetOuserAt == null ||
        row.budgetOuserAt == "" ||
        row.budgetOuserAt == undefined
      ) {
        row.budgetOuserAt = 0;
      }
      if (
        row.actNouserAt == null ||
        row.actNouserAt == "" ||
        row.actNouserAt == undefined
      ) {
        row.actNouserAt = 0;
      }

      if (
        row.actIuserAt == null ||
        row.actIuserAt == "" ||
        row.actIuserAt == undefined
      ) {
        row.actIuserAt = 0;
      }

      if (
        row.actOuserAt == null ||
        row.actOuserAt == "" ||
        row.actOuserAt == undefined
      ) {
        row.actOuserAt = 0;
      }
      var budgetAt =
        parseFloat(row.budgetNouserAt) +
        parseFloat(row.budgetIuserAt) +
        parseFloat(row.budgetOuserAt);
      var actCostAt =
        parseFloat(row.actNouserAt) +
        parseFloat(row.actIuserAt) +
        parseFloat(row.actOuserAt);

      return { budgetAt: budgetAt, actCostAt: actCostAt };
    },
    fieldChange: function (row, fieldName, nextReplace) {
      if (nextReplace) {
        row.nextReplace = nextReplace;
      }
      console.log("fieldChange--row.opType==", row.opType);

      //{{formatDate(scope.row.beginDate)}}~{{formatDate(scope.row.endDate)}}  <br/>
      if (!row.budgetIuserPrice) {
        row.budgetIuserPrice = this.selProject.planIuserPrice;
      }
      if (!row.budgetOuserPrice) {
        row.budgetOuserPrice = this.selProject.planOuserPrice;
      }
      if (!row.budgetIuserCnt) {
        row.budgetIuserCnt = 0;
      }

      if (!row.budgetOuserPrice) {
        row.budgetOuserPrice = this.selProject.planOuserPrice;
      }
      if (!row.budgetOuserPrice) {
        row.budgetOuserPrice = this.selProject.planOuserPrice;
      }
      if (!row.budgetOuserCnt) {
        row.budgetOuserCnt = 0;
      }
      if (fieldName == "beginDate" || fieldName == "endDate") {
        if (row.beginDate && row.endDate) {
          var start = new Date(row.beginDate);
          var end = new Date(row.endDate);
          var days = this.getDaysBetween(end, start);
          row.budgetHours = this.getFloatValue(days * 8).toFixed(2);
          row.budgetIuserWorkload =
            row.budgetHours * row.budgetIuserCnt;
          row.budgetIuserAt =
            row.budgetIuserWorkload * row.budgetIuserPrice;
          row.budgetOuserWorkload =
            row.budgetHours * row.budgetOuserCnt;
          row.budgetOuserAt =
            row.budgetOuserWorkload * row.budgetOuserPrice;
          row.budgetWorkload =
            row.budgetIuserWorkload + row.budgetOuserWorkload;
        }
      } else if (fieldName == "budgetHours") {
        row.budgetIuserWorkload =
          row.budgetHours * row.budgetIuserCnt;
        row.budgetIuserAt =
          row.budgetIuserWorkload * row.budgetIuserPrice;
        row.budgetOuserWorkload =
          row.budgetHours * row.budgetOuserCnt;
        row.budgetOuserAt =
          row.budgetOuserWorkload * row.budgetOuserPrice;
        row.budgetWorkload =
          row.budgetIuserWorkload + row.budgetOuserWorkload;
      } else if (
        fieldName == "budgetIuserPrice" ||
        fieldName == "budgetIuserCnt"
      ) {
        row.budgetIuserWorkload =
          row.budgetHours * row.budgetIuserCnt;
        row.budgetIuserAt =
          row.budgetIuserWorkload * row.budgetIuserPrice;
        row.budgetWorkload =
          row.budgetIuserWorkload + row.budgetOuserWorkload;
      } else if (
        fieldName == "budgetOuserPrice" ||
        fieldName == "budgetOuserCnt"
      ) {
        row.budgetOuserWorkload =
          row.budgetHours * row.budgetOuserCnt;
        row.budgetOuserAt =
          row.budgetOuserWorkload * row.budgetOuserPrice;
        row.budgetWorkload =
          row.budgetIuserWorkload + row.budgetOuserWorkload;
      }
      if (row.opType) {
        var index = this.valueChangeRows.findIndex((i) => i.id == row.id);

        if (index >= 0) {
          this.valueChangeRows.splice(index, 1);
          this.valueChangeRows.push(row);
        } else {
          this.valueChangeRows.push(row);
        }
      } else {
        var oneRow = this.valueChangeRows.find((i) => i.id == row.id);
        if (oneRow) {
          if (oneRow.nextReplace) {
            var index = this.valueChangeRows.findIndex((i) => i.id == row.id);
            this.valueChangeRows.splice(index, 1);
            this.valueChangeRows.push(row);
          } else {
            return;
          }
        } else {
          this.valueChangeRows.push(row);
        }
      }
    },
    saveBatchEdit: function () {
      if (
        !this.roles.some((i) => i.roleid == "projectAdmin") &&
        !this.roles.some((i) => i.roleid == "teamAdmin")
      ) {
        this.$notify({
          showClose: true,
          message: "只有项目经理、小组组长可以操作计划",
          type: "error",
        });
        return;
      }
      if (this.valueChangeRows.length == 0) {
        this.$notify({
          showClose: true,
          message: "没有改变任何数据，无需保存",
          type: "success",
        });
        return;
      } else {
        if (this.budgetData.surplusPlanIuserAt < 0) {
          this.$notify({
            showClose: true,
            message: "内部人力预算不足，请调整",
            type: "error",
          });
          return;
        }
        if (this.budgetData.surplusPlanOuserAt < 0) {
          this.$notify({
            showClose: true,
            message: "外购人力预算不足，请调整",
            type: "error",
          });
          return;
        }
        if (this.budgetData.surplusPlanNouserAt < 0) {
          this.$notify({
            showClose: true,
            message: "非人力预算不足请调整",
            type: "error",
          });
          return;
        }

        this.load.edit = true;
        batchSaveBudget(this.valueChangeRows)
          .then((res) => {
            this.load.edit = false;
            var tips = res.data.tips;
            if (tips.isOk) {
              this.valueChangeRows = [];
              this.getXmPhases();
            }
            this.$notify({
              showClose: true,
              message: tips.msg,
              type: tips.isOk ? "success" : "error",
            });
          })
          .catch((e) => (this.load.edit = false));
      }
    },
    formatDate(dateStr) {
      if (dateStr == null || dateStr == "") {
        return "";
      } else {
        return dateStr.substr(0, 10);
      }
    },
    noBatchEdit() {
      this.batchEditVisible = false;
      if (this.valueChangeRows.length > 0) {
        this.valueChangeRows = [];
        this.$emit("back", false);
      } else {
        this.$emit("back", false);
      }
    },
    calcTaskStateByTime(startTime, endTime, actRate, phaseStatus) {
      if (
        startTime == null ||
        startTime == "" ||
        endTime == null ||
        endTime == ""
      ) {
        return { remark: "未配置日期", status: "warning" };
      }
      var curDate = new Date();
      var start = new Date(startTime);
      var end = new Date(endTime);
      if (this.getDaysBetween(curDate, start) <= 0) {
        return {
          remark:
            this.toFixed(this.getDaysBetween(start, curDate)) + "天后开始",
          status: "primary",
        };
      } else if (
        this.getDaysBetween(curDate, start) > 0 &&
        this.getDaysBetween(curDate, end) <= 0
      ) {
        return {
          remark: this.toFixed(this.getDaysBetween(end, curDate)) + "天后结束",
          status: "primary",
        };
      } else if (this.getDaysBetween(curDate, end) > 0) {
        return {
          remark:
            "逾期" + this.toFixed(this.getDaysBetween(curDate, end)) + "天",
          status: "danger",
        };
      }
    },
    /**
     * 计算两个日期之间的天数
     * @param dateString1  开始日期 yyyy-MM-dd
     * @param dateString2  结束日期 yyyy-MM-dd
     */
    getDaysBetween(startDate, endDate) {
      if (startDate == endDate) {
        return 0;
      }
      var days = (startDate - endDate) / (1 * 24 * 60 * 60 * 1000);
      return days;
    },
    getSummariesForBatchEdit: function (params) {
      const { columns, data } = params;
      const sums = [];
      sums[0] = "";
      sums[1] = "总计"; //名字
      sums[2] = ""; //进度
      sums[3] = ""; //开始结束时间
      sums[4] = ""; // 工期 工作量 成本金额

      var workload =
        this.budgetData.budgetIuserWorkload +
        this.budgetData.budgetOuserWorkload;
      var cost =
        this.budgetData.budgetNouserAt +
        this.budgetData.budgetIuserAt +
        this.budgetData.budgetOuserAt;
      sums[4] =
        "工作量:" +
        workload.toFixed(0) +
        "人时,预算金额:" +
        cost.toFixed(0) +
        "元," +
        (cost / 10000).toFixed(2) +
        "万元";
      return sums;
    },
    getSummariesForNoBatchEdit: function (params) {
      const { columns, data } = params;
      const sums = [];
      sums[0] = "";
      sums[1] = ""; //
      sums[2] = "总计"; //名字
      sums[3] = ""; //时间
      sums[4] = ""; //进度
      sums[5] = ""; //工作量 计划、实际
      sums[6] = ""; // 成本 计划、实际
      var budgetWorkload =
        this.budgetData.budgetIuserWorkload +
        this.budgetData.budgetOuserWorkload;

      var actWorkload = this.budgetData.actWorkload;
      var budgetCost =
        this.budgetData.budgetNouserAt +
        this.budgetData.budgetIuserAt +
        this.budgetData.budgetOuserAt;
      var actCost =
        this.budgetData.actIuserAt +
        this.budgetData.actNouserAt +
        this.budgetData.actOuserAt;
      sums[5] =
        "预算工作量:" +
        budgetWorkload +
        "人时,实际:" +
        actWorkload +
        "人时";
      sums[6] =
        "预算金额:" +
        budgetCost.toFixed(0) +
        "元," +
        (budgetCost / 10000).toFixed(2) +
        "万元,实际:" +
        actCost.toFixed(0) +
        "元," +
        (actCost / 10000).toFixed(2) +
        "万元";

      return sums;
    },
    toFixed(floatValue, xsd) {
      if (floatValue == null || floatValue == "" || floatValue == undefined) {
        return 0;
      } else {
        if (xsd) {
          if (typeof floatValue == "number") {
            return floatValue.toFixed(xsd);
          } else {
            return parseFloat(floatValue).toFixed(xsd);
          }
        } else {
          if (typeof floatValue == "number") {
            return floatValue.toFixed(0);
          } else {
            return parseFloat(floatValue).toFixed(0);
          }
        }
      }
    },
    showLog(row) {
      this.editForm = row;
      this.xmRecordVisible = true;
    },
    // 行拖拽
    rowDrop() {
      const _this = this;
      // 被拖动的元素的索引
      let dragged = null;
      // 被拖动的元素的索引
      let draggedIndex = -1;

      // 目标元素
      let target = document.querySelector(
        ".drag-table .el-table__body-wrapper .el-table__body tbody"
      );
      if (target == null) {
        return;
      }
      let rows = 0; //行数
      setTimeout(function () {
        rows = target.childElementCount;
        for (let i = 0; i < target.childElementCount; i++) {
          const child = target.children[i];
          child.draggable = true;
          // child.style.cursor = 'copy'
          child.ondragstart = function (e) {
            console.log("开始--ondragstart--e==", e);

            dragged = e.path[0];
            draggedIndex = e.path[0].rowIndex;
            console.log("child" + i + "开始拖拽" + draggedIndex);
            _this.cellMouseIndex = -1;
            dragged.style.cursor = "grabbing";
          };
          child.ondragend = function () {
            console.log("child" + i + "拖拽结束");
          };
        }
      }, 0);

      // 被拖动的元素正在那个容器里
      let dragIndex = -1;

      target.ondragenter = function (e) {
        clearTimeout(loop);

        // 由于被拖动的元素 经过tbody中的每一元素都会触发该事件, 但是我们只需要它正在那一行上就行了
        if (e.path[0].nodeName === "TD") {
          // throughRow 表示被拖动的元素正在哪一行上
          const throughRow = e.path.find((path) => {
            if (path.className.split(" ").includes("el-table__row")) {
              return path;
            }
          });
          if (dragIndex !== throughRow.rowIndex) {
            if (dragIndex > -1) {
              // 清除上次进入的容器的状态
              const last = target.children[dragIndex];
              clearClass(last);
            }
            // console.log('拖动进入目标元素'+selectRow.rowIndex);
            // 不是自己或未文件夹时才改变状态
            if (draggedIndex !== throughRow.rowIndex) {
              // 改变本次进入的容器的状态
              dragged.style.cursor = "copy";
              throughRow.style.height = 60 + "px";
              throughRow.style.backgroundColor = "#e9fdcf";
            }
            dragIndex = throughRow.rowIndex;
          }
        }
        leaveIndex = -1;
      };
      target.ondragover = function (e) {
        // console.log('目标元素中拖拽...');
        e.preventDefault();
        leaveIndex = -1;
      };

      let loop = null;
      let leaveIndex = -1; // 是否拖出了整个table, -1表示还在table内

      target.ondragleave = function (e) {
        console.log("ondragleave--e==", e);

        clearTimeout(loop);

        if (e.path[0].nodeName) {
          const throughRow = e.path.find((path) => {
            if (path.className.split(" ").includes("el-table__row")) {
              return path;
            }
          });
          if (throughRow && dragIndex !== throughRow.rowIndex) {
            // console.log('拖动离开目标元素'+selectRow.rowIndex);
            // selectRow.style.height = 'unset'
            // selectRow.style.backgroundColor = '#fff'
            // dragIndex = selectRow.rowIndex
          }
          if (throughRow.rowIndex === 0 || throughRow.rowIndex === rows - 1) {
            // 离开第一行或最后一行
            leaveIndex = throughRow.rowIndex;
            loop = setTimeout(function () {
              if (leaveIndex > -1) {
                console.log("离开了", leaveIndex);
                const leave = target.children[leaveIndex];
                clearClass(leave);
                dragIndex = -1;
              }
            }, 100);
          }
          ``;
        }
      };
      target.ondrop = function () {
        console.log("ondrop--放下了" + draggedIndex);
        // 清除上次进入的容器的状态
        const last = target.children[dragIndex];
        clearClass(last);
        dragged.style.cursor = "default";

        console.log("ondrop--draggedIndex==", draggedIndex);
        console.log("ondrop--dragIndex==", dragIndex);

        const form = _this.projectPhaseTreeData[draggedIndex];
        const to = _this.projectPhaseTreeData[dragIndex];

        const startId = _this.$refs["phase_" + draggedIndex].dataset.phaseId;
        const endId = _this.$refs["phase_" + dragIndex].dataset.phaseId;
        console.log(`startId:${startId}--endId:${endId}`);

        if (startId !== endId) {
          _this.changePmenuId(startId, endId);
        }
      };

      let clearClass = function (node) {
        if (node) {
          node.style.height = "unset";
          node.style.backgroundColor = "#fff";
        }
        dragged.style.cursor = "grabbing";
      };
      // if(last && form.menuId !== to.menuId && to.isFolder){
      //   // 移动文件/文件夹
      //   _this.copyOrMoveApi('move', form.menuId, to.menuId)
      // }
    },
    // 判断前后两个数据是否存在同一回路里面
    // dict 为字典；sId拖拽到menuId; ePmeuId 是放置位置的祖先 menuId;
    judgePmenuId(dict, sId, ePmeuId) {
      if (sId === ePmeuId) {
        return true;
      } else if (dict[ePmeuId]) {
        return this.judgePmenuId(dict, sId, dict[ePmeuId]);
      } else {
        return false;
      }
    },
    changePmenuId(sId, eId) {
      let dict = {};
      this.xmPhases.forEach((d) => {
        dict[d.id] = d.parentPhaseId || "";
      });
      if (!dict[eId]) {
        this.xmPhases.find((d) => {
          if (d.id === sId) {
            d.parentPhaseId = eId;
            console.log("更新关系1");
            this.fieldChange(d, "parentPhaseId", true);
          }
        });
      } else {
        const isSynezesis = this.judgePmenuId(dict, sId, dict[eId]);
        if (!isSynezesis) {
          this.xmPhases.find((d) => {
            if (d.id === sId) {
              d.parentPhaseId = eId;
              console.log("更新关系2");
              this.fieldChange(d, "parentPhaseId", true);
            }
          });
        } else {
          console.log("形成闭合回路--拖拽不更新");
        }
      }
    },
    /**end 自定义函数请在上面加**/
    formateOption: function (itemCode, value) {
      if (this.dicts[itemCode]) {
        var dicts = this.dicts[itemCode].filter(
          (i) => i.id == value
        );
        if (dicts && dicts.length > 0) {
          return dicts[0].name;
        } else {
          return value;
        }
      } else {
        return value;
      }
    },
    showMenu: function (parentPhase) {
      if (
        !this.roles.some((i) => i.roleid == "projectAdmin") &&
        !this.roles.some((i) => i.roleid == "teamAdmin")
      ) {
        this.$notify({
          showClose: true,
          message: "只有项目经理、小组组长可以操作计划",
          type: "error",
        });
        return;
      }
      this.parentProjectPhase = parentPhase;
      this.menuVisible = true;
    },

    onSelectedMenus(menus) {
      if (menus == null || menus.length == 0) {
        this.menuVisible = false;
        return;
      }
      var menus2 = JSON.parse(JSON.stringify(menus));
      menus2.forEach((i) => {
        i.id = i.menuId;
        i.parentPhaseId = i.pmenuId;
        i.name = i.menuName;
      });
      this.afterPhaseTemplateSelected(menus2);
      this.menuVisible = false;
    },
    handlePopover: function (row, opType) {
      if (
        !this.roles.some((i) => i.roleid == "projectAdmin") &&
        !this.roles.some((i) => i.roleid == "teamAdmin")
      ) {
        this.$notify({
          showClose: true,
          message: "只有项目经理、小组组长可以操作计划",
          type: "error",
        });
        return;
      }
      if ("add" == opType) {
        var subRow = JSON.parse(JSON.stringify(this.addForm));
        subRow.parentPhaseId = null;
        subRow.id = sn();
        subRow.seqNo = "1";
        subRow.opType = opType;

        subRow.projectId = this.selProject.id;
        subRow.projectName = this.selProject.name;
        subRow.branchId = this.selProject.branchId;
        subRow.budgetAt = 0;
        subRow.budgetNouserAt = 0;
        subRow.budgetIuserAt = 0;
        subRow.budgetOuserAt = 0;
        subRow.budgetWorkload = 0;
        subRow.budgetStaffNu = 0;
        subRow.budgetHours = 160;
        subRow.budgetIuserWorkload = 0;
        subRow.budgetOuserWorkload = 0;
        subRow.budgetIuserPrice = this.selProject.planIuserPrice;
        subRow.budgetOuserPrice = this.selProject.planOuserPrice;
        subRow.budgetOuserCnt = 0;
        subRow.budgetIuserCnt = 0;
        const ctime = new Date();
        var beginDate = new Date();
        const endDate = new Date();
        endDate.setTime(ctime.getTime() + 3600 * 1000 * 24 * 7 * 4); //两周后
        subRow.ctime = util.formatDate.format(ctime, "yyyy-MM-dd HH:mm:ss");
        subRow.beginDate = util.formatDate.format(
          beginDate,
          "yyyy-MM-dd HH:mm:ss"
        );
        subRow.endDate = util.formatDate.format(endDate, "yyyy-MM-dd HH:mm:ss");

        this.fieldChange(subRow, "seqNo");
        this.xmPhases.unshift(subRow);
      } else if ("addSub" == opType) {
        if (row.ntype != "1") {
          this.$notify.error(
            "【" + row.name + "】不是计划集，不允许在其下增加子计划"
          );
          return;
        }
        var subRow = JSON.parse(JSON.stringify(row));
        subRow.children = null;
        subRow.childrenCnt = 0;
        subRow.ntype = "1";
        subRow.parentPhaseId = row.id;
        subRow.id = sn();
        subRow.seqNo = row.seqNo + ".1";
        subRow.opType = opType;
        this.fieldChange(subRow, "seqNo");
        this.xmPhases.push(subRow);
        if (row.children) {
          row.children.push(subRow);
        } else {
          row.children = [subRow];
        }

        //this.$refs.table.doLayout();
      } else if ("delete" == opType) {
        if (row.opType && (row.opType == "addSub" || row.opType == "add")) {
          if (row.children && row.children.length > 0) {
            this.$notify.error("请先删除子元素");
            return;
          } else {
            var index = this.xmPhases.findIndex((i) => i.id == row.id);
            var indexValueChanges = this.valueChangeRows.findIndex(
              (i) => i.id == row.id
            );
            this.valueChangeRows.splice(indexValueChanges, 1);
            this.xmPhases.splice(index, 1);
          }
        }
      } else if ("highestPmenuId" === opType) {
        if (row.id) {
          this.xmPhases.find((d) => {
            if (d.id === row.id) {
              d.parentPhaseId = "";
              this.fieldChange(d, "seqNo", true);
            }
          });
        }
      } else {
        this.$notify.error("只能删除未保存的行");
        return;
      }
    },
  }, //end methods
  components: {
    //在下面添加其它组件
  },
  mounted() {
    this.$nextTick(() => { 
      this.tableHeight = util.calcTableMaxHeight(this.$refs.table.$el)
      if (this.selProject) {
        this.getXmPhases();
      } 
			initSimpleDicts('all',['xmPhaseStatus']).then(res=>{
				this.dicts=res.data.data;
			})
    });
    // 阻止默认行为
    document.body.ondrop = function (event) {
      event.preventDefault();
      event.stopPropagation();
    };
    //this.rowDrop();
  },
};
</script>

<style lang="scss" scoped>
.el-table {
  box-sizing: border-box;
  /deep/ .cell {
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
    word-break: break-all;
    line-height: 23px;
    padding-right: 10px;
    display: flex;
  }
}
</style>