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
    label: String,
  },
  computed: {
    isArray() {
      return this.value instanceof Array
    },
    isChecked() {
      return this.isArray ? this.value.includes(this.state) : this.value
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
      if (ev.target.checked) {
        this.$emit('input', this.isArray ? [...this.value, this.state] : true)
      } else {
        this.$emit(
          'input',
          this.isArray ? this.value.filter(r => r !== this.state) : false,
        )
      }
    },
  },
}
</script>

<style lang="scss">
.elder-checkbox {
  $size: 1.5rem;
  $primary: #3a9acd !default;
  $success: #33ca62 !default;
  $error: #e83b35 !default;
  $border-color: #eaeaea !default;
  $border-radius: 3px !default;

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
        border-color: $primary !important;
      }
    }

    &:disabled {
      & ~ .elder-checkbox__box {
        background-color: rgba($border-color, 0.3);
        color: rgba($dark, 0.5);
        border-color: $border-color;
      }

      & ~ .elder-checkbox__label {
        color: rgba($dark, 0.5);
      }
    }
  }

  &__box {
    display: inline-flex;
    align-items: center;
    justify-content: center;

    height: $size;
    width: $size;
    border: 1px solid $border-color;
    border-radius: $border-radius;

    margin-right: 0.5rem;
    flex-shrink: 0;

    font-size: 0.6rem;

    color: white;
  }

  &__label {
    font-weight: 300;
  }

  &__required {
    color: $error;
    margin-left: 4px;
  }

  &--checked {
    .elder-checkbox__box {
      border-color: $primary;
      background-color: lighten($primary, 10%);
    }
  }
}
</style>
