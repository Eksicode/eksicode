# Redis for local production (telegrambot)

Use this when running the telegrambot on your machine (not in Docker) but you want a Redis instance that behaves like production (password, persistence).

## Quick start

1. **Start Redis**

   From the `telegrambot` directory:

   ```bash
   docker compose -f docker-compose.redis.yml up -d
   ```

2. **Configure the bot**

   In `telegrambot/.env` set:

   ```env
   REDIS_HOST=localhost
   REDIS_PORT=6379
   REDIS_PASSWORD=changeme
   REDIS_DB=0
   ```

   Optional: to use a custom password, set `REDIS_PASSWORD` in your environment before starting the compose, and use the same value in `.env`.

3. **Run the bot**

   ```bash
   npm run dev
   # or
   node telegram_func.ts
   ```

## Commands

| Action        | Command                                                |
|---------------|--------------------------------------------------------|
| Start Redis   | `docker compose -f docker-compose.redis.yml up -d`     |
| Stop Redis    | `docker compose -f docker-compose.redis.yml down`     |
| View logs     | `docker compose -f docker-compose.redis.yml logs -f`  |
| Redis CLI     | `docker exec -it eksicodeTelegramBotRedis redis-cli -a changeme` |

## Check connection

```bash
docker exec -it eksicodeTelegramBotRedis redis-cli -a changeme PING
# Expect: PONG
```

Queue length (BullMQ):

```bash
docker exec -it eksicodeTelegramBotRedis redis-cli -a changeme LLEN bull:telegram:wait
```

## Data

- Data is stored in a Docker volume `redis_telegrambot_data`.
- Persistence: AOF + RDB (same style as main stack).
- To remove data: `docker compose -f docker-compose.redis.yml down -v`
