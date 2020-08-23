import { GalCustomElement, doNothing } from './utilities';
import { ThemeVariables } from './utilities/theme';

enum Selectors {
  controlContainer = 'gal-form-field-control-container',
  controlContainerFocused = 'gal-form-field-control-container-focused',
  requiredLabel = 'gal-form-field-required-label',
  labelContainer = 'gal-form-field-label-container',
  descriptionContainer = 'gal-form-field-description-container',
  messagesContainer = 'gal-form-field-messages-container',
}

const styles = `
<style>
  :host {
    margin-bottom: 1rem;
    display: block;
  }

  ::slotted([slot="label"]) {
    font-weight: bold;
  }

  .${Selectors.labelContainer}:not(:empty) {
    margin-bottom: 0.5rem;
  }

  .${Selectors.descriptionContainer}:not(:empty) {
    margin-top: 0.5rem;
  }

  ::slotted([slot="label"]).${Selectors.requiredLabel}::after {
    content: "*";
  }

  ::slotted([slot="control"]) {
    border: none;
    background-color: transparent;
    border-radius: 0;
    flex: 1 0 auto;
    padding: 0;
  }

  ::slotted([slot="control"]:focus) {
    outline: none;
  }

  .${Selectors.controlContainer} {
    border: 0.0125rem solid var(${ThemeVariables.foreground});
    border-radius: 0.125rem;
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .${Selectors.controlContainerFocused} {
    outline: 0.0125rem solid var(${ThemeVariables.foreground});
  }
</style>
`;

const html = `
<div
  class="${Selectors.labelContainer}">
  <slot
    name="label">
  </slot>
</div>
<div
  class="${Selectors.controlContainer}">
  <slot
    name="prefix">
  </slot>
  <slot 
    name="control">
  </slot>
  <slot
    name="suffix">
  </slot>
</div>
<div
  class="${Selectors.descriptionContainer}">
  <slot
    name="description">
  </slot>
</div>
<div
  class="${Selectors.messagesContainer}">
  <slot
    name="message">
  </slot>
</div>
`;

enum Position {
  single = 0,
  prefixed = 1 << 0,
  suffixed = 1 << 1,
  all = prefixed | suffixed,
}

export interface GalFormFieldControl extends HTMLElement {
  required: boolean;
  readonly: boolean;
}

@GalCustomElement<GalFormField>({
  styles,
  html,
  tag: 'gal-form-field',
  observedAttributes: {
    'font-size': '',
  },
  observedAttributesMapName: 'attributeMap',
})
export class GalFormField extends HTMLElement {
  private static nextId = 0;
  private static readonly remToPixels = 16;
  private static readonly verticalMarginModifier = 0.5;
  private static readonly horizontalMarginModifier = 0.75;

  #nextId = ++GalFormField.nextId;
  #label?: HTMLLabelElement;
  #control?: GalFormFieldControl;
  #suffix?: HTMLElement;
  #prefix?: HTMLElement;
  #fontSize: string = '1rem';
  #formFieldContainer!: HTMLDivElement;

  #fontSizeMap: Readonly<
    Record<
      Position,
      (
        verticalMargin: number,
        horizontalMargin: number,
        fontSize: number,
      ) => void
    >
  > = {
    [Position.single]: doNothing,
    [Position.prefixed]: (
      verticalMargin: number,
      horizontalMargin: number,
      fontSize: number,
    ) => {
      this.#prefix!.style.margin = `${verticalMargin}rem 0 ${verticalMargin}rem ${horizontalMargin}rem`;
      this.#prefix!.style.fontSize = `${fontSize}rem`;
    },
    [Position.suffixed]: (
      verticalMargin: number,
      horizontalMargin: number,
      fontSize: number,
    ) => {
      this.#suffix!.style.margin = `${verticalMargin}rem ${horizontalMargin}rem ${verticalMargin}rem 0`;
      this.#suffix!.style.fontSize = `${fontSize}rem`;
    },
    [Position.all]: (
      verticalMargin: number,
      horizontalMargin: number,
      fontSize: number,
    ) => {
      this.#fontSizeMap[Position.prefixed](
        verticalMargin,
        horizontalMargin,
        fontSize,
      );
      this.#fontSizeMap[Position.suffixed](
        verticalMargin,
        horizontalMargin,
        fontSize,
      );
    },
  };

  #focus = () => {
    this.#formFieldContainer.classList.add(Selectors.controlContainerFocused);
  };

  #blur = () => {
    this.#formFieldContainer.classList.remove(
      Selectors.controlContainerFocused,
    );
  };

  private resizeFormField() {
    const fontSizeInRem =
      (parseFloat(getComputedStyle(document.body).fontSize) /
        GalFormField.remToPixels) *
      parseFloat(this.#fontSize);
    const verticalMargin = fontSizeInRem * GalFormField.verticalMarginModifier;
    const horizontalMargin =
      fontSizeInRem * GalFormField.horizontalMarginModifier;

    let position: Position = Position.single;

    if (this.#prefix) {
      position |= Position.prefixed;
    }

    if (this.#suffix) {
      position |= Position.suffixed;
    }

    if (this.#control) {
      this.#control.style.margin = `${verticalMargin}rem ${horizontalMargin}rem`;
      this.#control.style.fontSize = `${fontSizeInRem}rem`;
    }

    this.#fontSizeMap[position](
      verticalMargin,
      horizontalMargin,
      fontSizeInRem,
    );
  }

  public attributeMap: Readonly<
    Partial<Record<keyof GalFormField, (from: string, to: string) => void>>
  > = {
    fontSize: (from: string, to: string) => {
      this.fontSize = to;
    },
  };

  public get fontSize() {
    return this.#fontSize;
  }

  public set fontSize(fontSize: string) {
    if (this.#fontSize !== fontSize) {
      this.#fontSize = fontSize;
      this.resizeFormField();
    }
  }

  disconnectedCallback() {
    if (this.#control) {
      this.#control.removeEventListener('focus', this.#focus);
      this.#control.removeEventListener('blur', this.#blur);
    }
  }

  connectedCallback() {
    if (this.shadowRoot) {
      this.#formFieldContainer = this.shadowRoot.querySelector(
        `.${Selectors.controlContainer}`,
      ) as HTMLDivElement;
    }

    this.#label =
      this.querySelector<HTMLLabelElement>('[slot="label"]') || undefined;
    this.#control =
      this.querySelector<GalFormFieldControl>('[slot="control"]') || undefined;
    this.#prefix =
      this.querySelector<HTMLElement>('[slot="prefix"]') || undefined;
    this.#suffix =
      this.querySelector<HTMLElement>('[slot="suffix"]') || undefined;

    if (this.#label) {
      this.#label.htmlFor = `gal-form-field-control-${this.#nextId}`;
    }

    if (this.#control) {
      this.#control.id = `gal-form-field-control-${this.#nextId}`;
      this.#control.addEventListener('focus', this.#focus);
      this.#control.addEventListener('blur', this.#blur);

      if (this.#control.required && this.#label) {
        this.#label.classList.add(Selectors.requiredLabel);
      }
    }

    this.resizeFormField();
  }
}
