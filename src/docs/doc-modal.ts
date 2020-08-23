import { GalCustomElement } from '../lib/utilities';

const styles = `
<style>
</style>
`;

const html = `
  <h1>
    Modal
  </h1>
`;

@GalCustomElement({
  styles,
  html,
  tag: 'gal-doc-modal',
})
export class GalDocModal extends HTMLElement {}
