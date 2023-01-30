<template> 
<div class="moduleset"> 
    <div class="nav">
       <div class="nav_item" :class="{itemActive: item.isChecked}" v-for="(item, index) in compsCpd" :key="index" @click="selectItem(item, index)">
           <img :src="item.icon" alt="">
           <div class="desc">
               <p>{{item.name}}</p>
               <span>
                  {{item.compDesc}}
               </span>
           </div>
           <i v-if="item.isChecked" class="el-icon-success"></i>
       </div>
    </div>  
</div>
</template>

<script>
import img1 from '../../../../myWork/img/dsp.png'
import img2 from '../../../../myWork/img/wdrw.png'
import img3 from '../../../../myWork/img/wdxm.png'
import img4 from '../../../../myWork/img/wdcp.png'

import pieSimple from './images/pie-simple.png'
import lineStack from './images/line-stack.png'
import areaStack from './images/area-stack.png'
import ranjintu from './images/ranjintu.png'
import datasetLink from './images/dataset-link.png'
import bar from './images/bar.png'

import { mapGetters } from 'vuex'
 

export default {
    props: ['compIds' ],
    computed: {
        ...mapGetters(['userInfo']), 
        compsCpd(){
            var comps=this.comps;
            if(this.compIds && this.compIds.length>0){
                 comps.forEach(i=>{
                    i.isChecked=this.compIds.some(k=>k==i.compId)
                 })
            }
            return comps;
        }
    },

    watch: {
         
    },

    data() {
        return { 
            comps: [
                {
                    compId: 'xmTestRptOverview',
                    icon: img1,
                    name: '报告总览',
                    compDesc: '测试报告总体概览，包括测试总结，测试用例总数、通过率、覆盖率、缺陷数、测试时间等',
                    isChecked: false,
                }, 
                {
                    compId: 'xmTestCaseToPlanCalc',
                    icon: pieSimple,
                    name: '用例规划分析',
                    compDesc: '统计用例库中规划到测试计划的用例数量情况',
                    isChecked: false,
                },
                {
                    compId: 'xmTestPlanCaseExecStatusDist',
                    icon: pieSimple,
                    name: '用例执行结果分布',
                    compDesc: '按测试用例执行结果统计，通过、失败、忽略、阻塞',
                    isChecked: false,
                },
                {
                    compId: 'xmTestPlanCaseUserDist',
                    icon: bar,
                    name: '测试用例成员执行结果分布',
                    compDesc: '统计测试用例负责人用例执行情况',
                    isChecked: false,
                },
                {
                    compId: 'xmTestDayTimesCalc',
                    icon: lineStack,
                    name: '每日测试次数统计',
                    compDesc: '统计每日执行的测试用例数',
                    isChecked: false,
                },
                {
                    compId: 'xmQuestionFuncSort',
                    icon: lineStack,
                    name: '缺陷模块分布',
                    compDesc: '统计缺陷在各个模块的分布情况',
                    isChecked: false,
                },
                {
                    compId: 'xmQuestionMenuSort',
                    icon: lineStack,
                    name: '缺陷故事分布',
                    compDesc: '统计缺陷在各个用户故事的分布情况',
                    isChecked: false,
                }, 
                {
                    compId: 'xmQuestionAskUserSort',
                    icon: bar,
                    name: '缺陷提出人排行榜',
                    compDesc: '统计每个提出人的缺陷总数，并按大小进行排序',
                    isChecked: false,
                },
                {
                    compId: 'xmQuestionHandlerUserSort',
                    icon: bar,
                    name: '缺陷负责人员排行榜',
                    compDesc: '统计每个负责人的缺陷总数，并按大小进行排序',
                    isChecked: false,
                },
                {
                    compId: 'xmQuestionRetestDist',
                    icon: pieSimple,
                    name: '缺陷回归测试分布',
                    compDesc: '统计回归测试的次数与缺陷数',
                    isChecked: false,
                },
                {
                    compId: 'xmQuestionAttDist',
                    icon: pieSimple,
                    name: '缺陷属性分布',
                    compDesc: '按缺陷的属性进行统计，多种属性可选择',
                    isChecked: false,
                },
                {
                    compId: 'xmQuestionBugStatusDist',
                    icon: pieSimple,
                    name: '缺陷状态分布',
                    compDesc: '按缺陷状态进行分组统计',
                    isChecked: false,
                },
                {
                    compId: 'xmQuestionBugReasonDist',
                    icon: pieSimple,
                    name: '缺陷原因分布',
                    compDesc: '按缺陷原因进行分组统计',
                    isChecked: false,
                },
                {
                    compId: 'xmQuestionBugTypeDist',
                    icon: pieSimple,
                    name: '缺陷类型分布',
                    compDesc: '按缺陷类型进行分组统计',
                    isChecked: false,
                },
                {
                    compId: 'xmQuestionRepRateDist',
                    icon: pieSimple,
                    name: '缺陷重新频率分布',
                    compDesc: '按缺陷出现频率进行分组统计',
                    isChecked: false,
                },
                {
                    compId: 'xmQuestionBugSolutionDist',
                    icon: pieSimple,
                    name: '缺陷解决方案分布',
                    compDesc: '按缺陷解决方案进行分组统计',
                    isChecked: false,
                },
                {
                    compId: 'xmQuestionBugSeverityDist',
                    icon: pieSimple,
                    name: '缺陷紧急程度分布',
                    compDesc: '按缺陷紧急程度进行分组统计',
                    isChecked: false,
                },
                {
                    compId: 'xmQuestionPriorityDist',
                    icon: pieSimple,
                    name: '缺陷优先级分布',
                    compDesc: '按缺陷优先级进行分组统计',
                    isChecked: false,
                },
                {
                    compId: 'xmQuestionAgeDist',
                    icon: pieSimple,
                    name: '缺陷年龄分布',
                    compDesc: '统计各个时间长度的缺陷总数',
                    isChecked: false,
                } 
            ],
            
        }
    },

    methods: {
         selectItem(item){ 
             this.$emit("row-click",item)
         }


    }

}
</script>

<style lang="scss">
.moduleset .el-dialog__header {
    padding: 0;
}
.moduleset .el-divider--horizontal {
    margin: 0 !important;
}
</style>

<style lang="scss" scoped>
.moduleset {
    .dialog-title {
        font-size: 22px;
        font-weight: bold;
        color: #7D7D7D;
        height: 68px;
        p {
           line-height: 68px;
           margin-left: 28px;
        }
    }
    .toolBox {
        display: flex;
        flex-direction: column;
        .selectItem {
            display: flex;
            flex-direction: row;
            height: 70px;
            .item {
                display: flex;
                flex-direction: row;
                margin-right: 120px;
                cursor: pointer;
                margin: 25px 50px 0 20px;
                img {
                    width: 45px;
                    height: 45px;
                }
                span {
                    margin-left: 8px;
                }
            }
        }
    }

    .nav { 
        overflow: auto;
        padding:0px 10px 0 20px;
        display:flex;
        align-items:center;
        justify-content: space-between;
        flex-wrap:wrap;
        .nav_item {
            display: flex;
            height: 138px;
            flex-direction: row; 
            border: 2px solid #EDF0F9;
            box-shadow: 0px 3px 4px 0px rgba(186, 184, 184, 0.1);
            border-radius: 8px;
            align-items: center;
            position: relative;
            cursor: pointer;
            margin-top: 10px;
            width:100%;
            img {
                width: 94px;
                height: 94px;
                margin: 0 18px;
            }
            p {
                font-size: 20px;
                font-weight: bold;
                color: #7D7D7D;
                margin-bottom: 10px;
            }
            span {
                font-size: 14px;
                color: #7D7D7D;
                line-height: 26px;
            }
            i {
                position: absolute;
                top: 10px;
                right: 20px;
                font-size: 36px;
                color: #90B1F4;
            }
        }
        .itemActive {
            border: 2px solid #90B1F4;
            box-shadow: 0px 3px 4px 0px rgba(186, 184, 184, 0.1);
        }
    }
}



</style>