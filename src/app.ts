import { Bridge } from './lib/utilities/bridge';
import { GalButton } from './button';
import { ModalEvent } from './modal';

type ButtonEvent = 'otro-button' | 'otro-otro-button';

export class App {
  private countUp = 0;
  private countDown = 0;

  constructor() {
    const button = document.querySelector('#primero-button');
    const button2 = document.querySelector('#segundo-button');
    const dialog = document.querySelector('#dialog') as HTMLDialogElement;
    const button3 = document.createElement('button', { is: 'gal-button' }) as GalButton;

    button3.setAttribute('color', 'accent');
    button3.setAttribute('font-size', 'extra-large');
    button3.innerHTML = 'I Just dynamically created this button inside a modal using the bridge pattern';

    const modalBridge = Bridge.open<HTMLElement, ModalEvent>(button3);

   modalBridge.route<number>('something', (value: number) => {
      console.log(`Something, dynamically transported from Modal: ${value}`);

      setTimeout(() => {
        const div = document.createElement('div');

        div.innerHTML = 'I just replaced a dynamically generated component inside a modal with another dynamically generated component after 3 seconds, and I\'ll do it again too, with an input field next';

        modalBridge.broadcast(div);

        setTimeout(() => {
          const input = document.createElement('input');

          input.placeholder = 'Yep I\'m new here! :)';
          
          modalBridge.broadcast(input);
        }, 3000);
      }, 3000);
    });

    dialog!.setAttribute('component-id', modalBridge.channelId);
    dialog!.style.display = 'block';

    const bridge = Bridge.open<string, ButtonEvent>(String(this.countDown));

    const receiver = Bridge.connect<string, string, ButtonEvent>(bridge.channelId, (value: string) => {
      console.log(`Count Down: ${value}`);
    });

    bridge.route<string>('otro-button', (value: string) => {
      console.log(`Count Up: ${value}`);
    });

    button!.addEventListener('click', () => {
      bridge.broadcast(String(++this.countUp));
    });

    button2!.addEventListener('click', () => {
      receiver!.respond('otro-button', String(++this.countDown));
    });
  }
}

export * from './modal';
export * from './button';
export * from './lib/utilities/bridge';