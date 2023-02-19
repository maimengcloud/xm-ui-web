<template>
	<section>
		<el-table
			:data="envList"
			style="width: 100%">
			<el-table-column
				prop="id"
				label="参数名(英文)"
				min-width="100">
				<template scope="scope">
					<el-input v-model="scope.row.id"></el-input>
				</template>
			</el-table-column>
			<el-table-column
				prop="value"
				label="参数值"
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
			<el-table-column label="操作" width="280">
				<template slot="header" slot-scope="scope">
					操作	
					<div style="display:flex;">								
						<el-button v-if="!envList||envList.length==0" @click="addEnvRow({},0)" icon="el-icon-plus"></el-button>  
						<el-button v-if="!envList||envList.length==0" @click="importFromCasedb({},0)" icon="el-icon-plus" plain>从测试库导入</el-button> 
					</div>		
				</template>
				<template scope="scope">
					<el-button type="danger" @click="deleteEnvRow(scope.row,scope.$index)" icon="el-icon-delete" circle plain></el-button> 
					<el-button @click="addEnvRow(scope.row,scope.$index)" icon="el-icon-plus" circle plain></el-button>  
					<el-button @click="importFromCasedb(scope.row,scope.$index)" icon="el-icon-plus" plain>从测试库导入</el-button> 
				</template>
			</el-table-column>
		</el-table>
		<slot name="submit" :value="envList">
			<el-row class="padding" style="float:right;"><el-button @click="saveData" type="primary">保存</el-button></el-row>
		</slot> 
		<el-dialog append-to-body title="选择测试库环境变量" width="900px" top="10px" :visible.sync="xmTestCasedbEnvVisible">
			<xm-test-casedb-env-select :xmTestCasedb="xmTestCasedb" @select="onCasedbEnvSelect"></xm-test-casedb-env-select>
		</el-dialog>
 	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import { editSomeFieldsXmTestPlan } from '@/api/xm/core/xmTestPlan';
	import XmTestCasedbEnvSelect from '../xmTestCasedb/XmTestCasedbEnvSelect.vue';
	import { mapGetters } from 'vuex'; 
 
	export default { 
		props:['xmTestPlan','xmTestCasedb'],
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
				]), 
		}, 
		watch:{
			xmTestPlan:{
				deep:true,
				handler:function(){
					this.initData();
				}
				
			}
		},
		data() {
			return {  
				envList:[{id:'',value:'',name:''}],
				xmTestCasedbEnvVisible:false,
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
				this.editSomeFields(this.xmTestPlan,"envJson",JSON.stringify(this.envList));
			},
			initData(){
				if(this.xmTestPlan.envJson){
					this.envList=JSON.parse(this.xmTestPlan.envJson)
				}else{
					this.envList=[]
				}
			},
			importFromCasedb(row,index){
				this.xmTestCasedbEnvVisible=true;
			},
			onCasedbEnvSelect(rows){
				if(rows && rows.length>0){
					this.envList.push(...rows)
				}
				this.xmTestCasedbEnvVisible=false;
				
			},
            editSomeFields(row,fieldName,$event){
                
                let params={};
                params['ids']=[row].map(i=>i.id)
				params[fieldName]=$event  
                var func = editSomeFieldsXmTestPlan
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
			XmTestCasedbEnvSelect,
 		},  
		mounted() {   
			this.initData()
		}
	}
</script>

<style scoped> 
</style>