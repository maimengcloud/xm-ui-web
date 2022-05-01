<template>
	<section class="page-container border padding">
		<el-row>
			<el-input v-model="filters.key" style="width: 20%;" placeholder="模糊查询"></el-input>
			<el-button v-loading="load.list" :disabled="load.list==true" @click="searchUserLoginRecords" icon="el-icon-search">查询</el-button> 
		</el-row>
		<el-row class="padding-top">
			<!--列表 UserLoginRecord 用户登录信息登记-->
			<el-table ref="userLoginRecordTable" :data="userLoginRecords" :height="maxTableHeight" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
				<el-table-column  type="selection" width="55" show-overflow-tooltip fixed="left"></el-table-column>
				<el-table-column sortable type="index" width="55" show-overflow-tooltip  fixed="left"></el-table-column>
 				<el-table-column prop="userid" label="用户编号" min-width="80" show-overflow-tooltip   fixed="left">
                    <template slot-scope="scope">
                      <span >
                        {{scope.row.userid}}
                      </span> 
                    </template>
				</el-table-column>  
				<el-table-column prop="loginType" label="登录方式" min-width="80" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <span >
                        {{scope.row.loginType}}
                      </span> 
                    </template>
				</el-table-column>
				<el-table-column prop="loginTime" label="登录时间" min-width="80" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <span >
                        {{scope.row.loginTime}}
                      </span> 
                    </template>
				</el-table-column>
				<el-table-column prop="loginBranchId" label="登录机构号" min-width="80" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <span >
                        {{scope.row.loginBranchId}}
                      </span> 
                    </template>
				</el-table-column>
				<el-table-column prop="username" label="登录用户名" min-width="80" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <span >
                        {{scope.row.username}}
                      </span> 
                    </template>
				</el-table-column>    
				<el-table-column prop="phoneno" label="登录手机号" min-width="80" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <span >
                        {{scope.row.phoneno}}
                      </span> 
                    </template>
				</el-table-column>
				<el-table-column prop="loginIp" label="登录ip" min-width="80" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <span >
                        {{scope.row.loginIp}}
                      </span> 
                    </template>
				</el-table-column>  
				<el-table-column prop="userAgent" label="请求特征码" min-width="80" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <span >
                        {{scope.row.userAgent}}
                      </span> 
                    </template>
				</el-table-column> 
        <!--
				<el-table-column prop="deviceType" label="设备类型" min-width="80" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <span >
                        {{scope.row.deviceType}}
                      </span> 
                    </template>
				</el-table-column>
				<el-table-column prop="os" label="操作系统" min-width="80" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <span >
                        {{scope.row.os}}
                      </span> 
                    </template>
				</el-table-column>
				<el-table-column prop="osVersion" label="操作系统版本如Android" min-width="80" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <span >
                        {{scope.row.osVersion}}
                      </span> 
                    </template>
				</el-table-column>
				<el-table-column prop="osName" label="系统名称" min-width="80" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <span >
                        {{scope.row.osName}}
                      </span> 
                    </template>
				</el-table-column> 
				<el-table-column prop="deviceManufacturer" label="设备生产厂商" min-width="80" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <span >
                        {{scope.row.deviceManufacturer}}
                      </span> 
                    </template>
				</el-table-column>
				<el-table-column prop="browerGroup" label="浏览器组" min-width="80" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <span >
                        {{scope.row.browerGroup}}
                      </span> 
                    </template>
				</el-table-column>
				<el-table-column prop="borderName" label="浏览器名称" min-width="80" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <span >
                        {{scope.row.borderName}}
                      </span> 
                    </template>
				</el-table-column>
				<el-table-column prop="borderVersion" label="浏览器版本" min-width="80" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <span >
                        {{scope.row.borderVersion}}
                      </span> 
                    </template>
				</el-table-column>
				<el-table-column prop="longitude" label="经度" min-width="80" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <span >
                        {{scope.row.longitude}}
                      </span> 
                    </template>
				</el-table-column>
				<el-table-column prop="latitude" label="纬度" min-width="80" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <span >
                        {{scope.row.latitude}}
                      </span> 
                    </template>
				</el-table-column>     
        -->
				<el-table-column prop="loginStatus" label="登录状态" min-width="80" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <el-tag v-if="scope.row.loginStatus=='0'" type="danger">
                        失败 
                      </el-tag> 
                      <el-tag v-else type="success">
                        成功
                      </el-tag> 
                    </template>
				</el-table-column>
				<el-table-column prop="loginMsg" label="登录说明" min-width="80" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <span >
                        {{scope.row.loginMsg}}
                      </span> 
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
 	import { initDicts,listUserLoginRecord, delUserLoginRecord, batchDelUserLoginRecord,editSomeFieldsUserLoginRecord } from '@/api/mdp/sys/userLoginRecord';
 	import { mapGetters } from 'vuex'
	
	export default {
	    name:'userLoginRecordMng',
		components: { 
		},
		props:['visible'],
		computed: {
		    ...mapGetters(['userInfo']),

		},
		watch:{
            visible(val){
                if(val==true){
                    this.initData();
                    this.searchUserLoginRecords()
                }
            }
		},
		data() {
			return {
				filters: {
					key: ''
				},
				userLoginRecords: [],//查询结果
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
				dicts:{
				    //sex: [{id:'1',name:'男'},{id:'2',name:'女'}]
				},//下拉选择框的所有静态数据 params={categoryId:'all',itemCodes:['sex']} 返回结果 {sex: [{id:'1',name:'男'},{id:'2',name:'女'}]}
				addFormVisible: false,//新增userLoginRecord界面是否显示
				addForm: {
					userid:'',shopId:'',locationId:'',loginShopid:'',loginLocationid:'',branchId:'',loginType:'',loginTime:'',loginBranchId:'',username:'',authId:'',mdpAppid:'',lockNo:'',lockStatus:'',lockTime:'',phoneno:'',loginIp:'',userType:'',loginDeviceId:'',loginDeviceSn:'',userAgent:'',reqNo:'',deviceType:'',os:'',osVersion:'',osName:'',renderingEngine:'',deviceManufacturer:'',browerGroup:'',borderName:'',borderVersion:'',id:'',longitude:'',latitude:'',regionId:'',regionName:'',formatAddress:'',districtId:'',memType:'',loginStatus:'',loginMsg:'',authType:'',grantType:''
				},
				
				editFormVisible: false,//编辑界面是否显示
				editForm: {
					userid:'',shopId:'',locationId:'',loginShopid:'',loginLocationid:'',branchId:'',loginType:'',loginTime:'',loginBranchId:'',username:'',authId:'',mdpAppid:'',lockNo:'',lockStatus:'',lockTime:'',phoneno:'',loginIp:'',userType:'',loginDeviceId:'',loginDeviceSn:'',userAgent:'',reqNo:'',deviceType:'',os:'',osVersion:'',osName:'',renderingEngine:'',deviceManufacturer:'',browerGroup:'',borderName:'',borderVersion:'',id:'',longitude:'',latitude:'',regionId:'',regionName:'',formatAddress:'',districtId:'',memType:'',loginStatus:'',loginMsg:'',authType:'',grantType:''
				},
				maxTableHeight:300,
			}
		},//end data
		methods: {

		    ...util,

			handleSizeChange(pageSize) { 
				this.pageInfo.pageSize=pageSize; 
				this.getUserLoginRecords();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getUserLoginRecords();
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
				this.getUserLoginRecords();
			},
			searchUserLoginRecords(){
				 this.pageInfo.count=true; 
				 this.getUserLoginRecords();
			},
			//获取列表 UserLoginRecord 用户登录信息登记
			getUserLoginRecords() {
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
					params.key=this.filters.key
				}

				this.load.list = true;
				listUserLoginRecord(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
						this.userLoginRecords = res.data.data;
					}else{
						this.$notify({ position:'bottom-left',showClose:true, message: tips.msg, type: 'error' });
					} 
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},

			//显示编辑界面 UserLoginRecord 用户登录信息登记
			showEdit: function ( row,index ) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面 UserLoginRecord 用户登录信息登记
			showAdd: function () {
				this.addFormVisible = true;
				//this.addForm=Object.assign({}, this.editForm);
			},
			afterAddSubmit(){
				this.addFormVisible=false;
				this.pageInfo.count=true;
				this.getUserLoginRecords();
			},
			afterEditSubmit(){
				this.editFormVisible=false;
			},
			//选择行userLoginRecord
			selsChange: function (sels) {
				this.sels = sels;
			}, 
			//删除userLoginRecord
			handleDel: function (row,index) { 
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					let params = {  id:row.id };
					delUserLoginRecord(params).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if(tips.isOk){
							this.searchUserLoginRecords();
						}
						this.$notify({ position:'bottom-left', showClose:true, message: tips.msg, type: tips.isOk?'success':'error' });
					}).catch( err  => this.load.del=false );
				});
			},
			//批量删除userLoginRecord
			batchDel: function () {
				if(this.sels.length<=0){
				    return;
				}
				var params=this.sels.map(i=>{
				    return { id:i.id}
				})
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					batchDelUserLoginRecord(params).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if( tips.isOk ){
							this.searchUserLoginRecords();
						}
						this.$notify({ position:'bottom-left',showClose:true, message: tips.msg, type: tips.isOk?'success':'error'});
					}).catch( err  => this.load.del=false );
				});
			},
          editSomeFields(row,fieldName,$event){
            let params={};
            if(this.sels.length>0){
              if(!this.sels.some(k=> k.id==row.id)){
                this.$notify({position:'bottom-left',showClose:true,message:'请编辑选中的行',type:'warning'})
                Object.assign(this.editForm,this.editFormBak)
                return;
              }
                params['ids']=this.sels.map(i=>i.id)
            }else{
                params['ids']=[row].map(i=>i.id)
            }
            params[fieldName]=$event
            var func = editSomeFieldsUserLoginRecord
            func(params).then(res=>{
              let tips = res.data.tips;
              if(tips.isOk){
                if(this.sels.length>0){
                    this.searchUserLoginRecords();
                }
                this.editFormBak=[...this.editForm]
              }else{
                Object.assign(this.editForm,this.editFormBak)
                this.$notify({position:'bottom-left',showClose:true,message:tips.msg,type:tips.isOk?'success':'error'})
              }
            }).catch((e)=>Object.assign(this.editForm,this.editFormBak))
          },
			rowClick: function(row, event, column){
			    this.editForm=row
			    this.editFormBak={...row};
				this.$emit('row-click',row, event, column);//  @row-click="rowClick"
			},
            initData: function(){

            },
			
		},//end methods
		mounted() {
			this.$nextTick(() => {
			    initDicts(this);
			    this.initData()
				this.searchUserLoginRecords();
                this.maxTableHeight = util.calcTableMaxHeight(this.$refs.userLoginRecordTable.$el)

        	});
		}
	}

</script>

<style scoped>
</style>