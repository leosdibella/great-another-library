import { GalCustomElement, generatePropertySetter } from '../lib/utilities';
import { GalButton, ButtonColor, ButtonSize } from 'src/lib';
import { GalHostEvent } from 'src/lib/utilities/gal-host-event';

const styles = `
<style>
  @import url( './styles.css' );

  :host {
    width: 100%;
    min-height: 4rem;
    flex: 0 0 auto;
  }

  .gal-doc-app-header-toggle-button {
    background-color: transparent;
    border: none;
    transform: rotateZ(90deg);
    padding: 1rem;
  }

  .exmaple-button {
    transition: all 500ms ease-in-out;
  }
</style>
`;

const html = `
<button
  class="gal-doc-app-header-toggle-button">
  |||
</button>
<button
  class="exmaple-button"
  is="gal-button">
  I change size and color at random intervals between 2 and 5 seconds
</button>
`;

@GalCustomElement({
  styles,
  html,
  tag: 'gal-doc-app-header'
})
export class GalDocAppHeader extends HTMLElement {
  #exampleButton!: HTMLButtonElement;
  #timeoutId?: number;
  #sizeSetter!: (size: ButtonSize) => void;
  #colorSetter!: (color: ButtonColor) => void;

  private setExampleButtonColor() {
    const randomNumber = Math.floor(Math.random() * 4) + 2;
    const randomColor = Math.floor(Math.random() * GalButton.sizes.length);
    const randomSize = Math.floor(Math.random() * GalButton.colors.length);

    this.#sizeSetter(GalButton.sizes[randomSize]);
    this.#colorSetter(GalButton.colors[randomColor]);

    this.#timeoutId = window.setTimeout(
      this.setExampleButtonColor.bind(this),
      randomNumber * 1000
    );
  }

  public disconnectedCallback() {
    window.clearTimeout(this.#timeoutId);
  }

  public connectedCallback() {
    this.#exampleButton = this.shadowRoot!.querySelector(
      '.exmaple-button'
    ) as HTMLButtonElement;

    this.#colorSetter = generatePropertySetter<GalButton, ButtonColor>(
      this.#exampleButton,
      'color'
    );
    this.#sizeSetter = generatePropertySetter<GalButton, ButtonSize>(
      this.#exampleButton,
      'size'
    );

    this.setExampleButtonColor();
  }

  @GalHostEvent('click')
  public onClick() {
    alert('got clicked');
  }

  constructor() {
    super();

    this.setAttribute('role', 'banner');
  }
}
