import { IGalParsedHtml } from './interfaces';

export const galEventPrefix = '_GalEvent_';

const galEventBindingPrefix = 'gal-on:';
const galEventRegex = /gal-on:[a-zA-Z0-9]+/g;

const galDomParser = (function () {
  const domParser = new DOMParser();

  return function (html: string) {
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

export function parseGalHtml(html: string) {
  let htmlCollection = galDomParser(html);

  if (!htmlCollection) {
    return undefined;
  }

  const parsedHtml: IGalParsedHtml = {
    template: html,
    events: []
  };

  const stack = htmlCollectionToArray(htmlCollection);
  const querySelectorIndices: Record<string, number | undefined> = {};

  while (stack.length) {
    const element = stack.pop()!;
    const attributes = element.attributes;
    const keys = Object.keys(attributes);

    for (let i = 0; i < keys.length; ++i) {
      if (attributes[i].name.match(galEventRegex)) {
        const eventFunctionName = attributes[i].nodeValue || '';
        const querySelector = `[${attributes[i].name}='${eventFunctionName}']`;

        if (querySelectorIndices[querySelector] !== undefined) {
          ++querySelectorIndices[querySelector]!;
        } else {
          querySelectorIndices[querySelector] = 0;
        }

        parsedHtml.events.push({
          eventFunctionName,
          eventName: attributes[i].name.substring(
            galEventBindingPrefix.length,
            attributes[i].name.length
          ),
          querySelector,
          querySelectorIndex: querySelectorIndices[querySelector]!
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
