function isElementSelfClosing(tag) {
  const selfClosingTags = ['br', 'img'];
  return selfClosingTags.indexOf(tag) !== -1;
}

function renderChildren(children) {
  const renderedChildren = children.map(renderToHtml);
  return {
    html: renderedChildren.map(obj => obj.html).join(''),
    mountData: renderedChildren.map(obj => obj.mountData)
  };
}

export default function renderToHtml(element) {
  const { type } = element;
  if (type === 'wrapper') {
    return renderChildren(element.children);
  }
  if (type === 'element') {
    const { tag, attribs, children } = element;
    const attribsStr = Object.keys(attribs).map(key => {
      if (key === 'className') {
        if (Array.isArray(attribs.className)) {
          return ` class="${attribs.className.join(' ')}"`;
        }
        return ` class="${attribs.className}"`;
      }
      return ` ${key}="${attribs[key]}"`;
    }).join('');
    if (isElementSelfClosing(tag)) {
      return {
        html: `<${tag}${attribsStr}/>`,
        mountData: null
      };
    } else {
      const renderedChildren = renderChildren(element.children);
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
        mountData = viewObj.fetchProps();
      }
      rendered = renderToHtml(viewObj.render(mountData ? mountData : props));
    } else {
      rendered = renderToHtml(view(props));
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
