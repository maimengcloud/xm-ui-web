<template>
  <section>
    <el-row>
      <el-row class="app-container">
        <el-input
          v-model="filters.key"
          style="width: 40%"
          placeholder="名字 备注 模糊查询"
        ></el-input>
        <el-button
          type="primary"
          v-loading="load.list"
          v-on:click="searchAppMdpDefs"
          icon="el-icon-search"
        ></el-button>
        <el-button type="primary" @click="showAdd">+应用</el-button>
        <el-button
          type="danger"
          @click="batchDel"
          :disabled="this.sels.length === 0"
          >删除</el-button
        >
      </el-row>
      <el-row class="app-container">
        <el-col :span="4" v-for="(o, index) in appMdpDefs" :key="o.id">
          <el-card :body-style="{ padding: '0px' }">
            <div
              style="height: 150px; width: 100%; display: block"
              class="avatar-uploader"
              v-on:click="selectImg(o)"
            >
              <div class="blank" v-show="o.show">
                <div class="black_blank"></div>
                <div class="select_blank"></div>
              </div>
              <el-tooltip
                class="item"
                effect="light"
                :content="
                  (o.remark == null ? '' : o.remark) + ' 创建时间 ' + o.cdate
                "
                placement="left-start"
              >
                <img v-if="o.logoUrl" :src="converUrl(o)" class="appMdpDef" />
                <img
                  v-else
                  src="../../../../assets/image/noImg.png"
                  class="appMdpDef"
                />
              </el-tooltip>
            </div>
            <div style="padding: 14px">
              <span>{{
                o.name == null || o.name == "" ? "无名字" : o.name
              }}</span>
              <div class="bottom clearfix">
                <el-button
                  type="text"
                  class="button"
                  @click="showEdit(o, index)"
                  >修改
                </el-button>
                <el-button
                  type="text"
                  class="button"
                  @click="handlePay(o, index)"
                  >支付授权
                </el-button>
                <el-button
                  type="text"
                  class="button"
                  @click="handleAuth(o, index)"
                  >登录授权</el-button
                >
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
	  <el-row>
      <el-pagination
        layout="total, sizes, prev, pager, next"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        :page-sizes="[10, 20, 50, 100, 500]"
        :current-page="pageInfo.pageNum"
        :page-size="pageInfo.pageSize"
        :total="pageInfo.total"
        style="float: right"
      ></el-pagination>
	  </el-row>
    </el-row>
    <el-drawer
      title="登录授权"
      :visible.sync="authVisible"
      size="70%"
      append-to-body
    >
      <app-tp-auth-mng
        :app-mdp-def="editForm"
        :visible="authVisible"
        @cancel="authVisible = false"
        @submit="afterEditSubmit"
      ></app-tp-auth-mng>
    </el-drawer>
    <el-drawer
      title="支付授权"
      :visible.sync="payVisible"
      size="70%"
      append-to-body
    >
      <app-tp-pay-mng
        :app-mdp-def="editForm"
        :visible="payVisible"
        @cancel="payVisible = false"
        @submit="afterEditSubmit"
      ></app-tp-pay-mng>
    </el-drawer>
    <!--编辑 AppMdpDef 图片素材库界面-->
    <el-drawer
      title="编辑应用"
      :visible.sync="editFormVisible"
      width="50%"
      :close-on-click-modal="false"
    >
      <app-mdp-def-edit
        :app-mdp-def="editForm"
        :visible="editFormVisible"
        @cancel="editFormVisible = false"
        @submit="afterEditSubmit"
      ></app-mdp-def-edit>
    </el-drawer>

    <!--新增 AppMdpDef 图片素材库界面-->
    <el-drawer
      title="新增应用"
      :visible.sync="addFormVisible"
      width="50%"
      :close-on-click-modal="false"
    >
      <app-mdp-def-add
        :app-mdp-def="addForm"
        :visible="addFormVisible"
        @cancel="addFormVisible = false"
        @submit="afterAddSubmit"
      ></app-mdp-def-add>
    </el-drawer>
  </section>
</template>

<script>
import util from "@/common/js/util"; //全局公共库
import config from "@/common/config"; //全局公共库import
//import Sticky from '@/components/Sticky' // 粘性header组件
import {
  listAppMdpDef,
  delAppMdpDef,
  batchDelAppMdpDef,
} from "@/api/mdp/app/appMdpDef";
import AppMdpDefAdd from "./AppMdpDefAdd"; //新增界面
import AppMdpDefEdit from "./AppMdpDefEdit"; //修改界面
import AppTpAuthMng from "../appTpAuth/AppTpAuthMng"; //修改界面
import AppTpPayMng from "../appTpPay/AppTpPayMng"; //修改界面
import { mapGetters } from "vuex";

export default {
  name: "AppMdpDefMng",
  computed: {
    ...mapGetters(["userInfo"]),
  },
  data() {
    return {
      filters: {
        key: "",
        queryByBizType: false,
      },
      appMdpDefs: [], //查询结果
      pageInfo: {
        //分页数据
        total: 0, //服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
        pageSize: 10, //每页数据
        pageNum: 1, //当前页码、从1开始计算
        orderFields: [], //排序列 如 ['sex','student_id']，必须为数据库字段
        orderDirs: [], //升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
      },
      load: { list: false, edit: false, del: false, add: false }, //查询中...
      sels: [], //列表选中数据
      options: {}, //下拉选择框的所有静态数据 options.sex,options.project

      addFormVisible: false, //新增appMdpDef界面是否显示
      //新增appMdpDef界面初始化数据
      addForm: {
        mdpAppid: "",
        name: "",
        logoUrl: "",
        remark: "",
        bizType: "",
        deptid: "",
        branchId: "",
        cdate: "",
        cuserid: "",
        enabled: "",
      },

      editFormVisible: false, //编辑界面是否显示
      //编辑appMdpDef界面初始化数据
      editForm: {
        mdpAppid: "",
        name: "",
        logoUrl: "",
        remark: "",
        bizType: "",
        deptid: "",
        branchId: "",
        cdate: "",
        cuserid: "",
        enabled: "",
      },
      /**begin 自定义属性请在下面加 请加备注**/
      bizType: null, //选中的分类
      uploadParams: { bizType: "", fileName: "", remark: "", deptid: "" },
      authVisible: false,
      payVisible: false,
      tableHeight: 500,
      /**end 自定义属性请在上面加 请加备注**/
    };
  }, //end data
  methods: {
    handleSizeChange(pageSize) {
      this.pageInfo.pageSize = pageSize;
      this.pageInfo.count = true;

      this.getAppMdpDefs();
    },
    handleCurrentChange(pageNum) {
      this.pageInfo.pageNum = pageNum;
      this.getAppMdpDefs();
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
      this.getAppMdpDefs();
    },
    searchAppMdpDefs() {
      this.pageInfo.count = true;
      this.getAppMdpDefs();
    },
    //获取列表 AppMdpDef 图片素材库
    getAppMdpDefs() {
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
        params.key =  this.filters.key;
      }
      if (this.filters.queryByBizType == true) {
        if (this.bizType !== null) {
          params.bizType = this.bizType.id;
        } else {
          this.$notify.error("请选择分类");
          return;
        }
      }
      if (!this.userInfo.isSuperAdmin && !this.userInfo.isPlatformAdmin) {
        params.branchId = this.userInfo.branchId;
      }
      this.sels = [];
      this.load.list = true;
      this.appMdpDefs = [];
      listAppMdpDef(params)
        .then((res) => {
          var tips = res.data.tips;
          if (tips.isOk) {
            this.pageInfo.total = res.data.total;
            this.pageInfo.count = false;
            let temps = res.data.data;
            temps.forEach((i) => (i.show = false));
            temps.forEach((i) => {
              if (i.isOutUrl == null) {
                i.isOutUrl = "0";
              }
            });
            this.appMdpDefs = temps;
            console.log(this.appMdpDefs);
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

    //显示编辑界面 AppMdpDef 图片素材库
    showEdit: function (row, index) {
      this.editFormVisible = true;
      this.editForm = Object.assign({}, row);
    },
    //显示新增界面 AppMdpDef 图片素材库
    showAdd: function () {
      this.addFormVisible = true;
      //this.addForm=Object.assign({}, this.editForm);
    },
    afterAddSubmit() {
      this.addFormVisible = false;
      this.pageInfo.count = true;
      this.getAppMdpDefs();
    },
    afterEditSubmit() {
      this.editFormVisible = false;
    },
    //选择行appMdpDef
    selsChange: function (sels) {
      this.sels = sels;
    },
    //删除appMdpDef
    handleDel: function (row, index) {
      this.load.del = true;
      this.$confirm("确认删除该记录吗?", "提示", {
        type: "warning",
      })
        .then(() => {
          let params = row;
          delAppMdpDef(params).then((res) => {
            this.load.del = false;
            var tips = res.data.tips;
            if (tips.isOk) {
              this.pageInfo.count = true;
              this.getAppMdpDefs();
            }
            this.$notify({
              message: tips.msg,
              type: tips.isOk ? "success" : "error",
            });
          });
        })
        .catch(() => {
          this.load.del = false;
        });
    },
    //批量删除appMdpDef
    batchDel: function () {
      this.load.del = true;
      this.$confirm("确认删除选中记录吗？", "提示", {
        type: "warning",
      })
        .then(() => {
          batchDelAppMdpDef(this.sels).then((res) => {
            this.load.del = false;
            var tips = res.data.tips;
            if (tips.isOk) {
              this.pageInfo.count = true;
              this.getAppMdpDefs();
            }
            this.$notify({
              message: tips.msg,
              type: tips.isOk ? "success" : "error",
            });
          });
        })
        .catch(() => {
          this.load.del = false;
        });
    },
    rowClick: function (row, event, column) {
      this.$emit("row-click", row, event, column); //  @row-click="rowClick"
    },
    /**begin 自定义函数请在下面加**/
    bizTypeRowClick: function (row, event, column) {
      this.filters.queryByBizType = true;
      this.uploadParams.bizType = row.id;
      this.bizType = row;
      this.searchAppMdpDefs();
    },
    handleSuccess(res, file) {
      //var jsonData = JSON.stringify(res, null, 4);
      //alert(jsonData);
      var tips = res.tips;
      if (tips.isOk) {
        this.getAppMdpDefs();
      } else {
        if (tips.msg == "该图片不支持") {
          this.$notify({ message: "该图片不支持", type: "info" });
        } else {
          this.$notify({ message: "未知异常", type: "info" });
        }
      }
    },
    beforeupload(file) {
      if (this.bizType == null || this.bizType.name == "") {
        this.$notify({ message: "请选择分类", type: "warning" });
        return false;
      }
      return true;
    },
    selectImg(appMdpDef) {
      if (appMdpDef.show == true) {
        appMdpDef.show = false;
        let index = this.sels.indexOf(appMdpDef);
        this.sels.splice(index, 1);
      } else {
        //this.appMdpDefs.forEach(i=>i.show=false);
        appMdpDef.show = true;
        this.sels.push(appMdpDef);
      }
    },
    converUrl(appMdpDef) {
      if (
        appMdpDef.logoUrl != null &&
        !appMdpDef.logoUrl.indexOf("http") == 0 &&
        !appMdpDef.logoUrl.indexOf("www") == 0
      ) {
        return "/arc/" + appMdpDef.logoUrl;
      }
      return appMdpDef.logoUrl;
    },

    handleAuth: function (o, index) {
      this.editForm = o;
      this.authVisible = true;
    },
    handlePay: function (o, index) {
      this.editForm = o;
      this.payVisible = true;
    },
    /**end 自定义函数请在上面加**/
  }, //end methods
  components: {
    "app-mdp-def-add": AppMdpDefAdd,
    "app-mdp-def-edit": AppMdpDefEdit,
    AppTpAuthMng,
    AppTpPayMng,
    //在下面添加其它组件
  },
  mounted() {
    this.$nextTick(() => {
      this.tableHeight = window.innerHeight - 250;
    });
    this.$nextTick(() => {
      this.getAppMdpDefs();
    });
  },
};
</script>

<style scoped>
.time {
  font-size: 13px;
  color: #999;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
}

.button {
  padding: 0;
  float: right;
}

.appMdpDef {
  width: 100%;
  display: block;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both;
}

.imgBox {
  margin-bottom: 5px;
  padding: 5px;
  margin: 5px;
}

.blank {
  position: relative;
}
.black_blank {
  position: absolute;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.6);
  width: 100%;
  height: 145px;
  vertical-align: middle;
  display: inline-block;
}
.select_blank {
  position: absolute;
  top: 0;
  left: 0;
  background: transparent url(../../../../assets/image/selected_image.png)
    no-repeat 0 0;
  width: 100%;
  height: 120px;
  vertical-align: middle;
  display: inline-block;
  background-position: 50% 70%;
}

.avatar-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader:hover {
  border-color: #409eff;
}
</style>