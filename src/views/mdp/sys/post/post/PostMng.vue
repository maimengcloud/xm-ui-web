<template>
  <section>
    <el-row  class="app-container">
      <el-input v-model="filters.key" style="width: 20%;" placeholder="模糊查询">
        <template slot="append">
          <el-button
            type="primary"
            v-loading="load.list"
            :disabled="load.list==true"
            v-on:click="searchPosts"
            icon="el-icon-search"
          ></el-button> 
        </template>
      </el-input>
      <el-button type="primary" @click="showAdd" icon="el-icon-plus">岗位</el-button>
      <el-button 
        @click="handleDownload"
        icon="el-icon-download"
      >导出数据</el-button>
      
      <el-button 
        v-loading="deptSelectVisible"
        @click="deptSelectVisible=true"
        :disabled="this.sels.length !=1 "
        icon="el-icon-setting"
      >设置到部门</el-button>
      
      <el-button
        type="danger"
        v-loading="load.del"
        @click="batchDel"
        icon="el-icon-delete"
        :disabled="this.sels.length===0 || load.del==true"
      > </el-button>
    </el-row>
    <el-row class="app-container">
      <!--列表 Post 岗位管理-->
      <el-table :max-height="tableHeight"
        :data="posts"
        highlight-current-row
        v-loading="load.list"
        border
        @selection-change="selsChange"
        @row-click="rowClick"
        style="width: 100%;"
      >
        <el-table-column sortable type="selection" width="40"></el-table-column>
        <el-table-column sortable type="index" width="40"></el-table-column> 
        <el-table-column sortable prop="postName" label="岗位名称" min-width="250" show-overflow-tooltip>
          
          <template slot-scope="scope">
            {{scope.row.id}}	- <el-link  @click.stop="showEdit(scope.row,scope.$index)"  type="primary">{{scope.row.postName}}</el-link>  
          </template>

        </el-table-column>
        <el-table-column
          sortable
          prop="postLvl"
          label="级别"
          min-width="80"
          show-overflow-tooltip
          :formatter="formatterPostLvl"
        ></el-table-column>
        <el-table-column
          sortable
          prop="postType"
          label="类型"
          min-width="80"
          show-overflow-tooltip
          :formatter="formatterPostType"
        ></el-table-column>
        <el-table-column sortable prop="cdate" label="创建日期" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column sortable prop="remark" label="备注" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column sortable label="操作" width="300" fixed="right">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="showPostRoleMng( scope.row,scope.$index)" icon="el-icon-setting">角色</el-button>
            <el-button size="mini" @click="showDeptPostUserMng( scope.row,scope.$index)" icon="el-icon-user">用户</el-button>
            <el-button size="mini" @click="showEdit( scope.row,scope.$index)" icon="el-icon-edit"></el-button>
            <el-button size="mini"  type="danger" @click="handleDel(scope.row,scope.$index)" icon="el-icon-delete"></el-button>
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

      <!--编辑 Post 岗位管理界面-->
      <el-dialog
        title="编辑岗位"
        :visible.sync="editFormVisible"
        width="50%"
        :close-on-click-modal="false"
      >
        <post-edit
          :post="editForm"
          :visible="editFormVisible"
          @cancel="editFormVisible=false"
          @submit="afterEditSubmit"
        ></post-edit>
      </el-dialog>
       <!--编辑 Post 岗位管理界面-->
      <el-dialog
        title="选中部门"
        :visible.sync="deptSelectVisible"
        width="50%"
        :close-on-click-modal="false"
      >
        <dept-select 
          :visible="deptSelectVisible" 
          :multiple="1"
          @select="deptSelectConfirm"
        ></dept-select>
      </el-dialog>
      <!--dept-post-user-mng 部门岗位用户关系表-->
      <el-dialog
        title="查看岗位拥有的用户"
        :visible.sync="deptPostUserMngVisible"
        top="2vh"
        width="70%"
        :close-on-click-modal="false"
      >
        <dept-post-user-mng
          :post="editForm"
          :visible="deptPostUserMngVisible"
          @cancel="deptPostUserMngVisible=false"
          @submit="afterEditSubmit"
        ></dept-post-user-mng>
      </el-dialog>
      <!--新增 Post 岗位管理界面-->
      <el-dialog
        title="新增岗位"
        :visible.sync="addFormVisible"
        width="50%"
        :close-on-click-modal="false"
      >
        <post-add
          :post="addForm"
          :visible="addFormVisible"
          @cancel="addFormVisible=false"
          @submit="afterAddSubmit"
        ></post-add>
      </el-dialog>

      <!--编辑岗位角色关系界面-->
      <el-dialog
        title="维护岗位角色关系"
        :visible.sync="postRoleMngVisible"
        width="50%"
        :close-on-click-modal="false"
      >
        <post-role-mng
          :postId="editForm.id"
          :visible="postRoleMngVisible"
          @cancel="postRoleMngVisible=false"
        ></post-role-mng>
      </el-dialog>
    </el-row>
  </section>
</template>

<script>
import util from "@/common/js/util"; //全局公共库
//import Sticky from "@/components/Sticky"; // 粘性header组件
import { listOption } from "@/api/mdp/meta/itemOption"; //下拉框数据查询
import { listPost, delPost, batchDelPost } from "@/api/mdp/sys/post/post";
import {  batchSetDeptsToPost } from '@/api/mdp/sys/post/deptPost';
import PostAdd from "./PostAdd"; //新增界面
import PostEdit from "./PostEdit"; //修改界面
import PostRoleMng from "../postRole/PostRoleMng"; //新增界面
import DeptPostUserMng from "../deptPostUser/DeptPostUserMng"; //新增界面
import DeptSelect from "../../dept/DeptSelect"; //新增界面
import { mapGetters } from "vuex";

export default {
  
  name:"PostMng",
  computed: {
    ...mapGetters(["userInfo"])
  },
  data() {
    return {
      filters: {
        key: ""
      },
      posts: [], //查询结果
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

      addFormVisible: false, //新增post界面是否显示
      //新增post界面初始化数据
      addForm: {
        id: "",
        postName: "",
        remark: "",
        branchId: "",
        cdate: "",
        postLvl: "",
        postType: ""
      },
      postRoleMngVisible: false, //显示岗位角色关系界面
      editFormVisible: false, //编辑界面是否显示
      deptPostUserMngVisible: false, //岗位用户表
      //编辑post界面初始化数据
      editForm: {
        id: "",
        postName: "",
        remark: "",
        branchId: "",
        cdate: "",
        postLvl: "",
        postType: ""
      },
      deptSelectVisible:false,//选中部门,
			tableHeight:500,
      /**begin 自定义属性请在下面加 请加备注**/

      /**end 自定义属性请在上面加 请加备注**/
    };
  }, //end data
  methods: {
    handleSizeChange(pageSize) {
      this.pageInfo.pageSize = pageSize;
      this.getPosts();
    },
    handleCurrentChange(pageNum) {
      this.pageInfo.pageNum = pageNum;
      this.getPosts();
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
      this.getPosts();
    },
    searchPosts() {
      this.pageInfo.count = true;
      this.getPosts();
    },
    //获取列表 Post 岗位管理
    getPosts() {
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
      } else {
        //params.xxx=xxxxx
      }
      this.load.list = true;
      params.branchId = this.userInfo.branchId;
      listPost(params)
        .then(res => {
          var tips = res.data.tips;
          if (tips.isOk) {
            this.pageInfo.total = res.data.total;
            this.pageInfo.count = false;
            this.posts = res.data.data;
          } else {
            this.$notify({ message: tips.msg, type: "error" });
          }
          this.load.list = false;
        })
        .catch(err => (this.load.list = false));
    },

    //显示编辑界面 Post 岗位管理
    showEdit: function(row, index) {
      this.editFormVisible = true;
      this.editForm = Object.assign({}, row);
    },
    //显示编辑界面 岗位角色关系维护界面
    showPostRoleMng: function(row, index) {
      this.postRoleMngVisible = true;
      this.editForm = Object.assign({}, row);
    },
    //显示编辑界面 岗位角色关系维护界面
    showDeptPostUserMng: function(row, index) {
      this.deptPostUserMngVisible = true;
      this.editForm = Object.assign({}, row);
    },
    //显示新增界面 Post 岗位
    showAdd: function() {
      this.addFormVisible = true;
      //this.addForm=Object.assign({}, this.editForm);
    },
    afterAddSubmit() {
      this.addFormVisible = false;
      this.pageInfo.count = true;
      this.getPosts();
    },
    afterEditSubmit() {
      this.editFormVisible = false;
    },
    //选择行post
    selsChange: function(sels) {
      this.sels = sels;
    },
    //删除post
    handleDel: function(row, index) {
      this.$confirm("确认删除该记录吗?", "提示", {
        type: "warning"
      }).then(() => {
        this.load.del = true;
        let params = row;
        delPost(params)
          .then(res => {
            this.load.del = false;
            var tips = res.data.tips;
            if (tips.isOk) {
              this.pageInfo.count = true;
              this.getPosts();
            }
            this.$notify({
              message: tips.msg,
              type: tips.isOk ? "success" : "error"
            });
          })
          .catch(err => (this.load.del = false));
      });
    },
    //批量删除post
    batchDel: function() {
      this.$confirm("确认删除选中记录吗？", "提示", {
        type: "warning"
      }).then(() => {
        this.load.del = true;
        batchDelPost(this.sels)
          .then(res => {
            this.load.del = false;
            var tips = res.data.tips;
            if (tips.isOk) {
              this.pageInfo.count = true;
              this.getPosts();
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
    formatterPostLvl: function(row, column, cellValue, index) {
      if (this.options.postLvl) {
        let postL = this.options.postLvl.filter(
          i => i.optionValue == cellValue
        );
        if (postL && postL.length > 0) {
          return postL[0].optionName;
        }
      }
      return cellValue;
    },
    formatterPostType: function(row, column, cellValue, index) {
      if (this.options.postType) {
        let postT = this.options.postType.filter(
          i => i.optionValue == cellValue
        );
        if (postT && postT.length > 0) {
          return postT[0].optionName;
        }
      }
      return cellValue;
    },
    handleDownload() {
      import("@/vendor/Export2Excel").then(excel => {
        const tHeader = [
          "归属机构号",
          "创建日期",
          "岗位类型引用字典",
          "岗位名称",
          "备注",
          "主键",
          "岗位级别引用字典"
        ];
        const filterVal = [
          "branchId",
          "cdate",
          "postType",
          "postName",
          "remark",
          "id",
          "postLvl"
        ];
        const list = this.posts;
        const data = this.formatJson(filterVal, list);
        var filename = "岗位管理导出";
        if (this.formDefSelected) {
          filename = this.formDefSelected.formName
            ? this.formDefSelected.formName
            : this.formDefSelected.id + "岗位管理导出";
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
    deptSelectConfirm(depts){
     
      if(depts==null || depts.length==0){
        this.$notify({
              message: '部门不能为空',
              type: "error"
            });
            return;
        //this.deptSelectVisible=false;
      }else{
         
         var params={
           branchId:this.userInfo.branchId,
           postId:this.sels[0].id,
           deptids:depts.map(d=>d.deptid)
         }
        batchSetDeptsToPost(params).then(res=>{
          var tips=res.data.tips; 
            this.$notify({
              message: tips.msg,
              type: tips.isOk ? "success" : "error"
            });
            this.deptSelectVisible=false;
        }).catch(err=>this.deptSelectVisible=false)
      }
    }

    /**end 自定义函数请在上面加**/
  }, //end methods
  components: {
    "post-role-mng": PostRoleMng,
    "post-add": PostAdd,
    "post-edit": PostEdit,
    DeptPostUserMng,DeptSelect
     
    //在下面添加其它组件
  },
  mounted() {
    listOption([
      { categoryId: "all", itemCode: "postLvl" },
      { categoryId: "all", itemCode: "postType" }
    ]).then(res => {
      this.options = res.data.data;
    }); 
    this.$nextTick(() => {
      this.getPosts();
      this.tableHeight = window.innerHeight - 250;  
    });
  }
};
</script>

<style scoped>
</style>