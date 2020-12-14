<template>
	<section>
		<el-row class="app-container"> 
			<div class="project-info" v-loading.lock="load.list || load.edit">
				<div class="info-type">
					<el-radio-group v-model="infotype" size="medium">
						<el-radio-button label="任务"></el-radio-button>
						<el-radio-button label="阶段计划"></el-radio-button> 
					</el-radio-group> 
				</div>
				<div class="info-detail">
					<xm-task-template-mng v-if="infotype=='任务'" :sel-project-template="selProjectTemplate" ></xm-task-template-mng>
					<xm-project-phase-template-mng v-if="infotype=='阶段计划'" :sel-project-template="selProjectTemplate" ></xm-project-phase-template-mng> 
				</div>
			</div>
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	//import Sticky from '@/components/Sticky' // 粘性header组件
	//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { listXmProjectTemplate,editStatus , delXmProjectTemplate, batchDelXmProjectTemplate } from '@/api/xm/core/xmProject'; 
	import { mapGetters } from 'vuex';
	import xmTaskTemplateMng from '../xmTaskTemplate/XmTaskTemplateMng'; 
	import xmProjectTemplateEdit from './XmProjectTemplateEdit';
 	import xmProjectPhaseTemplateMng from '../xmProjectPhaseTemplate/XmProjectPhaseTemplateMng'; 
 
	export default { 
		props: ["selProjectTemplate"],
		computed: {
		    ...mapGetters([
		      'userInfo'
				]), 
		}, 
		watch:{
			selProjectTemplate:function(selProjectTemplate){
				var oldInfotype=this.infotype
				
				this.$nextTick(()=>{
					this.infotype=''
					this.infotype=oldInfotype
				})
			
			}
		},
		data() {
			return { 
				infotype:"任务",
				load:{list:false,edit:false}
				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data
		methods: { 
			 
			afterEditSubmit:function(project){
				this.$emit("submit",project)
			},
			toArchive:function(){ 
					this.$router.push({
						path: "/mdp/arc/mate/archive/ArchiveMng"
					});  
			},
			toIm:function(){  
					this.$router.push({
						path: "/mdp/im/messages/messageChat"
					}); 
			},
			toHelpMe:function(){   
				this.$refs.xmQuestion.showAdd();
			}
			
		},//end methods
		components: { 
			xmTaskTemplateMng,
			xmProjectPhaseTemplateMng,  
			xmProjectTemplateEdit, 
			//在下面添加其它组件
		},
		mounted() { 
			this.$nextTick(() => {
			 
      }); 
		}
	}
</script>

<style scoped>
.app-container{
	display: flex;
	padding: 10px;
	padding-left: 0;
	background: #e8edf7;
}
.project-handle{
	height: 820px;
	display: flex;
	align-items: center;
}
.project-list{
	padding-left: 10px;
	width: 310px;
	min-width: 310px;
	border-right: 1px solid #efefef;
	flex-grow: 1;
}
.project-search{
	display: flex;
	height: 50px;
	text-align: right;
	padding: 7px 20px;
	background: #fafbfc;
}
.search-btn{
	padding: 10px;
	border-radius: 0;
	border-left: 0;
}
.search-btn-show{
	color: #3a8ee6;
	background-color: #ecf5ff;
	outline: 0;
}
.project-show-end{
	height: 50px;
	background: skyblue;
}
.list{
	height: 720px;
	background: #fff;
	font-size: 14px;
	color: #666;
}
.list-item{
	padding: 8px 16px;
}
.list-item:hover{
	background: #f7f7f8;
}
.list-item:hover .project-btns{
	display:block;

}
.item-info{
	display: flex;
	align-items: center;
}
.item-info>.content{
	flex-grow: 1;
}
.item-info>.content>div:last-child{
	margin-top: 2px;
	color: #999;
	font-size:12px;
}
.project-btns{
	position: absolute;
	top: 0;
	right: 0;
	display:none;
	flex-grow: 1;
	font-size: 12px;
	text-align: right;
}
.project-btns>button{
	padding: 0;
	font-size: 12px;
}
.rate{
	width: 40px;
	text-align: right;
}


.show-project{
	width: 10px;
}
.show-project>button{
	padding-left: 0;
	padding-right: 0;
	width: 100%;
}
.show-project i{
	margin-left: -4px;
	font-size: 16px;
	font-weight: bold;
}
.project-info{
	width: 75%;
	flex-grow: 1;
	/* height: 820px; */
	background: #fff;
}
.info-type{
	background: #fafbfc;
	border-bottom: 1px solid #efefef;
}
.info-type>div{
	padding-left: 10px;
	line-height: 50px;
}
.info-type >>> .el-radio-button__inner{
	background: transparent;
	border: 0;
	box-shadow: 0 0 0 0 !important;
}
.info-type .is-active >>> .el-radio-button__inner{
	color: #409EFF !important;
	border: 1px solid #409EFF;
}

/* 超过宽度则用...代替 */
.truncate{
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
</style>