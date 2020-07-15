import { GalCustomElement } from '../lib/utilities';

const styles = `
<style>
  @import url( './styles.css' );

  .gal-doc-buttons button:not(:last-child) {
    margin-bottom: 1rem;
  }
</style>
`;

const html = `
<main>
  <h2>
    Button Documentation
  </h2>
  <div
    class="gal-flex-col gal-doc-buttons">
    <button 
      is="gal-button"
      color="primary"
      size="extra-large">
      Oh Look a big 'ole primary button
    </button>
    <button
      gal-on-click="alertClickedSecondaryButton"
      is="gal-button"
      color="secondary"
      size="small">
      Eh? This is a baby secondary button
    </button>
    <button
      is="gal-button"
      color="accent"
      size="medium">
      Yep, this is a medium sized accent button
    </button>
    <button
      disabled
      is="gal-button"
      color="primary"
      size="very-small">
      I'm a REALLY small disabled button
    </button>
    <button
      is="gal-button"
      color="secondary"
      size="large">
      A Large secondary button to round things out
    </button>
  </div>
</main>
`;

@GalCustomElement({
  styles,
  html,
  tag: 'gal-doc-button'
})
export class GalDocButton extends HTMLElement {
  public alertClickedSecondaryButton(event: Event) {
    alert('Clicked the baby secondary button!');
  }

  constructor() {
    super();
  }
}