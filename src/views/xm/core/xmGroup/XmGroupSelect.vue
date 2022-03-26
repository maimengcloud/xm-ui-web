<template>
	<section class="border padding-left">
		<el-row class="padding-top"> 
 
						<xm-project-select :auto-select="true" :xm-product="xmProduct"  @row-click="onProjectRowClick" @clear-select="onProjectClose"></xm-project-select>
 
						<xm-product-select :auto-select="true"  :link-project-id="selProject?selProject.id:null" @row-click="onProductRowClick" @clear-select="onProductClose"></xm-product-select>
							 
					<el-button   type="primary" @click="userConfirm" icon="el-icon-finished">确认选择</el-button>  
		</el-row>  
		<el-row class="padding-top" v-loading="load.list" :style="{overflowX:'auto',height:maxTableHeight+'px'}" ref="table">
			<el-row v-for="(item,index) in xmGroupFormworkSels" :key="index"> 
				<h3>
					<div class="padding-top">{{item.groupName}}
					</div> 
				</h3>
				<el-col :span="24" style="margin-left:30px;display:flex;flex-wrap: wrap;width:100%;">  
					<div  :class="v.isSelected=='1'?'checkCopyButton':'copyButton'" v-for="(v,valueIndex) in item.groupUsers" :key="valueIndex" @click="toggleSelected(index,valueIndex)">
							{{v.username}}
					</div>  
				</el-col>
			</el-row>
		</el-row>   
	</section>
</template>

<script>
	import util from '@/common/js/util'; //全局公共库
	//import Sticky from '@/components/Sticky' // 粘性header组件
	import { initSimpleDicts } from '@/api/mdp/meta/item';//下拉框数据查询
   	import {  getGroups } from '@/api/xm/core/xmGroup';
   	import XmProjectSelect from '@/views/xm/core/components/XmProjectSelect';

	import {mapGetters} from 'vuex' 
import XmProductSelect from '@/views/xm/core/components/XmProductSelect.vue'

	export default {
		computed: {
			...mapGetters([
				'workShop','userInfo','roles'
			])
		},
		//
		props: ['visible','selProject','isSelectSingleUser','isSelectMultiUser','xmProduct','pgClass'],
		watch: {
			"selGroups": function(selGroups) {
				if(this.selGroups){
					this.selGroups.forEach(i=>{
						if(i.groupUsers){
							i.groupUsers.forEach(k=>k.isSelected="0")
						} 
					})
					this.xmGroupFormworkSels = JSON.parse(JSON.stringify(this.selGroups));
				}else{ 
					this.xmGroupFormworkSels = [];
				}
				// this.applyData();
			},
			'visible': function(visible) {
				if (visible == true) {
					
				}
			},
			selProject(selProject){
				this.filters.selProject=selProject
			},
			xmProduct(xmProduct){
				this.filters.xmProduct=this.xmProduct
			}
 
		},

		data() {
			return { 
				filters: {
					key: '',
					selProject:null,
					xmProduct:null,
				},
				selGroups:[],
				load: {list: false,edit: false,del: false,add: false}, //查询中...
				sels: [], //列表选中数据
				dicts: {
					projectGroupType:[]
				}, //下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]}

				/**begin 自定义属性请在下面加 请加备注**/
				xmGroupFormworkSels: [],
				selectProjectVisible:false,
				selectProductVisible:false,
				maxTableHeight:300,
  				/**end 自定义属性请在上面加 请加备注**/
			}
		}, //end data
		methods: {
			toggleSelected(index,valueIndex) {
				if(this.isSelectSingleUser=='1' || this.isSelectMultiUser=='1'){
					if(this.xmGroupFormworkSels[index].groupUsers[valueIndex].isSelected == '1'){
						this.xmGroupFormworkSels[index].groupUsers[valueIndex].isSelected ='0'
					}else{
						this.xmGroupFormworkSels[index].groupUsers[valueIndex].isSelected ='1'
					}
				}
				
			}, 
			//确认项目团队组成员
			groupConfirm(){
				this.$emit("select-confirm",this.xmGroupFormworkSels);
			},
			userConfirm(){
				var users=[];
				this.xmGroupFormworkSels.forEach(i=>{
					if(i.groupUsers){
						i.groupUsers.forEach(k=>{
							if(k.isSelected=='1'){
								users.push(k);
							}
						})
					}
				})

				if(this.isSelectSingleUser=='1'){
					if(users.length>1){
						
						this.$notify({showClose: true,
							message: '只能选中一个用户',
							type: 'error'
						});
						return 
					}
				}
				this.$emit("user-confirm",users);
			},
			getGroups(){
				var params={};
				if(this.filters.selProject){
					params.projectId=this.filters.selProject.id
				} 
				if(this.filters.xmProduct && this.filters.xmProduct.id){
					params.productId=this.filters.xmProduct.id
				}
				if(this.pgClass==='1' && !params.productId){
					this.$notify({showClose:true,message:'请选择产品',type:'error'})
					return;
				}
				
				if((this.pgClass==='0' || !this.pgClass )&& !params.projectId){
					params.productId=null
					this.$notify({showClose:true,message:'请选择项目',type:'warning'})
				}
				getGroups(params).then(res=>{
					var tips = res.data.tips;
					if(tips.isOk){
						this.selGroups=res.data.data;
					}else{
						this.$notify({showClose: true, message: tips.msg, type: 'error' });
					}
				})
			},
			
			onProjectRowClick:function(project){
				this.filters.selProject=project
				this.filters.xmProduct=null;
				this.selectProjectVisible=false;
				this.getGroups();
			},
			 
			
			onProductRowClick:function(product){
				this.filters.xmProduct=product
				this.filters.selProject=null
				this.selectProductVisible=false;
				this.getGroups();
			},
			onProjectClose(){
				this.filters.selProject=null
				this.getGroups();
			},
			onProductClose(){
				this.filters.xmProduct=null
				this.getGroups();
			}
			/**end 自定义函数请在上面加**/

		}, //end methods
		components: {
			
			XmProjectSelect,XmProductSelect			 
		},
		mounted() {
			this.$nextTick(() => { 
				this.maxTableHeight =  util.calcTableMaxHeight(this.$refs.table.$el);
				if(this.selGroups){
					this.selGroups.forEach(i=>{
						if(i.groupUsers){
							i.groupUsers.forEach(k=>k.isSelected="0")
						} 
					})
					this.xmGroupFormworkSels = JSON.parse(JSON.stringify(this.selGroups));
				}
				if(this.selProject){
					this.filters.selProject=this.selProject
				}
				
				if(this.xmProduct){
					this.filters.xmProduct=this.xmProduct
				}
				this.getGroups(); 
			});
		}
	}
</script>

<style scoped>
.group-name{ 
	color: rgb(107, 88, 88);
}
	.copyButton {
		margin-left: 10px;
		margin-top:2px;
		border-radius: 20px;
		padding: 10px 1px;  
		border: 1px solid rgb(220, 223, 230);
		/* color:#039; */
	}

	.copyButton:hover {
		color: #409eff;
		border-color: #c6e2ff;
		background-color: #ecf5ff;
		cursor: default;
	}

	.checkCopyButton {
		/*color: #fff;*/
		margin-left: 10px;
		margin-top:2px;
		border-radius: 20px;
		padding: 10px 1px;  
		border: 1px solid #FFA00A;
		/*background-color: rgba(230, 162, 60, .1);*/
		/* background-color: #f9f9f9; */
		background-color: #fff;
		/*border-color: rgba(230,162,60,.2);*/
		color: #FFA00A;
	}

	.add {
		display: flex;
		align-items: center;
		margin-left: 10px;
		margin-top: 2px;
	}

	.add:hover {
		cursor: pointer;
		animation: myrotate 0.5s linear infinite;
	}


	.input-xmGroupFormwork {
		margin-left:10px;
		margin-top: 2px;
		align-self: center;
	}
	.closeStyle {
		padding: 1px;
	}

	.closeStyle:hover {
		cursor: pointer;
		/* border-color:#f40; */
		/* border: 1px solid #f40; */
		background-color: #FFA00A;
		color: #fff;
		border-radius: 50%;
		padding: 1px;
		animation: myrotate 1s linear;
	}

	.addXmGroupFormworkSquare {
		width: 15px;
		height: 15px;
		display: inline-block;
		background-color: #FFA00A;
		animation: myrotate 2s linear infinite;
	}

	.closeXmGroupFormworkSquare {
		width: 15px;
		height: 15px;
		display: inline-block;
		background-color: #fff;
		animation: myrotate 2s linear infinite;
	}
	@keyframes myrotate {
		0% {
			transform: rotate(0deg);
			box-shadow: 0px 0px 10px #fff;
		}

		50% {
			transform: rotate(180deg);
			box-shadow: 0px 0px 45px #fff;
		}

		100% {
			transform: rotate(360deg);
			box-shadow: 0px 0px 10px #fff;
		}
	}
</style>
