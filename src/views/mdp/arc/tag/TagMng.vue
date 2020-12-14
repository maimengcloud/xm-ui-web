<template>
	<section>
		<sticky :className="'sub-navbar draft'" style="margin-left:-20px;margin-right:-20px;">
		<el-row>
			 <el-col :span="6"> 
				<el-input  style="width:99%;"  v-model="needAddTagCategoryNameInputValue" placeholder="标签分类，回车直接添加"
				 @keyup.enter.native="addTagCategorySubmitMethod"></el-input>
         		
			 </el-col>
			 <el-col :span="14">
				 <el-checkbox  v-if="userInfo.isPlatformAdmin||userInfo.isSuperAdmin" v-model="isPub" true-label='1' false-label='0'>公共分类</el-checkbox>
        	<el-button type="primary" v-if="jump==true" @click="selectConfirm">确认</el-button>
			<el-button type="primary"   @click="getTags" v-loading="sectionLoading">查询</el-button> 
			 
			</el-col>
			<el-col :span="4" class="hidden-sm-and-down">
			 	<el-tooltip content="黄色表示已经有的标签"><span class="addTagSquare"></span></el-tooltip>
				 <el-tooltip content="白色表示尚未拥有的标签"><span class="closeTagSquare"></span></el-tooltip>
				
			</el-col> 
		</el-row>
		</sticky>
		<el-row class="app-container">

			<el-row v-for="(item,index) in convertTags" :key="item.categoryId">
				<h3> 
					<div>{{item.categoryName+(item.pubc=='1'?'(公共)':'')}}<i class="el-icon-close closeStyle" @click.stop="delTagCategoryMethod(item.categoryId,index)"></i>:</div>
				 
				</h3>
				<!--el-icon-circle-close--> 
				<el-col :span="24" style="margin-left:30px;display:flex;flex-wrap: wrap;width: 100%;">
					<div :class="v.checked?'checkCopyButton':'copyButton'" v-for="(v,valueIndex) in item.values" :key="valueIndex"
					 @click="clickTagMethod(index,valueIndex)">{{v.tagName +(v.pubTag=='1'?'(公共)':'')}}
						<i class="el-icon-close closeStyle" @click.stop="delTagMethod(v.tagId,index,valueIndex)"></i>
					</div>
					<div class="input-tag" v-if="item.showAddButtonVisible">
						<el-input style="200px;" v-model="item.showAddButtonInputValue" placeholder="请输入标签,回车即可" @keyup.enter.native="addTagMethod(index)" autofocus></el-input>

          			</div>
					<div v-else class="add" @click="showAddButtonMethod(index)"><i class="el-icon-circle-plus-outline" style="font-size:35px;"></i></div>
				</el-col> 
			</el-row>


		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util'; //全局公共库
	import Sticky from '@/components/Sticky' // 粘性header组件
	//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
  import { listTag, delTag, batchDelTag,addTag, getAllTag,deleteTagCategory} from '@/api/mdp/arc/tag';
	import {
		mapGetters
	} from 'vuex'
	import { 
		listTagCategory,
		addTagCategory
	} from '@/api/mdp/arc/tagCategory';

	export default {
		computed: {
			...mapGetters([
				'workShop','userInfo'
			])
		},
		//
		props: ['jump', 'visible','tagIds'],
		watch: {

			
			'tagIds': function(tagIds) { 
				if(tagIds && tagIds.length>0){
					this.convertTags.forEach(i=>{
						if( i.values &&  i.values.length>0){
							i.values.forEach(k=>{
							if(tagIds.some(j=>j==k.tagId)){
								k.checked=true;
							}else{
								k.checked=false;
							}
						});
					 } 
				 });
				}
				 
			},
			'visible': function(visible) {
				if (visible == true) {
					//从新打开页面时某些数据需要重新加载，可以在这里添加
					console.log("visit---:MemMenmberTagMng")
					//this.getTags();
				}
			}
		},

		data() {
			return {
				userFormVisible: false, //该组用户
				showwAddTagCategoryVisible: false,
				needAddTagCategoryNameInputValue: '',
				sectionLoading: false,
				convertTags: [],
				filters: {
					key: ''
				},
				memMemberUserId: null, //过滤条件,userid
				memMemberTags: [], //查询结果
				pageInfo: { //分页数据
					total: 0, //服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
					pageSize: 10, //每页数据
					count: false, //是否需要重新计算总记录数
					pageNum: 1, //当前页码、从1开始计算
					orderFields: [], //排序列 如 ['sex','student_id']，必须为数据库字段
					orderDirs: [] //升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
				},
				load: {
					list: false,
					edit: false,
					del: false,
					add: false
				}, //查询中...
				sels: [], //列表选中数据
				options: {}, //下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]}

				addFormVisible: false, //新增memMemberTag界面是否显示
				//新增memMemberTag界面初始化数据
				addForm: {
					userid: '',
					tag: '',
					addUserid: '',
					addTime: '',
					state: '',
					id: '',
          			isPub :'',
				},

				editFormVisible: false, //编辑界面是否显示
				/*userFormVisible: false,*/ //该组用户
				//编辑memMemberTag界面初始化数据
				editForm: {
					userid: '',
					tag: '',
					addUserid: '',
					addTime: '',
					state: '',
					id: '',
          isPub:'',
				},
				/**begin 自定义属性请在下面加 请加备注**/
        isPub:'0'
				/**end 自定义属性请在上面加 请加备注**/
			}
		}, //end data
		methods: {
			handleSizeChange(pageSize) {
				this.pageInfo.pageSize = pageSize;
				this.getTags();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getTags();
			},
			// 表格排序 obj.order=ascending/descending,需转化为 asc/desc ; obj.prop=表格中的排序字段,字段驼峰命名
			sortChange(obj) {
				var dir = 'asc';
				if (obj.order == 'ascending') {
					dir = 'asc'
				} else {
					dir = 'desc';
				}
				if (obj.prop == 'xxx') {
					this.pageInfo.orderFields = ['xxx'];
					this.pageInfo.orderDirs = [dir];
				}
				this.getTags();
			},
			searchTags() {
				this.pageInfo.count = true;
				this.getTags();
			},
			//获取列表 MemMemberTag mem_member_tag
			getTags() {
				this.showwAddTagCategoryVisible = false;
				let params = {
					/* pageSize: this.pageInfo.pageSize,
					pageNum: this.pageInfo.pageNum,
					total: this.pageInfo.total,
					count:this.pageInfo.count */
				};
				if (this.pageInfo.orderFields != null && this.pageInfo.orderFields.length > 0) {
					let orderBys = [];
					for (var i = 0; i < this.pageInfo.orderFields.length; i++) {
						orderBys.push(this.pageInfo.orderFields[i] + " " + this.pageInfo.orderDirs[i])
					}
					params.orderBy = orderBys.join(",")
				}
				if (this.filters.key !== "") {
					params.key = "%" + this.filters.key + "%"
				} else {
					//params.xxx=xxxxx
				}

				params.shopId = this.workShop.shopId;
				params.branchId = this.workShop.branchId;
				this.sectionLoading = true;
				this.convertTags = [];
				getAllTag(params).then((res) => {
					var tips = res.data.tips;
					if (tips.isOk) {
						/* this.pageInfo.total = res.data.total;
						this.pageInfo.count=false; */ 
						let allTag = res.data.data; 
						let convert = [];
						for (let i = 0; i < allTag.length; i++) {
							let flag = true; //判断是否需要添加
							var tag=allTag[i];
							for (let j = 0; j < convert.length; j++) {
								
								if (tag.tagId && tag.categoryId == convert[j].categoryId ) {
									let json = {
										"isSaveInDatabase": true,
										"checked": tag.checked ? true : false,
										"tagId": tag.tagId,
										"tagName": tag.tagName,
                    					"pubTag":tag.pubTag,
									}
									if(this.tagIds && this.tagIds.some(id=>id==json.tagId)){
										json.checked=true;
									}
									convert[j].values.push(json);
									flag = false;
									break;
								}
							}
							if (flag) {
								let json = {
									"showAddButtonVisible": false, //添加标签按钮
									"showAddButtonInputValue": '', //添加标签按钮的输入框的值
									"categoryId": tag.categoryId,
									"categoryName": tag.categoryName,
									"pubc":tag.pubc,
									"values": [{
										"isSaveInDatabase": false,
										"checked": false,
										"tagId": tag.tagId,
										"tagName": tag.tagName,
                    					"pubTag":tag.pubTag,
									}]
								}
								if (!json.values[0].tagId) {
									json.values = [];
								}else{
									
									if(this.tagIds && this.tagIds.some(id=>id==json.values[0].tagId)){
										json.values[0].checked=true;
									}
								}
								convert.push(json);
							}
						}
						this.convertTags = convert;
					} else {
						this.$message({
							message: tips.msg,
							type: 'error'
						});
					}
					this.sectionLoading = false;
				}).catch(err => this.sectionLoading = false);
			},

			//显示编辑界面 MemMemberTag mem_member_tag
			showEdit: function(row, index) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面 MemMemberTag mem_member_tag
			showAdd: function() {
				this.addFormVisible = true;
				//this.addForm=Object.assign({}, this.editForm);
			},
			//显示该组的User
			//             showUser: function ( row,index ) {
			//                 this.userFormVisible = true;
			//                 this.editForm = Object.assign({}, row);
			//             },
			afterAddSubmit() {
				this.addFormVisible = false;
				this.pageInfo.count = true;
				this.getTags();
			},
			afterEditSubmit() {
				this.editFormVisible = false;
				this.getTags();
			},
			//选择行memMemberTag
			selsChange: function(sels) {
				this.sels = sels;
			},
			//删除memMemberTag
			handleDel: function(row, index) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.load.del = true;
					let params = {
						id: row.id
					};
					delMemMemberTag(params).then((res) => {
						this.load.del = false;
						var tips = res.data.tips;
						if (tips.isOk) {
							this.pageInfo.count = true;
							this.getTags();
						}
						this.$message({
							message: tips.msg,
							type: tips.isOk ? 'success' : 'error'
						});
					}).catch(err => this.load.del = false);
				});
			},
			//批量删除memMemberTag
			batchDel: function() {

				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.load.del = true;
					batchDelMemMemberTag(this.sels).then((res) => {
						this.load.del = false;
						var tips = res.data.tips;
						if (tips.isOk) {
							this.pageInfo.count = true;
							this.getTags();
						}
						this.$message({
							message: tips.msg,
							type: tips.isOk ? 'success' : 'error'
						});
					}).catch(err => this.load.del = false);
				});
			},
			rowClick: function(row, event, column) {
				this.$emit('row-click', row, event, column); //  @row-click="rowClick"
			},
			clickTagMethod(index, valueIndex) {
				this.convertTags[index].values[valueIndex].checked = !this.convertTags[index].values[valueIndex].checked;
			},

			//显示添加按钮的方法
			showAddButtonMethod(index) {
				this.convertTags[index].showAddButtonVisible = true;
			},
      //添加标签的方法
			addTagMethod(index) {
        if(!this.userInfo.isPlatformAdmin && !this.userInfo.isSuperAdmin){
        	if(this.isPub=='1'){
        		this.$message({
        				message:"不是平台管理员，不允许增加公共标签",
        				type:   'error'
        		});
        		return;
        	}
        }
        if(this.convertTags.some(i=>{
			return i.values.some(tag=>tag.tagName==this.convertTags[index].showAddButtonInputValue)
		})){
        	this.$message({
        				message:"标签已经存在",
        				type:   'error'
        		});
        	return false;
        }
        if(!this.convertTags[index].pubc){
          if(this.isPub=='1'){
        	this.$message({
        				message:"该分类不是公共分类，不能添加公共标签",
        				type:   'error'
        		});
        	return false;
        }
      }
				let that = this;
        let tagName=this.convertTags[index].showAddButtonInputValue;
        let categoryId=this.convertTags[index].categoryId;
				let params = {
					"branchId": that.workShop.branchId,
					"shopId": that.workShop.shopId,
					"categoryId": categoryId,
					"tagName": tagName,
          "isPub":this.isPub
				};

				if (!params.tagName) {
					return
				}
        console.log("params")
        console.log(params)
				this.sectionLoading = true;
				addTag(params).then((res) => {
					this.sectionLoading = false;
					var tips = res.data.tips;
					if (tips.isOk) {
						let json = {
							"isSaveInDatabase": false,
							"checked": false,
							"tagId": res.data.data.id,
							"tagName": res.data.data.tagName,
              				"pubTag":res.data.data.isPub
						}
						this.convertTags[index].showAddButtonInputValue='';
						this.convertTags[index].values.push(json);
					}
					this.$message({
						message: tips.msg,
						type: tips.isOk ? 'success' : 'error'
					});
				}).catch(err => this.sectionLoading = false);
			},
			//删除标签的方法
			delTagMethod(tagId, index, valueIndex) {
				if(!this.userInfo.isPlatformAdmin && !this.userInfo.isSuperAdmin){
					if(this.convertTags[index].values.some(i=>i.pubTag=='1'&&i.tagId==tagId)){
						this.$message({
								message:"公共标签不允许删除",
								type:   'error'
						});
						return;
					}
				}
				let that = this;

				let params = {
					"id": tagId
				}
				console.log("params.id-------------------------"+params.id);
				if (!params.id) {
					return;
				}

				this.$confirm('此操作将永久删除该标签, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					that.sectionLoading = true;
					delTag(params).then((res) => {
						that.sectionLoading = false;
						var tips = res.data.tips;
						if (tips.isOk) {
							this.convertTags[index].values.splice(valueIndex, 1);
							/*this.getTags();*/
						}
						this.$message({
							message: tips.msg,
							type: tips.isOk ? 'success' : 'error'
						});
					}).catch(err => this.sectionLoading = false);
				}).catch(() => {

				});
			},
			//添加标签分类的显示的方法
			showwAddTagCategoryVisibleMethod() {
				this.showwAddTagCategoryVisible = true;
			},
			//添加标签分类的方法
			addTagCategorySubmitMethod() {
				let that = this;
				if(!(this.userInfo.isPlatformAdmin || this.userInfo.isSuperAdmin)){
					if(this.isPub=='1'){
						 this.$message({
							message:"你不是平台管理员不能添加公共标签分类",
							type:  'error'
						});
						return;
					}
				}

        if(this.convertTags.some(i=>i.categoryName==this.needAddTagCategoryNameInputValue)){
        	this.$message({
        				message:"标签分类已经存在",
        				type:   'error'
        		});
        	return false;
        }
				if (!this.needAddTagCategoryNameInputValue) {
					return;
				}
				let params = {
					"branchId": this.workShop.branchId,
					"shopId": this.workShop.shopId,
					"categoryName": this.needAddTagCategoryNameInputValue,
          "isPub":this.isPub
				};
				that.sectionLoading = true;
				addTagCategory(params).then((res) => {
					that.sectionLoading = false;
					var tips = res.data.tips;
					if (tips.isOk) {
						that.needAddTagCategoryNameInputValue = '';
						let json = {
							"showAddButtonVisible": false, //添加标签按钮
							"showAddButtonInputValue": '', //添加标签按钮的输入框的值
							"categoryId": res.data.data.id,
							"categoryName": res.data.data.categoryName,
							"values": [],
              				"pubc":res.data.data.isPub
						}
						this.convertTags.push(json);
					}
					this.$message({
						message: tips.msg,
						type: tips.isOk ? 'success' : 'error'
					});
				}).catch(err => this.sectionLoading = false);
			},

	  selectConfirm(){
		  let selectTags=[];
		  this.sels=this.convertTags.forEach(i=>{
			  if(i.values && i.values.length>0){
				i.values.forEach(j=>{
					if(j.checked==true){
						selectTags.push(j);
					}
				})
			  }

		  })
		  this.$emit("select-confirm",selectTags);
	  },
			//删除标签分类的方法
			delTagCategoryMethod(categoryId, index) {

				let that = this;
				if (!categoryId) {
					return;
				};
				let params = {
					"shopId": this.workShop.shopId,
					"branchId": this.workShop.branchId,
					"id": categoryId
				}
        if(!this.userInfo.isPlatformAdmin && !this.userInfo.isSuperAdmin){
        	if(this.convertTags.some(i=>i.pubc=='1'&&i.categoryId==categoryId)){
        		this.$message({
        				message:"公共分类不允许删除",
        				type:   'error'
        		});
        		return;
        	}
        }
				this.$confirm('此操作将永久删除该标签分类, 并连同该标签分类下面的标签也删除，是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					that.sectionLoading = true;
					deleteTagCategory(params).then((res) => {
						that.sectionLoading = false;
						var tips = res.data.tips;
						if (tips.isOk) {
							this.convertTags.splice(index, 1);
							/*this.getTags();*/
						}
						this.$message({
							message: tips.msg,
							type: tips.isOk ? 'success' : 'error'
						});
					}).catch(err => this.sectionLoading = false);
				}).catch(() => {

				});
			}

			/**begin 自定义函数请在下面加**/


			/**end 自定义函数请在上面加**/

		}, //end methods
		components: {
			// 'mem-member-tag-add': MemMemberTagAdd,
			// 'mem-member-tag-edit': MemMemberTagEdit,
			// 'mem-member-mng':MemMemberMng,//User列表
			'sticky': Sticky
			//在下面添加其它组件
		},
		mounted() {
			this.$nextTick(() => {
				this.getTags();
			});
		}
	}
</script>

<style scoped>
	.copyButton {
		margin-left: 5px;
		border-radius: 20px;
		padding: 10px 1px;  
		border: 1px solid rgb(220, 223, 230);
		/* color:#039; */
	}

	.copyButton:hover {
		color: #409eff;
		border-color: #c6e2ff;
		background-color: #ecf5ff;
		cursor: default;
	}

	.checkCopyButton {
		/*color: #fff;*/
		margin-left: 5px;
		border-radius: 20px;
		padding: 10px 1px;  
		border: 1px solid #FFA00A;
		/*background-color: rgba(230, 162, 60, .1);*/
		/* background-color: #f9f9f9; */
		background-color: #fff;
		/*border-color: rgba(230,162,60,.2);*/
		color: #FFA00A;
	}

	.add {
		display: flex;
		align-items: center;
		margin-left: 10px;
		margin-top: 2px;
	}

	.add:hover {
		cursor: pointer;
		animation: myrotate 0.5s linear infinite;
	}


	.input-tag {
		margin-left:10px;
		margin-top: 2px;
		align-self: center;
	}
	.closeStyle {
		padding: 1px;
	}

	.closeStyle:hover {
		cursor: pointer;
		/* border-color:#f40; */
		/* border: 1px solid #f40; */
		background-color: #FFA00A;
		color: #fff;
		border-radius: 50%;
		padding: 1px;
		animation: myrotate 1s linear;
	}

	.addTagSquare {
		width: 15px;
		height: 15px;
		display: inline-block;
		background-color: #FFA00A;
		animation: myrotate 2s linear infinite;
	}

	.closeTagSquare {
		width: 15px;
		height: 15px;
		display: inline-block;
		background-color: #fff;
		animation: myrotate 2s linear infinite;
	}
	@keyframes myrotate {
		0% {
			transform: rotate(0deg);
			box-shadow: 0px 0px 10px #fff;
		}

		50% {
			transform: rotate(180deg);
			box-shadow: 0px 0px 45px #fff;
		}

		100% {
			transform: rotate(360deg);
			box-shadow: 0px 0px 10px #fff;
		}
	}
</style>
