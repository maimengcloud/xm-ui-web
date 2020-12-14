<template>
  <section>
    <el-row>
      <!--编辑界面 UserDept 用户部门关系表-->
      <el-col :span="6" style=" overflow-x:auto; height:550px;">
        <dept-tree
          v-loading="load.list"
          :branch-id="branch.id"
          :checked-keys="defaultDeptids"
          default-expand-all
          show-checkbox
          multiple
          :expand-on-click-node="false"
          ref="nodeTree"
          @check-change="deptTreeCheckChange"
          @branch-row-click="branchChange"
        ></dept-tree>
      </el-col>
      <el-col :span="18">
        <el-form
          :model="editForm"
          label-width="160px"
          label-position="left"
          v-loading="load.list"
          :rules="editFormRules"
          ref="editForm"
        >
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>
                <font style="color:blue;">{{user.username}}</font>加入的部门：
                <el-tag v-for="item in deptNodes " :key="item.deptid">{{item.deptName}}</el-tag>
                {{deptNodes.length>0?'':'还没有加入任何部门'}}
                <font style="color:green;">
                  <i class="el-icon-caret-left"></i>先选部门
                </font>
                <i class="el-icon-caret-bottom"></i>再选
                <font style="color:red;">岗位</font>
              </span>
              <el-tooltip
                class="item"
                effect="dark"
                content="如果选中的部门没有岗位，请先到【部门管理  -> 岗位设置 】将岗位与部门关联"
                placement="top"
              >
                <i class="el-icon-question"></i>
              </el-tooltip>
            </div>
            <el-form-item
              v-for="item in allDeptDeptPosts"
              :label=" item.deptName "
              style="border-bottom:1px dashed #00F;margin-left:10px;"
              prop="deptid"
              :key="item.deptid"
            >
              <el-checkbox
                v-for="deptPost in item.deptPosts"
                v-model="deptPost.checked"
                :true-label="'1'"
                :false-label="'0'"
                :key="deptPost.postId"
              >{{deptPost.postName}}</el-checkbox>
            </el-form-item>
            <el-form-item
              v-for="item in noPostDepts"
              :label=" item.deptName "
              style="border-bottom:1px dashed #00F;margin-left:10px;"
              prop="deptid"
              :key="item.deptid"
            >
              <font style="color:red;">该部门还没设置岗位</font>
              <el-button type="text" class="el-icon-right" @click="goToSetDeptPostPage">>去设置</el-button>
            </el-form-item>
          </el-card>
          <h5></h5>
          <el-form-item>
            <el-col :span="4" :offset="8">
              <el-button @click.native="handleCancel">取消</el-button>
            </el-col>
            <el-col :span="4">
              <el-button v-loading="load.edit" type="primary" @click.native="editSubmit">提交</el-button>
            </el-col>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </section>
</template>

<script>
import util from "@/common/js/util"; //全局公共库
import {
  editUserDept,
  listUserDept,
  batchEditUserDept
} from "@/api/mdp/sys/userDept";
import { listDept } from "@/api/mdp/sys/dept";
import DeptTree from "../dept/DeptTree.vue"; //下拉框数据查询
import { listBranch } from "@/api/mdp/sys/branch";
import { mapGetters } from "vuex";
import {
  listDeptPost,
  delDeptPost,
  batchDelDeptPost,
  batchAddDeptPost
} from "@/api/mdp/sys/post/deptPost";
import { listDeptPostUserWithDeptPosts } from "@/api/mdp/sys/post/deptPostUser";

export default {
  computed: {
    ...mapGetters(["workShop"])
  },
  props: ["userDept", "visible", "user", "branch"],
  watch: {
    visible: function(visible) {
      if (visible == true) {
        this.allDeptDeptPosts = [];
        this.userDeptids = [];
        this.deptNodes = [];
        this.noPostDepts = [];
        this.defaultDeptids = [];
        if (this.$refs.nodeTree.branch != null) {
          console.log("===========1111=========");
          this.getUserDepts(this.$refs.nodeTree.branch);
        } else {
          console.log("===========2222========="+JSON.stringify(this.branch));
          this.getUserDepts(this.branch);
        }

        //this.load.list=false;
      }
    }
  },
  data() {
    return {
      options: {}, //下拉选择框的所有静态数据
      load: { list: false, edit: false, del: false, add: false }, //查询中...
      editFormRules: {
        userid: [
          { required: true, message: "用户编号不能为空", trigger: "blur" }
        ]
      },
      //编辑界面数据  UserDept 用户部门关系表
      editForm: {
        userid: "",
        deptid: "",
        enabled: "",
        seq: "",
        branchId: "",
        id: ""
      },
      /**begin 在下面加自定义属性,记得补上面的一个逗号**/
      deptNodes: [], //deptid:'',deptName:'',pdeptid:'',deptType:'',state:'',manager:'',leader:'',shortName:'',displayDeptid:'',orgType:'',managerName:'',leaderName:''
      userDeptids: [], //选种的部门编号列表
      userDepts: [],
      loadingDeptids: [], //正在加载的机构
      defaultDeptids: [], //第一次加载选中的机构
      allDeptDeptPosts: [], //部门岗位关系[{deptid:'',deptName:'',deptPosts:[{deptid:'',postId:'',postName:'',checked:''}]}]
      noPostDepts: []
      /**end 在上面加自定义属性**/
    }; //end return
  }, //end data

  methods: {
    // 取消按钮点击 父组件监听@cancel="editFormVisible=false" 监听
    handleCancel: function() {
      this.$emit("cancel");
    },
    branchChange: function(branch) {
      this.allDeptDeptPosts = [];
      this.getUserDepts(branch);
    },
    //编辑提交UserDept 用户部门关系表父组件监听@submit="afterEditSubmit"
    editSubmit: function() {
      if (this.user.userid == "") {
        this.$message.error("用户不能为空");
        return;
      }
      this.load.edit = true;
      var msg = "确认提交吗？";
      if (this.deptNodes.length == 0) {
        msg = this.user.username + "不在任何部门，将从公司中删除该用户," + msg;
      }
      this.$confirm(msg, "提示", {})
        .then(() => {
          console.log("xxxxxxxxxxxxxx");
          let delDeptids = [];
          let deptids = this.$refs.nodeTree.$refs.deptTree.getCheckedKeys();
          this.userDepts.forEach(ud => {
            if (!deptids.some(deptid => deptid == ud.deptid)) {
              delDeptids.push(ud.deptid);
            }
          });
          let addDeptPostUsers = [];
          let delDeptPostUsers = [];
          this.allDeptDeptPosts.forEach(i => {
            i.deptPosts.forEach(k => {
              if (k.checked == "1") {
                k.userid = this.user.userid;
                addDeptPostUsers.push(k);
              } else if (k.checked == "0" && k.id != "") {
                delDeptPostUsers.push(k);
              }
            });
          });
          console.log("ffffffffffffffffffffffffffffffffffffffffffffffffff");

          let branch = this.$refs.nodeTree.branch;
          let params = {
            branchId: branch == null ? this.branch.id : branch.id,
            userid: this.user.userid,
            deptids: deptids,
            delDeptids: delDeptids,
            delDeptPostUsers: delDeptPostUsers,
            addDeptPostUsers: addDeptPostUsers
          };
          batchEditUserDept(params)
            .then(res => {
              this.load.edit = false;
              var tips = res.data.tips;
              if (tips.isOk) {
                this.$refs["editForm"].resetFields();
                this.$emit("submit"); //  @submit="afterEditSubmit"
              }
              this.$message({
                message: tips.msg,
                type: tips.isOk ? "success" : "error"
              });
            })
            .catch(e => {
              console.log(e);
              this.load.edit = false;
            });
        })
        .catch(e => {
          console.log(e);
          this.load.edit = false;
        });
    },
    /**begin 在下面加自定义方法,记得补上面的一个逗号**/
    getUserDepts(branch) {
      this.load.list = true;
      let params = { userid: this.user.userid };
      params.branchId = branch.id;
      console.log("params==="+JSON.stringify(params));
      listUserDept(params)
        .then(res => {
          this.load.list = false;
          let uds = res.data.data;
          this.userDepts = uds;
          this.userDeptids = uds.map(i => i.deptid);
          this.defaultDeptids = this.userDeptids;
          this.getDeptPostUserWithDeptPosts(this.defaultDeptids);
        })
        .catch(() => (this.load.list = false));
    },
    deptTreeCheckChange: function(data, checked, indeterminate) {
      console.log(
        "deptTreeCheckChangedeptTreeCheckChangedeptTreeCheckChangedeptTreeCheckChangedeptTreeCheckChange"
      );
      console.log(data);
      let deptids = this.$refs.nodeTree.$refs.deptTree.getCheckedKeys();
      this.deptNodes = this.$refs.nodeTree.$refs.deptTree.getCheckedNodes(
        false
      );
      console.log("deptNodes" + this.deptNodes);
      this.getDeptPostUserWithDeptPosts(deptids);
    },
    getDeptPostUserWithDeptPosts: function(deptids) {
      this.load.list = true;
      let params = { userid: this.user.userid, deptids: deptids };
      this.allDeptDeptPosts = [];
      listDeptPostUserWithDeptPosts(params)
        .then(res => {
          this.deptNodes = this.$refs.nodeTree.$refs.deptTree.getCheckedNodes(
            false
          );
          this.load.list = false;
          let allDeptDeptPosts = [];
          let deptPosts = res.data.deptPosts;
          let deptPostUsers = res.data.deptPostUsers;
          deptPosts.forEach(i => {
            i.id = "";
            i.checked = "0";
            if (
              deptPostUsers.some(k => {
                if (k.deptid == i.deptid && k.postId == i.postId) {
                  i.id = k.id;
                  return true;
                } else {
                  return false;
                }
              })
            ) {
              i.checked = "1";
            }
          });
          deptPosts.forEach(i => {
            if (allDeptDeptPosts.some(k => k.deptid == i.deptid)) {
              allDeptDeptPosts.forEach(j => {
                if (j.deptid == i.deptid) {
                  j.deptPosts.push(i);
                }
              });
            } else {
              allDeptDeptPosts.push({
                deptid: i.deptid,
                deptName: i.deptName,
                deptPosts: [i]
              });
            }
          });
          this.allDeptDeptPosts = allDeptDeptPosts;
          this.noPostDepts = this.deptNodes.filter(
            i => !this.allDeptDeptPosts.some(k => k.deptid == i.deptid)
          );
        })
        .catch(e => {
          this.load.list = false;
        });
    },
    goToSetDeptPostPage: function() {
      this.$router.push({ path: "/mdp/sys/dept/DeptMng" });
    }
    /**end 在上面加自定义方法**/
  }, //end method
  components: {
    //在下面添加其它组件 'user-dept-edit':UserDeptEdit
    DeptTree
  },
  mounted() {
    this.editForm = Object.assign(this.editForm, this.userDept);
    this.getUserDepts(this.branch);
  }
};
</script>

<style scoped>
</style>