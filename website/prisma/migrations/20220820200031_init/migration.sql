-- CreateTable
CREATE TABLE "_sqlx_migrations" (
    "version" BIGINT NOT NULL,
    "description" TEXT NOT NULL,
    "installed_on" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "success" BOOLEAN NOT NULL,
    "checksum" BYTEA NOT NULL,
    "execution_time" BIGINT NOT NULL,

    CONSTRAINT "_sqlx_migrations_pkey" PRIMARY KEY ("version")
);

-- CreateTable
CREATE TABLE "discord_oauth" (
    "user_id" BIGINT NOT NULL,
    "username" TEXT NOT NULL,
    "discriminator" VARCHAR(4) NOT NULL,
    "avatar" TEXT,

    CONSTRAINT "discord_oauth_pkey" PRIMARY KEY ("user_id")
);
