<template> 
<div class="moduleset"> 
    <div class="nav">
       <div class="nav_item" :class="{itemActive: item.isChecked}" v-for="(item, index) in compsCpd" :key="index" @click="selectItem(item, index)">
           <img :src="item.icon" alt="">
           <div class="desc">
               <p>{{item.compName}}</p>
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
                    compName: '报告总览',
                    compDesc: '可以直接显示全部待审批列表，也可根据审批分类详细筛选单条待审批事项',
                    isChecked: false,
                },
                {
                    compId: 'xmTestRptSummary',
                    icon: img2,
                    compName: '报告总结',
                    compDesc: '可以直接显示全部任务列表，也可根据状态、类型详细筛选分类的任务',
                    isChecked: false,
                },
                {
                    compId: 'xmTestPlanCaseResultDist',
                    icon: img3,
                    compName: '执行结果分布',
                    compDesc: '可以直接显示全部项目列表，也可根据项目状态产品筛选单条项目',
                    isChecked: false,
                },
                {
                    compId: 'xmTestPlanCaseUserResultDist',
                    icon: img3,
                    compName: '成员执行结果分布',
                    compDesc: '可以直接显示全部项目列表，也可根据项目状态产品筛选单条项目',
                    isChecked: false,
                },
                {
                    compId: 'xmTestDayTimesCalc',
                    icon: img4,
                    compName: '每日测试次数统计',
                    compDesc: '可以直接显示全部产品列表，可新增我的产品',
                    isChecked: false,
                },
                {
                    compId: 'xmQuestionFuncDist',
                    icon: img4,
                    compName: '缺陷模块分布',
                    compDesc: '可以直接显示全部产品列表，可新增我的产品',
                    isChecked: false,
                },
                {
                    compId: 'xmQuestionStateDist',
                    icon: img4,
                    compName: '缺陷状态分布',
                    compDesc: '可以直接显示全部产品列表，可新增我的产品',
                    isChecked: false,
                },
                {
                    compId: 'xmQuestionReTestingDist',
                    icon: img4,
                    compName: '缺陷回归分布',
                    compDesc: '可以直接显示全部产品列表，可新增我的产品',
                    isChecked: false,
                },
                {
                    compId: 'xmQuestionAttDist',
                    icon: img4,
                    compName: '缺陷属性分布',
                    compDesc: '可以直接显示全部产品列表，可新增我的产品',
                    isChecked: false,
                },
                {
                    compId: 'xmQuestionAgeDist',
                    icon: img4,
                    compName: '缺陷年龄分布',
                    compDesc: '可以直接显示全部产品列表，可新增我的产品',
                    isChecked: false,
                } 
            ],
            
        }
    },

    methods: {
         selectItem(item){
            item.isChecked=!item.isChecked
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