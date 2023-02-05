<template>  
    <section>
        <el-row> 
            <el-select v-model="filters.category" clearable @change="onCategroySelect" style="width:100%;" :disabled="true">
                <el-option v-for="(item,index) in categorys" :label="item" :value="item" :key="index"></el-option>
            </el-select>
        </el-row> 
        <el-row ref="table" :style="{height:maxTableHeight+'px',overflow:'auto'}"> 
                <div class="moduleset-lg hidden-md-and-down"> 
                    <div class="nav">
                        <draggable @update="datadragEnd" v-model="datas" style='sort: false' >
　　                        <transition-group >
                                <div class="nav_item"  :class="{itemActive: item.isChecked,curr:item.isCurr}" v-for="(item, index) in datas" :key="index" @click="selectItem(item, index)">
                                    <img :src="item.img" alt="">
                                    <div class="desc">
                                        <p>{{index+1}} {{item.rptName}}</p>
                                        <span>
                                            {{item.desc}}
                                        </span>
                                    </div> 
                                    <span class="check"><el-checkbox  v-model="item.isChecked" :true-label="'true'" :false-label="'false'" @change="onChange(item,$event)"></el-checkbox></span>
                                </div>
　　                        </transition-group>
                        </draggable>
                    </div>  
                </div> 
                <div class="moduleset-sm hidden-lg-and-up"> 
                    <div class="nav">
                        <draggable @update="datadragEnd" v-model="datas" style='sort: false' >
　　                        <transition-group >
                        <div class="nav_item" :class="{itemActive: item.isChecked,curr:item.isCurr}" v-for="(item, index) in datas" :key="index" @click="selectItem(item, index)">
                            <div class="title"><p>{{index+1}} {{item.rptName}}</p></div> 
                            <div class="context">
                                <img :src="item.img" alt=""></img>
                                <div class="desc">
                                    <span>{{item.desc}}</span>
                                </div>
                            </div>
                            <span class="check"><el-checkbox  v-model="item.isChecked" :true-label="'true'" :false-label="'false'" @change="onChange(item,$event)"></el-checkbox></span>
                        </div>
　　                        </transition-group>
                        </draggable>
                    </div>  
                </div>
        </el-row>
    </section>
</template>

<script>

import util from '@/common/js/util';//全局公共库
import pieSimple from '../images/pie-simple.png'
import lineStack from '../images/line-stack.png'
import areaStack from '../images/area-stack.png'
import ranjintu from '../images/ranjintu.png'
import datasetLink from '../images/dataset-link.png'
import bar from '../images/bar.png'
import draggable from 'vuedraggable'

import { mapGetters } from 'vuex'
import store from '@/store'

export default {
    props: ['category','showCheckedOnly'],
    components:{
        draggable
    },
    computed: {
        ...mapGetters(['userInfo']), 
        compsCpd(){
            var comps=this.rptListCpd; 
            if(this.showCheckedOnly){
                comps=comps.filter(k=>k.isChecked)
            } 
            comps.sort((i1,i2)=>{
                return i1.index-i2.index
            })
            return comps;
        },
        rptListCpd(){
            if(!this.filters.category){
                return this.comps;
            }else{
                return this.comps.filter(i=>i.category.indexOf(this.filters.category)>=0)
            }
            
        },
            
        categorys:function(){
            var map={}; 
            var list=[];
            this.comps.forEach(e => { 
                var cateList=e.category.split(",")
                cateList.forEach(cate=>{
                    if(!map[cate]){
                        list.push(cate);
                        map[cate]=cate
                    }
                }) 
                
            }); 
            return list;
        },
    },

    watch: {
        compsCpd(){ 
            this.datas= this.compsCpd; 
        }
    },

    data() {
        return { 
            
                filterVisible:false,
				filters:{
                category:'企业级'
            },
            datas:[],
            comps: [
                {isChecked:false,isCurr:false,rptName:'迭代总结',category:'迭代级',compId:'xmIterationRptOverview',desc:'显示迭代总体情况',img:pieSimple  },
                {isChecked:false,isCurr:false,rptName:'迭代燃尽图',category:'迭代级',compId:'xmIterationBurnout',desc:'跟踪迭代的剩余工作量按日期变化趋势，识别迭代当前进度情况',img:ranjintu },
                {isChecked:false,isCurr:false,rptName:'需求每日趋势',category:'迭代级',compId:'xmIterationMenuDayTrend',desc:'跟踪未开始、执行中、已完成、已关闭状态的需求数量按日期变化趋势，识别需求工作情况',img:lineStack  },
                {isChecked:false,isCurr:false,rptName:'需求每日累积',category:'迭代级',compId:'xmIterationMenuDayAccumulate',desc:'跟踪未开始、执行中、已完成、已关闭状态的需求数量按日期累积情况，识别需求工作的瓶颈',img:areaStack  },
                {isChecked:false,isCurr:false,rptName:'迭代工作项每日趋势',category:'迭代级',compId:'xmIterationWorkItemDayList',desc:'统计迭代每日工作项数量分布情况',img:datasetLink  },  
                {isChecked:false,isCurr:false,rptName:'迭代缺陷每日趋势',category:'迭代级',compId:'xmIterationQuestionDayTrend',desc:'跟踪新提出、执行中、已解决、已关闭状态的缺陷数量按日期变化趋势，识别缺陷处理工作情况',img:lineStack  },
                {isChecked:false,isCurr:false,rptName:'迭代缺陷每日累积',category:'迭代级',compId:'xmIterationQuestionDayAccumulate',desc:'跟踪一段时间内，各种程度和类别的缺陷累积情况，监控缺陷的变化趋势',img:areaStack  },
                
                //企业级报表
                {isChecked:false,isCurr:false,rptName:'企业总结',category:'企业级',compId:'xmBranchRptOverview',desc:'显示企业总体情况',img:pieSimple  },
                {isChecked:false,isCurr:false,rptName:'企业缺陷每日趋势',category:'企业级',compId:'xmBranchQuestionDayTrend',desc:'跟踪新提出、执行中、已解决、已关闭状态的缺陷数量按日期变化趋势，识别缺陷处理工作情况',img:lineStack  },
                {isChecked:false,isCurr:false,rptName:'企业工作项每日趋势',category:'企业级',compId:'xmBranchWorkItemDayList',desc:'统计迭代每日工作项数量分布情况',img:datasetLink  },  
                //{isChecked:false,isCurr:false,rptName:'企业缺陷每日趋势',category:'企业级',compId:'xmBranchQuestionDayTrend',desc:'跟踪新提出、执行中、已解决、已关闭状态的缺陷数量按日期变化趋势，识别缺陷处理工作情况',img:lineStack  },
                {isChecked:false,isCurr:false,rptName:'企业缺陷每日累积',category:'企业级',compId:'xmBranchQuestionDayAccumulate',desc:'跟踪一段时间内，各种程度和类别的缺陷累积情况，监控缺陷的变化趋势',img:areaStack  },
                {isChecked:false,isCurr:false,rptName:'需求每日趋势',category:'企业级',compId:'xmBranchMenuDayTrend',desc:'跟踪未开始、执行中、已完成、已关闭状态的需求数量按日期变化趋势，识别需求工作情况',img:lineStack  },
                {isChecked:false,isCurr:false,rptName:'需求每日累积',category:'企业级',compId:'xmBranchMenuDayAccumulate',desc:'跟踪未开始、执行中、已完成、已关闭状态的需求数量按日期累积情况，识别需求工作的瓶颈',img:areaStack  },
                
                //产品报表
                {isChecked:false,isCurr:false,rptName:'产品总结',category:'产品级',compId:'xmProductRptOverview',desc:'显示产品总体情况',img:pieSimple  },
                {isChecked:false,isCurr:false,rptName:'产品工作项每日趋势',category:'产品级',compId:'xmProductWorkItemDayList',desc:'统计产品每日工作项数量分布情况',img:datasetLink  },  
                {isChecked:false,isCurr:false,rptName:'需求每日趋势',category:'产品级',compId:'xmMenuDayTrend',desc:'跟踪未开始、执行中、已完成、已关闭状态的需求数量按日期变化趋势，识别需求工作情况',img:lineStack  },
                {isChecked:false,isCurr:false,rptName:'需求每日累积',category:'产品级',compId:'xmMenuDayAccumulate',desc:'跟踪未开始、执行中、已完成、已关闭状态的需求数量按日期累积情况，识别需求工作的瓶颈',img:areaStack  },
                {isChecked:false,isCurr:false,rptName:'需求属性分布',category:'产品级,迭代级,企业级',compId:'xmMenuAttDist',desc:'统计所有需求任意属性数量分布情况（实时数据）',img:pieSimple  },
                {isChecked:false,isCurr:false,rptName:'需求年龄分布',category:'产品级,迭代级,企业级',compId:'xmMenuAgeDist',desc:'统计所有需求年龄分布情况（实时数据）',img:pieSimple  },
                {isChecked:false,isCurr:false,rptName:'需求排行榜',category:'产品级,迭代级,企业级',compId:'xmMenuSort',desc:'按提出人、负责人、迭代、产品等维度统计用户故事数量按高到低进行排行（实时数据）',img:bar  },
                {isChecked:false,isCurr:false,rptName:'模块需求数量统计',category:'产品级,迭代级,企业级',compId:'xmMenuFuncSort',initGroupBy:'func_id',desc:'统计每个模块当前的需求数量（实时数据）',img:bar  },
                {isChecked:false,isCurr:false,rptName:'迭代需求数量统计',category:'产品级,迭代级,企业级',compId:'xmMenuIterationSort',initGroupBy:'iteration_id',desc:'统计每个迭代当前的需求数量（实时数据）',img:bar  },
                {isChecked:false,isCurr:false,rptName:'产品需求数量统计',category:'产品级,企业级',compId:'xmMenuProductSort',initGroupBy:'product_id',desc:'统计每个产品当前的需求数量（实时数据）',img:bar  },
                {isChecked:false,isCurr:false,rptName:'产品缺陷每日趋势',category:'产品级',compId:'xmQuestionDayTrend',desc:'跟踪新提出、执行中、已解决、已关闭状态的缺陷数量按日期变化趋势，识别缺陷处理工作情况',img:lineStack  },
                {isChecked:false,isCurr:false,rptName:'产品缺陷每日累积',category:'产品级',compId:'xmQuestionDayAccumulate',desc:'跟踪一段时间内，各种程度和类别的缺陷累积情况，监控缺陷的变化趋势',img:areaStack  },
                
                //项目报表
                {isChecked:false,isCurr:false,rptName:'项目总结',category:'项目级',compId:'xmProjectRptOverview',desc:'显示项目总体情况',img:pieSimple  },
                {isChecked:false,isCurr:false,rptName:'项目工作项每日趋势',category:'项目级',compId:'xmProjectWorkItemDayList',desc:'统计项目每日工作项数量分布情况',img:datasetLink  },
                {isChecked:false,isCurr:false,rptName:'任务每日趋势',category:'项目级',compId:'xmTaskDayTrend',desc:'跟踪未开始、执行中、已完成、已关闭状态的任务数量按日期变化趋势，识别任务工作情况',img:lineStack  },
                {isChecked:false,isCurr:false,rptName:'任务每日累积',category:'项目级',compId:'xmTaskDayAccumulate',desc:'跟踪未开始、执行中、已完成、已关闭状态的任务数量按日期累积情况，识别任务工作的瓶颈',img:areaStack  },
                {isChecked:false,isCurr:false,rptName:'任务属性分布',category:'项目级,企业级',compId:'xmTaskAttDist',desc:'统计所有任务任意属性数量分布情况（实时数据）',img:pieSimple  },
                {isChecked:false,isCurr:false,rptName:'任务年龄分布',category:'项目级,企业级',compId:'xmTaskAgeDist',desc:'统计所有任务年龄分布情况（实时数据）',img:pieSimple  },
                {isChecked:false,isCurr:false,rptName:'任务排行榜',category:'项目级,企业级',compId:'xmTaskSort',desc:'任务提出人、负责人的用户故事数量排行（实时数据）',img:bar  },
                {isChecked:false,isCurr:false,rptName:'项目结算工时每日趋势',category:'项目级',compId:'xmProjectWorkloadSetDayList',desc:'统计项目每日登记工时、结算工时数量分布情况',img:datasetLink  },
                {isChecked:false,isCurr:false,rptName:'项目结算工时每月趋势',category:'项目级',compId:'xmProjectWorkloadSetMonthList',desc:'统计项目每月登记工时、结算工时数量分布情况',img:datasetLink  },


                //测试库级报表  
                {isChecked:false,isCurr:false,rptName:'测试计划总结',category:'测试计划级',compId:'xmTestPlanRptOverview',desc:'显示测试计划总体情况',img:pieSimple  },
                {isChecked:false,isCurr:false,rptName:'测试库总体测试总结',category:'测试库级',compId:'xmTestCasedbRptOverview',desc:'显示测试库总体情况',img:pieSimple  },

                {isChecked:false,isCurr:false,rptName:'测试用例规划分析',category:'测试计划级,测试库级,项目级,产品级,迭代级,企业级',compId:'xmTestCaseToPlanCalc',desc:'显示用例被规划到测试计划中的次数统计',img:pieSimple  },
                {isChecked:false,isCurr:false,rptName:'测试用例需求覆盖分析',category:'测试计划级,测试库级,项目级,产品级,迭代级,企业级',compId:'xmTestCaseMenuSort',initGroupBy:'menu_id',desc:'统计测试用例需求覆盖情况',img:bar  },
                {isChecked:false,isCurr:false,rptName:'测试用例模块覆盖分析',category:'测试计划级,测试库级,项目级,产品级,迭代级,企业级',compId:'xmTestCaseFuncSort',initGroupBy:'func_id',desc:'统计测试用例覆盖各个模块的情况',img:bar  },
                {isChecked:false,isCurr:false,rptName:'测试用例负责人排行榜',category:'测试计划级,测试库级,项目级,产品级,迭代级,企业级',compId:'xmTestCaseCuserSort',initGroupBy:'cuserid',desc:'统计测试团队每个人负责的测试用例数并进行排序',img:bar  },

                {isChecked:false,isCurr:false,rptName:'测试用例执行状态分布',category:'测试计划级,测试库级,项目级,产品级,迭代级,企业级',compId:'xmTestPlanCaseExecStatusDist',desc:'按测试用例执行结果统计，通过、失败、忽略、阻塞',img:pieSimple  },
                {isChecked:false,isCurr:false,rptName:'测试用例执行用户分布',category:'测试计划级,测试库级,项目级,产品级,迭代级,企业级',compId:'xmTestPlanCaseUserDist',desc:'统计测试用例负责人用例执行情况',img:bar  },
                {isChecked:false,isCurr:false,rptName:'缺陷回归分布',category:'测试计划级,测试库级,项目级,产品级,迭代级,企业级',compId:'xmQuestionRetestDist',desc:'统计项目中缺陷在回归测试中分布情况，跟踪缺陷的重新打开率；',img:pieSimple  },
                {isChecked:false,isCurr:false,rptName:'测试次数每日统计',category:'测试计划级,测试库级,项目级,产品级,迭代级,企业级',compId:'xmTestDayTimesCalc',desc:'统计每日测试用例执行数量',img:bar  },
                {isChecked:false,isCurr:false,rptName:'缺陷状态分布',category:'测试计划级,测试库级,项目级,产品级,迭代级,企业级',compId:'xmQuestionStateDist',desc:'跟踪新提出、执行中、已解决、已关闭状态的缺陷数量按日期变化趋势，识别缺陷处理工作情况',img:pieSimple  },

                {isChecked:false,isCurr:false,rptName:'缺陷排行榜',category:'测试计划级,测试库级,项目级,产品级,迭代级,企业级',compId:'xmQuestionSort',desc:'从缺陷提出人、创建人、负责人、故事等维度统计缺陷数量排行榜（实时数据）',img:bar  },
                {isChecked:false,isCurr:false,rptName:'缺陷提出人排行榜',category:'测试计划级,测试库级,项目级,产品级,迭代级,企业级',compId:'xmQuestionAskUserSort',initGroupBy:'ask_userid',desc:'从缺陷提出人、创建人、负责人、故事等维度统计缺陷数量排行榜（实时数据）',img:bar  },
                {isChecked:false,isCurr:false,rptName:'缺陷负责人排行榜',category:'测试计划级,测试库级,项目级,产品级,迭代级,企业级',compId:'xmQuestionHandlerUserSort',initGroupBy:'handler_userid',desc:'从缺陷提出人、创建人、负责人、故事等维度统计缺陷数量排行榜（实时数据）',img:bar  },
                {isChecked:false,isCurr:false,rptName:'缺陷模块排行榜',category:'测试计划级,测试库级,项目级,产品级,迭代级,企业级',compId:'xmQuestionFuncSort',initGroupBy:'func_id',desc:'从缺陷提出人、创建人、负责人、故事等维度统计缺陷数量排行榜（实时数据）',img:bar  },
                {isChecked:false,isCurr:false,rptName:'缺陷需求排行榜',category:'测试计划级,测试库级,项目级,产品级,迭代级,企业级',compId:'xmQuestionMenuSort',initGroupBy:'menu_id',desc:'从缺陷提出人、创建人、负责人、故事等维度统计缺陷数量排行榜（实时数据）',img:bar  },
                {isChecked:false,isCurr:false,rptName:'缺陷属性分布',category:'测试计划级,测试库级,项目级,产品级,迭代级,企业级',compId:'xmQuestionAttDist',desc:'统计所有缺陷任意属性数量分布情况（实时数据）',img:pieSimple  },
                {isChecked:false,isCurr:false,rptName:'缺陷年龄分布',category:'测试计划级,测试库级,项目级,产品级,迭代级,企业级',compId:'xmQuestionAgeDist',desc:'统计所有缺陷按照年龄的分布情况，跟踪缺陷的生命周期和响应情况',img:pieSimple  },
                
            ],
            maxTableHeight:300,
            
        }
    },

    methods: { 
        setChecked(compId,checked){
            var com=this.comps.find(c=>c.compId==compId)
            if(com){
                com.isChecked=checked
            }
        },
        setCheckeds(compIds,checked){
                   
            this.comps.forEach(k=>{
                if(compIds.some(c=>c==k.compId)){
                    k.isChecked=checked
                }else{
                    k.isChecked=!checked
                }
            }) 
        },
        onChange(comp,checked){ 
            this.$emit('change',comp,checked) 
        },
        onCategroySelect(){
            this.selectItem(this.rptListCpd[0])
        },
         selectItem(item){  
            
            this.comps.forEach(k=>k.isCurr=false)
            item.isCurr=true 
            item.isChecked=true;
            this.$emit("row-click",item)
         },
         datadragEnd(evt){ 
            
            evt.preventDefault();
            console.log('拖动前的索引 :' + evt.oldIndex)
            console.log('拖动后的索引 :' + evt.newIndex)  
             this.$emit('sort',evt,this.datas)
         }


    },
    mounted(){
        store.dispatch("toggleSideBar",false)
        this.comps.forEach((k,index)=>k.index=index)
        //this.comps.forEach(k=>k.id=k.id?k.id:k.compId) 
        this.maxTableHeight = util.calcTableMaxHeight(this.$refs.table.$el)
        if(this.category){
            this.filters.category=this.category
        }else{
            if(this.xmTestPlan && this.xmTestPlan.id){
                this.filters.category="测试计划级"
            }else if(this.xmIteration && this.xmIteration.id){
                this.filters.category="迭代级"
            }else if(this.xmTestCasedb && this.xmTestCasedb.id){
                this.filters.category="测试库级"
            }else if(this.xmProject && this.xmProject.id){
                this.filters.category="项目级"
            }else if(this.xmProduct && this.xmProduct.id){
                this.filters.category="产品级"
            }else{
                this.filters.category="企业级" 
            }
        } 
     }
     

}
</script>
 

<style lang="scss" scoped> 


.moduleset-lg { 

.nav { 
    overflow: hidden; 
    display:flex;
    align-items:center;
    justify-content: space-between;
    flex-wrap:wrap;
    padding-right: 5px;
    .nav_item { 
        padding:5px;
        display: flex; 
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
            object-fit:cover;
            max-width: 25%;
            max-height: 100%; 
            margin-right: 5px;
        }
        p {
            font-size: 16px;
            font-weight: bold;
            color: #7D7D7D;
            margin-bottom: 10px;
        }
        span {
            font-size: 14px;
            color: #7D7D7D;
            line-height: 16px;  
        }
        .check {
            position: absolute;
            top: 5px;
            right: 5px;
            font-size: 30px;
            color: #90B1F4;
        }
    }
    .itemActive {
        border: 2px solid #90B1F4;
        box-shadow: 0px 3px 4px 0px rgba(186, 184, 184, 0.1);
    }
    
    .curr {  
        background-color: #cbd2df;
    }
}
}
.moduleset-sm { 

.nav { 
    overflow: hidden; 
    display:flex;
    align-items:center;
    justify-content: space-between;
    flex-wrap:wrap;
    padding-right: 5px;
    .nav_item { 
        padding:2px; 
        flex-direction: row; 
        border: 2px solid #EDF0F9;
        box-shadow: 0px 3px 4px 0px rgba(186, 184, 184, 0.1);
        border-radius: 8px;
        align-items: center;
        position: relative;
        cursor: pointer;
        margin-top: 5px;
        width:100%;
        .title{
            width:100%;
            p {
                font-size: 14px;
                font-weight: bold;
                color: #7D7D7D;
                margin-bottom: 5px;
                margin-top: 5px;
            }
        }
        .context{
            display: flex;
            width: 100%;
            padding: 2px;
            img {
                object-fit:cover;
                max-width: 25%;
                max-height: 100%; 
                padding: 2px;
            }
            .desc{
                width:75%;
                span {
                    font-size: 10px;
                    color: #7D7D7D;
                    line-height: 12px;    
                }
            }
            
        }
        
        
        .check {
            position: absolute;
            top: 5px;
            right: 5px;
            font-size: 20px;
            color: #90B1F4;
        }
    }
    .itemActive {
        border: 2px solid #90B1F4;
        box-shadow: 0px 3px 4px 0px rgba(186, 184, 184, 0.1);
    }
    .curr {  
        background-color: #90B1F4;
    }
}
}
</style>