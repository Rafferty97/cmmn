export default function mount(node, element, mountData = null) {
  const { type } = element;
  if (type === 'wrapper') {
    let currNode = node;
    for (let i=0; i<element.children.length; i++) {
      mount(currNode, element.children[i], mountData[i]);
      currNode = currNode.nextSibling;
    }
  }
  if (type === 'element') {
    for (let i=0; i<element.children.length; i++) {
      mount(node.childNodes[i], element.children[i], mountData[i]);
    }
  }
  if (type === 'view' || type === 'pureview') {
    const { view, attribs, children } = element;
    const props = Object.assign({}, attribs, { children });
    if (type === 'view') {
      const viewObj = new view();
      if (typeof viewObj.mount === 'function') viewObj.mount(node, mountData[0]);
      mount(node, viewObj.render(props), mountData[1]);
      if (typeof viewObj.postmount === 'function') viewObj.postmount(node, mountData[0]);
    } else {
      mount(node, view(props), mountData[1]);
    }
  }
}
