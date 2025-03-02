import { createStore } from 'vuex';

export default createStore({
  state: {
    activeSection: 'transactions',
  },
  mutations: {
    setActiveSection(state, section) {
      state.activeSection = section;
    },
  },
  actions: {
    updateSection({ commit }, section) {
      commit('setActiveSection', section);
    },
  },
});
