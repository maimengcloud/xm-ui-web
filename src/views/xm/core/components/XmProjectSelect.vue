<template>
  <section>
    <el-popover
      placement="bottom"
      width="400"
      trigger="manual"
      v-model="projectVisible"
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
          title="清空当前选中的项目"
          >清除选中&nbsp;&nbsp;</el-button
        >
		<el-button
              @click="addProjectVisible = true"
              icon="el-icon-plus"
              type="text"
              >创建项目</el-button>
                <el-popover
                  placement="top-start"
                  title="更多条件、操作"
                  width="500"
                  v-model="moreVisible"
                  trigger="manual"
                >
                <el-button type="text" icon="el-icon-close" @click="moreVisible = false" style="float:right;margin-top:-40px;"
                        >关闭</el-button
                      >
                  <el-row>
                    
								<el-divider></el-divider>
                
                    <el-row>
                      <font class="more-label-font"> 项目经理: </font>
                     <mdp-select-user-xm label="选择项目经理" v-model="filters" userid-key="pmUserid" username-key="pmUsername" :clearable="true"></mdp-select-user-xm>
                    </el-row>
                    <el-row>
                      <font class="more-label-font">项目编号:</font>
                      <el-input
                        v-model="filters.id"
                        style="width: 200px;"
                        placeholder="输入项目编号" 
                         clearable
                      >
                      </el-input>
                    </el-row>

                    <el-row>
                      <font class="more-label-font"> 项目名称: </font>
                      <el-input
                        v-model="filters.key"
                        style="width: 200px;"
                        placeholder="输入项目名字关键字"
                         clearable
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
                      <el-button type="primary" @click="searchXmProjects" style="float:right;" icon="el-icon-search"
                        >查询</el-button
                      >
                    </el-row>
                  </el-row>
                  <el-button
                    type="text"
                    slot="reference"
                    @click="moreVisible = !moreVisible" 
                    icon="el-icon-search"
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
        v-if="load.list == false && (!xmProjects || xmProjects.length == 0)"
      >
        <el-row v-if="linkProductId">
          <el-row
            >没有查到与产品【{{
              linkProductId
            }}】关联的项目,您可以尝试&nbsp;&nbsp;
            <el-button
              type="text"
              icon="el-icon-refresh"
              @click="refreshSelect"
              title="重新从后台刷新数据回来"
              >刷新</el-button
            >&nbsp;&nbsp; 重新从后台加载，或者<el-button
              @click="addProjectVisible = true"
              icon="el-icon-plus"
              type="text"
              >创建项目</el-button
            >
            ，并自动关联产品【{{
              linkProductId
            }}】，或者到【产品->关联项目->加入更多项目到产品】手动关联一个已存在的项目。
          </el-row>
        </el-row>
        <el-row v-else>
          <el-row
            >没有查到相关项目,您可以尝试&nbsp;&nbsp;
            <el-button
              type="text"
              icon="el-icon-refresh"
              @click="refreshSelect"
              title="重新从后台刷新数据回来"
              >刷新</el-button
            >&nbsp;&nbsp; 重新从后台加载，或者<el-button
              @click="addProjectVisible = true"
              icon="el-icon-plus"
              type="text"
              >创建项目</el-button
            >
          </el-row>
        </el-row>
      </el-row>
      <el-row>
        <!--列表 XmProject 项目表-->
        <el-table
          ref="table"
          :height="maxTableHeight"
          :data="xmProjects"
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
          <el-table-column prop="name" label="项目名称">
            <template slot="header" slot-scope="scope">
              项目名称 
            </template>
            <template slot-scope="scope">
             <div class="icon" style="background-color:#ffd04b"><i class="el-icon-odometer" ></i></div><font>{{ scope.row.name }}</font>
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
      <span slot="reference" @click="referenceClick">
        <slot name="reference"
          ><el-link
            title="项目，点击选择、清除选择"
            type="warning"
            icon="el-icon-odometer"
            > 
             <span class="title">
            <slot name="title">{{
                editForm && editForm.id ? editForm.name: "选择项目"
              }}</slot></span>
              </el-link>
        </slot>
      </span>
    </el-popover> 
	
        <el-dialog append-to-body :visible.sync="addProjectVisible" width="70%" top="20px">
          <xm-project-add
		  	:op-type="'add'"
            :xm-product="{ id: linkProductId, name: '' }"
            @cancel="addProjectVisible = false"
            @submit="afterAddSubmit"
          >
          </xm-project-add>
        </el-dialog>
  </section>
</template>

<script>
import util from "@/common/js/util"; //全局公共库
//import Sticky from '@/components/Sticky' // 粘性header组件
//import { initSimpleDicts } from '@/api/mdp/meta/item';//下拉框数据查询
import { listXmProject } from "@/api/xm/core/xmProject";
import { mapGetters } from "vuex"; 
const map = new Map();
 
import XmProjectAdd from "../xmProject/XmProjectEdit.vue";

export default {
  props: ["linkProductId", "linkIterationId", "autoSelect"],
  computed: {
    ...mapGetters(["userInfo", "roles"]),
  },
  watch: {
    linkIterationId() {
      this.initData();
    },

    linkProductId() {
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
        id: "", //项目编号
        pmUserid:'',
        pmUsername:'',
      },
      xmProjects: [], //查询结果
      pageInfo: {
        //分页数据
        total: 0, //服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
        pageSize: 10, //每页数据
        countSql: false, //是否需要重新计算总记录数
        pageNum: 1, //当前页码、从1开始计算
        orderFields: [], //排序列 如 ['sex','student_id']，必须为数据库字段
        orderDirs: [], //升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
      },
      load: { list: false, edit: false, del: false, add: false }, //查询中...
      sels: [], //列表选中数据
      dicts: {}, //下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]}

      //新增xmProject界面初始化数据
      addForm: {
        id: "",
        name: "",
        branchId: "",
        remark: "",
      },

      //编辑xmProject界面初始化数据
      editForm: {
        id: "",
        name: "",
        branchId: "",
        remark: "",
      },
      selectFiltersPmUserVisible: false,
      maxTableHeight: 300,
      dateRanger: [],
      pickerOptions: util.getPickerOptions("datarange"),
      projectVisible: false,
      moreVisible: false,
      hadInit: false, 
	  addProjectVisible:false,
    };
  }, //end data
  methods: {
    handleSizeChange(pageSize) {
      this.pageInfo.pageSize = pageSize;
      this.getXmProjects();
    },
    handleCurrentChange(pageNum) {
      this.pageInfo.pageNum = pageNum;
      this.getXmProjects();
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
      this.getXmProjects();
    },
    searchXmProjects() {
      this.pageInfo.countSql = true;
      this.getXmProjects();
    },
    //获取列表 XmProject 项目表
    getXmProjects() {
      let params = {
        pageSize: this.pageInfo.pageSize,
        pageNum: this.pageInfo.pageNum,
        total: this.pageInfo.total,
        countSql: this.pageInfo.countSql,
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
      if (this.linkProductId) {
        params.linkProductId = this.linkProductId;
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
      listXmProject(params)
        .then((res) => {
          var tips = res.data.tips;
          if (tips.isOk) {
            this.pageInfo.total = res.data.total;
            this.pageInfo.countSql = false;
            this.xmProjects = res.data.data;
            if (this.linkIterationId) {
              map.set(this.linkIterationId, this.xmProjects);
            } else if (this.linkProductId) {
              map.set(this.linkProductId, this.xmProjects);
            }
            if (
              this.autoSelect !== false &&
              this.xmProjects.length > 0 &&
              this.projectVisible == false
            ) {
              var row = this.xmProjects[0];
              this.$refs.table.setCurrentRow(row);
              this.rowClick(row);
            } else{
				if(this.xmProjects.length==0  && this.moreVisible==false){
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

    //选择行xmProject
    selsChange: function (sels) {
      this.sels = sels;
    },

    rowClick: function (row, event, column) {
      this.editForm = row;
      this.$emit("row-click", row, event, column); //  @row-click="rowClick"
      this.selectedProject(row);
      this.projectVisible = false;
      this.moreVisible = false;
    },
    selectedProject: function (row) {
      this.editForm = row;
      this.$emit("selected", row);
      this.projectVisible = false;
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
      this.selectedProject(null);
      this.projectVisible = false;
      this.moreVisible = false;
    },
	
    refreshSelect() {
      this.searchXmProjects();
      this.moreVisible = false;
    },
    close() {
      this.projectVisible = false;
      this.moreVisible = false;
      this.$emit("close");
    },

    initData() {
      if (this.linkIterationId) {
        var xmProjects = map.get(this.linkIterationId);
        if (xmProjects) {
          this.xmProjects = xmProjects;
          if (this.projectVisible == false) {
            if (this.autoSelect !== false && this.xmProjects.length > 0) {
              var row = this.xmProjects[0];
              this.$refs.table.setCurrentRow(row);
              this.rowClick(row);
            }
          }
        } else {
          this.searchXmProjects();
        }
      } else if (this.linkProductId) {
        var xmProjects = map.get(this.linkProductId);
        if (xmProjects) {
          this.xmProjects = xmProjects;
          if (this.projectVisible == false) {
            if (this.autoSelect !== false && this.xmProjects.length > 0) {
              var row = this.xmProjects[0];
              this.$refs.table.setCurrentRow(row);
              this.rowClick(row);
            }
          }
        } else {
          this.searchXmProjects();
        }
      } else {
        this.searchXmProjects();
      }
    },

    referenceClick() {
      if (!this.hadInit) {
        this.initData();
        this.hadInit = true;
      }
      this.projectVisible = !this.projectVisible;
    },
    reloadOne() {
      listXmProject({ id: this.editForm.id }).then((res) => {
        var tips = res.data.tips;
        if (tips.isOk && res.data.data && res.data.data.length > 0) {
          Object.assign(this.editForm, res.data.data[0]);
          this.rowClick(this.editForm);
        }
      });
    },
	
    afterAddSubmit(row) {
      this.xmProjects.push(row);
      if (this.iterationId) {
        map.set(this.iterationId, this.xmProjects);
      } else if (this.linkProjectId) {
        map.set(this.linkProductId, this.xmProjects);
      }
      if (
        this.autoSelect !== false &&
        this.xmProjects.length > 0 &&
        this.projectVisible == false
      ) {
        var row = this.xmProjects[0];
        this.$refs.table.setCurrentRow(row);
        this.rowClick(row);
      }
      this.addProjectVisible = false;
    }, 
  }, //end methods
  components: {
    "mdp-select-user-xm":()=>import("./MdpSelectUserXm/index.vue"),XmProjectAdd,
    //在下面添加其它组件
  },
  mounted() {
    this.$nextTick(() => {
      if (this.$refs.table) {
        this.maxTableHeight = util.calcTableMaxHeight(this.$refs.table.$el);
      }

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

  height: 32px;
  line-height: 32px;
  text-align: left;
  float: left; 
  min-width: 100px; 
  max-width: 300px; 
  overflow:hidden;  
  text-overflow:ellipsis;  
  white-space:nowrap; 
}
</style>
