<template>
	<section> 
	   	<el-row> 
			<el-form ref="extInfosRef">  
				<!-- 扩展字段[{name:'中文名称',id:'编号',value:'值',remark:'备注',type:'支持简单的1-普通文本2-数字，3-日期，8-富文本，9单图文，15-是否'}] -->
				<el-row>
						<el-col :span="1">
							步骤
						</el-col>
						<el-col :span="11">
							操作
						</el-col> 
						<el-col :span="8">
							实际结果
						</el-col>
						<el-col :span="2">
							步骤结果
						</el-col>
						<el-col :span="2">
							缺陷
						</el-col>
					</el-row>
				<el-row v-for="(item, index) in extInfosList" :key="index">
					 
						<el-col :span="1">
							{{index+1}}
						</el-col>
						<el-col :span="11">
							<span><span style="color:#C0C4CC;">操作：</span>{{item.op}}</span><br/>
							<span><span style="color:#C0C4CC;">预期：</span>{{item.eresult}}</span>
 						</el-col> 
						<el-col :span="8">
							<my-input class="padding-right" v-model="item.aresult" clearable placeholder="步骤结果"></my-input> 
						</el-col>
						<el-col :span="2">
							<el-select class="padding-right"  v-model="item.tcode" clearable>
								<el-option v-for="(item,index) in dicts['testStepTcode']" :key="index" :value="item.id" :label="item.name"></el-option>
							</el-select>
 						</el-col> 
						<el-col :span="2"> 
 							<el-button @click="addBug(item,index)" icon="el-icon-plus"  type="text"></el-button> 
						</el-col>  
				</el-row> 
			</el-form>  
		   </el-row>
	</section>
</template>

<script> 
	import { mapGetters } from 'vuex'
	import { initDicts } from '@/api/xm/core/xmTestPlanCase';

	import MyInput from '@/components/MDinput/index';
 	
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
				dicts:{
					testStepTcode:[],
				},
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
			 MyInput
		},
		mounted() { 
			this.$nextTick(()=>{
				initDicts(this)
			})
			 this.initData();
			
			
		}
	}

</script>

<style scoped>
	 
</style>