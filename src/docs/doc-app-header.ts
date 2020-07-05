import { GalCustomElement, registerGalCustomElement } from '../lib/utilities';

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
  private static templateId: string = '';

  public static register(document: Document) {
    GalDocAppHeader.templateId = registerGalCustomElement(
      document,
      GalDocAppHeader,
      'gal-doc-app-header',
      html,
      styles);
  }

  constructor() {
    super(GalDocAppHeader.templateId);

    this.setAttribute('role', 'banner');
  }
}