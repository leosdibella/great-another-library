import {
  GalDocApp,
  GalDocAppHeader,
  GalDocAppMain,
  GalDocAppSidePanel,
  GalDocButton,
  GalDocIntro,
  GalDocModal,
  GalDocFormField,
  GalDocSelect,
} from './docs';
import {
  GalButton,
  GalFormField,
  GalSelect,
  GalOption,
  GalRouter,
} from './lib';

document.body.appendChild(new GalDocApp());

GalRouter.registerRoutes([
  {
    url: '/',
    customElementTag: GalDocIntro.tag,
  },
  {
    url: '/button',
    customElementTag: GalDocButton.tag,
  },
  {
    url: '/modal',
    customElementTag: GalDocModal.tag,
  },
  {
    url: '/formField',
    customElementTag: GalDocFormField.tag,
  },
  {
    url: '/select',
    customElementTag: GalDocSelect.tag,
  },
]);
