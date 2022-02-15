<template>
	<section>  
		<el-row > 
			<!--列表 XmProduct 产品表-->
			<el-table  ref="table" :height="tableHeight" :data="xmProducts" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
 				 <el-table-column prop="productName"  label="产品名称" min-width="150" > 
					 <template slot="header" slot-scope="scope"> 
						 产品名称 
						 <el-popover
							placement="top-start"
							title=""
							width="400"
							trigger="click" >
							<el-row>
								<el-col :span="24" style="padding-top:5px;">
									<font class="more-label-font">
										产品查询范围：
									</font>
									<el-select  v-model="filters.queryScope" style="width:100%;"   placeholder="产品查询范围">
										<el-option :label="userInfo.branchName+'机构下所有的产品'" value="branchId"></el-option>
										<el-option label="我相关的产品" value="compete"></el-option>
										<el-option label="按产品编号精确查找" value="productId"></el-option>
										<el-option label="后台智能匹配" value=""></el-option>
									</el-select>
								</el-col>
								<el-col  :span="24"  style="padding-top:5px;"> 
									<el-input v-if="filters.queryScope=='productId'"  v-model="filters.id" style="width:100%;"  placeholder="输入产品编号" @keyup.enter.native="searchXmProducts">  
						 			</el-input> 
								</el-col>
								 
								<el-col v-show="!selProject&&filters.queryScope!='productId'" :span="24"  style="padding-top:5px;">
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
									<el-button type="primary"  @click="searchXmProducts" >查询</el-button>
								</el-col>
							</el-row> 
							<el-button  slot="reference"   icon="el-icon-more"></el-button>
						</el-popover>  
					 </template>
					<template slot-scope="scope">
						<font>{{scope.row.productName}}</font>
						<font class="align-right"><el-tag :type="scope.row.finishRate>=100?'success':'warning'">{{scope.row.finishRate?parseInt(scope.row.finishRate):0}}%</el-tag> 
						</font>
					</template>
				</el-table-column>
				<el-table-column v-if="isSelectProduct==true"  label="操作" width="100" fixed="right"  >
					<template slot-scope="scope"> 
						<el-button type="primary" @click="selectedProduct( scope.row,scope.$index)">选择</el-button> 
					</template>
				</el-table-column>
			</el-table>
			<el-pagination  layout="total, prev, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination>  
		</el-row> 
			
			<el-drawer title="选择员工" :visible.sync="selectFiltersPmUserVisible" size="60%" append-to-body>
				<users-select  @confirm="onFiltersPmUserSelected" ref="usersSelect"></users-select>
			</el-drawer>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	//import Sticky from '@/components/Sticky' // 粘性header组件
	//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { listXmProductWithState } from '@/api/xm/core/xmProduct';  
	import { mapGetters } from 'vuex' 
	import UsersSelect from "@/views/mdp/sys/user/UsersSelect"; 
	import { loadTasksToXmProductState } from '@/api/xm/core/xmProductState'; 

	
	export default { 
		props:['isSelectProduct','selProject','xmIteration'],
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
		    ])
		},
		watch:{
			xmIteration(){
				this.getXmProducts();
			},
			
			selProject(){
				this.getXmProducts();
			}
		},
		data() {
			const beginDate = new Date();
			const endDate = new Date();
			beginDate.setTime(beginDate.getTime() - 3600 * 1000 * 24 * 7 * 4 * 12 );
			return {
				filters: {
					key: '',
					queryScope:'compete',
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
				options:{},//下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				
				addFormVisible: false,//新增xmProduct界面是否显示
				//新增xmProduct界面初始化数据
				addForm: {
					id:'',productName:'',branchId:'',remark:''
				},
				
				editFormVisible: false,//编辑界面是否显示
				//编辑xmProduct界面初始化数据
				editForm: {
					id:'',productName:'',branchId:'',remark:''
				},
				iterationVisible:false,
				productStateVisible:false,
				selectFiltersPmUserVisible:false,
				tableHeight:300,
				dateRanger: [ ],  
				pickerOptions:  util.pickerOptions('datarange'),
				
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
				}else{
					//params.xxx=xxxxx
				}
				if(this.selProject){
					params.projectId=this.selProject.id
				}
				
				if(this.xmIteration){
					params.iterationId=this.xmIteration.id
				}
				 
				params.queryScope=this.filters.queryScope
				if(this.filters.queryScope=='productId'){
					if(!this.filters.id){
						this.$message({showClose: true, message:"您选择了按产品编号精确查找模式，请输入产品编号", type: 'error' });
						return;
					}
					params.id=this.filters.id
					
				}
				if(this.filters.queryScope=="branchId"){
					params.branchId=this.userInfo.branchId
					params.projectId=null;
				}
				if(!this.selProject && !this.xmIteration && this.filters.queryScope!='productId'){
					if(this.dateRanger&&this.dateRanger.length==2){
						 
						params.ctimeStart=this.dateRanger[0]
						params.ctimeEnd=this.dateRanger[1]
					} 
				} 

				this.load.list = true;
				listXmProductWithState(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
						this.xmProducts = res.data.data;
					}else{
						this.$message({showClose: true, message: tips.msg, type: 'error' });
					} 
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},
 
			//选择行xmProduct
			selsChange: function (sels) {
				this.sels = sels;
			}, 
			 
			rowClick: function(row, event, column){
				this.$emit('row-click',row, event, column);//  @row-click="rowClick"
			},
			selectedProduct:function(row){
				this.$emit('selected',row);
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
			
			loadTasksToXmProductState: function (row) {  
				this.load.edit=true;
				 
				let params = { productId: row.id };
				loadTasksToXmProductState(params).then((res) => {
					this.load.edit=false;
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.pageInfo.count=true;
						this.getXmProducts();
					}
					this.$message({showClose: true, message: tips.msg, type: tips.isOk?'success':'error' }); 
				}).catch( err  => this.load.edit=false ); 
			},
		},//end methods
		components: {  
			UsersSelect,
		    //在下面添加其它组件
		},
		mounted() { 
			this.$nextTick(() => {
				var clientRect=this.$refs.table.$el.getBoundingClientRect();
				var subHeight=70/1000 * window.innerHeight; 
				this.tableHeight =  window.innerHeight -clientRect.y - this.$refs.table.$el.offsetTop-subHeight; 
				this.getXmProducts();
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