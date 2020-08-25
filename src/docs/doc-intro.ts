import { GalCustomElement } from '../lib/utilities';

const styles = `
<style>
  h1 {
    margin-top: 0;
  }
</style>
`;

const html = `
  <h1>
    Introduction
  </h1>
  <p>
    Great another library (<abbr>Gal</abbr> for short) is a thin library that aims to reduce the copious amounts of
    boiler plate code that comes along with using native web components.
    Additionally, there are several utilities included as well to address a few common front end needs such as,
  </p>
  <ul>
    <li>
      Router
    </li>
    <li>
      UI Component Library
    </li>
    <li>
      Enhanced Local/Session Storage
    </li>
  </ul>
  <h2>
    Mission Statement
  </h2>
  <p>
    The goal of this library is to provide an easy way to develop with native web components alongside a
    modern frontend toolchain. It also aims to reduce the hurdles once might face when developing a new
    application or library. As such the follow items are of particular importance,
  </p>
  <ul>
    <li>
      <div>
        Unopinionated
      </div>
      <p>
        Gal attempts to get out of your way as much as possible, it only exists to reduce boilerplate,
        not to enfore any dogma. That being said, a few choices were made in order to keep things simple
        and approachable so there are a few limitations to bear in mind, mostly with regards to how things
        are named.
      </p>
    </li>
    <li>
      <div>
        Cross Browser Support
      </div>
      <p>
        Gal attempts to support all major browsers including legacy browsers like IE11, basically it will run
        in any browaer that can support native web components, either via DOM API or ia polyfill.
      </p>
    </li>
    <li>
      <div>
        Accessible
      </div>
      <p>
        Gal is committed to meeting WCAG compliance standards with all of the UI components it provides.
      </p>
    </li>
    <li> 
      <div>
        Performant
      </div>
      <p>
        Gal will not introduce significant burden on the browser. Not in bundle size nor in resource utilization.
      </p>
    </li>
  </ul>
`;

@GalCustomElement({
  styles,
  html,
  tag: 'gal-doc-intro',
})
export class GalDocIntro extends HTMLElement {}
