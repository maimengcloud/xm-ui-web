<template>
	<section class="padding">  
		<el-row>
			<el-select   v-model="filters.queryScope"    placeholder="产品查询范围">
				<el-option :label="userInfo.branchName+'机构下所有的产品'" value="branchId"></el-option>
				<el-option label="我相关的产品" value="compete"></el-option>
				<el-option label="按产品编号精确查找" value="productId"></el-option>
			</el-select>
			<el-input v-if="filters.queryScope=='productId'" style="width:20%;"  v-model="filters.id"  placeholder="输入产品编号" @keyup.enter.native="searchXmProducts">
			</el-input>
			<el-input v-model="filters.key" style="width: 20%;" placeholder="名称查询" clearable>   
			</el-input>
			<el-button type="primary" v-loading="load.list" :disabled="load.list==true" v-on:click="searchXmProducts" icon="el-icon-search">查询</el-button>
 			<el-popover
				placement="top-start"
				title=""
				width="500"
				trigger="click" >
				<el-divider content-position="left"><strong>查询条件</strong></el-divider>
				<el-row>
					<el-col :span="24" style="padding-top:5px;">

						<font class="more-label-font">
							产品查询范围：
						</font>
						<el-select  v-model="filters.queryScope" style="width:100%;"   placeholder="产品查询范围">
							<el-option :label="userInfo.branchName+'机构下的产品'" value="branchId"></el-option>
							<el-option label="我相关的产品" value="compete"></el-option>
							<el-option label="按产品编号精确查找" value="productId"></el-option>
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

					<el-col v-if="selProject" :span="24"  style="padding-top:5px;">
						<font class="more-label-font">
							项目  <el-tag v-if="selProject">{{selProject?selProject.name:''}}</el-tag>
						</font>
					</el-col>
					<el-col  v-if="xmIteration"  :span="24"  style="padding-top:5px;">
						<font class="more-label-font">
							迭代 <el-tag v-if="xmIteration">{{xmIteration.iterationName}}</el-tag>
						</font>
					</el-col>
					<el-col  :span="24"  style="padding-top:10px;">
						<el-button type="primary"  @click="searchXmProducts" >查询</el-button> 
					</el-col>
				</el-row>
				<el-button  slot="reference"   icon="el-icon-more"></el-button>
			</el-popover>
		</el-row>
		<el-row > 
			<!--列表 XmProduct 产品表-->
			<el-table  ref="table" :height="maxTableHeight" :data="xmProducts" :row-class-name="tableRowClassName" @sort-change="sortChange" :highlight-current-row="true" current-row-key="id" v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
 				 <el-table-column type="index" width="60"> 
				</el-table-column>
				<el-table-column prop="productName" label="产品名称" min-width="200" sortable>
					<template slot-scope="scope">
						<el-link type="primary" @click="intoInfo(scope.row)">{{scope.row.productName}}</el-link>
					</template>
				</el-table-column>
				<el-table-column prop="pstatus" label="状态" width="100" sortable :formatter="formatPstatus"> 
				</el-table-column>
				<el-table-column prop="finishRate" label="进度" width="100" sortable>
					<template slot-scope="scope"> 
						<font  ><el-tag :type="scope.row.finishRate>=100?'success':'warning'">{{scope.row.finishRate}}%</el-tag>

						<el-tooltip content="点击统计进度，由任务汇总"><el-button  type="text" icon="el-icon-video-play" @click.stop="loadTasksToXmProductState( scope.row)"></el-button></el-tooltip>

						</font>
					</template>
				</el-table-column>
				<el-table-column prop="pmUsername" label="产品经理" width="120" sortable show-overflow-tooltip>
					<template slot-scope="scope"> 						
						<el-tag v-if="scope.row.pmUsername">{{scope.row.pmUsername}}</el-tag> 
					</template>
				</el-table-column>
				
				<el-table-column label="工作量(人时)" width="200">
					<el-table-column prop="budgetWorkload" label="预计" width="100"  show-overflow-tooltip sortable></el-table-column>
					<el-table-column prop="actWorkload" label="实际" width="100"  show-overflow-tooltip sortable></el-table-column>
				</el-table-column>
				<el-table-column   label="操作" width="120" fixed="right"  >
					<template slot-scope="scope"> 
						<el-button type="primary" @click="unDel( scope.row,scope.$index)">撤销删除</el-button> 
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
	//import { initSimpleDicts } from '@/api/mdp/meta/item';//下拉框数据查询
	import { listXmProductWithState,unDelXmProduct } from '@/api/xm/core/xmProduct';  
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
				dicts:{},//下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				
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
				maxTableHeight:300,
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
				 params.del="1"
				params.queryScope=this.filters.queryScope
				if(this.filters.queryScope=='productId'){
					if(!this.filters.id){
						this.$notify({position:'bottom-left',showClose:true,message:"您选择了按产品编号精确查找模式，请输入产品编号", type: 'error' });
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
			unDel: function (row,index) {  
				this.$prompt('将同步恢复计划、组织、需求等，慎重起见，请输入产品代号:'+row.code, '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
				}).then(({ value }) => {
					 if(value==row.code){
						this.load.del=true;
						let params = { id: row.id };
						unDelXmProduct(params).then((res) => {
							this.load.del=false;
							var tips=res.data.tips;
							if(tips.isOk){
								this.pageInfo.count=true;
								this.getXmProducts();
							}
							this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error' });
						}).catch( err  => this.load.del=false );
					 }else{
						 this.$notify({position:'bottom-left',showClose:true,message: "产品代号不正确", type: 'error' }); 
					 }
				}).catch(() => { 
					return;    
				}); 	
			},  
		},//end methods
		components: {  
			UsersSelect,
		    //在下面添加其它组件
		},
		mounted() { 
			this.$nextTick(() => { 
				this.maxTableHeight =  util.calcTableMaxHeight(this.$refs.table.$el); 
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