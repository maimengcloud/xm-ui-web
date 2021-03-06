<template>
	<section>
		<el-row class="app-container">  
			<el-input v-model="filters.key" style="width: 20%;" placeholder="模糊查询"></el-input> 
			<el-button   type="primary" v-loading="load.list" :disabled="load.list==true" v-on:click="searchXmMenuTemplates">查询</el-button>
			<el-button v-if="isSelectMenu!=true" type="primary" @click="showProdcutAdd">+产品</el-button> <el-button type="primary" @click="showAdd">+顶级故事</el-button>
			<el-button v-if="isSelectMenu!=true" type="danger" v-loading="load.del" @click="batchDel" :disabled="this.sels.length===0 || load.del==true">批量删除</el-button>
			<el-button v-if="isSelectMenu" type="primary" v-loading="load.del" @click="selectedMenusConfirm" :disabled="this.sels.length===0 || load.del==true">确认选择</el-button> 
 			<el-button  v-if="isSelectMenu!=true && batchEditVisible==false"  type="primary" @click="toBatchEdit">批量修改</el-button> 
			<el-button  v-if="isSelectMenu!=true && batchEditVisible==true"  type="primary" @click="batchSaveMenu">保存</el-button> 
			<el-button  v-if="isSelectMenu!=true  && batchEditVisible==true "    @click="noBatchEdit">返回</el-button>  
		</el-row>
		<el-row class="app-container" >  
			<el-col  :span="6" v-show="!batchEditVisible">
				<xm-product-template-mng @row-click="onProductSelected" ref="xmProductTemplateMng" :simple="true"></xm-product-template-mng>
			</el-col>
			<el-col v-show="!batchEditVisible" :span="batchEditVisible?24:18">
				<el-table :data="xmMenuTemplatesTreeData" default-expand-all  row-key="menuId" :tree-props="{children: 'children', hasChildren: 'hasChildren'}" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
					<el-table-column sortable type="selection" width="40"></el-table-column> 
 					<el-table-column prop="menuName" label="故事名称" min-width="120" > 
						<template slot-scope="scope">
 							<el-tag  >{{scope.row.seqNo}} &nbsp;&nbsp;{{scope.row.menuName}}</el-tag>
						</template>
					</el-table-column> 					
					<el-table-column prop="remark" label="说明" min-width="120" >
						
						<template slot-scope="scope">
							<el-input type="textarea" v-if="batchEditVisible"  v-model="scope.row.remark" @change="fieldChange(scope.row,'remark')"></el-input>
							<div v-else v-html="scope.row.remark"> </div>
						</template>
					</el-table-column> 
					<el-table-column label="操作" width="300" fixed="right"  v-if="isSelectMenu!=true">
						<template slot-scope="scope">
							<el-button    @click="showSubAdd( scope.row,scope.$index)">+子故事</el-button>
							<el-button   @click="showEdit( scope.row,scope.$index)">改</el-button>
							<el-button   type="danger" @click="handleDel(scope.row,scope.$index)">删</el-button>
 
						</template>
					</el-table-column>
				</el-table>
				<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination> 
				
			</el-col>
			<el-col v-show="batchEditVisible" :span="24">
				<el-table :data="xmMenuTemplatesTreeData" class="drag-table" default-expand-all  row-key="menuId" :tree-props="{children: 'children', hasChildren: 'hasChildren'}" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
 					<el-table-column sortable prop="seqNo" label="序号" min-width="100">
						<template slot-scope="scope">
              <div style="display:flex;width:100%;">
              <el-popover
									placement="top"
									width="200"
									trigger="click">
									<div style="text-align: center; margin: 0">
                    <div :ref="'menu_'+scope.$index" :data-menu-id="scope.row.menuId"></div>
										<el-button type="primary" size="mini"   @click="handlePopover(scope.row,'highestPmenuId')">成为顶级节点</el-button> 
									</div>
									<el-button slot="reference" :type="scope.row.opType?'success':'plain'"  size="mini" icon="el-icon-edit" circle></el-button> 
              </el-popover>
							<el-input style="width:100%;"    v-model="scope.row.seqNo" @change="fieldChange(scope.row,'seqNo')"></el-input>
              </div>
             </template>
					</el-table-column> 
 					<el-table-column prop="menuName" label="故事名称" min-width="120" > 
						<template slot-scope="scope">
							<el-input    v-model="scope.row.menuName" @change="fieldChange(scope.row,'menuName')"></el-input>
 						</template>
					</el-table-column> 					
					<el-table-column prop="remark" label="说明" min-width="120" >
						
						<template slot-scope="scope">
							<el-input type="textarea"   v-model="scope.row.remark" @change="fieldChange(scope.row,'remark')"></el-input>
 						</template>
					</el-table-column>  
				</el-table>
				<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination> 
				
			</el-col>
			<!--编辑 XmMenuTemplate xm_project_menu界面-->
			<el-dialog title="编辑故事" :visible.sync="editFormVisible"  width="50%"  append-to-body   :close-on-click-modal="false">
				  <xm-menu-template-edit :xm-menu-template="editForm" :visible="editFormVisible" @cancel="editFormVisible=false" @submit="afterEditSubmit"></xm-menu-template-edit>
			</el-dialog>
	
			<!--新增 XmMenuTemplate xm_project_menu界面-->
			<el-dialog title="新增故事" :visible.sync="addFormVisible"  width="50%"  append-to-body   :close-on-click-modal="false">
				<xm-menu-template-add  :product="filters.product"   :parent-menu="parentMenu"  :xm-menu="addForm" :visible="addFormVisible" @cancel="addFormVisible=false" @submit="afterAddSubmit"></xm-menu-template-add>
			</el-dialog> 
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	//import Sticky from '@/components/Sticky' // 粘性header组件
	//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { listXmMenuTemplate, delXmMenuTemplate, batchDelXmMenuTemplate,batchEditXmMenuTemplate } from '@/api/xm/core/xmMenuTemplate';
	import  XmMenuTemplateAdd from './XmMenuTemplateAdd';//新增界面
	import  XmMenuTemplateEdit from './XmMenuTemplateEdit';//修改界面
	import  XmProductTemplateMng from '../xmProductTemplate/XmProductTemplateMng';//新增界面

	import { mapGetters } from 'vuex'
	
	export default { 
		props:['isSelectMenu'],
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
			]),
			
      xmMenuTemplatesTreeData() {
        let xmMenuTemplates = JSON.parse(JSON.stringify(this.xmMenuTemplates || []));
        if (this.valueChangeRows && this.valueChangeRows.length) {
          this.valueChangeRows.forEach(c => {
            var index = xmMenuTemplates.findIndex(i=>i.menuId==c.menuId);
            const oldRow = JSON.parse(JSON.stringify(xmMenuTemplates[index]));
            console.log('computed.oldRow==', oldRow);
            
            xmMenuTemplates.splice(index,1);
            c.pmenuId = oldRow.pmenuId;

            xmMenuTemplates.push(c);
          })
        }
        
        const xmMenuTemplatesTreeData = this.translateDataToTree(xmMenuTemplates);
        if (this.batchEditVisible) {
          this.rowDrop();
        }
        
				 return xmMenuTemplatesTreeData;
			},
		},
		watch:{ 
		},
		data() {
			return {
				filters: {
					key: '',
					product:null,
				},
				xmMenuTemplates: [],//查询结果
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
				options:{},//下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				
				addFormVisible: false,//新增xmMenuTemplate界面是否显示
				//新增xmMenuTemplate界面初始化数据
				addForm: {
						menuId:'',menuName:'',pmenuId:'',productId:'',remark:'',status:'',online:'',demandUrl:'',codeUrl:'',designUrl:'',docUrl:'',helpUrl:'',operDocUrl:''
				},
				
				editFormVisible: false,//编辑界面是否显示
				//编辑xmMenuTemplate界面初始化数据
				editForm: {
						menuId:'',menuName:'',pmenuId:'',productId:'',remark:'',status:'',online:'',demandUrl:'',codeUrl:'',designUrl:'',docUrl:'',helpUrl:'',operDocUrl:''
				},
				parentMenu:null,
				
				batchEditVisible:false,
				valueChangeRows:[],
				/**begin 自定义属性请在下面加 请加备注**/
					
				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data
		methods: { 
			handleSizeChange(pageSize) { 
				this.pageInfo.pageSize=pageSize; 
				this.getXmMenuTemplates();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getXmMenuTemplates();
			},
			// 表格排序 obj.order=ascending/descending,需转化为 asc/desc ; obj.prop=表格中的排序字段,字段驼峰命名
			sortChange( obj ){
				var dir='asc';
				if(obj.order=='ascending'){
					dir='asc'
				}else{
					dir='desc';
				}
				if(obj.prop=='xxx'){
					this.pageInfo.orderFields=['xxx'];
					this.pageInfo.orderDirs=[dir];
				}
				this.getXmMenuTemplates();
			},
			searchXmMenuTemplates(){
				 this.pageInfo.count=true; 
				 this.getXmMenuTemplates();
			},
			//获取列表 XmMenuTemplate xm_project_menu
			getXmMenuTemplates() {
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
				if( this.filters.product!==null && this.filters.product.id!=''){
					params.productId=this.filters.product.id
				}else {
					this.$message({ message: "请先选择产品", type: 'error' });
					return;
					//params.xxx=xxxxx
				} 
				
				
				this.load.list = true;
				listXmMenuTemplate(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
						this.xmMenuTemplates = res.data.data;
					}else{
						this.$message({ message: tips.msg, type: 'error' });
					} 
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},

			//显示编辑界面 XmMenuTemplate xm_project_menu
			showEdit: function ( row,index ) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面 XmMenuTemplate xm_project_menu
			showAdd: function () {
				if(this.filters.product==null){
					this.$message({ message: "请先选择产品", type: 'error' });
					return;
				}
				this.addFormVisible = true;
				//this.addForm=Object.assign({}, this.editForm);
			},
			showSubAdd:function(row){
				this.editForm=row
				this.parentMenu=row
				this.addFormVisible=true
			},
			showProdcutAdd:function(){
				this.$refs.xmProductTemplateMng.showAdd();
			},
			afterAddSubmit(){
				this.addFormVisible=false;
				this.pageInfo.count=true;
				this.parentMenu=null;
				this.getXmMenuTemplates();
			},
			afterEditSubmit(){
				this.editFormVisible=false;
			},
			//选择行xmMenuTemplate
			selsChange: function (sels) {
				this.sels = sels;
			}, 
			onProductSelected:function(product){
				this.filters.product=product
				this.getXmMenuTemplates()
			},
			//删除xmMenuTemplate
			handleDel: function (row,index) { 
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					let params = { menuId: row.menuId };
					delXmMenuTemplate(params).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if(tips.isOk){ 
							this.pageInfo.count=true;
							this.getXmMenuTemplates();
						}
						this.$message({ message: tips.msg, type: tips.isOk?'success':'error' }); 
					}).catch( err  => this.load.del=false );
				});
			},
			//批量删除xmMenuTemplate
			batchDel: function () {
				
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					batchDelXmMenuTemplate(this.sels).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if( tips.isOk ){ 
							this.pageInfo.count=true;
							this.getXmMenuTemplates(); 
						}
						this.$message({ message: tips.msg, type: tips.isOk?'success':'error'});
					}).catch( err  => this.load.del=false );
				});
			},
			rowClick: function(row, event, column){
				this.$emit('row-click',row, event, column);//  @row-click="rowClick"
			},
			
			/**begin 自定义函数请在下面加**/
			translateDataToTree(data2) { 
				var data=JSON.parse(JSON.stringify(data2));
				let parents = data.filter(value =>{
					//如果我的上级为空，则我是最上级 
					if(value.pmenuId == 'undefined' || value.pmenuId == null  || value.pmenuId == ''){
						return true;

						//如果我的上级不在列表中，我作为最上级
					}else if(data.some(i=>value.pmenuId==i.menuId)){
						return false;
					}else {
						return true
					}
				 
				}) 
				let children = data.filter(value =>{
					if(data.some(i=>value.pmenuId==i.menuId)){
						return true;
					}else{
						return false;
					} 
				})  
				let translator = (parents, children) => {
					parents.forEach((parent) => {
						children.forEach((current, index) => {
							if (current.pmenuId === parent.menuId) {
								let temp = JSON.parse(JSON.stringify(children))
								temp.splice(index, 1)
								translator([current], temp)
								typeof parent.children !== 'undefined' ? parent.children.push(current) : parent.children = [current]
							}
						}
						)
					}
					)
				}

				translator(parents, children)

				return parents
			},	
			/**begin 自定义函数请在下面加**/
			selectedMenu:function(row){
				this.$emit("selected",row)
			},
			selectedMenusConfirm:function(){
				if(this.sels.length==0){
					this.$message.error("请选择故事");
					return;
				}
				this.$emit("selected-menus",this.sels)
			},
			toBatchEdit(){
				this.valueChangeRows=[];
				this.batchEditVisible=true;

			},
			noBatchEdit(){
				this.batchEditVisible=false;
				this.valueChangeRows=[];
			},
			batchSaveMenu(){
				if(this.valueChangeRows.length==0){
					this.$message.success("没有数据被修改");
					return
				}
				batchEditXmMenuTemplate(this.valueChangeRows).then(res=>{
					var tips=res.data.tips;
					if(tips.isOk){
						this.valueChangeRows=[]
						this.getXmMenuTemplates()
					}
					this.$message({ message: tips.msg, type: tips.isOk?'success':'error'});
				});
			},
			fieldChange:function(row,fieldName, nextReplace){
        if(nextReplace){
					row.nextReplace=nextReplace
        }
        var index=this.valueChangeRows.findIndex(i=>i.menuId==row.menuId);
        // this.valueChangeRows.some(i=>i.menuId==row.menuId)
				if(index < 0){
          this.valueChangeRows.push(row)
				}else{
					var oneRow=this.valueChangeRows.find(i=>i.menuId==row.menuId);
					if( oneRow  ){
						if(oneRow.nextReplace){ 
							var index=this.valueChangeRows.findIndex(i=>i.menuId==row.menuId);
							this.valueChangeRows.splice(index,1);
							this.valueChangeRows.push(row)
						}else{
							return;
						}
					}else{
						this.valueChangeRows.push(row)
					}
				} 
      },
      // 行拖拽
      rowDrop() {
        const _this = this
        // 被拖动的元素的索引
        let dragged = null;
        // 被拖动的元素的索引
        let draggedIndex = -1;

        // 目标元素
        let target = document.querySelector('.drag-table .el-table__body-wrapper .el-table__body tbody');

        let rows = 0;//行数
        setTimeout(function () {
          rows = target.childElementCount
          for (let i = 0; i < target.childElementCount; i++) {
            const child = target.children[i]
            child.draggable = true
            // child.style.cursor = 'copy'
            child.ondragstart = function(e){
              console.log('开始--ondragstart--e==', e);
              
              dragged = e.path[0]
              draggedIndex = e.path[0].rowIndex
              console.log('child'+i+'开始拖拽'+draggedIndex);
              _this.cellMouseIndex = -1
              dragged.style.cursor = 'grabbing'
            }
            child.ondragend = function(){
              console.log('child'+i+'拖拽结束');
            }
          }
        },0)

        // 被拖动的元素正在那个容器里
        let dragIndex = -1

        target.ondragenter = function(e){
          clearTimeout(loop)

          // 由于被拖动的元素 经过tbody中的每一元素都会触发该事件, 但是我们只需要它正在那一行上就行了
          if(e.path[0].nodeName === 'TD'){
            // throughRow 表示被拖动的元素正在哪一行上
            const throughRow = e.path.find(path => {
              if(path.className.split(' ').includes('el-table__row')){
                return path
              }
            })
            if(dragIndex !== throughRow.rowIndex){
              if(dragIndex > -1){
                // 清除上次进入的容器的状态
                const last = target.children[dragIndex];
                clearClass(last)
              }
              // console.log('拖动进入目标元素'+selectRow.rowIndex);
              // 不是自己或未文件夹时才改变状态
              if(draggedIndex !== throughRow.rowIndex ){
                // 改变本次进入的容器的状态
                dragged.style.cursor = 'copy'
                throughRow.style.height = 60+'px'
                throughRow.style.backgroundColor = '#e9fdcf'
              }
              dragIndex = throughRow.rowIndex
            }
          }
          leaveIndex = -1
        }
        target.ondragover = function(e){
          // console.log('目标元素中拖拽...');
          e.preventDefault();
          leaveIndex = -1
        }

        let loop = null
        let leaveIndex = -1 // 是否拖出了整个table, -1表示还在table内

        target.ondragleave = function(e){
          console.log('ondragleave--e==', e);

          clearTimeout(loop)

          if(e.path[0].nodeName){
            const throughRow = e.path.find(path => {
              if(path.className.split(' ').includes('el-table__row')){
                return path;
              }
            })
            if(throughRow && dragIndex !== throughRow.rowIndex){
              // console.log('拖动离开目标元素'+selectRow.rowIndex);
              // selectRow.style.height = 'unset'
              // selectRow.style.backgroundColor = '#fff'
              // dragIndex = selectRow.rowIndex
            }
            if(throughRow.rowIndex === 0 || throughRow.rowIndex === rows-1){
              // 离开第一行或最后一行
              leaveIndex = throughRow.rowIndex
              loop = setTimeout(function () {
                if(leaveIndex > -1){
                  console.log("离开了",leaveIndex)
                  const leave = target.children[leaveIndex];
                  clearClass(leave)
                  dragIndex = -1
                }
              },100)
            }``
          }
        }
        target.ondrop = function(){
          console.log('ondrop--放下了'+draggedIndex);
          // 清除上次进入的容器的状态
          const last = target.children[dragIndex];
          clearClass(last)
          dragged.style.cursor = 'default'

          console.log('ondrop--draggedIndex==', draggedIndex);
          console.log('ondrop--dragIndex==', dragIndex);

          const startId = _this.$refs['menu_'+draggedIndex].dataset.menuId;;
          const endId = _this.$refs['menu_'+dragIndex].dataset.menuId;

          if (startId !== endId) {
            _this.changePmenuId(startId, endId)
          }
        }

        let clearClass = function (node) {
          if(node){
            node.style.height = 'unset'
            node.style.backgroundColor = '#fff'
          }
          dragged.style.cursor = 'grabbing'
        }
        // if(last && form.menuId !== to.menuId && to.isFolder){
        //   // 移动文件/文件夹
        //   _this.copyOrMoveApi('move', form.menuId, to.menuId)
        // }
      },
      // 判断前后两个数据是否存在同一回路里面
      // dict 为字典；sId拖拽到menuId; ePmeuId 是放置位置的祖先 menuId;
      judgePmenuId(dict, sId, ePmeuId) {
        if (sId === ePmeuId) {
          return true;
        } else if (dict[ePmeuId]) {
          return this.judgePmenuId(dict, sId, dict[ePmeuId]);
        } else {
          return false;
        }
      },
      changePmenuId(sId, eId) {
        let dict = {};
        this.xmMenuTemplates.forEach(d => {
          dict[d.menuId] = d.pmenuId || '';
        });
        if (!dict[eId]) {
          this.xmMenuTemplates.find(d => {
            if (d.menuId === sId) {
              d.pmenuId = eId;
              console.log('更新关系1');
              this.fieldChange(d,'pmenuId',true);
            }
          })
        } else {
          const isSynezesis = this.judgePmenuId(dict, sId, dict[eId]);
          if (!isSynezesis) {
            this.xmMenuTemplates.find(d => {
              if (d.menuId === sId) {
                d.pmenuId = eId;
                console.log('更新关系2');
                this.fieldChange(d,'pmenuId',true);
              }
            })
          } else {
            console.log('形成闭合回路--拖拽不更新');
            
          }
        }
      }, 
      handlePopover:function(row,opType){
				if ('highestPmenuId' === opType) {  
					if (row.pmenuId) {
						this.xmMenuTemplates.find(d => {
							
							if (d.menuId === row.menuId) { 
								d.pmenuId = '';
								this.fieldChange(d,'seqNo', true); 
							}
						});
					}
				}
			},
				
			/**end 自定义函数请在上面加**/
			
		},//end methods
		components: { 
		    'xm-menu-template-add':XmMenuTemplateAdd,
			'xm-menu-template-edit':XmMenuTemplateEdit,
			XmProductTemplateMng,
		    
		    //在下面添加其它组件
		},
		mounted() { 
			this.$nextTick(() => {
				this.getXmMenuTemplates();
          }); 
      // 阻止默认行为
      document.body.ondrop = function (event) {
        event.preventDefault();
        event.stopPropagation();
      };
      this.rowDrop();
		}
	}

</script>

<style lang="scss" scoped>
 .el-table{ 
	 box-sizing: border-box; 
	/deep/ .cell {
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
    word-break: break-all;
    line-height: 23px;
    padding-right: 10px;
	display: flex;
	 }
}
</style>