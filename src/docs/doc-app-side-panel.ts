import { GalCustomElement, registerGalCustomElement } from '../lib/utilities';

const styles = `
<style>
  :host {
    display: block;
    width: 15rem;
    flex: 0 0 auto;
    height: 100%;
    overflow-y: auto;
    box-shadow: 0.5rem -0.0125rem 0.25rem -0.25rem rgba(204,204,204,1);
  }

  ul {
    list-style: none;
  }

  li:not(:first-child) {
    padding-top: 1rem;
  }

  li(:last-child) {
    padding-bottom: 1rem;
  }
</style>
`;

const html = `
  <ul>
  </ul>
`;

export interface INavigationOption {
  displayText: string;
  href: string;
}

export class GalDocAppSidePanel extends GalCustomElement {
  private static templateId: string = '';
  private static document: Document;

  private static readonly navigationOptions: Readonly<INavigationOption[]> = [
    {
      displayText: 'Button',
      href: '/button'
    }, {
      displayText: 'Modal',
      href: '/Modal'
    }
  ];

  public static register(document: Document) {
    GalDocAppSidePanel.templateId = registerGalCustomElement(
      document,
      GalDocAppSidePanel,
      'gal-doc-app-side-panel',
      html,
      styles);

    GalDocAppSidePanel.document = document;
  }

  connectedCallback() {
    if (!this.shadowRoot) {
      return;
    }

    const navigationOptions = this.shadowRoot.querySelector('ul');

    if (!navigationOptions) {
      return;
    }
  
    GalDocAppSidePanel.navigationOptions.forEach(no => {
      const navigationOption = GalDocAppSidePanel.document.createElement('li');

      navigationOption.innerHTML = `
        <a href=${no.href}>
          ${no.displayText}
        </a>
      `
      navigationOptions.appendChild(navigationOption);
    });
  }

  constructor() {
    super(GalDocAppSidePanel.templateId);

    this.setAttribute('role', 'navigation');
  }
}
