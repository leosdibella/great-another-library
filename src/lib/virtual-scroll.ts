import { GalCustomElement } from "./utilities";

const styles = `
<style>
</style>
`;

const html = `
<div class="gal-virtual-scroll-items">
</div>
`;

export type OverflowProperty = 'overflow' | 'overflowX' | 'overflowY';

export interface IGalVirtalScrollItem extends HTMLElement {
  galVirtualScrollItem: unknown;
}

export enum GalVirtualScrollDirection {
  vertical = 'vertical',
  horizontal = 'horizontal',
  all = 'all'
}

@GalCustomElement<GalVirtualScroll>({
  html,
  styles,
  tag: 'gal-virtual-scroll',
  observedAttributes: {
    'items-id': '', 
    'custom-element-id': '',
    'viewport-height': '', 
    'viewport-width': '',
    'scroll-direction': ''
  },
  observedAttributesMapName: 'attributesMap'
})
export class GalVirtualScroll extends HTMLElement {
  private static readonly _directionMap: Readonly<Record<GalVirtualScrollDirection, OverflowProperty>> = {
    [GalVirtualScrollDirection.vertical]: 'overflowY',
    [GalVirtualScrollDirection.horizontal]: 'overflowX',
    [GalVirtualScrollDirection.all]: 'overflow'
  }

  #itemsId: string = '';
  #customElementId: string = '';
  #items: unknown[] = [];
  #customElement?: IGalVirtalScrollItem;
  #viewportHeight: string = '100%';
  #viewportWidth: string = '100%';
  #scrollDirection:  GalVirtualScrollDirection = GalVirtualScrollDirection.vertical;

  private readonly _onScroll = () => {

  };

  public attributesMap: Readonly<
    Partial<Record<keyof GalVirtualScroll, (from: string, to: string) => void>>
  > = {
    itemsId: (from, to) => {
    },
    customElementId: (from, to) => {
    },
    viewportHeight: (from, to) => {
    },
    viewportWidth: (from, to) => {
    },
    scrollDirection: (from, to) => {
    }
  };

  public set itemsId(itemsId: string) {
    
  }

  public get itemsId() {
    return this.#itemsId;
  }

  public set items(items: unknown[]) {
    
  }

  public get items() {
    return this.#items;
  }

  public set customElementId(customElementId: string) {

  }

  public get customElementId() {
    return this.#customElementId;
  }

  public set customElement(customElement: IGalVirtalScrollItem | undefined) {
  
  }

  public get customElement() {
    return this.#customElement;
  }

  public set scrollDirection(scrollDirection: GalVirtualScrollDirection) {
    this.#scrollDirection = Object.keys(GalVirtualScrollDirection).indexOf(scrollDirection) > -1 ? scrollDirection : GalVirtualScrollDirection.vertical;

    this.style[GalVirtualScroll._directionMap[this.#scrollDirection]] = 'auto';
  }

  public get scrollDirection() {
    return this.#scrollDirection;
  }

  public set viewportHeight(viewportHeight: string) {
    this.#viewportHeight = viewportHeight;
  }

  public get viewportHeight() {
    return this.#viewportHeight;
  }

  public set viewportWidth(viewportWidth: string) {
    this.#viewportWidth = viewportWidth;
  }

  public get viewportWidth() {
    return this.#viewportWidth;
  }

  public connectedCallback() {
    this.addEventListener('scroll', this._onScroll);
  }

  public disconnectedCallback() {
    this.removeEventListener('scroll', this._onScroll);
  }
}