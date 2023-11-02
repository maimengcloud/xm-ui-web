<template>
	<section>
		<el-row>
			<div style="float:right;padding-right:40px;">
				<xm-product-select @row-click="onProductSelect" :autoSelect="false" v-if="selProject && selProject.id">
					<el-link type="primary" slot="title">选择更多产品加入项目</el-link>
				</xm-product-select>
 				<xm-project-select :autoSelect="false" @row-click="onProjectSelect" v-if="xmProduct && xmProduct.id">
					 <el-link type="primary" slot="title">
						 选择更多项目加入产品
					 </el-link>
				</xm-project-select>
 			</div>
		</el-row>
		<el-row>
			<!--列表 XmProductProjectLink 产品与项目的关联关系表，一般由产品经理挂接项目到产品上-->
			<el-table ref="xmProductProjectLink" :data="xmProductProjectLinks" height="100px" v-adaptive="{bottomOffset:50}" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
 				<el-table-column prop="name" v-if="xmProduct" label="包含的项目名称" min-width="150" >
					<template scope="scope">
						<el-link type="primary" @click="goToProject(scope.row,scope.$index)">{{scope.row.name}}</el-link>
					</template>
				</el-table-column>
				<el-table-column prop="productName" v-if="selProject" label="包含的产品名称" min-width="150" >
					<template scope="scope">
						<el-link type="primary" @click="goToProduct(scope.row,scope.$index)">{{scope.row.productName}}</el-link>
					</template>
				</el-table-column>
				<el-table-column prop="seq" label="顺序" min-width="80" sortable>
					<template scope="scope">
				       {{scope.row.seq}}
                     <span class="cell-bar"><el-input style="display:inline;" title="0-999之间，数值越小越靠前" v-model="scope.row.seq" placeholder="" @change="editSomeFields(scope.row,'seq',$event)" :maxlength="22"></el-input></span>
					</template>
				</el-table-column>
				<el-table-column prop="ctime" label="加入时间" min-width="80" ></el-table-column>
				<el-table-column prop="cusername" label="操作者" min-width="80" ></el-table-column>
 				<el-table-column label="操作" width="250" fixed="right">
					<template scope="scope">
						<el-button v-if="xmProduct && xmProduct.id" type="primary" @click="goToProject(scope.row,scope.$index)" icon="el-icon-search" >进入项目</el-button>
						<el-button v-if="selProject && selProject.id" type="primary" @click="goToProduct(scope.row,scope.$index)" icon="el-icon-search" >进入产品</el-button>

 						<el-button type="danger" @click="handleDel(scope.row,scope.$index)" icon="el-icon-delete" v-loading="load.del">移出</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination>

		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import config from '@/common/config';//全局公共库

	import { listXmProductProjectLink,addXmProductProjectLink, delXmProductProjectLink, batchDelXmProductProjectLink,editSomeFieldsXmProductProjectLink } from '@/api/xm/core/xmProductProjectLink';
	import  XmProductProjectLinkAdd from './XmProductProjectLinkAdd';//新增界面
	import  XmProductProjectLinkEdit from './XmProductProjectLinkEdit';//修改界面
	import { mapGetters } from 'vuex'
import XmProductSelect from '@/views/xm/core/components/XmProductSelect.vue'
import XmProjectSelect from '@/views/xm/core/components/XmProjectSelect.vue'

	export default {
		props:['selProject','xmProduct'],
		computed: {
		    ...mapGetters([
		      'userInfo','workSpace'
		    ])
		},
		watch:{
			selProject(){
				this.getXmProductProjectLinks()
			},
			xmProduct(){
				this.getXmProductProjectLinks()
			}
		},
		data() {
			return {
				filters: {
					key: ''
				},
				xmProductProjectLinks: [],//查询结果
				pageInfo:{//分页数据
					total:0,//服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
					pageSize:10,//每页数据
					count:true,//是否需要重新计算总记录数
					pageNum:1,//当前页码、从1开始计算
					orderFields:['seq'],//排序列 如 ['sex','student_id']，必须为数据库字段
					orderDirs:['asc']//升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
				},
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				sels: [],//列表选中数据
				dicts:{
					//sex:[],
				},//下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]}

				addFormVisible: false,//新增xmProductProjectLink界面是否显示
				//新增xmProductProjectLink界面初始化数据
				addForm: {
					projectId:'',productId:'',ctime:'',cuserid:'',cusername:'',linkStatus:''
				},

				editFormVisible: false,//编辑界面是否显示
				//编辑xmProductProjectLink界面初始化数据
				editForm: {
					projectId:'',productId:'',ctime:'',cuserid:'',cusername:'',linkStatus:''
				},
				maxTableHeight:300,
 			}
		},//end data
		methods: {
			handleSizeChange(pageSize) {
				this.pageInfo.pageSize=pageSize;
				this.getXmProductProjectLinks();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getXmProductProjectLinks();
			},
			// 表格排序 obj.order=ascending/descending,需转化为 asc/desc ; obj.prop=表格中的排序字段,字段驼峰命名
			sortChange( obj ){
				if(obj.order==null){
					this.pageInfo.orderFields=[];
					this.pageInfo.orderDirs=[];
				}else{
					var dir='asc';
					if(obj.order=='ascending'){
						dir='asc'
					}else{
						dir='desc';
					}

					this.pageInfo.orderFields=[util.toLine(obj.prop)];
					this.pageInfo.orderDirs=[dir];
				}
				this.getXmProductProjectLinks();
			},
			searchXmProductProjectLinks(){
				 this.pageInfo.count=true;
				 this.getXmProductProjectLinks();
			},
			//获取列表 XmProductProjectLink 产品与项目的关联关系表，一般由产品经理挂接项目到产品上
			getXmProductProjectLinks() {
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
				if(this.filters.key){
					params.key="%"+this.filters.key+"%"
				}
				if(this.selProject){
					params.projectId=this.selProject.id
				}
				if(this.xmProduct){
					params.productId=this.xmProduct.id
				}
				this.load.list = true;
				listXmProductProjectLink(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
						this.xmProductProjectLinks = res.data.data;
					}else{
						this.$notify({ message: tips.msg, type: 'error' });
					}
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},

			//显示编辑界面 XmProductProjectLink 产品与项目的关联关系表，一般由产品经理挂接项目到产品上
			showEdit: function ( row,index ) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面 XmProductProjectLink 产品与项目的关联关系表，一般由产品经理挂接项目到产品上
			showAdd: function () {
				this.addFormVisible = true;
				//this.addForm=Object.assign({}, this.editForm);
			},
			afterAddSubmit(){
				this.addFormVisible=false;
				this.pageInfo.count=true;
				this.getXmProductProjectLinks();
			},
			afterEditSubmit(){
				this.editFormVisible=false;
			},
			//选择行xmProductProjectLink
			selsChange: function (sels) {
				this.sels = sels;
			},
			//删除xmProductProjectLink
			handleDel: function (row,index) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.load.del=true;
					let params = { projectId: row.projectId,productId:row.productId };
					delXmProductProjectLink(params).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if(tips.isOk){
							this.pageInfo.count=true;
							this.getXmProductProjectLinks();
						}
						this.$notify({ message: tips.msg, type: tips.isOk?'success':'error' });
					}).catch( err  => this.load.del=false );
				});
			},
			//批量删除xmProductProjectLink
			batchDel: function () {

				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.load.del=true;
					batchDelXmProductProjectLink(this.sels).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if( tips.isOk ){
							this.pageInfo.count=true;
							this.getXmProductProjectLinks();
						}
						this.$notify({ message: tips.msg, type: tips.isOk?'success':'error'});
					}).catch( err  => this.load.del=false );
				});
			},
			rowClick: function(row, event, column){
				this.$emit('row-click',row, event, column);//  @row-click="rowClick"
			},
			/**begin 自定义函数请在下面加**/

			/**begin 自定义函数请在下面加**/
			onProductSelect(product){
				this.$confirm('确认建立与产品【'+product.productName+'】的关联关系吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.load.add=true;
					this.addForm.projectId=this.selProject.id;
					this.addForm.productId= product.id;
					addXmProductProjectLink(this.addForm).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if( tips.isOk ){
							this.pageInfo.count=true;
							this.getXmProductProjectLinks();
						}
						this.$notify({ message: tips.msg, type: tips.isOk?'success':'error'});
					}).catch( err  => this.load.del=false );
				});
			},
			onProjectSelect(project){
				this.$confirm('确认建立与项目【'+project.name+'】的关联关系吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.load.del=true;
					this.addForm.projectId=project.id;
					this.addForm.productId=this.xmProduct.id;
					addXmProductProjectLink(this.addForm).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if( tips.isOk ){
							this.pageInfo.count=true;
							this.getXmProductProjectLinks();
						}
						this.$notify({ message: tips.msg, type: tips.isOk?'success':'error'});
					}).catch( err  => this.load.del=false );
				});
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
                this.getXmProductProjectLinks();
              }else{
                Object.assign(this.editForm,this.editFormBak)
                this.$notify({position:'bottom-left',showClose:true,message:tips.msg,type:tips.isOk?'success':'error'})
              }
            }).catch((e)=>Object.assign(this.editForm,this.editFormBak))
          },

			goToProject(row){
				this.$router.push({path:'/xm/core/project/overview',query:{projectId:row.projectId}})
			},
			goToProduct(row){
				this.$router.push({path:'/xm/core/product/overview',query:{productId:row.productId}})
			},
			/**end 自定义函数请在上面加**/

		},//end methods
		components: {
		    'xm-product-project-link-add':XmProductProjectLinkAdd,
		    'xm-product-project-link-edit':XmProductProjectLinkEdit,
			XmProductSelect,
			XmProjectSelect,
		},
		mounted() {
			this.$nextTick(() => {
				this.getXmProductProjectLinks();
                this.maxTableHeight =  util.calcTableMaxHeight(".el-table")
        	});
        	/** 举例，

			**/
		}
	}

</script>

<style scoped>
</style>
