<template>
<section>
    <el-row  class="padding-left padding-right">
        <el-col :span="6">
            <comps-set :category="category" @row-click="onCompSelect" ref="compsSet" :show-checked-only="true"></comps-set>
        </el-col>
        <el-col :span="18"> 
            <el-row  class="padding">
                <span class="rpt-name">{{ xmRptData && xmRptData.id?xmRptData.rptName: '未知报告'}}</span>
                <span style="float:right;" v-if=" xmRptData && xmRptData.id">
                    <el-button type="text" v-if="paramsVisible==true" @click="paramsVisible=false">隐藏过滤条件</el-button>  
                    <el-button type="text" v-if="paramsVisible==false" @click="paramsVisible=true">显示过滤条件</el-button> 
                    <el-button type="text"   @click="toShareRpt" icon="el-icon-share">分享</el-button>  
                    <el-button type="text"   v-print="{id:'printBody',popTitle: xmRptData.rptName }" icon="el-icon-printer"></el-button>
                    <el-button type="text"   @click="exportToPdf">pdf</el-button> 
                </span> 
            </el-row>
            <el-row :style="{height:maxTableHeight+'px',overflowY:'auto',overflowX:'hidden',}" ref="table">
                <div class="empty" v-if="compCfgList.length == 0" >
                    <el-empty description="暂未选择报表，请至少选择一个报表"></el-empty>
                </div>
                <div v-else id="printBody" ref="rptBox"> 
                    <component style="margin-bottom:80px;" v-for="(item,index) in compCfgList" :key="item.compId" :is="item.compId" :cfg="item" :init-group-by="item.initGroupBy" :show-tool-bar="false" :id="item.id" :rpt-datas="item.rawDatas" :is-rpt-cfg="false" :show-params="paramsVisible"></component>  
                </div>
            </el-row>
        </el-col> 
    </el-row>    
    </section>
</template>

<script>  
 
import util from '@/common/js/util';//全局公共库
import seq from '@/common/js/sequence';//全局公共库 
import { mapGetters } from 'vuex' 
import CompsSet from '@/views/xm/rpt/index/CompsSet'  
import rptComps from './comps.js';//组件库

 
export default {
    components: {  
        CompsSet,   
        ...rptComps
        
    },
    props:['showParams','xmRptData'],
    computed: {
        ...mapGetters(['userInfo']),  
        //业务类型1-产品报告，2-迭代报告，3-测试计划报告，4-项目报告，5-企业报告，6-测试库报告
        category(){
            if( !this.xmRptData || !this.xmRptData.id){
                return ''
            }
            if(this.xmRptData.bizType=='1'){
                return "产品级"
            }
            
            if(this.xmRptData.bizType=='2'){
                return "迭代级"
            }
            if(this.xmRptData.bizType=='3'){
                return "测试计划级"
            }
            if(this.xmRptData.bizType=='4'){
                return "项目级"
            }
            if(this.xmRptData.bizType=='5'){
                return "企业级"
            }
            if(this.xmRptData.bizType=='6'){
                return "测试库级"
            }
        }
        
    },

    watch: { 
    },

    data() {
        return { 
            compCfgList:[],
            maxTableHeight:300,   
            paramsVisible:true,
            rptDataListVisible:false,  
        }
    },

    methods: {  
        initData(){
            if(this.showParams!=undefined){
                this.paramsVisible=this.showParams
            } 
 
            this.initCompCfgList();
             
           
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
        toQueryRptData(){
            this.rptDataListVisible=true;
        },  
        initCompCfgList(){
            if(this.xmRptData && this.xmRptData.rptData){
                var cfgJson=JSON.parse(this.xmRptData.rptData) 
                cfgJson.forEach(k=>k.id=k.compId+seq.sn())
                this.compCfgList=cfgJson; 
                this.$refs.compsSet.setCheckeds(this.compCfgList.map(k=>k.compId),true)
            }else{
                this.compCfgList=[]
                this.$refs.compsSet.setCheckeds([],true)
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
            var allCheckedList=this.$refs.compsSet.datas.filter(k=>k.isChecked)
            var index=allCheckedList.findIndex(k=>k.compId==comp.compId)
            var compCfg={...comp,id:comp.compId+seq.sn()} 
            this.compCfgList.splice(index,0,compCfg)
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
         
        doDelete(compCfg){ 
             
        },
        sizeAutoChange(k){  
        }, 
        exportToPdf(){
            this.paramsVisible=false
            this.$nextTick(()=>{
                this.$PDFSave(this.$refs.rptBox, this.xmRptData.rptName);  
            })
            
        }, 
         
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
