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
			<span>数据汇总</span>
		</el-row>
		<el-row ref="table">
			<el-row class="box padding" >
				<el-col :span="6" class="box-red">
					<div class="box-info">
							<div class="num">{{rawDatas.taskCnt?rawDatas.taskCnt:'0'}}个</div>
							<div class="label">总任务数</div>
					</div>
				</el-col>
				<el-col :span="6" class="box-blue">
					<div class="box-info">
							<div class="num">{{rawDatas.menuCnt?rawDatas.menuCnt:'0'}}个</div>
							<div class="label">需求数</div>
					</div>
				</el-col>
				<el-col :span="6" class="box-green">
					<div class="box-info">
							<div class="num">{{rawDatas.testCases?rawDatas.testCases:'0'}}个</div>
							<div class="label">测试用例数</div>
					</div>
				</el-col>
				<el-col :span="6" class="box-orange">
					<div class="box-info">
							<div class="num">{{rawDatas.bugCnt?rawDatas.bugCnt:0}}个</div>
							<div class="label">缺陷数</div>
					</div>
				</el-col>
			</el-row>
			</el-row>
			<el-row class="padding-top padding-left padding-right">
				<span>责任人</span>
			</el-row>
				<el-row class="padding">
					<el-col :span="6">
						<mdp-select-user label="主管领导" v-model="rawDatas.admUserid"></mdp-select-user>
					</el-col>
					<el-col :span="6">
						<mdp-select-user label="负责人" v-model="rawDatas.pmUserid"></mdp-select-user>
					</el-col>
					<el-col :span="6">
						<mdp-select-user label="助理" v-model="rawDatas.assUserid"></mdp-select-user>
					</el-col>
					<el-col :span="6">
						<mdp-select  show-style="x" label="状态" item-code="projectStatus" v-model="rawDatas.status"></mdp-select>
					</el-col>
				</el-row>

		 <el-row class="padding-top padding-left padding-right">
				<span>起始时间</span>
			</el-row>
				<el-row class="padding">
					<mdp-date-range :auto-default="false" placeholder="选择日期" v-model="rawDatas" start-key="startTime" end-key="endTime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd" ></mdp-date-range>
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
 	import { initDicts } from '@/api/xm/core/xmProject';
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
		props:['xmProject','rptDatas','isRptCfg'],

		watch: {
	      'xmProject':function( xmProject ) {
	        if(xmProject){
	            this.rawDatas = {...xmProject};
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
					projectStatus:[],

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
			    if(this.xmProject){
                    this.rawDatas = Object.assign({},this.xmProject);
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
