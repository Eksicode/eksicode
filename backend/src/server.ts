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
import JobRoute from './routes/job.route';
import SourceRoute from './routes/source.route';
import PermissionRoute from './routes/permission.route';
import RoleRoute from './routes/role.route';
import AuthRoute from './routes/auth.route';

const app = new App([
    new IndexRoute(),
    new UserRoute(),
    new TelegramRoute(),
    new PageRoute(),
    new MenuRoute(),
    new MenuCategoryRoute(),
    new HashtagRoute(),
    new PostRoute(),
    new JobRoute(),
    new SourceRoute(),
    new RoleRoute(),
    new PermissionRoute(),
    new AuthRoute()
]);

app.listen();

