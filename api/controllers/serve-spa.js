/*!
 * Copyright (c) 2024 PLANKA Software GmbH
 * Licensed under the Fair Use License: https://github.com/plankanban/planka/blob/master/LICENSE.md
 */

const path = require('path');

module.exports = {
  friendlyName: 'Serve SPA',

  description: 'Serve the single-page application HTML file',

  fn: async function (_, exits) {
    const indexPath = path.join(sails.config.appPath, 'public', 'index.html');
    return exits.success(this.res.sendFile(indexPath));
  },
};
