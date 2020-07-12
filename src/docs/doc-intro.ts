import { GalCustomElement } from '../lib/utilities';

const styles = `
<style>
</style>
`;

const html = `
  <h2>
    This is an introduction to this library, I promise I'll make it more interesting ...
  </h2>
`;

@GalCustomElement({
  styles,
  html,
  tag: 'gal-doc-intro'
})
export class GalDocIntro extends HTMLElement {
  constructor() {
    super();
  }
}