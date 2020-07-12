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
  <gal-router>
  </gal-router>
</main>
`;

@GalCustomElement({
  styles,
  html,
  tag: 'gal-doc-app-main'
})
export class GalDocAppMain extends HTMLElement {
  constructor() {
    super();
  }
}