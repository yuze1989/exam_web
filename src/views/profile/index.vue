<template>
  <div class="app-container">
    <el-card>
      <el-tabs v-model="activeTab" tab-position="left" :stretch="true">
        <el-tab-pane label="基本信息" name="basic">
          <div class="form-title">基本设置</div>
          <basic />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
// import { mapGetters } from "vuex";
import Basic from "./components/Basic.vue";
 //import Security from "./components/Security";

export default {
  name: "Profile",
  components: { Basic },
  data() {
    return {
      activeTab: "basic",
      user: { username: "99" }
    };
  },

  created() {
    // this.user = {
    //   username: this.username,
    //   nickname: this.nickname
    // };
  }
};
</script>
<style scoped>
.app-container >>> .el-card__body {
  padding: 20px 0;
}

.app-container >>> .el-tabs__content {
  padding: 0 40px;
}
.app-container >>> .el-tabs__header {
  width: 224px;
}

.app-container >>> .el-tabs--left .el-tabs__item.is-left {
  text-align: left;
}



.app-container .form-title {
  color: rgba(0, 0, 0, 0.85);
  font-size: 20px;
  font-weight: 500;
  line-height: 28px;
  margin-bottom: 12px;
}
</style>
