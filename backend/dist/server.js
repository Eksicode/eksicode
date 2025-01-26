"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
require("module-alias/register");
const app_1 = tslib_1.__importDefault(require("./app"));
const index_route_1 = tslib_1.__importDefault(require("./routes/index.route"));
const user_route_1 = tslib_1.__importDefault(require("./routes/user.route"));
const telegram_route_1 = tslib_1.__importDefault(require("./routes/telegram.route"));
const page_route_1 = tslib_1.__importDefault(require("./routes/page.route"));
const menu_route_1 = tslib_1.__importDefault(require("./routes/menu.route"));
const menu_category_route_1 = tslib_1.__importDefault(require("./routes/menu-category.route"));
const hashtag_route_1 = tslib_1.__importDefault(require("./routes/hashtag.route"));
const post_route_1 = tslib_1.__importDefault(require("./routes/post.route"));
// import AuthRoute from '@routes/auth.route';
// import OAuthRoute from '@routes/oauth.route';
// import RolesRoute from '@routes/roles.route';
// import PermissionsRoute from '@routes/permissions.route';
const app = new app_1.default([
    new index_route_1.default(),
    new user_route_1.default(),
    new telegram_route_1.default(),
    new page_route_1.default(),
    new menu_route_1.default(),
    new menu_category_route_1.default(),
    new hashtag_route_1.default(),
    new post_route_1.default(),
    // new RolesRoute(),
    // new PermissionsRoute(),
    // new AuthRoute(),
    // new OAuthRoute()
]);
app.listen();
//# sourceMappingURL=server.js.map