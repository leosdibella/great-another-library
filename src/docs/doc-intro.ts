import { GalCustomElement } from '../lib/utilities';

const styles = `
<style>
</style>
`;

const html = `
  <h1>
    This is an introduction to this library, I promise I'll make it more interesting ...
  </h1>
`;

@GalCustomElement({
  styles,
  html,
  tag: 'gal-doc-intro',
})
export class GalDocIntro extends HTMLElement {}
