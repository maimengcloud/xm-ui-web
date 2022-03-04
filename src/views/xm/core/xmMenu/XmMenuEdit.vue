<template>
	<section class="page-container border padding">
		<el-row class="page-main ">
			<el-tabs>
				<el-tab-pane  label="需求详情">
					<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editForm">
						<el-row class="padding-bottom"> 
						<el-steps :active="parseInt(editForm.status)" simple finish-status="success" align-center>
							<el-step v-for="(item,index) in dicts.menuStatus" @click.native="on_click(item.id)" :title="item.name" :key="index"></el-step> 
						</el-steps>
						</el-row>
						<el-row class="padding-bottom">
							<el-col :span="12">
							<el-form-item label="类型" prop="ntype">
								<el-radio disabled v-model="editForm.ntype" label="1">需求集</el-radio>
								<el-radio disabled v-model="editForm.ntype" label="0">需求</el-radio>
							</el-form-item>  
							</el-col>
							<el-col :span="12">
							<el-form-item label="标签" prop="ntype">
								{{editForm.tagNames?editForm.tagNames:''}} 
								<el-button type="text" icon="el-icon-plus" @click="tagSelectVisible=true">标签</el-button> 
							</el-form-item>  
							</el-col>
						</el-row>
						<el-form-item label="名称" prop="menuName">
							<el-input v-model="editForm.menuName" placeholder="名称" ></el-input>
						</el-form-item>
						
						<el-form-item label="序号" prop="seqNo">
							<el-input v-model="editForm.seqNo" placeholder="如1.0 ， 1.1 ， 1.1.1等" ></el-input>
						</el-form-item>
						<el-form-item label="负责人" prop="mmUserid">
							<el-tag v-if="editForm.mmUserid" closable @close="clearPmUser">{{editForm.mmUsername}}</el-tag>
							<el-tag v-else>未配置</el-tag>
							<el-button @click="selectUser">选负责人</el-button>
						</el-form-item>
						<el-form-item label="需求链接" prop="demandUrl">
							<el-input v-model="editForm.demandUrl" placeholder="需求链接" ></el-input>
						</el-form-item>
						<el-form-item label="代码链接" prop="codeUrl">
							<el-input v-model="editForm.codeUrl" placeholder="代码链接" ></el-input>
						</el-form-item>
						<el-form-item label="设计链接" prop="designUrl">
							<el-input v-model="editForm.designUrl" placeholder="设计链接" ></el-input>
						</el-form-item>
						<el-form-item label="操作手册链接" prop="operDocUrl">
							<el-input v-model="editForm.operDocUrl" placeholder="操作手册链接" ></el-input>
						</el-form-item>
						<el-form-item label="概述" prop="remark">
							<el-input type="textarea" v-model="editForm.remark" :autosize="{ minRows: 4, maxRows: 20}"  placeholder="什么人？做什么事？，为什么？如： 作为招聘专员，我需要统计员工半年在职/离职人数，以便我能够制定招聘计划" ></el-input>
						</el-form-item>
					</el-form> 
					<el-row >
						<el-button @click.native="handleCancel">取消</el-button>
						<el-button v-loading="load.edit" type="primary" @click.native="editSubmit" :disabled="load.edit==true">提交</el-button>
					</el-row>
				</el-tab-pane>
				<el-tab-pane  label="概览" lazy>
					<xm-menu-overview :xm-menu="xmMenu"></xm-menu-overview>
				</el-tab-pane>
				
				<el-tab-pane  label="需求评论" lazy>
					<xm-menu-exchange-mng :xm-menu="xmMenu"></xm-menu-exchange-mng>
				</el-tab-pane>
			</el-tabs>
			<el-drawer title="选择员工" :visible.sync="userSelectVisible" size="60%" append-to-body>
				<users-select  @confirm="onUserSelected" ref="usersSelect"></users-select>
			</el-drawer>
		</el-row>
			
			<el-drawer append-to-body title="标签" :visible.sync="tagSelectVisible" class="dialog-body" size="60%">
				<tag-mng :tagIds="editForm.tagIds?editForm.tagIds.split(','):[]" :jump="true" @select-confirm="onTagSelected">
				</tag-mng>
			</el-drawer>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { editXmMenu } from '@/api/xm/core/xmMenu';
	import { mapGetters } from 'vuex'
	import UsersSelect from "@/views/mdp/sys/user/UsersSelect";
import XmMenuOverview from './XmMenuOverview.vue';
import XmMenuExchangeMng from '../xmMenuExchange/XmMenuExchangeMng.vue';
  	import TagMng from "@/views/mdp/arc/tag/TagMng";


	export default {
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
		    ])
		},
		props:['xmMenu','visible','parentMenu','product'],
		watch: {
	      'xmMenu':function( xmMenu ) {
	        this.editForm = xmMenu;
	      },
	      'visible':function(visible) {
	      	if(visible==true){
	      		//从新打开页面时某些数据需要重新加载，可以在这里添加
	      	}
	      }
	    },
		data() {
			return {
				options:{},//下拉选择框的所有静态数据  params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]}
				load:{ list: false, add: false, del: false, edit: false },//查询中...
				editFormRules: {
					menuId: [
						//{ required: true, message: '需求编号不能为空', trigger: 'blur' }
					],
					menuName: [
						{ required: true, message: '需求名称不能为空', trigger: 'blur' }
					],
					seqNo: [
						{ required: true, message: '序号不能为空', trigger: 'blur' }
					],
					mmUserid: [
						{ required: true, message: '负责人不能为空', trigger: 'blur' }
					],
				},
				//新增界面数据 项目需求表
				editForm: {
						menuId:'',menuName:'',pmenuId:'',productId:'',remark:'',status:'',online:'',demandUrl:'',codeUrl:'',designUrl:'',docUrl:'',helpUrl:'',operDocUrl:'',seqNo:'1',mmUserid:'',mmUsername:'',ntype:'0',childrenCnt:0,sinceVersion:''
				},
				userSelectVisible:false,
				dicts:{
					menuStatus:[
						
							{id:"0", name:"初始"},
							{id:"1", name:"待评审"},
							{id:"2", name:"待设计"},
							{id:"3", name:"待开发"},
							{id:"4", name:"待SIT"},
							{id:"5", name:"待UAT"},
							{id:"6", name:"待上线"},
							{id:"7", name:"运行中"},
							{id:"8", name:"已下线"},
							{id:"9", name:"已删除"}, 
					]
				},
				tagSelectVisible:false,
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/

				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="editFormVisible=false" 监听
			handleCancel:function(){
 				this.$emit('cancel');
			},
			//新增提交XmMenu 项目需求表 父组件监听@submit="afterAddSubmit"
			editSubmit: function () {

				if(!this.roles.some(i=>i.roleid=='productAdmin') && !this.roles.some(i=>i.roleid=='productTeamAdmin')){
					this.$notify({showClose: true, message: "只有产品经理、产品组长能够修改需求", type: 'error'});
					return false;
				}
				this.$refs.editForm.validate((valid) => {
					if (valid) {

						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.load.edit=true
							let params = Object.assign({}, this.editForm);
							editXmMenu(params).then((res) => {
								this.load.edit=false
								var tips=res.data.tips;
								if(tips.isOk){
 									this.$emit('submit',res.data.data);//  @submit="afterAddSubmit"
								}
								this.$notify({showClose: true, message: tips.msg, type: tips.isOk?'success':'error' });
							}).catch( err  => this.load.edit=false);
						});
					}
				});
			},
			selectUser(){
				this.userSelectVisible=true;
			},
			onUserSelected(users){
				if(users && users.length>0){
					this.editForm.mmUserid=users[0].userid
					this.editForm.mmUsername=users[0].username
				}
				this.userSelectVisible=false
			},
			clearPmUser:function(){
				this.editForm.mmUserid=''
				this.editForm.mmUsername=''
			},
			/**begin 在下面加自定义方法,记得补上面的一个逗号**/
			on_click(status){
				this.editForm.status=status;
			},
			onTagSelected(tags) {
				this.tagSelectVisible = false; 
				if(tags && tags.length>0){ 
					this.editForm.tagIds=tags.map(i=>i.tagId).join(",")
					this.editForm.tagNames=tags.map(i=>i.tagName).join(",")
				}else{
					this.editForm.tagIds=""
					this.editForm.tagNames=""
				}
			},
			/**end 在上面加自定义方法**/

		},//end method
		components: {
			//在下面添加其它组件 'xm-menu-edit':XmMenuEdit
			UsersSelect,
			XmMenuOverview,
			TagMng,
			XmMenuExchangeMng,
		},
		mounted() {
			this.editForm=Object.assign(this.editForm, this.xmMenu);
			/**在下面写其它函数***/

		}//end mounted
	}

</script>

<style scoped>

</style>
