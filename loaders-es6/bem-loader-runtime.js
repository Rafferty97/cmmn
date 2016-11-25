function toCamelCase(str) {
  return str.replace(/(\-\w)/g, function(part) {
    return part[1].toUpperCase();
  });
}

const identity = arg => arg;

function addMods(...mods) {
  const classes = [this.toString()];
  mods.forEach(_mod => {
    const mod = _mod.trim();
    if (mod === '') return;
    classes.push(this.mods[mod]);
  });
  return classes.join(' ') + ' ';
}

export default (styles = {}) => {
  const obj = {};
  Object.keys(styles).forEach(className => {
    const mods = className.split('--');
    const elements = mods.shift().split('__');
    let path = obj;
    for (const el of elements) {
      if (!path.hasOwnProperty(el)) {
        path[el] = { mods: {} };
        path[toCamelCase(el)] = path[el];
        path[el].with = addMods.bind(path[el]);
      }
      path = path[el];
    }
    if (mods.length !== 0) {
      const modStr = mods.join(' ');
      path.mods[modStr] = styles[className];
    } else {
      path.toString = identity.bind(null, styles[className] + ' ');
    }
  });
  return obj;
};
