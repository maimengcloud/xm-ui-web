<template>
	<section>
		<el-row>
			
			 <el-input v-model="filters.key" style="width:30%;" placeholder="请输入关键字进行查找项目" v-if="!xmIteration && !xmProduct"> 
			</el-input>
			<el-button @click="searchXmProjects" icon="el-icon-search" v-if="!xmIteration && !xmProduct"></el-button>
			 <xm-project-select @row-click="onXmProjectSelect">
				 <font slot="title">添加更多项目到产品中</font>
			 </xm-project-select>
		</el-row>
		<el-row class="page-main ">   
			<el-table ref="table" :height="tableHeight"  stripe :data="xmProjects"  highlight-current-row v-loading="load.list"   style="width: 100%;">
				<el-table-column  type="index" label="序号" width="55" ></el-table-column>
				<el-table-column prop="id" label="项目编码" min-width="80" ></el-table-column>
				<el-table-column prop="name" label="标题名称" min-width="80" ></el-table-column> 
				<el-table-column prop="seq" label="顺序" min-width="80" >
				     <span class="cell-text">  {{scope.row.username}}}  </span>
                     <span class="cell-bar"><el-input style="display:inline;" v-model="scope.row.username" placeholder="" @change="editSomeFields(scope.row,'username',$event)" :maxlength="22"></el-input></span>
				</el-table-column>  
				<el-table-column label="操作" width="245" fixed="right">
					<template slot-scope="scope">  
							<el-button-group>
								<el-button   type="primary" @click.stop="goToProject(scope.row)" >项目视图</el-button>  
								<el-button v-if="!xmIteration"  type="primary" @click.stop="doDelXmProductProjectLink(scope.row)" >移出产品</el-button>  
							</el-button-group> 
							<!-- <el-button style="width:100%;" slot="reference" class="see-more" type="text" icon="el-icon-more"></el-button>
						</el-popover> -->
					</template>
				</el-table-column>
			</el-table>
			<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination> 
		</el-row> 
		
		<el-drawer title="选择项目" :visible.sync="xmProjectListVisible" size="60%" append-to-body>
			<xm-project-list  @project-confirm="onXmProjectSelect"></xm-project-list>
		</el-drawer> 
	</section> 

</template>

<script>
	import Vue from 'vue'
	import util from '@/common/js/util';//全局公共库
	//import Sticky from '@/components/Sticky' // 粘性header组件
	import config from "@/common/config"; //全局公共库
	//import { initSimpleDicts } from '@/api/mdp/meta/item';//下拉框数据查询
	import { listXmProject,  } from '@/api/xm/core/xmProject';  
	import { mapGetters } from 'vuex' 
 	import { delXmProductProjectLink, addXmProductProjectLink,batchDelXmProductProjectLink,editSomeFieldsXmProductProjectLink } from '@/api/xm/core/xmProductProjectLink';
import XmProjectSelect from '@/views/xm/core/components/XmProjectSelect.vue';



	export default {  
		props:['xmProduct','xmIteration'],
		computed: {
			...mapGetters([
				'userInfo','roles'
			]), 
		}, 
		watch:{
			xmProduct:function(){
				this.getXmProjects();
			},
			xmIteration:function(){
				this.getXmProjects();
			}
		},
		data() {
			return {
				filters: {
					key: ''
				},
				xmProjects: [],//查询结果
				pageInfo:{//分页数据
					total:0,//服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
					pageSize:10,//每页数据
					count:false,//是否需要重新计算总记录数
					pageNum:1,//当前页码、从1开始计算
					orderFields:['create_time'],//排序列 如 ['sex','student_id']，必须为数据库字段
					orderDirs:['desc']//升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
				},
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				sels: [],//列表选中数据
				dicts:{},//下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				
				addFormVisible: false,//新增xmProject界面是否显示
				//新增xmProject界面初始化数据
				addForm: {
					id:'',code:'',name:'',xmType:'',startTime:'',endTime:'',urgent:'',priority:'',description:'',createUserid:'',createUsername:'',createTime:'',assess:'',assessRemarks:'',status:'',branchId:'',planTotalCost:'',bizProcInstId:'',bizFlowState:'',planNouserAt:'',planIuserAt:'',planOuserAt:'',locked:'',baseTime:'',baseRemark:'',baselineId:'',planWorkload:'',totalReceivables:'',budgetMarginRate:'',contractAmt:'',planIuserPrice:'',budgetOuserPrice:'',planOuserCnt:'',planIuserCnt:'',planWorkingHours:''
				},
				
				editFormVisible: false,//编辑界面是否显示
				tableHeight:300,
				//编辑xmProject界面初始化数据
				editForm: {
					id:'',code:'',name:'',xmType:'',startTime:'',endTime:'',urgent:'',priority:'',description:'',createUserid:'',createUsername:'',createTime:'',assess:'',assessRemarks:'',status:'',branchId:'',planTotalCost:'',bizProcInstId:'',bizFlowState:'',planNouserAt:'',planIuserAt:'',planOuserAt:'',locked:'',baseTime:'',baseRemark:'',baselineId:'',planWorkload:'',totalReceivables:'',budgetMarginRate:'',contractAmt:'',planIuserPrice:'',budgetOuserPrice:'',planOuserCnt:'',planIuserCnt:'',planWorkingHours:''
				},
				xmProjectListVisible:false,
 
				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data
		methods: {
			handleSizeChange(pageSize) { 
				this.pageInfo.pageSize=pageSize; 
				this.getXmProjects();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getXmProjects();
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
				this.getXmProjects();
			},
			searchXmProjects(){
				 this.pageInfo.count=true; 
				 this.getXmProjects();
			},
			//获取列表 XmProject xm_project
			getXmProjects() {
				let params = {
					pageSize: this.pageInfo.pageSize,
					pageNum: this.pageInfo.pageNum,
					total: this.pageInfo.total,
					count:this.pageInfo.count,
				};
				if(this.xmProduct){
					params.productId=this.xmProduct.id
				}
				
				if(this.xmIteration){
					params.iterationId=this.xmIteration.id
				}
				if(this.filters.key){
					params.key='%'+this.filters.key+'%'
				}
				this.load.list = true; 
				if(this.pageInfo.orderFields!=null && this.pageInfo.orderFields.length>0){
					let orderBys=[];
					for(var i=0;i<this.pageInfo.orderFields.length;i++){ 
						orderBys.push(this.pageInfo.orderFields[i]+" "+this.pageInfo.orderDirs[i])
					}  
					params.orderBy= orderBys.join(",")
				} 
				params.branchId = this.userInfo.branchId;
				listXmProject(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						console.log(res.data);
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false; 
						this.xmProjects = res.data.data;
					}else{
						this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: 'error' });
					} 
					this.load.list = false;
				}).catch( err => this.load.list = false );
			}, 
			goToProject(row){
				this.$router.push({path:'/xm/core/xmProject/XmProjectInfoRoute',query:{id:row.id}})
			},
			selectProject:function(row){
				this.editForm=row
				this.$emit('project-confirm',this.editForm);
			},
			/**end 自定义函数请在上面加**/
			onXmProjectSelect:function(row){
				var xmProject=row;
				var xmProduct=this.xmProduct;
				this.$confirm('确认将项目【'+xmProject.name+'】加入产品【'+xmProduct.productName+'】吗？', '提示', {
					type: 'warning'
				}).then(()=>{
					addXmProductProjectLink({projectId:xmProject.id,productId:xmProduct.id}).then(res=>{
						var tips =res.data.tips;
						if(tips.isOk){
							this.getXmProjects();
						}
						this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error'});
					})
				})
			},
			doDelXmProductProjectLink(row){
				
			var xmProduct=this.xmProduct;
			var selProject=row;
			this.$confirm('确认将项目【'+selProject.projectName+'】从产品【'+xmProduct.productName+'】移出吗？移出后，项目试图中将看不到该产品信息', '提示', {
				type: 'warning'
			}).then(()=>{
				var params={productId:xmProduct.id,projectId:selProject.id}
				delXmProductProjectLink(params).then(res=>{
					var tips = res.data.tips;
					if(tips.isOk){
						this.getXmProjects();
						this.$notify({position:'bottom-left',showClose:true,message: "移出成功", type: 'success' });
					}
				});
			})
				
			},
			
          editSomeFields(row,fieldName,$event){
            let params={};
            if(this.sels.length>0){
              if(!this.sels.some(k=> k.projectId==row.projectId &&  k.productId==row.productId)){
                this.$notify({position:'bottom-left',showClose:true,message:'请编辑选中的行',type:'warning'})
                Object.assign(this.editForm,this.editFormBak)
                return;
              }
                params['pkList']=this.sels.map(i=>{ return { projectId:i.projectId,  productId:i.productId}})
            }else{
                params['pkList']=[row].map(i=>{ return { projectId:i.projectId,  productId:i.productId}})
            }
            params[fieldName]=$event
            var func = editSomeFieldsXmProductProjectLink
            func(params).then(res=>{
              let tips = res.data.tips;
              if(tips.isOk){
                if(this.sels.length>0){
                    this.getXmProjects();
                }
                this.editFormBak=[...this.editForm]
              }else{
                Object.assign(this.editForm,this.editFormBak)
                this.$notify({position:'bottom-left',showClose:true,message:tips.msg,type:tips.isOk?'success':'error'})
              }
            }).catch((e)=>Object.assign(this.editForm,this.editFormBak))
          },
			/**end 自定义函数请在上面加**/
			
		},//end methods
		components: {
XmProjectSelect  
			 
		    //在下面添加其它组件
		},
		mounted() { 
			this.$nextTick(() => { 
				this.tableHeight =  util.calcTableMaxHeight(this.$refs.table.$el); 
				this.showInfo = false;
				this.getXmProjects();
      }); 
		}
	}

</script>

<style scoped>
* >>> .sub-navbar{
	background: #fafbfc;
}
.changebtn{
	float: right;
	padding: 0 10px;
	display: flex;
	align-items: center;
	line-height: 0;
	height: 100%;
}
.changebtn > button{
	padding: 0;
	border: 0;
	color: #333;
}
.changebtn >>> i::before{
	font-size:20px;
}
.changebtn-active{
	color: #409EFF !important;
}
.app-container{
	padding: 10px;
}
.el-menu-demo{
	border: 0 !important;
	height: 50px;
	background-color: #fafbfc;
}
.el-menu-demo>.el-menu-item,
.el-menu-demo>.el-submenu >>> .el-submenu__title{
	height: 100%;
	line-height: 50px;
	color: #909399;
}
.el-menu--horizontal>.el-menu-item:not(.is-disabled):focus,
.el-menu--horizontal>.el-menu-item:not(.is-disabled):hover,
.el-menu--horizontal>.el-submenu .el-submenu__title:hover{
	background-color: transparent;
}
.project-card{
	font-size: 12px;
	color: #999;
	margin: 10px 12px;
}
.project-card:hover{
	border-color: #00abfc;
}
.project-card >>> .el-card__body{
	padding: 20px 15px 10px;
}
.project-name{
	font-size: 16px;
	font-weight: 700;
	color: #333;
	height: 24px;
}
.project-id{
	margin-top: 4px;
	height: 18px;
}
.project-info{
	display: flex;
	margin-top: 8px;
}
.project-info>div{
	display: flex;
	flex-direction: column;
}
.info-item{
	width: 15%;
	text-align: center;
}
.info-item >>> span{
	display: block;
}
.item-total{
	font-size: 18px;
	color: #666;
}
.info-task{
	padding-left: 20px;
	width: 70%;
	border-left: 1px solid #efefef;
}
.finish-task{
	color: #00abfc !important;
}
.project-rate{
	margin: 15px 0;
}
.project-rate>.el-progress{
	display: flex;
	align-items: center;
}
.project-rate >>> .el-progress-bar{
	padding-right: 0;
	margin-right: 0;
}
.project-rate >>> .el-progress__text{
	margin-left: 5px;
}
.project-footer{
	display: flex;
}
.project-footer>div{
	width: 30%;
}
.project-footer>div:not(:first-child){
	width: 70%;
}
.project-period{
	text-align: right;
}
.see-more > i{
	background:#000;
}
/* 超过宽度则用...代替 */
.truncate{
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
[v-cloak]{
	display: none;
}
</style>