<template>
	<section>
		<el-row v-if="isMult"><el-button type="primary" style="float:right;" icon="el-icon-checked" @click="selectConfirm">确认选中</el-button></el-row>
		<el-row class="padding-top">
		<el-table
			:data="envList"
			stripe
              fit
              border
			style="width: 100%"
			@selection-change="selsChange"
			>
			<template v-if="isMult"><el-table-column v-if="isMult" type="selection" width="55" ></el-table-column></template>
			<el-table-column
				prop="id"
				label="参数名"
				width="150">
				<template slot="header" slot-scope="scope">
					<div style="display:flex;">参数名 <el-checkbox v-model="isMult">多选</el-checkbox></div>
				</template>
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
			<el-table-column  label="操作" width="180"> 
				<template scope="scope">
					<el-button v-show="!isMult"  type="primary" @click="select(scope.row,scope.$index)" icon="el-icon-checked">选择</el-button> 
				</template>
			</el-table-column> 
			
		</el-table>  
	</el-row>
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
				sels:[],
				isMult:false,
				envList:[{id:'',value:'',name:''}],
			}
		},//end data
		methods: {  
			
			selsChange: function (sels) {
				this.sels = sels;
			},
			selectConfirm(){
				this.$emit('select',this.sels)
			},
			select(row){
				this.$emit('select',[row])
			},
			initData(){
				if(this.xmTestCasedb.envJson){
					this.envList=JSON.parse(this.xmTestCasedb.envJson)
				}else{
					this.envList=[]
				}
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