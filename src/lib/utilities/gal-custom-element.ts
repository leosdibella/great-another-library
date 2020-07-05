import { isNonEmptyString } from "./utilities";

export interface IGalCustomElementConstructor extends CustomElementConstructor {
  new(): GalCustomElement;
  tag: string;
  document: Document;
  html: string;
  styles?: string;
}

const registeredCustomElements: Record<string, boolean> = {};

export abstract class GalCustomElement extends HTMLElement {
  public static document: Document;

  protected static registerGalCustomElement<T extends IGalCustomElementConstructor>(
    document: Document,
    galCustomElement: T
  ) {
    if (!isNonEmptyString(galCustomElement.tag)) {
      return ''
    }
  
    const templateId = `${galCustomElement.tag}-template`;
  
    if (registeredCustomElements[galCustomElement.tag]) {
      return templateId;
    }
    
    const template = document.createElement('template');
  
    galCustomElement.document = document;
    template.setAttribute('id', templateId);
    template.innerHTML = `${galCustomElement.styles || ''}${galCustomElement.html}`;
    customElements.define(galCustomElement.tag, galCustomElement);
    registeredCustomElements[galCustomElement.tag] = true;
    document.body.appendChild(template);
    
    return templateId;
  }

  constructor(tag: string) {
    super();

    const template = tag ? document.getElementById(`${tag}-template`) : null;

    if (template) {
      this.attachShadow({ mode: 'open' }).appendChild((template as HTMLTemplateElement).content.cloneNode(true));
    }
  }
}