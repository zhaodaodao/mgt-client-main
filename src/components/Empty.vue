<template>
  <a-empty
    :imageStyle="
      clientWidth > this.$width.sm
        ? {
            height: '400px',
            width: '400px',
            margin: 'auto',
          }
        : { margin: 'auto' }
    "
    :description="description"
  />
</template>

<script>
import { ref, defineComponent } from "vue";
export default defineComponent({
  name: "empty",
  props: {
    des: String,
  },
  setup(props) {
    const description = props.des;
    return {
      clientWidth: ref(document.documentElement.clientWidth),
      description,
    };
  },
  mounted() {
    const that = this;
    window.onresize = () => {
      return (() => {
        that.clientWidth = document.documentElement.clientWidth; // 宽
      })();
    };
  },
});
</script>

<style></style>
