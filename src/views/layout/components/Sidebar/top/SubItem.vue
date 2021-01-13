<template>
  <div>
    <template v-for="(val, key) in chil">
      <template v-if="!val.hidden">
        <el-submenu
          :index="val.path"
          :key="key"
          v-if="val.children && val.children.length > 0"
        >
          <template slot="title" v-if="val.meta">{{ val.meta.title }}</template>
          <sub-item v-if="val.children" :chil="val.children" @getSubItem="onSubTtemClick" />
        </el-submenu>

        <el-menu-item
          :index="val.path"
          v-else
          :key="key"
          @click="onSubTtemClick(val)"
        >{{val.meta.title }}</el-menu-item>
      </template>
    </template>
  </div>
</template>

<script>
export default {
  name: 'subItem',
  props: {
    chil: {
      type: Array,
      default () {
        return []
      }
    }
  },
  methods: {
    onSubTtemClick (item) {
      this.$emit('getSubItem', item)
    }
  }
}
</script>
