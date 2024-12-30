import 'module-alias/register';
import App from './app';

import IndexRoute from './routes/index.route';
// import BlogsRoute from '@routes/blogs.route';
import UserRoute from './routes/user.route';
import TelegramRoute from './routes/telegram.route';
// import AuthRoute from '@routes/auth.route';
// import OAuthRoute from '@routes/oauth.route';
// import VersionsRoute from '@routes/versions.route';
// import CmsPagesRoute from '@routes/cmsPages.route';
// import CmsMenusRoute from '@routes/cmsMenus.route';
// import CmsCategoriesRoute from '@routes/cmsCategories.route';
// import RolesRoute from '@routes/roles.route';
// import PermissionsRoute from '@routes/permissions.route';
// import PlansRoute from '@routes/plans.route';
// import StoresRoute from '@routes/stores.route';
// import AddressesRoute from '@routes/addresses.route';
// import ApplicationRoute from '@routes/applications.route';
// import ImageUploadRoute from '@routes/imageUpload.route';
// import WordsRoute from '@routes/words.route';

const app = new App([
    new IndexRoute(),
    // new BlogsRoute(),
    new UserRoute(),
    new TelegramRoute(),
    // new VersionsRoute(),
    // new CmsPagesRoute(),
    // new CmsMenusRoute(),
    // new CmsCategoriesRoute(),
    // new RolesRoute(),
    // new PermissionsRoute(),
    // new PlansRoute(),
    // new StoresRoute(),
    // new AddressesRoute(),
    // new AuthRoute(),
    // new OAuthRoute(),
    // new ApplicationRoute(),
    // new ImageUploadRoute(),
    // new WordsRoute()
]);

app.listen();