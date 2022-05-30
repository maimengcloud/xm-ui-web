<template>
	<section> 
		<el-tabs v-model="activeTabPane">
			<el-tab-pane name="1" label="常用">
				<el-row style="height:30px;"> 
					<el-button type="primary" v-if="sels.length>0"  v-on:click="confirmUsers">确定</el-button>
				</el-row>
				<el-table  :row-key="'userid'"	 :data="users" :height="maxTableHeight" highlight-current-row v-loading="load.list" border @selection-change="selsChange" style="width: 100%;" ref="userTable" @row-click="rowClick">
					<el-table-column :reserve-selection="true"	type="selection" width="65"></el-table-column>
					<el-table-column type="index" width="65"></el-table-column>
					<el-table-column prop="username" sortable label="用户名称" min-width="120" >
						<template slot-scope="scope">
							<div class="avatar-container">
								<div class="avatar-wrapper">
									<img v-if=" scope.row.headimgurl " class="user-avatar" :src="scope.row.headimgurl">
									<img v-else class="user-avatar" src="../../../../assets/image/user_img.gif">
									<span class="username"><i v-if="scope.row.sex=='0'" class="el-icon-female"></i><i v-else class="el-icon-male"></i> {{scope.row.username}}</span> 
								</div>    
							</div>
						</template>
					</el-table-column> 
					<el-table-column prop="displayUserid" label="登录账号" min-width="150" ></el-table-column> 
				</el-table>
			</el-tab-pane>
			<el-tab-pane name="2" label="部门用户">
				 <users-select-only :isSingleUser='isSingleUser' :selectUserids='selectUserids' :isSelectByDept='isSelectByDept' @confirm="onConfirmUsers"></users-select-only>
			</el-tab-pane> 
		</el-tabs> 
	</section>
</template>

<script>
import util from '@/common/js/util';//全局公共库  
 import { mapGetters } from 'vuex'
 import UsersSelectOnly from './UsersSelectOnly.vue'; 
	export default {
		props:['isSingleUser','selectUserids','isSelectByDept'],
	    computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		watch:{ 
		},
		data() {
			return {
				filters: {
					key: '', 
				},
				sels:[],
				users: [],//查询结果
				pageInfo:{//分页数据
					total:0,//服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
					pageSize:10,//每页数据
					pageNum:1,//当前页码、从1开始计算
					orderFields:[],//排序列 如 ['sex','student_id']，必须为数据库字段
					orderDirs:[]//升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
				},
				load:{ list: false, edit: false, del: false, add: false },//查询中... 
				options:{sex:[],locked:[]},//下拉选择框的所有静态数据 options.sex,options.project  
				activeTabPane:'1',
				maxTableHeight:500,
			}
		},//end data

		methods: {
			 
			//选择行user
			selsChange: function (sels) {
				 this.sels=sels
			},
			
			rowClick: function(row, event, column){ 
				this.$refs.userTable.toggleRowSelection(row);
			},
			unselectUser:function(user){
				this.$refs.userTable.toggleRowSelection(user,false);
			},

			onConfirmUsers(users){ 
				var notHad=false;
				 users.forEach(u=>{
					 if(!this.users.some(k=>k.userid==u.userid)){
						 notHad=true;
						 this.users.unshift(u)
					 }
				 })
				 if(notHad){ 
					 var us=JSON.stringify(this.users)
				 	localStorage.setItem("mdp-his-users",us)
				 }
				 this.$emit('confirm',users);
				
			},
			confirmUsers: function(){
				if(this.sels.length<1){
					this.$notify({position:'bottom-left',showClose:true,message: "请选择一个用户", type: 'error' });
					return;
				}
				if(this.isSingleUser==true){
					if(this.sels.length!=1){
						this.$notify({position:'bottom-left',showClose:true,message: "最多只能选择一个用户", type: 'error' });
						return;
					}
				}  
  				this.$emit('confirm',this.sels);
			},
		},//end methods
		components: { 
			UsersSelectOnly,
		    //在下面添加其它组件
		},
		mounted() { 
			var us=localStorage.getItem("mdp-his-users")
			this.users=us?JSON.parse(us):[]
			if(this.users.length==0){
				this.activeTabPane="2"
			}else{
				if(this.users.length>20){
					this.users.splice(10)
				}
			}
            
			this.$nextTick(()=>{ 
				this.maxTableHeight = util.calcTableMaxHeight(this.$refs.userTable.$el)-20
			})
		}
	}

</script>

<style lang="scss" scoped>
.selected-tag {
	margin-top: 14px;
	margin-left:14px; 
}
.avatar-container {
    height: 50px;
    display: flex;
    align-items: center;
    .avatar-wrapper {
        cursor: pointer;
        display: flex;
        flex-direction: row;
        align-items: center;
        .user-avatar {
            height: 34px;
            width: 34px;
            border-radius: 50%;
            margin-right: 12px;
        }
        .username{
            color: #7D7D7D;
            font-size: 14px; 
        }
        .el-icon-caret-bottom {
            font-size: 22px;
        }
    }
}
</style>
