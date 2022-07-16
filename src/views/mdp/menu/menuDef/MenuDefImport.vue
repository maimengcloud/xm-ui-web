<template>
	<section>
		<el-row class="app-container">
			<!--新增界面 MenuDef 前端功能菜单表--> 
			<el-form :model="addForm"  label-width="120px" :rules="addFormRules" ref="addForm"> 
				<el-form-item label="上级菜单" prop="pid"> 
					 <menu-tree v-loading="load.list"  :refresh="refresh" :expand-on-click-node="false" showCheckbox  @check-change="menuTreeCheckChange" ref="pmenuTree"></menu-tree> 
				</el-form-item>    
				<el-form-item label="导入范围">
				   <el-radio v-model="onlyLeaf" label="1">只导入选中的菜单树中叶子节点，不导入父亲节点</el-radio>
					  <el-radio v-model="onlyLeaf" label="0">全部选中的菜单都导入</el-radio>
				</el-form-item>  
				<el-form-item label="导入方式" prop="importType"> 
					  <el-radio v-model="importType" label="0">当前系统菜单</el-radio>
					  <el-radio v-model="importType" label="1">json字符串</el-radio>
				</el-form-item>
				<el-form-item v-if="importType=='0'" label="新导入菜单预览" prop="id">
					<el-tree :data="routersTreeData" :props="routerProps" show-checkbox ref="permissionRoutersTree"></el-tree>
				</el-form-item>  
				<el-form-item v-if="importType=='1'" label="新导入菜单预览" prop="mname">
					<el-tree :data="jsonRouters" :props="routerProps" ></el-tree>
				</el-form-item> 
				<el-form-item v-if="importType=='1'" label="json路由字符串" prop="moduleId">
				  <el-input
					  type="textarea"
					  :rows="10"
					  placeholder="请输入内容"
					  v-model="jsonRoutersText">
					</el-input>
				</el-form-item> 
				 
				<el-form-item>
					<el-col :span="4" :offset="8"> 
						<el-button @click.native="handleCancel">取消</el-button> 
					</el-col>
					<el-col :span="4"> 
						<el-button v-loading="load.add" type="primary" @click.native="preview" >预览</el-button>  
					</el-col>
					<el-col :span="4"> 
						<el-button v-loading="load.add" type="primary" @click.native="batchImportMenus" >提交</el-button>  
					</el-col>
				</el-form-item> 
			</el-form>
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import seq from '@/common/js/sequence';//全局公共库
	//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { initDicts, addMenuDef, batchInsertMenuDef } from '@/api/mdp/menu/menuDef';
	import { listMenuModule } from '@/api/mdp/menu/menuModule'; 
	import MenuTree from './MenuTree'
	import { mapGetters } from 'vuex';  
	import { generateTitle } from '@/utils/i18n'

	export default {

	    computed: {
	    	'routersTreeData': function(){
				
	    		var routers=this.permission_routers.filter(i=>i.meta&&i.meta.title&&!i.hidden); 
	    		routers.forEach((i,index)=>{ 
	    			i.rpath=i.path
					i.id=seq.sn()
	    			i.mname=i.meta&&i.meta.title?this.generateTitle(i.meta.title):i.name;
	    			i.isShow='1'
					i.pid="M0"
					if(index<10){
						i.msort="0"+index
					}else{
						i.msort=index
					}
					
	    			this.routersTreeDataFill(i.children,i)
	    		})
				
	    		return routers;
	    	},
		    ...mapGetters([
		      'userInfo',
		      'permission_routers'
		    ])
		},
		props:['menuDef','visible','pmenu'],
		watch: {
	      'menuDef':function( menuDef ) {
	        this.addForm = menuDef;
	      },
	      'visible':function(visible) { 
	      	if(visible==true){
	      		//从新打开页面时某些数据需要重新加载，可以在这里添加
	      	}
	      } 
	    },
		data() {
			return {
				dicts:{},//下拉选择框的所有静态数据  params=[{moduleIdId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				addFormRules: {
					id: [
						//{ required: true, message: '菜单编号不能为空', trigger: 'blur' }
					]
				},
				//新增界面数据 前端功能菜单表
				addForm: {
					id:'',pid:'',accUrl:'',msort:'',moduleId:'',icon:'',mname:'',rpath:'',rid:'',isShow:'1',menuType:'1' ,supVers:'0'
				},
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
				menuModules:[],//归属模块{id:'',cname:''}
				routerProps:{
					 children: 'children',
			         label: 'mname',
			         id:'name'
				},
				importType:'0',
				jsonRouters:[],
				jsonRoutersText:'',
				refresh:false,//
				onlyLeaf:'0',
				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			
    		generateTitle,
			// 取消按钮点击 父组件监听@cancel="addFormVisible=false" 监听
			handleCancel:function(){
				this.$refs['addForm'].resetFields();
				this.$emit('cancel');
			},
			preview:function(){
				this.jsonRouters=[]
				this.jsonRoutersText=this.jsonRoutersText.replace(/component[ ]*\:[_/'"() \w]*,{1}/g,"");
				this.jsonRouters=eval('(' + this.jsonRoutersText + ')');
			},
			batchImportMenus(){
				
				let routers=this.jsonRouters;
				if(this.importType=='1'){
					try{
						this.jsonRoutersText=this.jsonRoutersText.replace(/component[ ]*\:[_/'"() \w]*,{1}/g,"");
					}catch (err){ 
							this.$notify.error("解析json串失败");
							return; 
					}
				}else{
					routers=this.$refs.permissionRoutersTree.getCheckedNodes(false,this.onlyLeaf=='1'?false:true)
				} 
 
				let checkedNodes=this.$refs.pmenuTree.$refs.nodeTree.getCheckedNodes(false,false);
				
				
				if(checkedNodes==null || checkedNodes.length!=1 ){
					this.$notify.error("请先选择需要导入到的上级菜单");
					return;
				}
				var pid=checkedNodes[0].isModule==true?'M0':checkedNodes[0].id
				let menus=[]; 
				if(routers.length<=0){
					this.$notify.error("没有需要导入的菜单");
					return;
				}  
				
				var routersInit=JSON.parse(JSON.stringify(routers))
				routers.forEach(i=>{
					if(!i.pid||this.onlyLeaf=='1'){
						i.pid=pid
					}else{
						//如果上级被选中，则以上级的编号作为pid,如果上级没呗选中，以客户指定的上级为上级
						if(!routersInit.some(r=>r.id==i.pid)){
							i.pid=pid
						}
					}
					i.moduleId=this.addForm.moduleId
					i.mcate=this.addForm.mcate
					i.menuType="1"
					menus.push(i)
				});
				var idMap=new Map();
				menus.forEach(i=>{
					idMap.set(i.id,seq.sn());
				})
				menus.forEach(i=>{
					i.pid=idMap.get(i.pid)||i.pid
					i.id=idMap.get(i.id)
					i.supVers="0"
				})
				this.load.add=true;
				batchInsertMenuDef(menus).then(res=>{
					if(res.data.tips.isOk==true){
						this.$notify.success("导入成功");
						this.refresh=!this.refresh;
					}else{
						this.$notify.error(res.data.tips.msg);
					}
					this.load.add=false
				}).catch(res=>this.load.add=false);
			},
			jsonRoutersToMenuDef(menus,pmenu,route){ 
				if(route && route.children && route.children.length>0){
					let children=route.children;
					children.forEach(i=>{
						let mname=i.name&&i.name!=''&&i.name!=null?i.name:'未知名字'
						let menu={id:seq.sn(),mname:mname,rid:mname,rpath:i.path?i.path:'',pid:pmenu.id,isShow:'1'};
						menus.push(menu);
						this.jsonRoutersToMenuDef(menus,menu,i);
					});
				}
				
			},
			//新增提交MenuDef 前端功能菜单表 父组件监听@submit="afterAddSubmit"
			addSubmit: function () {
				
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.add=true
							let params = Object.assign({}, this.addForm); 
							params.pid=this.pmenu.id;
							addMenuDef(params).then((res) => {
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
			menuTreeCheckChange: function(data,checked,leafChecked){ 
				if(checked){
					this.addForm.moduleId=data.moduleId;
					this.addForm.mcate=data.mcate
				}else{
					this.addForm.moduleId='';
					this.addForm.mcate=''
				}
			},
			routersTreeDataFill: function(routers,prouter){ 
	    		if(prouter==null){
	    			return;
	    		}
	    		if(routers==null){
	    			return;
	    		}
	    		routers.forEach((i,index)=>{ 
	    			i.rpath=prouter.path+'/'+i.path
					i.id=seq.sn()
	    			i.pid=prouter.id
	    			i.mname=i.meta&&i.meta.title?this.generateTitle(i.meta.title):i.name;
	    			i.isShow='1'
	    			i.menuType="1";
					if(index<10){
						i.msort=prouter.msort+".0"+index
					}else{
						i.msort=prouter.msort+"."+index
					}
					
	    			if(i.children && i.children.length>0){
	    				this.routersTreeDataFill(i.children,i)
	    			}
	    		})
	    	}, 
			/**end 在上面加自定义方法**/
			
		},//end method
		components: {  
		    //在下面添加其它组件 'menu-def-edit':MenuDefEdit
			MenuTree
		},
		mounted() {
			
			initDicts(this);
			this.addForm=Object.assign(this.addForm, this.menuDef);  
			//this.addForm.pid=this.pmenu.id
			listMenuModule({}).then(res=>this.menuModules=res.data.data);
			/**在下面写其它函数***/
			
		}//end mounted
	}

</script>

<style scoped>

</style>