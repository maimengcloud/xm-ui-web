<template>
	<section>
		<el-row class="xm-detail">
			<div class="title-bar">
				考核详情
				<el-button v-if="Eligible" type="primary" size="small" @click="showEdit">保存</el-button>
			</div>

			<el-form label-position="left" :model="selProject"  label-width="140px">
				<el-col style="margin-top:20px;" :span="24">
					<el-form-item label="状态">
						{{statusList[selProject.status].label}}
					</el-form-item>
				</el-col>
				<el-col :span="24">
					<el-form-item label="项目名称" >
						{{selProject.name}}
					</el-form-item>
				</el-col>
				<el-col :span="24">
					<el-form-item label="项目类型" >
						{{selProject.xmType}}
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="项目周期" >
						{{selProject.startTime.substr(0,10)}} 至 {{selProject.endTime.substr(0,10)}}
					</el-form-item>
				</el-col>
				<el-col :span="24">
					<el-form-item label="项目考核" >
						<el-input v-if="Eligible" style="width:auto !important;" v-model="selProject.assess" type="number" min="0"></el-input>
						<span v-else>{{selProject.assess}}</span>
					</el-form-item>
				</el-col>
				<el-col :span="24">
					<el-form-item label="考核备注" >
						<vue-editor v-if="Eligible" :branch-id="userInfo.branchId" v-model="selProject.assessRemarks"></vue-editor>
						<span v-else>{{selProject.assessRemarks}}</span>
					</el-form-item>
				</el-col>
			</el-form>
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	//import Sticky from '@/components/Sticky' // 粘性header组件

	import { mapGetters } from 'vuex';
	import VueEditor from '@/components/Tinymce/index';
	import { editAssess, listXmProject, delXmProject, batchDelXmProject } from '@/api/xm/core/xmProject';

	export default {
		props: ["selProject"],
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
				]),
				Leader() {
					return this.selProject.leader.filter(i=>i.leadType == "负责人");
				},
				Moniter() {
					return this.selProject.leader.filter(i=>i.leadType == "监控人");
				},
				Approver() {
					return this.selProject.leader.filter(i=>i.leadType == "审批人");
				},
				Group() {
					return this.selProject.group;
				},
				Eligible() {
					return this.selProject.leader.some(i=>i.leadType == '负责人' && i.userid == this.userInfo.userid);
				}
		},
		watch: {
		},
		data() {
			return {
				filters: {
					key: ''
				},
				xmProjects: [],//查询结果
				load:{ list: false, edit: false, del: false, add: false },//查询中...

				editFormVisible: false,//编辑界面是否显示
				//编辑xmProject界面初始化数据
				editForm: {
					id:'',code:'',name:'',xmType:'',startTime:'',endTime:'',urgent:'',priority:'',description:'',createUserid:'',createUsername:'',createTime:'',assess:'',assessRemarks:'',status:'',branchId:'',planTotalCost: '',
					leader: [],
					approver: [],
					moniter: [],
					group: [],
				},
				/**begin 自定义属性请在下面加 请加备注**/
				status: "",
				statusList:[
					{
						label: "立项中",
						value: "0",
					},
					{
						label: "审批中",
						value: "1",
					},
					{
						label: "已退回",
						value: "2",
					},
					{
						label: "进行中",
						value: "3",
					},
					{
						label: "已结束",
						value: "4",
					}
				],
				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data
		methods: {
			getXmProjects() {
				this.load.list = true;
				listXmProject(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){
						this.xmProjects = res.data.data;
						console.log(this.xmProjects);
					}else{
						this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: 'error' });
					}
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},

			//显示编辑界面 XmProject xm_project
			showEdit: function() {
				let params = Object.assign({}, this.selProject);
				editAssess(params).then((res) => {
					console.log(res);
					var tips=res.data.tips;
					if(tips.isOk){
					}
					this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error' });
				}).catch( err => this.load.list = false);
			},
			//显示新增界面 XmProject xm_project
			afterEditSubmit(){
				this.editFormVisible=false;
			},
			rowClick: function(row, event, column){
				this.$emit('row-click',row, event, column);//  @row-click="rowClick"
			}
			/**begin 自定义函数请在下面加**/

			/**end 自定义函数请在上面加**/
		},//end methods
		components: {
				//在下面添加其它组件
			'vue-editor' :VueEditor,
		},
		mounted() {
			this.$nextTick(() => {
				this.status = this.selProject.status;
      });
		}
	}

</script>

<style scoped>
.xm-detail{
	width: 100%;
}
.title-bar{
	padding:0 10px;
	height: 50px;
	background: #fafbfc;
	line-height: 50px;
}
.title-bar>button{
	float:right;
	margin:7px 10px;
}
.fs-ft{
	font-size: 14px !important;
}
.xm-detail .el-form-item{
	padding: 0 10px;
}
.xm-detail >>> input[type="number"]{
	padding-left: 5px;
	padding-right: 0;
}
/* 超过宽度则用...代替 */
.truncate{
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
</style>
