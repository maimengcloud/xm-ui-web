<template>
	<section>
        <el-row>
            
        </el-row>
		<el-row>
            <xm-test-plan-case-mng  v-if="activeIndex=='testPlanCase'&& xmTestPlan && xmTestPlan.id" :xm-test-plan="xmTestPlan" :xm-test-casedb="xmTestCasedb"></xm-test-plan-case-mng>
            <xm-test-plan-mng v-else @select="onTestPlanSelect" :xm-test-casedb="xmTestCasedb"> </xm-test-plan-mng>
        </el-row>     
	</section>
</template>

<script>

import util from '@/common/js/util';//全局公共库
import config from '@/common/config';//全局公共库
  import  XmTestCaseMng from '../xmTestCase/XmTestCaseMng';//新增修改界面
import  XmTestPlanMng from '../xmTestPlan/XmTestPlanMng';//新增修改界面
import  XmTestPlanCaseMng from '../xmTestPlanCase/XmTestPlanCaseMng';//新增修改界面
import { mapGetters } from 'vuex'
import  XmProductSelect from '@/views/xm/core/components/XmProductSelect';//修改界面

export default {
    name:'xmTestCasedbMng',
    components: {
        XmProductSelect, XmTestPlanMng,XmTestPlanCaseMng
    },
    props:['visible','xmTestCasedb'],
    computed: {
        ...mapGetters(['userInfo']),

    },
    watch:{
        visible(val){
            if(val==true){ 
            }
        }
    },
    data() {
        return {
             
            activeIndex:'testPlan',
            xmTestPlan:null,
        }
    },//end data
    methods: {

        ...util,
        onTestPlanSelect(row){
            this.activeIndex='testPlanCase'
            this.xmTestPlan=row
        }
 
    },//end methods
    mounted() {
        this.$nextTick(() => {
            

        });
    }
}

</script>

<style lang="scss" scoped>
.center{
    align-items: center; /* 垂直居中 */
    justify-content: center; /* 水平居中 */
}
.el-menu{
    align-items: center; /* 垂直居中 */
    justify-content: center; /* 水平居中 */
}
</style>