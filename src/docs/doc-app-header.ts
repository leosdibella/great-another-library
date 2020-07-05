import { GalCustomElement, } from '../lib/utilities';

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

export class GalDocAppHeader extends GalCustomElement {
  public static get tag() {
    return 'gal-doc-app-header';
  }

  public static get html() {
    return html;
  }

  public static get styles() {
    return styles;
  }

  public static register(document: Document) {
    GalCustomElement.registerGalCustomElement(document, GalDocAppHeader);
  }

  constructor() {
    super(GalDocAppHeader.tag);

    this.setAttribute('role', 'banner');
  }
}