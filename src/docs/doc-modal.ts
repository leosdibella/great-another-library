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