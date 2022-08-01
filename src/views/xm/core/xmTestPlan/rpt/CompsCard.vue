<template>
<section>
    <el-row v-if="rptConfigVisible"  class="page-center border">
        <el-col :span="6" :style="{height:maxTableHeight+'px',overflow:'auto'}">
            <comps-set :comp-ids="compIds"></comps-set>
        </el-col>
        <el-col :span="18" :style="{height:maxTableHeight+'px',overflow:'auto'}" ref="table">
            <div>
                <div class="empty" v-if="layout.length == 0" >
                    <el-empty description="暂未选择模块"></el-empty>
                </div>
                <div v-else style="width: 100%; min-height: 800px; margin-top: 10px">
                    <grid-layout
                        :layout.sync="layout"
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
                            v-for="(item) in layout"
                            :x="item.x"
                            :y="item.y"
                            :w="item.w"
                            :h="item.h"
                            :i="item.i"
                            :key="item.i">
                            <component :is="item.compId"></component>
                        </grid-item>
                    </grid-layout>
                </div>
            </div>
        </el-col> 
    </el-row>
    <el-row v-if="rptConfigVisible==false" :style="{height:maxTableHeight+'px',overflow:'auto'}" ref="table" class="page-center border"> 
        <el-row v-for="(item,index) in layout" :key="index">
            <component :is="item.compId"></component>
        </el-row>
    </el-row> 
    </section>
</template>

<script>  
 
import util from '@/common/js/util';//全局公共库
import VueGridLayout from 'vue-grid-layout';
import { mapGetters } from 'vuex'
import XmTestPlanMng from '@/views/xm/core/xmTestPlan/XmTestPlanMng'
import CompsSet from '@/views/xm/core/xmTestPlan/rpt/CompsSet'
import XmQuestionAgeDist from '@/views/xm/core/xmTestPlan/rpt/biz/questionAgeDist'
import xmQuestionDayTrend from '@/views/xm/core/xmTestPlan/rpt/biz/questionDayTrend'
import xmQuestionDayAccumulate from '@/views/xm/core/xmTestPlan/rpt/biz/questionDayAccumulate'
import xmQuestionAttDist from '@/views/xm/core/xmTestPlan/rpt/biz/questionAttDist' 
import xmQuestionSort from '@/views/xm/core/xmTestPlan/rpt/biz/questionSort'

import { initDicts,listXmRptConfig, delXmRptConfig, batchDelXmRptConfig,editSomeFieldsXmRptConfig } from '@/api/xm/core/xmRptConfig';

export default {
    components: { 
        GridLayout: VueGridLayout.GridLayout,
        GridItem: VueGridLayout.GridItem,
        XmTestPlanMng,
        XmQuestionAgeDist,
        xmQuestionDayTrend,
        xmQuestionDayAccumulate,
        xmQuestionAttDist,
        xmQuestionSort,
        CompsSet,

    },
    props:['bizId','rptConfigVisible'],
    computed: {
        ...mapGetters(['userInfo']), 
        compIds(){
            if(this.xmRptConfig && this.xmRptConfig.cfg){
                var cfgJson=JSON.parse(this.xmRptConfig.cfg)
                return cfgJson.map(k=>k.id)
            }else{
                return []
            }
        }
    },

    watch: {
        
    },

    data() {
        return {
            xmRptConfig:null,
            maxTableHeight:300,
            // 布局位置数据
            layout: [
                 {   i: 0, x: 0,  y: 12,  w: 12, h: 4, compId:'XmQuestionAgeDist',  },
                 {   i: 1, x: 0,  y: 12,  w: 12, h: 4, compId:'xmQuestionDayTrend',  },
                 {   i: 2, x: 0,  y: 12,  w: 12, h: 4, compId:'xmQuestionDayAccumulate',  },
                 {   i: 3, x: 0,  y: 12,  w: 12, h: 4, compId:'xmQuestionAttDist',  },
                 {   i: 4, x: 0,  y: 12,  w: 12, h: 4, compId:'xmQuestionSort',  }, 
                 
            ],
            // 布局列数
            layoutColNum: 12, 
        }
    },

    methods: {  
        getXmRptConfig(){
            if(!this.bizId){
                return;
            }
            listXmRptConfig({bizId:this.bizId}).then(res=>{
                this.xmRptConfig=res.data.data[0] 
            })
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
