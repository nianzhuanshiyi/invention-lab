# ⚡ InventionLab

趋势驱动的AI产品发明平台。

## Railway 部署

1. 推送到 GitHub
2. Railway: New Project → GitHub Repo → 添加 PostgreSQL
3. 环境变量: `ANTHROPIC_API_KEY`
4. `railway run npx prisma migrate deploy && railway run npx tsx prisma/seed.ts`

## 本地开发

```bash
npm install && cp .env.example .env
npx prisma migrate dev && npm run db:seed && npm run dev
```
