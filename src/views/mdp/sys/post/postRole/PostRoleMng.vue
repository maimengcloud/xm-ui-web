<template>
  <section>
    <el-row>
      <el-input v-model="filters.key" style="width: 20%;" placeholder="模糊查询">
        <template slot="append">
          <el-button 
            v-loading="load.list"
            :disabled="load.list==true"
            v-on:click="searchPostRoles"
          >查询</el-button> 
        </template>
      </el-input>
      <el-button type="primary" @click="showRoleSelect" icon="el-icon-left">加入更多角色</el-button> 
      <el-button
        type="primary"
        v-loading="load.del"
        @click="batchDel"
        :disabled="this.sels.length===0 || load.del==true"
        icon="el-icon-right"
      >移出岗位</el-button>
    </el-row>
    <el-row style="padding-top:10px;">
      <!--列表 PostRole 岗位角色关系表-->
      <el-table
        :data="postRoles"
        highlight-current-row
        v-loading="load.list"
        border
        @selection-change="selsChange"
        @row-click="rowClick"
        style="width: 100%;"
        :max-height="tableHeight"
      >
        <el-table-column sortable type="selection" width="40"></el-table-column>
        <el-table-column sortable type="index" width="40"></el-table-column>
        <el-table-column
          sortable
          prop="rolename"
          label="已加入岗位的角色"
          min-width="80"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column sortable label="操作" width="160" fixed="right" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button type="text" @click="handleDel(scope.row,scope.$index)" icon="el-icon-right">移出岗位</el-button>
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

      <!--编辑 PostRole 岗位角色关系表界面-->
      <el-dialog
        title="编辑岗位角色关系表"
        :visible.sync="editFormVisible"
        width="50%"
        :close-on-click-modal="false"
        append-to-body
      >
        <post-role-edit
          :post-role="editForm"
          :visible="editFormVisible"
          @cancel="editFormVisible=false"
          @submit="afterEditSubmit"
        ></post-role-edit>
      </el-dialog>

      <!--新增 PostRole 岗位角色关系表界面-->
      <el-dialog
        title="新增岗位角色关系表"
        :visible.sync="addFormVisible"
        width="50%"
        :close-on-click-modal="false"
        append-to-body
      >
        <post-role-add
          :post-role="addForm"
          :visible="addFormVisible"
          @cancel="addFormVisible=false"
          @submit="afterAddSubmit"
        ></post-role-add>
      </el-dialog>
      <!--新增 PostRole 岗位角色关系表界面-->
      <el-dialog
        title="选择未加入岗位的角色"
        :visible.sync="roleSelectVisible"
        width="50%"
        :close-on-click-modal="false"
        append-to-body
      >
        <role-select
          :postId="postId"
          :visible="roleSelectVisible"
          @cancel="roleSelectVisible=false"
          @select="afterConfirmRoleSelect"
        ></role-select>
      </el-dialog>
    </el-row>
  </section>
</template>

<script>
import util from "@/common/js/util"; //全局公共库
//import Sticky from "@/components/Sticky"; // 粘性header组件
//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
import {
  listPostRole,
  delPostRole,
  batchDelPostRole,
  batchAddPostRole
} from "@/api/mdp/sys/post/postRole";
import PostRoleAdd from "./PostRoleAdd"; //新增界面
import PostRoleEdit from "./PostRoleEdit"; //修改界面
import RoleSelect from "./RoleSelect"; //选择角色界面
import { mapGetters } from "vuex";

export default {
  props: ["postId", "visible"],
  watch: {
    visible: function(visible) {
      if (visible == true) {
        this.searchPostRoles();
      }
    }
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  data() {
    return {
      filters: {
        key: ""
      },
      postRoles: [], //查询结果
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
      options: {}, //下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]}

      addFormVisible: false, //新增postRole界面是否显示
      //新增postRole界面初始化数据
      addForm: {
        id: "",
        postId: "",
        roleid: ""
      },
      roleSelectVisible: false, //是否显示选择角色界面
      editFormVisible: false, //编辑界面是否显示
      //编辑postRole界面初始化数据
      editForm: {
        id: "",
        postId: "",
        roleid: ""
      },
			tableHeight:500,
      /**begin 自定义属性请在下面加 请加备注**/

      /**end 自定义属性请在上面加 请加备注**/
    };
  }, //end data
  methods: {
    handleSizeChange(pageSize) {
      this.pageInfo.pageSize = pageSize;
      this.getPostRoles();
    },
    handleCurrentChange(pageNum) {
      this.pageInfo.pageNum = pageNum;
      this.getPostRoles();
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
      this.getPostRoles();
    },
    searchPostRoles() {
      this.pageInfo.count = true;
      this.getPostRoles();
    },
    //获取列表 PostRole 岗位角色关系表
    getPostRoles() {
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
        //params.key="%"+this.filters.key+"%"
      } else {
        //params.xxx=xxxxx
      }
      params.postId = this.postId;
      this.load.list = true;
      listPostRole(params)
        .then(res => {
          var tips = res.data.tips;
          if (tips.isOk) {
            this.pageInfo.total = res.data.total;
            this.pageInfo.count = false;
            this.postRoles = res.data.data;
          } else {
            this.$notify({ message: tips.msg, type: "error" });
          }
          this.load.list = false;
        })
        .catch(err => (this.load.list = false));
    },

    //显示编辑界面 PostRole 岗位角色关系表
    showEdit: function(row, index) {
      this.editFormVisible = true;
      this.editForm = Object.assign({}, row);
    },
    //显示新增界面 PostRole 岗位角色关系表
    showAdd: function() {
      this.addFormVisible = true;
      //this.addForm=Object.assign({}, this.editForm);
    },
    //显示选择角色界面
    showRoleSelect: function() {
      this.roleSelectVisible = true;
      //this.addForm=Object.assign({}, this.editForm);
    },
    afterAddSubmit() {
      this.addFormVisible = false;
      this.pageInfo.count = true;
      this.getPostRoles();
    },
    afterEditSubmit() {
      this.editFormVisible = false;
    },
    //选择行postRole
    selsChange: function(sels) {
      this.sels = sels;
    },
    //删除postRole
    handleDel: function(row, index) {
      this.$confirm("确认删除该记录吗?", "提示", {
        type: "warning"
      }).then(() => {
        this.load.del = true;
        let params = row;
        delPostRole(params)
          .then(res => {
            this.load.del = false;
            var tips = res.data.tips;
            if (tips.isOk) {
              this.pageInfo.count = true;
              this.getPostRoles();
            }
            this.$notify({
              message: tips.msg,
              type: tips.isOk ? "success" : "error"
            });
          })
          .catch(err => (this.load.del = false));
      });
    },
    //批量删除postRole
    batchDel: function() {
      this.$confirm("确认删除选中记录吗？", "提示", {
        type: "warning"
      }).then(() => {
        this.load.del = true;
        batchDelPostRole(this.sels)
          .then(res => {
            this.load.del = false;
            var tips = res.data.tips;
            if (tips.isOk) {
              this.pageInfo.count = true;
              this.getPostRoles();
            }
            this.$notify({
              message: tips.msg,
              type: tips.isOk ? "success" : "error"
            });
          })
          .catch(err => (this.load.del = false));
      });
    },
    rowClick: function(row, event, column) {
      this.$emit("row-click", row, event, column); //  @row-click="rowClick"
    },
    /**begin 自定义函数请在下面加**/
    afterConfirmRoleSelect: function(roles) {
      console.log("xxxxxxxxxxxxxxxxxxxxxxxx");
      console.log(roles);
      this.roleSelectVisible = false;
      var postRoles = [];
      roles.forEach(role => {
        let postRole = { roleid: role.roleid, postId: this.postId };
        postRoles.push(postRole);
      });
      batchAddPostRole(postRoles).then(res => {
        var tips = res.data.tips;
        if (tips.isOk) {
          this.searchPostRoles();
        }
        this.$notify({
          message: tips.msg,
          type: tips.isOk ? "success" : "error"
        });
      });
    },

    /**end 自定义函数请在上面加**/
  }, //end methods
  components: {
    "role-select": RoleSelect,
    "post-role-add": PostRoleAdd,
    "post-role-edit": PostRoleEdit,
     
    //在下面添加其它组件
  },
  mounted() {
    this.$nextTick(() => {
      this.tableHeight = window.innerHeight - 250;   
      this.getPostRoles();
    });
  }
};
</script>

<style scoped>
</style>