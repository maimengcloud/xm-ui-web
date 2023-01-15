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
        
      <el-menu-item :index="'/xm/core/product/overview?productId='+xmProduct.id">
          <span
            slot="title"
            style="font-size: 18px; color: #409eff"
            class="hidden-md-and-down"
            :title="xmProduct.productName"
          >
            <font v-if="xmProduct.productName.length >= 15">
              <strong>
                
                &nbsp;<el-avatar class="top-icon" icon="el-icon-s-opportunity" style="background-color:#409EFF"></el-avatar>&nbsp;{{ xmProduct.productName.substring(0, 15) }}</strong
              ></font
            >
            <div  v-else>
           
            <font type="danger">
              <strong>&nbsp; <el-avatar class="top-icon" icon="el-icon-s-opportunity" style="background-color:#409EFF"></el-avatar>&nbsp;产品:&nbsp;{{ xmProduct.productName }}</strong></font
            >
            </div>
          </span>
          <span
            slot="title"
            style="color: #409eff"
            class="hidden-lg-and-up"
            :title="xmProduct.productName"
          >
            <font v-if="xmProduct.productName.length >= 15">
              &nbsp;<el-avatar class="top-icon" icon="el-icon-s-opportunity" style="background-color:#409EFF"></el-avatar>&nbsp;产品:&nbsp;{{ xmProduct.productName.substring(0, 15) }}</font
            >
            <font type="danger" v-else>
              &nbsp;<el-avatar class="top-icon" icon="el-icon-s-opportunity" style="background-color:#409EFF"></el-avatar>&nbsp;产品:&nbsp;{{ xmProduct.productName }}</font
            >
          </span>
        </el-menu-item>
        <el-menu-item :index="'/xm/core/product/project?productId='+xmProduct.id">
          <span slot="title"><i class="el-icon-s-opportunity"></i>项目</span>
        </el-menu-item> 
				<el-menu-item label="需求" :index="'/xm/core/product/menu?productId='+xmProduct.id" class="hidden-md-and-down">
					 <span slot="title"><i class="el-icon-document"></i>需求</span> 
				</el-menu-item> 
        <el-menu-item :index="'/xm/core/product/iteration?productId='+xmProduct.id">
          <span slot="title"><i class="el-icon-connection"></i>迭代</span>
        </el-menu-item>

        <el-menu-item :index="'/xm/core/product/plan?productId='+xmProduct.id">
          <span slot="title"><i class="el-icon-time"></i>计划</span>
        </el-menu-item>

        <el-menu-item :index="'/xm/core/product/task?productId='+xmProduct.id" class="hidden-md-and-down">
          <span slot="title"><i class="el-icon-s-operation"></i>任务</span>
        </el-menu-item>
        <el-menu-item :index="'/xm/core/product/question?productId='+xmProduct.id">
          <span slot="title"><i class="el-icon-question"></i>缺陷</span>
        </el-menu-item>
        <el-menu-item :index="'/xm/core/product/group?productId='+xmProduct.id">
          <span slot="title"><i class="el-icon-user-solid"></i>团队</span>
        </el-menu-item>
        <el-submenu index="caiwu" class="hidden-sm-and-down">
          <template slot="title"><i class="el-icon-coin"></i>财务</template>
          <el-menu-item :index="'/xm/core/product/contract?productId='+xmProduct.id">
            <span slot="title"><i class="el-icon-s-data"></i>合同管理</span>
          </el-menu-item>
          <el-menu-item :index="'/xm/core/product/budget?productId='+xmProduct.id">
            <span slot="title"><i class="el-icon-coin"></i>预算</span>
          </el-menu-item>
          <el-menu-item :index="'/xm/core/product/cost?productId='+xmProduct.id">
            <span slot="title"><i class="el-icon-coin"></i>费用</span>
          </el-menu-item>
        </el-submenu>
        <el-menu-item :index="'/xm/core/product/report?productId='+xmProduct.id">
          <span slot="title"><i class="el-icon-s-data"></i>效能</span>
        </el-menu-item>
        <el-submenu index="zhishi" class="hidden-md-and-down">
          <template slot="title">知识</template>
          <el-menu-item :index="'/xm/core/product/file?productId='+xmProduct.id">
            <span slot="title"><i class="el-icon-document"></i>文档</span>
          </el-menu-item>
          <el-menu-item :index="'/xm/core/product/env?productId='+xmProduct.id">
            <span slot="title"><i class="el-icon-setting"></i>环境清单</span>
          </el-menu-item>
          <el-menu-item :index="'/xm/core/product/record?productId='+xmProduct.id">
            <span slot="title"><i class="el-icon-edit-outline"></i>日志</span>
          </el-menu-item>
        </el-submenu>
        <el-submenu index="更多">
          <template slot="title">更多 </template>
          <el-menu-item :index="'/xm/core/product/workloadDay?productId='+xmProduct.id">
            <span slot="title"
              ><i class="el-icon-video-camera"></i>每日工时</span
            >
          </el-menu-item>
          <el-menu-item :index="'/xm/core/product/workloadMonth?productId='+xmProduct.id">
            <span slot="title"
              ><i class="el-icon-video-camera"></i>每月工时</span
            >
          </el-menu-item>   
          <el-menu-item :index="'/xm/core/product/env?productId='+xmProduct.id">
            <span slot="title"><i class="el-icon-setting"></i>环境清单</span>
          </el-menu-item> 
          <el-menu-item index="/forum">
            <span slot="title"><i class="el-icon-date"></i>论坛</span>
          </el-menu-item>
          <el-menu-item index="/im">
            <span slot="title"><i class="el-icon-date"></i>即聊</span>
          </el-menu-item>
          <el-menu-item index="/helpCenter">
            <span slot="title"><i class="el-icon-date"></i>客服</span>
          </el-menu-item>
          <el-menu-item index="回到项目列表页"  @click.native="goBack">
              <span slot="title"
                ><i class="el-icon-back"></i>回到项目列表页</span
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
        <xm-product-overview-complex
          v-if="infotype == '项目概览'"
          :sel-product="xmProduct"
          @submit="afterEditSubmit"
          @edit-fields="onEditFields"
          ref="项目概览"
        ></xm-product-overview-complex>
        <xm-product-for-link-complex
          v-if="infotype == '产品'"
          ref="xmProductComplex"
          :sel-product="xmProduct" 
        ></xm-product-for-link-complex>
        <xm-iteration-for-link-complex
          v-if="infotype == '迭代'"
          ref="xmIterationMng"
          :sel-product="xmProduct"
        ></xm-iteration-for-link-complex>
        <xm-menu-mng
          v-if="infotype == '需求'"
          :sel-product="xmProduct"
        ></xm-menu-mng>
        <xm-task-mng
          v-if="infotype == '任务'"
          ref="xmTaskMng"
          :sel-product="xmProduct"
          ptype="0"
          queryScope="task"
          key="task"
        ></xm-task-mng>
        <xm-question
          v-if="infotype == '缺陷'"
          :qtype="'1'"
          :sel-product="xmProduct"
          ref="xmQuestion"
        ></xm-question>
        <xm-group-mng
          v-if="infotype == '团队'"
          :sel-product="xmProduct"
        ></xm-group-mng>
        <xm-file-mng
          v-if="infotype == '文档'"
          :sel-product="xmProduct"
        ></xm-file-mng>
        <xm-plan
          v-if="infotype == '计划'"
          ref="productPlan"
          ptype="0"
          queryScope="planTask"
          :sel-product="xmProduct"
          key="productPlan"
        ></xm-plan> 
        <xm-test-case-exec-mng
          v-if="infotype == '测试计划'"
          :visible="infotype == '测试计划'"
          :sel-product="xmProduct"
          ref="xmQuestion"
        ></xm-test-case-exec-mng> 
        <xm-budget
          v-if="infotype == '预算'"
          :sel-product="xmProduct"
        ></xm-budget>
        <xm-cost v-if="infotype == '费用'" :sel-product="xmProduct"></xm-cost>
        <xm-product-kpi
          v-if="infotype == '考核'"
          :sel-product="xmProduct"
        ></xm-product-kpi>
        <xm-record
          v-if="infotype == '日志'"
          :visible="infotype == '日志'"
          :sel-product="xmProduct"
        ></xm-record>
        <xm-contract
          v-if="infotype == '合同管理'"
          :sel-product="xmProduct"
        ></xm-contract>
        <xm-env-list
          v-if="infotype == '环境清单'"
          :sel-product="xmProduct"
        ></xm-env-list>
        <xm-question
          v-if="infotype == '风险'"
          :qtype="'2'"
          :sel-product="xmProduct"
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
            :sel-product="xmProduct"
            :visible="groupUserVisible"
            is-select-multi-user="1"
            @user-confirm="onUserSelected"
          ></xm-group-select>
        </el-drawer>

        <xm-report
          v-if="infotype == '效能'"
          :xm-product="xmProduct"
        ></xm-report>

        <xm-workload-set-day-list
          v-if="infotype == '每日工时'"
          :xm-product="xmProduct"
        ></xm-workload-set-day-list>

        <xm-workload-set-month-list
          v-if="infotype == '每月工时'"
          :xm-product="xmProduct"
        ></xm-workload-set-month-list>
      </el-col>
    </el-row>
    -->
  </section>
</template>

<script> 
 
 
import { mapGetters } from 'vuex'

export default {
  props: ["visible"],
  computed: {
    ...mapGetters(["userInfo", "roles","xmProduct"]),

    calcProjectStatusStep() {
      if (this.dicts["productStatus"] && this.xmProduct) {
        var index = this.dicts["productStatus"].findIndex((i) => {
          if (i.id == this.xmProduct.status) {
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
  watch: {
    $route:{
      handler(newVal,oldValu){ 
        this.infotype=newVal.fullPath 
      },
      deep:true,
      immediate:true,
    }
  },
  data() {
    return { 
      infotype:'',  
    };
  }, //end data
  methods: {    
    setInfotype(infotype) {  
        this.infotype = infotype;  
    },
    /**
     * 防止禁用弹框 _self模式
     * @param {} url 
     */
    newWin(url) { 
      var id='toOpenWindow'
      var a = document.createElement('a');
      a.setAttribute('href', url);
      a.setAttribute('target', '_self');
      a.setAttribute('id', id);
      // 防止反复添加
      if(!document.getElementById(id)) document.body.appendChild(a);
      a.click();
    },
    toForum(){
      this.newWin('https://www.maimengcloud.com/#/communityForum');
    },
    goBack() {
       this.$router.push({
        path:'/xm/core/xmProduct/XmProductMng'
       })
    },
    goHome(){  
      this.$router.push({path:'/'}) 
    },
     
  }, //end methods
  components: {
     
    //在下面添加其它组件
  }, 
  mounted() {   
    this.infotype=this.$route.fullPath
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
