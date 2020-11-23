import { Application, Router } from './deps.ts';
import { db } from '../../src/database/database.ts';

const app = new Application();
const router = new Router();

router
  .get('/:id', (ctx) => {
    const challenge = ctx.request.url.searchParams.get('hub.challenge');
    const mode = ctx.request.url.searchParams.get('hub.mode');

    ctx.response.headers.set('Content-Type', 'text/plain');
    ctx.response.status = 200;

    switch (mode) {
      case 'denied': {
        ctx.response.body = challenge ?? 'ok';
        break;
      }
      case 'unsubscribe':
      case 'subscribe': {
        ctx.response.body = challenge;
        break;
      }
      default: {
        ctx.response.status = 500;
        ctx.response.body = 'Fucking hell stop';
      }
    }
  });

app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8000 });
