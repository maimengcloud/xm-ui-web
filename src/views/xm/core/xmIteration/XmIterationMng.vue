<template>
  <section :class="{'padding':!xmProduct&&!selProject}">
    <el-row>
      <xm-product-select show-style="tag"
        v-if="!xmProduct || !xmProduct.id"
        ref="xmProductSelect1"
        style="display: inline"
        :auto-select="false"
        :link-project-id="selProject ? selProject.id : null"
        @change2="onProductSelected"
        @clear="onProductClearSelect"
      ></xm-product-select>
      <el-input
        v-if="filters.queryScope == 'iterationId'"
        v-model="filters.id"
        style="width: 20%"
        placeholder="输入迭代编号"
        @keyup.enter.native="searchXmProducts"
      >
      </el-input>
      <el-input v-model="filters.iterationName" style="width: 15%" placeholder="模糊查询">
      </el-input>
      <el-button
        type="primary"
        v-loading="load.list"
        :disabled="load.list == true"
        v-on:click="searchXmIterations"
        icon="el-icon-search"
      ></el-button>
      <el-popover placement="top-start" title="更多条件、操作" width="500" trigger="manual" v-model="moreVisible">

      <el-row  style="float:right;margin-top:-40px">
          <el-button
          icon="el-icon-close"
          @click="moreVisible=false"
          type="text"
          >关闭</el-button
          >
      </el-row>
      <el-descriptions class="margin-top" size="mini" :column="1" border>
									<el-descriptions-item v-if="xmProduct">
										<template slot="label">
											<i class="el-icon-document"></i>
											当前产品
										</template>
										<el-tag v-if="xmProduct">{{xmProduct.productName}}</el-tag>
									</el-descriptions-item>
									<el-descriptions-item v-if="selProject">
										<template slot="label">
											<i class="el-icon-document"></i>
											当前项目
										</template>
										<el-tag v-if="selProject">{{selProject?selProject.name:''}}</el-tag>
									</el-descriptions-item>
									<el-descriptions-item :span="2">
										<template slot="label">
											<i class="el-icon-watch-1"></i>
											创建时间
										</template>

										<mdp-date-range
												v-model="filters"
												type="daterange"
												start-key="onlineTimeStart"
												end-key="onlineTimeEnd"
												unlink-panels
												range-separator="至"
												start-placeholder="开始日期"
												end-placeholder="完成日期"
												value-format="yyyy-MM-dd HH:mm:ss"
												:default-time="['00:00:00', '23:59:59']"
												:auto-default="false"
												key="planEndTime"
												></mdp-date-range>
									</el-descriptions-item>
									<el-descriptions-item>
										<template slot="label">
											<i class="el-icon-document"></i>
											迭代编号
										</template>
										<el-input v-model="filters.id" clearable></el-input>
									</el-descriptions-item>
									<el-descriptions-item>
										<template slot="label">
											<i class="el-icon-document"></i>
											迭代名称
										</template>
										<el-input v-model="filters.groupName" clearable ></el-input>
									</el-descriptions-item>

									<el-descriptions-item>
										<el-button type="primary" style="float:right;" @click="searchXmIterations" icon="el-icon-search">查询</el-button>
									</el-descriptions-item>
								</el-descriptions>
        <el-button slot="reference" icon="el-icon-more" @click="moreVisible=true"></el-button>
      </el-popover>
      <span style="float: right">
        <el-button type="primary" @click="showAdd" icon="el-icon-plus" round
          >迭代计划</el-button
        >
      </span>
    </el-row>
    <el-row class="padding-top">
      <!--列表 XmIteration 迭代定义-->
      <el-table
        ref="table"
        height="100px" v-adaptive="{bottomOffset:50}"
        v-if="!gstcVisible"
        :data="xmIterationTreeData"
        row-key="id"
        default-expand-all
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        @sort-change="sortChange"
        highlight-current-row
        v-loading="load.list"
        border
        @selection-change="selsChange"
        @row-click="rowClick"
        style="width: 100%"
      >
        <el-table-column
          type="selection"
          aria-disabled
          width="55"
        ></el-table-column>
        <el-table-column prop="iterationName" label="迭代名称" min-width="260"  sortable>
          <template slot-scope="scope">
            <el-link type="primary" @click="intoInfo(scope.row, scope.$index)">
              {{ scope.row.iterationName }}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column prop="finishRate" label="总进度" min-width="80" sortable>
          <template slot-scope="scope">
             <el-tag style="width:4em;"
                :type="scope.row.finishRate >= 100 ? 'success' : 'warning'"
                >{{ scope.row.finishRate }}%</el-tag
              >
                <el-button title="点击统计进度，由任务汇总"
                  type="text"
                  circle
                  plain
                  icon="el-icon-video-play"
                  @click.stop="loadTasksToXmIterationState(scope.row)"
                ></el-button>
          </template>
        </el-table-column>
        <el-table-column  sortable
          prop="startTime"
          label="开始时间"
          min-width="80"
          :formatter="formatterDate"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column sortable
          prop="endTime"
          label="结束时间"
          min-width="80"
          :formatter="formatterDate"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="onlineTime"  sortable
          label="上线时间"
          min-width="80"
          :formatter="formatterDate"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column  sortable
          prop="adminUsername"
          label="负责人姓名"
          min-width="80"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column  sortable
          prop="budgetWorkload"
          label="已分配工作量"
          min-width="80"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="actWorkload"  sortable
          label="实际工作量"
          min-width="80"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template slot-scope="scope">
            <el-button
              v-if="menukey == 'myFocus'"
              type="primary"
              @click.stop="focusOrUnfocus(scope.row)"
              >取消关注</el-button
            >
            <el-button
              v-else
              type="text"
              @click.stop="focusOrUnfocus(scope.row)"
              >关注</el-button
            >
            <el-button
              type="danger"
              @click="handleDel(scope.row, scope.$index)"
              icon="el-icon-delete"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-if="!gstcVisible"
        layout="total, sizes, prev, pager, next"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        :page-sizes="[10, 20, 50, 100, 500]"
        :current-page="pageInfo.pageNum"
        :page-size="pageInfo.pageSize"
        :total="pageInfo.total"
        style="float: right"
      ></el-pagination>
      <xm-gantt
        v-if="gstcVisible"
        :tree-data="xmIterationTreeData"
        :project-phase="{ startTime: '2020-06-01', endTime: '2020-12-30' }"
        :columns="ganrrColumns"
        :useRealTime="false"
      ></xm-gantt>

      <!--编辑 XmIteration 迭代定义界面-->
      <el-drawer
        title="编辑迭代定义"
        :visible.sync="editFormVisible"
        size="50%"
        append-to-body
        :close-on-click-modal="false"
      >
        <xm-iteration-edit
          :xm-iteration="editForm"
          :visible="editFormVisible"
          @cancel="editFormVisible = false"
          @submit="afterEditSubmit"
        ></xm-iteration-edit>
      </el-drawer>

      <!--新增 XmIteration 迭代定义界面-->
      <el-drawer
        title="新增迭代定义"
        :visible.sync="addFormVisible"
        size="50%"
        append-to-body
        :close-on-click-modal="false"
      >
        <xm-iteration-add op-type="add"
          :xm-product="xmProduct"
          :sel-project="selProject"
          :xm-iteration="addForm"
          :parent-iteration="parentIteration"
          :visible="addFormVisible"
          @cancel="addFormVisible = false"
          @submit="afterAddSubmit"
        ></xm-iteration-add>
      </el-drawer>

      <!--新增 XmIteration 迭代定义界面-->
      <el-drawer
        title="迭代报告"
        :visible.sync="iterationStateVisible"
        fullscreen
        append-to-body
        :close-on-click-modal="false"
      >
        <xm-iteration-state-mng
          :xm-iteration="editForm"
          :visible="iterationStateVisible"
          @cancel="iterationStateVisible = false"
        ></xm-iteration-state-mng>
      </el-drawer>
    </el-row>
  </section>
</template>

<script>
import util from "@/common/js/util"; //全局公共库
import config from "@/common/config"; //全局公共库

import {
  listXmIteration,
  listXmIterationWithState,
  delXmIteration,
  batchDelXmIteration,
} from "@/api/xm/core/xmIteration";
import {
  loadTasksToXmIterationState,
} from "@/api/xm/core/xmIterationState";
import {
  addXmIterationLink,
  delXmIterationLink,
} from "@/api/xm/core/xmIterationLink";

import XmIterationAdd from "./XmIterationEdit"; //新增界面
import XmIterationEdit from "./XmIterationEdit"; //修改界面
import XmIterationStateMng from "../xmIterationState/XmIterationStateMng"; //修改界面
import XmGantt from "../components/xm-gantt";

import { mapGetters } from "vuex";
import XmIterationSelect from "@/views/xm/core/components/XmIterationSelect.vue";
import XmProductSelect from "@/views/xm/core/components/XmProductSelect.vue";
import { addUserFocus, delUserFocus } from "@/api/mdp/sys/userFocus";
import store from '@/store'
export default {
  computed: {
    ...mapGetters(["userInfo", "roles"]),

    xmIterationTreeData() {
      return this.xmIterations;
    },
  },
  props: ["xmProduct", "selProject", "menuId", "visible"],
  watch: {
    visible: function (visible) {
		this.filters.xmProduct=this.xmProduct
      if (visible == true) {
        this.getXmIterations();
      }
    },
    xmProduct: function () {
		this.filters.xmProduct=this.xmProduct
      	this.getXmIterations();
    },
    selProject: function () {
      this.getXmIterations();
    },
  },
  data() {
    const beginDate = new Date();
    const endDate = new Date();
    beginDate.setTime(beginDate.getTime() - 3600 * 1000 * 24 * 7 * 4 * 12);
    endDate.setTime(endDate.getTime() + 3600 * 1000 * 24 * 7 * 4 * 12);
    return {
      filters: {
        iterationName: "",
        queryScope: "", //迭代查询范围 iterationId\branchId\compete\''
        id: "", //迭代编号
		    xmProduct:null,
        onlineTimeStart:'',
        onlineTimeEnd:'',
      },
      xmIterations: [], //查询结果
      pageInfo: {
        //分页数据
        total: 0, //服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
        pageSize: 10, //每页数据
        count:true, //是否需要重新计算总记录数
        pageNum: 1, //当前页码、从1开始计算
        orderFields: [], //排序列 如 ['sex','student_id']，必须为数据库字段
        orderDirs: [], //升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
      },
      load: { list: false, edit: false, del: false, add: false }, //查询中...
      sels: [], //列表选中数据
      dicts: {
        //sex:[],
      }, //下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]}

      addFormVisible: false, //新增xmIteration界面是否显示
      //新增xmIteration界面初始化数据
      addForm: {
        id: "",
        branchId: "",
        iterationName: "",
        startTime: "",
        endTime: "",
        onlineTime: "",
        pid: "",
        adminUserid: "",
        adminUsername: "",
        ctime: "",
        budgetCost: "",
        budgetWorkload: "",
        seqNo: "",
        istatus: "",
        cuserid: "",
        cusername: "",
        remark: "",
        iphase: "",
        isTpl: "",
        productId: "",
        productName:''
      },

      editFormVisible: false, //编辑界面是否显示
      //编辑xmIteration界面初始化数据
      editForm: {
        id: "",
        branchId: "",
        iterationName: "",
        startTime: "",
        endTime: "",
        onlineTime: "",
        pid: "",
        adminUserid: "",
        adminUsername: "",
        ctime: "",
        budgetCost: "",
        budgetWorkload: "",
        seqNo: "",
        istatus: "",
        cuserid: "",
        cusername: "",
        remark: "",
        iphase: "",
        isTpl: "",
        productId: "",
        productName:''
      },
      editFormInit: {
        id: "",
        branchId: "",
        iterationName: "",
        startTime: "",
        endTime: "",
        onlineTime: "",
        pid: "",
        adminUserid: "",
        adminUsername: "",
        ctime: "",
        budgetCost: "",
        budgetWorkload: "",
        seqNo: "",
        istatus: "",
        cuserid: "",
        cusername: "",
        remark: "",
        iphase: "",
        isTpl: "",
        productId: "",
        productName:''
      },

      /**begin 自定义属性请在下面加 请加备注**/
      valueChangeRows: [],
      parentIteration: null,
      iterationStateVisible: false,
      iterationSelectVisible: false,
      gstcVisible: false,
      maxTableHeight: 300,
      moreVisible:false,
      ganrrColumns: {
        children: "children",
        name: "iterationName",
        id: "id",
        pid: "pid",
        startDate: "startTime",
        endDate: "endTime",
      },
      menukey: "unFocus",
      /**end 自定义属性请在上面加 请加备注**/
    };
  }, //end data
  methods: {
    handleSizeChange(pageSize) {
      this.pageInfo.pageSize = pageSize;
      this.getXmIterations();
    },
    handleCurrentChange(pageNum) {
      this.pageInfo.pageNum = pageNum;
      this.getXmIterations();
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
      this.getXmIterations();
    },
    searchXmIterations() {
      this.pageInfo.count = true;
      this.getXmIterations();
    },
    //获取列表 XmIteration 迭代定义
    getXmIterations() {
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
      if (this.filters.iterationName) {
        params.iterationName =   this.filters.iterationName
      }
      if (this.filters.xmProduct) {
        params.productId = this.filters.xmProduct.id;
      }

      if (this.selProject) {
        params.linkProjectId = this.selProject.id;
      }
      if (this.menuId) {
        params.menuId = this.menuId;
      }
      if (!this.menuId && !this.filters.xmProduct && !this.selProject) {
        params.queryScope = this.filters.queryScope;
        if (this.filters.queryScope == "iterationId") {
          if (!this.filters.id) {
            this.$notify({
              position: "bottom-left",
              showClose: true,
              message: "您选择了按迭代编号精确查找模式，请输入迭代编号",
              type: "error",
            });
            return;
          }
          params.id = this.filters.id;
        }
        if (this.filters.queryScope == "branchId") {
          params.branchId = this.userInfo.branchId;
        }
      }
      if(this.filters.onlineTimeStart && this.filters.onlineTimeEnd){
        params.onlineTimeStart = this.filters.onlineTimeStart;
        params.onlineTimeEnd =  this.filters.onlineTimeEnd;
      }

      this.load.list = true;
      listXmIterationWithState(params)
        .then((res) => {
          var tips = res.data.tips;
          if (tips.isOk) {
            this.pageInfo.total = res.data.total;
            this.pageInfo.count = false;
            this.xmIterations = res.data.data;
          } else {
            this.$notify({
              position: "bottom-left",
              showClose: true,
              message: tips.msg,
              type: "error",
            });
          }
          this.load.list = false;
        })
        .catch((err) => (this.load.list = false));
    },

    //显示编辑界面 XmIteration 迭代定义
    showEdit: function (row, index) {
      this.editFormVisible = true;
      this.editForm = Object.assign({}, row);
    },
    //显示新增界面 XmIteration 迭代定义
    showAdd: function () {
      this.parentIteration = null;
      this.addFormVisible = true;
    },
    showSubAdd: function (row) {
      this.parentIteration = row;
      this.addFormVisible = true;
    },
    afterAddSubmit(xmIteration) {
      this.addFormVisible = false;
      this.pageInfo.count = true;
      this.getXmIterations();
    },
    afterEditSubmit() {
      this.editFormVisible = false;
    },

    //进入info界面
    intoInfo(row) {
      this.editForm = row;
      store.dispatch('setXmIteration',row).then(res=>{
        this.$router.push({
          path:'/xm/core/iteration/overview',
          query:{
            iterationId:row.id
          }
        })
      })
    },
    //选择行xmIteration
    selsChange: function (sels) {
      this.sels = sels;
    },
    //删除xmIteration
    handleDel: function (row, index) {
      if (!this.roles.some((i) => i.roleid == "iterationAdmin")) {
        this.$notify({
          position: "bottom-left",
          showClose: true,
          message: "只有迭代管理员可以删除迭代",
          type: "error",
        });
        return;
      }
      this.$confirm("确认删除该记录吗?", "提示", {
        type: "warning",
      }).then(() => {
        this.load.del = true;
        let params = { id: row.id };
        delXmIteration(params)
          .then((res) => {
            this.load.del = false;
            var tips = res.data.tips;
            if (tips.isOk) {
              this.pageInfo.count = true;
              this.getXmIterations();
            }
            this.$notify({
              position: "bottom-left",
              showClose: true,
              message: tips.msg,
              type: tips.isOk ? "success" : "error",
            });
          })
          .catch((err) => (this.load.del = false));
      });
    },
    //批量删除xmIteration
    batchDel: function () {
      if (!this.roles.some((i) => i.roleid == "iterationAdmin")) {
        this.$notify({
          position: "bottom-left",
          showClose: true,
          message: "只有迭代管理员可以删除迭代",
          type: "error",
        });
        return;
      }
      this.$confirm("确认删除选中记录吗？", "提示", {
        type: "warning",
      }).then(() => {
        this.load.del = true;
        batchDelXmIteration(this.sels)
          .then((res) => {
            this.load.del = false;
            var tips = res.data.tips;
            if (tips.isOk) {
              this.pageInfo.count = true;
              this.getXmIterations();
            }
            this.$notify({
              position: "bottom-left",
              showClose: true,
              message: tips.msg,
              type: tips.isOk ? "success" : "error",
            });
          })
          .catch((err) => (this.load.del = false));
      });
    },
    rowClick: function (row, event, column) {
      this.editForm = row;
      this.$emit("row-click", row, event, column); //  @row-click="rowClick"
    },

    clearSelectIteration() {
      this.editForm = this.editFormInit;
      this.$emit("clear-select", null); //  @row-click="rowClick"
    },
    fieldChange: function (row, fieldName) {
      if (this.valueChangeRows.some((i) => i.id == row.id)) {
        return;
      } else {
        this.valueChangeRows.push(row);
      }
    },
    loadTasksToXmIterationState(row) {
      this.load.edit = true;
      loadTasksToXmIterationState({ id: row.id }).then((res) => {
        this.load.edit = false;
        var tips = res.data.tips;
        if (tips.isOk) {
          this.getXmIterations();
        }
        this.$notify({
          position: "bottom-left",
          showClose: true,
          message: tips.msg,
          type: tips.isOk ? "success" : "error",
        });
      });
    },
    showIterationState(row) {
      this.editForm = row;
      this.iterationStateVisible = true;
    },
    formatterDate(row, column, cellValue, index) {
      if (cellValue) {
        return cellValue.substr(0, 10);
      } else {
        return cellValue;
      }
    },
    focusOrUnfocus: function (row) {
      if (this.menukey == "myFocus") {
        delUserFocus({
          pbizId: row.productId,
          focusType: "6",
          bizId: row.id,
          bizName: row.iterationName,
        }).then((res) => {
          var tips = res.data.tips;
          if (tips.isOk) {
            this.getXmIterations();
          }
          this.$notify({
            position: "bottom-left",
            showClose: true,
            message: tips.msg,
            type: tips.isOk ? "success" : "error",
          });
        });
      } else {
        addUserFocus({
          pbizId: row.productId,
          focusType: "6",
          bizId: row.id,
          bizName: row.iterationName,
        }).then((res) => {
          var tips = res.data.tips;
          this.$notify({
            position: "bottom-left",
            showClose: true,
            message: tips.msg,
            type: tips.isOk ? "success" : "error",
          });
        });
      }
    },
	onProductSelected(row){
		this.filters.xmProduct=row
	},
	onProductClearSelect(){
		this.filters.xmProduct=null;
	}
  }, //end methods
  components: {
    "xm-iteration-add": XmIterationAdd,
    "xm-iteration-edit": XmIterationEdit,
    XmIterationStateMng,
    XmGantt,
    XmIterationSelect,
    XmProductSelect,
    //在下面添加其它组件
  },
  mounted() {
    this.$nextTick(() => {
      this.maxTableHeight = util.calcTableMaxHeight(this.$refs.table.$el);
	  this.filters.xmProduct=this.xmProduct
      this.getXmIterations();
    });
    // console.log(this.dateRanger,this.dateRangerOnline);
    /** 举例，

			**/
  },
};
</script>

<style scoped>
.more-label-font {
  text-align: center;
  float: left;
  padding-top: 5px;
}
</style>
