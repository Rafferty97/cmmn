function isElementSelfClosing(tag) {
  const selfClosingTags = ['br', 'img', 'link', 'meta', 'hr'];
  return selfClosingTags.indexOf(tag) !== -1;
}

async function renderChildren(children, data, options) {
  const renderedChildren = await Promise.all(children.map(child => renderToHtml(child, data, options)));
  return {
    html: renderedChildren.map(obj => obj.html).join(''),
    mountData: renderedChildren.map(obj => obj.mountData)
  };
}

async function renderToHtml(element, data, options = {}) {
  const publicPath = options.publicPath || '/';
  const { type } = element;
  if (type === 'wrapper') {
    return renderChildren(element.children, data, options);
  }
  if (type === 'element') {
    const { tag, attribs, children } = element;
    const attribsStr = Object.keys(attribs).map(key => {
      if (attribs[key] == null) return;
      if (key === 'className') {
        if (Array.isArray(attribs.className)) {
          return ` class="${attribs.className.join(' ')}"`;
        }
        return ` class="${attribs.className}"`;
      }
      if (key === 'src' || key === 'href') {
        if (attribs[key].substr(0, 2) === '*/') {
          return ` ${key}="${publicPath}${attribs[key].substr(2)}"`;
        }
      }
      return ` ${key}="${attribs[key]}"`;
    }).join('');
    if (isElementSelfClosing(tag)) {
      return {
        html: `<${tag}${attribsStr}/>`,
        mountData: null
      };
    } else {
      const renderedChildren = await renderChildren(element.children, data, options);
      return {
        html: `<${tag}${attribsStr}>${renderedChildren.html}</${tag}>`,
        mountData: renderedChildren.mountData
      };
    }
  }
  if (type === 'pureview' || type === 'view') {
    const { view, attribs, children } = element;
    const props = Object.assign({}, attribs, { children });
    let rendered = { html: '', mountData: null }, mountData = null;
    if (type === 'view') {
      const viewObj = new view();
      if (typeof viewObj.fetchProps === 'function') {
        mountData = await viewObj.fetchProps(props, data);
      }
      rendered = await renderToHtml(viewObj.render(mountData ? mountData : props), data, options);
    } else {
      rendered = await renderToHtml(view(props), data, options);
    }
    return {
      html: rendered.html,
      mountData: [mountData, rendered.mountData]
    };
  }
  if (type === 'text') {
    return {
      html: element.value,
      mountData: null
    };
  }
}

export default renderToHtml;
