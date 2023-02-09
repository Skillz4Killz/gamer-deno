import { configs } from "configs.server";
import genericPool from "generic-pool";
import ioredis from "ioredis";
import { SessionData } from "remix";

const factory = {
    create: async function () {
        const client = new ioredis({
            port: configs.dragon.port,
            host: configs.dragon.host,
            password: configs.dragon.password,
        });

        return client;
    },
    destroy: async function (client: ioredis) {
        client.disconnect();
    },
};

const pool = genericPool.createPool(factory, { max: 250, min: 50 });

export const dragon = {
    session: {
        set: async (id: string, data: SessionData, expires: Date) => {
            const conn = await pool.acquire();

            await conn
                .multi()
                .set(`websess-${id}`, JSON.stringify(data))
                .expireat(`websess-${id}`, expires.getTime())
                .exec();

            await pool.release(conn);
        },
        get: async (id: string): Promise<SessionData | undefined> => {
            const conn = await pool.acquire();

            const result = await conn.get(`websess-${id}`);

            await pool.release(conn);

            return result ? JSON.parse(result) : undefined;
        },
        update: async (id: string, data: Partial<SessionData>) => {
            const conn = await pool.acquire();

            const pttl = await conn.pttl(`websess-${id}`);
            if (!pttl) throw new Error("Session not found");
            if (pttl <= 5000) throw new Error("Session about to expire");

            await conn.set(id, JSON.stringify(data));

            await pool.release(conn);
        },
        delete: async (id: string) => {
            const conn = await pool.acquire();

            await conn.del(`websess-${id}`);

            await pool.release(conn);
        },
    },
};
