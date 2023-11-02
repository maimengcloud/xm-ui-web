<template>
<el-row>
    <el-row>
    <!--新增/编辑界面 Attachment 档案附件表-->
        <el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editFormRef">
            <span v-if="currOpType=='add'">  
                
                <el-form-item label="指定文件名" prop="storeName">
                    <el-checkbox v-model="isFixedName" true-label="1" false-label="0">指定文件名,覆盖服务器上同名的文件</el-checkbox>  
                    <el-input v-if="isFixedName=='1'" show-style="origin" v-model="editForm.storeName" placeholder="文件名称，不带后缀名" :maxlength="100" />

                </el-form-item> 
                <el-form-item label="文件" prop="file">
                    <el-upload
                        class="upload-demo"
                        drag
                        :show-file-list="false"
                        :headers="headers"
                        :action="uploadAction" :on-change="fileChange" :on-success="handleSuccess" :before-upload="beforeupload" :data="uploadOptions" >
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div> 
                    </el-upload>
                </el-form-item>
            </span>
            <span v-if="currOpType!='add'">
                <el-form-item label="编号" prop="id">
                    <el-input show-style="origin" v-model="editForm.id" placeholder="编号" :maxlength="50" @change="editSomeFields(editForm,'id',$event)" :disabled="disabledJudge('id')"/>
                </el-form-item>
                <el-form-item label="附件名称" prop="name">
                    <el-checkbox v-model="isReUpload" true-label="1" false-label="0">重新上传(将覆盖原文件)</el-checkbox>  
                    <el-upload v-if="isReUpload=='1'"
                        class="upload-demo"
                        drag 
                        :show-file-list="false"
                        :headers="headers"
                        :action="uploadAction" :on-change="fileChange" :on-success="handleSuccess" :before-upload="beforeupload" :data="uploadOptions" >
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div> 
                    </el-upload>
                    <el-input v-else show-style="origin" v-model="editForm.name" placeholder="附件名称" :maxlength="100" @change="editSomeFields(editForm,'name',$event)" :disabled="disabledJudge('name')"/>
                </el-form-item>
                <el-form-item label="访问路径" prop="url">
                    <el-input show-style="origin" v-model="editForm.url" placeholder="访问路径" :maxlength="250" @change="editSomeFields(editForm,'url',$event)" :disabled="disabledJudge('url')"/>
                </el-form-item>
                <el-form-item label="硬盘存放路径" prop="relativePath">
                    <el-input show-style="origin" v-model="editForm.relativePath" placeholder="硬盘存放路径" :maxlength="1000" @change="editSomeFields(editForm,'relativePath',$event)" :disabled="disabledJudge('relativePath')"/>
                </el-form-item> 
                <el-form-item label="主题" prop="archiveType">
                    <mdp-select item-code="categoryType" show-style="origin" v-model="editForm.archiveType" placeholder="主题" :maxlength="1" @change="editSomeFields(editForm,'archiveType',$event)" :disabled="disabledJudge('archiveType')"/>
                </el-form-item>
                <el-form-item label="存储名字" prop="storeName">
                    <el-input show-style="origin" v-model="editForm.storeName" placeholder="存储名字" :maxlength="50" @change="editSomeFields(editForm,'storeName',$event)" :disabled="disabledJudge('storeName')"/>
                </el-form-item>
                <el-form-item label="文件大小" prop="fileSize">
                    <el-input show-style="origin" v-model="editForm.fileSize" placeholder="文件大小" :maxlength="8" :disabled="disabledJudge('fileSize')"/>
                </el-form-item>
                <el-form-item label="内容加速器访问路径" prop="cdnUrl">
                    <el-input show-style="origin" v-model="editForm.cdnUrl" placeholder="内容加速器访问路径" :maxlength="250" @change="editSomeFields(editForm,'cdnUrl',$event)" :disabled="disabledJudge('cdnUrl')"/>
                </el-form-item>
                <el-form-item label="是否图片" prop="isImg">
                    <el-checkbox v-model="editForm.isImg" true-label="1" false-label="0" @change="editSomeFields(editForm,'isImg',$event)" :disabled="disabledJudge('isImg')">是否图片</el-checkbox>

                </el-form-item>
                <el-form-item label="档案主编号" prop="archiveId">
                    <el-input show-style="origin" v-model="editForm.archiveId" placeholder="档案主编号" :maxlength="150" @change="editSomeFields(editForm,'archiveId',$event)" :disabled="disabledJudge('archiveId')"/>
                </el-form-item>
                <el-form-item label="是否使用CDN" prop="isCdn" v-show="editForm.isImg=='1'">
                    <el-checkbox  v-model="editForm.isCdn" true-label="1" false-label="0" @change="editSomeFields(editForm,'isCdn',$event)" :disabled="disabledJudge('isCdn')">是否使用CDN加速</el-checkbox>
                </el-form-item>
                <el-form-item label="根目录" prop="rootPath">
                    <el-input show-style="origin" v-model="editForm.rootPath" placeholder="根目录" :maxlength="250" @change="editSomeFields(editForm,'rootPath',$event)" :disabled="disabledJudge('rootPath')"/>
                </el-form-item>
                <el-form-item label="存入时间" prop="createDate">
                    <el-date-picker type="date" placeholder="选择日期" show-style="origin" v-model="editForm.createDate"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd" :disabled="disabledJudge('createDate')"></el-date-picker>
                </el-form-item>  
                <el-form-item label="他人权限" prop="canDown">
                    <el-checkbox v-model="editForm.canRead" true-label="1" false-label="0">可读</el-checkbox>
                    <el-checkbox v-model="editForm.canDown" true-label="1" false-label="0">可下载</el-checkbox> 
                    <el-checkbox v-model="editForm.canDel" true-label="1" false-label="0">可删</el-checkbox>  
                </el-form-item> 
                
                <el-form-item label="分类编号" prop="categoryId">
                    <el-input show-style="origin" v-model="editForm.categoryId" placeholder="分类编号" :maxlength="50" @change="editSomeFields(editForm,'categoryId',$event)" :disabled="disabledJudge('categoryId')"/>
                </el-form-item>
                <el-form-item label="业务编号等" prop="bizId">
                    <el-input show-style="origin" v-model="editForm.bizId" placeholder="业务编号、产品编号、商品编号等" :maxlength="150" @change="editSomeFields(editForm,'bizId',$event)" :disabled="disabledJudge('bizId')"/>
                </el-form-item>
                <el-form-item label="业务名称等" prop="remark">
                    <el-input show-style="origin" v-model="editForm.remark" placeholder="业务名称、产品名称、商品名称等" :maxlength="1000" @change="editSomeFields(editForm,'remark',$event)" :disabled="disabledJudge('remark')"/>
                </el-form-item>
                <el-form-item label="云用户机构编号" prop="branchId">
                    <el-input show-style="origin" v-model="editForm.branchId" placeholder="云用户机构编号" :maxlength="50" @change="editSomeFields(editForm,'branchId',$event)" :disabled="disabledJudge('branchId')"/>
                </el-form-item> 
                <el-form-item label="后缀名" prop="fileSuffix">
                    <el-input show-style="origin" v-model="editForm.fileSuffix" placeholder="后缀名" :maxlength="10" @change="editSomeFields(editForm,'fileSuffix',$event)" :disabled="disabledJudge('fileSuffix')"/>
                </el-form-item> 
                <el-form-item label="部门编号" prop="deptid">
                    <el-input show-style="origin" v-model="editForm.deptid" placeholder="部门编号" :maxlength="50" @change="editSomeFields(editForm,'deptid',$event)" :disabled="disabledJudge('deptid')"/>
                </el-form-item>
            </span>
        </el-form>
    </el-row>
    <slot name="footer" :page="this">
        <el-row v-if="showBtn!==false" style="float:right;" class="footer">
            <el-button @click.native="close">关闭</el-button>
        </el-row>
    </slot>
</el-row>
</template>

<script>
 import { mapGetters } from 'vuex'
import { MdpFormMixin } from '../../mdp-ui/mixin/MdpFormMixin.js'; 

export default {
    name:'attachmentForm',
    mixins:[MdpFormMixin],
    components: {
    },
    computed: {
    },
    props:{
        
		relyType:{
			type:String,
			default:''
		},
		relyId:{
			type:String,
			default:''
		},
		relyStype:{
			type:String,
			default:'',
		},
		relySid:{
			type:String,
			default:''
		} 
    },
    watch: {
    },
    data() {
        return {
            menuDefId:'',//menu_def.id 菜单表菜单编号，用于按钮权限判断
            pkNames:["id"],//表格主键的java属性名称，驼峰命名，默认为id,支持多主键
            currOpType:'add',//表单 add、edit，所有按钮可动、detail-只看不能操作
            editFormRules: {
                id:[
                //{ required: true, message: '此项必填', trigger: 'change' },
                //{ min: 1,max: 200, message: '长度在1到200之间', trigger: 'change'}
                ],
                storeName:[
                    {pattern:/^[a-zA-Z0-9]+$/,message:'只能是数字、英文组合',trigger:'change'}
                ]
            },
            editForm: {
                id:'',name:'',url:'',relativePath:'',fileSuffix:'',cdnUrl:'',isImg:'',archiveId:'',isCdn:'',rootPath:'',createDate:'',canDown:'',canDel:'',canRead:'',bizId:'',remark:'',storeName:'',fileSize:'',branchId:'',deptid:'',archiveType:'',categoryId:''
            },
            editable:false,
            //增删改查(含批量)接口
            apis:{
                queryById: this.$mdp.queryAttachmentById,
                add: this.$mdp.addAttachment,
                edit: this.$mdp.editAttachment,
                editSomeFields: this.$mdp.editSomeFieldsAttachment
            },
            isFixedName:'0',
            isReUpload:'0',//从新上传
            headers:this.$mdp.getArcUploadHeader(),
      	    uploadAction: this.$mdp.getArcAttUploadPath(),  
		    uploadOptions:{branchId:'',categoryId:'',archiveId:'',bizId:'',remark:'',deptid:'',storeName:'',id:''},//当前选择上传图片的类型
        }
    },
    methods: {
         //由组件扩展添加其它的初始页面的逻辑(mounted+onOpen都会调用此函数，建议只添加公共逻辑)
         initCurrData(){
            this.isFixedName="0"
            this.isReUpload="0"
             this.uploadOptions.categoryId=this.editForm.categoryId  
             this.uploadOptions.branchId=this.editForm.branchId 
             this.uploadOptions.deptid=this.editForm.deptid 
             this.uploadOptions.bizId=this.editForm.bizId 
             this.uploadOptions.archiveId=this.editForm.archiveId  
             this.uploadOptions.id=this.editForm.id  
             this.uploadOptions.remark=this.editForm.remark
             this.uploadOptions.storeName=this.editForm.storeName
             this.uploadOptions.archiveType=this.editForm.archiveType  
             if(this.relyType){
				this.uploadOptions.relyType=this.relyType
			}
			
			if(this.relyStype){
				this.uploadOptions.relyStype=this.relyStype
			}
			
			if(this.relyId){
				this.uploadOptions.relyId=this.relyId
			}
			
			if(this.relySid){
				this.uploadOptions.relySid=this.relySid
			}
             
         },
        /**
         * 检查参数是否满足调用后台接口的条件
         * @returns true / false
         */
        preParamCheck(params){
            return true;
        },

        /**
          * 设置某个关键词、按钮、输入框禁用 disabledRules['addBtn']=false
          * 判断某个对象是否可编辑 this.disabledJudge('addBtn')==false
          */
        disabledRulesInit(disabledRules){

        },
        /**
         * 对修改的字段进行判断，返回false ,将取消更新数据库,由组件扩展
         * @param {*} row 当前选中的行
         * @param {*} fieldName 修改的字段名
         * @param {*} $event 修改后的值
         * @param {*} params 将要提交服务器的参数
         * @returns true/false 返回false ,将取消更新数据库
         */
        editSomeFieldsCheck(row,fieldName,$event,params){
            params[fieldName]=$event
            return true;
        },
		handleSuccess(res,file) {
			//var jsonData = JSON.stringify(res, null, 4);
			var tips= res.tips;
			if(tips.isOk){
				this.$message({ message: '上传成功', type: 'success' });
				this.editForm=res.data
                this.currOpType='edit'
                this.initCurrData(); 
                this.afterSubmit(res,tips.isOk,this.currOpType);
			}else{ 
				this.$message({ message: tips.msg, type: 'error' }); 
			}
		
		  }, 
		  beforeupload(file){ 
			if(this.uploadOptions.categoryId=='' || this.uploadOptions.categoryId==null){
                this.$message({ message: "请选择分类", type: "warning" }); 
                return false;
                }
            if(this.currOpType=='add' && this.isFixedName=='1'){
                var form=this.$refs['editFormRef']; 
                form.validate((valid) => {
                    if(!valid){
                        this.$message({ message: "请输入正确的文件名", type: "warning" }); 
                        return false;
                    }else{
                        if(!this.editForm.storeName){
                            this.$message({ message: "请输入文件名", type: "warning" }); 
                            return false;
                        }
                        if(file.size>1024*2024*10){//20M
                            this.$message({ message: '为了良好的客户体验，文件必须小于20M', type: 'error' });
                            return false;
                        } 
                        this.uploadOptions.storeName=this.editForm.storeName
                        return true;
                    }
                })
               
            }else{
                if(file.size>1024*2024*10){//20M
                    this.$message({ message: '为了良好的客户体验，大于20M的文件需经过裁剪压缩处理', type: 'error' });
                    return false;
                } 
                this.uploadOptions.id=this.editForm.id
                return true;
            }
            
          },
		  fileChange(file, fileList) {
            var that = this;
            //this.imageUrl = URL.createObjectURL(file.raw);
            if(file.raw.size<=1024*1024){//1M
            //this.$message({ message: '小于1M的文件可直接上传图片库', type: 'success' });
            return true;
            } 
            return true;
        },
    },
    mounted() {

    }
}

</script>

<style scoped>

</style>