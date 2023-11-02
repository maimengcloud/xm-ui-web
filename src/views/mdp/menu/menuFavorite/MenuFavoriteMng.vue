<template>
	<section>
		<div class="padding">
			<!-- <button @click="getShippingInfoFromKDNiaoInstanQueryMethod">店家及</button> -->
			<div style="display:flex;justify-content:space-between;margin:0 30px;border-bottom:5px solid #f8f8f8">
				<h3>快捷入口</h3>
				<el-row style="text-align:right;">
					<el-button v-if="changeIconVisible==false" id="edittt" @click="getAllMenu">编辑</el-button>
					<el-button v-if="changeIconVisible==false"  @click="changeIconVisible=true">修改图标</el-button>
					<el-button v-else  @click="changeIconVisible=false" icon="el-icon-back">返回</el-button>
				</el-row>
			</div> 
			<mdp-image  v-model="addExpressEntryIcon.picUrl" fit="contain" @change2="handleConfirm">
			</mdp-image>
			<div v-if="changeIconVisible==true" style="display:flex;flex-wrap:wrap;margin:0 30px;padding-top:10px;">
				<div class="expressUserArea" v-for="userBeforeMenuFavoriteOne in userBeforeMenuFavoriteArray" :key="userBeforeMenuFavoriteOne.id"
				 @click="addImage(userBeforeMenuFavoriteOne)">
					<el-button type="primary" v-on:click.stop="addImage(userBeforeMenuFavoriteOne)">修改图标</el-button>
					<!-- <img style="max-width:150px;" :src="userBeforeMenuFavoriteOne.icon" v-if="userBeforeMenuFavoriteOne.icon!=null" />
					 -->
					 <img style="max-width:75px;max-height:75px;" :src="converUrl(userBeforeMenuFavoriteOne.icon)"  v-if="userBeforeMenuFavoriteOne.icon!=null" />
					
					<h4 style="margin:30 auto;text-align:center;">{{userBeforeMenuFavoriteOne.menuname}}{{userBeforeMenuFavoriteOne.name}}</h4>
				</div>
			</div>
			<div v-else style="display:flex;flex-wrap:wrap;margin:0 30px;padding-top:10px;">
				<div class="expressUserArea" v-for="userBeforeMenuFavoriteOne in userBeforeMenuFavoriteArray" :key="userBeforeMenuFavoriteOne.id"
				 @click="redirectMenu(userBeforeMenuFavoriteOne)">
					<el-button type="primary" v-on:click.stop="addImage(userBeforeMenuFavoriteOne)" v-if="userBeforeMenuFavoriteOne.icon==null">添加图标</el-button>
					<!-- <img style="max-width:150px;" :src="userBeforeMenuFavoriteOne.icon" v-if="userBeforeMenuFavoriteOne.icon!=null" />
					 -->
					 <img style="max-width:75px;max-height:75px;" :src="converUrl(userBeforeMenuFavoriteOne.icon)"  v-if="userBeforeMenuFavoriteOne.icon!=null" />
					
					<h4 style="margin:30 auto;text-align:center;">{{userBeforeMenuFavoriteOne.menuname}}{{userBeforeMenuFavoriteOne.name}}</h4>
				</div>
			</div>
		</div>

		<!--快捷入口的对话框-->
		<el-dialog title="请选择需要的快捷入口(请选择二级节点)" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">

			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="commitSecondMenu()">确 定</el-button>
			</span>
			<div v-loading="expressEntryLoading">
				<el-tree node-key="id" :default-checked-keys="defalutCheckArray" :data="data3" ref="tree" :props="defaultProps"
				 show-checkbox @check-change="handleCheckChange">
				</el-tree>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import util from '@/components/mdp-ui/js/util'; //全局公共库 
	import config from '@/api/mdp_pub/mdp_config';//全局公共库import  
	import { 
		addMenuFavoriteIconApi,
		saveMenuFavoritesApi,
		getMenuFavoritesApi
	} from '@/api/mdp/menu/menuFavorite'
	import {
		mapGetters
	} from 'vuex';
	import {
		generateTitle
	} from '@/utils/i18n'


	export default {
		data() {
			return {
				changeIconVisible:false,
				currentNeedUpdateExpressEntryObject: '',
				addExpressEntryIcon: {
					id: '',
					name: '',
					listPicUrl: '1',
					simpleDesc: '',
					picUrl: '',
					sortOrder: '',
					isShow: '1',
					floorPrice: '0',
					appListPicUrl: '',
					isNew: '1',
					newPicUrl: '',
					newSortOrder: '1',
					deptid: ''
				}, 
				expressEntryLoading: false,
				defalutCheckArray: [],
				treeId: 1,
				userBeforeMenuFavoriteArray: [], //用户之前选择的快捷菜单
				finalNeedCommitArray: [],
				data3: [],
				dialogVisible: false,
				defaultProps: {
					children: 'children',
					label: 'name'
				}
			}
		}, //end data
		methods: {
			converUrl(url){
					if(url!='' && url!=null  && !url.indexOf('http')==0 && !url.indexOf('www')==0){
						return config.getArcImagePathNew()+"/"+url;;
					} 
					return url;
			},
			getAllMenu() {
				this.defalutCheckArray = [];
				this.finalNeedCommitArray = [];
				this.dialogVisible = true;
				this.finalNeedCommitArray = [];
				let permissionRoutersArray = this.permission_routers;
				let initArray = new Array();
				let finalArray = new Array();
				if (permissionRoutersArray.length > 0) {
					initArray = JSON.parse(JSON.stringify(permissionRoutersArray)); //深拷贝
					for (let i = 0; i < initArray.length - 1; i++) {
						if(initArray[i].path=='/mallm/expressEntry'){
							continue;
						}
						if (initArray[i].meta) {
							initArray[i].isElementUiTreeParentNode = true;
							let permissionRoutersChildrenArray = initArray[i].children; //修改子节点的path路径
							for (let k = 0; k < permissionRoutersChildrenArray.length; k++) {
								permissionRoutersChildrenArray[k].path = initArray[i].path + '/' + permissionRoutersChildrenArray[k].path;
								permissionRoutersChildrenArray[k].id = this.treeId;
								this.treeId++;
							}
							finalArray.push(initArray[i]);
						}
					} //userBeforeMenuFavoriteArray
					//let checkCount=this.userBeforeMenuFavoriteArray.length;
					for (let i = 0; i < finalArray.length; i++) { //遍历最终的数组
						let finalArrayChildrenArray = finalArray[i].children;
						for (let k = 0; k < finalArrayChildrenArray.length; k++) {
							for (let j = 0; j < this.userBeforeMenuFavoriteArray.length; j++) {
								if (finalArrayChildrenArray[k].path == this.userBeforeMenuFavoriteArray[j].accUrl) {
									this.defalutCheckArray.push(finalArrayChildrenArray[k].id); //设置默认勾选的节点
									this.finalNeedCommitArray.push(finalArrayChildrenArray[k]);
									/*checkCount--;
									 if(checkCount==0){//跳出某个循环暂未实现
										
									} */
								}
							}
						}
					}
				}
				this.data3 = finalArray;
				this.setCheckedNodes();
			},
			handleClose(done) {
				done();
			},
			handleNodeClick(data) {},
			handleCheckChange(data, checked, indeterminate) {
				if (data.isElementUiTreeParentNode) { //如果是父节点就跳过
					return;
				} else { //如果不是父节点
					if (checked) { //如果是选中状态
						this.finalNeedCommitArray.push(data); //放进最终的数组中
					} else {
						for (let i = 0; i < this.finalNeedCommitArray.length; i++) {
							if (this.finalNeedCommitArray[i] == data) {
								this.finalNeedCommitArray.splice(i, 1); //放进最终的数组中
							}
						}
					}
				}
			},
			commitSecondMenu() {
				if (this.finalNeedCommitArray.length > 6) {
					this.$notify({
						message: "只能选择6个二级菜单作为快捷键",
						type: 'error'
					});
					return;
				};
				let finalArray = JSON.parse(JSON.stringify(this.finalNeedCommitArray)); //深拷贝
				for (let i = 0; i < this.finalNeedCommitArray.length; i++) { //遍历
					for (let k = 0; k < this.userBeforeMenuFavoriteArray.length; k++) {
						if (this.finalNeedCommitArray[i].path == this.userBeforeMenuFavoriteArray[k].accUrl) { //如果相等
							finalArray[i] = this.userBeforeMenuFavoriteArray[k];
						}
					}
				};
				let params = {
					"menuFavorites": finalArray,
					"userInfo":  {
						userid:this.userInfo.userid,
						username:this.userInfo.username,
						deptid:this.userInfo.deptid,
						branchId:this.userInfo.branchId,
						shopId:this.userInfo.shopId, 
					}
				};
				this.expressEntryLoading = true;
				saveMenuFavoritesApi(params).then((res) => {
					this.expressEntryLoading = false;
					this.dialogVisible = false; //关闭对话框
					var tips = res.data.tips;
					if (res.data.tips.isOk) {
						this.getUserMenuFavorite();
						//this.userBeforeMenuFavoriteArray=finalArray;
						this.$notify({
							message: tips.msg,
							type: 'success'
						});

					} else {
						this.$notify({
							message: tips.msg,
							type: 'error'
						});
					}
				})
			},
			setCheckedNodes() {
				//this.$refs.tree.setCheckedNodes(this.finalNeedCommitArray);
			},
			redirectss() { //路由跳转的方法
				this.$router.push({
					path: "/mallm/shop/shop/ShopMng"
				})
			},
			getUserMenuFavorite() { //获取用户之前设置的路径
				let params = {
					"userInfo":  {
						userid:this.userInfo.userid,
						username:this.userInfo.username,
						deptid:this.userInfo.deptid,
						branchId:this.userInfo.branchId,
						shopId:this.userInfo.shopId, 
					}
				};
				getMenuFavoritesApi(params).then((res) => {
					var tips = res.data.tips;
					if (res.data.tips.isOk) {
						this.userBeforeMenuFavoriteArray = res.data.data;
						/* this.$notify({
							message: tips.msg,
							type: 'success'
						}); */
					} else {
						this.$notify({
							message: tips.msg,
							type: 'error'
						});
					}
				})
			},
			redirectMenu(o) { //进行跳转的操作
			 
				var path=o.accUrl; 
				//this.$router.push({path:"/mallm/goods/goods/GoodsMng"});//到时候需要动态传参数的
				if (!path) {
					path=o.path
				}
				
				this.$store.dispatch("FindRouter",path).then(res=>{ 
					if(res==null){
					this.$notify.error("该链接已不存在或者您无权限访问")
					return
					}else{
					this.$router.push({path:res.fullPath,query:res.query,params:res.params});
					} 
				})
				 
			},
			 
			 
			handleConfirm(image){ 
				this.saveExpressEntryImage()
			},
			addImage(o) { 
				 
				this.currentNeedUpdateExpressEntryObject = o;
				this.$nextTick(()=>{
					this.$refs.iconUpload.showAdd()
				})
			},
			saveExpressEntryImage() { //保存快捷入口图片
				if (this.addExpressEntryIcon.picUrl == null || this.addExpressEntryIcon.picUrl == '') {
					this.$notify.error("请选择图片");
					return;
				}
				let params = {
					"menuFavorite": this.currentNeedUpdateExpressEntryObject,
					"iconUrl": this.addExpressEntryIcon.picUrl
				};
				addMenuFavoriteIconApi(params).then((res) => {
					var tips = res.data.tips;
					if (res.data.tips.isOk) { 
						this.addExpressEntryIcon.picUrl = '';
						this.$notify({
							message: tips.msg,
							type: 'success'
						});
						this.getUserMenuFavorite();
					} else {
						this.$notify({
							message: tips.msg,
							type: 'error'
						});
					}
				}) 
			},
			canelAddFormVisible() { 
				this.addExpressEntryIcon.picUrl = '';
			},
			getShippingInfoFromKDNiaoInstanQueryMethod() {
				let params = {
					"expCode": "ZTO",
					"expNo": "75113349087618"
				};
				getShippingInfoFromKDNiaoInstanQuery(params).then((res) => {
					let y=JSON.parse(res.data.data.rrr);
				})
			}
		}, //end methods
		components: {  
		},
		computed: {
			...mapGetters([
				'permission_routers',
				'sidebar',
				'roles',
				'userInfo',
				'userInfo',
				'myShops',
				'myLocations' //获取数据
			])
		},
		mounted() {
			this.getUserMenuFavorite();
		}
	}
</script>

<style scoped>
	#edittt {
		color: #7abdff;
	}

	#edittt:hover {
		cursor: pointer;
		text-decoration: underline;
	} 

	.expressUserArea {
		width: 15%;
		height: 150px;
		background-color: #f8f8f8;
		margin-right: 10px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center; 
	}

	.expressUserArea:hover {
		cursor: pointer;
		border: 3px solid #f40;
	}
</style>
