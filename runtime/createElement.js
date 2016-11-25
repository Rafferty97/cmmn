function normaliseChildren(children) {
  let normChildren = [];
  children.forEach(child => {
    if (child == null) return;
    if (typeof child === 'object' && child.hasOwnProperty('type')) {
      normChildren.push(child);
      return;
    }
    if (typeof child === 'string') {
      if (normChildren.length > 0 && normChildren[normChildren.length-1].type === 'text') {
        normChildren[normChildren.length-1].value += child;
        return;
      }
      normChildren.push({
        type: 'text',
        value: child
      });
      return;
    }
    if (Array.isArray(child)) {
      normChildren = normChildren.concat(normaliseChildren(child));
      return;
    }
  });
  return normChildren;
}

export default function createElement(tag, attribs, ...children) {
  if (typeof tag === 'string') {
    return {
      type: (tag === 'wrapper' ? 'wrapper' : 'element'),
      tag,
      attribs: attribs || {},
      children: normaliseChildren(children)
    };
  }
  if (typeof tag === 'function') {
    if (tag.prototype && tag.prototype.render instanceof Function) {
      return {
        type: 'view',
        view: tag,
        attribs: attribs || {},
        children: normaliseChildren(children)
      };
    } else {
      return {
        type: 'pureview',
        view: tag,
        attribs: attribs || {},
        children: normaliseChildren(children)
      };
    }
  }
  throw new TypeError('JSX Element is not a string, class or function');
}
