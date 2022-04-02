<template>
	<section class="padding">
		<el-row class="page-main "> 
            <el-select v-model="filters.category" clearable>
                <el-option v-for="(item,index) in categorys" :label="item" :value="item" :key="index"></el-option>
            </el-select>
		</el-row>
		<el-row class="padding">
			 <el-row  :style="{overflowX:'hidden',height:maxTableHeight+'px'}"  ref="table">
                <el-col  v-cloak v-for="(p,i) in rptListCpd" :key="i" :xl="4" :lg="6" :md="8" :sm="12" :body-style="{ padding: '0px' }">
                    <el-card @click.native="intoInfo(p,i)" class="project-card" shadow="always" id="prj-view-box">
                        <img src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png" class="image">
                        <div style="padding: 14px;">
                            <span>{{p.rptName}}</span> 
                        </div>
                    </el-card>
                </el-col>
            </el-row>
		</el-row>
        <xm-iteration-burnout ref="xmIterationBurnout"></xm-iteration-burnout>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import { initSimpleDicts } from '@/api/mdp/meta/item';//下拉框数据查询  
	import { mapGetters } from 'vuex'	
    import xmIterationBurnout from './iteration/burnout'
	
	export default { 
        
		components: {   
            xmIterationBurnout
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
                    {rptName:'迭代燃尽图',category:'迭代级',ref:'xmIterationBurnout' }
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
   .image {
    width: 100%;
    display: block;
  }
</style>