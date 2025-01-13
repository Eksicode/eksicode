import 'module-alias/register';
import App from './app';

import IndexRoute from './routes/index.route';
import UserRoute from './routes/user.route';
import TelegramRoute from './routes/telegram.route';
import PageRoute from './routes/page.route';
import MenuRoute from './routes/menu.route';
import MenuCategoryRoute from './routes/menu-category.route';
import HashtagRoute from './routes/hashtag.route';
import PostRoute from './routes/post.route';
// import AuthRoute from '@routes/auth.route';
// import OAuthRoute from '@routes/oauth.route';
// import RolesRoute from '@routes/roles.route';
// import PermissionsRoute from '@routes/permissions.route';

const app = new App([
    new IndexRoute(),
    new UserRoute(),
    new TelegramRoute(),
    new PageRoute(),
    new MenuRoute(),
    new MenuCategoryRoute(),
    new HashtagRoute(),
    new PostRoute(),
    // new RolesRoute(),
    // new PermissionsRoute(),
    // new AuthRoute(),
    // new OAuthRoute()
]);

app.listen();

