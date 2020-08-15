import { GalCustomElement, doNothing } from "./utilities";

const styles = `
<style>
    :host {

    }

    ::slotted(label) {
        font-weight: bold;
    }

    ::slotted(input) {
        border: none;
        background-color: transparent;
        border-radius: 0;
        flex: 1 0 auto;
    }

    ::slotted(input:focus) {
        outline: none;
    }

    ::slotted(i) {
        background-color: transparent;
    }

    .gal-form-field-container {
        border: 0.0125rem solid #000000;
        border-radius: 0.025rem;
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .gal-form-field-container-focused {
        outline: 0.0125rem solid #000000;
    }
</style>
`;

const html = `
    <slot name="label">
    </slot>
    <div
        class="gal-form-field-container">
        <slot name="prefix">
        </slot>
        <slot name="input">
        </slot>
        <slot name="suffix">
        </slot>
    </div>
    <div>
        <slot name="description">
        </slot>
    </div>
    <div>
        <slot name="message">
        </slot>
    </div>
`;

enum Position {
    single = 0,
    prefixed = 1 << 0,
    suffixed = 1 << 1,
    all = prefixed | suffixed
}

@GalCustomElement({
    styles,
    html,
    tag: 'gal-form-field',
    observedAttributes: [
        'fontSize'
    ]
  })
  export class GalFormField extends HTMLElement {
    private static nextId = 0;
    private static readonly remToPixels = 16;
    private static readonly verticalPaddingModifier = 0.5;
    private static readonly horizontalPaddingModifier = 0.75;
        
    #nextId = ++GalFormField.nextId;
    #label?: HTMLLabelElement;
    #input?: HTMLInputElement;
    #suffix?: HTMLElement;
    #prefix?: HTMLElement;
    #fontSize: string = '1.5rem';
    #formFieldContainer!: HTMLDivElement;

    #attributes: Readonly<
        Partial<Record<keyof GalFormField, (from: string, to: string) => void>>
    > = {
        fontSize: (from: string, to: string) => {
            this.fontSize = to;
        }
    };

    #fontSizeMap: Readonly<Record<Position, (verticalPadding: number, horizontalPadding: number, fontSize: number) => void>> = {
        [Position.single]: doNothing,
        [Position.prefixed]: (verticalPadding: number, horizontalPadding: number, fontSize: number) => {
            this.#prefix!.style.padding = `${verticalPadding}rem 0 ${verticalPadding}rem ${horizontalPadding}rem`;
            this.#prefix!.style.fontSize = `${fontSize}rem`;
        },
        [Position.suffixed]: (verticalPadding: number, horizontalPadding: number, fontSize: number) => {
            this.#suffix!.style.padding = `${verticalPadding}rem ${horizontalPadding}rem ${verticalPadding}rem 0`;
            this.#suffix!.style.fontSize = `${fontSize}rem`;
        },
        [Position.all]: (verticalPadding: number, horizontalPadding: number, fontSize: number) => {
            this.#fontSizeMap[Position.prefixed](verticalPadding, horizontalPadding, fontSize);
            this.#fontSizeMap[Position.suffixed](verticalPadding, horizontalPadding, fontSize);
        }
    };

    #focus = () => {
        this.#formFieldContainer.classList.add('gal-form-field-container-focused');
    };

    #blur = () => {
        this.#formFieldContainer.classList.remove('gal-form-field-container-focused');
    };

    private resizeFormField() {
        const fontSizeInRem = parseFloat(getComputedStyle(document.body).fontSize) / GalFormField.remToPixels * parseFloat(this.#fontSize);
        const verticalPadding = fontSizeInRem * GalFormField.verticalPaddingModifier;
        const horizontalPadding = fontSizeInRem * GalFormField.horizontalPaddingModifier;
        
        let position: Position = Position.single;

        if (this.#prefix) {
            position |= Position.prefixed;
        }

        if (this.#suffix) {
            position |= Position.suffixed;
        }

        if (this.#input) {
            this.#input.style.padding = `${verticalPadding}rem ${horizontalPadding}rem`;
            this.#input.style.fontSize = `${fontSizeInRem}rem`;
        }

        this.#fontSizeMap[position](verticalPadding, horizontalPadding, fontSizeInRem);
    }

    public get fontSize() {
        return this.#fontSize;
    }

    public set fontSize(fontSize: string) {
        if (this.#fontSize !== fontSize) {
            this.#fontSize = fontSize;
            this.resizeFormField();
        }
    }

    public attributeChangedCallback(name: keyof GalFormField, from: string, to: string) {
        if (from === to) {
          return;
        }
    
        const attribute = this.#attributes[name];
    
        if (attribute) {
          attribute(from, to);
        }
      }

    disconnectedCallback() {
        if (this.#input) {
            this.#input.removeEventListener('focus', this.#focus);
            this.#input.removeEventListener('blur', this.#blur);
        }
    }

    connectedCallback() {
        if (this.shadowRoot) {
            this.#formFieldContainer = this.shadowRoot.querySelector('.gal-form-field-container') as HTMLDivElement;
        }
        
        this.#label = this.querySelector<HTMLLabelElement>('[slot="label"]') || undefined;
        this.#input = this.querySelector<HTMLInputElement>('[slot="input"]') || undefined;
        this.#prefix = this.querySelector<HTMLInputElement>('[slot="prefix"]') || undefined;
        this.#suffix = this.querySelector<HTMLInputElement>('[slot="suffix"]') || undefined;

        if (this.#label) {
            this.#label.htmlFor = `gal-form-field-input-${this.#nextId}`;
        }

        if (this.#input) {
            this.#input.id = `gal-form-field-input-${this.#nextId}`;
            this.#input.addEventListener('focus', this.#focus);
            this.#input.addEventListener('blur', this.#blur);
        }

        this.resizeFormField();
    }

    constructor() {
      super();
    }
  }