<template>
  <el-pagination
    class="my_pagination"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    :current-page="current"
    :page-sizes="[10, 20, 50]"
    :page-size="size"
    layout="total, sizes, prev, pager, next, jumper"
    :total="total"
  ></el-pagination>
</template>

<script>
/**
 * 分页组件
 */
export default {
  name: "pagination",
  props: {
    current: {
      default: 1,
    },
    pages: {
      default: 0,
    },
    size: {
      default: 20,
    },
    total: {
      default: 0,
    },
  },
  data() {
    return {};
  },
  created() {},
  methods: {
    /**
     * 分页数量
     */
    handleSizeChange(val) {
      // 导出当前页和值 还有方法
      this.$emit("update:current", 1);
      this.$emit("update:size", val);
      this.$emit("cb");
    },
    /**
     * 当前页
     */
    handleCurrentChange(val) {
      // console.log(val)
      //导出当前页和值 还有方法
      this.$emit("update:current", val);
      this.$emit("cb");
    },
  },
};
</script>

<style lang="scss" scoped>
.my_pagination {
  margin: 20px;
  text-align: right;
}
</style>
