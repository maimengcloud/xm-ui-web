<template>
<el-row>
     <form-def-form :form-id="expandId" sub-op-type="edit" :visible="true"></form-def-form>
</el-row>
</template>

<script> 
import FormDefForm from './Form'
export default {
    name:'DesignRoute', 
    components: {
        FormDefForm
    },
    computed: {
    },
    props:{
    },
    watch: {
        $route(to){
            if(this.$route.params.expandId){
                this.$mdp.removeFormFieldsCache(this.$route.params.expandId) 
                this.expandId=this.$route.params.expandId
            }else{
                this.expandId=''
            }
        }
    },
    data() {
        return {
             expandId:'',
        }
    },
    methods: {
          
        
    },
    mounted() {
        if(this.$route.params.expandId){
            this.$mdp.removeFormFieldsCache(this.$route.params.expandId)
            this.expandId=this.$route.params.expandId
        }else{
            this.expandId=''
        }
    }
}

</script>

<style scoped>

</style>