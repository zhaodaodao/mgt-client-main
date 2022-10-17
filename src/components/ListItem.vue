<template>
  <a-list-item>
    <a-typography-link class="list-item">{{ item }}</a-typography-link>
  </a-list-item>
</template>

<script>
export default {
  props: {
    item: String,
  },
};
</script>

<style lang="less" scoped>
.item {
  color: #7f8385;
  font-size: 16px;
  line-height: 18px;
  font-weight: 400;
  font-style: normal;
  :hover {
    color: @primary-color;
  }
}
</style>
