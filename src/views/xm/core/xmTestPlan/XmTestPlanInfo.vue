<template>
	<section>  
            <el-row v-if=" xmTestPlan && xmTestPlan.id">
                <el-row class="padding">
                     <el-button icon="el-icon-back" @click="goBackToPlanList()" type="primary" plain></el-button>
                     <el-divider direction="vertical"></el-divider> 
                     <el-link :type="subPage=='testPlanEdit'?'primary':''" @click="subPage='testPlanEdit'"><i class="el-icon-setting"></i>{{xmTestPlan.name}}</el-link> 
                     <el-divider direction="vertical"></el-divider>
                     <el-link :type="subPage=='testPlanEnv'?'primary':''" @click="subPage='testPlanEnv'"><i class="el-icon-setting"></i>&nbsp;环境变量</el-link>
                     <el-divider direction="vertical"></el-divider>
                     <el-link :type="subPage=='testPlanCase'?'primary':''" @click="subPage='testPlanCase'"><i class="el-icon-video-play"></i>&nbsp;执行测试</el-link>
                     <el-divider direction="vertical"></el-divider>
                     <el-link :type="subPage=='testBug'?'primary':''"  @click="subPage='testBug'"><i class="el-icon-question"></i>&nbsp;缺陷</el-link> 
                     <el-divider direction="vertical"></el-divider>
                     <el-link :type="subPage=='xmRpt'?'primary':''"  @click="subPage='xmRpt'"><i class="el-icon-s-data"></i>&nbsp;报表</el-link>
 
                      <span style="float:right;">
                        <span > 
                          <el-tag style="margin-top:5px;" class="hidden-md-and-down" v-for="(item,index) in formatDictsWithClass(dicts,'testPlanStatus',xmTestPlan.status)" :key="index" :type="item.className">{{item.name}}</el-tag> 
                          <span style="color:#C0C4CC;">&nbsp;通过率&nbsp;</span>{{calcTongGuoRate}}%&nbsp;&nbsp;<span style="color:#C0C4CC;">&nbsp;已测/总用例&nbsp;</span>{{calcYiCeshiCases}}&nbsp;/&nbsp;{{calcTotalCases}}&nbsp;&nbsp;
                           <div style="display:inline-flex" class="hidden-md-and-down"><el-progress  style="width:100px;" :stroke-width="22" :text-inside="true"  :status="calcYiCeshiCases>0 && xmTestPlan.errCases<=0 ?'success':'exception'" :percentage="calcProgress"></el-progress>
                           </div>
                        </span>
                        <span>
                        <el-divider direction="vertical"></el-divider>

                        <el-button @click="calcRptData" icon="el-icon-video-play">统计</el-button>  
                        </span>
                     </span>
                </el-row> 
                <el-row v-if="subPage=='testPlanEdit'" class="padding-left padding-right">
                     <xm-test-plan-edit   :xm-test-plan="xmTestPlan" :xm-test-casedb="xmTestCasedb"></xm-test-plan-edit>
                </el-row>
                <el-row v-if="subPage=='testPlanEnv'" class="padding-left padding-right">
                     <xm-test-plan-env   :xm-test-plan="xmTestPlan" :xm-test-casedb="xmTestCasedb"></xm-test-plan-env>
                </el-row>
                <el-row v-if="subPage=='testPlanCase'" class="padding-left padding-right">
                     <xm-test-plan-case-mng   :xm-test-plan="xmTestPlan" :xm-test-casedb="xmTestCasedb"></xm-test-plan-case-mng>
                </el-row>
                <el-row v-if="subPage=='testBug'"  class="padding-left padding-right">
                     <xm-question-mng :xm-test-plan="xmTestPlan" :xm-test-casedb="xmTestCasedb" :xm-product="{id:xmTestPlan.productId,productName:xmTestPlan.productName}" :sel-project="{id:xmTestPlan.projectId,name:xmTestPlan.projectName}"></xm-question-mng>
                </el-row>
                
                <el-row v-if="subPage=='testRpt'">
                     <xm-test-plan-rpt key="rpt"  ref="rpt" :xm-test-casedb="xmTestCasedb" :xm-test-plan="xmTestPlan" :xm-product="{id:xmTestCasedb.productId,productName:xmTestCasedb.productName}" :xm-project="{id:xmTestPlan.projectId,name:xmTestPlan.projectName}" category="测试计划级"></xm-test-plan-rpt >
                </el-row>
                
                <el-row v-if="subPage=='xmRpt'">
                     <xm-rpt key="xmRpt"  ref="xmRpt" :xm-test-casedb="xmTestCasedb" :xm-test-plan="xmTestPlan" :xm-product="{id:xmTestCasedb.productId,productName:xmTestCasedb.productName}" :xm-project="{id:xmTestPlan.projectId,name:xmTestPlan.projectName}"  category="测试计划级"></xm-rpt >
                </el-row>
            </el-row>    
	</section>
</template>

<script>

import util from '@/common/js/util';//全局公共库
import config from '@/common/config';//全局公共库
 import { mapGetters } from 'vuex'
import  XmProductSelect from '@/views/xm/core/components/XmProductSelect';//修改界面
import  XmQuestionMng from '@/views/xm/core/xmQuestion/XmQuestionMng';//修改界面
import { initDicts } from '@/api/xm/core/xmTestPlan';
import {  listXmTestPlan,calcXmTestPlan } from '@/api/xm/core/xmTestPlan'; 
 
export default {
    name:'xmTestCasedbMng',
    components: {
        XmProductSelect,XmQuestionMng,
        "xm-test-plan-rpt":()=>import("../../rpt/index/index.vue"), 
        "xm-rpt":()=>import("../../rpt/index"), 
        "xm-test-plan-env":()=>import("../xmTestPlan/XmTestPlanEnv.vue"),
        "xm-test-plan-edit":()=>import("../xmTestPlan/XmTestPlanEdit.vue"),
        "xm-test-plan-mng":()=>import("../xmTestPlan/XmTestPlanMng.vue"),
        "xm-test-case-mng":()=>import("../xmTestCase/XmTestCaseMng.vue"),
        "xm-test-plan-case-mng":()=>import("../xmTestPlanCase/XmTestPlanCaseMng.vue")
    },
    props:['visible','xmTestCasedb','xmTestPlan'],
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
            var totalCases=parseInt(this.xmTestPlan.totalCases||0)-parseInt(this.xmTestPlan.toTestCases||0)
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
        },
        xmTestPlan:{ 
            deep:true,
            handler(){
                 this.subPage="testPlanEdit"
            }
        }
    },
    data() {
        return {
             dicts:{
                testPlanStatus:[],
                testType:[]
             },
             subPage:'testPlanEdit',//testPlanCase,testBug
        }
    },//end data
    methods: {

        ...util, 
        showRptConfig(){
            this.$refs['rpt'].isRptCfg=true
        },
        showExportToolBar(){ 
           this.$refs['rpt'].showExportToolBar()

        },
        calcRptData(){ 
            var row=this.xmTestPlan
            calcXmTestPlan({id:row.id}).then(res=>{ 
                var tips=res.data.tips
                this.$notify({position:'bottom-left',showClose:true,message:tips.msg,type:tips.isOk?'success':'error'})
                if(tips.isOk){
                    listXmTestPlan({id:row.id}).then(res2=>{
                        this.xmTestPlan=res2.data.data[0]
                    })
                }
            }) 
        },
        goBackToPlanList(){
            this.$router.go(-1);
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