<template>
  <section>
    <el-popover
      placement="bottom"
      width="400"
      trigger="manual"
      v-model="productVisible"
    >
      <el-row>
        <el-button
          type="text"
          icon="el-icon-refresh"
          @click="refreshSelect"
          title="重新从后台刷新数据回来"
          >刷新</el-button
        >&nbsp;&nbsp;
        <el-button
          v-if="editForm && editForm.id"
          type="text"
          icon="el-icon-circle-close"
          @click="clearSelect"
          title="清空当前选中的产品"
          >取消选中状态&nbsp;&nbsp;</el-button
        >
		<el-button
              @click="addProductVisible = true"
              icon="el-icon-plus"
              type="text"
              >创建产品</el-button>&nbsp;&nbsp;
        <el-popover
          placement="top-start"
          title="更多条件、操作"
          width="500"
          v-model="moreVisible"
          trigger="manual"
        >
        
              <el-button type="text" style="float:right;margin-top:-40px;" @click="moreVisible = false" icon="el-icon-close"
                >关闭</el-button>
          <el-row>
            
						<el-divider></el-divider>
            
            <el-row>
              <font class="more-label-font"> 产品经理: </font>
              <mdp-select-user-xm label="选择产品经理" v-model="filters" userid-key="pmUserid" username-key="pmUsername" :project-id="linkProjectId" :clearable="true"></mdp-select-user-xm>
            </el-row>
            <el-row>
              <font class="more-label-font">产品编号:</font>
              <el-input
                v-model="filters.id"
                style="width: 200px;"
                placeholder="输入产品编号"
                 clearable 
              >
              </el-input>
            </el-row>

            <el-row>
              <font class="more-label-font"> 产品名称: </font>
              <el-input
                v-model="filters.key"
                style="width: 200px;" clearable
                placeholder="输入产品名字关键字"
              >
              </el-input>
            </el-row>
            

            <el-row>
              <font class="more-label-font">创建时间:</font>
              <el-date-picker
                v-model="dateRanger"
                type="daterange"
                align="right"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="完成日期"
                value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="['00:00:00', '23:59:59']"
                :picker-options="pickerOptions"
              ></el-date-picker>
            </el-row>
            <el-row>
              <el-button type="primary" style="float:right;" @click="searchXmProducts" icon="el-icon-search"
                >查询</el-button
              >
            </el-row>
          </el-row>
          <el-button
            type="text"
            slot="reference" 
            @click="moreVisible = !moreVisible" icon="el-icon-search"
            >更多条件</el-button
          >
        </el-popover>
        <el-button
          style="float: right"
          type="text"
          @click="close"
          icon="el-icon-close"
          title="关闭当前窗口"
          >关闭</el-button
        >
      </el-row>
      <el-row
        v-if="load.list == false && (!xmProducts || xmProducts.length == 0)"
      >
        <el-row v-if="linkProjectId">
          <el-row
            >没有查到与项目【{{
              linkProjectId
            }}】关联的产品,您可以尝试&nbsp;&nbsp;
            <el-button
              type="text"
              icon="el-icon-refresh"
              @click="refreshSelect"
              title="重新从后台刷新数据回来"
              >刷新</el-button
            >&nbsp;&nbsp; 重新从后台加载，或者<el-button
              @click="addProductVisible = true"
              icon="el-icon-plus"
              type="text"
              >创建产品</el-button
            >
            ，并自动关联项目【{{
              linkProjectId
            }}】，或者到【项目->关联产品->加入更多产品到项目】手动关联一个已存在的产品。
          </el-row>
        </el-row>
        <el-row v-else>
          <el-row
            >没有查到相关产品,您可以尝试&nbsp;&nbsp;
            <el-button
              type="text"
              icon="el-icon-refresh"
              @click="refreshSelect"
              title="重新从后台刷新数据回来"
              >刷新</el-button
            >&nbsp;&nbsp; 重新从后台加载，或者<el-button
              @click="addProductVisible = true"
              icon="el-icon-plus"
              type="text"
              >创建产品</el-button
            >
          </el-row>
        </el-row>
      </el-row>
      <el-row>
        <!--列表 XmProduct 产品表-->
        <el-table
          ref="table"
          :height="maxTableHeight"
          :data="xmProducts"
          :row-class-name="tableRowClassName"
          @sort-change="sortChange"
          :highlight-current-row="true"
          current-row-key="id"
          v-loading="load.list"
          border
          @selection-change="selsChange"
          @row-click="rowClick"
          style="width: 100%"
        >
          <el-table-column prop="productName" label="产品名称">
            <template slot="header" slot-scope="scope"> 产品名称 </template>
            <template slot-scope="scope">
              <div class="icon" style="background-color:#409eff"><i class="el-icon-s-opportunity" ></i></div><font>{{ scope.row.productName }}</font>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          layout="total, prev, next"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          :page-sizes="[10, 20, 50, 100, 500]"
          :current-page="pageInfo.pageNum"
          :page-size="pageInfo.pageSize"
          :total="pageInfo.total"
          style="float: right"
        ></el-pagination>
      </el-row>
      <div slot="reference" @click="referenceClick"> 
        <slot name="reference" v-bind:product="editForm"> 
        
              <div class="title">
              <slot name="title" v-bind:product="editForm">
                <el-link
                  title="产品，点击选择、清除选择" 
                  type="primary" 
                  v-loading="load.list"
                  icon="el-icon-s-opportunity" 
              >
              <div class="res-text hidden-md-and-down">
              {{
                editForm && editForm.id ? editForm.productName : "选择产品"
              }} 
              </div>
              
              <div class="res-text hidden-lg-and-up">
              {{
                editForm && editForm.id ? editForm.productName : "选择产品"
              }} 
              </div>
              </el-link> 
              <el-button v-if="editForm&&editForm.id" type="text" icon="el-icon-circle-close" @click.stop="clearSelect"></el-button>&nbsp;
            </slot>
              </div>
            
      
        </slot>
        </div>
    </el-popover>
	
        <el-dialog append-to-body :visible.sync="addProductVisible" width="70%">
          <xm-product-add op-type="add"
            :sel-project="{ id: linkProjectId, name: '' }"
            @cancel="addProductVisible = false"
            @submit="afterAddSubmit"
          >
          </xm-product-add>
        </el-dialog>
  </section>
</template>

<script>
import util from "@/common/js/util"; //全局公共库
//import Sticky from '@/components/Sticky' // 粘性header组件
//import { initSimpleDicts } from '@/api/mdp/meta/item';//下拉框数据查询
import { listXmProductWithState } from "@/api/xm/core/xmProduct";
import { mapGetters } from "vuex"; 
import MdpSelectUserXm from "@/views/xm/core/components/MdpSelectUserXm/index";
import XmProductAdd from "../xmProduct/XmProductEdit.vue";
const map = new Map();

export default {
  props: ["dialog", "linkProjectId", "iterationId", "autoSelect"],
  computed: {
    ...mapGetters(["userInfo", "roles"]),
  },
  watch: {
    iterationId() {
      this.initData();
    },

    linkProjectId() {
      this.initData();
    },
  },
  data() {
    const beginDate = new Date();
    const endDate = new Date();
    beginDate.setTime(beginDate.getTime() - 3600 * 1000 * 24 * 7 * 4 * 12);
    return {
      filters: {
        key: "",
        id: "", //产品编号 
        pmUserid:'',
        pmUsername:'',
      },
      xmProducts: [], //查询结果
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
      dicts: {}, //下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]}

      //新增xmProduct界面初始化数据
      addForm: {
        id: "",
        productName: "",
        branchId: "",
        remark: "",
      },

      //编辑xmProduct界面初始化数据
      editForm: {
        id: "",
        productName: "",
        branchId: "",
        remark: "",
      },
      selectFiltersPmUserVisible: false,
      maxTableHeight: 300,
      dateRanger: [],
      pickerOptions: util.getPickerOptions("datarange"),
      productVisible: false,
      moreVisible: false,
      hadInit: false,
      addProductVisible: false,
      /**begin 自定义属性请在下面加 请加备注**/

      /**end 自定义属性请在上面加 请加备注**/
    };
  }, //end data
  methods: {
    handleSizeChange(pageSize) {
      this.pageInfo.pageSize = pageSize;
      this.getXmProducts();
    },
    handleCurrentChange(pageNum) {
      this.pageInfo.pageNum = pageNum;
      this.getXmProducts();
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
      this.getXmProducts();
    },
    searchXmProducts() {
      this.pageInfo.count = true;
      this.getXmProducts();
    },
    //获取列表 XmProduct 产品表
    getXmProducts() {
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
      if (this.filters.key !== "") {
        params.key = "%" + this.filters.key + "%";
      }
      if (this.linkProjectId) {
        params.linkProjectId = this.linkProjectId;
      }
      if (this.linkIterationId) {
        params.linkIterationId = this.linkIterationId;
      }
      if (this.filters.id) {
        params.id = this.filters.id;
      }

      if (this.filters.pmUserid) {
        params.pmUserid = this.filters.pmUserid;
      }
      this.load.list = true;
      listXmProductWithState(params)
        .then((res) => {
          var tips = res.data.tips;
          if (tips.isOk) {
            this.pageInfo.total = res.data.total;
            this.pageInfo.count = false;
            this.xmProducts = res.data.data; 

            var key=""
						if(this.iterationId){
							key='xm-product-select-list-it-'+this.iterationId 
							sessionStorage.setItem(key,JSON.stringify(this.xmProducts))
						}else if(this.linkProjectId){
							key='xm-product-select-list-prj-'+this.linkProjectId  
							sessionStorage.setItem(key,JSON.stringify(this.xmProducts))
						}

            if (
              this.autoSelect !== false &&
              this.xmProducts.length > 0 &&
              this.productVisible == false
            ) {
              var row = this.xmProducts[0];
              this.$refs.table.setCurrentRow(row);
              this.rowClick(row);
            }else{
				if(this.xmProducts.length==0 && this.moreVisible==false ){
					if(this.editForm && this.editForm.id){
						this.clearSelect()
					}
				}
			}
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

    //选择行xmProduct
    selsChange: function (sels) {
      this.sels = sels;
    },

    rowClick: function (row, event, column) {
      this.editForm = row;
      this.$emit("row-click", row, event, column); //  @row-click="rowClick"
      this.selectedProduct(row);
      this.productVisible = false;
      this.moreVisible = false;
    },
    selectedProduct: function (row) {
      this.editForm = row;
      this.$emit("selected", row);
      this.productVisible = false;
      this.moreVisible = false;
    }, 

    tableRowClassName({ row, rowIndex }) {
      if (row && this.editForm && row.id == this.editForm.id) {
        return "success-row";
      }
      return "";
    },
    clearSelect() {
      this.$refs.table.setCurrentRow();
      this.$emit("clear");
      this.selectedProduct(null);
      this.productVisible = false;
      this.moreVisible = false;
    },
    refreshSelect() {
      this.searchXmProducts();
      this.moreVisible = false;
    },
    close() {
      this.productVisible = false;
      this.moreVisible = false;
      this.$emit("close");
    },

    initData() {
      var key=""
      if(this.iterationId){
        key='xm-product-select-list-it-'+this.iterationId 
      }else if(this.linkProjectId){
        key='xm-product-select-list-prj-'+this.linkProjectId 
      }

      if(key){
        var xmProductStr=sessionStorage.getItem(key);
        if(xmProductStr && xmProductStr!='null' && xmProductStr!='undefined'){  
          this.xmProducts = JSON.parse(xmProductStr);
          if (this.productVisible == false) {
            if (this.autoSelect !== false && this.xmProducts.length > 0) {
              var row = this.xmProducts[0];
              this.$refs.table.setCurrentRow(row);
              this.rowClick(row);
            }
          }
        } else {
          this.searchXmProducts();
        } 
      } else {
        this.searchXmProducts();
      }
    },
    referenceClick() {
      if (!this.hadInit) {
        this.initData();
        this.hadInit = true;
      }
      this.productVisible = !this.productVisible;
    },

    reloadOne() {
      listXmProductWithState({ id: this.editForm.id }).then((res) => {
        var tips = res.data.tips;
        if (tips.isOk && res.data.data && res.data.data.length > 0) {
          Object.assign(this.editForm, res.data.data[0]);
          this.rowClick(this.editForm);
        }
      });
    },
    afterAddSubmit(row) {
      this.xmProducts.push(row);
      if (this.iterationId) {
        map.set(this.iterationId, this.xmProducts);
      } else if (this.linkProjectId) {
        map.set(this.linkProjectId, this.xmProducts);
      }
      if (
        this.autoSelect !== false &&
        this.xmProducts.length > 0 &&
        this.productVisible == false
      ) {
        var row = this.xmProducts[0];
        this.$refs.table.setCurrentRow(row);
        this.rowClick(row);
      }
      this.addProductVisible = false;
    },
  }, //end methods
  components: { 
    MdpSelectUserXm,
    XmProductAdd,
    //在下面添加其它组件
  },
  mounted() {
    this.$nextTick(() => {
      this.maxTableHeight = util.calcTableMaxHeight(this.$refs.table.$el);
      if (this.autoSelect !== false) {
        this.initData();
        this.hadInit = true;
      }
    });
  },
};
</script>
<style scoped> 
.align-right {
  float: right;
}
.title { 
	display: flex;
  height: 32px;
  line-height: 32px;
  text-align: left;
  float: left; 
  min-width: 100px;
  cursor: pointer;
}
</style>
