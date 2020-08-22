import { isNonEmptyString, kebabCaseToCamelCase } from "./utilities";

interface IGalCustomElement<T> {
  tag: string;
  document?: Document;
  html: string;
  styles?: string;
  observedAttributes?: Record<string, keyof T | ''>;
  observedAttributesMapName?: keyof T;
}

interface IGalExtendedCustomElement<T> {
  document?: Document;
  is: string;
  extends: string;
  observedAttributes?: Record<string, keyof T | ''>;
  observedAttributesMapName?: keyof T;
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

const galEventPrefix = 'gal-on_';
const galEventRegex = /gal-on_[a-zA-Z0-9]+/g;

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

function getObservedAttributes<T>(preObservedAttributesMap?: Record<string, keyof T | ''>) {
  const observedAttributes: string[] = [];
  const observedAttributesMap: Record<string, keyof T> = {};

  if (preObservedAttributesMap) {
    const keys = Object.keys(preObservedAttributesMap);

    for (let i = 0; i < keys.length; ++i) {
      const key = keys[i];
      const attributeName = (preObservedAttributesMap[key] || kebabCaseToCamelCase(key)) as keyof T;

      observedAttributes.push(key);
      observedAttributesMap[key] = attributeName;
    }  
  }

  return {
    observedAttributes,
    observedAttributesMap
  };
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

        if (querySelectorIndices[querySelector] !== undefined) {
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
    const defaultDocument: Document = galCustomElement.document || document;
    const template = defaultDocument.createElement('template');

    const {
      observedAttributes,
      observedAttributesMap
    } = getObservedAttributes<T>(galCustomElement.observedAttributes);

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
        return observedAttributes;
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

      public attributeChangedCallback(name: string, from: string, to: string) {
        if (!galCustomElement.observedAttributesMapName) {
          throw new Error('GalCustomElement attributeChangedCallback error: no observed attributes handler map name detected!');
        }

        if (from === to) {
          return;
        }

        const attributesMap = this[galCustomElement.observedAttributesMapName as keyof this];

        if (typeof attributesMap !== 'object' || attributesMap === null) {
          throw new Error('GalCustomElement attributeChangedCallback error: no observed attributes handler map object detected!');
        }
    
        const attributeChangeHandler = (attributesMap as Partial<Record<keyof T, (from: string, to: string) => void>>)[observedAttributesMap[name]];
    
        if (attributeChangeHandler) {
          attributeChangeHandler(from, to);
        }
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
    const defaultDocument: Document = galExtendedCustomElement.document || document;
    
    const {
      observedAttributes,
      observedAttributesMap
    } = getObservedAttributes<T>(galExtendedCustomElement.observedAttributes);

    const galExtendedCustomElementDefintion = class GalExtendedCustomElementDefintion extends customElement {
      public static get observedAttributes() {
        return observedAttributes;
      }

      public static get document() {
        return defaultDocument;
      }

      public attributeChangedCallback(name: string, from: string, to: string) {
        if (!galExtendedCustomElement.observedAttributesMapName) {
          throw new Error('GalExtendedCustomElement attributeChangedCallback error: no observed attributes handler map name detected!');
        }

        if (from === to) {
          return;
        }

        const attributesMap = this[galExtendedCustomElement.observedAttributesMapName as keyof this];

        if (typeof attributesMap !== 'object' || attributesMap === null) {
          throw new Error('GalExtendedCustomElement attributeChangedCallback error: no observed attributes handler map object detected!');
        }
    
        const attributeChangeHandler = (attributesMap as Partial<Record<keyof T, (from: string, to: string) => void>>)[observedAttributesMap[name]];
    
        if (attributeChangeHandler) {
          attributeChangeHandler(from, to);
        }
      }

      constructor(...args: any[]) {
        super();
      }
    };

    customElements.define(galExtendedCustomElement.is, galExtendedCustomElementDefintion, { extends: galExtendedCustomElement.extends });

    return galExtendedCustomElementDefintion;
  }
}