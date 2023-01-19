<template>
  <section>
    <el-row>
      <el-menu
        :default-active="infotype"
        mode="horizontal"
        @select="setInfotype"
        class="menus"
        background-color="rgb(48, 65, 86)"
        text-color="rgb(191, 203, 217)"
        active-text-color="#409eff"
        :router="true"
      >
        
      <el-menu-item :index="'/xm/core/test/overview?casedbId='+testCasedb.id">
          <span
            slot="title"
            style="font-size: 18px; color: #409eff" 
            class="hidden-md-and-down"
            :title="testCasedb.name"
          >
            <font v-if="testCasedb.name.length >= 15">
              <strong>
                
                &nbsp;<el-avatar class="top-icon"   style="background-color:#409EFF">bugs</el-avatar>&nbsp;{{ testCasedb.name.substring(0, 15) }}</strong
              ></font
            >
            <div  v-else>
           
            <font type="danger">
              <strong>&nbsp; <el-avatar class="top-icon" icon="bugs" style="background-color:#409EFF"></el-avatar>&nbsp;产品:&nbsp;{{ testCasedb.name }}</strong></font
            >
            </div>
          </span>
          <span
            slot="title"
            style="color: #409eff"
            class="hidden-lg-and-up"
            :title="testCasedb.name"
          >
            <font v-if="testCasedb.name.length >= 15">
              &nbsp;<el-avatar class="top-icon" icon="el-icon-s-opportunity" style="background-color:#409EFF"></el-avatar>&nbsp;产品:&nbsp;{{ testCasedb.name.substring(0, 15) }}</font
            >
            <font type="danger" v-else>
              &nbsp;<el-avatar class="top-icon" icon="el-icon-s-opportunity" style="background-color:#409EFF"></el-avatar>&nbsp;产品:&nbsp;{{ testCasedb.name }}</font
            >
          </span>
        </el-menu-item>
        <el-menu-item :index="'/xm/core/test/case?casedbId='+testCasedb.id">
          <span slot="title"><i class="el-icon-odometer"></i>用例管理</span>
        </el-menu-item> 
				<el-menu-item label="需求" :index="'/xm/core/test/flow?casedbId='+testCasedb.id">
					 <span slot="title"><i class="el-icon-document"></i>用例评审</span> 
				</el-menu-item> 
        <el-menu-item :index="'/xm/core/test/plan?casedbId='+testCasedb.id">
          <span slot="title"><i class="el-icon-connection"></i>测试计划</span>
        </el-menu-item>

        <el-menu-item :index="'/xm/core/test/report?casedbId='+testCasedb.id">
          <span slot="title"><i class="el-icon-time"></i>统计分析</span>
        </el-menu-item>
 
        <el-menu-item :index="'/xm/core/test/group?casedbId='+testCasedb.id">
          <span slot="title"><i class="el-icon-user-solid"></i>团队</span>
        </el-menu-item>
        <el-submenu index="更多">
          <template slot="title">更多 </template> 
          <el-menu-item :index="'/xm/core/test/env?casedbId='+testCasedb.id">
            <span slot="title"><i class="el-icon-setting"></i>环境清单</span>
          </el-menu-item> 
          <el-menu-item index="/forum">
            <span slot="title"><i class="el-icon-date"></i>论坛</span>
          </el-menu-item>
          <el-menu-item index="/im">
            <span slot="title"><i class="el-icon-date"></i>即聊</span>
          </el-menu-item>
          <el-menu-item index="/helpCenter">
            <span slot="title"><i class="el-icon-date"></i>客服</span>
          </el-menu-item>
          <el-menu-item index="/xm/core/xmTestCasedb/XmTestCasedbMng" >
              <span slot="title"
                ><i class="el-icon-back"></i>回到测试库列表页</span
              >
            </el-menu-item> 
            <el-menu-item index="/">
              <span slot="title"
                ><i class="el-icon-s-home"></i>首页</span
              >
            </el-menu-item> 
        </el-submenu>
      </el-menu>
    </el-row> 
  </section>
</template>

<script> 
 
 
import { mapGetters } from 'vuex'

export default {
  props: ["visible"],
  computed: {
    ...mapGetters(["userInfo", "roles","testCasedb"]),
  },
  watch: {
    $route:{
      handler(newVal,oldValu){ 
        this.infotype=newVal.fullPath 
      },
      deep:true,
      immediate:true,
    }
  },
  data() {
    return { 
      infotype:'',  
    };
  }, //end data
  methods: {    
    setInfotype(infotype) {  
        this.infotype = infotype;  
    },   
     
  }, //end methods
  components: {
     
    //在下面添加其它组件
  }, 
  mounted() {   
    this.infotype=this.$route.fullPath
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.menus {
  .el-menu-item {
    padding-left: 0px !important;
  }
}
/* 超过宽度则用...代替 */
.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.step-btn{
	margin-left:0px;margin-bottom: 5px;
}
</style>
