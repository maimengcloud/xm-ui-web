<template>
  <section>
    <workload-set-day-list queryScope="my"></workload-set-day-list>
  </section>
</template>

<script>
import {mapGetters} from "vuex";
import WorkloadSetDayList from "./WorkloadSetDayList";

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
    WorkloadSetDayList,
  },
  mounted() {
    this.$nextTick(() => {

    });
  }


}
</script>

<style scoped>

</style>

