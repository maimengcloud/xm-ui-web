<template>
	<section  class="page-container padding">
	    <el-row class="page-header">
	    </el-row>
		<el-row class="page-main">
		<!--编辑界面 MenuFavorite 菜单收藏夹--> 
			<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editFormRef">
				<el-form-item label="菜单收藏夹ID" prop="favoriteid">
					<el-input v-model="editForm.favoriteid" placeholder="菜单收藏夹ID"></el-input>
				</el-form-item> 
				<el-form-item label="部门-岗位-用户ID（暂时不用）" prop="deptPostUserid">
					<el-input v-model="editForm.deptPostUserid" placeholder="部门-岗位-用户ID（暂时不用）"></el-input>
				</el-form-item> 
				<el-form-item label="部门ID（暂时不用）" prop="deptid">
					<el-input v-model="editForm.deptid" placeholder="部门ID（暂时不用）"></el-input>
				</el-form-item> 
				<el-form-item label="岗位ID（暂时不用）" prop="postid">
					<el-input v-model="editForm.postid" placeholder="岗位ID（暂时不用）"></el-input>
				</el-form-item> 
				<el-form-item label="用户ID（暂时不用）" prop="userid">
					<el-input v-model="editForm.userid" placeholder="用户ID（暂时不用）"></el-input>
				</el-form-item> 
				<el-form-item label="菜单ID（暂时不用）" prop="menuid">
					<el-input v-model="editForm.menuid" placeholder="菜单ID（暂时不用）"></el-input>
				</el-form-item> 
				<el-form-item label="菜单名称" prop="menuname">
					<el-input v-model="editForm.menuname" placeholder="菜单名称"></el-input>
				</el-form-item> 
				<el-form-item label="排序" prop="sort">
					<el-input v-model="editForm.sort" placeholder="排序"></el-input>
				</el-form-item> 
				<el-form-item label="云用户机构编号" prop="branchId">
					<el-input v-model="editForm.branchId" placeholder="云用户机构编号"></el-input>
				</el-form-item> 
				<el-form-item label="创建人" prop="cuserid">
					<el-input v-model="editForm.cuserid" placeholder="创建人"></el-input>
				</el-form-item> 
				<el-form-item label="创建时间" prop="cdate">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.cdate"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="最后操作人" prop="lopuserid">
					<el-input v-model="editForm.lopuserid" placeholder="最后操作人"></el-input>
				</el-form-item> 
				<el-form-item label="最后操作时间" prop="lopcreate">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.lopcreate"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="访问路径" prop="accUrl">
					<el-input v-model="editForm.accUrl" placeholder="访问路径"></el-input>
				</el-form-item> 
				<el-form-item label="菜单图标" prop="icon">
					<el-input v-model="editForm.icon" placeholder="菜单图标"></el-input>
				</el-form-item> 
			</el-form>
		</el-row>

		<el-row   class="page-bottom bottom-fixed">
		    <el-button @click.native="handleCancel">取消</el-button>
            <el-button v-loading="load.edit" type="primary" @click.native="saveSubmit" :disabled="load.edit==true">提交</el-button>
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import { getDicts,initSimpleDicts,initComplexDicts } from '@/api/mdp/meta/item';//字典表
	import { addMenuFavorite,editMenuFavorite } from '@/api/mdp/menu/menuFavorite';
	import { mapGetters } from 'vuex'
	
	export default {
	    components: {
            //MenuFavoriteEdit,
        },
		computed: {
		    ...mapGetters([ 'userInfo'  ]),

		},
		props:['menuFavorite','visible','opType'],

		watch: {
	      'menuFavorite':function( menuFavorite ) {
	        if(menuFavorite){
	            this.editForm = menuFavorite;
	        }

	      },
	      'visible':function(visible) { 
	      	if(visible==true){
	      		//从新打开页面时某些数据需要重新加载，可以在这里添加
	      		this.initData()
	      	}
	      } 
	    },
		data() {
			return {
			    currOpType:'add',//add/edit
 				load:{ list: false, edit: false, del: false, add: false },//查询中...
				dicts:{},//下拉选择框的所有静态数据 params={categoryId:'all',itemCodes:['sex']} 返回结果 {sex: [{id:'1',name:'男'},{id:'2',name:'女'}]}
				editFormRules: {
					favoriteid: [
						//{ required: true, message: '菜单收藏夹ID不能为空', trigger: 'blur' }
					]
				},

				//编辑界面数据  MenuFavorite 菜单收藏夹
				editForm: {
					favoriteid:'',deptPostUserid:'',deptid:'',postid:'',userid:'',menuid:'',menuname:'',sort:'',branchId:'',cuserid:'',cdate:'',lopuserid:'',lopcreate:'',accUrl:'',icon:''
				},
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/

			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="editFormVisible=false" 监听
			handleCancel:function(){
				this.$refs['editFormRef'].resetFields();
				this.$emit('cancel');
			},
			//编辑提交MenuFavorite 菜单收藏夹父组件监听@submit="afterEditSubmit"
			saveSubmit: function () {
				this.$refs.editFormRef.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.edit=true
							let params = Object.assign({}, this.editForm);
							if(this.currOpType=='edit'){
							    editMenuFavorite(params).then((res) => {
                                    this.load.edit=false
                                    var tips=res.data.tips;
                                    if(tips.isOk){
                                        this.$emit('submit');//  @submit="afterEditSubmit"
                                    }
                                    this.$notify({ showClose:true, message: tips.msg, type: tips.isOk?'success':'error' });
                                }).catch( err =>this.load.edit=false);
							}else{
							    addMenuFavorite(params).then((res) => {
                                    this.load.edit=false
                                    var tips=res.data.tips;
                                    if(tips.isOk){
                                        this.editForm=res.data.data
                                        this.initData()
                                        this.currOpType="edit";
                                        this.$emit('submit');//  @submit="afterAddSubmit"
                                    }
                                    this.$notify({ showClose:true, message: tips.msg, type: tips.isOk?'success':'error' });
                                }).catch( err =>this.load.edit=false);
							}
						});
					}
				});
			},
			initData: function(){
			    this.currOpType=this.opType
			    if(this.menuFavorite){
                    this.editForm = Object.assign({},this.menuFavorite);
                }

                if(this.opType=='edit'){

                }else{

                }
            },
			/**begin 在下面加自定义方法**/

		},//end method
		mounted() {
		    this.$nextTick(() => {
                //initSimpleDicts('all',['sex','gradeLvl']).then(res=>this.dicts=res.data.data);
                this.initData()
            });
		}
	}

</script>

<style scoped>

</style>