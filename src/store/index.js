import Vue from "vue";
import Vuex from "vuex";
import getters from "./getters";
import user from "./modules/user.js"
import permission from "./modules/permission.js"
import app from "./modules/app.js"
import settings from "./modules/settings.js"

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    user,
    permission,
    app,
    settings
  },
  getters
});
