<template>
	<section> 
		<el-row :class="{'row-box':true,'cfg':isRptCfg}">
			<div class="rpt-title">{{ rawDatas.name }}</div>
			<el-input class="input" v-model="rawDatas.name" placeholder="报告名称"/>
		</el-row>
		<el-row :class="{'row-box':true,'cfg':isRptCfg}">
			<div class="title">{{ title?title:'报告概览' }}</div>
			<el-input class="input" v-model="title" placeholder="报告概览"/>
		</el-row> 
		<el-row  class="padding"> 
			<el-row class="padding-top padding-left padding-right">
				<span>责任人</span>
			</el-row>
				<el-row class="padding">				 
					<el-col :span="6">
						<mdp-select-user-xm label="负责人" userid-key="cuserid" username-key="cusername" v-model="rawDatas"></mdp-select-user-xm>
					</el-col> 
					<el-col :span="6">
						<mdp-select  show-style="x" label="状态" :dict="dicts['casedbStatus']" v-model="rawDatas.status"></mdp-select>
					</el-col> 
				</el-row>          
		<el-row class="padding-top padding-left padding-right">
			<span>报告总结</span>
		</el-row>
		<el-row> 
			<el-row class="padding">	
			<el-input  type="textarea" :rows="8" v-model="remark"></el-input>
			</el-row>
		</el-row> 
		</el-row> 
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import config from "@/common/config"; //全局公共库import
 	import { initDicts } from '@/api/xm/core/xmTestCasedb';
	import { mapGetters } from 'vuex'
	import XmProjectSelect from '@/views/xm/core/components/XmProjectSelect';
	
import  MdpSelectUserXm from '@/views/xm/core/components/MdpSelectUserXm';//修改界面
	export default {
	    name:'projectRptOverview',
	    components: {
			XmProjectSelect,MdpSelectUserXm,
        },
		computed: {
		    ...mapGetters([ 'userInfo'  ]), 

		},
		props:['xmTestCasedb','rptDatas','isRptCfg'],

		watch: {
	      'xmTestCasedb':function( xmTestCasedb ) {
	        if(xmTestCasedb){
	            this.rawDatas = {...xmTestCasedb};
	        }

	      },
	      'visible':function(visible) { 
	      	if(visible==true){
 	      		this.initData()
	      	}
	      } 
	    },
		data() {
			return {
				title:'',
				remark:'',
			    currOpType:'add',//add/edit
 				load:{ list: false, edit: false, del: false, add: false },//查询中...
				dicts:{
					casedbStatus:[], 

				},//下拉选择框的所有静态数据 params={categoryId:'all',itemCodes:['sex']} 返回结果 {sex: [{id:'1',name:'男'},{id:'2',name:'女'}]}
				rawDatasRules: {
					 
				},
				rawDatas: {
					id:'',name:'',casedbId:'',casedbName:'',projectId:'',projectName:'',cuserid:'',cusername:'',ctime:'',stime:'',etime:'',status:'',tcode:'',taskCnt:'',okCases:'',errCases:'',igCases:'',blCases:'',productId:'',productName:'',flowState:'',summaryRemark:''
				}, 
                maxTableHeight:300,
				summaryRemarkEditVisible:false,
			}//end return
		},//end data
		methods: {

		    ...util, 
			initData: function(){ 
			    if(this.xmTestCasedb){
                    this.rawDatas = Object.assign({},this.xmTestCasedb);
                } 
				if(this.rptDatas){
					this.rawDatas=Object.assign({},this.rptDatas)
				}
                this.rawDatasBak={...this.rawDatas}
            }, 
			sizeAutoChange(){
				
			}
		},//end method
		mounted() {
		    this.$nextTick(() => {
                initDicts(this);
                this.initData()
                this.maxTableHeight = util.calcTableMaxHeight(this.$refs.table.$el)
            });
		}
	}

</script>

<style lang="scss" scoped>  
@import '../index/overview.scss';
</style>