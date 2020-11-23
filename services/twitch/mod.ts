import { Application, Router } from './deps.ts';
import { db } from '../../src/database/database.ts';

const app = new Application();
const router = new Router();

app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8000 });
