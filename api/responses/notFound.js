/*!
 * Copyright (c) 2024 PLANKA Software GmbH
 * Licensed under the Fair Use License: https://github.com/plankanban/planka/blob/master/LICENSE.md
 */

/**
 * notFound.js
 *
 * A custom response.
 *
 * Example usage:
 * ```
 *     return res.notFound();
 *     // -or-
 *     return res.notFound(optionalData);
 * ```
 *
 * Or with actions2:
 * ```
 *     exits: {
 *       somethingHappened: {
 *         responseType: 'notFound'
 *       }
 *     }
 * ```
 *
 * ```
 *     throw 'somethingHappened';
 *     // -or-
 *     throw { somethingHappened: optionalData }
 * ```
 */

module.exports = function notFound(message) {
  const { req, res } = this;

  // If this is an API request or explicitly wants JSON, return JSON
  // Otherwise, serve the index view for browser requests (SPA fallback)
  const wantsJSON = req.wantsJSON || req.path.startsWith('/api');
  
  if (wantsJSON) {
    return res.status(404).json({
      code: 'E_NOT_FOUND',
      message,
    });
  }

  // For all other requests (browser navigation), serve the SPA
  return res.view('index');
};
