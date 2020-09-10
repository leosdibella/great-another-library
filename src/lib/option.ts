import { GalCustomElement } from './utilities/gal-custom-element';
import { attributeToBoolean, GalObserved } from './utilities';
import { Aria } from './utilities/aria';

const styles = `
<style>
</style>
`;

const html = `
<slot>
</slot>
`;

@GalCustomElement({
  html,
  styles,
  tag: 'gal-option'
})
export class GalOption extends HTMLElement {
  #disabled: boolean = false;
  #fontSize: string = '1rem';

  @GalObserved()
  public set fontSize(fontSize: string) {
    this.#fontSize = fontSize;
  }

  public get fontSize() {
    return this.#fontSize;
  }

  @GalObserved()
  public set disabled(disabled: boolean) {
    this.#disabled = attributeToBoolean(disabled);
    this.setAttribute(Aria.disabled, `${this.#disabled}`);
  }

  public get disabled() {
    return this.#disabled;
  }
}
