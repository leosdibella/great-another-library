import { GalExtendedCustomElement } from "./utilities";

export enum ButtonSize {
  verySmall = 'very-small',
  small = 'small',
  medium = 'medium',
  large = 'large',
  extraLarge = 'extra-large'
}

export enum ButtonColor {
  primary = 'primary',
  secondary = 'secondary',
  accent = 'accent',
  info = 'info',
  warning = 'warning',
  error = 'error',
  success = 'success'
}

export type GalButtonAttribute = 'color' | 'size';

@GalExtendedCustomElement<GalButtonAttribute>({
  is: 'gal-button',
  extends: 'button',
  observedAttributes: [
    'color',
    'size'
  ]
})
export class GalButton extends HTMLButtonElement {
  #color: ButtonColor = ButtonColor.primary;
  #size: ButtonSize = ButtonSize.medium;

  #attributes: Readonly<
    Partial<Record<keyof GalButton, (from: string, to: string) => void>>
  > = {
    color: (from, to: ButtonColor) => {
      if (Object.values(ButtonColor).indexOf(to) > -1) {
        this.color = to;
      }
    },
    size: (from, to: ButtonSize) => {
      if (Object.values(ButtonSize).indexOf(to) > -1) {
        this.size = to;
      }
    }
  };

  public set color(color) {
    this.classList.remove(`gal-${this.#color}-background-color`);
    this.#color = color;
    this.classList.add(`gal-${this.#color}-background-color`);
  }
  
  public get color() {
    return this.#color;
  }

  public set size(size) {
    this.classList.remove(`gal-button-${this.#size}`);
    this.#size = size;
    this.classList.add(`gal-button-${this.#size}`);
  }

  public get size() {
    return this.#size;
  }

  public connectedCallback() {
    if (!this.#color) {
      this.color = ButtonColor.primary;
    }

    if (!this.#size) {
      this.size = ButtonSize.medium;
    }
  }

  public attributeChangedCallback(name: keyof GalButton, from: string, to: string) {
    if (from === to) {
      return;
    }

    const attribute = this.#attributes[name];

    if (attribute) {
      attribute(from, to);
    }
  }

  constructor() {
    super();
  }
}