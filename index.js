import CheckboxComponent from "./src/component.vue";

const Options = {};

const install = Vue => {
  Vue.component("checkbox-component", CheckboxComponent);
};

const setup = options => {
  for (let key in options) {
    if (!(key in Options)) return;
    Options[key] = options[key];
  }
};

export default {
  install
};

export {
  CheckboxComponent,
  install as CheckboxComponentInstaller,
  setup,
  Options
};
