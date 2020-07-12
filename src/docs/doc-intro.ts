import { GalCustomElement } from '../lib/utilities';

const styles = `
<style>
</style>
`;

const html = `
  This is an introduction to this library, I promise I'll make it more interesting ...
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