import 'module-alias/register';
import App from './app';
import cluster from 'cluster';
import os from 'os';
import { PrismaClient } from '@prisma/client';
import EmailService from './services/email.service';
import UserService from './services/user.service';
import MediaService from './services/media.service';

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
import MediaRoute from './routes/media.route';
import CompanyRoute from './routes/company.route';

const numCPUs = os.cpus().length;

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
    const app = new App((prisma: PrismaClient, emailService: EmailService) => {
        const mediaService = new MediaService(prisma);
        const userService = new UserService(prisma, emailService, mediaService);
        
        return [
            new IndexRoute(),
            new UserRoute(userService),
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
            new AuthRoute(userService),
            new MediaRoute(),
            new CompanyRoute()
        ];
    });

    app.listen();
}
