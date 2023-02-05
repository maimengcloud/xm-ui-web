<template>
<section>
    <el-row  class="padding-left padding-right">
        <el-col :span="6">
            <comps-set  :category="category" @row-click="onCompSelect" ref="compsSet" :show-checked-only="isRptShow||showCheckedOnly" @sort="onSort"></comps-set>
        </el-col>
        <el-col :span="18"> 
            <el-row  class="padding">
                <span class="rpt-name" v-if="xmRptData && xmRptData.id">{{  xmRptData.rptName}}</span>
                <span class="rpt-name" v-else-if="xmRptConfig && xmRptConfig.id">{{  xmRptConfig.name}}</span>
                <span class="rpt-name" v-else>{{  rptConfigParamsCpd.name+'-报告'}}</span> 
                <span style="float:right;">
                    <el-button type="text" v-if="isRptShow==true && isRptCfg==false" @click="toQueryRptData" icon="el-icon-time">查看历史报告</el-button>  
                    <el-button type="primary" v-if="isRptShow==true && isRptCfg==false && (!xmRptData||!xmRptData.id)" @click="showCreateRptData()" icon="el-icon-time">保存报告(可供历史查询)</el-button>  
                    <el-button type="text" v-if="isRptShow==false && isRptCfg==false" @click="isRptShow=true" icon="el-icon-time">查看报告</el-button>  
                    <el-button type="warning" v-if="isRptShow==true" @click="undoRptShow" icon="el-icon-error">退出报告</el-button>  
                    <el-button type="text" v-if="isRptCfg==false&&isRptShow==false" @click="toRptCfg" icon="el-icon-setting">制作报告</el-button>  
                    <el-button type="primary" v-if="isRptCfg==true" @click="undoRptCfg" icon="el-icon-error">取消制作</el-button> 
                    <el-button type="warning" v-if="isRptCfg==true" @click="toSaveRptCfg">保存报告</el-button>  
                    <el-button type="text" v-if="paramsVisible==true" @click="paramsVisible=false">隐藏过滤条件</el-button>  
                    <el-button type="text" v-if="paramsVisible==false" @click="paramsVisible=true">显示过滤条件</el-button> 
                    <el-button type="text" v-if="isRptShow==true && isRptCfg==false && xmRptData && xmRptData.id" @click="toShareRpt" icon="el-icon-share">分享</el-button>  
                    <el-button type="text" v-print="{id:'printBody',popTitle:xmRptData && xmRptData.id?xmRptData.rptName:(xmRptConfig&&xmRptConfig.id?xmRptConfig.name: rptConfigParamsCpd.name+'-报告')}" icon="el-icon-printer"></el-button>
                    <el-button type="text" @click="exportToPdf">pdf</el-button> 
                </span> 
            </el-row>
            <el-row :style="{height:maxTableHeight+'px',overflowY:'auto',overflowX:'hidden',}" ref="table">
                <div class="empty" v-if="compCfgList.length == 0" >
                    <el-empty description="暂未选择报表，请至少选择一个报表"></el-empty>
                </div>
                <div v-else id="printBody" ref="rptBox"> 
                    <component style="margin-bottom:80px;" v-for="(item,index) in compCfgList" :key="item.compId" :is="item.compId" :xm-test-plan="xmTestPlan" :xm-product="xmProduct" :xm-project="xmProject" :xm-iteration="xmIteration" :xm-test-casedb="xmTestCasedb" :category="category" :cfg="item.cfg" :ref="item.id" @delete="doDelete(item)" :init-group-by="item.initGroupBy" :show-tool-bar="false" :id="item.id" :rpt-datas="item.rawDatas" :is-rpt-cfg="isRptCfg" :show-params="paramsVisible"></component>
                         
                </div>
            </el-row>
        </el-col> 
    </el-row>   
    <el-dialog append-to-body modal-append-to-body :visible.sync="rptDataSelectVisible" top="20px" width="60%">
        <rpt-data-select :xm-rpt-config="xmRptConfig" v-if="rptDataSelectVisible" @select="onRptDataSelect"/>
    </el-dialog> 
    
    <el-dialog title="请确认" append-to-body modal-append-to-body :visible.sync="createRptConfigVisible">
        <el-form :model="xmRptConfig">
            <el-form-item label="报告名称">
                <el-input v-model="xmRptConfig.name"></el-input>
            </el-form-item>
        </el-form> 
        <div slot="footer" class="dialog-footer">
            <el-button @click="createRptConfigVisible = false">取 消</el-button>
            <el-button type="primary" @click="finishRptCfg">确 定</el-button>
        </div>
    </el-dialog> 
    
    <el-dialog title="请确认" append-to-body modal-append-to-body :visible.sync="createRptDataVisible">
        <el-form :model="xmRptData">
            <el-form-item label="报告名称">
                <el-input v-model="xmRptData.rptName"></el-input>
            </el-form-item>
        </el-form> 
        <div slot="footer" class="dialog-footer">
            <el-button @click="createRptDataVisible = false">取 消</el-button>
            <el-button type="primary" @click="createRptData">确 定</el-button>
        </div>
    </el-dialog> 
    </section>
</template>

<script>  
 
import util from '@/common/js/util';//全局公共库 
import seq from '@/common/js/sequence';//全局公共库
import VueGridLayout from 'vue-grid-layout';
import { mapGetters } from 'vuex' 
import CompsSet from '@/views/xm/rpt/index/CompsSet'  
import rptDataSelect from '@/views/xm/rpt/his/rptDataSelect'  
import { addXmRptData  } from '@/api/xm/core/xmRptData'; 

import {  listXmRptConfig,editXmRptConfig,addXmRptConfig } from '@/api/xm/core/xmRptConfig';
 
import rptComps from './comps.js';//组件库 

export default {
    components: { 
        GridLayout: VueGridLayout.GridLayout,
        GridItem: VueGridLayout.GridItem, 
        CompsSet,  rptDataSelect,
        ...rptComps
        
    },
    props:['xmTestCasedb','xmTestPlan','xmProduct','xmProject','xmIteration','category','showParams','showCheckedOnly'],
    computed: {
        ...mapGetters(['userInfo']), 
        rptConfigParamsCpd(){
            //业务类型1-产品报告，2-迭代报告，3-测试计划报告，4-项目报告，5-企业报告 
			var params={bizType:'5',bizId:this.userInfo.branchId,name:this.userInfo.branchName}
             if(this.category=='企业级'){
                params.bizType='5';
                params.bizId=this.userInfo.branchId
                params.name=this.userInfo.branchName
             }else if(this.category=='产品级'){
                params.bizType='1';
                params.bizId=this.xmProduct.id
                params.name=this.xmProduct.productName
             }else  if(this.category=='迭代级'){
                params.bizType='2';
                params.bizId=this.xmIteration.id
                params.name=this.xmIteration.iterationName
             }else if(this.category=='项目级'){
                params.bizType='4';
                params.bizId=this.xmProject.id
                params.name=this.xmProject.name
             }else if(this.category=='测试库级'){
                    params.bizType='6';
                    params.bizId=this.xmTestCasedb.id
                    params.name=this.xmTestCasedb.name
             }else if(this.category=='测试计划级'){ 
                    params.bizType='3';
                    params.bizId=this.xmTestPlan.id
                    params.name=this.xmTestPlan.name
                 
             }
             return params;
        },
        toLoadXmRptConfigCpd(){
            return this.isRptCfg || this.isRptShow
        }
        
    },

    watch: {
        xmRptConfig:{
            handler(){
                this.initCompCfgList();
            },
            deep:true,
        },
        toLoadXmRptConfigCpd(){ 
            this.getXmRptConfig();
            this.$nextTick(()=>{
                this.compCfgList.forEach(k=>{
                    this.sizeAutoChange(k);
                })
            }) 
        }, 
        rptConfigParamsCpd(){
            if(this.isRptCfg ||this.isRptShow){
                this.getXmRptConfig()
            }
        }
    },

    data() {
        return {
            isRptCfg:false,
            isRptShow:false,
            xmRptConfig:{id:'',name:'',bizType:'',bizId:'',cfg:[]},
            xmRptData:{id:'',rptName:'',bizId:'',bizType:'',bizDate:'',rptData:[]},
            xmRptDataInit:{id:'',rptName:'',bizId:'',bizType:'',bizDate:'',rptData:[]},
            compCfgList:[], 
            maxTableHeight:300, 
            // 布局列数
            layoutColNum: 12,  
            paramsVisible:true,
            rptDataSelectVisible:false,
            createRptDataVisible:false,
            createRptConfigVisible:false,
        }
    },

    methods: {  
        initData(){
            if(this.showParams!=undefined){
                this.paramsVisible=this.showParams
            } 
            if(!this.toLoadXmRptConfigCpd){
                this.initCompCfgList();
             }else{
                this.getXmRptConfig();
            }
           
        },
        toShareRpt(){
            if(!this.xmRptData||!this.xmRptData.id){
                this.$message.error("只能分享历史报告")
                return;
            }
             
            var curlDomain=window.location.protocol+"//"+window.location.host; //   返回https://mp.csdn.net
            var link=curlDomain+"/"+process.env.CONTEXT+"/"+process.env.VERSION+"/#/xm/rpt/his/detail?id="+this.xmRptData.id
            this.$copyText(link).then(e => {
                this.$notify({position:'bottom-left',showClose:true,message:"拷贝链接成功，您可以黏贴到任何地方",type:'success'})
            }); 
        },
        showCreateRptData(){
            if(!this.xmRptConfig|| !this.xmRptConfig.id){
                this.$message.error("还没制作报告，请先制作报告")
                return;
            }  
            this.xmRptData.rptName=this.xmRptConfig.name+"-"+util.getDate()
            this.createRptDataVisible=true
           
        },
        toSaveRptCfg(){
            this.createRptConfigVisible=true
            if(!this.xmRptConfig.name){
                this.xmRptConfig.name=this.rptConfigParamsCpd.name+"-报告"
            }

        },
        toQueryRptData(){
            this.rptDataSelectVisible=true;
        },
        createRptData(){
            if(!this.xmRptConfig|| !this.xmRptConfig.id){
                this.$message.error("还没制作报告，请先制作报告")
                return;
            }  
            if(!this.xmRptData.rptName){
                this.$message.error("请输入报告名称")
                return;
            }
            var xmRptData={rptName:this.xmRptData.rptName,bizType:this.xmRptConfig.bizType,bizId:this.xmRptConfig.bizId,cfgId:this.xmRptConfig.id,rptData:[]}   
            this.compCfgList.forEach(k=>{
                if(this.$refs[k.id] && this.$refs[k.id][0].$refs && this.$refs[k.id][0].$refs[k.id]){ 
                    var com=this.$refs[k.id][0].$refs[k.id]
                    var comData={compId:k.compId,params:com.params,title:com.title,remark:com.remark,rawDatas:com.rawDatas} 
                    xmRptData.rptData.push(comData)
                }else{ 
                    var com=this.$refs[k.id][0]
                    var comData={compId:k.compId,params:com.params,title:com.title,remark:com.remark,rawDatas:com.rawDatas} 
                    xmRptData.rptData.push(comData)
                }
            })
            xmRptData.rptData=JSON.stringify(xmRptData.rptData)
            addXmRptData(xmRptData).then(res=>{  
                var tips = res.data.tips
                if(tips.isOk){
                    this.$message.success("报告保存成功") 
                    this.createRptDataVisible=false
                }else{
                    this.$message.error(tips.msg)
                }
            }) 
        },
        undoRptCfg(){
            this.xmRptConfig={};
            this.isRptCfg=false;
        },
        undoRptShow(){
            this.isRptShow=false;
            this.xmRptConfig={};
            this.xmRptData={...this.xmRptDataInit};
        },
        toRptCfg(){
            this.isRptCfg=true;
            this.$message.success("切换到报告制作模式成功。请选择报表加入报告中。")
        },
        finishRptCfg(){
            
            this.submitXmPrtConfig((res)=>{
                var tips = res.data.tips;
                if(tips.isOk){
                    this.isRptCfg=false
                    this.xmRptConfig={};
                    this.createRptConfigVisible=false;
                    this.$message.success("报告保存成功。将退出报告制作模式")
                }else{
                   
                    this.$message.error(tips.msg)
                } 
            });
        },
        getXmRptConfig(){   
            if(!this.toLoadXmRptConfigCpd){
                return;
            }
            if(this.rptDatas){
					this.rawDatas=this.rptDatas
					return;
				}
				
				var params={bizType:this.rptConfigParamsCpd.bizType,bizId:this.rptConfigParamsCpd.bizId}
            listXmRptConfig(params).then(res=>{
                if(!res.data.tips.isOk){
                    this.$message.error(res.data.tips.msg)
                    return ;
                }
                if(!res.data.data || res.data.data.length==0 ){
                    this.xmRptConfig={}
                }else{
                    this.xmRptConfig=res.data.data[0] 
                }
                
            })
        },
        initCompCfgList(){
            if(this.xmRptConfig && this.xmRptConfig.id && this.xmRptConfig.cfg){
                var cfgJson=JSON.parse(this.xmRptConfig.cfg) 
                cfgJson.forEach(k=>k.id=k.compId+seq.sn())
                this.compCfgList=cfgJson; 
                this.$refs.compsSet.setCheckeds(this.compCfgList.map(k=>k.compId),true)
            }else{ 
                var defList=this.$refs['compsSet'].rptListCpd
                if(defList && defList.length>3){
                    defList=defList.slice(0,3);
                } 
                defList.forEach(k=>k.id=k.compId+seq.sn())
                this.compCfgList=JSON.parse(JSON.stringify(defList))   
                this.$refs.compsSet.setCheckeds(this.compCfgList.map(k=>k.compId),true)
            }
        },
        onCompSelect(comp){   
            if(this.compCfgList.some(k=>k.compId==comp.compId)){ 
                var compCfg=this.compCfgList.find(k=>k.compId==comp.compId)
                this.$nextTick(()=>{
                    this.scrollToComp(compCfg)   
                }) 
                 return;
            }
            var compCfgListTemp=JSON.parse(JSON.stringify(this.compCfgList))
            compCfgListTemp.sort((i1,i2)=>{
                return i2.i-i1.i
            })
            var maxI=(compCfgListTemp.length>0?(compCfgListTemp[0].i+1):1);
            compCfgListTemp.sort((i1,i2)=>{
                return i2.y-i1.y
            })
            var maxY=(compCfgListTemp.length>0?(compCfgListTemp[0].y+6):0);
            var compCfg={...comp,i:maxI, x: 0,  y: maxY,  w: 12, h: 6,id:comp.compId+seq.sn()} 
            this.compCfgList.push(compCfg) 
            this.$nextTick(()=>{ 
                setTimeout(()=>{
                    this.scrollToComp(compCfg) 
                },200)
            })
           
        },
        scrollToComp(compCfg){    
            var doc=document.getElementById(compCfg.id)
            if(doc){
                doc.scrollIntoView(true)
            }  
        },
        submitXmPrtConfig(callback){ 
            if(!this.xmRptConfig||!this.xmRptConfig.name){
                this.$message.error("请输入报告名称")
                return 
            }
            if(!this.xmRptConfig.id){
                var xmRptConfig={...this.rptConfigParamsCpd,name:this.xmRptConfig.name,cfg:[]}  
                this.compCfgList.forEach(k=>{
                    if(this.$refs[k.id] && this.$refs[k.id][0].$refs && this.$refs[k.id][0].$refs[k.id]){ 
                        var com=this.$refs[k.id][0].$refs[k.id]
                        var comData={compId:k.compId,params:com.params,title:com.title,remark:com.remark} 
                        xmRptConfig.cfg.push(comData)
                    }else{ 
                        var com=this.$refs[k.id][0]
                        var comData={compId:k.compId,params:com.params,title:com.title,remark:com.remark} 
                        xmRptConfig.cfg.push(comData)
                    }
                   
                })
                xmRptConfig.cfg=JSON.stringify(xmRptConfig.cfg)
                
                addXmRptConfig(xmRptConfig).then(res=>{
                    this.xmRptConfig=xmRptConfig;
                    callback(res)
                })
            }else{
                var xmRptConfig={...this.xmRptConfig,cfg:[]} 
                this.compCfgList.forEach(k=>{
                    if(this.$refs[k.id] && this.$refs[k.id][0].$refs && this.$refs[k.id][0].$refs[k.id]){ 
                        var com=this.$refs[k.id][0].$refs[k.id]
                        var comData={compId:k.compId,params:com.params,title:com.title,remark:com.remark} 
                        xmRptConfig.cfg.push(comData)
                    }else{ 
                         var com=this.$refs[k.id][0]
                        var comData={compId:k.compId,params:com.params,title:com.title,remark:com.remark} 
                        xmRptConfig.cfg.push(comData)
                    }
                })
                xmRptConfig.cfg=JSON.stringify(xmRptConfig.cfg)
                editXmRptConfig(xmRptConfig).then(res=>{
                    this.xmRptConfig=xmRptConfig; 
                    callback(res)
                })
            }
        },
        doDelete(compCfg){ 
            var index=this.compCfgList.findIndex(k=>k.id==compCfg.id) 
            if(index>=0){ 
                this.compCfgList.splice(index,1)   
            } 
            this.$refs.compsSet.setChecked(compCfg.compId,false)
        },
        sizeAutoChange(k){ 
             
            
        },
        onRptDataSelect(rptData){
            this.xmRptData=rptData
            this.rptDataSelectVisible=false;
            if(this.xmRptData && this.xmRptData.id ){
                if( this.xmRptData.cfgId==this.xmRptConfig.id){
                    this.xmRptConfig.name=this.xmRptData.rptName
                    var cfgList=JSON.parse(this.xmRptData.rptData)
                    cfgList.forEach(k=>k.id=k.compId+seq.sn())
                    this.compCfgList=cfgList  
                    this.$refs.compsSet.setCheckeds(this.compCfgList.map(k=>k.compId),true)
                }
            }
        },
        exportToPdf(){
            this.paramsVisible=false
            this.$nextTick(()=>{
                this.$PDFSave(this.$refs.rptBox, this.rptConfigParamsCpd.name+"-报告");  
            })
            
        }, 
        onSort(evt,datas){ 
            datas.forEach((d,index)=>{
                var comp=this.compCfgList.find(k=>k.compId==d.compId)
                if(comp){
                    comp.index=index
                }
            })
            this.compCfgList.sort((i1,i2)=>{
                return i1.index-i2.index
            })
            var compCfg=this.compCfgList.find(k=>k.compId==datas[evt.newIndex].compId)
            this.$nextTick(()=>{ 
                setTimeout(()=>{
                    this.scrollToComp(compCfg) 
                },200)
            })
        }
         
    },

    mounted() {
        this.$nextTick(() => {
            this.initData();
            this.maxTableHeight = util.calcTableMaxHeight(this.$refs.table.$el)
        })
    },

}
</script>

<style lang="less" scoped>
.toolbar{
    z-index: 999;
    position:absolute;
    top:0px;
    right:20px;
}
.rpt-name{
    text-align: center;
    font-size: 18px;
    font-weight: 600;
}
</style> 
