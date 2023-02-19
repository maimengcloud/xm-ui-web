<template>
	<section>
		<el-row class="padding-bottom">
			<span style="font-size:0.8em;color:#909399;">
				<h4>注意：</h4> 
				测试库的环境变量在整个测试库范围内共享。<br/>
				测试计划的环境变量在整个测试计划范围内共享。<br/> 
				环境变量可以在自动化测试用例中通过<Strong>${env.变量名}</Strong>进行引用，比如变量baseApi,可以通过 ${env.baseApi}进行引用<br/>
				赋值顺序：优先查找测试计划中变量，如果不存在，则从测试库中查找变量<br/> 
			</span>
		</el-row>
		<el-table
			:data="envList"
			style="width: 100%">
			<el-table-column
				prop="id"
				label="变量名(英文)"
				min-width="100">
				<template scope="scope">
					<el-input v-model="scope.row.id"></el-input>
				</template>
			</el-table-column>
			<el-table-column
				prop="value"
				label="变量值"
				min-width="250">
				<template scope="scope">
					<el-input v-model="scope.row.value"></el-input>
				</template>
			</el-table-column>  
			
			<el-table-column
				prop="name"
				label="备注"
				min-width="150">
				<template scope="scope">
					<el-input v-model="scope.row.name"></el-input>
				</template>
			</el-table-column>  
			<el-table-column label="操作" width="180">
				<template slot="header" slot-scope="scope">
					操作											
					<el-button v-if="!envList||envList.length==0" @click="addEnvRow({},0)" icon="el-icon-plus" circle plain></el-button>  
				</template>
				<template scope="scope">
					<el-button type="danger" @click="deleteEnvRow(scope.row,scope.$index)" icon="el-icon-delete" circle plain></el-button> 
					<el-button @click="addEnvRow(scope.row,scope.$index)" icon="el-icon-plus" circle plain></el-button> 
				</template>
			</el-table-column>
		</el-table>
		<slot name="submit" :value="envList">
			<el-row class="padding" style="float:right;"><el-button @click="saveData" type="primary">保存</el-button></el-row>
		</slot>
		
 	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import { editSomeFieldsXmTestCasedb } from '@/api/xm/core/xmTestCasedb';

	import { mapGetters } from 'vuex'; 
 
	export default { 
		props:['xmTestCasedb'],
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
				]), 
		}, 
		watch:{
			xmTestCasedb:{
				deep:true,
				handler:function(){
					this.initData();
				}
				
			}
		},
		data() {
			return {  
				envList:[{id:'',value:'',name:''}],
			}
		},//end data
		methods: {  
			
			addEnvRow(row,index){
				this.envList.splice(index+1,0,{id:'',value:''})
			}, 
			deleteEnvRow(row,index){
				this.envList.splice(index,1)
			},
			
			saveData(){
				this.editSomeFields(this.xmTestCasedb,"envJson",JSON.stringify(this.envList));
			},
			initData(){
				if(this.xmTestCasedb.envJson){
					this.envList=JSON.parse(this.xmTestCasedb.envJson)
				}else{
					this.envList=[]
				}
			},
			
            editSomeFields(row,fieldName,$event){
                
                let params={};
                params['ids']=[row].map(i=>i.id)
				params[fieldName]=$event  
                var func = editSomeFieldsXmTestCasedb
                func(params).then(res=>{
                  let tips = res.data.tips;
                  if(tips.isOk){
					row.envJson=$event
					this.$emit('edit-fields',row)
                    this.$notify({position:'bottom-left',showClose:true,message:tips.msg,type:tips.isOk?'success':'error'})
                  }else{ 
                    this.$notify({position:'bottom-left',showClose:true,message:tips.msg,type:tips.isOk?'success':'error'})
                  }
                }).catch((e)=> {})
            },
		},//end methods
		components: {  
 		},  
		mounted() {   
			this.initData()
		}
	}
</script>

<style scoped> 
</style>