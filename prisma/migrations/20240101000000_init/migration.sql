-- CreateTable
CREATE TABLE "Invention" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "tagline" TEXT NOT NULL,
    "trend" TEXT NOT NULL,
    "trendSource" TEXT NOT NULL,
    "painPoint" TEXT NOT NULL,
    "solution" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT '概念阶段',
    "score" INTEGER NOT NULL DEFAULT 75,
    "imagePrompt" TEXT,
    "imageUrl" TEXT,
    "marketSize" TEXT,
    "targetPrice" TEXT,
    "highlights" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "votes" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Invention_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Invention_category_idx" ON "Invention"("category");
CREATE INDEX "Invention_createdAt_idx" ON "Invention"("createdAt");
CREATE INDEX "Invention_votes_idx" ON "Invention"("votes");
