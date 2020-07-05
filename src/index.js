import { GalDocApp, GalDocAppHeader, GalDocAppMain, GalDocAppSidePanel } from './docs';

GalDocAppHeader.register(document);
GalDocAppSidePanel.register(document);
GalDocAppMain.register(document);
GalDocApp.register(document);

document.body.appendChild(new GalDocApp());