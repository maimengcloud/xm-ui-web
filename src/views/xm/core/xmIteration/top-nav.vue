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
        <el-menu-item :index="'/xm/core/iteration/overview?iterationId='+xmIteration.id">
          <span
            slot="title"
            style="font-size: 18px; color: #ff8c00"
            class="hidden-md-and-down"
            :title="xmIteration.iterationName"
          >
            <font v-if="xmIteration.iterationName.length >= 15"
              ><strong
                >&nbsp;<el-avatar class="top-icon" icon="el-icon-connection" style="background-color:#ff8c00"></el-avatar>&nbsp;迭代:&nbsp;&nbsp;{{
                  xmIteration.iterationName.substring(0, 15)
                }}</strong
              ></font
            >
            <font type="danger" v-else
              ><strong
                >&nbsp;<el-avatar class="top-icon" icon="el-icon-connection" style="background-color:#ff8c00"></el-avatar>&nbsp;迭代:&nbsp;&nbsp;{{ xmIteration.iterationName }}</strong
              ></font
            >
          </span>
          <span
            slot="title"
            style="color: #ff8c00"
            class="hidden-lg-and-up"
            :title="xmIteration.iterationName"
          >
            <font v-if="xmIteration.iterationName.length >= 15"
              >&nbsp;<el-avatar class="top-icon" icon="el-icon-connection" style="background-color:#ff8c00"></el-avatar>&nbsp;迭代:&nbsp;{{ xmIteration.iterationName.substring(0, 15) }}</font
            >
            <font type="danger" v-else
              >&nbsp;<el-avatar class="top-icon" icon="el-icon-connection" style="background-color:#ff8c00"></el-avatar>&nbsp;迭代:&nbsp;{{ xmIteration.iterationName }}</font
            >
          </span>
        </el-menu-item>
        <!--
        <el-menu-item :index="'/xm/core/iteration/project?iterationId='+xmIteration.id">
          <span slot="title"><i class="el-icon-odometer"></i>项目</span>
        </el-menu-item> 
        -->
				<el-menu-item label="需求" :index="'/xm/core/iteration/menu?iterationId='+xmIteration.id" class="hidden-md-and-down">
					 <span slot="title"><i class="el-icon-document"></i>需求</span> 
				</el-menu-item>     
        <el-menu-item :index="'/xm/core/iteration/task?iterationId='+xmIteration.id" class="hidden-md-and-down">
          <span slot="title"><i class="el-icon-s-operation"></i>任务</span>
        </el-menu-item>
        <el-menu-item :index="'/xm/core/iteration/question?iterationId='+xmIteration.id">
          <span slot="title"><i class="el-icon-question"></i>缺陷</span>
        </el-menu-item>
        <!--
        <el-menu-item :index="'/xm/core/iteration/group?iterationId='+xmIteration.id">
          <span slot="title"><i class="el-icon-user-solid"></i>团队</span>
        </el-menu-item> 
        -->
        <el-menu-item :index="'/xm/core/iteration/report?iterationId='+xmIteration.id">
          <span slot="title"><i class="el-icon-s-data"></i>效能</span>
        </el-menu-item> 
        <el-submenu index="更多">
          <template slot="title">更多 </template>
          <el-menu-item :index="'/xm/core/iteration/workloadDay?iterationId='+xmIteration.id">
            <span slot="title"
              ><i class="el-icon-video-camera"></i>每日工时</span
            >
          </el-menu-item>
          <el-menu-item :index="'/xm/core/iteration/workloadMonth?iterationId='+xmIteration.id">
            <span slot="title"
              ><i class="el-icon-video-camera"></i>每月工时</span
            >
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
          <el-menu-item index="/xm/core/xmIteration/XmIterationMng" >
              <span slot="title"
                ><i class="el-icon-back"></i>回到迭代列表页</span
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
    ...mapGetters(["userInfo", "roles","xmIteration"]),
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
