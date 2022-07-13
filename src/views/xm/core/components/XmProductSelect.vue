<template>
	<section>
			<el-popover  
							placement="bottom"
							width="400"
							trigger="manual"
							v-model="productVisible">  
								<el-row>
									 <el-button type="text" icon="el-icon-refresh" @click="refreshSelect" title="重新从后台刷新数据回来">刷新</el-button>&nbsp;&nbsp;
												<el-button v-if="editForm && editForm.id" type="text" icon="el-icon-circle-close" @click="clearSelect" title="清空当前选中的产品">清除选中</el-button>&nbsp;&nbsp;
												<el-popover
													placement="top-start"
													title=""
													width="400"
													v-model="moreVisible"
													trigger="manual" >
													<el-row>
														<el-col  :span="24"  style="padding-top:5px;">
															<font class="more-label-font">产品编号:</font>
															<el-input   v-model="filters.id" style="width:100%;"  placeholder="输入产品编号" @keyup.enter.native="searchXmProducts">
															</el-input>
														</el-col>

														<el-col  :span="24"  style="padding-top:5px;">
															<font class="more-label-font">创建时间:</font>
															<el-date-picker
																v-model="dateRanger"
																type="daterange"
																align="right"
																unlink-panels
																range-separator="至"
																start-placeholder="开始日期"
																end-placeholder="完成日期"
																value-format="yyyy-MM-dd HH:mm:ss"
																:default-time="['00:00:00','23:59:59']"
																:picker-options="pickerOptions"
															></el-date-picker>
														</el-col>

														<el-col  :span="24"  style="padding-top:5px;">
															<font class="more-label-font">
																产品名称:
															</font>
															<el-input   v-model="filters.key" style="width:100%;"  placeholder="输入产品名字关键字">
															</el-input>
														</el-col>
														<el-col  :span="24"  style="padding-top:5px;">
															<font class="more-label-font">
																产品经理:
															</font>
															<el-tag v-if="filters.pmUser" closable @click="selectFiltersPmUser" @close="clearFiltersPmUser()">{{filters.pmUser.username}}</el-tag>
															<el-button   v-else @click="selectFiltersPmUser()">选责任人</el-button>
															<el-button    @click="setFiltersPmUserAsMySelf()">我的</el-button>
														</el-col>
														<el-col  :span="24"  style="padding-top:5px;">
															<el-button type="text"  @click="moreVisible=false" >关闭</el-button><el-button type="primary"  @click="searchXmProducts" >查询</el-button>
														</el-col>
													</el-row>
													<el-button type="text" slot="reference" @click="moreVisible=!moreVisible">更多条件</el-button> 
												</el-popover>
												<el-button style="float:right;" type="text" @click="close" icon="el-icon-close" title="关闭当前窗口">关闭</el-button>  
								</el-row>
								<el-row v-if="load.list==false && (!xmProducts ||xmProducts.length==0)">
									<el-row v-if="linkProjectId">
										<el-row>没有查到与项目【{{linkProjectId}}】关联的产品,您可以尝试&nbsp;&nbsp;												
										<el-button type="text" icon="el-icon-refresh" @click="refreshSelect" title="重新从后台刷新数据回来">刷新</el-button>&nbsp;&nbsp;
										重新从后台加载，或者<el-button @click="addProductVisible=true" icon="el-icon-plus" type="text">创建产品</el-button> ，并自动关联项目【{{linkProjectId}}】，或者到【项目->关联产品->加入更多产品到项目】手动关联一个已存在的产品。
										</el-row>
 									</el-row>
									<el-row v-else>
										<el-row>没有查到相关产品,您可以尝试&nbsp;&nbsp;												
										<el-button type="text" icon="el-icon-refresh" @click="refreshSelect" title="重新从后台刷新数据回来">刷新</el-button>&nbsp;&nbsp;
										重新从后台加载，或者<el-button @click="addProductVisible=true" icon="el-icon-plus" type="text">创建产品</el-button>
										</el-row>
									</el-row>
									<el-dialog append-to-body :visible.sync="addProductVisible" width="70%">
										<xm-product-add :sel-project="{id:linkProjectId,name:''}" @cancel="addProductVisible=false" @submit="afterAddSubmit"> </xm-product-add>
									</el-dialog>
								</el-row>
								<el-row>
									<!--列表 XmProduct 产品表-->
									<el-table  ref="table" :height="maxTableHeight" :data="xmProducts" :row-class-name="tableRowClassName" @sort-change="sortChange" :highlight-current-row="true" current-row-key="id" v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
										<el-table-column prop="productName"  label="产品名称">
											<template slot="header" slot-scope="scope">
												产品名称 
											</template>
											<template slot-scope="scope">
												<font>{{scope.row.productName}}</font>
											</template>
										</el-table-column>
									</el-table>
									<el-pagination  layout="total, prev, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination>
								</el-row>
								<slot name="reference"><el-link title="产品，点击选择、清除选择" @click="referenceClick" type="warning" slot="reference" v-loading="load.list"  icon="el-icon-search"><font style="font-size:14px;"><slot name="title">{{editForm && editForm.id?editForm.productName:'选择产品'}}</slot></font></el-link> </slot>
						</el-popover>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	//import Sticky from '@/components/Sticky' // 粘性header组件
	//import { initSimpleDicts } from '@/api/mdp/meta/item';//下拉框数据查询
	import { listXmProductWithState } from '@/api/xm/core/xmProduct';
	import { mapGetters } from 'vuex'
	import UsersSelect from "@/views/mdp/sys/user/UsersSelect";
	import XmProductAdd from '../xmProduct/XmProductAdd.vue';
	const map=new Map();

	export default {
		props:['dialog','linkProjectId','iterationId','autoSelect'],
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
		    ])
		},
		watch:{
			iterationId(){
				this.initData();
			},

			linkProjectId(){
				this.initData();
			}
		},
		data() {
			const beginDate = new Date();
			const endDate = new Date();
			beginDate.setTime(beginDate.getTime() - 3600 * 1000 * 24 * 7 * 4 * 12 );
			return {
				filters: {
					key: '',
					id:'',//产品编号
					pmUser:null,//产品经理

				},
				xmProducts: [],//查询结果
				pageInfo:{//分页数据
					total:0,//服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
					pageSize:10,//每页数据
					count:false,//是否需要重新计算总记录数
					pageNum:1,//当前页码、从1开始计算
					orderFields:[],//排序列 如 ['sex','student_id']，必须为数据库字段
					orderDirs:[]//升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
				},
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				sels: [],//列表选中数据
				dicts:{},//下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]}

				//新增xmProduct界面初始化数据
				addForm: {
					id:'',productName:'',branchId:'',remark:''
				},

				//编辑xmProduct界面初始化数据
				editForm: {
					id:'',productName:'',branchId:'',remark:''
				},
				selectFiltersPmUserVisible:false,
				maxTableHeight:300,
				dateRanger: [ ],
				pickerOptions:  util.getPickerOptions('datarange'),
				productVisible:false,
				moreVisible:false,
				hadInit:false,
				addProductVisible:false,
				/**begin 自定义属性请在下面加 请加备注**/

				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data
		methods: {
			handleSizeChange(pageSize) {
				this.pageInfo.pageSize=pageSize;
				this.getXmProducts();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getXmProducts();
			},
			// 表格排序 obj.order=ascending/descending,需转化为 asc/desc ; obj.prop=表格中的排序字段,字段驼峰命名
			sortChange( obj ){
				var dir='asc';
				if(obj.order=='ascending'){
					dir='asc'
				}else{
					dir='desc';
				}
				if(obj.prop=='xxx'){
					this.pageInfo.orderFields=['xxx'];
					this.pageInfo.orderDirs=[dir];
				}
				this.getXmProducts();
			},
			searchXmProducts(){
				 this.pageInfo.count=true;
				 this.getXmProducts();
			},
			//获取列表 XmProduct 产品表
			getXmProducts() {
				let params = {
					pageSize: this.pageInfo.pageSize,
					pageNum: this.pageInfo.pageNum,
					total: this.pageInfo.total,
					count:this.pageInfo.count
				};
				if(this.pageInfo.orderFields!=null && this.pageInfo.orderFields.length>0){
					let orderBys=[];
					for(var i=0;i<this.pageInfo.orderFields.length;i++){
						orderBys.push(this.pageInfo.orderFields[i]+" "+this.pageInfo.orderDirs[i])
					}
					params.orderBy= orderBys.join(",")
				}
				if(this.filters.key!==""){
					params.key="%"+this.filters.key+"%"
				}
				if(this.linkProjectId){
					params.linkProjectId=this.linkProjectId
				}
				if(this.linkIterationId){
					params.linkIterationId=this.linkIterationId
				}
				if(this.filters.id){
					params.id=this.filters.id
				}

				if(this.filters.pmUser){
					params.pmUserid=this.filters.pmUser.userid
				}
				this.load.list = true;
				listXmProductWithState(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
						this.xmProducts = res.data.data;
						if(this.iterationId){
							 map.set(this.iterationId,this.xmProducts)
						}else if(this.linkProjectId){
							map.set(this.linkProjectId,this.xmProducts)
						}
						if(this.autoSelect!==false&&this.xmProducts.length>0 && this.productVisible==false){
							var row=this.xmProducts[0];
							this.$refs.table.setCurrentRow(row);
							this.rowClick(row);
						}else{
							this.editForm=null
						}
					}else{
						this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: 'error' });
					}
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},

			//选择行xmProduct
			selsChange: function (sels) {
				this.sels = sels;
			},

			rowClick: function(row, event, column){
				this.editForm=row
				this.$emit('row-click',row, event, column);//  @row-click="rowClick"
				this.selectedProduct(row)
				this.productVisible=false;
				this.moreVisible=false;
			},
			selectedProduct:function(row){
				this.editForm=row
				this.$emit('selected',row);
				this.productVisible=false;
				this.moreVisible=false;
			},

			/**begin 自定义函数请在下面加**/
			clearFiltersPmUser:function(){
				 this.filters.pmUser=null;
				  this.searchXmProducts();
			},
			selectFiltersPmUser(){
				this.selectFiltersPmUserVisible=true;
			},
			onFiltersPmUserSelected(users){
				 if(users && users.length>0){
					 this.filters.pmUser=users[0]
				 }else{
					 this.filters.pmUser=null;
				 }
				 this.selectFiltersPmUserVisible=false;
				 this.searchXmProducts();
			},
			setFiltersPmUserAsMySelf(){
				this.filters.pmUser=this.userInfo;
				this.searchXmProducts();
			},

			tableRowClassName({row, rowIndex}) {
				if (row && this.editForm && row.id == this.editForm.id) {
					return 'success-row';
				}
				return '';
			},
			clearSelect(){
				this.$refs.table.setCurrentRow();
				this.$emit("clear");
				this.selectedProduct(null);
				this.productVisible=false;
				this.moreVisible=false;
			},
			refreshSelect(){  
				this.searchXmProducts(); 
				this.moreVisible=false;
			},
			close(){
				this.productVisible=false;
				this.moreVisible=false;
				this.$emit("close");
			},

			initData(){
				if(this.iterationId){
					var xmProducts=map.get(this.iterationId);
					if(xmProducts){
						this.xmProducts=xmProducts;
						if(this.productVisible==false){
							if(this.autoSelect!==false && this.xmProducts.length>0){
								var row=this.xmProducts[0];
								this.$refs.table.setCurrentRow(row);
								this.rowClick(row);
							}
						}
					}else{
						this.searchXmProducts();
					}
				}else if(this.linkProjectId){
					var xmProducts=map.get(this.linkProjectId);
					if(xmProducts){
						this.xmProducts=xmProducts;
						if(this.productVisible==false){
							if(this.autoSelect!==false && this.xmProducts.length>0){
								var row=this.xmProducts[0];
								this.$refs.table.setCurrentRow(row);
								this.rowClick(row);
							}
						}
					}else{
						this.searchXmProducts();
					}
				}else{
					this.searchXmProducts();
				}
			},
			referenceClick(){
				if(!this.hadInit){
					this.initData();
					this.hadInit=true;
				}
				this.productVisible=!this.productVisible;
			},
			
			reloadOne(){
				listXmProductWithState({id:this.editForm.id}).then((res) => {
					var tips = res.data.tips;
					if(tips.isOk && rea.data.data && res.data.data.length>0){
						Object.assign(this.editForm,res.data.data[0])
						this.rowClick(this.editForm)
					}
				})
			},
			afterAddSubmit(row){ 
				this.xmProducts.push(row)
				if(this.iterationId){
					map.set(this.iterationId,this.xmProducts)
				}else if(this.linkProjectId){
					map.set(this.linkProjectId,this.xmProducts)
				}
				if(this.autoSelect!==false&&this.xmProducts.length>0 && this.productVisible==false){
					var row=this.xmProducts[0];
					this.$refs.table.setCurrentRow(row);
					this.rowClick(row);
				}
				this.addProductVisible=false;
			}
		},//end methods
		components: {
			UsersSelect,
			XmProductAdd,
		    //在下面添加其它组件
		},
		mounted() {
			this.$nextTick(() => {
				this.maxTableHeight =  util.calcTableMaxHeight(this.$refs.table.$el);
				if(this.autoSelect!==false){
					this.initData();
					this.hadInit=true;
				}

        	});
		}
	}

</script>
<style scoped>


.more-label-font{
	text-align:center;
	float:left;
	padding-top:5px;
}
.align-right{
	float: right;
}
</style>
