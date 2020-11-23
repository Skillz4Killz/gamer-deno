import { Application, Router } from './deps.ts';
import { db } from '../../src/database/database.ts';

const router = new Router();

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8000 });
