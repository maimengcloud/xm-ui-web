<template>
	<section>
		<el-row class="page-container page-height-80">
			<!--新增界面 AppTpAuth MDP平台应用与第三方应用关系--> 
			<el-form :model="addForm"  label-width="150px" :rules="addFormRules" ref="addForm">   
				<el-card class="box-card">
			    	<div slot="header" class="clearfix">
					    <span>Mdp应用设置</span> 
					</div>
					
					<el-form-item label="应用分类" prop="bizType">
						  <el-select v-model="addForm.bizType" placeholder="请选择第三方分类">
						    <el-option
						      v-for="item in options.tpAppCategory"
						      :key="item.optionValue"
						      :label="item.optionName"
						      :value="item.optionValue">
						    </el-option>
						  </el-select>
					</el-form-item>  
					<el-form-item label="授权编号" prop="authId">
						<el-input v-model="addForm.authId" placeholder="授权编号 不填则后台自动生成，用于外部链接" ></el-input> 
					</el-form-item>  
					<el-form-item label="公众号授权编号" prop="pubAuthId" v-if="addForm.bizType=='wxa'">
						<el-input v-model="addForm.pubAuthId" placeholder="关联的公众号授权编号" ></el-input> 
					</el-form-item> 
					<el-form-item label="应用名称" prop="name">
						<el-input v-model="addForm.name" placeholder="第三方应用名称" ></el-input>
					</el-form-item>    
					<el-form-item label="应用描述" prop="remark">
						<el-input v-model="addForm.remark" placeholder="应用描述" ></el-input>
					</el-form-item>
					<el-form-item label=" " prop="enabled">
							<el-checkbox v-model="addForm.enabled" true-label='1' false-label='0'>是否上架</el-checkbox>
					</el-form-item> 
					<el-form-item  label="需要第三方授权的地址规则" prop="authPattern">
						<el-input v-model="addForm.authPattern" placeholder="url规则" ></el-input>
						<el-tag  > 需要第三方授权的地址规则， 授权地址的 url ,如 /loginWxpub，代表凡是访问'/loginWxpub'这个地址都会重定向到授权地址 </el-tag>
					</el-form-item>   
			    </el-card>
			    <el-card class="box-card">
			    	<div slot="header" class="clearfix">
					    <span>第三方应用登录设置</span> 
					</div>
			    	<el-form-item label="第三方应用编号" prop="appid">
						<el-input v-model="addForm.appid" placeholder="第三方应用编号" ></el-input>
						<el-tag>对应微信的appid</el-tag>
					</el-form-item> 
					<el-form-item  label="加密串" prop="appSecret">
						<el-input v-model="addForm.appSecret" placeholder="加密串" ></el-input>
						<el-tag>对应微信的appSecret，用于获取用户信息，登录，获取acessToken等</el-tag>
					</el-form-item> 
					<el-form-item label="第三方授权地址" prop="authUrl">
						<el-input v-model="addForm.authUrl" placeholder="授权地址" ></el-input> 
						<el-tag>如： https://open.weixin.qq.com/connect/oauth2/authorize?appid=%s&redirect_uri=%s&response_type=code&scope=snsapi_base&state=123#wechat_redirect</el-tag>
					</el-form-item>
			    </el-card>
			    <el-card class="box-card">
			    	<div slot="header" class="clearfix">
					    <span>第三方消息推送设置</span> 
					</div>
					<el-form-item  label="消息推送地址" prop="msgNotifyUrl">
						<el-input v-model="addForm.msgNotifyUrl" placeholder="对应微信消息推送URL" ></el-input>
						<el-tag>用于接收第三方消息推送的地址</el-tag>
					</el-form-item> 
					<el-form-item  label="消息摘要验证令牌" prop="appToken">
						<el-input v-model="addForm.appToken" placeholder="对应微信token" ></el-input>
						<el-tag>对应微信的token,用于对微信推送回来的消息进行解密等</el-tag>
					</el-form-item>  
					<el-form-item  label="消息秘钥" prop="encKey">
						<el-input v-model="addForm.encKey" placeholder="对应微信的 encodingAESKey ,用于收发信息对密文进行加解密" ></el-input>
						<el-tag>对应微信的 encodingAESKey ,用于收发信息对密文进行加解密</el-tag>
					</el-form-item> 
			    </el-card>
			    <el-card class="box-card"> 
					<div slot="header" class="clearfix">
					    <span>绑定总部店铺  需要先从商城后台创建店铺 </span>  
					 </div>
				    <el-form-item  label="绑定店铺" prop="locationId">  
						  <!-- <el-select style="width:30%;"
						    v-model="location" 
						    filterable 
						    value-key="id"
						    reserve-keyword
						    placeholder="请输入店铺名称模糊搜索"  
						    remote 
						    :remote-method="searchLocations"
						    :loading="load.location">
						    <el-option
						      v-for="item in locations"
						      :key="item.id"
						      :label="item.businessName+'('+item.shopBrand+')'"
						      :value="item">
						    </el-option>
						  </el-select> -->   
						  <div style="display:flex;">
							<span v-if="location">{{location.businessName+'('}}{{location.sysBranchName?location.sysBranchName:location.shopBrand}}{{')'}}</span>
						  	<el-button @click="showSelectShopMethod" v-if="!location">请选择</el-button>
						  	<el-button @click="showSelectShopMethod" v-else>更改</el-button>
						  </div>
						  <el-checkbox v-model="addForm.multiLoca" true-label='1' false-label='0'>是否多店铺模式下的总部店铺</el-checkbox>
						  <el-tag>将作为首页展示等的首选店铺</el-tag>
					</el-form-item> 
			    </el-card> 
			    <el-card class="box-card" > 
					<div slot="header" class="clearfix">
					    <span>ip白名单</span> 
					 </div>
				    <el-form-item  label="ip白名单" prop="ips">
						<el-input type="textarea" rows="3" v-model="addForm.ips" placeholder="ip列表，多个ip以逗号隔开， 如  192.168.0.1,192.168.0.2 " ></el-input>
					</el-form-item>  
			    </el-card>   
			</el-form>
		</el-row>
		<el-row class="page-bottom bottom-fixed padding">
			
			<el-button @click.native="handleCancel">取消</el-button> 
			<el-button v-loading="load.add" type="primary" @click.native="addSubmit" >提交</el-button>  
		</el-row>
		<el-drawer title="选择店铺" :visible.sync="selectShopVisible" size="70%" append-to-body>
			<select-shop-location-by-sys-dept @sure="sureMethod"></select-shop-location-by-sys-dept>
		</el-drawer>
	</section>
</template>

<script>
	import util from '@/components/mdp-ui/js/util';//全局公共库 
	import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { mapGetters } from 'vuex'
	import { addAppTpAuth } from '@/api/mdp/app/appTpAuth';
	import { listSimpleLocation } from '@/api/mdp/app/shopLocation';
	import { listAppBizType } from '@/api/mdp/app/appBizType';
	import selectShopLocationBySysDept from '../selectShopLocationBySysDept/selectShopLocationBySysDept.vue';
	
	export default {
		props:['appTpAuth','visible','appMdpDef'],
		watch: {
	      'appTpAuth':function( appTpAuth ) {
	        this.addForm = appTpAuth;
	      },
	      'visible':function(visible) { 
	      	if(visible==true){
				this.addForm.logUrl=this.appMdpDef.logUrl;
				this.addForm.mdpAppid=this.appMdpDef.mdpAppid;
				this.addForm.name=this.appMdpDef.name;
				this.addForm.remark=this.appMdpDef.remark;
				this.location='';
	      	}
	      } 
	    },
	    computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},	
		data() {
			return {
				selectShopVisible:false,
				options:{},//下拉选择框的所有静态数据  params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				load:{ list: false, edit: false, del: false, add: false,location:false },//查询中...
				addFormRules: {
					appid: [
						{ required: true, message: '第三方应用编号不能为空', trigger: 'blur' }
					],
					name: [
						{ required: true, message: '第三方应用名称不能为空', trigger: 'blur' }
					],
					bizType: [
						{ required: true, message: '应用分类不能为空', trigger: 'blur' }
					]
				},
				//新增界面数据 MDP平台应用与第三方应用关系
				addForm: {
					mdpAppid:'',name:'',logoUrl:'',remark:'',bizType:'',deptid:'',branchId:'',appToken:'',loginUrl:'',authId:'',cdate:'',cuserid:'',appSecret:'',authUrl:'',authPattern:'',encKey:'',enabled:'',appid:'',payMchid:'',payNotifyUrl:'',openPay:'',payKey:'',msgNotifyUrl:'',ips:'',locationId:'',shopId:'',locationName:'',shopName:'',multiLoca:''
						}, 
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
				appBizTypes:[],
				locations:[],//门店列表[{id, shopId, businessName,districtId,branchName,title,shopBrand}]
				location:null,//选中的门店 {id, shopId, businessName,districtId,branchName,title,shopBrand}
				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="addFormVisible=false" 监听
			handleCancel:function(){
				this.$refs['addForm'].resetFields();
				this.$emit('cancel');
			},
			//新增提交AppTpAuth MDP平台应用与第三方应用关系 父组件监听@submit="afterAddSubmit"
			addSubmit: function () {
				
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.add=true
							let params = Object.assign({}, this.addForm); 
							params.deptid=this.userInfo.deptid
							params.branchId=this.userInfo.branchId
							params.cuserid=this.userInfo.userid
							params.cdate=util.formatDate(new Date(),'yyyy-MM-dd HH:mm:ss');
							if(this.location!=null){
								params.locationId=this.location.id
								params.locationName=this.location.businessName
								params.shopId=this.location.shopId
								params.shopName=this.location.shopBrand
								params.deptid=this.location.deptid
								params.branchId=this.location.branchId
							}
							
							addAppTpAuth(params).then((res) => {
								this.load.add=false
								var tips=res.data.tips;
								if(tips.isOk){
									this.$refs['addForm'].resetFields();
									this.$emit('submit');//  @submit="afterAddSubmit"
								}
								this.$notify({ message: tips.msg, type: tips.isOk?'success':'error' }); 
							}).catch(() => this.load.add=false);
						});
					}
				});
			},
			/**begin 在下面加自定义方法,记得补上面的一个逗号**/
			searchLocations:function( query ){
				let per=/[\u4E00-\u9FA5\uF900-\uFA2D]+/u
				if(!per.test(query)){
					this.$notify({ message: '请输入中文模糊匹配', type: 'info' }); 
					return;
				}
				if(query==''||query==null||query.length<2){
					return;
				}
				let params={
				   key:'%'+query+'%'
				}
				if( !this.userInfo.isSuperAdmin && !this.userInfo.isPlatformAdmin){
					params.branchId=this.userInfo.branchId
				}
				this.load.location=true
				listSimpleLocation(params).then(res=>{
					this.load.location=false
					this.locations=res.data.data
				})
			},
			showSelectShopMethod() {
				this.selectShopVisible = true;
			},
			sureMethod(row) {
				this.selectShopVisible = false;
				this.location=row;
			}
			/**end 在上面加自定义方法**/
			
		},//end method
		components: {  
			'select-shop-location-by-sys-dept': selectShopLocationBySysDept
		    //在下面添加其它组件 'app-tp-auth-edit':AppTpAuthEdit
		},
		mounted() {

			listAppBizType({}).then(res=>{
				this.appBizTypes=res.data.data
			})
			this.addForm=Object.assign(this.addForm, this.appTpAuth);  
			this.addForm.logUrl=this.appMdpDef.logUrl
			this.addForm.mdpAppid=this.appMdpDef.mdpAppid
			this.addForm.name=this.appMdpDef.name
			this.addForm.remark=this.appMdpDef.remark
			this.addForm.authUrl='https://open.weixin.qq.com/connect/oauth2/authorize?appid=%s&redirect_uri=%s&response_type=code&scope=snsapi_base&state=123#wechat_redirect'
				listOption([{categoryId:'all',itemCode:'tpAppCategory'}]).then(res=>{
					this.options=res.data.data
				});	
			/**在下面写其它函数***/
			
		}//end mounted
	}

</script>

<style scoped>

</style>