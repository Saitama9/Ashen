import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import { createServer as createViteServer } from 'vite';
import { createExpressApp } from './app';

const getDirname = () => {
  if (typeof __dirname !== 'undefined') return __dirname;
  try {
    return path.dirname(fileURLToPath(import.meta.url));
  } catch {
    return process.cwd();
  }
};
const rootDir = getDirname();

async function startServer() {
  const app = createExpressApp();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  // Vite middleware for development vs static build for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      root: path.resolve(process.cwd(), 'client'),
      configFile: path.resolve(process.cwd(), 'client/vite.config.ts'),
      server: {
        middlewareMode: true,
        watch: {
          ignored: [
            '**/server/data/**',
            '**/data/**',
            '**/*.json',
            '**/*.tmp',
            '**/dist/**',
            '**/dev-dist/**',
            '**/node_modules/**',
          ],
        },
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`⚔️  Ashen Path Server running on http://0.0.0.0:${PORT}`);
    console.log(`🛡️  Backend routes initialized under /api/*`);
  });
}

startServer().catch((err) => {
  console.error('Failed to boot server:', err);
  process.exit(1);
});
