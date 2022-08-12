<template>
  <section class="menu-box">
    <el-table
      ref="table"
      :data="usersCpd"
      header-cell-class-name="head-row"
      border
      :height="tableHeight"
      style="width: 100%" 
    >
      <el-table-column
        :label="'负责人 (' + users.length + ')'"
        class-name="menu-name"
        width="200"
      >
        <template slot-scope="scope">
          <div class="menu">
			<div  class="icon" style="background-color:  rgb(79, 140, 255);">
				<i class="el-icon-document"></i>
			</div>
            <el-link type="primary" @click="showMenuEdit(scope.row)">{{
              scope.row.mmUsername
            }}</el-link>
          </div>
        </template>
      </el-table-column>
      <template v-for="(type, tt) in statusCpd" style="min-width:200px;">
        <el-table-column 
          :label="type.label + '(' + type.number + ')'"
          :key="tt"
          width="250"
        >
          <template slot-scope="scope">
            <el-row class="my-cell-bar">
              <el-button
                icon="el-icon-plus"
                @click="showAddMenu(scope.row, type)"
                type="primary"
                plain
                >故事</el-button
              >
            </el-row>
            <draggable
              :name="scope.row.mmUserid"
              :sort="false"
              @start="onStart"
              @end="onEnd"
              @move="onMove"
              :options="{ group: scope.row.mmUserid }"
              class="draggable"
              animation="300"
              scroll
              scrollSensitivity="80"
              scrollSpeed="80"
            >
              <transition-group
                class="transition-group"
                :data-mm-userid="scope.row.mmUserid"
                :data-menu-state="type.status"
              >
                <!-- <template v-if="drag.mmUserid && drag.mmUserid === scope.row.mmUserid && drag.status !== type.status">
									<div class="drag-to-box">{{type.label}}</div>
								</template> -->
                <template v-if="menus && menusCpd[scope.row.mmUserid][tt].length">
                  <div @click.stop="showMenuEdit(menu)"
                    :data-mm-userid="scope.row.mmUserid"
                    :data-menu-id="menu.menuId"
                    :data-menu-state="menu.status"
                    class="menu" 
                    v-for="(menu, t) in menus[scope.row.mmUserid][tt]"
                    :key="menu.menuId + t"
                  >
                  <el-row>
                    <el-tag
                        title="优先级"
                        v-for="(item, index) in formatDictsWithClass(
                          dicts,
                          'priority',
                          menu.level
                        )"
                        :key="menu.menuId + index"
                        :type="item.className"
                        >{{ item.menuName }}</el-tag
                      > 
                      <el-tag
                        title="进度"
                        style="border-radius: 30px"
                        :type="menu.rate >= 100 ? 'success' : 'warning'"
                      >
                        {{ (menu.rate != null ? menu.rate : 0) + "%" }}
                      </el-tag>  
				  	        <span class="my-cell-bar"><el-button   size="mini" type="danger" icon="el-icon-delete" plain @click.stop="handleDel(menu,tt)"></el-button></span>
                  </el-row>
                    <el-row>
                      <span title="负责人" class="label-font-color">
                      {{
                        menu.mmUsername
                          ? menu.mmUsername
                          : "未设置负责人"
                      }}
                    </span>
                    </el-row>
                     <el-row>
                       <div class="title">{{ menu.menuName }}</div> 
                     </el-row>
                   
                  </div>
                </template>
              </transition-group>
            </draggable>
          </template>
        </el-table-column>
      </template>
    </el-table>
    <el-dialog
      title="编辑故事"
      :visible.sync="editFormVisible"
      :with-header="false"
      fullscreen
      append-to-body
      :close-on-click-modal="false"
    >
      <xm-menu-edit
        :xm-project="
          editForm && editForm.productId ? { id: editForm.productId } : null
        "
        :xm-menu="editForm"
        :visible="editFormVisible"
        @cancel="editFormVisible = false"
        @after-add-submit="afterExecEditSubmit"
        @after-edit-submit="afterExecEditSubmit"
        @submit="afterEditSubmit"
      ></xm-menu-edit>
    </el-dialog>

    <el-dialog
      title="新增故事"
      :visible.sync="addFormVisible"
      append-to-body
      modal-append-to-body
    >
      <el-form :model="addForm" :rules="addFormRules" ref="addForm">
        <el-form-item label="上级计划" prop="parentMenuname">
          {{ addForm.parentMenuname ? addForm.parentMenuname : "无上级" }}
          <el-button
            @click="selectParentMenuVisible = true"
            title="选择上级计划"
            type="text"
            icon="el-icon-upload2"
          >
            选择上级计划
          </el-button>
        </el-form-item>
        <el-form-item label="故事名称" prop="name">
          <template slot="label">
            <div class="icon" style="background-color: #1cc7ea">
              <i class="el-icon-s-operation"></i>
            </div>
            故事名称
          </template>
          <el-input v-model="addForm.menuName" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addFormVisible = false">关闭</el-button>
        <el-button type="primary" @click="addXmMenu">确 定</el-button>
      </div>
    </el-dialog> 
	

	<el-dialog append-to-body title="需求明细"  :visible.sync="menuDetailVisible" width="80%"  top="20px"  :close-on-click-modal="false">
		<xm-menu-edit :visible="menuDetailVisible" op-type="edit" :xm-menu="editForm" ></xm-menu-edit>
	</el-dialog>
  </section>
</template>

<script>
import util from "@/common/js/util"; //全局公共库
import draggable from "vuedraggable";
import { initDicts, editXmMenuSomeFields, addMenu,delXmMenu } from "@/api/xm/core/xmMenu";
import XmMenuEdit from "./XmMenuEdit"; //修改界面
import XmEpicFeaturesSelect from "../xmMenu/XmEpicFeaturesSelect.vue";
 
import { mapGetters } from "vuex";

export default {
  name: "XmMenuAgileKanban",
  props: ["xmMenus", "tableHeight", "xmProduct"],

  data() {
    return {
		load:{add:false,edit:false,list:false,del:false},
      editForm: {
        id: "",
        name: "",
        parentMenuid: "",
        parentMenuname: "",
        productId: "",
        projectName: "",
        level: "",
        sortLevel: "",
        mmUserid: "",
        mmUsername: "",
        preMenuid: "",
        preMenuname: "",
        startTime: "",
        endTime: "",
        milestone: "",
        description: "",
        remarks: "",
        createUserid: "",
        createUsername: "",
        createTime: "",
        rate: 0,
        budgetAt: 0,
        budgetWorkload: 0,
        actAt: 0,
        actWorkload: 0,
        status: "0",
        menuType: "4",
        menuClass: "",
        toMenuCenter: "0",
        actStartTime: "",
        actEndTime: "",
        bizProcInstId: "",
        bizFlowState: "",
        phaseId: "",
        phaseName: "",
        menuSkillNames: "",
        exeUsernames: "",
        menuSkillIds: "",
        exeUserids: "",
        menuOut: "0",
        planType: "w2",
        settleSchemel: "1",
        menuId: "",
        menuName: "",
        productId: "",
        cbranchId: "",
        cdeptid: "",
        tagIds: "",
        tagNames: "",
        ntype: "",
        childrenCnt: "",
        ltime: "",
        pidPaths: "",
        lvl: "",
        isTpl: "",
        keyPath: "",
        uniInnerPrice: 80,
        uniOutPrice: 100,
        calcType: "",
        ptype: "",
        wtype: "",
        bctrl: "",
        initWorkload: "",
        shareFee: "",
        oshare: "",
        crowd: "",
        browseUsers: "",
        execUsers: "",
        cityId: "",
        cityName: "",
        regionType: "",
        browseTimes: "",
        capaLvls: "",
        tranMode: "",
        supRequires: "",
        hot: "0",
        top: "0",
        urgent: "0",
        crmSup: "0",
        bidStep: "0",
        interestLvls: "",
        filePaths: "",
        estate: "0",
        efunds: 0,
        etoPlatTime: "",
        etoDevTime: "",
        ebackTime: "",
        topStime: "",
        topEtime: "",
        hotStime: "",
        hotEtime: "",
        urgentStime: "",
        urgentEtime: "",
      },

      addForm: {
        id: "",
        name: "",
        parentMenuid: "",
        parentMenuname: "",
        productId: "",
        projectName: "",
        level: "",
        sortLevel: "",
        mmUserid: "",
        mmUsername: "",
        preMenuid: "",
        preMenuname: "",
        startTime: "",
        endTime: "",
        milestone: "",
        description: "",
        remarks: "",
        createUserid: "",
        createUsername: "",
        createTime: "",
        rate: 0,
        budgetAt: 0,
        budgetWorkload: 0,
        actAt: 0,
        actWorkload: 0,
        status: "0",
        menuType: "4",
        menuClass: "",
        toMenuCenter: "0",
        actStartTime: "",
        actEndTime: "",
        bizProcInstId: "",
        bizFlowState: "",
        phaseId: "",
        phaseName: "",
        menuSkillNames: "",
        exeUsernames: "",
        menuSkillIds: "",
        exeUserids: "",
        menuOut: "0",
        planType: "w2",
        settleSchemel: "1",
        menuId: "",
        menuName: "",
        productId: "",
        cbranchId: "",
        cdeptid: "",
        tagIds: "",
        tagNames: "",
        ntype: "",
        childrenCnt: "",
        ltime: "",
        pidPaths: "",
        lvl: "",
        isTpl: "",
        keyPath: "",
        uniInnerPrice: 80,
        uniOutPrice: 100,
        calcType: "",
        ptype: "",
        wtype: "",
        bctrl: "",
        initWorkload: "",
        shareFee: "",
        oshare: "",
        crowd: "",
        browseUsers: "",
        execUsers: "",
        cityId: "",
        cityName: "",
        regionType: "",
        browseTimes: "",
        capaLvls: "",
        tranMode: "",
        supRequires: "",
        hot: "0",
        top: "0",
        urgent: "0",
        crmSup: "0",
        bidStep: "0",
        interestLvls: "",
        filePaths: "",
        estate: "0",
        efunds: 0,
        etoPlatTime: "",
        etoDevTime: "",
        ebackTime: "",
        topStime: "",
        topEtime: "",
        hotStime: "",
        hotEtime: "",
        urgentStime: "",
        urgentEtime: "",
      },
      addFormRules: {
        name: [
          { required: true, message: "故事名称不能为空", trigger: "change" },
          {
            min: 2,
            max: 150,
            message: "长度在 2 到 150 个字符",
            trigger: "change",
          }, //长度
        ],
      },
      editFormVisible: false,
      addFormVisible: false,
      selectParentMenuVisible: false,
	  menuDetailVisible:false,
      status: [
        { label: "打开", status: "0", number: 0 },
        { label: "进行中", status: "1", number: 0 },
        { label: "已完工", status: "2", number: 0 },
        { label: "已关闭", status: "3", number: 0 }, 
      ],
      statusInit: [],
      dicts: {
        priority: [],
        menuType: [],
        planType: [],
        xmMenuSettleSchemel: [],
        status: [],
        xm_plan_lvl: [],
      },
      menus: {},
      users: [],
      drag: {
        menuId: "",
        state: "",
      },
    };
  },
  components: { draggable, XmMenuEdit, XmEpicFeaturesSelect,XmMenuEdit },
  watch: {
    xmMenus() {
      this.initData();
    },
  },
  computed: {
    ...mapGetters(["userInfo", "roles"]),
    usersCpd() {
      return this.users;
    },
    menusCpd() {
      return this.menus;
    },
    statusCpd() {
      return this.status;
    },
  },
  methods: {
    ...util,
    onMove(e) {
      console.log("onMove--e==", e);

      let targetEl = { ...e.dragged.dataset };
      let toEl = { ...e.to.dataset };
      if (
        targetEl.mmUserid === toEl.mmUserid &&
        targetEl.status != toEl.status
      ) {
        console.log("onMove--true");
        return true;
      }
      console.log("onMove--false");
      return false;
    },
    onStart(e) {
      console.log("onStart--e==", e);
      let targetEl = { ...e.item.dataset };
      this.drag = { ...targetEl };
      console.log("onStart--targetEl==", targetEl);
    },
    onEnd(e) {
      console.log("onEnd--e==", e);
      this.drag = {};
      // targetEl：拖拽的故事数据; toEl拖拽后的位置.
      let targetEl = { ...e.item.dataset };
      let toEl = { ...e.to.dataset };
      if (
        targetEl.mmUserid === toEl.mmUserid &&
        targetEl.status != toEl.status
      ) {
        let menu = this.xmMenus.find((d) => d.menuId === targetEl.menuId);
        let menuIndex = this.xmMenus.findIndex((d) => d.menuId === targetEl.menuId);
        //const params = { ...menu, status: toEl.status };
        const params = { ids: [menu.menuId], status: toEl.status };
        editXmMenuSomeFields(params).then((res) => {
          //this.$emit('submit');
          var tips = res.data.tips;
          if (tips.isOk) {
            var statusIndex = this.getMenuStateIndex(menu.status);
            this.status[statusIndex].number =
              this.status[statusIndex].number - 1;
            var toMenuStateIndex = this.getMenuStateIndex(params.status);
            this.status[toMenuStateIndex].number =
              this.status[toMenuStateIndex].number + 1;
            menu.status = params.status;
            this.$set(this.xmMenus, menuIndex, menu);
          } else {
            this.$notify({
              position: "bottom-left",
              showClose: true,
              message: tips.msg,
              type: "error",
            });
          }
          return res.data.tips.isOk;
        });
      } else {
        return false;
      }
    },

    initData() {
      var xmMenus = this.xmMenus;
      this.status = JSON.parse(JSON.stringify(this.statusInit));
      let users = [],
        userids = {},
        menus = {};
      xmMenus.forEach((d, i) => {
        if (!d.mmUserid) {
          d.mmUserid = "noExecutorUserid";
          d.mmUsername = "未设置负责人";
        }
        if (!users.length || !userids[d.mmUserid]) {
          users.push(d);
          userids[d.mmUserid] = true;
        }
        if (!menus[d.mmUserid]) {
          menus[d.mmUserid] = [[], [], [], [], [], []];
        }
        var statusIndex = this.getMenuStateIndex(d.status);
        menus[d.mmUserid][statusIndex].push(d);
        this.status[statusIndex].number += 1;
      });
      this.menus = menus;
	  users.sort((v1,v2)=>{
		return v1.mmUserid<v2.mmUserid
	  })
      this.users = users;
    },
    showMenuEdit(menu) {
      this.editForm = menu;
      this.editFormVisible = true;
    },
    afterEditSubmit(menu) {
      let menuIndex = this.xmMenus.findIndex((d) => d.menuId === menu.menuId);
      this.$set(this.xmMenus, menuIndex, menu);
    },
    getMenuStateIndex(status) {
      return this.status.findIndex((i) => i.status == status);
    },
    afterExecEditSubmit() {},
	showMenuEdit(menu){
		this.editForm=menu;
		if(menu.mmUserid=='noExecutorUserid'||!menu.mmUserid){
			this.$notify({
              position: "bottom-left",
              showClose: true,
              message: '没有关联故事故事',
              type: "error",
            });
			return;
		}
		this.menuDetailVisible=true;
	},
    addXmMenu() {
		this.load.add=true;
      this.$refs.addForm.validate().then((valid) => {
        var menu = { ...this.addForm };
        addMenu(menu)
          .then((res) => {
            this.load.add = false;
            var tips = res.data.tips;
            if (tips.isOk) {
              //this.$emit("submit", res.data.data); //  @submit="afterAddSubmit"
              this.xmMenus.push(res.data.data);
            }
            this.$notify({
              position: "bottom-left",
              showClose: true,
              message: tips.msg,
              type: tips.isOk ? "success" : "error",
            });
          })
          .catch((err) => (this.load.add = false));
      });
    },
    onSelectedParentMenu(menu) {
      this.addForm.parentMenuid = menu.menuId;
      this.addForm.parentMenuname = menu.menuName;
      this.selectParentMenuVisible = false;
    },
    showAddMenu(menu, type) {
      this.addForm.menuId = menu.menuId;
      this.addForm.menuName = menu.menuName;
      this.addForm.productId = menu.productId;
      this.addForm.status = type.status;
      this.addForm.productId = menu.productId;
      this.addForm.parentMenuid = menu.parentMenuid;
      this.addForm.parentMenuname = menu.parentMenuname;
      this.addForm.priority = menu.priority;
      this.addForm.sortLevel = menu.sortLevel;
      this.addForm.verNum = menu.verNum;
      this.addForm.pverNum = menu.pverNum;
      this.addForm.createUserid = this.userInfo.userid;
      this.addForm.createUsername = this.userInfo.username;
      this.addForm.qtype = "1";
      this.addForm.ntype = "0";
      this.addForm.ptype = "0";
      this.addFormVisible = true;
    },
	
    //删除xmMenu
    handleDel: function (row, index) {
      this.$confirm("确认删除该记录吗?", "提示", {
        type: "warning",
      }).then(() => {
        this.load.del = true;
        let params = Object.assign({}, row);
        delXmMenu(params)
          .then((res) => {
            this.load.del = false;
            var tips = res.data.tips;
            if (tips.isOk) { 
				var index=this.xmMenus.findIndex(k=>k.menuId==row.menuId)
				this.xmMenus.splice(index,1)
             }
            this.$notify({
              showClose: true,
              message: tips.msg,
              type: tips.isOk ? "success" : "error",
            });
          })
          .catch((err) => (this.load.del = false));
      });
    },
  },
  mounted() {
    initDicts(this);
    this.statusInit = JSON.parse(JSON.stringify(this.status));
    this.initData();
  },
};
</script>
<style lang='scss' scoped>
.menu-box {
  height: 100%;
  width: 100%;
  overflow: hidden;
} 

.draggable {
  display: flex;
  flex-wrap: wrap;
  min-height: 100px;
  width: 100%;
}
.el-table {
  /deep/ .el-table__row {
    background: #f6f6f6;
    .menu-name {
      background: #fff !important;
    }
    td {
      height: 100%;
      vertical-align: top;
    }
  }
}
.transition-group {   
  width: 100%;
  cursor: pointer;
  .menu {  
  	min-height: 100px;
    background: #fff;
    margin: 0px 0px 10px 0px;
	  padding: 5px;
  }
}

.my-cell-bar {
  visibility: hidden;
  float: right;
}

.el-table__row td:hover {
  cursor: pointer;
  .my-cell-bar {
    visibility: visible;
    .u-btn {
      float: right;
    }
  }
  .my-cell-text {
    display: none;
  }
}

.title { 
    height: 40px;
    overflow: hidden; //超出隐藏
    text-overflow: ellipsis; //溢出用省略号显示
    display: -webkit-box; // 将对象作为弹性伸缩盒子模型显示。
    // 控制行数
    -webkit-line-clamp: 2; //超出两行隐藏
    -webkit-box-orient: vertical; // 从上到下垂直排列子元素
    //（设置伸缩盒子的子元素排列方式）
} 
</style>
