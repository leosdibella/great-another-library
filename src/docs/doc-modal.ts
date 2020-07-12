import { GalCustomElement } from '../lib/utilities';

const styles = `
<style>
</style>
`;

const html = `
  <h2>
    Modal Documentation
  </h2>
`;

@GalCustomElement({
  styles,
  html,
  tag: 'gal-doc-modal'
})
export class GalDocModal extends HTMLElement {
  constructor() {
    super();
  }
}