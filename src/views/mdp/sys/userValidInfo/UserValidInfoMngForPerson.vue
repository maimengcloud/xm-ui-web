<template>
	<section>
		 <user-valid-info-mng is-org="0"></user-valid-info-mng>
	</section>
</template>

<script>

import util from '@/components/mdp-ui/js/util';//全局公共库
import config from '@/api/mdp_pub/mdp_config';//全局公共库
 import  UserValidInfoMng from './Index';//新增修改界面
import { mapGetters } from 'vuex'

export default {
    name:'userValidInfoMngForPerson',
    components: {
        UserValidInfoMng,
    },
    props:['visible'],
    computed: {
        ...mapGetters(['userInfo']),

    },
    watch:{
        visible(val){
            if(val==true){
                this.initData(); 
            }
        }
    },
    data() {
        return { 
            load:{ list: false, edit: false, del: false, add: false },//查询中... 
            dicts:{
                //sex: [{id:'1',name:'男'},{id:'2',name:'女'}]
            },//下拉选择框的所有静态数据 params={categoryId:'all',itemCodes:['sex']} 返回结果 {sex: [{id:'1',name:'男'},{id:'2',name:'女'}]}  
        }
    },//end data
    methods: {

        ...util, 
        initData: function(){

        },

    },//end methods
    mounted() {
        this.$nextTick(() => { 

        });
    }
}

</script>

<style scoped>
</style>