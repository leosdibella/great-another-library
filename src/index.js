import { GalDocApp, GalDocAppHeader, GalDocAppMain, GalDocAppSidePanel, GalDocButton, GalDocModal } from './docs';
import { GalButton, GalRouter } from './lib'

[
  GalButton,
  GalRouter
].forEach(gce => gce.register(document));

[
  GalDocAppHeader,
  GalDocAppSidePanel,
  GalDocAppMain,
  GalDocApp,
  GalDocButton,
  GalDocModal
].forEach(gce => gce.register(document));

document.body.appendChild(new GalDocApp());

GalRouter.registerRoutes([{
  url: '/button',
  customElementTag: GalDocButton.tag
}, {
  url: '/modal',
  customElementTag: GalDocModal.tag
}]);