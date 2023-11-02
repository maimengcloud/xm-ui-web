<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.id" placeholder="主键"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getOperDataTrails" icon="el-icon-search"></el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :max-height="tableHeight" :data="operDataTrails" highlight-current-row v-loading="listLoading" border @selection-change="selsChange" style="width: 100%;">
			<el-table-column sortable type="selection" width="40"></el-table-column>
			<el-table-column sortable type="index" width="40"></el-table-column>
			<el-table-column sortable prop="userid" label="操作人" min-width="80"></el-table-column>
			<el-table-column sortable prop="startDate" label="操作开始时间" min-width="80"></el-table-column>
			<el-table-column sortable prop="endDate" label="操作结束时间" min-width="80"></el-table-column>
			<el-table-column sortable prop="fkey" label="关键字1" min-width="80"></el-table-column>
			<el-table-column sortable prop="skey" label="关键字2" min-width="80"></el-table-column>
			<el-table-column sortable prop="tableName" label="针对哪个表的操作" min-width="80"></el-table-column>
			<el-table-column sortable prop="fields" label="针对哪些字段的操作" min-width="80"></el-table-column>
			<el-table-column sortable prop="remark" label="人性化描述" min-width="80"></el-table-column>
			<el-table-column sortable prop="id" label="主键" min-width="80"></el-table-column>
			<el-table-column sortable label="操作" min-width="150" >
				<template scope="scope">
					<el-button  @click="handleEdit(scope.$index, scope.row)" icon="el-icon-edit"></el-button>
					<el-button type="danger"  @click="handleDel(scope.$index, scope.row)" icon="el-icon-delete"></el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-button type="danger" @click="batchDel" :disabled="this.sels.length===0" icon="el-icon-delete"></el-button>
			<el-pagination layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--编辑界面-->
		<el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="120px" :rules="editFormRules" ref="editForm">
					<el-form-item label="操作人" prop="userid">
						<el-input v-model="editForm.userid" auto-complete="off"></el-input>
					</el-form-item> 
					<el-form-item label="操作开始时间" prop="startDate">
						<el-date-picker type="date" placeholder="选择日期" v-model="editForm.startDate"></el-date-picker>
					</el-form-item> 
					<el-form-item label="操作结束时间" prop="endDate">
						<el-date-picker type="date" placeholder="选择日期" v-model="editForm.endDate"></el-date-picker>
					</el-form-item> 
					<el-form-item label="关键字1" prop="fkey">
						<el-input v-model="editForm.fkey" auto-complete="off"></el-input>
					</el-form-item> 
					<el-form-item label="关键字2" prop="skey">
						<el-input v-model="editForm.skey" auto-complete="off"></el-input>
					</el-form-item> 
					<el-form-item label="针对哪个表的操作" prop="tableName">
						<el-input v-model="editForm.tableName" auto-complete="off"></el-input>
					</el-form-item> 
					<el-form-item label="针对哪些字段的操作" prop="fields">
						<el-input v-model="editForm.fields" auto-complete="off"></el-input>
					</el-form-item> 
					<el-form-item label="人性化描述" prop="remark">
						<el-input v-model="editForm.remark" auto-complete="off"></el-input>
					</el-form-item> 
					<el-form-item label="主键" prop="id">
						<el-input v-model="editForm.id" auto-complete="off"></el-input>
					</el-form-item> 
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--新增界面-->
		<el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="120px" :rules="addFormRules" ref="addForm">
					<el-form-item label="操作人" prop="userid">
						<el-input v-model="addForm.userid" auto-complete="off"></el-input>
					</el-form-item> 
					<el-form-item label="操作开始时间" prop="startDate">
						<el-date-picker type="date" placeholder="选择日期" v-model="addForm.startDate"></el-date-picker>
					</el-form-item> 
					<el-form-item label="操作结束时间" prop="endDate">
						<el-date-picker type="date" placeholder="选择日期" v-model="addForm.endDate"></el-date-picker>
					</el-form-item> 
					<el-form-item label="关键字1" prop="fkey">
						<el-input v-model="addForm.fkey" auto-complete="off"></el-input>
					</el-form-item> 
					<el-form-item label="关键字2" prop="skey">
						<el-input v-model="addForm.skey" auto-complete="off"></el-input>
					</el-form-item> 
					<el-form-item label="针对哪个表的操作" prop="tableName">
						<el-input v-model="addForm.tableName" auto-complete="off"></el-input>
					</el-form-item> 
					<el-form-item label="针对哪些字段的操作" prop="fields">
						<el-input v-model="addForm.fields" auto-complete="off"></el-input>
					</el-form-item> 
					<el-form-item label="人性化描述" prop="remark">
						<el-input v-model="addForm.remark" auto-complete="off"></el-input>
					</el-form-item> 
					<el-form-item label="主键" prop="id">
						<el-input v-model="addForm.id" auto-complete="off"></el-input>
					</el-form-item> 
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import util from '@/components/mdp-ui/js/util'
	import { listOperDataTrail, delOperDataTrail, batchDelOperDataTrail, editOperDataTrail, addOperDataTrail } from '../../../../api/mdp/sys/operDataTrail'; 
	export default {
		data() {
			return {
				filters: {
					id: ''
				},
				operDataTrails: [],
				pageInfo:{
					total:0,
					pageSize:10,
					pageNum:1
				},
				listLoading: false,
				sels: [],//列表选中列
				selectOptions:{},//下拉选择框的所有静态数据
				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					id: [
						//{ required: true, message: '主键', trigger: 'blur' }
					]
				},
				//新增界面数据
				addForm: {
					userid:'',startDate:'',endDate:'',fkey:'',skey:'',tableName:'',fields:'',remark:'',id:''
				},
				
				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
					id: [
						//{ required: true, message: '主键', trigger: 'blur' }
					]
				},
				//编辑界面数据
				editForm: {
					userid:'',startDate:'',endDate:'',fkey:'',skey:'',tableName:'',fields:'',remark:'',id:''
				},
				tableHeight:500,
			}
		},
		methods: {
			//获取代码对应的名称 用于数据反显
			getCodeName(options,codeValue){
				if(!options)return codeValue;
				let code=options.filter(i=>i.codeValue==codeValue);
				if(code.length>0){
					return code[0].codeName
				}else{
					return codeValue
				} 
			}, 
			//下拉数据加载
			getSelectOptions: function () { 
				/** 下拉数据加载例子  
				selectOptions({code:'all',fieldNames:['locked','sex']}).then(res=>{
					this.selectOptions=res.data.data;
					let lockeds=this.selectOptions.locked.filter(i=>i.ifdefault=='1'); 
					this.addForm.locked=lockeds.length>0?lockeds[0].codeValue:this.addForm.locked;
					let sexs=this.selectOptions.sex.filter(i=>i.ifdefault=='1'); 
					this.addForm.sex=sexs.length>0?sexs[0].codeValue:this.addForm.sex;
				
				});
				*/
			},
			handleSizeChange(pageSize) { 
				this.pageInfo.pageSize=pageSize;
				this.getOperDataTrails();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getOperDataTrails();
			},
			//获取列表
			getOperDataTrails() {
				let params = {
					pageSize: this.pageInfo.pageSize,
					pageNum: this.pageInfo.pageNum,
					total: this.pageInfo.total,count:this.pageInfo.count,
					id: this.filters.id
				};
				this.listLoading = true;
				listOperDataTrail(params).then((res) => {
					this.pageInfo.total = res.data.total;this.pageInfo.count=false;
					this.operDataTrails = res.data.data;
					this.listLoading = false;
				}).catch(() => {
					this.listLoading = false;
				});
			},
			//删除
			handleDel: function (index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					let params = row;
					delOperDataTrail(params).then((res) => {
						this.listLoading = false;
						var tips=res.data.tips;
						if(tips.isOk){ this.getOperDataTrails();}
						this.$notify({ message: tips.msg, type: tips.isOk?'success':'error' });
						
					});
				}).catch(() => {
					this.listLoading = false;
				});
			},
			//显示编辑界面
			handleEdit: function (index, row) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面
			handleAdd: function () {
				this.addFormVisible = true;
				//this.addForm=Object.assign({}, this.editForm);
			},
			//编辑
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true; 
							let params = Object.assign({}, this.editForm); 
							editOperDataTrail(params).then((res) => {
								this.editLoading = false; 
								var tips=res.data.tips;
								if(tips.isOk){
									this.$refs['editForm'].resetFields();
									this.editFormVisible = false;
									this.getOperDataTrails();
								}
								this.$notify({ message: tips.msg, type: tips.isOk?'success':'error' }); 
							}).catch(() => {
								this.editLoading = false;
							});
						});
					}
				});
			},
			//新增
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true; 
							let params = Object.assign({}, this.addForm); 
							addOperDataTrail(params).then((res) => {//1 begin
								this.addLoading = false; 
								var tips=res.data.tips;
								if(tips.isOk){
									this.$refs['addForm'].resetFields();
									this.addFormVisible = false;
									this.getOperDataTrails();
								}
								this.$notify({ message: tips.msg, type: tips.isOk?'success':'error' }); 
							});//1 end
						}).catch(() => {
							this.addLoading = false;
						});
					}
				});
			},
			selsChange: function (sels) {
				this.sels = sels;
			}, 
			//批量删除
			batchDel: function () { 
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {//1 begin
					this.listLoading = true;
					batchDelOperDataTrail(this.sels).then((res) => {//2 begin
						this.listLoading = false;
						var tips=res.data.tips;
						if( tips.isOk ){ this.getOperDataTrails(); }
						this.$notify({ message: tips.msg, type: tips.isOk?'success':'error'});
					});//2 end
				}).catch(() => {//1 end
					this.listLoading = false;
				});
			}
		},
		mounted() {   
			this.$nextTick(() => {
				this.tableHeight = window.innerHeight - 250;   
			}); 
			this.getOperDataTrails();
			this.getSelectOptions();
		}
	}

</script>

<style scoped>

</style>