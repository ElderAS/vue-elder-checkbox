<template>
  <label
    class="elder-checkbox"
    :class="[
      `elder-checkbox--theme-${theme}`,
      {
        'elder-checkbox--checked': isChecked,
        'elder-checkbox--indeterminate': !isChecked && indeterminate,
      },
    ]"
  >
    <input
      type="checkbox"
      :value="state || value"
      :checked="isChecked"
      @input="onInput"
      v-bind="binding"
    />
    <span class="elder-checkbox__box">
      <slot name="icon" :checked="isChecked">
        <font-awesome-icon
          v-if="theme === 'default' && isChecked"
          :icon="['fas', 'check']"
        />
      </slot>
    </span>
    <span class="elder-checkbox__label">
      <slot>
        <span v-html="label"></span>
      </slot>
      <abbr v-if="binding.required" class="elder-checkbox__required">*</abbr>
      <span class="elder-checkbox__sublabel" v-if="sublabel || $slots.sublabel">
        <slot name="sublabel">{{ sublabel }}</slot>
      </span>
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
    sublabel: String,
    theme: {
      type: String,
      default: 'default',
    },
    indeterminate: {
      type: Boolean,
      default: false,
    },
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
@function yiq-is-light($color, $threshold: 140) {
  $red: red($color);
  $green: green($color);
  $blue: blue($color);

  $yiq: (($red * 299)+ ($green * 587)+ ($blue * 114))/1000;

  @return if($yiq >= $threshold, true, false);
}

@mixin generateHSL($key, $color, $contrast: false) {
  --#{$key}-h: #{hue($color)};
  --#{$key}-s: #{saturation($color)};
  --#{$key}-l: #{lightness($color)};
  --#{$key}: hsl(var(--#{$key}-h), var(--#{$key}-s), var(--#{$key}-l));

  @if $contrast {
    --#{$key}-contrast-h: #{hue($contrast)};
    --#{$key}-contrast-s: #{saturation($contrast)};
    --#{$key}-contrast-l: #{lightness($contrast)};
    --#{$key}-contrast: hsl(var(--#{$key}-h), var(--#{$key}-s), var(--#{$key}-l));
  } @else {
    $lightness: if(yiq-is-light($color), 20%, 100%);

    --#{$key}-contrast-h: #{hue($color)};
    --#{$key}-contrast-s: #{saturation($color)};
    --#{$key}-contrast-l: #{$lightness};
    --#{$key}-contrast: hsl(
      var(--#{$key}-contrast-h),
      var(--#{$key}-contrast-s),
      var(--#{$key}-contrast-l)
    );
  }
}

@function GetVariable($key) {
  @return var(--#{$key}, --vue-elder-#{$key});
}

.elder-checkbox {
  @include generateHSL('vue-elder-primary', #3a9acd);
  $borderColor: #eaeaea;

  position: relative;

  display: flex;
  align-items: start;

  cursor: pointer;

  $size: 1.3rem;

  outline: none;

  &--checked {
    &:not([disabled='disabled']) {
      &.elder-checkbox--theme-default .elder-checkbox__box {
        color: white;
      }
    }

    &.elder-checkbox--theme-toggle {
      .elder-checkbox__box {
        &:before {
          transform: translateX(calc(100% - 2px));
        }

        & > * {
          transform: translateX(calc(100% - 2px));
        }
      }
    }
  }

  &[disabled='disabled'] {
    cursor: not-allowed;

    .elder-checkbox__box {
      color: inherit;
      border-color: var(--border-color, $borderColor);
      background-color: var(--border-color, $borderColor);
    }

    &.elder-checkbox--theme-toggle .elder-checkbox__box {
      height: 1.5rem;

      &:before {
        background-color: rgba(black, 0.2);
      }
    }
  }

  input[type='checkbox'] {
    position: absolute;
    top: 0;
    left: 0;

    height: $size;
    aspect-ratio: 1;
    margin: 0;

    pointer-events: none;

    opacity: 0;
  }

  &:focus-visible {
    .elder-checkbox__box {
      outline: 2px solid GetVariable('primary');
    }
  }

  &__box {
    font-size: 0.6rem;

    position: relative;

    display: inline-flex;
    align-items: center;
    flex-shrink: 0;
    justify-content: center;

    height: $size;
    aspect-ratio: 1;
    margin-right: 0.5rem;

    border: 1px solid var(--border-color, $borderColor);
    border-radius: var(--border-radius, 3px);

    transition: 100ms ease-out;

    .elder-checkbox--theme-toggle & {
      aspect-ratio: 5 / 3;
      border-radius: $size;
      height: 1.5rem;
      background-color: var(--border-color, $borderColor);

      & > * {
        color: inherit;
        transition: inherit;
        transform: translateX(-0.5rem);
      }

      &:before {
        content: '';
        display: block;
        height: calc(1.5rem - 6px);
        aspect-ratio: 1;

        position: absolute;
        top: -1px;
        left: -1px;
        margin: 3px;

        background-color: white;
        border-radius: 50%;

        transition: inherit;
      }
    }
  }

  &__label {
    font-weight: 300;
  }

  &__sublabel {
    opacity: 0.4;
    display: block;
    font-size: 0.9rem;
  }

  &__required {
    margin-left: 4px;

    color: var(--error, #e83b35);
  }

  &--checked {
    .elder-checkbox__box {
      border-color: GetVariable('primary');
      background-color: GetVariable('primary');
    }
  }

  &--indeterminate {
    .elder-checkbox__box {
      border-color: hsla(
        GetVariable('primary-h'),
        GetVariable('primary-s'),
        GetVariable('primary-l'),
        0.3
      );
      background-color: hsla(
        GetVariable('primary-h'),
        GetVariable('primary-s'),
        GetVariable('primary-l'),
        0.1
      );

      &:after {
        content: '—';
        font-size: 0.8rem;
        font-weight: bold;
        position: absolute;
        color: GetVariable('primary');
        top: 50%;
        left: 50%;
        transform: translate(-50%, -52%);
      }
    }
  }
}
</style>
