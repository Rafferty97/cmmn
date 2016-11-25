import router from 'cmmn-router';
import datasource from 'cmmn-datasource';
import { renderToHtml } from 'cmmn';

const placeholder = 'console.error(\'Mount data not attached\');';

export default async function(props, res) {
  const page = router(props);
  page.children[0].children.unshift({
    type: 'element',
    tag: 'link',
    attribs: {
      href: CMMN_PUBLIC_PATH + 'styles.css',
      rel: 'stylesheet',
      type: 'text/css'
    },
    children: []
  });
  page.children[1].children.push({
    type: 'element',
    tag: 'script',
    attribs: {},
    children: [{
      type: 'text',
      value: placeholder
    }]
  });
  page.children[1].children.push({
    type: 'element',
    tag: 'script',
    attribs: {
      src: CMMN_PUBLIC_PATH + 'scripts.js'
    },
    children: []
  });
  const renderedPage = await renderToHtml(page, datasource(props), {
    publicPath: CMMN_PUBLIC_PATH
  });
  renderedPage.html = renderedPage.html.replace(placeholder, [
    `window.__PROPS__ = ${JSON.stringify(props)};`,
    `window.__MOUNT__DATA__ = ${JSON.stringify(renderedPage.mountData[1])};`
  ].join('\n'));
  res.end(renderedPage.html);
}
