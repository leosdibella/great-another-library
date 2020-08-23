export interface IGalEvent {
  eventName: string;
  eventFunctionName: string;
  querySelector: string;
  querySelectorIndex: number;
}

export interface IGalParsedHtml {
  template: string;
  events: IGalEvent[];
}

const galEventPrefix = 'gal-on:';
const galEventRegex = /gal-on:[a-zA-Z0-9]+/g;

const galDomParser = (function () {
  const domParser = new DOMParser();

  return function (html: string): HTMLCollection | undefined {
    const body =
      domParser.parseFromString(html, 'text/html').querySelector('body') ||
      undefined;

    return body ? body.children : undefined;
  };
})();

function htmlCollectionToArray(htmlCollection: HTMLCollection) {
  return Object.keys(htmlCollection)
    .map((k) => htmlCollection.item(+k))
    .filter((e) => !!e) as Element[];
}

export function parseGalHtml(html: string): IGalParsedHtml | undefined {
  let htmlCollection = galDomParser(html);

  if (!htmlCollection) {
    return undefined;
  }

  const parsedHtml: IGalParsedHtml = {
    template: html,
    events: [],
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
          eventName: attributes[i].name.substring(
            galEventPrefix.length,
            attributes[i].name.length,
          ),
          querySelector,
          querySelectorIndex: querySelectorIndices[querySelector] as number,
        });
      }
    }

    if (!element.children.length) {
      continue;
    }

    htmlCollectionToArray(element.children).forEach((e) => stack.push(e));
  }

  return parsedHtml;
}
