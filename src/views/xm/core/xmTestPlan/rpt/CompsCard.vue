<template>
<section>
    <el-row v-if="rptConfigVisible"  class="page-center border">
        <el-col :span="6" :style="{height:maxTableHeight+'px',overflow:'auto'}">
            <comps-set :comp-ids="compIds" @row-click="onCompSelect"></comps-set>
        </el-col>
        <el-col :span="18" :style="{height:maxTableHeight+'px',overflow:'auto'}" ref="table">
            <div>
                <div class="empty" v-if="compCfgList.length == 0" >
                    <el-empty description="暂未选择模块"></el-empty>
                </div>
                <div v-else>
                    <grid-layout
                        :layout.sync="compCfgList"
                        :col-num="layoutColNum"
                        :row-height="120"
                        :is-draggable="true"
                        :is-resizable="true"
                        :is-mirrored="false"
                        :vertical-compact="true"
                        :margin="[10, 10]"
                        :use-css-transforms="true"
                    > 
                        <grid-item
                            v-for="(item,index) in compCfgList"
                            :x="item.x"
                            :y="item.y"
                            :w="item.w"
                            :h="item.h"
                            :i="item.i"
                            :key="index">
                            <component :is="item.compId" :xm-test-plan="xmTestPlan" :comp-cfg="item"></component>
                        </grid-item>
                    </grid-layout>
                </div>
            </div>
        </el-col> 
    </el-row>
    <el-row v-if="rptConfigVisible==false" :style="{height:maxTableHeight+'px',overflow:'auto'}" ref="table" class="page-center border"> 
        <el-row v-for="(item,index) in initCompCfg" :key="index">
            <component :is="item.compId" :xm-test-plan="xmTestPlan" :comp-cfg="item"></component>
        </el-row>
    </el-row> 
    </section>
</template>

<script>  
 
import util from '@/common/js/util';//全局公共库
import seq from '@/common/js/sequence';//全局公共库
import VueGridLayout from 'vue-grid-layout';
import { mapGetters } from 'vuex'
import XmTestPlanMng from '@/views/xm/core/xmTestPlan/XmTestPlanMng'
import CompsSet from '@/views/xm/core/xmTestPlan/rpt/CompsSet'
import XmQuestionAgeDist from '@/views/xm/core/xmTestPlan/rpt/biz/questionAgeDist'
import xmQuestionAttDist from '@/views/xm/core/xmTestPlan/rpt/biz/questionAttDist' 
import xmQuestionHandlerUserSort from '@/views/xm/core/xmTestPlan/rpt/biz/questionHandlerUserSort'
import xmQuestionAskUserSort from '@/views/xm/core/xmTestPlan/rpt/biz/questionAskUserSort'
import xmQuestionMenuSort from '@/views/xm/core/xmTestPlan/rpt/biz/questionMenuSort'
import xmQuestionFuncSort from '@/views/xm/core/xmTestPlan/rpt/biz/questionFuncSort'
import xmTestPlanCaseExecStatusDist from '@/views/xm/core/xmTestPlan/rpt/biz/testPlanCaseExecStatusDist'
import xmTestPlanCaseUserDist from '@/views/xm/core/xmTestPlan/rpt/biz/testPlanCaseUserDist'


import { initDicts,listXmRptConfig, delXmRptConfig, batchDelXmRptConfig,editSomeFieldsXmRptConfig } from '@/api/xm/core/xmRptConfig';

export default {
    components: { 
        GridLayout: VueGridLayout.GridLayout,
        GridItem: VueGridLayout.GridItem,
        XmTestPlanMng,
        XmQuestionAgeDist, 
        xmQuestionAttDist,
        xmQuestionHandlerUserSort,xmQuestionAskUserSort,xmQuestionMenuSort,xmQuestionFuncSort,
        xmTestPlanCaseExecStatusDist,
        xmTestPlanCaseUserDist,
        CompsSet,

    },
    props:['xmTestPlan','rptConfigVisible'],
    computed: {
        ...mapGetters(['userInfo']), 
        compIds(){
            if(this.xmRptConfig && this.xmRptConfig.cfg){
                var cfgJson=JSON.parse(this.xmRptConfig.cfg)
                return cfgJson.map(k=>k.compId)
            }else{
                return []
            }
        },
        
    },

    watch: {
        xmRptConfig:{
            handler(){
                this.initCompCfgList();
            },
            deep:true,
        }
    },

    data() {
        return {
            xmRptConfig:null,
            compCfgList:[],
            maxTableHeight:300,
            // 布局位置数据
            initCompCfg: [
                 { i:1, x: 0,  y: 12,  w: 12, h: 6,  id:'xmQuestionAgeDist',name:'缺陷年龄分布',compId:'xmQuestionAgeDist', params:[] }, 
                 { i: 2, x: 0,  y: 12,  w: 12, h: 6, id:'xmQuestionAttDist',name:'缺陷属性分布',compId:'xmQuestionAttDist',  },
                 { i: 3, x: 0,  y: 12,  w: 12, h: 6,   id:'xmQuestionHandlerUserSort',name:'缺陷负责人排行榜',compId:'xmQuestionHandlerUserSort',  }, 
                 { i: 4, x: 0,  y: 12,  w: 12, h: 6,   id:'xmQuestionAskUserSort',name:'缺陷提出人排行榜', compId:'xmQuestionAskUserSort',  }, 
                 { i:5, x: 0,  y: 12,  w: 12, h: 6,   id:'xmQuestionMenuSort',name:'缺陷需求分布', compId:'xmQuestionMenuSort',  }, 
                 { i: 6, x: 0,  y: 12,  w: 12, h: 6,   id:'xmQuestionFuncSort',name:'缺陷模块分布', compId:'xmQuestionFuncSort',  },  
                 { i: 7, x: 0,  y: 12,  w: 12, h: 6,   id:'xmTestPlanCaseExecStatusDist',name:'用例执行结果分布', compId:'xmTestPlanCaseExecStatusDist',  }, 
                 { i: 8, x: 0,  y: 12,  w: 12, h: 6,   id:'xmTestPlanCaseUserDist',name:'用例执行人情况分布', compId:'xmTestPlanCaseUserDist',  }, 
                 
                 
            ],
            // 布局列数
            layoutColNum: 12, 
        }
    },

    methods: {  
        getXmRptConfig(){
            if(!this.xmTestPlan){
                return;
            }
            listXmRptConfig({bizId:this.xmTestPlan.id}).then(res=>{
                this.xmRptConfig=res.data.data[0] 
            })
        },
        initCompCfgList(){
            if(this.xmRptConfig && this.xmRptConfig.cfg){
                var cfgJson=JSON.parse(this.xmRptConfig.cfg) 
                this.compCfgList=cfgJson;
            }else{
                this.compCfgList=JSON.parse(JSON.stringify(this.initCompCfg))
            }
        },
        onCompSelect(comp){
            var compCfg={i:this.compCfgList.length+1, x: 0,  y: 12,  w: 12, h: 6, compId:comp.compId,name:comp.name,id:comp.compId+seq.sn(),params:[]} 
                this.compCfgList.push(compCfg) 
        }
         
    },

    mounted() {
        this.$nextTick(() => {
             
            this.maxTableHeight = util.calcTableMaxHeight(this.$refs.table.$el)
        })
    },

}
</script>

<style> 

</style>
