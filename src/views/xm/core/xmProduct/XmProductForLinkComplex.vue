<template>
  <section>
    <el-row>
      <el-col :xl="4" :lg="4" :md="5" :sm="5" :xs="5" class="padding">  
        <el-row class="padding">
            <xm-product-select show-style="tag"
              ref="xmProductSelect"
              :auto-select="false"
              :link-project-id="projectInfo ? projectInfo.id : null"
              :iterationId="xmIteration ? xmIteration.id : null"
              @change2="onProductRowClick"
              @clear="onProductClearSelect"
            >  
          </xm-product-select> 
          </el-row>
        <el-row
          ref="pageBody"
          class="padding" 
          :style="{ maxHeight: maxTableHeight + 'px', overflowY: 'hidden' }"
        >

          <el-steps v-if="xmProduct && xmProduct.id"
            :active="calcProductPstatusStep"
            finish-status="success"
            direction="vertical"
          >
            <el-step
              v-for="(i, index) in dicts['xmProductPstatus']"
              :title="i.name"
              :key="index"
            >
              <el-row slot="description">
                <el-row v-if="i.id == '0'"
                  ><!--打开-->
                  <span v-if="xmProduct.pstatus == i.id">
                    <el-button
                      class="step-btn"
                      type="warning"
                      
                      plain
                      @click="showPanel = 'menus'"
                      >需求管理</el-button
                    >   
                    <el-popconfirm @confirm="editXmProductSomeFields(xmProduct, 'pstatus', '1')" title="将产品状态设为研发中?">
                      <el-button slot="reference" class="step-btn" type="danger" icon="el-icon-d-caret"  plain>设为研发中</el-button>
                    </el-popconfirm>
                  </span>
                  <span v-if="xmProduct.pstatus != i.id">
                    <el-button
                      class="step-btn"
                      type="warning"
                      
                      plain
                      @click="showPanel = 'menus'"
                      >需求管理</el-button
                    > 
                  </span>
                </el-row>
                <el-row v-else-if="i.id == '1'"
                  ><!--研发中-->
                  <span v-if="xmProduct.pstatus == i.id">
                    <el-button
                      class="step-btn"
                      type="warning"
                      
                      plain
                      @click="showPanel = 'iterationProductLink'"
                      >迭代管理</el-button
                    >
                    <el-button
                      class="step-btn"
                      type="warning"
                      
                      plain
                      @click="showPanel = 'bugs'"
                      >缺陷管理</el-button
                    >  
                    <el-popconfirm @confirm="editXmProductSomeFields(xmProduct, 'pstatus', '2')" title="将产品状态设为已完成?">
                      <el-button slot="reference" class="step-btn" type="danger" icon="el-icon-d-caret"  plain>设为已完成</el-button>
                    </el-popconfirm>
                  </span>
                  <span v-if="xmProduct.pstatus != i.id">
                    <el-button
                      class="step-btn"
                      type="warning"
                      
                      plain
                      @click="showPanel = 'iterationProductLink'"
                      >迭代管理</el-button
                    >
                    <el-button
                      class="step-btn"
                      type="warning"
                      
                      plain
                      @click="showPanel = 'bugs'"
                      >缺陷管理</el-button
                    >
                  </span>
                </el-row>
                <el-row v-else-if="i.id == '2'"
                  ><!--已完成-->
                  <span v-if="xmProduct.pstatus == i.id"> 
                    
                    <el-popconfirm @confirm="editXmProductSomeFields(xmProduct, 'pstatus', '3')" title="将产品状态设为已关闭?">
                      <el-button slot="reference" class="step-btn" type="danger" icon="el-icon-d-caret"  plain>设为已关闭</el-button>
                    </el-popconfirm>
                  </span>
                  <span v-if="xmProduct.pstatus != i.id">
                     
                  </span>
                </el-row>
                <el-row v-else-if="i.id == '3'"
                  ><!--已关闭-->
                  <span v-if="xmProduct.pstatus == i.id">   
                    <el-popconfirm @confirm="editXmProductSomeFields(xmProduct, 'pstatus', '0')" title="将产品状态设为打开状态?">
                      <el-button slot="reference" class="step-btn" type="danger" icon="el-icon-d-caret"  plain>重新打开</el-button>
                    </el-popconfirm>
                  </span>
                  <span v-if="xmProduct.pstatus != i.id">
                     
                  </span>
                </el-row> 
              </el-row>
            </el-step>
          </el-steps>
        </el-row> 
      </el-col>
      <el-col :xl="20" :lg="20" :md="19" :sm="19" :xs="19" class="padding-left padding-right">
        <el-tabs :value="showPanel" @tab-click="tabClick" v-if="xmProduct && xmProduct.id"> 
          <el-tab-pane
            label="产品概览"
            name="productOverview"
          >
            <xm-product-overview
              v-if="xmProduct && showPanel == 'productOverview'"
              :xm-product="xmProduct"
              :sel-project="projectInfo"
            ></xm-product-overview>
          </el-tab-pane>

          <el-tab-pane
            label="产品详情"
            name="detail" 
          >
            <xm-product-edit
              v-if="showPanel == 'detail'"
              :xm-product="xmProduct"
            ></xm-product-edit>
          </el-tab-pane>
          <el-tab-pane
            label="产品团队"
            name="group"
            v-if="xmProduct && xmProduct.id"
          > 
		        <xm-group-mng v-if="showPanel == 'group'" :xm-product="xmProduct"  :visible="xmProduct && xmProduct.id"></xm-group-mng>
          </el-tab-pane>
          <el-tab-pane
            label="配置关联的项目"
            lazy
            name="productProjectLink" 
          >
            <xm-product-project-link-mng
              v-if="showPanel == 'productProjectLink'"
              :xm-product="xmProduct"
            ></xm-product-project-link-mng>
          </el-tab-pane>
          <el-tab-pane
            label="迭代"
            name="iterationProductLink" 
          >
            <xm-iteration-mng
              v-if="showPanel == 'iterationProductLink'"
              :xm-product="xmProduct"
            ></xm-iteration-mng>
          </el-tab-pane>
          <el-tab-pane
            label="需求" 
            name="menus" 
          >
            <xm-menu-mng
              v-if="xmProduct && showPanel == 'menus'"
              :xm-product="xmProduct"
              :xm-iteration="xmIteration"
              :sel-project="projectInfo"
              :disabled-mng="true"
            ></xm-menu-mng>
          </el-tab-pane>
          <el-tab-pane
            label="任务" 
            name="tasks" 
          >
            <xm-task-mng
              v-if="xmProduct && showPanel == 'tasks'"
              queryScope="task"
              ptype="0"
              :xm-product="xmProduct"
              :xm-iteration="xmIteration"
              :sel-project="projectInfo"
            ></xm-task-mng>
          </el-tab-pane>
          <el-tab-pane
            label="缺陷" 
            name="bugs" 
          >
            <xm-question-mng
              v-if="xmProduct && showPanel == 'bugs'"
              :xm-product="xmProduct"
              :xm-iteration="xmIteration"
              :sel-project="projectInfo"
            ></xm-question-mng>
          </el-tab-pane>
          <el-tab-pane
            label="执行统计"
            name="productCalc" 
          >
            <div
              v-if="showPanel == 'productCalc'"
              class="padding-left padding-right"
            >
              <el-row>
                <el-button
                  type="primary"
                  @click="loadTasksToXmProductState"
                  v-loading="load.calcProduct"
                  >计算产品汇总数据</el-button
                >
                <br />
                <font color="blue" style="font-size: 10px"
                  >将从项目任务及产品任务中汇总进度、预算工作量、实际工作量、预算金额、实际金额、缺陷数、需求数等数据到产品统计表</font
                >
              </el-row>
              <el-row>
                <el-button
                  type="primary"
                  @click="loadTasksToXmMenuState"
                  v-loading="load.calcMenu"
                  >计算所有需求数据</el-button
                >
                <br />
                <font color="blue" style="font-size: 10px"
                  >将从项目任务汇总进度、预算工作量、实际工作量、预算金额、实际金额等数据到需求统计表</font
                >
              </el-row>
            </div>
          </el-tab-pane>
          
					<el-tab-pane label="效能分析" name="效能"> 
						<xm-rpt v-if="xmProduct && showPanel=='效能'" :xm-project="projectInfo" :xm-iteration="xmIteration" :xm-product="xmProduct" category="产品级"></xm-rpt>
 					</el-tab-pane> 
        </el-tabs>
        <el-row> </el-row>
      </el-col>
    </el-row>

    <el-dialog
      append-to-body
      top="20px"
      width="60%"
      :visible.sync="addProductVisible"
    >
      <xm-product-add  op-type="add"
        @cancel="addProductVisible = false"
        :sel-project="projectInfo"
        @submit="afterAddProductSubmit"
      ></xm-product-add>
    </el-dialog>
  </section>
</template>

<script>
import util from "@/common/js/util"; //全局公共库
import config from "@/common/config"; //全局公共库
import XmIterationMng from "../xmIteration/XmIterationMng.vue";
import XmMenuMng from "../xmMenu/XmMenuBox.vue";
import XmIterationStateShow from "../xmIterationState/XmIterationStateShow.vue";
import { mapGetters } from "vuex";
import XmProductMng from "./XmProductMng.vue";
import XmTaskMng from "../xmTask/XmTaskMng.vue";
import XmQuestionMng from "../xmQuestion/XmQuestionMng.vue";
import XmProjectForLink from "../xmProject/XmProjectForLink.vue";

import XmProductSelect from "@/views/xm/core/components/XmProductSelect.vue";
import XmProductProjectForLink from "./XmProductProjectForLink.vue";
import XmProductOverview from "./XmProductOverview"; 
import XmProductProjectLinkMng from "../xmProductProjectLink/XmProductProjectLinkMng.vue";

import { loadTasksToXmProductState } from "@/api/xm/core/xmProductState";
import { initDicts, editXmProductSomeFields } from "@/api/xm/core/xmProduct";
import { loadTasksToXmMenuState } from "@/api/xm/core/xmMenuState";
import XmProductEdit from "./XmProductEdit.vue";
import XmProductAdd from "./XmProductEdit"; //新增界面
import XmGroupMng from '../xmGroup/XmGroupMng.vue'

import XmRpt from "@/views/xm/rpt/index";
export default {
  computed: {
    ...mapGetters(["userInfo", "roles","projectInfo","xmIteration"]),

    calcProductPstatusStep() {
      if (this.dicts["xmProductPstatus"] && this.xmProduct) {
        var index = this.dicts["xmProductPstatus"].findIndex((i) => {
          if (i.id == this.xmProduct.pstatus) {
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
  props: ["visible"],
  watch: {
    visible: function (visible) {
      if (visible == true) {
      }
    },
  },
  data() {
    return {
      load: {
        calcProduct: false,
      },
      dicts: { xmProductPstatus: [] },
      xmProduct: null,
      showPanel: "productOverview", //menus,tasks,bugs,iterationStateShow
      productVisible: true,
      addProductVisible: false,
      maxTableHeight: 300,
      /**end 自定义属性请在上面加 请加备注**/
    };
  }, //end data
  methods: {
    loadTasksToXmProductState: function () {
      this.load.calcProduct = true;

      let params = { productId: this.xmProduct.id };
      loadTasksToXmProductState(params)
        .then((res) => {
          this.load.calcProduct = false;
          var tips = res.data.tips;
          if (this.$refs["xmProductSelect"]) {
            this.$refs["xmProductSelect"].reloadOne();
          }
          this.$notify({
            position: "bottom-left",
            showClose: true,
            message: tips.msg,
            type: tips.isOk ? "success" : "error",
          });
        })
        .catch((err) => (this.load.calcProduct = false));
    },

    loadTasksToXmMenuState: function () {
      this.load.calcMenu = true;
      let params = { productId: this.xmProduct.id };
      loadTasksToXmMenuState(params)
        .then((res) => {
          this.load.calcMenu = false;
          var tips = res.data.tips;
          this.$notify({
            position: "bottom-left",
            showClose: true,
            message: tips.msg,
            type: tips.isOk ? "success" : "error",
          });
        })
        .catch((err) => (this.load.calcMenu = false));
    },

    /**end 自定义函数请在上面加**/
    onProductRowClick(xmProduct) {
      this.xmProduct = xmProduct;
    },
    afterAddProductSubmit(product) {
      this.$refs.xmProductSelect.xmProducts.push(product);
      this.$refs.xmProductSelect.rowClick(product);
      this.addProductVisible = false;
    },
    onProductClearSelect() {
      this.xmProduct = null;
    },
    tabClick(tab) {
      if (this.xmProduct == null || !this.xmProduct.id) {
        this.productVisible = true;
        this.$notify({
          position: "bottom-left",
          showClose: true,
          message: "请先选中左边产品",
          type: "warning",
        });
      }
      this.showPanel = tab.name;
    },

    editXmProductSomeFields(row, fieldName, $event) {
      var that = this;
      var func = (params) => {
        editXmProductSomeFields(params).then((res) => {
          var tips = res.data.tips;
          if (tips.isOk) {
            this.$emit("edit-fields", params);
            Object.assign(row, params);
            this.xmProductBak = Object.assign({}, row);
          } else {
            Object.assign(this.xmProduct, this.xmProductBak);
            this.$notify({
              position: "bottom-left",
              showClose: true,
              message: tips.msg,
              type: tips.isOk ? "success" : "error",
            });
          }
        });
      };
      var params = { ids: [row.id] };

      params[fieldName] = $event;

      if (fieldName == "description") {
        this.$refs.xmProduct.validateField("description", (err) => {
          if (err) {
            this.$notify({
              position: "bottom-left",
              showClose: true,
              message: err,
              type: "error",
            });
            return;
          } else {
            func(params);
          }
        });
      } else if (fieldName == "name") {
        this.$refs.xmProduct.validateField("name", (err) => {
          if (err) {
            this.$notify({
              position: "bottom-left",
              showClose: true,
              message: err,
              type: "error",
            });
            return;
          } else {
            func(params);
          }
        });
      } else {
        func(params);
      }
    },

    goBack() {
      localStorage.setItem("product-showPanel", "产品概览");

      if (window.history.length > 0) {
        this.$router.back(-1);
      } else {
        this.$router.push({ path: "/xm/core/product/mng" });
      }
    },

    onEditFields(row) {
      Object.assign(this.xmProduct, row);
      this.$emit("edit-fields", row);
    },
    showCurrFlow() {
      this.$refs["产品概览"].showPanelName = "currFlow";
    },
    showHisFlow() {
      this.$refs["产品概览"].showPanelName = "hisFlow";
    },
    showDetail() {
      this.$refs["产品概览"].showPanelName = "detail";
    },
    showProjectGaiSuan() {
      this.$refs["产品概览"].showPanelName = "detail";
      this.$nextTick(() => {
        this.$refs["产品概览"].$refs["detail"].$refs[
          "projectEdit"
        ].currTabPane = "4";
      });
    },
    showProjectShouYi() {
      this.$refs["产品概览"].showPanelName = "detail";
      this.$nextTick(() => {
        this.$refs["产品概览"].$refs["detail"].$refs[
          "projectEdit"
        ].currTabPane = "5";
      });
    },
    showMenusPage() {
      this.showPanel = "产品";
      this.$nextTick(() => {
        this.$refs["xmProductComplex"].showPanel = "menus";
      });
    },
    linkProject() {
      this.$refs["xmProductComplex"].showPanelName = "productProjectLink";
    },
    createProduct() {
      this.showPanel = "产品";
      this.$nextTick(() => {
        this.$refs["xmProductComplex"].addProductVisible = true;
      });
    },
  }, //end methods
  components: {
    //在下面添加其它组件
    XmIterationMng,
    XmMenuMng,
    XmIterationStateShow,
    XmProductMng,
    XmTaskMng,
    XmQuestionMng,
    XmProductSelect,
    XmProjectForLink,
    XmProductProjectForLink,
    XmProductOverview,
    XmProductAdd, 
    XmProductProjectLinkMng,
    XmProductEdit,
    XmGroupMng,
    XmRpt
  },
  mounted() {
    this.$nextTick(() => {
      initDicts(this);

      this.maxTableHeight = util.calcTableMaxHeight(this.$refs.pageBody.$el);
    });
  },
};
</script>

<style lang="less" scoped> 
.more-label-font {
  text-align: center;
  float: left;
  padding-top: 5px;
}
.step-btn {
  margin-left: 0px;
  margin-bottom: 5px;
} 
</style>
