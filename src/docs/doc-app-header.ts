import { GalCustomElement } from '../lib/utilities';

const styles = `
<style>
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
</style>
`;

const html = `
<button
  class="gal-doc-app-header-toggle-button">
  |||
</button>
`;

@GalCustomElement({
  styles,
  html,
  tag: 'gal-doc-app-header'
})
export class GalDocAppHeader extends HTMLElement {
  constructor() {
    super();

    this.setAttribute('role', 'banner');
  }
}