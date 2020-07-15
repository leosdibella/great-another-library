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

interface IGalEvent {
  eventName: string,
  eventFunctionName: string,
  querySelector: string;
  querySelectorIndex: number;
}

interface IGalParsedHtml {
  template: string;
  events: IGalEvent[];
}

const galEventPrefix = 'gal-on:';
const galEventRegex = /gal-on-[a-zA-Z0-9]+/g;

const galDomParser = (function () {
  const domParser = new DOMParser();

  return function(html: string): HTMLCollection | undefined {
    const body = domParser.parseFromString(html, 'text/html').querySelector('body') || undefined;

    return body ? body.children : undefined;
  }
}());

function htmlCollectionToArray(htmlCollection: HTMLCollection) {
  return Object.keys(htmlCollection)
               .map(k => htmlCollection.item(+k))
               .filter(e => e instanceof Element) as Element[];
}

function parseGalHtml(html: string): IGalParsedHtml | undefined {
  let htmlCollection = galDomParser(html);

  if (!htmlCollection) {
    return undefined;
  }

  const parsedHtml: IGalParsedHtml = {
    template: html,
    events: []
  };

  const stack: Element[] = htmlCollectionToArray(htmlCollection);
  const querySelectorIndices: Record<string, number | undefined> = {};

  while (stack.length) {
    const element = stack.pop() as Element;
    const attributes = element.attributes;
    const keys = Object.keys(attributes);
    
    for (let i = 0; i < keys.length; ++i) {
      if (attributes[i].name.match(galEventRegex)) {
        const eventFunctionName = attributes[i].nodeValue || '';
        const querySelector = `[${attributes[i].name}='${eventFunctionName}']`;
        const existingQuerySelectorIndex = querySelectorIndices[querySelector];

        if (existingQuerySelectorIndex !== undefined) {
          ++(querySelectorIndices[querySelector] as number);
        } else {
          querySelectorIndices[querySelector] = 0;
        }

        parsedHtml.events.push({
          eventFunctionName,
          eventName: attributes[i].name.substring(galEventPrefix.length, attributes[i].name.length),
          querySelector,
          querySelectorIndex: querySelectorIndices[querySelector] as number
        });
      }
    }

    if (!element.children.length) {
      continue;
    }

    htmlCollectionToArray(element.children).forEach(e => stack.push(e));
  }

  return parsedHtml;
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

    const parsedHtml = parseGalHtml(galCustomElement.html);

    if (!parsedHtml) {
      throw new Error('GalCustomElement constructor error: unable to parse valid html from template!');
    }

    template.setAttribute('id', templateId);
    template.innerHTML = `${galCustomElement.styles || ''}${parsedHtml.template}`;

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
        const events = (parsedHtml as IGalParsedHtml).events;

        for (let i = 0; i < events.length; ++i) {
          const event = (this[events[i].eventFunctionName as keyof this]) as (this[keyof this] & ((event: Event) => void));

          if (typeof event !== 'function' || !this.shadowRoot) {
            continue;
          }
          
          const eventBoundElement = this.shadowRoot.querySelectorAll(events[i].querySelector)[events[i].querySelectorIndex];

          if (!eventBoundElement) {
            continue;
          }
          
          eventBoundElement.addEventListener(events[i].eventName, event.bind(this));
        }
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