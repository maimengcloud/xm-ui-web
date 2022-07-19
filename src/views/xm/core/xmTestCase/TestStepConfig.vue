<template>
	<section> 
	   	<el-row> 
			<el-form ref="extInfosRef">  
				<!-- 扩展字段[{name:'中文名称',id:'编号',value:'值',remark:'备注',type:'支持简单的1-普通文本2-数字，3-日期，8-富文本，9单图文，15-是否'}] -->
				<el-row>
						<el-col :span="2">
							步骤
						</el-col>
						<el-col :span="9">
							操作
						</el-col>
						<el-col :span="9">
							预期结果
						</el-col>
						<el-col :span="4">
							操作
						</el-col>
					</el-row>
				<el-row v-for="(item, index) in extInfosList" :key="index">
					 
						<el-col :span="2">
							{{index+1}}
						</el-col>
						<el-col :span="9">
							<el-input style="width:95%;" v-model="item.op" clearable placeholder="操作步骤"></el-input>
						</el-col>
						<el-col :span="9">
							<el-input style="width:95%;" v-model="item.eresult" clearable placeholder="预期结果"></el-input>
						</el-col>
						<el-col :span="4">
							<el-button  @click.prevent="removeExtInfosItem(item,index)" icon="el-icon-delete">
							</el-button><el-button @click="addExtInfosItem(item,index)" icon="el-icon-plus"></el-button> 
						</el-col> 
				</el-row>
				<el-form-item> 
					<el-button @click="addExtInfosFirstItem" icon="el-icon-plus"><slot>新增一行</slot></el-button> 
					<el-button @click="save" icon="el-icon-save"><slot>完成</slot></el-button> 
				</el-form-item>
			</el-form>  
		   </el-row>
	</section>
</template>

<script> 
	import { mapGetters } from 'vuex'
	 
 	
	export default {  
		name: 'testStepConfig',
		props:['value','unConfig'],
		computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		watch:{
			value(val){
				
				this.initData();
			},
			extInfosList:{
				deep:true,
				handler(val,oldVal){  
					if(this.value instanceof Array){
						this.$emit("input",val)
					}else{ 
						this.$emit("input",JSON.stringify(val))
					}
				}
			}, 
		},
		data() { 
			return{ 
				extInfosList:[],//[{name:'中文名称',id:'编号',value:'值',link:'超链接',remark:'备注',type:'支持简单的1-普通文本2-数字，3-日期，8-富文本，9单图文，15-是否'}]

			}
		},//end data
		methods: { 
			save(){
				if(this.value instanceof Array){
					this.$emit("finish",this.extInfosList)
				}else{ 
					this.$emit("finish",JSON.stringify(this.extInfosList))
				} 
			},
			addExtInfosFirstItem(){
				if(!this.extInfosList){
					this.extInfosList=[]
				}
				this.extInfosList.push({id:'',op:'',eresult:'',aresult:'',tcode:'0'})
			},
			addExtInfosItem(item,index){ 
				this.extInfosList.splice(index+1,0,{id:'',op:'',eresult:'',aresult:'',tcode:'0'})
			},
			removeExtInfosItem(item,index){
				this.extInfosList.splice(index,1)
			},
			initData(){
				if(this.value){
					if(this.value instanceof Array){
						this.extInfosList=this.value
					}else{
						this.extInfosList=JSON.parse(this.value)
					}
				}else{
					this.extInfosList=[]
				}
			}
		},//end methods
		components: {  
			 
		},
		mounted() { 
			 this.initData();
			
			
		}
	}

</script>

<style scoped>
	 
</style>