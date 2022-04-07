<template>
  <section>
    <xm-task-workload-mng :wstatuses="['0','2']"  queryScope="all"></xm-task-workload-mng>
  </section>
</template>

<script>
import {mapGetters} from "vuex";
import XmTaskWorkloadMng from "./XmTaskWorkloadMng";

export default {
  computed: {
    ...mapGetters([
      'userInfo','roles'
    ]),
  },
  watch: {

  },
  data() {
    return {
      visible:true,
      /**end 自定义属性请在上面加 请加备注**/
    }
  },//end data
  methods: {

    /**end 自定义函数请在上面加**/

  },//end methods
  components: {
    XmTaskWorkloadMng,
  },
  mounted() {
    this.$nextTick(() => {

    });
  }


}
</script>

<style scoped>

</style>
