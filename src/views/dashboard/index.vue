<template>
  <div class="dashboard-container">
    <component :is="com"></component>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import adminDashboard from './admin'
import editorDashboard from './editor' 

export default {
  name: 'dashboard',
  components: { adminDashboard, editorDashboard },
  data() {
    return {
      currentRole: 'superAdmin',
      com:'adminDashboard'
    }
  },
  computed: {
    ...mapGetters([
      'roles'
    ])
  },
  created() {
    if (this.roles.some(role=>role.roleid=='superAdmin')) {
      this.currentRole = 'superAdmin'
      this.com='adminDashboard'
    }else{
    	this.currentRole = ''
    	this.com='editorDashboard'
    }
  }
}
</script>
