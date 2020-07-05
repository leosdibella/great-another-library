import { GalCustomElement } from '../lib/utilities';

const styles = `
<style>
</style>
`;

const html = `
<main>
  Button Documentation
</main>
`;

export class GalDocButton extends GalCustomElement {
  public static get tag() {
    return 'gal-doc-button';
  }

  public static get html() {
    return html;
  }

  public static get styles() {
    return styles;
  }

  public static register(document: Document) {
    GalCustomElement.registerGalCustomElement(document, GalDocButton);
  }

  constructor() {
    super(GalDocButton.tag);
  }
}