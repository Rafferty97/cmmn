export { default as createElement } from './createElement';
export { default as renderToHtml } from './renderToHtml';
export { default as mount } from './mount';
export { default as renderPage } from './renderPage';

export function getPublicDir() {
  return CMMN_PUBLIC_DIR;
}

export function isClient() {
  return typeof window !== 'undefined';
}

export function isServer() {
  return !isClient();
}
