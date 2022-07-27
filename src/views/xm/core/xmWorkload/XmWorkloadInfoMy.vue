<template>
  <section>
    <xm-workload-info queryScope="my"></xm-workload-info>
  </section>
</template>

<script>
import {mapGetters} from "vuex";
import XmWorkloadInfo from "./XmWorkloadInfo";

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
    XmWorkloadInfo,
  },
  mounted() {
    this.$nextTick(() => {

    });
  }


}
</script>

<style scoped>

</style>

