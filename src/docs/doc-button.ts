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

@GalCustomElement({
  styles,
  html,
  tag: 'gal-doc-button'
})
export class GalDocButton extends HTMLElement {
  constructor() {
    super();
  }
}