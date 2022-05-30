<template>
  <section>
    <el-row  class="padding">
      <el-col :span="6" >
        <dept-tree
          show-root
          :show-checkbox="true"
          :expand-on-click-node="false"
          @check-change="deptTreeCheckChange"
          @branch-row-click="branchRowClick"
        ></dept-tree>
      </el-col>
       
      <el-col :span="18" style="padding-left:12px;">
        <el-row> 
          <el-input v-model="filters.key" style="width: 20%;" placeholder="名称 编号 手机号码 模糊查询"> 
          </el-input> 
         <el-button type="primary" v-loading="load.list" v-on:click="searchUsers" icon="el-icon-search"></el-button>
         <span style="float:right;">
          <el-button type="primary" @click="showAdd" icon="el-icon-plus">添加新成员</el-button> 
          <el-button type="primary" @click="showInvite" icon="el-icon-plus">邀请新成员</el-button> 
          <el-button
            type="primary"
            v-loading="load.edit"
            icon="el-icon-setting"
            :disabled="this.sels.length!==1"
            @click="handleResetPassword"
          >重置密码</el-button>
          
						<el-popover
							placement="top-start"
							title=""
							width="200"
							trigger="click" > 
							<el-row>
								<el-col :span="24" style="padding-top:5px;">
									<el-button
                    type="danger"
                    icon="el-icon-delete"
                    v-loading="load.del"
                    @click="batchDel"
                    :disabled="this.sels.length===0"
                  >批量删除</el-button>
								</el-col>
								<el-col  :span="24"  style="padding-top:5px;">
								
                  <el-button type="primary"  @click="handleDownload" icon="el-icon-download">导出数据</el-button>
								</el-col> 
							</el-row>
							<el-button  slot="reference" icon="el-icon-more" circle></el-button>
						</el-popover> 
         </span>
        </el-row>
        <el-row>
          <el-table
            :data="users"
            :max-height="tableHeight"
            highlight-current-row
            v-loading="load.list"
            border
            @selection-change="selsChange"
            style="width: 100%;"
          >
            <el-table-column sortable type="selection" width="60" fixed="left"></el-table-column>
             <el-table-column
              sortable
              prop="username"
              label="用户名称"
              min-width="150"
              fixed="left"
              show-overflow-tooltip
            > 
              <template slot-scope="scope">
                <div class="avatar-container" @click="showEdit(scope.$index,scope.row)">
                  <div class="avatar-wrapper">
                    <img v-if=" scope.row.headimgurl " class="user-avatar" :src="scope.row.headimgurl">
                    <img v-else class="user-avatar" src="../../../../assets/image/user_img.gif">
                    <span class="username"><i v-if="scope.row.sex=='0'" class="el-icon-female"></i><i v-else class="el-icon-male"></i> {{scope.row.username}}</span> 
                </div>    
              </div>
              </template>
            </el-table-column>
            <el-table-column
              sortable
              prop="userid"
              label="用户编号"
              min-width="100"
              show-overflow-tooltip
            > 
            </el-table-column>
            <el-table-column sortable prop="phoneno" label="手机号" min-width="100"> 
            </el-table-column>
            <el-table-column sortable prop="email" label="邮箱" min-width="100"> 
            </el-table-column>
            <el-table-column sortable prop="locked" label="状态" width="80" show-overflow-tooltip>
              <template scope="scope">
                <el-tag v-if="scope.row.locked!=='1'" type="success">√</el-tag>
                <el-tag v-else type="danger">×</el-tag>
              </template>
            </el-table-column>
            <el-table-column sortable prop="enddate" label="到期日期" width="120" show-overflow-tooltip></el-table-column>
            <el-table-column sortable label="操作" width="150" fixed="right">
              <template scope="scope">
                    <el-button  @click="showEdit(scope.$index,scope.row)"  type="text">编辑</el-button>  
                    <el-button     @click="showUserDeptEdit(scope.$index,scope.row)"  type="text" >部门/岗位</el-button>
                    <!--
                    <el-dropdown @command="handleCommand" :hide-on-click="false"   >
                      <span class="el-dropdown-link">
                        更多<i class="el-icon-arrow-down el-icon--right"></i>
                      </span>
                      <el-dropdown-menu slot="dropdown">  
                        <el-dropdown-item icon="el-icon-setting"   :command="{type:'showUserDeptEdit',index:scope.$index,row:scope.row}">部门及岗位设置</el-dropdown-item>
                        <el-dropdown-item icon="el-icon-edit"  :command="{type:'showEdit',index:scope.$index,row:scope.row}">修改基本信息</el-dropdown-item>
                        <el-dropdown-item icon="el-icon-user"   :command="{type:'showUserTpaEdit',index:scope.$index,row:scope.row}">绑定第三方账户</el-dropdown-item>
                        <el-dropdown-item icon="el-icon-remove"   :command="{type:'handleDel',index:scope.$index,row:scope.row}">删除用户</el-dropdown-item>
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
        </el-row>
      </el-col>
    </el-row>
    <!--编辑 User sys_user界面-->
    <el-dialog
      title="编辑"
      :visible.sync="editFormVisible"
      width="70%"
      top="20px"
      :close-on-click-modal="false"
      append-to-body
    >
      <user-edit
        :user="editForm"
        :branch="branch"
        @cancel="editFormVisible=false"
        @submit="afterEditSubmit"
      ></user-edit>
    </el-dialog>

    <!--新增 User sys_user界面-->
    <el-dialog
      title="新增"
      :visible.sync="addFormVisible"
      width="70%"
      top="20px"
      :close-on-click-modal="false"
      append-to-body
    >
      <user-add
        :user="addForm"
        :branch="branch"
        :dept="deptTree.deptNodeSelected"
        @cancel="addFormVisible=false"
        @submit="afterAddSubmit"
      ></user-add>
    </el-dialog>

    <!--设置用户角色界面-->
    <el-dialog
      title="设置用户角色"
      :visible.sync="editUserRoleFormVisible"
      width="50%"
      top="20px"
      :close-on-click-modal="false"
      append-to-body
    >
      <user-role-edit
        :user="editForm"
        :branch="branch"
        :visible="editUserRoleFormVisible"
        @cancel="editUserRoleFormVisible=false"
        @submit="editUserRoleFormVisible=false"
      ></user-role-edit>
    </el-dialog>
    <el-dialog
      title="外邀新成员"
      :visible.sync="userInviteVisible"
      width="70%"
      top="20px"
      :close-on-click-modal="false"
      append-to-body
    >
      <user-invite
        :branch="branch"
        :visible="userInviteVisible"
        @cancel="userInviteVisible=false"
        @submit="userInviteVisible=false"
      ></user-invite>
    </el-dialog>
    <!--设置用户部门界面-->
    <el-dialog
      title="设置所在部门及归属岗位"
      :visible.sync="editUserDeptFormVisible"
      width="70%"
      top="20px"
      :close-on-click-modal="false"
      append-to-body
    >
      <user-dept-edit
        :user="editForm"
        :branch="branch"
        :visible="editUserDeptFormVisible"
        @cancel="editUserDeptFormVisible=false"
        @submit="editUserDeptFormVisible=false"
      ></user-dept-edit>
    </el-dialog>

    <!--添加第三方开放平台-->
    <el-dialog
      title="添加第三方开放平台"
      :visible.sync="editUserTpaFormVisible"
      width="90%"
      :close-on-click-modal="false"
      append-to-body
    >
      <user-tpa
        :user="editForm"
        :branch="branch"
        :visible="editUserTpaFormVisible"
        @cancel="editUserTpaFormVisible=false"
        @submit="editUserDeptFormVisible=false"
      ></user-tpa>
    </el-dialog>
  </section>
</template>

<script>
import util from "../../../../common/js/util"; //全局公共库
//import Sticky from "@/components/Sticky"; // 粘性header组件
import config from "@/common/config"; //全局公共库
import {
  listUser,
  delUser,
  batchDelUser,
  resetPasswordByAdmin
} from "../../../../api/mdp/sys/user";
import UserAdd from "./UserAdd"; //新增界面
import UserEdit from "./UserEdit"; //修改界面
import UserInvite from "./UserInvite"; //新增界面
import UserRoleEdit from "../userRole/UserRoleEdit"; //修改界面
import UserDeptEdit from "../userDept/UserDeptEdit"; //修改界面
import { listRole } from "../../../../api/mdp/sys/role";
import {
  listUserRole,
  batchEditUserRole
} from "../../../../api/mdp/sys/userRole";
import DeptTree from "../dept/DeptTree.vue";
import { mapGetters } from "vuex";
import md5 from "js-md5";
import UserTpa from "./UserTpaMng"; //第三方开放平台

export default {
  name:"UserMng",
  computed: {
    ...mapGetters(["userInfo"])
  },
  props: ["visible"],
  watch: {
    visible: function(visible) {
      if (visible == true) {
        this.getUsers();
        //this.load.list=false;
      }
    }
  },
  data() {
    return {
      filters: {
        key: "",
        isQueryByDept: true
      },
      users: [], //查询结果
      pageInfo: {
        //分页数据
        total: 0, //服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
        pageSize: 10, //每页数据
        pageNum: 1, //当前页码、从1开始计算
        orderFields: [], //排序列 如 ['sex','student_id']，必须为数据库字段
        orderDirs: [] //升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
      },
      load: { list: false, edit: false, del: false, add: false }, //查询中...
      sels: [], //列表选中数据
      options: { sex: [], locked: [] }, //下拉选择框的所有静态数据 options.sex,options.project

      addFormVisible: false, //新增user界面是否显示
      //新增user界面初始化数据
      addForm: {
        unionid: "",
        displayUserid: "",
        userid: "",
        locked: "",
        startdate: "",
        nickname: "",
        username: "",
        phoneno: "",
        password: "",
        salt: "",
        fingerpassword1: "",
        fingerpassword2: "",
        fingerpassword3: "",
        fingerpassword4: "",
        pwdtype: "",
        headimgurl: "",
        country: "",
        city: "",
        province: "",
        address: "",
        sex: "",
        enddate: "",
        districtId: "",
        userid: "",
        userAccount: "",
        userPwd: "",
        userName: "",
        userDesc: "",
        officePhoneno: "",
        idCardNo: "",
        email: ""
      },

      editFormVisible: false, //编辑界面是否显示
      //编辑user界面初始化数据
      editForm: {
        unionid: "",
        displayUserid: "",
        userid: "",
        locked: "",
        startdate: "",
        nickname: "",
        username: "",
        phoneno: "",
        password: "",
        salt: "",
        fingerpassword1: "",
        fingerpassword2: "",
        fingerpassword3: "",
        fingerpassword4: "",
        pwdtype: "",
        headimgurl: "",
        country: "",
        city: "",
        province: "",
        address: "",
        sex: "",
        enddate: "",
        districtId: "",
        userid: "",
        userAccount: "",
        userPwd: "",
        userName: "",
        userDesc: "",
        officePhoneno: "",
        idCardNo: "",
        email: ""
      },
      /**begin 自定义属性请在下面加 请加备注**/
      deptTree: {
        //部门树相关参数设置
        deptNodeSelected: {} //部门树被选中的节点数据
      },
      editUserRoleFormVisible: false, //是否显示用户角色界面
      editUserDeptFormVisible: false, //是否显示用户部门关系设置界面
      editUserTpaFormVisible: false, //是否显示第三方开放表
      branch: {}, //选中的机构,
      tableHeight:500,
      userInviteVisible:false,//邀请新成员 
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
      this.pageInfo.count = true;

      this.getUsers();
    },
    handleCurrentChange(pageNum) {
      this.pageInfo.pageNum = pageNum;
      this.getUsers();
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
      this.getUsers();
    },
    searchUsers() {
      this.pageInfo.count = true;
      this.getUsers();
    },
    //获取列表 User sys_user
    getUsers() {
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
      if ( this.deptTree.deptNodeSelected &&
        this.deptTree.deptNodeSelected.deptid &&
        this.deptTree.deptNodeSelected.isBranch != true
      ) {
        params.deptid = this.deptTree.deptNodeSelected.deptid;
      } 
      if (!this.userInfo.isSuperAdmin && !this.userInfo.isPlatformAdmin) {
        params.branchId = this.userInfo.branchId;
        if (params.deptid == null || params.deptid == "") {
          //params.deptid=this.userInfo.deptid;
        }
      }
      console.log("kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk");
      console.log(params);
      this.load.list = true;
      listUser(params)
        .then(res => {
          var tips = res.data.tips;
          if (tips.isOk) {
            this.pageInfo.total = res.data.total;
            this.pageInfo.count = false;
            this.users = res.data.data;
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

    //显示编辑界面 User sys_user
    showEdit: function(index, row) {
      if(row.flowState=='1'){
          this.$notify.error("审核中，不允许操作");
          return;
        }
      this.editFormVisible = true;
      this.editForm = Object.assign({}, row);
    },
    //显示新增界面 User sys_user
    showAdd: function() {
      this.addFormVisible = true;
      //this.addForm=Object.assign({}, this.editForm);
    },
    afterAddSubmit() {
      this.addFormVisible = false;
      this.pageInfo.count = true;
      this.getUsers();
    },
    afterEditSubmit() {
      this.editFormVisible = false;
    },
    //选择行user
    selsChange: function(sels) {
      this.sels = sels;
    },

    branchRowClick: function(row, event, column) {
      if (this.branch == null || row.id != this.branch.id) {
        this.branch = row;
        this.deptTree.deptNodeSelected = {};
        this.searchUsers();
      }
    },
    //删除user
    handleDel: function(index, row) {
      if(row.flowState=='1'){
          this.$notify.error("审核中，不允许重复发审");
          return;
        }
      this.$confirm("确认删除该记录吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          this.load.list = true;
          let params = row;
          delUser(params).then(res => {
            this.load.list = false;
            var tips = res.data.tips;
            if (tips.isOk) {
              this.pageInfo.count = true;
              this.getUsers();
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
    //批量删除user
    batchDel: function() {
      this.$confirm("确认删除选中记录吗？", "提示", {
        type: "warning"
      })
        .then(() => {
          this.load.list = true;
          batchDelUser(this.sels).then(res => {
            this.load.list = false;
            var tips = res.data.tips;
            if (tips.isOk) {
              this.pageInfo.count = true;
              this.getUsers();
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
    /**begin 自定义函数请在下面加**/
    deptTreeCheckChange(data, isSelect, leafSelect) { 
      if(isSelect==false){
        this.deptTree.deptNodeSelected=null;
      }else{
         this.deptTree.deptNodeSelected = data;
      } 
       this.searchUsers(); 
    },
    //显示编辑用户角色界面
    showUserRoleEdit: function(index, row) {
      this.editForm = Object.assign(this.editForm, row);
      this.editUserRoleFormVisible = true;
    },
    //显示编辑用户角色界面
    showUserDeptEdit: function(index, row) {
      if(row.flowState=='1'){
          this.$notify.error("审核中，不允许操作");
          return;
      }
      this.editForm = row;
      this.editUserDeptFormVisible = true;
    },
    //显示第三方开放用户表界面
    showUserTpaEdit: function(index, row) {
      if(row.flowState=='1'){
          this.$notify.error("审核中，不允许操作");
          return;
        }
      this.editForm = row;
      this.editUserTpaFormVisible = true;
    },
    //重置密码
    handleResetPassword: function() {
      if (this.sels.length > 1) {
        this.$notify({
          message: "为安全起见、一次只能重置一个用户的密码",
          type: "error"
        });
      }
      this.load.edit = true;
      this.$prompt("请输入六位以上密码", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /[A-Za-z0-9]{6,}/,
        inputErrorMessage: "密码必须六位以上"
      })
        .then(({ value }) => {
          resetPasswordByAdmin({
            userid: this.sels[0].userid,
            password: md5(value)
          }).then(res => {
            var tips = res.data.tips;
            this.load.edit = false;
            if (tips.isOk) {
              this.$notify({
                message: "密码已重置为" + value,
                type: "success"
              });
            } else {
              this.$notify({
                message: tips.msg,
                type: tips.isOk ? "success" : "error"
              });
            }
          });
        })
        .catch(() => {
          this.$notify({
            type: "info",
            message: "取消输入"
          });
          this.load.edit = false;
        });
    },
    handleDownload() {
      console.log(JSON.stringify(this.users));
      import("@/vendor/Export2Excel").then(excel => {
        const tHeader = [
          "国家",
          "全局唯一编号",
          "城市",
          "指纹2",
          "身份证号码",
          "启用日期",
          "内部用户编号",
          "办公室电话",
          "密码",
          "省份",
          "昵称",
          "头像地址",
          "状态",
          "邮箱",
          "盐值",
          "详细地址",
          "性别",
          "指纹1",
          "移动电话号码",
          "指纹3",
          "到期日期",
          "登录展示使用用户编号",
          "登录账号",
          "密码类型",
          "用户名称"
        ];
        const filterVal = [
          "country",
          "unionid",
          "city",
          "fgTwo",
          "idCardNo",
          "startdate",
          "userid",
          "officePhoneno",
          "password",
          "province",
          "nickname",
          "headimgurl",
          "locked",
          "email",
          "salt",
          "address",
          "sex",
          "fgOne",
          "phoneno",
          "fgThr",
          "enddate",
          "districtId",
          "displayUserid",
          "pwdtype",
          "username"
        ];
        const list = this.users;
        const data = this.formatJson(filterVal, list);
        var filename = "用户管理导出";
        if (this.formDefSelected) {
          filename = this.formDefSelected.formName
            ? this.formDefSelected.formName
            : this.formDefSelected.id + "用户管理导出";
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
      console.log(JSON.stringify(row))
        // // 传过来的参数格式
        if(row.flowState=='1'){
          this.$notify.error("审核中，不允许重复发审");
          return;
        } 
				let extVars={userid:row.userid}
        let jsonExtVars=JSON.stringify(extVars); 

        var currDomain=window.location.protocol+"//"+window.location.host;
        var fullPath=this.$route.fullPath; 
        var bizUrl=currDomain+'/#'+fullPath+'?extVars='+jsonExtVars

				let params={ 
						mainContext:'关于新增用户【'+row.username+"】的审批",
            mainTitle:'关于新增用户【'+row.username+"】的审批",
            bizKey:'user_register',
						bizUrl:bizUrl,
						restUrl:config.getSysBasePath()+"/sys/user/processApprova",
						extVars:extVars,
						flowVars:{
              subscribeTaskEvent:'TASK_COMPLETED,TASK_CREATED',
              userid:row.userid
            },
        }
        let jsonParmas=encodeURIComponent(JSON.stringify(params));//对方要 decodeURIComponent
				this.$router.push({path:'/mdp/workflow/re/procdef/ProcdefListForBizStart',query:{params:jsonParmas}}); 
    },
    handleCommand(command) {
       if(command.type=='sendToProcessApprova'){
         this.sendToProcessApprova(command.row);
       }else if(command.type=='showUserDeptEdit'){
         this.showUserDeptEdit(command.index,command.row);
       }else if(command.type=='showEdit'){
         this.showEdit(command.index,command.row);
       }else if(command.type=='showUserTpaEdit'){
         this.showUserTpaEdit(command.index,command.row);
       }else if(command.type=='handleDel'){
         this.handleDel(command.index,command.row);
       } 
    },
    showInvite(){
      this.userInviteVisible=true;
    }
    /**end 自定义函数请在上面加**/
  }, //end methods
  components: {
    "user-add": UserAdd,
    "user-edit": UserEdit,
    "dept-tree": DeptTree,
    "user-role-edit": UserRoleEdit,
    "user-dept-edit": UserDeptEdit,
    "user-tpa": UserTpa,
    'user-invite':UserInvite,
     
    //在下面添加其它组件
  },
  mounted() {
    this.branch = {
      id: this.userInfo.branchId,
      branchName: this.userInfo.branchName
    };
    this.$nextTick(()=>{  
      this.tableHeight = window.innerHeight - 250;  
    }); 
    /**在下面写其它函数***/
    this.getUsers();
  }
};
</script>

<style lang="scss" scoped>
.avatar-container {
    height: 50px;
    display: flex;
    align-items: center;
    .avatar-wrapper {
        cursor: pointer;
        display: flex;
        flex-direction: row;
        align-items: center;
        .user-avatar {
            height: 34px;
            width: 34px;
            border-radius: 50%;
            margin-right: 12px;
        }
        .username{
            color: #7D7D7D;
            font-size: 14px; 
        }
        .el-icon-caret-bottom {
            font-size: 22px;
        }
    }
}
</style>
