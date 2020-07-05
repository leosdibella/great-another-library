import { GalCustomElement } from '../lib/utilities';

const styles = `
<style>
</style>
`;

const html = `
<main>
  Modal Documentation
</main>
`;

export class GalDocModal extends GalCustomElement {
  public static get tag() {
    return 'gal-doc-modal';
  }

  public static get html() {
    return html;
  }

  public static get styles() {
    return styles;
  }

  public static register(document: Document) {
    GalCustomElement.registerGalCustomElement(document, GalDocModal);
  }

  constructor() {
    super(GalDocModal.tag);
  }
}