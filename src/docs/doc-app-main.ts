import { GalCustomElement, registerGalCustomElement } from '../lib/utilities';

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
</main>
`;

export class GalDocAppMain extends GalCustomElement {
  private static templateId: string = '';

  public static register(document: Document) {
    GalDocAppMain.templateId = registerGalCustomElement(
      document,
      GalDocAppMain,
      'gal-doc-app-main',
      html,
      styles);
  }

  constructor() {
    super(GalDocAppMain.templateId);
  }
}