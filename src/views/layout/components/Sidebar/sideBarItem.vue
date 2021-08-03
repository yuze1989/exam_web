<template>
  <div v-if="!item.hidden" class="menu-wrapper">
    <!-- <template
      v-if="
        hasOneShowingChild(item.children, item) &&
        (!onlyOneChild.children || onlyOneChild.noShowingChildren) &&
        !item.alwaysShow
      "
    >
      <el-menu-item
        :index="resolvePath(onlyOneChild.path)"
        :class="{ 'submenu-title-noDropdown': !isNest }"
      >
        <item
          :icon="
            item.meta && item.meta.icon
              ? item.meta.icon
              : onlyOneChild.meta.icon
          "
          :title="item.meta.name"
        />
      </el-menu-item>
    </template>

    <el-submenu v-else ref="subMenu" :index="index + ' '" popper-append-to-body>
      <template slot="title">
        <item
          v-if="item.meta"
          :icon="item.meta && item.meta.icon"
          :title="item.meta.name"
        />
      </template>
      <template v-for="child in item.children">
        <el-menu-item
          v-if="!hasOneShowingChild(item.children, item)"
          style="padding-left: 49px"
          :index="resolvePath(child.path)"
          :key="child.path"
        >
          <item
            :icon="child.meta.icon || (child.meta && child.meta.icon)"
            :title="child.meta.name"
          />
        </el-menu-item>
      </template>
    </el-submenu> -->

     <el-submenu  ref="subMenu" :index="index + ' '" popper-append-to-body>
      <template slot="title">
        <item
          v-if="item.meta"
          :icon="item.meta && item.meta.icon"
          :title="item.meta.name"
        />
      </template>
      <template v-for="child in item.children">
        <el-menu-item
          style="padding-left: 49px"
          :index="resolvePath(child.path)"
          :key="child.path"
        >
          <item
            :icon="child.meta.icon || (child.meta && child.meta.icon)"
            :title="child.meta.name"
          />
        </el-menu-item>
      </template>
    </el-submenu>
  </div>
</template>

<script>
import path from "path";
import { isExternal } from "@/utils/validate";
import Item from "./item.vue";
import FixiOSBug from "./FixiOSBug";

export default {
  name: "SidebarItem",
  components: { Item },
  mixins: [FixiOSBug],
  props: {
    // route object
    item: {
      type: Object,
      required: true,
    },
    isNest: {
      type: Boolean,
      default: false,
    },
    basePath: {
      type: String,
      default: "",
    },
    index: {
      type: Number,
      default: 0,
    },
  },
  data() {
    // To fix https://github.com/PanJiaChen/vue-admin-template/issues/237
    // TODO: refactor with render function
    this.onlyOneChild = null;
    return {};
  },
  methods: {
    hasOneShowingChild(children = [], parent) {
      const showingChildren = children.filter((item) => {
        if (item.hidden) {
          return false;
        } else {
          // Temp set(will be used if only has one showing child)
          this.onlyOneChild = item;
          return true;
        }
      });

      // When there is only one child router, the child router is displayed by default
      if (showingChildren.length === 1) {
        return true;
      }

      // Show parent if there are no child router to display
      if (showingChildren.length === 0) {
        this.onlyOneChild = { ...parent, path: "", noShowingChildren: true };
        return true;
      }

      return false;
    },
    resolvePath(routePath) {
      if (isExternal(routePath)) {
        return routePath;
      }
      if (isExternal(this.basePath)) {
        return this.basePath;
      }
      return path.resolve(this.basePath, routePath);
    },
  },
};
</script>
