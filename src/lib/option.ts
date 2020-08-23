import { GalCustomElement } from './utilities/gal-custom-element';
import { attributeToBoolean } from './utilities';
import { Aria } from './utilities/aria';

const styles = `
<style>
</style>
`;

const html = `
<slot>
</slot>
`;

@GalCustomElement<GalOption>({
  html,
  styles,
  tag: 'gal-option',
  observedAttributes: ['disabled', 'fontSize'],
})
export class GalOption extends HTMLElement {
  #disabled: boolean = false;
  #fontSize: string = '1rem';

  public set fontSize(fontSize: string) {
    this.#fontSize = fontSize;
  }

  public get fontSize() {
    return this.#fontSize;
  }

  public set disabled(disabled: boolean) {
    this.#disabled = attributeToBoolean(disabled);
    this.setAttribute(Aria.disabled, `${this.#disabled}`);
  }

  public get disabled() {
    return this.#disabled;
  }
}
