import { GalCustomElement, isNonEmptyString } from "./utilities";

export interface IRouteDefintion {
  customElementTag: string;
  url: string;
}

const html = '';

export class GalRouter extends GalCustomElement {
  private static readonly routeTagMap: Record<string, string> = {};
  private static routeElement?: GalRouter;

  public static get tag() {
    return 'gal-router';
  }

  public static get html() {
    return html;
  }

  private static route() {
    const url = window.location.hash.slice(1) || '/';
    GalRouter.resolveRoute(url);
  };

  public static registerRoutes(routeDefinitions: IRouteDefintion[]) {
    routeDefinitions.forEach(rd => {
      GalRouter.routeTagMap[rd.url] = rd.customElementTag;
    });

    window.addEventListener('load', GalRouter.route);
    window.addEventListener('hashchange', GalRouter.route);
  }
  
  public static register(document: Document) {
    GalCustomElement.registerGalCustomElement(document, GalRouter);
  }

  public static resolveRoute = (route: string) => {
    if (!GalRouter.routeElement) {
      throw new Error('No router component found.');
    }

    const tag = GalRouter.routeTagMap[route];

    if (!tag || !isNonEmptyString(tag)) {
      throw new Error(`No route found matching name: ${route}.`);
    }

    if (!customElements.get(tag)) {
      throw new Error(`Route with name: ${route} found, but no matching custom element: ${tag}.`);
    }

    if (GalRouter.routeElement.shadowRoot) {
      const customElementInstance = GalRouter.document.createElement(tag);

      GalRouter.routeElement.shadowRoot.innerHTML = '';
      GalRouter.routeElement.shadowRoot.appendChild(customElementInstance);
    }
  };

  public connectedCallback() {
    GalRouter.routeElement = this;
  }

  constructor() {
    super(GalRouter.tag);
  }
}