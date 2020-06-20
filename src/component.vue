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
      <font-awesome-icon v-if="value" :icon="['fas', 'check']" />
    </span>
    <span class="elder-checkbox__label">
      <slot>{{ label }}</slot>
      <abbr v-if="binding.required" class="elder-checkbox__required">*</abbr>
    </span>
  </label>
</template>

<script>
import { AttributeBoolean } from './utils'
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
}
</script>

<style lang="scss">
@import './main';

:root {
  @include GenerateVariables();
}

.elder-checkbox {
  $size: 1.5rem;

  display: flex;
  align-items: center;
  cursor: pointer;

  position: relative;

  input[type='checkbox'] {
    opacity: 0;
    position: absolute;
    top: 0;
    left: 0;
    pointer-events: none;
    margin: 0;

    width: $size;
    height: $size;

    &:focus {
      & ~ .elder-checkbox__box {
        border-color: var(--vue-elder-primary) !important;
      }
    }

    &:disabled {
      & ~ .elder-checkbox__box {
        background-color: rgba(var(--vue-elder-border-color), 0.3);
        color: rgba(inherit, 0.5);
        border-color: var(--vue-elder-border-color);
      }

      & ~ .elder-checkbox__label {
        color: rgba(inherit, 0.5);
      }
    }
  }

  &__box {
    display: inline-flex;
    align-items: center;
    justify-content: center;

    height: $size;
    width: $size;
    border: 1px solid var(--vue-elder-border-color);
    border-radius: var(--vue-elder-border-radius);

    margin-right: 0.5rem;
    flex-shrink: 0;

    font-size: 0.6rem;

    color: white;
  }

  &__label {
    font-weight: 300;
  }

  &__required {
    color: var(--vue-elder-error);
    margin-left: 4px;
  }

  &--checked {
    .elder-checkbox__box {
      border-color: var(--vue-elder-primary);
      background-color: lighten(var(--vue-elder-primary), 10%);
    }
  }
}
</style>
