<template>
  <label class="elder-checkbox" :class="{ 'elder-checkbox--checked': isChecked }">
    <input
      type="checkbox"
      :value="state || value"
      :checked="isChecked"
      @input="onInput"
      v-bind="binding"
    />
    <span class="elder-checkbox__box">
      <font-awesome-icon v-if="isChecked" :icon="['fas', 'check']" />
    </span>
    <span class="elder-checkbox__label">
      <slot>{{ label }}</slot>
      <abbr v-if="binding.required" class="elder-checkbox__required">*</abbr>
    </span>
  </label>
</template>

<script>
import { AttributeBoolean } from './utils'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

export default {
  props: {
    value: [Boolean, Array],
    state: [String, Object],
    compare: {
      type: Function,
      default(a, b) {
        return a === b
      },
    },
    label: String,
  },
  computed: {
    isChecked() {
      if (this.isArray)
        return this.value.find((x) => this.compare(x, this.state)) ? true : false
      return this.value
    },
    isArray() {
      return this.value instanceof Array
    },
    isRequired: AttributeBoolean('required'),
    isDisabled: AttributeBoolean('disabled'),
    binding() {
      return {
        ...this.$attrs,
        required: this.isRequired,
        disabled: this.isDisabled,
      }
    },
  },
  methods: {
    onInput(ev) {
      if (!this.isChecked) {
        this.$emit('input', this.isArray ? [...this.value, this.state] : true)
      } else {
        this.$emit(
          'input',
          this.isArray ? this.value.filter((v) => !this.compare(v, this.state)) : false,
        )
      }
    },
  },
  components: {
    FontAwesomeIcon,
  },
}
</script>

<style lang="scss">
$variables: (
  'primary': #3a9acd,
  'error': #e83b35,
  'border-radius': 3px,
  'border-color': #eaeaea,
);

@function GetVariable($key) {
  @return var(--vue-elder-#{$key}, map-get($variables, $key));
}

.elder-checkbox {
  position: relative;

  display: flex;
  align-items: center;

  cursor: pointer;

  $size: 1.5rem;

  input[type='checkbox'] {
    position: absolute;
    top: 0;
    left: 0;

    width: $size;
    height: $size;
    margin: 0;

    pointer-events: none;

    opacity: 0;

    &:focus {
      & ~ .elder-checkbox__box {
        border-color: GetVariable('primary') !important;
      }
    }

    &:disabled {
      & ~ .elder-checkbox__box {
        color: inherit;
        border-color: GetVariable('border-color');

        &:before {
          opacity: 0.3;
          background-color: GetVariable('border-color');
        }
      }

      & ~ .elder-checkbox__label {
        color: inherit;
      }
    }
  }

  &__box {
    font-size: 0.6rem;

    position: relative;

    display: inline-flex;
    align-items: center;
    flex-shrink: 0;
    justify-content: center;

    width: $size;
    height: $size;
    margin-right: 0.5rem;

    color: white;
    border: 1px solid GetVariable('border-color');
    border-radius: GetVariable('border-radius');

    & svg {
      z-index: 1;
    }

    &:before {
      position: absolute;
      z-index: 0;
      top: 0;
      left: 0;

      width: 100%;
      height: 100%;

      content: '';

      opacity: 1;
    }
  }

  &__label {
    font-weight: 300;
  }

  &__required {
    margin-left: 4px;

    color: GetVariable('error');
  }

  &--checked {
    .elder-checkbox__box {
      border-color: GetVariable('primary');

      &:before {
        opacity: 0.9;
        background-color: GetVariable('primary');
      }
    }
  }
}
</style>
