import { GalCustomElement } from '../lib/utilities';

const styles = `
<style>
  :host {
    display: block;
    height: 100%;
    overflow-y: auto;
    padding: 2rem;
    flex: 1 0 auto;
  }
</style>
`;

const html = `
<main>
  MAIN
  <gal-router>
  </gal-router>
</main>
`;

export class GalDocAppMain extends GalCustomElement {
  public static get tag() {
    return 'gal-doc-app-main';
  }

  public static get html() {
    return html;
  }

  public static get styles() {
    return styles;
  }

  public static register(document: Document) {
    GalCustomElement.registerGalCustomElement(document, GalDocAppMain);
  }

  constructor() {
    super(GalDocAppMain.tag);
  }
}