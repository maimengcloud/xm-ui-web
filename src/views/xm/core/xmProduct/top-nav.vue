<template>
  <section>
    <el-row>
      <el-menu
        :default-active="infotype"
        mode="horizontal"
        @select="setInfotype"
        class="menus"
        style="margin:0 auto;overflow-x: auto;overflow-y: hidden;display: flex;" 
        background-color="rgb(48, 65, 86)"
        text-color="rgb(191, 203, 217)"
        active-text-color="#409eff"
        :router="true"
      >
        
      <el-menu-item :index="'/xm/core/product/overview?productId='+xmProduct.id">
          <div
            slot="title"
            style="max-width: 20vw; font-weight: 600; font-size: 18px; color: #409EFF"  
            :title="xmProduct.productName"
          >
            &nbsp; <el-avatar class="top-icon"  style="background-color:#409EFF">产品</el-avatar>{{ xmProduct.productName }} 
          </div> 
        </el-menu-item>
        <el-menu-item :index="'/xm/core/product/project?productId='+xmProduct.id">
          <span slot="title"><i class="el-icon-odometer"></i>项目</span>
        </el-menu-item> 
				<el-menu-item label="需求" :index="'/xm/core/product/menu?productId='+xmProduct.id">
					 <span slot="title"><i class="el-icon-document"></i>需求</span> 
				</el-menu-item> 
				<el-menu-item label="模块" :index="'/xm/core/product/func?productId='+xmProduct.id">
					 <span slot="title"><i class="el-icon-document"></i>模块</span> 
				</el-menu-item> 
        <el-menu-item :index="'/xm/core/product/iteration?productId='+xmProduct.id">
          <span slot="title"><i class="el-icon-connection"></i>迭代</span>
        </el-menu-item>

        <el-menu-item :index="'/xm/core/product/plan?productId='+xmProduct.id">
          <span slot="title"><i class="el-icon-time"></i>任务</span>
        </el-menu-item>
        <!--
        <el-menu-item :index="'/xm/core/product/task?productId='+xmProduct.id" class="hidden-md-and-down">
          <span slot="title"><i class="el-icon-s-operation"></i>任务</span>
        </el-menu-item>
        -->
        <el-menu-item :index="'/xm/core/product/casedb?productId='+xmProduct.id">
          <span slot="title"><i class="el-icon-question"></i>测试</span>
        </el-menu-item>
        <el-menu-item :index="'/xm/core/product/question?productId='+xmProduct.id">
          <span slot="title"><i class="el-icon-question"></i>缺陷</span>
        </el-menu-item>
        <el-menu-item :index="'/xm/core/product/group?productId='+xmProduct.id">
          <span slot="title"><i class="el-icon-user-solid"></i>团队</span>
        </el-menu-item>
        <el-submenu index="caiwu" class="hidden-sm-and-down">
          <template slot="title"><i class="el-icon-coin"></i>财务</template>
          <el-menu-item :index="'/xm/core/product/contract?productId='+xmProduct.id">
            <span slot="title"><i class="el-icon-s-data"></i>合同管理</span>
          </el-menu-item>
          <el-menu-item :index="'/xm/core/product/budget?productId='+xmProduct.id">
            <span slot="title"><i class="el-icon-coin"></i>预算</span>
          </el-menu-item>
          <el-menu-item :index="'/xm/core/product/cost?productId='+xmProduct.id">
            <span slot="title"><i class="el-icon-coin"></i>费用</span>
          </el-menu-item>
        </el-submenu>
        <el-menu-item :index="'/xm/core/product/rpt?productId='+xmProduct.id">
          <span slot="title"><i class="el-icon-s-data"></i>效能</span>
        </el-menu-item>
        <el-submenu index="zhishi" class="hidden-md-and-down">
          <template slot="title">知识</template>
          <el-menu-item :index="'/xm/core/product/file?productId='+xmProduct.id">
            <span slot="title"><i class="el-icon-document"></i>文档</span>
          </el-menu-item>
          <el-menu-item :index="'/xm/core/product/env?productId='+xmProduct.id">
            <span slot="title"><i class="el-icon-setting"></i>环境清单</span>
          </el-menu-item>
          <el-menu-item :index="'/xm/core/product/record?productId='+xmProduct.id">
            <span slot="title"><i class="el-icon-edit-outline"></i>日志</span>
          </el-menu-item>
        </el-submenu>
        <el-submenu index="更多">
          <template slot="title">更多 </template>
          <el-menu-item :index="'/xm/core/product/workloadDay?productId='+xmProduct.id">
            <span slot="title"
              ><i class="el-icon-video-camera"></i>每日工时</span
            >
          </el-menu-item>
          <el-menu-item :index="'/xm/core/product/workloadMonth?productId='+xmProduct.id">
            <span slot="title"
              ><i class="el-icon-video-camera"></i>每月工时</span
            >
          </el-menu-item>   
          <el-menu-item :index="'/xm/core/product/env?productId='+xmProduct.id">
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
          <el-menu-item index="/xm/core/product/mng" >
              <span slot="title"
                ><i class="el-icon-back"></i>回到产品列表页</span
              >
            </el-menu-item> 
            <el-menu-item index="/">
              <span slot="title"
                ><i class="el-icon-s-home"></i>首页</span
              >
            </el-menu-item> 
        </el-submenu>
        
        <el-menu-item :index="'/'">
          <span slot="title"><i class="el-icon-s-home"></i>首页</span>
        </el-menu-item>
      </el-menu>
    </el-row> 
  </section>
</template>

<script> 
 
 
import { mapGetters } from 'vuex'

export default {
  props: ["visible"],
  computed: {
    ...mapGetters(["userInfo", "roles","xmProduct"]),
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
