import { GalCustomElement } from '../lib/utilities';

const styles = `
<style>
</style>
`;

const html = `
  <h2>
    Form Field
  </h2>
  <div>
    <gal-form-field
        fontSize="4rem">
        <label
            slot="label">
            A Form field
        </label>
        <i
            slot="prefix">
            $
        </i>
        <i
            slot="suffix">
            %
        </i>
        <input
            slot="input"/>
        <span
            slot="description">
            I'm describing this field
        </span>
    </gal-form-field>
  </div>
`;

@GalCustomElement({
  styles,
  html,
  tag: 'gal-doc-form-field'
})
export class GalDocFormField extends HTMLElement {
  constructor() {
    super();
  }
}