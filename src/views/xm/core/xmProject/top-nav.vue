<template>
  <section>
    <el-row>
      <el-menu
        :default-active="infotype"
        mode="horizontal"
        @select="setInfotype"
        class="menus"
        background-color="rgb(48, 65, 86)"
        text-color="rgb(191, 203, 217)"
        active-text-color="#409eff"
        :router="true"
      >
        
        <el-menu-item index="/xm/core/project/overviewComplex">
          <span
            slot="title"
            style="font-size: 18px; color: #ffd04b"
            class="hidden-sm-and-down"
            :title="projectInfo.name"
          >
            <font v-if="projectInfo.name.length >= 15"
              ><strong
                >&nbsp;<el-avatar class="top-icon" icon="el-icon-odometer" style="background-color:#E6A23C"></el-avatar>&nbsp;项目:&nbsp;{{ projectInfo.name.substring(0, 15) }}</strong
              ></font
            >
            <font type="danger" v-else
              ><strong>&nbsp;<el-avatar class="top-icon" icon="el-icon-odometer" style="background-color:#E6A23C"></el-avatar>&nbsp;项目:&nbsp;{{ projectInfo.name }}</strong></font
            >
          </span>

          <span
            slot="title"
            style="color: #ffd04b"
            class="hidden-md-and-up"
            :title="projectInfo.name"
          >
            <font v-if="projectInfo.name.length >= 15"
              >&nbsp;<el-avatar class="top-icon" icon="el-icon-odometer" style="background-color:#E6A23C"></el-avatar>&nbsp;项目:&nbsp;{{ projectInfo.name.substring(0, 15) }}</font
            >
            <font type="danger" v-else
              >&nbsp;<el-avatar class="top-icon" icon="el-icon-odometer" style="background-color:#E6A23C"></el-avatar>&nbsp;项目:&nbsp;{{ projectInfo.name }}</font
            >
          </span>
        </el-menu-item>
        <el-menu-item index="/xm/core/project/productLink">
          <span slot="title"><i class="el-icon-s-opportunity"></i>产品</span>
        </el-menu-item> 
				<el-menu-item label="需求" index="/xm/core/project/menu" class="hidden-md-and-down">
					 <span slot="title"><i class="el-icon-document"></i>需求</span> 
				</el-menu-item> 
        <el-menu-item index="迭代">
          <span slot="title"><i class="el-icon-connection"></i>迭代</span>
        </el-menu-item>

        <el-menu-item index="计划">
          <span slot="title"><i class="el-icon-time"></i>计划</span>
        </el-menu-item>

        <el-menu-item index="任务" class="hidden-md-and-down">
          <span slot="title"><i class="el-icon-s-operation"></i>任务</span>
        </el-menu-item>
        <el-menu-item index="缺陷">
          <span slot="title"><i class="el-icon-question"></i>缺陷</span>
        </el-menu-item>
        <el-menu-item index="团队">
          <span slot="title"><i class="el-icon-user-solid"></i>团队</span>
        </el-menu-item>
        <el-submenu index="财务" class="hidden-sm-and-down">
          <template slot="title"><i class="el-icon-coin"></i>财务</template>
          <el-menu-item index="合同管理">
            <span slot="title"><i class="el-icon-s-data"></i>合同管理</span>
          </el-menu-item>
          <el-menu-item index="预算">
            <span slot="title"><i class="el-icon-coin"></i>预算</span>
          </el-menu-item>
          <el-menu-item index="费用">
            <span slot="title"><i class="el-icon-coin"></i>费用</span>
          </el-menu-item>
        </el-submenu>
        <el-menu-item index="效能">
          <span slot="title"><i class="el-icon-s-data"></i>效能</span>
        </el-menu-item>
        <el-submenu index="知识" class="hidden-md-and-down">
          <template slot="title">知识</template>
          <el-menu-item index="文档">
            <span slot="title"><i class="el-icon-document"></i>文档</span>
          </el-menu-item>
          <el-menu-item index="环境清单">
            <span slot="title"><i class="el-icon-setting"></i>环境清单</span>
          </el-menu-item>
          <el-menu-item index="日志">
            <span slot="title"><i class="el-icon-edit-outline"></i>日志</span>
          </el-menu-item>
        </el-submenu>
        <el-submenu index="更多">
          <template slot="title">更多 </template>
          <el-menu-item index="每日工时">
            <span slot="title"
              ><i class="el-icon-video-camera"></i>每日工时</span
            >
          </el-menu-item>
          <el-menu-item index="每月工时">
            <span slot="title"
              ><i class="el-icon-video-camera"></i>每月工时</span
            >
          </el-menu-item> 
          <el-menu-item index="预算">
            <span slot="title"><i class="el-icon-coin"></i>预算</span>
          </el-menu-item>
          <el-menu-item index="费用">
            <span slot="title"><i class="el-icon-coin"></i>费用</span>
          </el-menu-item>
          <el-menu-item index="考核">
            <span slot="title"><i class="el-icon-view"></i>考核</span>
          </el-menu-item>
          <el-menu-item index="日志">
            <span slot="title"><i class="el-icon-edit-outline"></i>日志</span>
          </el-menu-item>
          <el-menu-item index="合同管理">
            <span slot="title"><i class="el-icon-s-data"></i>合同管理</span>
          </el-menu-item>
          <el-menu-item index="环境清单">
            <span slot="title"><i class="el-icon-setting"></i>环境清单</span>
          </el-menu-item>
          <el-menu-item index="风险">
            <span slot="title"><i class="el-icon-question"></i>风险</span>
          </el-menu-item>
          <el-menu-item index="论坛">
            <span slot="title"><i class="el-icon-date"></i>论坛</span>
          </el-menu-item>
          <el-menu-item index="即聊">
            <span slot="title"><i class="el-icon-date"></i>即聊</span>
          </el-menu-item>
          <el-menu-item index="客服">
            <span slot="title"><i class="el-icon-date"></i>客服</span>
          </el-menu-item>
          <el-menu-item index="上一页"  @click.native="goBack">
              <span slot="title"
                ><i class="el-icon-back"></i>上一页</span
              >
            </el-menu-item> 
            <el-menu-item index="首页" @click.native="goHome">
              <span slot="title"
                ><i class="el-icon-s-home"></i>首页</span
              >
            </el-menu-item> 
        </el-submenu>
      </el-menu>
    </el-row>
    <!--
    <el-row ref="pageBody"> 
      <el-col :span="infotype=='项目概览'?20:24">
        <xm-project-overview-complex
          v-if="infotype == '项目概览'"
          :sel-project="projectInfo"
          @submit="afterEditSubmit"
          @edit-fields="onEditFields"
          ref="项目概览"
        ></xm-project-overview-complex>
        <xm-product-for-link-complex
          v-if="infotype == '产品'"
          ref="xmProductComplex"
          :sel-project="projectInfo" 
        ></xm-product-for-link-complex>
        <xm-iteration-for-link-complex
          v-if="infotype == '迭代'"
          ref="xmIterationMng"
          :sel-project="projectInfo"
        ></xm-iteration-for-link-complex>
        <xm-menu-mng
          v-if="infotype == '需求'"
          :sel-project="projectInfo"
        ></xm-menu-mng>
        <xm-task-mng
          v-if="infotype == '任务'"
          ref="xmTaskMng"
          :sel-project="projectInfo"
          ptype="0"
          queryScope="task"
          key="task"
        ></xm-task-mng>
        <xm-question
          v-if="infotype == '缺陷'"
          :qtype="'1'"
          :sel-project="projectInfo"
          ref="xmQuestion"
        ></xm-question>
        <xm-group-mng
          v-if="infotype == '团队'"
          :sel-project="projectInfo"
        ></xm-group-mng>
        <xm-file-mng
          v-if="infotype == '文档'"
          :sel-project="projectInfo"
        ></xm-file-mng>
        <xm-plan
          v-if="infotype == '计划'"
          ref="projectPlan"
          ptype="0"
          queryScope="planTask"
          :sel-project="projectInfo"
          key="projectPlan"
        ></xm-plan> 
        <xm-test-case-exec-mng
          v-if="infotype == '测试计划'"
          :visible="infotype == '测试计划'"
          :sel-project="projectInfo"
          ref="xmQuestion"
        ></xm-test-case-exec-mng> 
        <xm-budget
          v-if="infotype == '预算'"
          :sel-project="projectInfo"
        ></xm-budget>
        <xm-cost v-if="infotype == '费用'" :sel-project="projectInfo"></xm-cost>
        <xm-project-kpi
          v-if="infotype == '考核'"
          :sel-project="projectInfo"
        ></xm-project-kpi>
        <xm-record
          v-if="infotype == '日志'"
          :visible="infotype == '日志'"
          :sel-project="projectInfo"
        ></xm-record>
        <xm-contract
          v-if="infotype == '合同管理'"
          :sel-project="projectInfo"
        ></xm-contract>
        <xm-env-list
          v-if="infotype == '环境清单'"
          :sel-project="projectInfo"
        ></xm-env-list>
        <xm-question
          v-if="infotype == '风险'"
          :qtype="'2'"
          :sel-project="projectInfo"
          ref="xmRisk"
        ></xm-question>
        <el-drawer
          title="选中团队成员"
          :visible.sync="groupUserVisible"
          size="50%"
          append-to-body
          :close-on-click-modal="false"
        >
          <xm-group-select
            :sel-project="projectInfo"
            :visible="groupUserVisible"
            is-select-multi-user="1"
            @user-confirm="onUserSelected"
          ></xm-group-select>
        </el-drawer>

        <xm-report
          v-if="infotype == '效能'"
          :xm-project="projectInfo"
        ></xm-report>

        <xm-workload-set-day-list
          v-if="infotype == '每日工时'"
          :xm-project="projectInfo"
        ></xm-workload-set-day-list>

        <xm-workload-set-month-list
          v-if="infotype == '每月工时'"
          :xm-project="projectInfo"
        ></xm-workload-set-month-list>
      </el-col>
    </el-row>
    -->
  </section>
</template>

<script> 
 
import { initDicts,getDefOptions,editXmProjectSomeFields } from "@/api/xm/core/xmProject";

import { mapGetters } from 'vuex'

export default {
  props: ["visible"],
  computed: {
    ...mapGetters(["userInfo", "roles","projectInfo"]),

    calcProjectStatusStep() {
      if (this.dicts["projectStatus"] && this.projectInfo) {
        var index = this.dicts["projectStatus"].findIndex((i) => {
          if (i.id == this.projectInfo.status) {
            return true;
          } else {
            return false;
          }
        });
        return index + 1;
      } else {
        return 0;
      }
    },
  },
  watch: {},
  data() {
    return { 
      infotype:'',
      dicts:  getDefOptions(),  
      /**end 自定义属性请在上面加 请加备注**/
    };
  }, //end data
  methods: {    
    setInfotype(infotype) {
      if (infotype == "返回") {
        this.goBack();
      } else {
        this.infotype = infotype; 
      }
    },
      
    goBack() {
      localStorage.setItem("project-infotype", "项目概览");  
      this.$router.back(-1); 
    },
    goHome(){ 
      localStorage.setItem("project-infotype", "项目概览");  
      this.$router.push({path:'/'}) 
    },
     
  }, //end methods
  components: {
     
    //在下面添加其它组件
  }, 
  mounted() {
    this.$nextTick(() => {
      
      //this.maxTableHeight = this.source == 'GZT' ?  this.maxTableHeight : util.calcTableMaxHeight(this.$refs.pageBody.$el);
      var infotype = localStorage.getItem("project-infotype");
      if (infotype) {
        this.infotype = infotype;
      }
    });
    initDicts(this)
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.menus {
  .el-menu-item {
    padding-left: 0px !important;
  }
}
/* 超过宽度则用...代替 */
.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.step-btn{
	margin-left:0px;margin-bottom: 5px;
}
</style>
