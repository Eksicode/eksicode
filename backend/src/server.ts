import 'module-alias/register';
import App from './app';
import cluster from 'cluster';
import os from 'os';
import { PrismaClient } from '@prisma/client';
import EmailService from './services/email.service';
import UserService from './services/user.service';
import MediaService from './services/media.service';
import AuthService from './services/auth.service';
import RolePermissionService from './services/rolePermission.service';

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

// Production cluster configuration
const numCPUs = os.cpus().length;
const maxWorkers = parseInt(process.env.MAX_WORKERS || String(numCPUs));
const isProduction = process.env.NODE_ENV === 'production';
const enableClustering = process.env.ENABLE_CLUSTERING !== 'false' && isProduction;

// Worker management
const workers = new Map();
let restartingWorkers = false;

function createWorker(id?: number) {
  const worker = cluster.fork({ WORKER_ID: id || workers.size });
  workers.set(worker.id, {
    worker,
    restarts: 0,
    lastRestart: Date.now()
  });
  
  console.log(`🚀 Worker ${worker.process.pid} started (ID: ${worker.id})`);
  
  worker.on('message', (message) => {
    if (message.type === 'shutdown') {
      console.log(`📤 Worker ${worker.process.pid} requesting shutdown`);
      worker.kill('SIGTERM');
    }
  });
  
  return worker;
}

function restartWorker(workerId: number, exitCode: number, signal: string) {
  const workerInfo = workers.get(workerId);
  if (!workerInfo) return;
  
  const { restarts, lastRestart } = workerInfo;
  const timeSinceLastRestart = Date.now() - lastRestart;
  
  // Prevent rapid restart loops
  if (restarts >= 5 && timeSinceLastRestart < 60000) {
    console.log(`❌ Worker ${workerId} restarted too many times, not restarting`);
    workers.delete(workerId);
    return;
  }
  
  console.log(`🔄 Restarting worker ${workerId} (restarts: ${restarts + 1})`);
  
  setTimeout(() => {
    const newWorker = createWorker(workerId);
    workers.set(workerId, {
      worker: newWorker,
      restarts: restarts + 1,
      lastRestart: Date.now()
    });
  }, 1000); // Wait 1 second before restart
}

function gracefulShutdown() {
  console.log('🛑 Initiating graceful shutdown...');
  restartingWorkers = true;
  
  const shutdownPromises = Array.from(workers.values()).map(({ worker }) => {
    return new Promise((resolve) => {
      worker.send({ type: 'shutdown' });
      
      const timeout = setTimeout(() => {
        console.log(`⚡ Force killing worker ${worker.process.pid}`);
        worker.kill('SIGKILL');
        resolve(void 0);
      }, 10000); // 10 second timeout
      
      worker.on('exit', () => {
        clearTimeout(timeout);
        resolve(void 0);
      });
    });
  });
  
  Promise.all(shutdownPromises).then(() => {
    console.log('✅ All workers shut down gracefully');
    process.exit(0);
  });
}

if (enableClustering && cluster.isPrimary) {
  console.log(`🏭 Master process ${process.pid} starting with ${maxWorkers} workers`);
  console.log(`💻 Available CPUs: ${numCPUs}, Using workers: ${maxWorkers}`);

  // Create initial workers
  for (let i = 0; i < maxWorkers; i++) {
    createWorker(i);
  }

  // Handle worker exits
  cluster.on('exit', (worker, code, signal) => {
    console.log(`💀 Worker ${worker.process.pid} died (${signal || code})`);
    
    if (!restartingWorkers) {
      restartWorker(worker.id, code, signal);
    }
  });

  // Handle graceful shutdown
  process.on('SIGTERM', gracefulShutdown);
  process.on('SIGINT', gracefulShutdown);
  
  // Health check endpoint for load balancer
  setInterval(() => {
    const activeWorkers = Array.from(workers.values()).filter(({ worker }) => !worker.isDead()).length;
    if (activeWorkers < Math.ceil(maxWorkers * 0.5)) {
      console.log(`⚠️ Warning: Only ${activeWorkers}/${maxWorkers} workers active`);
    }
  }, 30000);

} else {
    // Worker process
    const workerId = process.env.WORKER_ID || 'unknown';
    console.log(`👷 Worker ${process.pid} (ID: ${workerId}) starting...`);
    
    const app = new App((prisma: PrismaClient, emailService: EmailService) => {
        // Initialize services with dependencies
        const mediaService = new MediaService(prisma);
        const userService = new UserService(prisma, emailService, mediaService);
        const authService = new AuthService(prisma, emailService);
        const rolePermissionService = new RolePermissionService(prisma);
        
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
            new RoleRoute(rolePermissionService, userService),
            new PermissionRoute(rolePermissionService, userService),
            new AuthRoute(authService, userService),
            new MediaRoute(),
            new CompanyRoute()
        ];
    });

    const server = app.listen();
    
    // Graceful shutdown for worker
    function workerShutdown() {
        console.log(`🛑 Worker ${process.pid} received shutdown signal`);
        
        server.close((err) => {
            if (err) {
                console.error(`❌ Error during server close: ${err}`);
                process.exit(1);
            }
            
            console.log(`✅ Worker ${process.pid} shut down gracefully`);
            process.exit(0);
        });
        
        // Force exit if graceful shutdown takes too long
        setTimeout(() => {
            console.log(`⚡ Worker ${process.pid} force exit`);
            process.exit(1);
        }, 8000);
    }
    
    // Handle shutdown signals
    process.on('SIGTERM', workerShutdown);
    process.on('SIGINT', workerShutdown);
    
    // Handle master shutdown requests
    process.on('message', (message: any) => {
        if (message && typeof message === 'object' && message.type === 'shutdown') {
            workerShutdown();
        }
    });
    
    // Send ready signal to master
    if (process.send) {
        process.send({ type: 'ready', pid: process.pid });
    }
    
    console.log(`✅ Worker ${process.pid} (ID: ${workerId}) ready`);
}
