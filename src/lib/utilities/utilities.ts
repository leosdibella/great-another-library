const registeredCustomElements: Record<string, boolean> = {};

export function isNonEmptyString(value: unknown) {
  return typeof value === 'string' && value;
}

export function registerGalCustomElement<T extends CustomElementConstructor>(
  document: Document,
  customElement: T,
  tag: string,
  html: string,
  styles?: string
) {
  if (!isNonEmptyString(tag)) {
    return ''
  }

  const templateId = `${tag}-template`;

  if (registeredCustomElements[tag]) {
    return templateId;
  }
  
  const template = document.createElement('template');

  template.setAttribute('id', templateId);
  template.innerHTML = `${styles || ''}${html}`;
  customElements.define(tag, customElement);
  registeredCustomElements[tag] = true;
  document.body.appendChild(template);
  
  return templateId;
}