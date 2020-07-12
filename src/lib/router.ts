import { GalCustomElement, IGalCustomElementDefinition, isNonEmptyString } from "./utilities";

export interface IRouteDefintion {
  customElementTag: string;
  url: string;
}

const html = '';

export interface GalRouter extends IGalCustomElementDefinition {};

@GalCustomElement({
  html,
  tag: 'gal-router'
})
export class GalRouter extends HTMLElement {
  private static readonly routeTagMap: Record<string, string> = {};
  private static routeElement?: GalRouter;

  private static route() {
    const url = window.location.hash.slice(1) || '/';
    GalRouter.resolveRoute(url);
  };

  public static registerRoutes(routeDefinitions: IRouteDefintion[]) {
    routeDefinitions.forEach(rd => {
      GalRouter.routeTagMap[rd.url] = rd.customElementTag.toLowerCase();
    });

    window.addEventListener('load', GalRouter.route);
    window.addEventListener('hashchange', GalRouter.route);
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
      const customElementInstance = GalRouter.prototype.document.createElement(tag);

      GalRouter.routeElement.shadowRoot.innerHTML = '';
      GalRouter.routeElement.shadowRoot.appendChild(customElementInstance);
    }
  };

  public connectedCallback() {
    GalRouter.routeElement = this;
  }

  constructor() {
    super();
  }
}