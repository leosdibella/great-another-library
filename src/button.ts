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

export class GalButton extends HTMLButtonElement {
  static get observedAttributes(): string[] {
    return ['color', 'size'];
  }

  #color!: ButtonColor;
  #size!: ButtonSize;

  #attributes: Readonly<
    Partial<Record<keyof GalButton, (from: string, to: string) => void>>
  > = Object.freeze<
    Partial<Record<keyof GalButton, (from: string, to: string) => void>>
  >({
    color: (from, to) => {
      if (Object.values(ButtonColor).indexOf(to as ButtonColor) > -1) {
        this.color = to as ButtonColor;
      }
    },
    size: (from, to) => {
      if (Object.values(ButtonSize).indexOf(to as ButtonSize) > -1) {
        this.size = to as ButtonSize;
      }
    }
  });

  set color(color) {
    this.classList.remove(`gal-${this.#color}-background-color`);
    this.#color = color;
    this.classList.add(`gal-${this.#color}-background-color`);
  }
  
  get color() {
    return this.#color;
  }

  set size(size) {
    this.classList.remove(`gal-button-${this.#size}`);
    this.#size = size;
    this.classList.add(`gal-button-${this.#size}`);
  }

  get size() {
    return this.#size;
  }

  connectedCallback() {
    if (!this.#color) {
      this.color = ButtonColor.primary;
    }

    if (!this.#size) {
      this.size = ButtonSize.medium;
    }
  }

  attributeChangedCallback(name: keyof GalButton, from: string, to: string) {
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

customElements.define('gal-button', GalButton, { extends: 'button' });
