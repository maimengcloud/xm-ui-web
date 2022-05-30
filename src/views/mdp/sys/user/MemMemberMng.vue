<template>
	<section>
		<el-row  class="app-container">
			<el-input v-model="filters.key" style="width: 20%;" placeholder="模糊查询"></el-input>
			<el-button type="primary" v-loading="load.list" :disabled="load.list==true" v-on:click="searchMemMembers" icon="el-icon-search"></el-button>
			<!-- <el-button type="primary" @click="showAdd" icon="el-icon-plus">mem_member</el-button> -->
		<!-- 	<el-button type="danger" v-loading="load.del" @click="batchDel" :disabled="this.sels.length===0 || load.del==true">批量删除</el-button> -->
		</el-row>
		<el-row class="app-container">
			<!--列表 MemMember mem_member-->
			<el-table :max-height="tableHeight" :data="memMembers"  highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
<!-- 				<el-table-column sortable type="selection" width="40"></el-table-column>
				<el-table-column sortable type="index" width="40"></el-table-column> -->
				<el-table-column sortable prop="headimgurl" label="头像" min-width="80"  show-overflow-tooltip>
						<template   slot-scope="scope">
						        <span  v-show="scope.row.headimgurl!=undefined && scope.row.headimgurl!=''"><img v-bind:src="scope.row.headimgurl"></span>
						        <span  v-show="scope.row.headimgurl==undefined || scope.row.headimgurl==''"><img src="../../../../assets/image/noImg.png"></span>
						</template>
				</el-table-column>
				<el-table-column sortable prop="userid" label="用户id" min-width="80" show-overflow-tooltip>
					<!-- 	<template   slot-scope="scope">
						        <el-button @click="showDetail(scope.row)" type="text" >{{scope.row.userid}}</el-button>
						</template> -->
				</el-table-column>
				<el-table-column sortable prop="unionid" label="全局唯一编号" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column sortable prop="displayUserid" label="登录展示使用用户编号" min-width="80" show-overflow-tooltip></el-table-column>
				<!-- 是否被冻结0否1是 -->
				<el-table-column sortable prop="locked" label="是否被冻结" min-width="80" show-overflow-tooltip>
					<template slot-scope="scope">
						<span v-if="scope.row.locked=='1'">是</span>
						<span v-if="scope.row.locked=='0'">否</span>
					</template>
				</el-table-column>
				<el-table-column sortable prop="openRebate" label="是否开启会员权益" min-width="80" show-overflow-tooltip>
					<template slot-scope="scope">
						<span v-if="scope.row.openRebate=='1'">是</span>
						<span v-if="scope.row.openRebate!='1'">否</span>
					</template>
				</el-table-column>

				<el-table-column sortable prop="startdate" label="启用日期" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column sortable prop="enddate" label="到期日期" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column sortable prop="nickname" label="昵称" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column sortable prop="username" label="用户名称" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column sortable prop="sex" label="性别" min-width="80" show-overflow-tooltip>
					<template slot-scope="scope">
						<span v-if="scope.row.sex=='0'">男</span>
						<span v-if="scope.row.sex=='1'">女</span>
            <span v-if="scope.row.sex=='2'">保密</span>
					</template>
				</el-table-column>
				<!-- <el-table-column sortable prop="idCardNo" label="身份证号码" min-width="80" show-overflow-tooltip></el-table-column> -->
				<el-table-column sortable prop="birthday" label="生日" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column sortable prop="phoneno" label="移动电话号码" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column sortable prop="email" label="邮箱" min-width="80" show-overflow-tooltip></el-table-column>

				<!-- <el-table-column sortable prop="pwdtype" label="密码类型" min-width="80" show-overflow-tooltip>
					<template slot-scope="scope">
						<span v-if="scope.row.pwdtype=='1'">指纹</span>
						<span v-if="scope.row.pwdtype=='2'">密码</span>
					</template>
				</el-table-column>
				<el-table-column sortable prop="password" label="密码" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column sortable prop="salt" label="盐值" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column sortable prop="fgOne" label="指纹1" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column sortable prop="fgTwo" label="指纹2" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column sortable prop="fgThr" label="指纹3" min-width="80" show-overflow-tooltip></el-table-column> -->

				<!-- <el-table-column sortable prop="districtId" label="区县编号" min-width="80" show-overflow-tooltip></el-table-column> -->
				<el-table-column sortable prop="country" label="国家" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column sortable prop="province" label="省份" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column sortable prop="city" label="城市" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column sortable prop="address" label="详细地址" min-width="80" show-overflow-tooltip></el-table-column>

				<el-table-column sortable prop="branchId" label="机构号" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column sortable prop="shopId" label="商户编号" min-width="80" show-overflow-tooltip></el-table-column>

				<el-table-column sortable label="操作" min-width="100" fixed="right"  show-overflow-tooltip>
					<template slot-scope="scope">
            <el-button v-loading="load.add" type="primary" @click.native="addSubmit(scope.row,scope.$index)" >添加</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination>

		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	//import Sticky from '@/components/Sticky' // 粘性header组件
	//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	// import { listMemMember, delMemMember, batchDelMemMember,editMemMember } from '@/api/mk/mem/memMember';
   import { selectByMemMember,addSubacctAddForm } from '@/api/mdp/sys/userTpa';
   // import { addUserTpa, } from '@/api/mdp/sys/userTpa';
	import { mapGetters } from 'vuex'
	export default {
		computed: {
		    ...mapGetters([
        'userInfo'
		    ])
		},
		// fromMemMemberTagUserId  from-mem-member-tag-user-id from-mem-member-location-user-id
		props:['visible','userTpa','branch','users'],
		watch: {
      	'userTpa':function( userTpa ) {
        this.addForm = userTpa;
      },
	      'visible':function(visible) {
	      	if(visible==true){
				  //从新打开页面时某些数据需要重新加载，可以在这里添加
				  console.log("visit---:MemMenmberMng")
				  this.getMemMembers();

	      	}
	      }
		},

		data() {
			return {
				filters: {
					key: ''
				},
				memMembers: [],//查询结果
				pageInfo:{//分页数据
					total:0,//服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
					pageSize:10,//每页数据
					// count:false,//是否需要重新计算总记录数
					pageNum:1,//当前页码、从1开始计算
					orderFields:['startdate'],//排序列 如 ['sex','student_id']，必须为数据库字段
					orderDirs:['desc']//升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
				},
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				loading:false,
				sels: [],//列表选中数据
				options:{},//下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]}
				//访问其他页面
				addFormVisible: false,//新增memMember界面是否显示
				//新增memMember界面初始化数据
				addForm:{unionid:'',displayUserid:'',userid:'',locked:'',startdate:'',nickname:'',username:'',phoneno:'',password:'',salt:'',pwdtype:'',headimgurl:'',country:'',city:'',province:'',address:'',sex:'',enddate:'',districtId:'',email:'',fgOne:'',fgTwo:'',fgThr:'',idCardNo:'',branchId:'',birthday:'',shopId:'',openRebate:''},
				//memMembers:{unionid:'',displayUserid:'',userid:'',locked:'',startdate:'',nickname:'',username:'',phoneno:'',password:'',salt:'',pwdtype:'',headimgurl:'',country:'',city:'',province:'',address:'',sex:'',enddate:'',districtId:'',email:'',fgOne:'',fgTwo:'',fgThr:'',idCardNo:'',branchId:'',birthday:'',shopId:'',openRebate:''},
        editFormVisible: false,//编辑界面是否显示
				//编辑memMember界面初始化数据,
				tableHeight:500,
				editForm:{unionid:'',displayUserid:'',userid:'',locked:'',startdate:'',nickname:'',username:'',phoneno:'',password:'',salt:'',pwdtype:'',headimgurl:'',country:'',city:'',province:'',address:'',sex:'',enddate:'',districtId:'',email:'',fgOne:'',fgTwo:'',fgThr:'',idCardNo:'',branchId:'',birthday:'',shopId:'',openRebate:''},

			}
		},//end data
		methods: {
			handleSizeChange(pageSize) {
				this.pageInfo.pageSize=pageSize;
				this.getMemMembers();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getMemMembers();
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
				this.getMemMembers();
			},
			searchMemMembers(){
				 this.pageInfo.count=true;
				 this.getMemMembers();
			},
			//获取列表 MemMember mem_member
			getMemMembers() {
				let params = {
          branchId:this.branch.id,
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
				this.load.list = true;
        console.log("查看memMember");
        console.log(params);
				selectByMemMember(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){
            console.log("res.data");
            console.log(res.data);
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
						this.memMembers = res.data.data;
					}else{
						this.$notify({ message: tips.msg, type: 'error' });
					}
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},

			//选择行memMember
			selsChange: function (sels) {
				this.sels = sels;
			},

			rowClick: function(row, event, column){
				this.$emit('row-click',row, event, column);//  @row-click="rowClick"
			},

			/**begin 自定义函数请在下面加**/
			// 取消按钮点击 父组件监听@cancel="addFormVisible=false" 监听
			handleCancel:function(){
			//	this.$refs['addForm'].resetFields();
				this.$emit('cancel');
			},
			//新增提交UserTpa 第三方系统向我方开放的用户列表 父组件监听@submit="afterAddSubmit"
      	addSubmit: function (row,index) {
             console.log("打印row");
           console.log(row);
      	this.$confirm('确认提交吗？', '提示', {}).then(() => {
      		this.load.add=true
          let params ={
            users:this.users,
            memMembers:Object.assign({}, row),
          };
 //         debugger
          console.log("查看params");
          console.log(params);
      	addSubacctAddForm(params).then((res) => {
      			this.load.add=false;
      			var tips=res.data.tips;
      			if( tips.isOk ){
      			this.$emit('submit');
      			}
      			this.$notify({ message: tips.msg, type: tips.isOk?'success':'error'});
      		});
      	}).catch(() => this.load.add=false );
      },

			/**end 自定义函数请在上面加**/

		},//end methods
		components: {
		     
		    //在下面添加其它组件
		},
		mounted() {   
			this.$nextTick(() => {
				this.tableHeight = window.innerHeight - 250;   
			}); 
			this.$nextTick(() => {
				this.getMemMembers();
        	});
		}
	}

</script>

<style scoped>
img {
    border-style: none;
    height: 50px;
}

</style>
