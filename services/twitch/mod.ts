import { Application, Router, hmac } from './deps.ts';
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
        return;
      }
      case 'unsubscribe':
      case 'subscribe': {
        ctx.response.body = challenge;
        return;
      }
      default: {
        ctx.response.status = 500;
        ctx.response.body = 'Fucking hell stop';
        return;
      }
    }
  })
  .post('/:id', async (ctx) => {
    ctx.response.headers.set('Content-Type', 'application/json');
    ctx.response.status = 400;

    if (!ctx.request.hasBody) {
      ctx.response.body = {
        reason: 'Malformed data received - request requires body'
      }
      return;
    }

    const xHubSignature = ctx.request.headers.get('x-hub-signature');
    if (!xHubSignature) {
      ctx.response.body = {
        reason: 'Missing "x-hub-signature" header'
      }
      return;
    }

    const body = await ctx.request.body({ type: 'json' }).value;

    const [algo, sig] = xHubSignature.split('=', 2);
    // TODO: Add secret to config
    const hash = hmac(algo, '', JSON.stringify(body), undefined, 'hex');

    if (hash !== sig) {
      ctx.response.status = 403;
      ctx.response.body = {
        reason: 'Invalid signature'
      }
      return;
    }

    const id = ctx.params.id;
    if (!id) {
      ctx.response.body = {
        reason: 'Missing "id" parameter'
      }
      return;
    }

    const { data } = body;
    const lengthStatus = data.length === 0;
  });

app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8000 });
