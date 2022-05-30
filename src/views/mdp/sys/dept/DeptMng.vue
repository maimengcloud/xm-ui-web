<template>
  <section>
    <el-row class="padding">
      <el-select multiple clearable v-model="filters.levelTypes">
        <el-option label="1级" value="L1"></el-option>
        <el-option label="2级" value="L2"></el-option>
        <el-option label="3级" value="L3"></el-option>
        <el-option label="4级" value="L4"></el-option>
        <el-option label="5级" value="L5"></el-option>
      </el-select>
      <el-input v-model="filters.key" style="width: 30%;" placeholder="名称 简称  编号 模糊查询">
        <template slot="append">
          <el-button type="primary" v-loading="load.list" v-on:click="searchDepts" icon="el-icon-search"></el-button>
        </template>
      </el-input>

      <el-button type="primary" @click="showAdd" icon="el-icon-plus">添加一级部门</el-button>
      <el-button  @click="handleDownload" icon="el-icon-download">导出数据</el-button>
      <el-button
        type="danger"
        v-loading="load.del"
        @click="batchDel"
        :disabled="this.sels.length===0"
        icon="el-icon-delete"
      ></el-button>
      <el-tooltip
        class="item"
        effect="dark"
        content="为了提高效率，服务器做了缓存，添加修改删除操作引起的部门变化，十分钟后部门树中才能体现"
        placement="top"
      >
        <i class="el-icon-question"></i>
      </el-tooltip>
    </el-row>
    

		<el-row v-if="filters.parentDeptList && filters.parentDeptList.length>0" class="padding-left"> 
			<span v-for="(item ,index) in filters.parentDeptList" :key="index">
				<el-tag   @close="clearParentDept(item,index)" closable @click="clickParentDept(item,index)">{{item.deptName}}</el-tag>/
			</span>
		</el-row>
    <el-row class="padding-left padding-right">
      <el-col :span="24">
        <!--列表 Dept sys_dept-->
        <el-table
          :data="treeData"
          highlight-current-row
          v-loading="load.list"
          border
          @selection-change="selsChange"
          style="width: 100%;"
          fit
          default-expand-all
          :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
          row-key="deptid"
          :max-height="tableHeight"
        >
          <el-table-column sortable type="selection" width="40"></el-table-column>
          <el-table-column sortable type="index" width="40"></el-table-column>
          <el-table-column
            sortable
            prop="deptName"
            label="部门名称"
            min-width="400"
          >  
							<template slot-scope="scope">
 							  <el-link  @click.stop="showEdit(scope.$index,scope.row)"  type="primary">{{scope.row.deptName}}</el-link>
                  <!-- 无须审核
                  <el-tooltip  :content="showApprovaInfo(scope.row)" placement="bottom" effect="light">
                    <el-tag v-if="scope.row.flowState=='0' || scope.row.flowState==null" type="warning">未发审</el-tag>
                    <el-tag v-else-if="scope.row.flowState=='1'"  type="primary">审核中</el-tag>
                    <el-tag v-else-if="scope.row.flowState=='2'"  type="success">已通过</el-tag>
                    <el-tag v-else-if="scope.row.flowState=='3'" type="danger">未通过</el-tag>
                    <el-tag v-else-if="scope.row.flowState=='4'" type="info">已取消</el-tag>
                </el-tooltip>
                -->
							</template>
             
          </el-table-column> 
          
          <el-table-column
            sortable
            prop="managerName"
            label="部门经理"
            min-width="80"
            show-overflow-tooltip
          ></el-table-column> 
          <el-table-column
            sortable
            prop="leaderName"
            label="分管领导"
            min-width="80"
            show-overflow-tooltip
          ></el-table-column>  
          <el-table-column sortable prop="deptType" label="类型" min-width="80" show-overflow-tooltip>
            <template scope="scope">
              <el-tag
                close-transition
              >{{ getOptionName(options.deptType,scope.row.deptType) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column sortable prop="state" label="状态" min-width="60" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-tag v-if="scope.row.state=='1'||scope.row.state=='A'" type="success">√</el-tag>
              <el-tag v-else type="danger">×</el-tag>
            </template>
          </el-table-column>
          <el-table-column  label="操作" width="300">
            <template scope="scope">
                  <el-button  type="text" @click="showSubAdd(scope.row,scope.$index)" icon="el-icon-plus"></el-button>
                  <el-button type="text" @click="showSubDept(scope.row,scope.$index)" >下级({{scope.row.childrenNum}})</el-button>
                  <el-button  type="text"  @click="showDeptPost(scope.$index,scope.row)">岗位</el-button>
                  <el-button  type="text" icon="el-icon-user"  @click="showUserDept(scope.$index,scope.row)">用户</el-button>
                  <!--
                  <el-dropdown @command="handleCommand" :hide-on-click="false">
                    <span class="el-dropdown-link">
                      更多<i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      
                      <el-dropdown-item icon="el-icon-success"  :command="{type:'sendToProcessApprova',row:scope.row}">新部门注册审核</el-dropdown-item>
                      <el-dropdown-item icon="el-icon-setting"   :command="{type:'showEditLocation',index:scope.$index,row:scope.row}">部门位置信息</el-dropdown-item>
                      
                      <el-dropdown-item icon="el-icon-edit"  :command="{type:'showEdit',index:scope.$index,row:scope.row}">修改基本信息</el-dropdown-item>
                      <el-dropdown-item icon="el-icon-user"   :command="{type:'showUserDept',index:scope.$index,row:scope.row}">部门用户管理</el-dropdown-item>
                      <el-dropdown-item icon="el-icon-remove"   :command="{type:'handleDel',index:scope.$index,row:scope.row}">删除该部门</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                  -->
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
      </el-col>
    </el-row>
    <!--编辑 Dept sys_dept界面-->
    <el-dialog
      title="编辑"
      :visible.sync="editFormVisible"
      width="60%"
      top="20px"
      :close-on-click-modal="false"
    >
      <dept-edit
        :dept="editForm"
        @cancel="editFormVisible=false"
        @submit="afterEditSubmit"
      ></dept-edit>
    </el-dialog>
    <!--新增 Dept sys_dept界面-->
    <el-dialog
      title="新增"
      :visible.sync="addFormVisible"
      width="60%"
      top="20px"
      :close-on-click-modal="false"
    >
      <dept-add
        :dept="addForm"
        :parent-dept="parentDept"
        @cancel="addFormVisible=false"
        @submit="afterAddSubmit"
      ></dept-add>
    </el-dialog>
    <!--新增 Dept sys_dept界面-->
    <el-dialog
      title="用户管理"
      :visible.sync="userDeptFormVisible"
      width="60%"
      top="20px"
      :close-on-click-modal="false"
    >
      <user-dept-list
        :deptid="editForm.deptid"
        :branch-id="editForm.branchId"
        :visible="userDeptFormVisible"
        @cancel="userDeptFormVisible=false"
      ></user-dept-list>
    </el-dialog>
    <!--部门岗位关系维护界面-->
    <el-dialog
      title="管理部门中的岗位"
      :visible.sync="deptPostVisible"
      top="20px"
      fullscreen
      :close-on-click-modal="false"
    >
      <dept-post-mng
        :deptid="editForm.deptid"
        :branch-id="editForm.branchId"
        :visible="deptPostVisible"
        @cancel="deptPostVisible=false"
      ></dept-post-mng>
    </el-dialog>
    <!--新增 Dept sys_dept_location界面-->
    <el-dialog
      title="编辑"
      :visible.sync="deptlocationVisible"
      width="60%"
      top="20px"
      :close-on-click-modal="false"
    >
      <dept-location-edit
        v-model="showEditLocationId"
        @cancel="deptlocationVisible=false"
        deptid="deptid"
        province="province"
        city="city"
        district="district"
        address="address"
        longitude="longitude"
        latitude="latitude"
      >
        <el-button
          style="width: 119px;"
          type="primary"
          @click.native="addSubmit"
          :loading="addLoading"
        >保存</el-button>
        <el-button
          style="width: 119px;"
          type="danger"
          @click.native="delSubmit"
          :loading="delLoading"
        >删除</el-button>
      </dept-location-edit>
    </el-dialog>
  </section>
</template>

<script>
import util from "../../../../common/js/util"; //全局公共库
import config from "@/common/config"; //全局公共库
import { listOption } from "@/api/mdp/meta/itemOption"; //下拉框数据查询
import { listDept, delDept, batchDelDept } from "../../../../api/mdp/sys/dept";
import DeptAdd from "./DeptAdd"; //新增界面
import DeptEdit from "./DeptEdit"; //修改界面
import UserDeptList from "../userDept/UserDeptList"; //用户部门关系维护
import DeptPostMng from "../post/deptPost/DeptPostMng"; //部门岗位关系维护
import { mapGetters } from "vuex";
import DeptLocationEdit from "./DeptLocationEdit"; //地址编辑
import {
  addAndEditDeptLocation,
  getDeptLocation,
  delDeptLocation
} from "../../../../api/mdp/sys/deptLocation";
export default {

  name:"DeptMng",
  computed: {
    ...mapGetters(["userInfo"]),
    treeData(){
      return this.translateDataToTree(this.depts)
    }
  },
  data() {
    return {
      filters: { 
        key: "",
        parentDept:null,
        parentDeptList:[],
        levelTypes:['L1','L2']
      },
      depts: [], //查询结果
      pageInfo: {
        //分页数据
        total: 0, //服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
        pageSize: 10, //每页数据
        count: false, //是否需要重新计算总记录数
        pageNum: 1, //当前页码、从1开始计算
        orderFields: [], //排序列 如 ['sex','student_id']，必须为数据库字段
        orderDirs: [] //升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
      },
      load: { list: false, edit: false, del: false, add: false }, //查询中...
      sels: [], //列表选中数据
      options: {}, //下拉选择框的所有静态数据 options.sex,options.project
      tableHeight:500,
      addFormVisible: false, //新增dept界面是否显示
      //新增dept界面初始化数据
      addForm: {
        deptid: "",
        deptName: "",
        pdeptid: "",
        deptType: "",
        state: "1",
        manager: "",
        leader: "",
        shortName: "",
        displayDeptid: "",
        orgType: "",
        managerName: "",
        leaderName: "",
        branchId: "",
        levelType: "",
        idPath: ""
      },

      editFormVisible: false, //编辑界面是否显示
      //编辑dept界面初始化数据
      editForm: {
        deptid: "",
        deptName: "",
        pdeptid: "",
        deptType: "",
        state: "1",
        manager: "",
        leader: "",
        shortName: "",
        displayDeptid: "",
        orgType: "",
        managerName: "",
        leaderName: "",
        branchId: "",
        levelType: "",
        idPath: ""
      },
      addDeptDressForm: {
        deptid: "",
        longitude: "",
        latitude: "",
        address: "",
        province: "",
        city: "",
        district: ""
      },
      /**begin 自定义属性请在下面加 请加备注**/
      userDeptFormVisible: false,
      deptlocationVisible: false,
      deptPostVisible: false, //部门岗位关系维护
      showEditLocationId: {},
      addLoading: false,
      delLoading: false,
      branch: null, //选择的当前机构
      parentDept:null,
			tableHeight:500,
      //resultDeptData:{}
      /**end 自定义属性请在上面加 请加备注**/
    };
  }, //end data
  methods: {
    //获取代码对应的名称 用于数据反显 如 getOptionName(options.sex,'1');
    getOptionName(options, optionValue) {
      if (!options) return optionValue;
      let option = options.filter(i => i.optionValue == optionValue);
      if (option.length > 0) {
        return option[0].optionName;
      } else {
        return optionValue;
      }
    },
    handleSizeChange(pageSize) {
      this.pageInfo.pageSize = pageSize;
      this.pageInfo.count = true;

      this.getDepts();
    },
    handleCurrentChange(pageNum) {
      this.pageInfo.pageNum = pageNum;
      this.getDepts();
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
      this.getDepts();
    },
    searchDepts() {
      this.pageInfo.count = true;
      this.getDepts();
    },
    //获取列表 Dept sys_dept
    getDepts() {
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
        params.key = "%" + this.filters.key + "%";
      }
      params.branchId = this.userInfo.branchId;
      if (this.branch != null) {
        params.branchId = this.branch.id;
      }
      if(this.filters.parentDept){
        params.pdeptid=this.filters.parentDept.deptid 
      }
      if( !params.pdeptid && this.filters.levelTypes && this.filters.levelTypes.length>0){
        params.levelTypes=this.filters.levelTypes
      }
      this.load.list = true;
      listDept(params)
        .then(res => {
          var tips = res.data.tips;
          if (tips.isOk) {
            this.pageInfo.total = res.data.total;
            this.pageInfo.count = false;
            this.depts = res.data.data;
            console.log("查看");
            console.log(this.depts);
          } else {
            this.$notify({ message: tips.msg, type: "error" });
          }
          this.load.list = false;
        })
        .catch(() => {
          this.load.list = false;
          //this.$notify({ message: '通讯错误', type: 'error' });
        });
    },
    branchRowClick: function(row, event, column) {
      if (this.branch == null || row.id != this.branch.id) {
        this.branch = row;
        this.searchDepts();
      }
    },
    //显示编辑界面 Dept sys_dept
    showEdit: function(index, row) {
      if(row.flowState=='1'){
          this.$notify.error("审核中，不允许操作");
          return;
      }
      this.editFormVisible = true;
      this.editForm = Object.assign({}, row);
    },
    //显示新增界面 Dept sys_dept
    showAdd: function() {
      this.parentDept=null;
      this.addFormVisible = true;
    },
    showSubAdd(row){
      this.parentDept=row;
      this.editForm=row;
      this.addFormVisible = true;
    },
    //显示新增界面 Dept sys_dept
    showUserDept: function(index, row) {
      if(row.flowState=='1'){
          this.$notify.error("审核中，不允许操作");
          return;
}
      this.editForm = Object.assign({}, row);
      this.userDeptFormVisible = true;
      //this.addForm=Object.assign({}, this.editForm);
    },
    //显示部门岗位维护界面
    showDeptPost: function(index, row) {
      if(row.flowState=='1'){
          this.$notify.error("审核中，不允许操作");
          return;
      }
      this.editForm = Object.assign({}, row);
      this.deptPostVisible = true;
      //this.addForm=Object.assign({}, this.editForm);
    },
    afterAddSubmit() {
      this.addFormVisible = false;
      this.pageInfo.count = true;
      this.getDepts();
    },
    afterEditSubmit() {
      this.editFormVisible = false;
    },
    //选择行dept
    selsChange: function(sels) {
      this.sels = sels;
    },
    //删除dept
    handleDel: function(index, row) {
      if(row.flowState=='1'){
          this.$notify.error("审核中，不允许操作");
          return;
      }
      this.$confirm("确认删除该记录吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          this.load.list = true;
          let params = row;
          delDept(params).then(res => {
            this.load.list = false;
            var tips = res.data.tips;
            if (tips.isOk) {
              this.pageInfo.count = true;
              this.getDepts();
            }
            this.$notify({
              message: tips.msg,
              type: tips.isOk ? "success" : "error"
            });
          });
        })
        .catch(() => {
          this.load.list = false;
        });
    },
    //批量删除dept
    batchDel: function() {
      this.$confirm("确认删除选中记录吗？", "提示", {
        type: "warning"
      })
        .then(() => {
          this.load.list = true;
          batchDelDept(this.sels).then(res => {
            this.load.list = false;
            var tips = res.data.tips;
            if (tips.isOk) {
              this.pageInfo.count = true;
              this.getDepts();
            }
            this.$notify({
              message: tips.msg,
              type: tips.isOk ? "success" : "error"
            });
          });
        })
        .catch(() => {
          this.load.list = false;
        });
    },

    //编辑部门地址
    showEditLocation: function(index, row) {
      if(row.flowState=='1'){
          this.$notify.error("审核中，不允许操作");
          return;
      }
      this.deptlocationVisible = true;
      //需要提供传入的数据有对应字段
      var obj = Object.assign({}, this.addDeptDressForm, row);
      this.showEditLocationId = obj;
      this.getDeptLocation();
    },
    addSubmit() {
      if (this.showEditLocationId.address == "") {
        this.$notify({ message: "门店地址不可为空", type: "warning" });
        return;
      }
      this.$confirm("确认提交吗？", "提示", {}).then(() => {
        this.addLoading = true;

        let params = {
          deptLocation: Object.assign(this.showEditLocationId)
        };
        addAndEditDeptLocation(params)
          .then(res => {
            this.addLoading = false;
            var tips = res.data.tips;
            if (tips.isOk) {
              //this.$refs['addForm'].resetFields();
              //this.$emit('submit');//  @submit="afterAddSubmit"
            }
            this.$notify({
              message: tips.msg,
              type: tips.isOk ? "success" : "error"
            });
          })
          .catch(() => {
            this.addLoading = false;
          });
      });
    },
    delSubmit() {
      if (
        this.showEditLocationId.deptid == "" ||
        this.showEditLocationId.deptid == "undefined"
      ) {
        this.$notify({
          message: "该部门没有地址，请保存地址",
          type: "warning"
        });
      }
      this.$confirm("确认提交吗？", "提示", {}).then(() => {
        this.delLoading = true;
        delDeptLocation(this.showEditLocationId)
          .then(res => {
            this.delLoading = false;
            var tips = res.data.tips;
            if (tips.isOk) {
              //this.$refs['addForm'].resetFields();
              //this.$emit('cancel');//  @submit="afterAddSubmit"
              //this.$notify({ message: tips.msg, type: tips.isOk?'success':'error' });
              this.closeLocaionDialog();
            }
            this.$notify({
              message: tips.msg,
              type: tips.isOk ? "success" : "error"
            });
          })
          .catch(() => {
            this.delLoading = false;
          });
      });
    },

			translateDataToTree(data) {

				let parents = data.filter(value =>{
					//如果我的上级为空，则我是最上级
					if(value.pdeptid == 'undefined' || value.pdeptid == null  || value.pdeptid == '' || value.pdeptid == 'A0'){
						return true;

						//如果我的上级不在列表中，我作为最上级
					}else if(data.some(i=>value.pdeptid==i.deptid)){
						return false;
					}else {
						return true
					}

				})
				let children = data.filter(value =>{
					if(data.some(i=>value.pdeptid==i.deptid)){
						return true;
					}else{
						return false;
					}
				})
				let translator = (parents, children) => {
					parents.forEach((parent) => {
						children.forEach((current, index) => {
							if (current.pdeptid === parent.deptid) {
								let temp = JSON.parse(JSON.stringify(children))
								temp.splice(index, 1)
								translator([current], temp)
								typeof parent.children !== 'undefined' ? parent.children.push(current) : parent.children = [current]
							}
						}
						)
					}
					)
				}

				translator(parents, children)

				return parents
			},
    getDeptLocation() {
      let params = {
        deptid: this.showEditLocationId.deptid
      };
      getDeptLocation(params)
        .then(res => {
          var tips = res.data.tips;
          if (tips.isOk) {
            if (
              res.data.deptLocation != null &&
              res.data.deptLocation != "" &&
              res.data.deptLocation != undefined
            ) {
              this.showEditLocationId = Object.assign(res.data.deptLocation);
            } else {
              this.$notify({ message: "请搜索地址", type: "warning" });
            }
          } else {
            this.$notify({ message: "更新失败", type: "warning" });
          }
        })
        .catch(() => {
          this.$notify({ message: "你已取消操作", type: "info" });
        });
    },
    closeLocaionDialog() {
      this.deptlocationVisible = false;
    },
    handleDownload() {
      console.log(JSON.stringify(this.depts));
      import("@/vendor/Export2Excel").then(excel => {
        const tHeader = [
          "部门全称",
          "上级领导编号",
          "归属机构号",
          "负责人编号",
          "部门编号",
          "类型",
          "负责人名称",
          "参考数据字典",
          "上级部门编号",
          "部门编号路径",
          "分管领导",
          "层级类型",
          "状态",
          "部门号",
          "简称"
        ];
        const filterVal = [
          "deptName",
          "leader",
          "branchId",
          "manager",
          "deptid",
          "deptType",
          "managerName",
          "orgType",
          "pdeptid",
          "idPath",
          "leaderName",
          "levelType",
          "state",
          "displayDeptid",
          "shortName"
        ];
        const list = this.depts;
        const data = this.formatJson(filterVal, list);
        var filename = "部门管理导出";
        if (this.formDefSelected) {
          filename = this.formDefSelected.formName
            ? this.formDefSelected.formName
            : this.formDefSelected.id + "部门管理导出";
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
    },
    showApprovaInfo:function(row){
      var msgFields=[];
      if(row.mainTitle!=null && row.mainTitle!=""){
        msgFields.push("流程【"+row.mainTitle+"】");
      }

      if(row.taskName!=null && row.taskName!=""){
        msgFields.push("当前环节【"+row.taskName+"】");
      }

      if(row.assigneeName!=null && row.assigneeName!=""){
        msgFields.push("执行人【"+row.assigneeName+"】");
      }

      if(row.commentMsg!=null && row.commentMsg!=""){
        msgFields.push("审批意见【"+row.commentMsg+"】");
      }
      var msg=msgFields.join(",");
      return msg;
    },
    sendToProcessApprova:function(row){
        // 传过来的参数格式
        if(row.flowState=='1'){
          this.$notify.error("审核中，不允许重复发审");
          return;
        }
				let extVars={deptid:row.deptid}
        let jsonExtVars=JSON.stringify(extVars);

        var currDomain=window.location.protocol+"//"+window.location.host;
        var fullPath=this.$route.fullPath;
        var bizUrl=currDomain+'/#'+fullPath+'?extVars='+jsonExtVars

				let params={
						mainContext:'关于增加部门【'+row.deptName+"】的审批",
            mainTitle:'关于增加部门【'+row.deptName+"】的审批",
            bizKey:'dept_register',
						bizUrl: bizUrl,
						restUrl:config.getSysBasePath()+"/sys/dept/processApprova",
						extVars:extVars,
						flowVars:{
              subscribeTaskEvent:'TASK_COMPLETED,TASK_CREATED',
              deptid:row.deptid,
              branchId:row.branchId
            },
				}
				let jsonParmas=encodeURIComponent(JSON.stringify(params));//对方要 decodeURIComponent
				this.$router.push({path:'/mdp/workflow/re/procdef/ProcdefListForBizStart',query:{params:jsonParmas}});
    },
    handleCommand(command) {
       if(command.type=='sendToProcessApprova'){
         this.sendToProcessApprova(command.row);
       }else if(command.type=='showEditLocation'){
         this.showEditLocation(command.index,command.row);
       }else if(command.type=='showEdit'){
         this.showEdit(command.index,command.row);
       }else if(command.type=='showUserDept'){
         this.showUserDept(command.index,command.row);
       }else if(command.type=='handleDel'){
         this.handleDel(command.index,command.row);
       }
    },
			clearParentDept(parentDept,index){
				if(index==1){
					this.filters.parentObj=null;
				}else{
					this.filters.parentDept=this.filters.parentDeptList[index-1];
				}

				this.filters.parentDeptList.splice(index,this.filters.parentDeptList.length-index)
				this.pageInfo.count=true
				this.getDepts()
			}, 
			clickParentDept(parentDept,index){
				this.filters.parentDept=parentDept;
				this.filters.parentDeptList.splice(index+1,this.filters.parentDeptList.length-index-1)
				this.pageInfo.count=true
				this.getDepts()
			}, 
			 showSubDept(row){
				this.editForm = Object.assign({}, row);
				this.filters.parentDept=row
				this.filters.parentDeptList.push(row);
				this.pageInfo.count=true;
				this.getDepts();

			 },
    /**end 自定义函数请在上面加**/
  }, //end methods
  components: {
    "dept-add": DeptAdd,
    "dept-edit": DeptEdit,
    "user-dept-list": UserDeptList,
    "dept-location-edit": DeptLocationEdit,
    "dept-post-mng": DeptPostMng
  },
  mounted() {
    //this.getDepts();
    this.$nextTick(() => {
      this.tableHeight = window.innerHeight - 250;
    });
    this.branch = {
      id: this.userInfo.branchId,
      branchName: this.userInfo.branchName
    };
    //加载下拉列表 如有需要去年注释
    let optionsParams = [
      { categoryId: "all", itemCode: "orgType" },
      { categoryId: "all", itemCode: "deptType" }
    ];
    listOption(optionsParams).then(res => {
      this.options = res.data.data;
    });
    this.searchDepts();
    //给下拉列表初始化默认值
    //this.addForm.xxx=getDefaultValue(this.options.xxx,'1');

    /**在下面写其它函数***/
  }
};
</script>

<style scoped>
</style>
