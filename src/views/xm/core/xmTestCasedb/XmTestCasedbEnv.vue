<template>
	<section>
		<el-table
			:data="envList"
			style="width: 100%">
			<el-table-column
				prop="id"
				label="参数名"
				min-width="200">
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
				min-width="250">
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