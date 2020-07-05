export abstract class GalCustomElement extends HTMLElement {
  constructor(templateId: string) {
    super();

    let template = templateId ? document.getElementById(templateId) : null;

    if (template) {
      this.attachShadow({ mode: 'open' }).appendChild((template as HTMLTemplateElement).content.cloneNode(true));
    }
  }
}