<template>
	<section class="padding"> 
		<el-row :gutter="10">   
			<el-col :span="24">
				<el-form :model="dbForm" ref="dbFormRef">
					<el-form-item label="数据库" :rules="{required:true,message:'此项必输',trigger:'blur'}" prop="dbOwner">
						<mdp-select v-model="dbForm.dbOwner" :load-fun="dataSourceList" ></mdp-select>
					</el-form-item>
					<el-form-item label="表名" :rules="{required:true,message:'此项必输',trigger:'blur'}" prop="tableNames" title="支持多个表,逗号分割">
						<el-input type="textarea" :rows="4" v-model="dbForm.tableNames" placeholder="支持多个表,逗号分割,如sys_user,sys_dept"></el-input>
					</el-form-item>  
					<el-form-item label="删除表名前缀" prop="ignoePrefixs">
						<el-input v-model="dbForm.ignoePrefixs" placeholder="如 将sys_user中的sys_剔除，可填写sys_"></el-input>
						<div>删除表名的某些前缀，如 将sys_user中的sys_剔除，可填写sys_</div>
						<div>{{dbForm.ignoePrefixs?(dbForm.tableNames+" => "+doTableNamesReplace()):""}}</div>
					</el-form-item> 
					<el-form-item label="包名" :rules="{required:true,message:'此项必输',trigger:'blur'}" prop="javaPackage">
						<el-input v-model="dbForm.javaPackage" placeholder="举例 com.mdp.sys"></el-input>
						<div>包名直接作为java文件存放目录，页面文件存放的目录也由包名解析而来 举例 com.mdp.sys</div>
						<div>java目录：{{getJavaDir()}}</div>
						<div>页面文件目录：{{getPageDir()}}</div>
					</el-form-item>
					<el-form-item label="页面文件目录过滤规则" prop="pathFilter">
						<el-input v-model="dbForm.pathFilter" placeholder="比如 com."></el-input>
						<div>包名中如果不想某些字符作为页面文件目录，此处填写需要过滤的字符，比如 com.</div>
					</el-form-item>  
					
					<el-form-item label="属性注解" prop="printTableField">
						<el-checkbox v-model="dbForm.printTableField">是否打印@TableField到实体属性上</el-checkbox>
						<div>如果字段命名非常不规范，如字段名为userId,_userid,userid_等，无法由驼峰命名转换回来的字段，需要通过注解标明真实的字段名</div>
					</el-form-item>  
				</el-form> 
			</el-col> 
		</el-row>
			
		<el-row class="footer"> 
			<el-button type="primary" @click="genCode">确定</el-button>
		</el-row> 
	</section>
</template>

<script>    

import {dataSourceList} from '@/api/mdp/lcode/dev'
export default { 
	computed: { 
	}, 
	props:{
		 
	},
	watch: {   
	},	
	data() {
		return {
			dbForm:{
				tableNames:'',
				dbOwner:'',
				javaPackage:'',
				pathFilter:'',
				ignoePrefixs:'',
				printTableField:false,
			}
		} 
	},//end data
	methods: {
		dataSourceList,
		genCode(){
			this.$refs['dbFormRef'].validate(valid=>{
				if(valid){
					var url=`${this.$mdp.getApiBase()}/lcode/mdp/dev/code/gen?tableNames=${this.dbForm.tableNames}&dbOwner=${this.dbForm.dbOwner}&javaPackage=${this.dbForm.javaPackage}&pathFilter=${this.dbForm.pathFilter}&ignoePrefixs=${this.dbForm.ignoePrefixs}&printTableField=${this.dbForm.printTableField}`
					location.href=this.$mdp.replaceUrl(url)
				}else{
					this.$notify.error("表单验证不通过")
				}
			})
			
		},
		doTableNamesReplace(){
			var tableNames=this.dbForm.tableNames;
			var ignoePrefixs=this.dbForm.ignoePrefixs;
			if(tableNames && tableNames.length>0){
				return tableNames.split(",").map(k=>{
					if(k.indexOf(ignoePrefixs)==0){
						return k.substr(ignoePrefixs.length)
					}else{
						return k
					}
				}).join(",")
			}else{
				return this.dbForm.tableNames
			}
		},
		getJavaDir(){
			if(this.dbForm.javaPackage && this.dbForm.javaPackage.length>0){
				return this.dbForm.javaPackage.split(".").join("/")
			}else{
				return ""
			}
		},
		
		getPageDir(){
			if(this.dbForm.javaPackage && this.dbForm.javaPackage.length>0){
				if(this.dbForm.pathFilter && this.dbForm.pathFilter.length>0){
					if(this.dbForm.javaPackage.indexOf(this.dbForm.pathFilter)==0){
						var p=this.dbForm.javaPackage.substr(this.dbForm.pathFilter.length)
						return p.split(".").join("/")
					}else{
						return this.dbForm.javaPackage.split(".").join("/")
					}
				}else{
					return this.dbForm.javaPackage.split(".").join("/")
				}
			}else{
				return ""
			}
		}
	},//end method
	components: {    
	},
	mounted() {  
		
	}//end mounted
}

</script>

<style rel="stylesheet/scss" lang="scss" scoped> 
 
</style>