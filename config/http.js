/**
 * HTTP Server Settings
 * (sails.config.http)
 *
 * Configuration for the underlying HTTP server in Sails.
 * (for additional recommended settings, see `config/env/production.js`)
 *
 * For more information on configuration, check out:
 * https://sailsjs.com/config/http
 */

const path = require('path');
const serveStatic = require('serve-static');
const fs = require('fs');

module.exports.http = {
  /**
   *
   * Sails/Express middleware to run for every HTTP request.
   * (Only applies to HTTP requests -- not virtual WebSocket requests.)
   *
   * https://sailsjs.com/documentation/concepts/middleware
   *
   */

  middleware: {
    /**
     *
     * The order in which middleware should be run for HTTP requests.
     * (This Sails app's routes are handled by the "router" middleware below.)
     *
     */
    order: [
      'serveSpaFallback',
      'cookieParser',
      'session',
      'bodyParser',
      'compress',
      'poweredBy',
      'staticAssets',
      'router',
      'www',
      'favicon',
    ],

    /**
     * Serve SPA HTML for browser requests (before authentication)
     */
    serveSpaFallback: (req, res, next) => {
      // Skip API routes, static assets, and files with extensions
      if (req.path.startsWith('/api/') || 
          req.path.startsWith('/assets/') || 
          req.path.startsWith('/user-avatars/') ||
          req.path.startsWith('/background-images/') ||
          req.path.startsWith('/attachments/') ||
          req.path.startsWith('/favicons/') ||
          req.path.startsWith('/preloaded-favicons/') ||
          req.path.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot|json|map)$/i)) {
        return next();
      }

      // Only serve SPA for GET requests from browsers (not API calls)
      if (req.method !== 'GET') {
        return next();
      }

      // For browser requests to non-API routes, serve index.html
      const sails = require('sails');
      const indexPath = path.join(sails.config.appPath, 'public', 'index.html');
      
      try {
        if (fs.existsSync(indexPath)) {
          const html = fs.readFileSync(indexPath, 'utf8');
          res.set('Content-Type', 'text/html');
          return res.send(html);
        }
      } catch (err) {
        console.error('Error serving SPA:', err);
      }
      
      return next();
    },

    /**
     * Custom middleware to serve static frontend assets from public directory
     */
    staticAssets: (() => {
      let staticMiddleware;
      return (req, res, next) => {
        if (!staticMiddleware) {
          const sails = require('sails');
          const publicPath = path.resolve(sails.config.appPath, 'public');
          staticMiddleware = serveStatic(publicPath, {
            maxAge: process.env.NODE_ENV === 'production' ? 365.25 * 24 * 60 * 60 * 1000 : 0,
          });
        }
        return staticMiddleware(req, res, next);
      };
    })(),

    /**
     *
     * The body parser that will handle incoming multipart HTTP requests.
     *
     * https://sailsjs.com/config/http#?customizing-the-body-parser
     *
     */
    // bodyParser: (function _configureBodyParser(){
    //   var skipper = require('skipper');
    //   var middlewareFn = skipper({ strict: true });
    //   return middlewareFn;
    // })(),

    poweredBy: false,
  },
};
