import { GalCustomElement } from './utilities/gal-custom-element';
import { attributeToBoolean } from './utilities';
import {
  GalFormFieldControl,
  galFormFieldObservedAttributes,
} from './utilities/form-field-control';
import { Aria } from './utilities/aria';

enum Selectors {
  listbox = 'gal-select-listbox',
}

const styles = `
<style>
  .${Selectors.listbox}:focus {
    outline: none;
  }
</style>
`;

const html = `
<div
  gal-on:click="focus"
  class="${Selectors.listbox}"
  tabindex="0"
  role="listbox">
  <slot
    name="placeholder">
  </slot>
</div>
<div>
  <slot
    name="option">
  </slot>
</div>
`;

@GalCustomElement<GalSelect>({
  html,
  styles,
  tag: 'gal-select',
  observedAttributes: [
    'placeholder',
    ...(galFormFieldObservedAttributes as (keyof GalSelect)[]),
  ],
})
export class GalSelect extends HTMLElement implements GalFormFieldControl {
  #value?: unknown;
  #listbox!: HTMLDivElement;
  #disabled: boolean = false;
  #fontSize: string = '1rem';
  #required: boolean = false;
  #readonly: boolean = false;
  #multiple: boolean = false;
  #placeholder: string = '';
  #placeholderElement?: HTMLElement;

  public set disabled(disabled: boolean) {
    this.#disabled = attributeToBoolean(disabled);

    this.#disabled
      ? this.#listbox.removeAttribute('tabindex')
      : this.#listbox.setAttribute('tabindex', '0');

    this.setAttribute(Aria.disabled, `${this.#disabled}`);
  }

  public get disabled() {
    return this.#disabled;
  }

  public set fontSize(fontSize: string) {
    this.#fontSize = fontSize;
  }

  public get fontSize() {
    return this.#fontSize;
  }

  public set required(required: boolean) {
    this.#required = attributeToBoolean(required);
    this.setAttribute(Aria.required, `${this.#required}`);
  }

  public get required() {
    return this.#required;
  }

  public set readonly(readonly: boolean) {
    this.#readonly = attributeToBoolean(readonly);
    this.setAttribute(Aria.readonly, `${this.#readonly}`);
  }

  public get readonly() {
    return this.#readonly;
  }

  public set multiple(multiple: boolean) {
    this.#multiple = attributeToBoolean(multiple);
    this.setAttribute(Aria.multiselectable, `${this.#multiple}`);
  }

  public get multiple() {
    return this.#multiple;
  }

  public set value(value: unknown) {
    this.#value = value;
  }

  public get value() {
    return this.#value;
  }

  public set placeholder(placeholder: string) {
    if (!this.#placeholderElement && this.shadowRoot) {
      this.#placeholderElement = this.shadowRoot.querySelector(
        'slot[name="placeholder"]',
      ) as HTMLSlotElement;
    }

    this.#placeholder = placeholder;

    if (this.#placeholderElement!.innerHTML.trim() === '') {
      this.#placeholderElement!.textContent = this.#placeholder;
    }
  }

  public get placeholder() {
    return this.#placeholder;
  }

  public focus() {
    if (!this.#disabled) {
      this.#listbox.focus();
    }
  }

  public connectedCallback() {
    if (this.shadowRoot) {
      this.#listbox = this.shadowRoot.querySelector(
        `.${Selectors.listbox}`,
      ) as HTMLDivElement;
    }
  }
}
