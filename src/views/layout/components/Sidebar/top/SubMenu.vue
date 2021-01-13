<template>
  <el-menu mode="horizontal" :default-active="$route.path" active-text-color="#09f">
    <template v-for="(val, key) in menuList">
      <template v-if="!val.hidden&&val.children">

        <el-menu-item
          v-if="hasOneShowingChild(val.children) && !val.alwaysShow &&!val.children[0].children"
          :index="val.children[0].path" @click="onMenuItemClick(val.children[0])" :key="key">
          <i :class="val.children[0].icon"></i>
          <span slot="title" v-if="val.children[0].meta">{{ val.children[0].meta.title }}</span>
        </el-menu-item>

        <el-submenu
          :index="val.path"
          v-else
          :key="key">
          <template slot="title">
            <i :class="val.icon"></i>
            <span v-if="val.meta">{{ val.meta.title }}</span>
          </template>
          <SubItem :chil="val.children" @getSubItem="onMenuItemClick"/>
        </el-submenu>
      </template>
    </template>
  </el-menu>
</template>

<script>
import SubItem from './SubItem'

export default {
  name: 'subMenu',
  components: { SubItem },
  props: {
    menuList: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      onlyOneChild: null
    }
  },
  methods: {
    onMenuItemClick (item) {
      this.$emit('getmenu', item)
    },
    hasOneShowingChild (children) {
      const showingChildren = children.filter(item => {
        if (item.hidden) {
          return false
        } else {
          // temp set(will be used if only has one showing child )
          this.onlyOneChild = item
          return true
        }
      })
      if (showingChildren.length === 1) {
        return true
      }
      return false
    }
  }
}
</script>
