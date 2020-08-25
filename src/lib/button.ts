import { GalExtendedCustomElement } from './utilities';

export enum ButtonSize {
  verySmall = 'very-small',
  small = 'small',
  medium = 'medium',
  large = 'large',
  extraLarge = 'extra-large',
}

export enum ButtonColor {
  primary = 'primary',
  secondary = 'secondary',
  accent = 'accent',
  info = 'info',
  warning = 'warning',
  error = 'error',
  success = 'success',
}

@GalExtendedCustomElement<GalButton>({
  is: 'gal-button',
  extends: 'button',
  observedAttributes: ['color', 'size'],
})
export class GalButton extends HTMLButtonElement {
  public static colors = Object.keys(ButtonColor).map(
    (color) => (ButtonColor as Record<string, ButtonColor>)[color],
  );
  public static sizes = Object.keys(ButtonSize).map(
    (size) => (ButtonSize as Record<string, ButtonSize>)[size],
  );
  #color: ButtonColor = ButtonColor.primary;
  #size: ButtonSize = ButtonSize.medium;

  public set color(color) {
    if (GalButton.colors.indexOf(color) === -1) {
      return;
    }

    this.classList.remove(`gal-${this.#color}-background-color`);
    this.#color = color;
    this.classList.add(`gal-${this.#color}-background-color`);
  }

  public get color() {
    return this.#color;
  }

  public set size(size) {
    if (GalButton.sizes.indexOf(size) === -1) {
      return;
    }

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
}
