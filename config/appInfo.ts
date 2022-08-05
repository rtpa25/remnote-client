import { __isProd__ } from '../utils/isProd';

export const appInfo = {
  appName: 'remnote',
  apiDomain: __isProd__ ? 'https://api.remnote.site' : 'http://localhost:8080',
  websiteDomain: __isProd__ ? 'https://remnote.site' : 'http://localhost:3000',
  apiBasePath: '/auth',
  websiteBasePath: '/auth',
};
