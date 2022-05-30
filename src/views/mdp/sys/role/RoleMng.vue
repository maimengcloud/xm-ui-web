<template>
  <section class="padding">
    <el-row>
      
      <el-switch
        v-model="filters.roletype"
        active-text="公共角色"
        inactive-text="自定义角色"
        active-value="1"
        inactive-value="0"
      ></el-switch>
      <el-input v-model="filters.key" style="width: 20%;" placeholder="名称 模糊查询">
        <template slot="append">
          <el-button type="primary" v-loading="load.list" v-on:click="searchRoles" icon="el-icon-search"></el-button>
        </template>
      </el-input> 
      <el-button type="primary"  @click="showAdd" icon="el-icon-plus">角色</el-button>
      <el-button    @click="handleDownload" icon="el-icon-download">导出数据</el-button>
      <el-button
        icon="el-icon-menu"
        v-loading="load.del"
        @click="showRoleMenuBatch"
        :disabled="this.sels.length===0"
      >设置菜单</el-button>
      <el-button
        type="danger"
        icon="el-icon-delete"
        v-loading="load.del"
        @click="batchDel"
        :disabled="this.sels.length===0"
      > </el-button>
    </el-row>
    <el-row>
      <!--列表 Role 角色管理-->
      <el-table :max-height="tableHeight"
        :data="roles" 
        highlight-current-row
        @row-click="roleRowClick"
        v-loading="load.list"
        border
        @selection-change="selsChange"
        style="width: 100%;"
      >
        <el-table-column sortable type="selection" width="40"></el-table-column> 
        <el-table-column sortable prop="rolename" label="角色名" min-width="80" show-overflow-tooltip> 
          <template slot-scope="scope">
            {{scope.row.roleid}}	- <el-link  @click.stop="showEdit(scope.$index,scope.row)"  type="primary">{{scope.row.rolename}}</el-link>  
          </template> 
        </el-table-column>
        <el-table-column sortable prop="remark" label="备注" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column sortable prop="enabled" label="启用" width="80" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-tag v-if="scope.row.enabled=='1'" type="success">√</el-tag>
            <el-tag v-else type="danger">×</el-tag>
          </template>
        </el-table-column>
        <el-table-column sortable label="操作" width="380">
          <template scope="scope">
            <el-button  @click="showRoleMenu(scope.$index, scope.row)" icon="el-icon-menu">菜单</el-button>
            <el-button  @click="showRoleQx(scope.$index, scope.row)" icon="el-icon-s-operation">权限</el-button>
            <!-- <el-button  @click="showUserRoleList(scope.$index, scope.row)">用户</el-button> -->
            <el-button  @click="showEdit(scope.$index, scope.row)" icon="el-icon-edit"></el-button>
            <el-button type="danger"  @click="handleDel(scope.$index, scope.row)" icon="el-icon-delete"></el-button>
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
    <!--显示某个角色下的所有用户-->
    <el-dialog
      title="角色拥有的用户"
      :visible.sync="userRoleListFormVisible"
      width="60%"
      top="20px"
      :close-on-click-modal="false"
    >
      <user-role-list :role="editForm" :visible="userRoleListFormVisible"></user-role-list>
    </el-dialog>

    <!--编辑 RoleQx 角色权限管理界面-->
    <el-dialog
      title="角色权限设置" fullscreen
      :visible.sync="qxFormVisible"
      width="80%"
      top="5vh"
      :close-on-click-modal="false"
    >
      <role-qx-mng
        :role="editForm"
        :visible="qxFormVisible"
        @cancel="qxFormVisible=false"
        @submit="qxFormVisible=false"
      ></role-qx-mng>
    </el-dialog>

    <!--编辑 RoleQx 角色权限管理界面-->
    <el-dialog
      title="角色菜单设置"
      :visible.sync="roleMenuSetVisible"
      width="50%"
      top="20px"
      :close-on-click-modal="false"
    >
      <role-menu-set
        :batch="roleMenuBatch"
        :roleids="roleids"
        :role="editForm"
        :visible="roleMenuSetVisible"
        @cancel="roleMenuSetVisible=false"
        @submit="roleMenuSetVisible=false"
      ></role-menu-set>
    </el-dialog>
    <!--编辑 Role 角色管理界面-->
    <el-dialog title="编辑" :visible.sync="editFormVisible" width="50%" :close-on-click-modal="false">
      <role-edit :role="editForm" @cancel="editFormVisible=false" @submit="afterEditSubmit"></role-edit>
    </el-dialog>

    <!--新增 Role 角色管理界面-->
    <el-dialog title="新增" :visible.sync="addFormVisible" width="50%" :close-on-click-modal="false">
      <role-add :role="addForm" @cancel="addFormVisible=false" @submit="afterAddSubmit"></role-add>
    </el-dialog>
  </section>
</template>

<script>
import util from "../../../../common/js/util"; //全局公共库
//import Sticky from "@/components/Sticky"; // 粘性header组件
import { listRole, delRole, batchDelRole } from "../../../../api/mdp/sys/role";
import RoleAdd from "./RoleAdd"; //新增界面
import RoleEdit from "./RoleEdit"; //修改界面
import UserRoleList from "../userRole/UserRoleList"; //角色对应的用户查询页面
import RoleQxMng from "../roleQx/RoleQxMng"; //角色对应的用户查询页面
import RoleMenuSet from "../../menu/menuRole/RoleMenuSet"; //角色对应的用户查询页面
import { mapGetters } from "vuex";

export default {
  name:"RoleMng",
  computed: {
    ...mapGetters(["userInfo"])
  },
  data() {
    return {
      filters: {
        key: "",
        roletype: "0"
      },
      roles: [], //查询结果
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
      options: {}, //下拉选择框的所有静态数据 options.sex,options.project

      addFormVisible: false, //新增role界面是否显示
      //新增role界面初始化数据
      addForm: {
        roleid: "",
        rolename: "",
        remark: "",
        roletype: "0",
        rolebeg: "",
        roleend: "",
        crdate: "",
        enabled: "1",
        deptid: "",
        sortOrder: "",
        branchId: ""
      },

      editFormVisible: false, //编辑界面是否显示
      //编辑role界面初始化数据
      editForm: {
        roleid: "",
        rolename: "",
        remark: "",
        roletype: "",
        rolebeg: "",
        roleend: "",
        crdate: "",
        enabled: "",
        deptid: "",
        sortOrder: "",
        branchId: ""
      },
      /**begin 自定义属性请在下面加 请加备注**/

      roleSelected: {}, //角色选中行
      qxFormVisible: false, //是否显示角色管理权限页面，通知界面刷新数据
      userRoleListFormVisible: false, //是否显示角色对应的用户列表
      roleMenuSetVisible: false, //角色包含菜单设置
      roleids: [], //选中的角色编号
      roleMenuBatch: false ,//是否是批量设置多个角色到多个菜单
      tableHeight:500,
      /**end 自定义属性请在上面加 请加备注**/
    };
  }, //end data
  methods: {
    handleSizeChange(pageSize) {
      this.pageInfo.pageSize = pageSize;
      this.pageInfo.count = true;

      this.getRoles();
    },
    handleCurrentChange(pageNum) {
      this.pageInfo.pageNum = pageNum;
      this.getRoles();
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
      this.getRoles();
    },
    searchRoles() {
      this.pageInfo.count = true;
      this.getRoles();
    },
    //获取列表 Role 角色管理
    getRoles() {
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
      if (this.filters.roletype != "") {
        params.roletype = this.filters.roletype;
      }
      //params.deptid=this.userInfo.deptid;
      if (this.filters.roletype != "1") {
        params.branchId = this.userInfo.branchId;
      }
      this.load.list = true;
      listRole(params)
        .then(res => {
          var tips = res.data.tips;
          if (tips.isOk) {
            this.pageInfo.total = res.data.total;
            this.pageInfo.count = false;
            this.roles = res.data.data;
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

    //显示编辑界面 Role 角色管理
    showEdit: function(index, row) {
      this.editFormVisible = true;
      this.editForm = Object.assign({}, row);
    },
    //显示新增界面 Role 角色管理
    showAdd: function() {
      this.addFormVisible = true;
      //this.addForm=Object.assign({}, this.editForm);
    },
    afterAddSubmit() {
      this.addFormVisible = false;
      this.pageInfo.count = true;
      this.getRoles();
    },
    afterEditSubmit() {
      this.editFormVisible = false;
    },
    //选择行role
    selsChange: function(sels) {
      this.sels = sels;
    },
    //删除role
    handleDel: function(index, row) {
      this.$confirm("确认删除该记录吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          this.load.list = true;
          let params = row;
          delRole(params).then(res => {
            this.load.list = false;
            var tips = res.data.tips;
            if (tips.isOk) {
              this.pageInfo.count = true;
              this.getRoles();
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
    //批量删除role
    batchDel: function() {
      this.$confirm("确认删除选中记录吗？", "提示", {
        type: "warning"
      })
        .then(() => {
          this.load.list = true;
          batchDelRole(this.sels).then(res => {
            this.load.list = false;
            var tips = res.data.tips;
            if (tips.isOk) {
              this.pageInfo.count = true;
              this.getRoles();
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
    roleRowClick(row, event, column) {
      this.editForm = row;
    },
    //显示设置权限界面
    showRoleQx: function(index, row) {
      this.editForm = row;
      this.qxFormVisible = true;
    },
    //显示角色拥有的用户
    showUserRoleList: function(index, row) {
      this.editForm = row;
      this.userRoleListFormVisible = true;
    },

    showRoleMenu: function(index, row) {
      this.roleMenuBatch = false;
      this.editForm = row;
      this.roleids = [row.roleid];
      this.roleMenuSetVisible = true;
    },
    showRoleMenuBatch: function() {
      this.roleMenuBatch = true;
      this.roleids = this.sels.map(i => i.roleid);
      this.roleMenuSetVisible = true;
    },
    handleDownload() { 
      import("@/vendor/Export2Excel").then(excel => {
        const tHeader = [
          "归属机构号",
          "结束时间",
          "角色编码",
          "角色名",
          "角色排序",
          "创建时间",
          "机构编号",
          "备注",
          "角色类型",
          "启用",
          "开始时间"
        ];
        const filterVal = [
          "branchId",
          "roleend",
          "roleid",
          "rolename",
          "sortOrder",
          "crdate",
          "deptid",
          "remark",
          "roletype",
          "enabled",
          "rolebeg"
        ];
        const list = this.roles;
        const data = this.formatJson(filterVal, list);
        var filename = "角色管理导出";
        if (this.formDefSelected) {
          filename = this.formDefSelected.formName
            ? this.formDefSelected.formName
            : this.formDefSelected.id + "角色管理导出";
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
    }
    /**end 自定义函数请在上面加**/
  }, //end methods
  components: {
    "role-add": RoleAdd,
    "role-edit": RoleEdit,
    //在下面添加其它组件
    "user-role-list": UserRoleList,
    "role-qx-mng": RoleQxMng, 
    RoleMenuSet
  },
  mounted() {
    this.getRoles();
    this.$nextTick(()=>{  
      this.tableHeight = window.innerHeight - 250;  
    }); 
  }
};
</script>

<style scoped>
</style>