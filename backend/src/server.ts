import 'module-alias/register';
import App from './app';

import IndexRoute from './routes/index.route';
import UserRoute from './routes/user.route';
import TelegramRoute from './routes/telegram.route';
import PageRoute from './routes/page.route';
// import AuthRoute from '@routes/auth.route';
// import OAuthRoute from '@routes/oauth.route';
// import RolesRoute from '@routes/roles.route';
// import PermissionsRoute from '@routes/permissions.route';

const app = new App([
    new IndexRoute(),
    new UserRoute(),
    new TelegramRoute(),
    new PageRoute(),
    // new RolesRoute(),
    // new PermissionsRoute(),
    // new AuthRoute(),
    // new OAuthRoute()
]);

app.listen();
