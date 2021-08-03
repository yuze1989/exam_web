<template>
  <div :class="{ 'has-logo': showLogo }">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeIndex"
        unique-opened
        @select="handleSelect"
        mode="vertical"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
      >
        <side-bar-item
          v-for="(route, index) in permission_routes"
          :key="index"
          :item="route"
          :base-path="route.path"
          :index="index"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Logo from "./Logo.vue";
import SideBarItem from "./sideBarItem.vue";
import variables from "@/styles/variables.scss";
export default {
  components: { SideBarItem, Logo },
  data() {
    return {
      activeIndex: "",
    };
  },
  mounted() {

  },
  computed: {
    ...mapGetters(["permission_routes", "sidebar"]),
    showLogo() {
      return this.$store.state.settings.sidebarLogo;
    },
    variables() {
      return variables;
    },
    isCollapse() {
      return !this.sidebar.opened;
    },
  },
  methods: {
    isShow(item) {
      if (item.hidden) {
        return false;
      }
      return true;
    },

    handleSelect(key, keyPath) {
      let currentSchoolId = localStorage.getItem("currentSchoolId");
      console.log(currentSchoolId);
              this.activeIndex = key;
        console.log("key:" + key);
        this.$router.push({
          path: key,
          params: { data: "query" },
        });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>