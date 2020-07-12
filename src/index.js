import { GalDocApp, GalDocAppHeader, GalDocAppMain, GalDocAppSidePanel, GalDocButton, GalDocIntro, GalDocModal } from './docs';
import { GalButton, GalRouter } from './lib';

document.body.appendChild(new GalDocApp());

GalRouter.registerRoutes([{
  url: '/',
  customElementTag: GalDocIntro.tag
}, {
  url: '/button',
  customElementTag: GalDocButton.tag
}, {
  url: '/modal',
  customElementTag: GalDocModal.tag
}]);