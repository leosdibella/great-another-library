import { GalCustomElement } from '../lib/utilities';

const styles = `
<style>
</style>
`;

const html = `
<h1>
  Select
</h1>
<div>
  <gal-form-field
    font-size="1.5rem">
    <label
      slot="label">
      Favorite Animal
    </label>
    <gal-select
      placeholder="Pick an Animal"
      font-size="2rem"
      slot="control">
      <gal-option
        slot="option">
        Dog
      </gal-option>
      <gal-option
        slot="option">
        Cat
      </gal-option>
    </gal-select>
    <span
      slot="description">
      This is a custom select
    </span>
  </gal-form-field>
</div>
`;

@GalCustomElement({
  styles,
  html,
  tag: 'gal-doc-select',
})
export class GalDocSelect extends HTMLElement {}
