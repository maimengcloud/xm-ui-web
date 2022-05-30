<template>
	<section class="page-container border padding">
		<el-row>
			<el-form label-width="300px" :model="editForm" ref="editForm">
				<!--1-普通文本，2-数字，3-日期，4-单选列表，5-多选列表，6-单文件，7-多文件，8-富文本，9-单图文，10多图文,11-单视频，12-多视频，13单选radio,14多选checkbox-->
				<el-form-item v-for="(item ,index) in items" :key="index" :label="item.itemName" >
					<div v-if="item.itemType=='1'">
						<el-input :maxlength="item.itemSize" v-model="item.dvalues" :placeholder="item.inputFormat" style="width:60%;"></el-input>&nbsp;&nbsp;<font color="blue">{{item.remark}}</font>
					</div>
					<div v-else-if="item.itemType=='2'">
						<el-input type="number" :max="item.itemSize" v-model="item.dvalues" :placeholder="item.inputFormat" style="width:60%;"></el-input>&nbsp;&nbsp;<font color="blue">{{item.remark}}</font>
					</div>
					
					<div v-else-if="item.itemType=='3'">
						<el-date-picker type="date" :max="item.itemSize" v-model="item.dvalues" :placeholder="item.inputFormat" style="width:60%;"></el-date-picker>&nbsp;&nbsp;<font color="blue">{{item.remark}}</font>
					</div> 
					<div v-else-if="item.itemType=='4'">
						<el-select v-model="item.dvalues"  style="width:60%;">
							<el-option v-for="(op,idx) in item.options" :label="op.name" :key="idx" :value="op.id">
							</el-option>
						</el-select>&nbsp;&nbsp;<font color="blue">{{item.remark}}</font>
					</div>
					<div v-else-if="item.itemType=='5'">
						<el-select v-model="item.dvaluesList" multiple  style="width:60%;">
							<el-option v-for="(op,idx) in item.options" :label="op.name" :key="idx" :value="op.id">
							</el-option>
						</el-select>&nbsp;&nbsp;<font color="blue">{{item.remark}}</font>
					</div>
					<div v-else-if="item.itemType=='6'">
						<el-input :maxlength="item.itemSize" v-model="item.dvalues" :placeholder="item.inputFormat" style="width:60%;"></el-input>&nbsp;&nbsp;<font color="blue">{{item.remark}}</font>
					</div>
					<div v-else-if="item.itemType=='7'">
						<el-select v-model="item.dvaluesList" multiple  style="width:60%;">
							<el-option v-for="(op,idx) in item.options" :label="op.name" :key="idx" :value="op.id">
							</el-option>
						</el-select>&nbsp;&nbsp;<font color="blue">{{item.remark}}</font>
					</div>
					<div v-else-if="item.itemType=='8'">
						<el-input type="textarea" rows=6 :maxlength="item.itemSize" v-model="item.dvalues" :placeholder="item.inputFormat" style="width:60%;"></el-input>&nbsp;&nbsp;<font color="blue">{{item.remark}}</font>
					</div>
					
					<div v-else-if="item.itemType=='9'">
						<el-input :maxlength="item.itemSize" v-model="item.dvalues" :placeholder="item.inputFormat" style="width:60%;"></el-input>&nbsp;&nbsp;<font color="blue">{{item.remark}}</font>
					</div>
					
					<div v-else-if="item.itemType=='10'">
						<el-select v-model="item.dvaluesList" multiple  style="width:60%;">
							<el-option v-for="(op,idx) in item.options" :label="op.name" :key="idx" :value="op.id">
							</el-option>
						</el-select>&nbsp;&nbsp;<font color="blue">{{item.remark}}</font>
					</div>
					
					<div v-else-if="item.itemType=='11'">
						<el-input  :maxlength="item.itemSize" v-model="item.dvalues" :placeholder="item.inputFormat" style="width:60%;"></el-input>&nbsp;&nbsp;<font color="blue">{{item.remark}}</font>
					</div>
					
					<div v-else-if="item.itemType=='12'"> 
						<el-select v-model="item.dvaluesList" multiple  style="width:60%;">
							<el-option v-for="(op,idx) in item.options" :label="op.name" :key="idx" :value="op.id">
							</el-option>
						</el-select>&nbsp;&nbsp;<font color="blue">{{item.remark}}</font>
					</div>
					
					<div v-else-if="item.itemType=='13'">
						<el-radio-group v-model="item.dvalues" placeholder="默认选中" multiple>
						<el-radio
						v-for="(op,opidx) in item.options"
						:key="opidx"
						:label="op.name"
						:value="op.id">
						</el-radio>
					</el-radio-group>
 					</div>
					
					<div v-else-if="item.itemType=='14'">
						<el-checkbox-group v-model="item.dvaluesList" placeholder="默认选中">
						<el-checkbox
						v-for="(op,opidx) in item.options"
						:key="opidx"
						:label="op.id">
						{{op.name}}
						</el-checkbox>
					</el-checkbox-group>
					</div>
				</el-form-item>
			</el-form>
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import config from '@/common/config';//全局公共库 
	import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { listItem, delItem, batchDelItem } from '@/api/mdp/meta/item';
	import { mapGetters } from 'vuex' 
	import { listCategory } from '@/api/mdp/meta/category';
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		data() {
			return {
				filters: {
					key: '',
					categoryId:'sysParam',
				},
				categorys:[],
				items: [],//查询结果
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
				optionList:{
					//sex:[],
				},//下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				
				addFormVisible: false,//新增item界面是否显示
				//新增item界面初始化数据
				addForm: {
					id:'',itemCode:'',itemName:'',remark:'',categoryId:'sysParam',itemSize:'',itemType:'',branchId:'',deptid:'',cmenu:'',dvalues:'',dnames:'',optionList:'',inputFormat:'',required:'',seq:'',tableName:'',isShow:'',qx:''
				},
				
				editFormVisible: false,//编辑界面是否显示
				//编辑item界面初始化数据
				editForm: {
					id:'',itemCode:'',itemName:'',remark:'',categoryId:'',itemSize:'',itemType:'',branchId:'',deptid:'',cmenu:'',dvalues:'',dnames:'',optionList:'',inputFormat:'',required:'',seq:'',tableName:'',isShow:'',qx:''
				},
				maxTableHeight:300, 
				multipleItemTypeIds:['5','7','10','12','14'],
			}
		},//end data
		methods: { 
			handleSizeChange(pageSize) { 
				this.pageInfo.pageSize=pageSize; 
				this.getItems();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getItems();
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
				this.getItems();
			},
			searchItems(){
				 this.pageInfo.count=true; 
				 this.getItems();
			},
			//获取列表 Item 数据项定义
			getItems() {
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
					params.key= this.filters.key 
				}
				if(this.filters.categoryId){
					params.categoryId=this.filters.categoryId
				}
				this.load.list = true;
				listItem(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
						var items=res.data.data;
						items.forEach(i=>{ 
								if(i.optionList){
									i.options=JSON.parse(i.optionList)
								} 
							if(this.multipleItemTypeIds.some(k=>i.itemType==k)){
								i.dvaluesList=[]
								if(i.dvalues){
									i.dvaluesList=i.dvalues.split(",")
								}
							}
						})
						this.items = items;
					}else{
						this.$notify({ message: tips.msg, type: 'error' });
					} 
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},

			//显示编辑界面 Item 数据项定义
			showEdit: function ( row,index ) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面 Item 数据项定义
			showAdd: function () {
				this.addFormVisible = true;
				//this.addForm=Object.assign({}, this.editForm);
			},
			afterAddSubmit(){
				this.addFormVisible=false;
				this.pageInfo.count=true;
				this.getItems();
			},
			afterEditSubmit(){
				this.editFormVisible=false;
			},
			//选择行item
			selsChange: function (sels) {
				this.sels = sels;
			}, 
			//删除item
			handleDel: function (row,index) { 
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					let params = { id: row.id };
					delItem(params).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if(tips.isOk){ 
							this.pageInfo.count=true;
							this.getItems();
						}
						this.$notify({ message: tips.msg, type: tips.isOk?'success':'error' }); 
					}).catch( err  => this.load.del=false );
				});
			},
			//批量删除item
			batchDel: function () {
				
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					batchDelItem(this.sels).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if( tips.isOk ){ 
							this.pageInfo.count=true;
							this.getItems(); 
						}
						this.$notify({ message: tips.msg, type: tips.isOk?'success':'error'});
					}).catch( err  => this.load.del=false );
				});
			},
			rowClick: function(row, event, column){
				this.$emit('row-click',row, event, column);//  @row-click="rowClick"
			},
			/**begin 自定义函数请在下面加**/
			//获取列表 Category 元数据分类
			getCategorys() {
				let params = {
				 
				}; 
				this.load.list = true;
				listCategory(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){  
						this.categorys = res.data.data;
					}else{
						this.$notify({ message: tips.msg, type: 'error' });
					} 
					this.load.list = false;
				}).catch(() => {
					this.load.list = false; 
				});
			},
			formatteroptionList(row,colum,cellValue,index){
				if(cellValue){
					var arr=JSON.parse(cellValue)
					return arr.map(i=>i.name).join(",")
				}else{
					return ""
				}
			}
			/**end 自定义函数请在上面加**/
			
		},//end methods
		components: { 
		},
		mounted() {  
			this.$nextTick(() => {
				this.getItems(); 
				
        	}); 
		}
	}

</script>

<style scoped>
</style>