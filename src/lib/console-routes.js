// Print Routes based on: https://github.com/expressjs/express/issues/3308#issuecomment-300957572
function split(thing) {
  if (typeof thing === 'string') return thing.split('/');
  if (thing.fast_slash) return '';

  const match = thing
    .toString()
    .replace('\\/?', '')
    .replace('(?=\\/|$)', '$')
    .match(/^\/\^((?:\\[.*+?^${}()|[\]\\/]|[^.*+?^${}()|[\]\\/])*)\$\//);

  return match
    ? match[1].replace(/\\(.)/g, '$1').split('/')
    : `<complex: ${thing.toString()}>`;
}

function internalPrintRoutes(path, layer) {
  if (layer.route) {
    layer.route.stack.forEach(
      internalPrintRoutes.bind(null, path.concat(split(layer.route.path))),
    );
  } else if (layer.name === 'router' && layer.handle.stack) {
    layer.handle.stack.forEach(
      internalPrintRoutes.bind(null, path.concat(split(layer.regexp))),
    );
  } else if (layer.method) {
    // eslint-disable-next-line no-console
    console.info(
      '%s /%s',
      layer.method.toUpperCase(),
      path.concat(split(layer.regexp)).filter(Boolean).join('/'),
    );
  }
}

module.exports = app => app._router.stack.forEach(internalPrintRoutes.bind(null, []));
