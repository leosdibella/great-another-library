import { GalAttribute, galAttributes } from './enum';
import { getGalMixin } from './gal-mixin';
import { IGalParsedHtml } from './interfaces';
import { isWellDefined } from './utilities';

export const galEventPrefix = 'GalEvent_';

const galAttributePrefixes = (() => {
  const attributePrefixes: Partial<Record<GalAttribute, string>> = {};

  galAttributes.forEach((at) => {
    attributePrefixes[at] = `gal-${at}:`;
  });

  return attributePrefixes;
})();

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
    events: [],
    mixins: []
  };

  const stack = htmlCollectionToArray(htmlCollection);
  const querySelectorIndices: Record<string, number | undefined> = {};

  while (stack.length) {
    const element = stack.pop()!;
    const attributes = element.attributes;
    const keys = Object.keys(attributes);

    for (let i = 0; i < keys.length; ++i) {
      const attribute = attributes[i];

      const galAttribute: GalAttribute | undefined = galAttributes.filter(
        (ga) => attribute.name.indexOf(galAttributePrefixes[ga]!) === 0
      )[0];

      if (!galAttribute) {
        continue;
      }

      const galAttributePrefixe = galAttributePrefixes[galAttribute]!;
      const sanitizedAttributeName = attribute.name.substring(
        galAttributePrefixe.length,
        attribute.name.length
      );
      const attributeValue = attribute.nodeValue || '';
      const querySelector = `[${attribute.name}='${attributeValue}']`;

      if (isWellDefined(querySelectorIndices[querySelector])) {
        ++querySelectorIndices[querySelector]!;
      } else {
        querySelectorIndices[querySelector] = 0;
      }

      switch (galAttribute) {
        case GalAttribute.event: {
          parsedHtml.events.push({
            eventFunctionName: attributeValue,
            eventName: sanitizedAttributeName,
            querySelector,
            querySelectorIndex: querySelectorIndices[querySelector]!
          });
        }
        case GalAttribute.mixin: {
          const mixin = getGalMixin(sanitizedAttributeName);

          if (mixin) {
            parsedHtml.mixins.push(mixin);
          }
        }
      }
    }

    if (element.children.length) {
      htmlCollectionToArray(element.children).forEach((e) => stack.push(e));
    }
  }

  return parsedHtml;
}
