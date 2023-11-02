<template>
 <section>
	<el-popover
			placement="bottom"
			width="500"
			v-model="formVisible"
			trigger="manual" >  <el-form :model="editForm"  label-width="100px"  ref="editForm">
					<el-form-item :label="item.label" :prop="item.property" v-for="(item,index) in columnsConfig" :key="index">
						<el-checkbox v-model="item.isShow" @change="onCheckboxChange(item,$event)">是否显示</el-checkbox>
					</el-form-item>
					<el-form-item label="" class="padding">
						<el-button   type="text" @click="cancel">关闭</el-button>
						<el-button :disabled="editForm.calcType!=='2' && editForm.ntype==='1'" type="primary" @click="submit">确认</el-button>
					</el-form-item>
				</el-form>
				<el-button title="点击修改表格配置" @click="showConfig"  slot="reference" icon="el-icon-setting"><font style="font-size:14px;"></font></el-button>
		</el-popover>
 </section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import config from '@/common/config';//全局公共库


	import { mapGetters } from 'vuex'

	export default {
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
			]),
		},
		props:['table'],
		watch:{

		},
		data() {
			return {
				 columnsConfig:[],
				 editForm:{},
				 formVisible:false,
			}
		},//end data
		methods: {
			cancel(){
				this.formVisible=false;
				this.$emit("cancel")
			},
			 submit(){
				 this.$emit("submit");
				 this.formVisible=false;
			 },
			 showConfig(){
				 if(this.columnsConfig.length>0){
					 this.formVisible=true;
					 return;
				 }
				if(this.table){
					var columns=this.table.$children.filter(i=>i.columnConfig&&i.columnConfig.label)
					columns=columns.map((column)=>{
						if(column && column.columnConfig){
							return {
								label:column.columnConfig.label,
								property:column.columnConfig.property,
								isShow:true,
								id:column.columnConfig.id,
							}
						}

					});
					this.columnsConfig=columns
					this.formVisible=true;
				}
			 },
			 onCheckboxChange(column,newVal){
 				var doc=this.table.$el;
				var eles=doc.querySelectorAll("."+column.id);
				eles.forEach(i=>{
					i.style.display=newVal?"":"none";
				})
				this.table.doLayout();
			 }

		},//end methods
		components: {
		    //在下面添加其它组件
		},
		mounted() {


		}
	}

</script>

<style   lang="scss" scoped>
</style>
