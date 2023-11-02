<template>
	<section > 
		<el-row  class="padding bg">
			<el-row :gutter="10">
				<el-col :span="8"> 
					<el-card class="box-card">
						<div slot="header" class="clearfix">
							<span><strong>企业信息</strong></span> 
						</div> 
						<el-row>
							<el-col :span="4">企业名称 </el-col><el-col :span="18">
								{{branchInterestsDetail.branchName}}
							</el-col>
						</el-row>
						<el-row style="margin-top:30px;">
							<el-col  :span="4">企业logo </el-col><el-col class="logo" :span="18" @click.native="$refs['imgDialog'].open()">
								<el-avatar :size="60" :src="branchInterestsDetail.imgUrl"  >
									<img src="@/assets/image/image_not_found_small.jpg"  @click="$refs['imgDialog'].open()"/>
								</el-avatar> 
							</el-col>
						</el-row>
						<el-row>
							
						</el-row>
						<el-row :gutter="5" class="border padding" style="margin-top:30px;">
							<el-col :span="12" class="ver">
								<p class="ver-title">当前版本</p> 
								<p class="ver-context">{{branchInterestsDetail.mver!=='1'?'免费版':'企业版'}}</p>
							</el-col> 
							<el-col :span="12" class="ver" style="cursor:pointer;" @click.native.stop="goToBranchAdm"> 
								<p class="ver-title">主管理员</p> 
								<p class="ver-context">{{branchAdm.username}}</p> 
							</el-col>
						</el-row>
					</el-card> 
				</el-col>
				<el-col :span="16"> 
					<el-card class="box-card">
						<div slot="header" class="clearfix">
							<span><strong>权益信息</strong></span> 
						</div> 
						<el-row>
							<el-col :span="8" >
								<div class="lvl-item">
									<div id="userCountPieChart" class="chart"></div>
									<p>账户数量</p>
									<el-button type="primary" @click="goToUserMng">管理成员</el-button>
									<el-button v-if="branchInterestsDetail.mver==='1'" type="primary" @click="goToAddUsers">增购人数</el-button>
								</div>
							</el-col>
							<el-col :span="8">
								<div class="lvl-item"> 
									<div id="productCountPieChart" class="chart"></div>
									<p>可用产品</p>
									<el-button type="primary" @click="goToMo">开通更多</el-button>
								</div>
							</el-col>
							<el-col :span="8">
								<div class="lvl-item"> 
									<div id="endTimePieChart" class="chart"></div>
									<p>版本有效期</p>
								</div>
							</el-col>
						</el-row> 
					</el-card>  
				</el-col>
			</el-row>
			<el-row style="padding-top:5px;">
				  <menu-module-complex v-if="productScope==='all'" @product-scope-set="onProductScopeSet"></menu-module-complex>
				  <menu-module-branch-complex v-else @product-scope-set="onProductScopeSet"></menu-module-branch-complex>
			</el-row>
		 </el-row>
		<mdp-dialog ref="imgDialog">
		 	<mdp-select-image @select="onLogoSelect"></mdp-select-image>
		</mdp-dialog> 
	</section>
</template>

<script>
	import util from '@/components/mdp-ui/js/util';//全局公共库
	import config from "@/api/mdp_pub/mdp_config"; //全局公共库import
	 

 	import {  initUserCountPieChart,initProductCountPieChart,initEndTimePieChart,editSomeFieldsBranch} from '@/api/mdp/sys/branch';
 

	 
 	import { calcBranchModule } from '@/api/mdp/menu/menuModuleBranch';
	 
	 
	import { mapGetters } from 'vuex'
	import MenuModuleComplex from '../../menu/menuModule/MenuModuleComplex.vue';
	
	import {listUser } from "../../../../api/mdp/sys/user"; 
	import MenuModuleBranchComplex from '../../menu/menuModuleBranch/MenuModuleBranchComplex.vue';
	
	export default {
	    name:'branchEdit',
	    components: {
			MenuModuleComplex,MenuModuleBranchComplex
        },
		computed: {
		    ...mapGetters([ 'userInfo'  ]),

		},
		props:[ ],

		watch: {
	      
	    },
		data() {
			return {
			    currOpType:'add',//add/edit
 				load:{ list: false, edit: false, del: false, add: false },//查询中...
				dicts:{
					industryCategory:[],
					enabled:[],
				},//下拉选择框的所有静态数据 params={categoryId:'all',itemCodes:['sex']} 返回结果 {sex: [{id:'1',name:'男'},{id:'2',name:'女'}]}
				editForm: {
					id:'',branchName:'',enabled:'',industryCategory:'',cuserid:'',cdate:'',cusername:'',lphoneNo:'',emaill:'',bizProcInstId:'',bizFlowState:'',pbranchId:'',admUserid:'',admUsername:'',lusername:'',luserid:'',address:'',imgUrl:'',
				},
                maxTableHeight:300,
				branchAdm:{
					userid:'',
					username:'',
					branchId:'',
					memType:'1'
				},
				productScope:'hadOpen',
				branchInterestsDetail:{
					    "branchId" : "qqkj_001",
						"maxUsers" : 50,
						"sfeeRate" : null,
						"ilvlId" : "1",
						"rtime" : null,
						"currUsers" : 1304,
						"istatus" : "1",
						"branchName" : "广州擎勤网络科技有限公司",
						"ilvlName" : "普通会员",
						"imgUrl" : null,
						"picUrl" : null,
						"isFree" : "1",
						"ilevel" : null,
						"imgUrl":null,
				},
				branchInterestsDetail:{
					branchId:'',ilvlId:'',ilvlName:'',idesc:'',ilevel:'',discount:'',istatus:'',ctime:'',ltime:'',picUrl:'',isFree:'',rtimeRule:'',rtimeType:'',rtime:'',itype:'',shopId:'',instId:'',flowState:'',smaxAt:'',totalAt:'',mtype:'',totalExp:'',smaxExp:'',bids:'',sfeeRate:'',idBak:'',currTotalExp:'',currBids:'',currTotalAt:'',currTotalBids:'',mfee:'',maxUsers:'',currUsers:'',maxRtime:'',mver:''
				},
				calcBranchModule:{
					allModules:0,
					freeModules:0,
					hadModules:0,
					hadFreeModules:0

				}, 
			}//end return
		},//end data
		methods: {

		onLogoSelect:function(imgs){
			if(imgs==null || imgs.length==0){
				return;
			} 
			var params={$pks:[this.branchInterestsDetail.branchId],imgUrl:imgs[0].url}
			editSomeFieldsBranch(params).then(res=>{
				var tips = res.data.tips;
				this.$notify({ message: tips.msg, type: tips.isOk?"success":"error" });
				if(tips.isOk){
					this.branchInterestsDetail.imgUrl=imgs[0].url
					this.$refs['imgDialog'].close();
				} 
			})
		},

		 goToUserMng(){
			 this.$router.push("/mdp/sys/user/index")
		 },
		 goToBranchAdm(){
			 this.$router.push("/mdp/sys/user/adm")
		 },
		 goToAddUsers(){
			  this.$router.push("/my/order/addUsers")
		 },
		 goToMo(item){
			 if(item && item.id){
				  this.$router.push("/my/order/index?moduleId="+item.id)
			 }else{
				  this.$router.push("/my/order/index")
			 }
			
		 },
		 onProductScopeSet(scope){
			 this.productScope=scope
		 }, 
		 
		 initData(){ 
			 this.branchAdm.userid=this.userInfo.branchId
			 this.branchAdm.username='超级机构管理员'
			 this.branchAdm.memType="1"
			 this.branchAdm.branchId=this.userInfo.branchId
			 this.branchAdm.branchName=this.userInfo.branchName
			 this.branchAdm.headimgurl=''
			 this.$mdp.getBranchInterestsDetail({}).then(res=>{
				 var tips = res.data.tips;
				 if(tips.isOk){
					this.branchInterestsDetail=res.data.data
					initUserCountPieChart(this);
					initEndTimePieChart(this);
				 }
				 
			 }) 
			 calcBranchModule().then(res=>{
				 this.calcBranchModule=res.data.data;
				 initProductCountPieChart(this);
			 })
		 },
		getMainBranchUser(){ 
			var params={userid:this.userInfo.branchId}
			listUser(params).then(res => {
				var tips = res.data.tips;
				if (tips.isOk && res.data.data.length>0) { 
					this.branchAdm = res.data.data[0];
				} else if(!tips.isOk){
					this.$notify({ message: tips.msg, type: "error" });
				}
				this.load.list = false;
			})
			.catch(() => {
				this.load.list = false; 
			});
		},
			showUploadHeadimg(){
				this.$refs.uploadImg.showAdd();
			},
		},//end method
		mounted() {
			 initUserCountPieChart(this);
			 initProductCountPieChart(this);
			 initEndTimePieChart(this);
		    this.$nextTick(() => { 
                this.initData()
				this.getMainBranchUser(); 
            });
		}
	}

</script>


<style lang="scss" scoped>
.box-card{
	height: 400px;
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
            margin-right: 2px;
			
        }  
    }
}
.bg{
	background-color: rgba(238, 242, 250, 1);
} 
.ver{
	padding:12px;
	text-align: center;
}
.ver-title{
	text-align: center;
}
.ver-context{
	
	font-size: 18px;
	margin-top: 5px;
	color:#5AC8AD;
	text-align: center;
}
.logo{
	object-fit: scale-down;
	max-width: 60px;
	height: 60px;
	cursor: pointer;
}
.lvl-item{  
	text-align: center;
	img{
		height: 80px;
	}
	p{
		margin-top: 5px;
	}
	button{
		margin:5px;
	}
}
.chart{
	text-align: center;
	height: 230px; 
}
</style>