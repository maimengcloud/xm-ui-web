<template>
  <section class="padding">
    <el-row :gutter="5" v-loading="load.list">
      <el-col :span="18">
        <div>
          <div
            class="main"
            :id="id"
            style="width: 100%; height: 600px; margin: 0 auto"
          ></div>
        </div>
      </el-col>
      <el-col :span="6" class="border padding">
        <el-form :model="filters">
          <el-form-item label="归属项目" v-if="!xmProject">
            <xm-project-select
              v-if="!xmProject"
              ref="xmProjectSelect"
              style="display: inline"
              :auto-select="false"
              :link-project-id="xmProject ? xmProject.id : null"
              @row-click="onProjectSelected"
              @clear="onProjectClear"
            ></xm-project-select>
          </el-form-item>
          <el-form-item label="人员编号" v-if="queryScope !== 'my' && (!user|| !user.userid)">
            <mdp-select-user-xm label="选择人员" :clearable="true" v-model="filters" userid-key="userid" username-key="username" :project-id="filters.project?filters.project.id:null"></mdp-select-user-xm>
          </el-form-item>

          <el-form-item label="任务编号编号">
            <el-input v-model="filters.taskId"></el-input>
          </el-form-item>
          <el-form-item label="日期区间">
            <br />
            <mdp-date-range
              v-model="filters"
              value-format="yyyy-MM-dd"
              start-key="startBizDate"
              end-key="endBizDate"
            ></mdp-date-range>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              @click="listProjectWorkloadSetDay"
              >查询</el-button
            >
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-row class="padding-top">
      <!--列表 XmWorkload 工时登记表-->
      <el-table
        ref="xmWorkloadTable"
        :data="xmProjectWorkloadSetDays"

        highlight-current-row
        v-loading="load.list"
        @row-click="rowClick"
        border
        style="width: 100%"
        :header-cell-style="{ 'text-align': 'center' }"
        :cell-style="{ 'text-align': 'center' }"
      >
        <el-table-column
          sortable
          type="index"
          width="55"
          show-overflow-tooltip
          fixed="left"
        ></el-table-column>
        <el-table-column
          prop="bizDate"
          label="工时日期"
          width="120"
          show-overflow-tooltip
          sortable
          fixed="left"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.bizDate }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="workload"
          label="登记工时"
          min-width="120"
          show-overflow-tooltip
          sortable
        >
          <template slot-scope="scope">
            <el-link
              type="primary"
              style="display: inline"
              @click="showPopover(scope.row, 'workload', '', '')"
              >{{ scope.row.workload }}h</el-link
            >
          </template>
        </el-table-column>
        <el-table-column
          prop="toConfirmWorkload"
          label="待确认"
          min-width="120"
          show-overflow-tooltip
          sortable
        >
          <template slot-scope="scope">
            <el-link
              type="primary"
              slot="reference"
              style="display: inline"
              @click="showPopover(scope.row, 'toConfirmWorkload', '0', '')"
              >{{ scope.row.toConfirmWorkload }}h</el-link
            >
          </template>
        </el-table-column>
        <el-table-column
          prop="hadConfirmWorkload"
          label="已确认"
          min-width="120"
          show-overflow-tooltip
          sortable
        >
          <template slot-scope="scope">
            <el-link
              type="success"
              slot="reference"
              style="display: inline"
              @click="showPopover(scope.row, 'hadConfirmWorkload', '1', '')"
              >{{ scope.row.hadConfirmWorkload }}h</el-link
            >
          </template>
        </el-table-column>
        <el-table-column
          prop="notNeedSetWorkload"
          label="无须结算"
          min-width="120"
          show-overflow-tooltip
          sortable
        >
          <template slot-scope="scope">
            <el-link
              type="info"
              slot="reference"
              style="display: inline"
              @click="showPopover(scope.row, 'notNeedSetWorkload', '1', '0')"
              >{{ scope.row.notNeedSetWorkload }}h</el-link
            >
          </template>
        </el-table-column>
        <el-table-column
          prop="toSetSworkload"
          label="待结算"
          min-width="120"
          show-overflow-tooltip
          sortable
        >
          <template slot-scope="scope">
            <el-link
              type="warning"
              slot="reference"
              style="display: inline"
              @click="showPopover(scope.row, 'toSetSworkload', '1', '1')"
              >{{ scope.row.toSetSworkload }}h</el-link
            >
          </template>
        </el-table-column>
        <el-table-column
          prop="hadCommitSworkload"
          label="已提交审核"
          min-width="120"
          show-overflow-tooltip
          sortable
        >
          <template slot-scope="scope">
            <el-link
              type="primary"
              slot="reference"
              style="display: inline"
              @click="showPopover(scope.row, 'hadCommitSworkload', '1', '2')"
              >{{ scope.row.hadCommitSworkload }}h</el-link
            >
          </template>
        </el-table-column>
        <el-table-column
          prop="hadAgreeSworkload"
          label="已审核"
          min-width="120"
          show-overflow-tooltip
          sortable
        >
          <template slot-scope="scope">
            <el-link
              type="primary"
              slot="reference"
              style="display: inline"
              @click="showPopover(scope.row, 'hadAgreeSworkload', '1', '3')"
              >{{ scope.row.hadAgreeSworkload }}h</el-link
            >
          </template>
        </el-table-column>
        <el-table-column
          prop="hadSetSworkload"
          label="已结算"
          min-width="120"
          show-overflow-tooltip
          sortable
        >
          <template slot-scope="scope">
            <el-link
              type="danger"
              slot="reference"
              style="display: inline"
              @click="showPopover(scope.row, 'hadSetSworkload', '1', '4')"
              >{{ scope.row.hadSetSworkload }}h</el-link
            >
          </template>
        </el-table-column>
      </el-table>
    </el-row>

    <el-dialog
      :title="
        '【' + editForm.bizDate + '】【' + stateName[columnProp] + '】工时记录'
      "
      append-to-body
      :visible.sync="workloadDialogVisible"
      top="20px"
      width="80%"
    >
      <xm-workload-simple-list-for-biz-date
        :visible="workloadDialogVisible"
        :wstatus="wstatus"
        :sstatus="sstatus"
        :task-id="filters.taskId"
        :project-id="filters.project ? filters.project.id : null"
        :biz-date="editForm.bizDate"
      ></xm-workload-simple-list-for-biz-date>
    </el-dialog>
  </section>
</template>

<script>
import util from "@/common/js/util"; //全局公共库
import seq from '@/common/js/sequence';//全局公共库

import { mapGetters } from "vuex";

import XmProjectSelect from "@/views/xm/core/components/XmProjectSelect"; //新增界面
import { listProjectWorkloadSetDay } from "@/api/xm/core/xmWorkload";
import XmWorkloadSimpleListForBizDate from "@/views/xm/core/xmWorkload/XmWorkloadSimpleListForBizDate";
export default {
  components: {
    XmProjectSelect,
    XmWorkloadSimpleListForBizDate,
    "mdp-select-user-xm":()=>import("@/views/xm/core/components/MdpSelectUserXm/index")
  },
  props: ["xmProduct", "xmProject", "queryScope",'user'],
  computed: {
    ...mapGetters(["userInfo", "roles"]),
    dataSetCpd() {
      return [
        ["日期", ...this.xmProjectWorkloadSetDays.map((i) => i.bizDate)],
        //['登记工时',...this.xmProjectWorkloadSetDays.map(i=>i.workload)],
        [
          "待确认",
          ...this.xmProjectWorkloadSetDays.map((i) => i.toConfirmWorkload),
        ],
        [
          "已确认",
          ...this.xmProjectWorkloadSetDays.map((i) => i.hadConfirmWorkload),
        ],
        [
          "无需结算",
          ...this.xmProjectWorkloadSetDays.map((i) => i.notNeedSetWorkload),
        ],
        [
          "待结算",
          ...this.xmProjectWorkloadSetDays.map((i) => i.toSetSWorkload),
        ],
        [
          "已提交审核",
          ...this.xmProjectWorkloadSetDays.map((i) => i.hadCommitSworkload),
        ],
        [
          "已审核",
          ...this.xmProjectWorkloadSetDays.map((i) => i.hadAgreeSworkload),
        ],
        [
          "已结算",
          ...this.xmProjectWorkloadSetDays.map((i) => i.hadSetSworkload),
        ],
      ];
    },
  },
  watch: {
    dataSetCpd() {
      this.$nextTick(() => {
        this.drawCharts();
      });
    },
  },
  data() {
    return {
      filters: {
        category: "",
        product: null,
        iteration: null,
        project: null,
        startBizDate: "",
        endBizDate: "",
        userid: "",
        username:'',
        taskId: "",
      },
      dicts: {}, //下拉选择框的所有静态数据  params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]}
      load: { list: false, edit: false, del: false, add: false }, //查询中...
      dateRanger: [],
      maxTableHeight: 300,
      visible: false,
      xmProjectWorkloadSetDays: [],
      editForm: {
        bizDate: "",
        toConfirmWorkload: 0,
        hadConfirmWorkload: 0,
        toSetSWorkload: 0,
        hadAgreeSworkload: 0,
        hadCommitSworkload: 0,
      },
      columnProp: "",
      workloadDialogVisible: false,
      wstatus: "",
      sstatus: "",
      stateName: {
        workload: "所有",
        toConfirmWorkload: "待确认",
        hadConfirmWorkload: "已确认",
		    notNeedSetWorkload:'无需结算',
        toSetSworkload: "待结算",
        hadAgreeSworkload: "已审核待结算",
        hadCommitSworkload: "已提交待审核",
        hadSetSworkload: "已结算",
      },
      id:seq.sn(),
    }; //end return
  }, //end data
  methods: {
    listProjectWorkloadSetDay() {
      var params = {};
      if (this.filters.project) {
        params.projectId = this.filters.project.id;
      }

      if (this.filters.startBizDate && this.filters.endBizDate) {
        params.startBizDate = this.filters.startBizDate;
        params.endBizDate = this.filters.endBizDate;
      }
      if (this.filters.userid) {
        params.userid = this.filters.userid;
      }
      if (this.filters.taskId) {
        params.taskId = this.filters.taskId;
      }
      if(this.user && this.user.userid){
       params.userid = this.user.userid;
      }
      this.load.list = true;
      listProjectWorkloadSetDay(params).then((res) => {
        this.xmProjectWorkloadSetDays = res.data.tips.isOk
          ? res.data.data
          : this.xmProjectWorkloadSetDays;
        this.load.list = false;
      });
    },
    initData() {
      this.filters.product = this.xmProduct;
      this.filters.project = this.xmProject;
      this.filters.iteration = this.xmIteration;
      this.xmProjectWorkloadSetDays = [];
      if (this.queryScope == "my") {
        this.filters.userid = this.userInfo.userid;
      }
      this.$nextTick(() => {
        if (this.$refs["xmProjectSelect"])
          this.$refs["xmProjectSelect"].clearSelect();
        this.listProjectWorkloadSetDay();
      });
    },
    drawCharts() {
      this.myChart = this.$echarts.init(
        document.getElementById(this.id)
      );
      var that = this;
      this.myChart.on("updateAxisPointer", function (event) {
        const xAxisInfo = event.axesInfo[0];
        if (xAxisInfo) {
          const dimension = xAxisInfo.value + 1;
          that.myChart.setOption({
            series: {
              id: "pie",
              label: {
                formatter: "{b}: {@[" + dimension + "]} ({d}%)",
              },
              encode: {
                value: dimension,
                tooltip: dimension,
              },
            },
          });
        }
      });
      this.myChart.setOption({
        title: {
          text: "工时日报表",
        },
        tooltip: {
          trigger: "axis",
          showContent: false,
        },
        legend: {},

        dataset: {
          source: that.dataSetCpd,
        },
        xAxis: {
          type: "category",
        },
        yAxis: { gridIndex: 0 },
        grid: { top: "55%" },
        series: [
          {
            name: "待确认",
            type: "line",
            seriesLayoutBy: "row",
            smooth: true,
            emphasis: { focus: "series" },
          },
          {
            name: "已确认",
            type: "line",
            seriesLayoutBy: "row",
            smooth: true,
            emphasis: { focus: "series" },
          },
          {
            name: "无需结算",
            type: "line",
            seriesLayoutBy: "row",
            smooth: true,
            emphasis: { focus: "series" },
          },
          {
            name: "待结算",
            type: "line",
            seriesLayoutBy: "row",
            smooth: true,
            emphasis: { focus: "series" },
          },
          {
            name: "已提交审核",
            type: "line",
            seriesLayoutBy: "row",
            smooth: true,
            emphasis: { focus: "series" },
          },

          {
            name: "已审核",
            type: "line",
            seriesLayoutBy: "row",
            smooth: true,
            emphasis: { focus: "series" },
          },
          {
            name: "已结算",
            type: "line",
            seriesLayoutBy: "row",
            smooth: true,
            emphasis: { focus: "series" },
          },
          {
            type: "pie",
            id: "pie",
            radius: "30%",
            center: ["50%", "25%"],
            emphasis: {
              focus: "self",
            },
            label: {
              formatter: "{b}: {@日期} ({d}%)",
            },
            encode: {
              itemName: "日期",
              value: "日期",
              tooltip: "日期",
            },
          },
        ],
      });
    },

    onProjectSelected(project) {
      this.filters.project = project;
      this.xmProjectWorkloadSetDays = [];
      this.listProjectWorkloadSetDay();
    },

    onProjectClear() {
      this.filters.project = null;

      this.xmProjectWorkloadSetDays = [];
    },
    rowClick(row, column, event) {
      this.editForm = row;
      this.columnProp = column.property;
    },
    showPopover(row, fieldName, wstatus, sstatus) {
      this.editForm = row;
      this.workloadDialogVisible = true;
      this.wstatus = wstatus;
      this.sstatus = sstatus;
    },
  }, //end method
  mounted() {
    this.initData();
  }, //end mounted
};
</script>

<style scoped>
.image {
  width: 100%;
  display: block;
}
</style>
