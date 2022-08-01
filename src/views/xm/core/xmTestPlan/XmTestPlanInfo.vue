<template>
	<section>
        <el-row>
            
        </el-row>
		<el-row>
            <el-row v-if="activeIndex=='testPlanCase'&& xmTestPlan && xmTestPlan.id">
                <el-row class="border padding-left padding-right">
                     <el-button icon="el-icon-back" @click="activeIndex=testPlan" type="text"></el-button>
                     <el-divider direction="vertical"></el-divider>
                     {{xmTestPlan.name}}
                     <el-divider direction="vertical"></el-divider>
                     <el-link :type="subPage=='testPlanCase'?'primary':''" @click="subPage='testPlanCase'"><i class="el-icon-video-play"></i>&nbsp;执行测试</el-link>
                     <el-divider direction="vertical"></el-divider>
                     <el-link :type="subPage=='testBug'?'primary':''"  @click="subPage='testBug'"><i class="el-icon-question"></i>&nbsp;缺陷</el-link>

                    <el-divider direction="vertical"> 
                    </el-divider>
                        <el-link :type="subPage=='testRpt'?'primary':''"  @click="subPage='testRpt'"><span><i class="el-icon-pie-chart"></i>&nbsp;报告</span></el-link>
                     <span style="float:right;">
                        <span > 
                          <el-tag style="margin-top:5px;" v-for="(item,index) in formatDictsWithClass(dicts,'testPlanStatus',xmTestPlan.status)" :key="index" :type="item.className">{{item.name}}</el-tag> 
                          <span style="color:#C0C4CC;">&nbsp;通过率&nbsp;</span>{{calcTongGuoRate}}&nbsp;&nbsp;<span style="color:#C0C4CC;">&nbsp;已测&nbsp;</span>{{calcYiCeshiCases}}&nbsp;/&nbsp;{{calcTotalCases}}&nbsp;&nbsp;
                           <div style="display:inline-flex"><el-progress  style="width:100px;" :stroke-width="22" :text-inside="true"  :status="calcYiCeshiCases>0 && xmTestPlan.errCases<=0 ?'success':'exception'" :percentage="calcProgress"></el-progress>
                           </div>
                        </span>
                        <span v-if="subPage=='testRpt'">
                        <el-divider direction="vertical"></el-divider>
                        <el-button @click="showRptConfig">配置报告</el-button>
                        </span>
                     </span>
                </el-row> 
                
                <el-row v-if="subPage=='testPlanCase'">
                     <xm-test-plan-case-mng   :xm-test-plan="xmTestPlan" :xm-test-casedb="xmTestCasedb"></xm-test-plan-case-mng>
                </el-row>
                <el-row v-if="subPage=='testBug'">
                     <xm-question-mng   :xm-test-plan="xmTestPlan" :xm-test-casedb="xmTestCasedb" :xm-product="{id:xmTestPlan.productId,productName:xmTestPlan.productName}" :sel-project="{id:xmTestPlan.projectId,name:xmTestPlan.projectName}"></xm-question-mng>
                </el-row>
                
                <el-row v-if="subPage=='testRpt'">
                     <xm-test-plan-rpt  ref="rpt" :xm-test-plan="xmTestPlan"></xm-test-plan-rpt >
                </el-row>
            </el-row> 
            <xm-test-plan-mng v-else @select="onTestPlanSelect" :xm-test-casedb="xmTestCasedb"> </xm-test-plan-mng>
        </el-row>     
	</section>
</template>

<script>

import util from '@/common/js/util';//全局公共库
import config from '@/common/config';//全局公共库
  import  XmTestCaseMng from '../xmTestCase/XmTestCaseMng';//新增修改界面
import  XmTestPlanMng from '../xmTestPlan/XmTestPlanMng';//新增修改界面
import  XmTestPlanCaseMng from '../xmTestPlanCase/XmTestPlanCaseMng';//新增修改界面
import { mapGetters } from 'vuex'
import  XmProductSelect from '@/views/xm/core/components/XmProductSelect';//修改界面
import  XmQuestionMng from '@/views/xm/core/xmQuestion/XmQuestionMng';//修改界面
import { initDicts } from '@/api/xm/core/xmTestPlan';

export default {
    name:'xmTestCasedbMng',
    components: {
        XmProductSelect, XmTestPlanMng,XmTestPlanCaseMng,XmQuestionMng,
        "xm-test-plan-rpt":()=>import("./rpt/index.vue")
    },
    props:['visible','xmTestCasedb'],
    computed: {
        ...mapGetters(['userInfo']),
        calcProgress(){
            if(!this.xmTestPlan || !this.xmTestPlan.id){
                return 0;
            }
           var totalCases= parseInt(this.xmTestPlan.totalCases?this.xmTestPlan.totalCases:0)
           var yiCeshiCases= parseInt(this.xmTestPlan.okCases?this.xmTestPlan.okCases:0)+parseInt(this.xmTestPlan.errCases?this.xmTestPlan.errCases:0)+parseInt(this.xmTestPlan.igCases?this.xmTestPlan.igCases:0)+parseInt(this.xmTestPlan.blCases?this.xmTestPlan.blCases:0)
           if(totalCases>0){
            return parseInt(yiCeshiCases*100/totalCases)
           }else if(yiCeshiCases>0){
            return 100
           }else{
            return 0;
           }
        },
        calcTongGuoRate(){
            if(!this.xmTestPlan || !this.xmTestPlan.id){
                return 0;
            }
            var tongGuoCases=parseInt(this.xmTestPlan.okCases?this.xmTestPlan.okCases:0)
            var totalCases=parseInt(this.xmTestPlan.totalCases?this.xmTestPlan.totalCases:0)
            if(tongGuoCases>0){
                if(totalCases>0){
                   return parseInt( tongGuoCases*100/totalCases)
                }else{
                    return 100;
                }
            }else{
                return 0;
            }
        },
        calcTotalCases(){
            if(!this.xmTestPlan || !this.xmTestPlan.id){
                return 0;
            }
           return parseInt(this.xmTestPlan.totalCases?this.xmTestPlan.totalCases:0)
        },
        calcYiCeshiCases(){
            if(!this.xmTestPlan || !this.xmTestPlan.id){
                return 0;
            }
           return parseInt(this.xmTestPlan.okCases?this.xmTestPlan.okCases:0)+parseInt(this.xmTestPlan.errCases?this.xmTestPlan.errCases:0)+parseInt(this.xmTestPlan.igCases?this.xmTestPlan.igCases:0)+parseInt(this.xmTestPlan.blCases?this.xmTestPlan.blCases:0)
        },


    },
    watch:{
        visible(val){
            if(val==true){ 
            }
        }
    },
    data() {
        return {
             dicts:{
                testPlanStatus:[],
             },
            activeIndex:'testPlan',//testPlanCase,testPlan
            xmTestPlan:null,
            subPage:'testPlanCase',//testPlanCase,testBug
        }
    },//end data
    methods: {

        ...util,
        onTestPlanSelect(row){
            this.activeIndex='testPlanCase'
            this.xmTestPlan=row
        },
        showRptConfig(){
            this.$refs['rpt'].rptConfigVisible=true
        }
 
    },//end methods
    mounted() {
        this.$nextTick(() => {
            initDicts(this)

        });
    }
}

</script>

<style lang="scss" scoped>
.center{
    align-items: center; /* 垂直居中 */
    justify-content: center; /* 水平居中 */
}
.el-menu{
    align-items: center; /* 垂直居中 */
    justify-content: center; /* 水平居中 */
}
</style>