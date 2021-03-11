<template>
  <div class="app-wrapper" :class="classObj">
    <sidebar class="sidebar-container"></sidebar>
    <div class="main-container">
      <navbar></navbar>
      <div class="main">
        <div class="jc">
          <home></home>
        </div>
        <app-main></app-main>
        <div class="video">
          <videoList></videoList>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Navbar, AppMain, Sidebar } from './components'
import videoList from '@/views/videoList'
import home from '@/views/home'
export default {
  name: 'layout',
  components: {
    Navbar,
    AppMain,
    Sidebar,
    videoList,
    home
  },
  computed: {
    sidebar () {
      return this.$store.state.app.sidebar
    },
    device () {
      return this.$store.state.app.device
    },
    classObj () {
      return {
        hideSidebar: !this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  methods: {
    handleClickOutside () {
      this.$store.dispatch('CloseSideBar', { withoutAnimation: false })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/mixin.scss";

  .app-wrapper {
    background: rgba(24, 144, 255, 1);
    position: relative;
    height: 100%;
    width: 100%;
    display: flex;
    .sidebar-container{
      width: 180px;
    }
    .main-container{
      flex: 1;
    }
    .main{
      height: calc(100% - 68px);
      display: flex;
      .jc{
        //text-align: center;
        background: #ECF0F5;
        width: 1740px;
        height: 100%;
      }
      .video{
        background: #ECF0F5;
        width: 1920px;
      }
    }
  }
</style>
