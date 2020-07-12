import { isNonEmptyString } from "./utilities";

interface IGalCustomElement<T = unknown> {
  tag: string;
  document?: Document;
  html: string;
  styles?: string;
  observedAttributes?: T[];
}

interface IGalExtendedCustomElement<T = unknown> {
  document?: Document;
  is: string;
  extends: string;
  observedAttributes?: T[];
}

export interface IGalCustomElementDefinition {
  document: Document;
}

export function GalCustomElement<T>(galCustomElement: IGalCustomElement<T>) {
  return function<S extends CustomElementConstructor>(customElement: S) {
    const defaultObservedAttributes: T[] = [];
    const defaultDocument: Document = galCustomElement.document || document;
    const template = defaultDocument.createElement('template');

    if (!isNonEmptyString(galCustomElement.tag)) {
      throw new Error('GalCustomElement constructor error: tag cannot be empty!');
    }

    const templateId = `${galCustomElement.tag}-template`;

    if (customElements.get(galCustomElement.tag)) {
      throw new Error('GalCustomElement constructor error: duplicate custom element tag detected!');
    }

    template.setAttribute('id', templateId);
    template.innerHTML = `${galCustomElement.styles || ''}${galCustomElement.html}`;

    const galCustomElementDefintion = class GalCustomElementDefinition extends customElement {
      public static get observedAttributes() {
        return galCustomElement.observedAttributes || defaultObservedAttributes;
      }
      
      public get document() {
        return defaultDocument;
      }

      public static get document() {
        return defaultDocument;
      }

      public static get tag() {
        return galCustomElement.tag;
      }
    
      constructor(...args: any[]) {
        super();
        
        this.attachShadow({ mode: 'open' }).appendChild((template).content.cloneNode(true));
      }
    };

    customElements.define(galCustomElement.tag, galCustomElementDefintion);
    defaultDocument.body.appendChild(template);

    return galCustomElementDefintion;
  }
}

export function GalExtendedCustomElement<T>(galExtendedCustomElement: IGalExtendedCustomElement<T>) {
  return function<S extends CustomElementConstructor>(customElement: S) {
    const defaultObservedAttributes: T[] = [];
    const defaultDocument: Document = galExtendedCustomElement.document || document;

    const galExtendedCustomElementDefintion = class GalExtendedCustomElementDefintion extends customElement {
      public static get observedAttributes() {
        return galExtendedCustomElement.observedAttributes || defaultObservedAttributes;
      }

      public static get document() {
        return defaultDocument;
      }

      constructor(...args: any[]) {
        super();
      }
    };

    customElements.define(galExtendedCustomElement.is, galExtendedCustomElementDefintion, { extends: galExtendedCustomElement.extends });

    return galExtendedCustomElementDefintion;
  }
}