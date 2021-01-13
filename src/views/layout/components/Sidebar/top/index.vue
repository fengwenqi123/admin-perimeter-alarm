<template>
  <SubMenu :menu-list="permission_routers" @getmenu="onGetMenu" />
</template>

<script>
import SubMenu from './SubMenu.vue'
import { mapGetters } from 'vuex'
export default {
  name: 'elegant',
  components: { SubMenu },
  computed: {
    ...mapGetters([
      'permission_routers'
    ])
  },
  methods: {
    onGetMenu (item) {
      this.$router.push({
        name: item.path
      })
    }
  }
}
</script>
