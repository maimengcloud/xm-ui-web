<template> 
  <section> 
    <mo-order-mng :is-my-branch="true"></mo-order-mng>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import config from '@/common/config';//全局公共库  
	import { mapGetters } from 'vuex'
  import MoOrderMng from './MoOrderMng.vue';
	
	export default {
	    name:'myMoOrderMng',
		components: {
		    MoOrderMng ,
		},
		props:['visible'],
		computed: {
		    ...mapGetters(['userInfo']),

		},
		watch:{
            visible(val){
                if(val==true){
                    this.initData();
                    this.searchMoOrders()
                }
            }
		},
		data() {
			return {
				filters: {
					key: ''
				},
				moOrders: [],//查询结果
				pageInfo:{//分页数据
					total:0,//服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
					pageSize:10,//每页数据
					count:false,//是否需要重新计算总记录数
					pageNum:1,//当前页码、从1开始计算
					orderFields:[],//排序列 如 ['sex','student_id']，必须为数据库字段
					orderDirs:[]//升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
				},
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				sels: [],//列表选中数据
				dicts:{
				    //sex: [{id:'1',name:'男'},{id:'2',name:'女'}]
				},//下拉选择框的所有静态数据 params={categoryId:'all',itemCodes:['sex']} 返回结果 {sex: [{id:'1',name:'男'},{id:'2',name:'女'}]}
				addFormVisible: false,//新增moOrder界面是否显示
				addForm: {
					id:'',name:'',obranchId:'',ouserid:'',ousername:'',moFinalFee:'',status:'',sstatus:'',ctime:'',payTime:'',payCtime:'',moOrginFee:'',ousers:'',ocates:'',omodules:'',poid:'',startTime:'',endTime:'',payType:'',payId:'',prepayId:'',topenId:'',pbankId:'',pbankName:'',pbankCardNo:'',pbankUsername:'',remark:'',finishTime:'',closeTime:'',setTime:'',omonths:'',ofinalFee:'',odisRate:'',othFee:'',otype:'',osource:'',memType:'',atype:'',saleUserid:'',saleUsername:'',custPhone:'',custAddress:''
				},
				
				editFormVisible: false,//编辑界面是否显示
				editForm: {
					id:'',name:'',obranchId:'',ouserid:'',ousername:'',moFinalFee:'',status:'',sstatus:'',ctime:'',payTime:'',payCtime:'',moOrginFee:'',ousers:'',ocates:'',omodules:'',poid:'',startTime:'',endTime:'',payType:'',payId:'',prepayId:'',topenId:'',pbankId:'',pbankName:'',pbankCardNo:'',pbankUsername:'',remark:'',finishTime:'',closeTime:'',setTime:'',omonths:'',ofinalFee:'',odisRate:'',othFee:'',otype:'',osource:'',memType:'',atype:'',saleUserid:'',saleUsername:'',custPhone:'',custAddress:''
				},
				maxTableHeight:300,
			}
		},//end data
		methods: {

		    ...util,

			handleSizeChange(pageSize) { 
				this.pageInfo.pageSize=pageSize; 
				this.getMoOrders();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getMoOrders();
			},
			// 表格排序 obj.order=ascending/descending,需转化为 asc/desc ; obj.prop=表格中的排序字段,字段驼峰命名
			sortChange( obj ){
				if(obj.order==null){
					this.pageInfo.orderFields=[];
					this.pageInfo.orderDirs=[]; 
				}else{
					var dir='asc';
					if(obj.order=='ascending'){
						dir='asc'
					}else{
						dir='desc';
					}
					 
					this.pageInfo.orderFields=[util.toLine(obj.prop)]; 
					this.pageInfo.orderDirs=[dir];
				}
				this.getMoOrders();
			},
			searchMoOrders(){
				 this.pageInfo.count=true; 
				 this.getMoOrders();
			},
			//获取列表 MoOrder mo_order
			getMoOrders() {
				let params = {
					pageSize: this.pageInfo.pageSize,
					pageNum: this.pageInfo.pageNum,
					total: this.pageInfo.total,
					count:this.pageInfo.count
				};
				if(this.pageInfo.orderFields!=null && this.pageInfo.orderFields.length>0){
					let orderBys=[];
					for(var i=0;i<this.pageInfo.orderFields.length;i++){ 
						orderBys.push(this.pageInfo.orderFields[i]+" "+this.pageInfo.orderDirs[i])
					}  
					params.orderBy= orderBys.join(",")
				}
				if(this.filters.key){
					params.key=this.filters.key
				}

				this.load.list = true;
				listMoOrder(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
						this.moOrders = res.data.data;
					}else{
						this.$notify({ position:'bottom-left',showClose:true, message: tips.msg, type: 'error' });
					} 
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},

			//显示编辑界面 MoOrder mo_order
			showEdit: function ( row,index ) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面 MoOrder mo_order
			showAdd: function () {
				this.addFormVisible = true;
				//this.addForm=Object.assign({}, this.editForm);
			},
			afterAddSubmit(){
				this.addFormVisible=false;
				this.pageInfo.count=true;
				this.getMoOrders();
			},
			afterEditSubmit(){
				this.editFormVisible=false;
			},
			//选择行moOrder
			selsChange: function (sels) {
				this.sels = sels;
			}, 
			//删除moOrder
			handleDel: function (row,index) { 
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					let params = {  id:row.id };
					delMoOrder(params).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if(tips.isOk){
							this.searchMoOrders();
						}
						this.$notify({ position:'bottom-left', showClose:true, message: tips.msg, type: tips.isOk?'success':'error' });
					}).catch( err  => this.load.del=false );
				});
			},
			//批量删除moOrder
			batchDel: function () {
				if(this.sels.length<=0){
				    return;
				}
				var params=this.sels.map(i=>{
				    return { id:i.id}
				})
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					batchDelMoOrder(params).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if( tips.isOk ){
							this.searchMoOrders();
						}
						this.$notify({ position:'bottom-left',showClose:true, message: tips.msg, type: tips.isOk?'success':'error'});
					}).catch( err  => this.load.del=false );
				});
			},
          editSomeFields(row,fieldName,$event){
            let params={};
            if(this.sels.length>0){
              if(!this.sels.some(k=> k.id==row.id)){
                this.$notify({position:'bottom-left',showClose:true,message:'请编辑选中的行',type:'warning'})
                Object.assign(this.editForm,this.editFormBak)
                return;
              }
                params['ids']=this.sels.map(i=>i.id)
            }else{
                params['ids']=[row].map(i=>i.id)
            }
            params[fieldName]=$event
            var func = editSomeFieldsMoOrder
            func(params).then(res=>{
              let tips = res.data.tips;
              if(tips.isOk){
                if(this.sels.length>0){
                    this.searchMoOrders();
                }
                this.editFormBak=[...this.editForm]
              }else{
                Object.assign(this.editForm,this.editFormBak)
                this.$notify({position:'bottom-left',showClose:true,message:tips.msg,type:tips.isOk?'success':'error'})
              }
            }).catch((e)=>Object.assign(this.editForm,this.editFormBak))
          },
			rowClick: function(row, event, column){
			    this.editForm=row
			    this.editFormBak={...row};
				this.$emit('row-click',row, event, column);//  @row-click="rowClick"
			},
            initData: function(){

            },
			
		},//end methods
		mounted() {
			this.$nextTick(() => {
			    initDicts(this);
			    this.initData()
				this.searchMoOrders();
                this.maxTableHeight = util.calcTableMaxHeight(this.$refs.moOrderTable.$el)

        	});
		}
	}

</script>

<style scoped>
</style>