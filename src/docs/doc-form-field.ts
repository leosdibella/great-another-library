import { GalCustomElement } from '../lib/utilities';

const styles = `
<style>
</style>
`;

const html = `
<h1>
  Form Field
</h1>
<div>
  <gal-form-field
    font-size="1.5rem">
    <label
      slot="label">
      Number of Dollars
    </label>
    <span
      slot="prefix">
      $
    </span>
    <input
      required
      slot="control"/>
    <span
      slot="description">
      I'm describing my first form field
    </span>
  </gal-form-field>
  <gal-form-field>
    <label
      slot="label">
      What Kind of Food?
    </label>
    <span
      slot="suffix">
      Food
    </span>
    <select
      slot="control">
      <option>
        Dog
      </option>
      <option>
        Cat
      </option>
      <option>
        Bird
      </option>
      <option>
        Human
      </option>
      <option>
        Fish
      </option>
    </select>
  </gal-form-field>
</div>
`;

@GalCustomElement({
  styles,
  html,
  tag: 'gal-doc-form-field',
})
export class GalDocFormField extends HTMLElement {}
