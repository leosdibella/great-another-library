import { GalCustomElement } from '../lib/utilities';

const styles = `
<style>
  :host {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .gal-doc-app-container {
    display: flex;
    flex-direction: row;
    height: 100%;
    flex: 1 0 auto;
  }
</style>
`;

const html = `
<gal-doc-app-header>
</gal-doc-app-header>
<div
  class="gal-doc-app-container">
  <gal-doc-app-side-panel>
    class="gal-full-height gal-overflow-y-auto gal-flex-stable">
  </gal-doc-app-side-panel>
  <gal-doc-app-main>
    class="gal-full-height gal-overflow-y-auto gal-flex-grow">
  </gal-doc-app-main>
</div>
`;

@GalCustomElement({
  styles,
  html,
  tag: 'gal-doc-app'
})
export class GalDocApp extends HTMLElement {}
