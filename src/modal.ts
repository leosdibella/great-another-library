import { Bridge, Receiver } from './lib/utilities/bridge';

export type ModalEvent = 'something' | 'something-else';

export class GalModal extends HTMLDialogElement {
  private static nextId = 0;
  static get observedAttributes(): string[] {
    return ['component-id'];
  }

  #componentId: string = '';
  #componentElement?: HTMLElement;
  #componentReceiver?: Receiver<HTMLElement, unknown, ModalEvent>;

  private destroyComponent() {
    if (this.#componentElement) {
      this.removeChild(this.#componentElement);

      if (this.#componentReceiver) {
        this.#componentReceiver.disconnect();
      }
    }
  }

  #attributes: Readonly<
    Partial<Record<string, (from: string, to: string) => void>>
  > = Object.freeze<
    Partial<Record<string, (from: string, to: string) => void>>
  >({
    'component-id': (from, to) => {
      this.destroyComponent();

      this.#componentReceiver = Bridge.connect<HTMLElement, number, ModalEvent>(to, value => {
        this.removeChild(this.#componentElement!);
        this.#componentElement = value;
        this.#componentReceiver!.respond('something', ++GalModal.nextId);
        this.appendChild(this.#componentElement);
      });
      
      if (this.#componentReceiver) {
        this.#componentElement = this.#componentReceiver.value;
        this.#componentReceiver.respond('something', ++GalModal.nextId);
      }
  
      if (this.#componentElement) {
        this.appendChild(this.#componentElement);
      }
    }
  });

  public set componentId(componentId: string) {
    this.#componentId = componentId;
  }

  public get componentId() {
    return this.#componentId;
  }

  connectedCallback() {}

  disconnectedCallback() {
    this.destroyComponent();
  }

  attributeChangedCallback(name: string, from: string, to: string) {
    if (from === to) {
      return;
    }

    const attribute = this.#attributes[name];

    if (attribute) {
      attribute(from, to);
    }
  }

  constructor() {
    super();
  }
}

customElements.define('gal-modal', GalModal, { extends: 'dialog' });