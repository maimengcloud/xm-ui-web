<template>
	<section class="padding">
		<el-row class="page-main "> 
            <el-select v-model="filters.category" clearable>
                <el-option v-for="(item,index) in categorys" :label="item" :value="item" :key="index"></el-option>
            </el-select>
		</el-row>
		<el-row class="padding">
			 <el-row  :style="{overflowX:'hidden',height:maxTableHeight+'px'}"  ref="table" :gutter="5">
                <el-col  v-cloak v-for="(p,i) in rptListCpd" :key="i" :xl="4" :lg="6" :md="8" :sm="12" :body-style="{ padding: '0px' }">
                    <el-card @click.native="intoInfo(p,i)" class="project-card" shadow="always" id="prj-view-box">
                        <img :src="p.img" class="image" style="width:100%;float:center;">
                        <div style="padding: 14px;">
                            <span>{{p.rptName}}</span> 
                            <div class="bottom clearfix">
                            <time class="time">{{ p.desc }}</time>
                            <el-button type="text" class="button"></el-button>
                            </div> 
                        </div>
                    </el-card>
                </el-col>
            </el-row>
		</el-row>
        <xm-iteration-burnout ref="xmIterationBurnout"></xm-iteration-burnout>
        <xm-menu-day-trend ref="xmMenuDayTrend"></xm-menu-day-trend>
        <xm-menu-day-accumulate ref="xmMenuDayAccumulate"></xm-menu-day-accumulate>
        <xm-menu-att-dist ref="xmMenuAttDist"></xm-menu-att-dist>
        <xm-menu-age-dist ref="xmMenuAgeDist"></xm-menu-age-dist>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import { initSimpleDicts } from '@/api/mdp/meta/item';//下拉框数据查询  
	import { mapGetters } from 'vuex'	
    import xmIterationBurnout from './iteration/burnout'
    import xmMenuDayTrend from './product/menuDayTrend'
    import xmMenuDayAccumulate from './product/menuDayAccumulate'
	import xmMenuAttDist from './product/menuAttDist'
	import xmMenuAgeDist from './product/menuAgeDist'
    import pieSimple from './images/pie-simple.png'
    import lineStack from './images/line-stack.png'
    import areaStack from './images/area-stack.png'
    import ranjintu from './images/ranjintu.png'
	export default { 
        
		components: {   
            xmIterationBurnout,xmMenuDayTrend,xmMenuDayAccumulate,xmMenuAttDist,xmMenuAgeDist,
		},
        props:['xmProduct','xmIteration','xmProject'],
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
		    ]),
			rptListCpd(){
                if(!this.filters.category){
                    return this.rptList;
                }else{
                     return this.rptList.filter(i=>i.category==this.filters.category)
                }
               
            },
            
			 categorys:function(){
                var map={}; 
                var list=[];
                this.rptList.forEach(e => { 
                    if(!map[e.category]){
                        list.push(e.category);
                        map[e.category]=e.category
                    }
                   
                }); 
                return list;
            },
            
        }, 
		watch: {  
	    },
		data() {
			return {
                filters:{
                    category:'', 
                },
				dicts:{},//下拉选择框的所有静态数据  params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				load:{ list: false, edit: false, del: false, add: false },//查询中... 
				dateRanger:[], 
                maxTableHeight:300,
                rptList:[/**{name:'报表名称',category:'报表分类，组织级、产品级、项目级、迭代级、需求、测试、任务',path:'路由路径',imgUrl:'图片路径',query:{参数}} */
                    {rptName:'迭代燃尽图',category:'迭代级',ref:'xmIterationBurnout',desc:'跟踪迭代的剩余工作量按日期变化趋势，识别迭代当前进度情况',img:ranjintu },
                    {rptName:'需求每日趋势',category:'产品级',ref:'xmMenuDayTrend',desc:'跟踪未开始、执行中、已完成、已关闭状态的需求数量按日期变化趋势，识别需求工作情况',img:lineStack  },
                    {rptName:'需求每日累积',category:'产品级',ref:'xmMenuDayAccumulate',desc:'跟踪未开始、执行中、已完成、已关闭状态的需求数量按日期累积情况，识别需求工作的瓶颈',img:areaStack  },
                    {rptName:'需求属性分布',category:'产品级',ref:'xmMenuAttDist',desc:'统计所有需求任意属性数量分布情况（实时数据）',img:pieSimple  },
                    {rptName:'需求年龄分布',category:'产品级',ref:'xmMenuAgeDist',desc:'统计所有需求年龄分布情况（实时数据）',img:pieSimple  },
                ],
			}//end return
		},//end data
		methods: {
			intoInfo(row) {   
                var params={...row}
                params.xmProduct=this.xmProduct
                params.xmProject=this.xmProject
                params.xmIteration=this.xmIteration
                this.$refs[row.ref].open(params);
			},
				
			
		},//end method
		mounted() {
			/**
 			initSimpleDicts('all',['demandSource','demandLvl','demandType','priority','menuStatus'] ).then(res=>{
				this.dicts=res.data.data;
			}) 
             */
            
            this.maxTableHeight = this.source == 'GZT' ? this.maxTableHeight : util.calcTableMaxHeight(this.$refs.table.$el); 
			
		}//end mounted
	}

</script>

<style scoped> 
  .time {
    font-size: 13px;
    color: #999;
  }
  
  .bottom {
    margin-top: 13px;
    line-height: 12px;
    height: 30px;
  }

  .button {
    padding: 0;
    float: right;
  }

  .image {  
    object-fit:cover;
    width: 100%;    
    display: block;
  }

  .clearfix:before,
  .clearfix:after {
      display: table;
      content: "";
  }
  
  .clearfix:after {
      clear: both
  }
</style>