-- CreateEnum
CREATE TYPE "TournamentStatus" AS ENUM ('PLANNED', 'ACTIVE', 'FINISHED');

-- CreateEnum
CREATE TYPE "GameStatus" AS ENUM ('PLANNED', 'SCHEDULED', 'LIVE', 'DONE', 'CANCELLED');

-- CreateEnum
CREATE TYPE "GameFormat" AS ENUM ('PLACEMENT', 'SCORE', 'TIME', 'BRACKET');

-- CreateEnum
CREATE TYPE "BracketType" AS ENUM ('SINGLE_ELIMINATION', 'DOUBLE_ELIMINATION', 'ROUND_ROBIN');

-- CreateEnum
CREATE TYPE "BadgeRarity" AS ENUM ('COMMON', 'UNCOMMON', 'RARE', 'LEGENDARY');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "role" TEXT NOT NULL DEFAULT 'user',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "expiresAt" TIMESTAMP(3),
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Verification" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Verification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Player" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "nickname" TEXT,
    "homeBase" TEXT,
    "funFact" TEXT,
    "imageUrl" TEXT,
    "signatureGameId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "icon" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GameType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tournament" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "status" "TournamentStatus" NOT NULL DEFAULT 'PLANNED',
    "startDate" TIMESTAMP(3),
    "year" INTEGER,
    "coverImageUrl" TEXT,
    "posterImageUrl" TEXT,
    "pointParticipation" INTEGER NOT NULL DEFAULT 3,
    "pointFirstPlace" INTEGER NOT NULL DEFAULT 3,
    "pointSecondPlace" INTEGER NOT NULL DEFAULT 2,
    "pointThirdPlace" INTEGER NOT NULL DEFAULT 1,
    "pointOrganizedWithParticipation" INTEGER NOT NULL DEFAULT 1,
    "pointOrganizedWithoutParticipation" INTEGER NOT NULL DEFAULT 3,
    "pointSpectator" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tournament_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Game" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tournamentId" TEXT NOT NULL,
    "gameTypeId" TEXT,
    "date" TIMESTAMP(3),
    "status" "GameStatus" NOT NULL DEFAULT 'PLANNED',
    "location" TEXT,
    "duration" INTEGER,
    "format" "GameFormat" NOT NULL DEFAULT 'PLACEMENT',
    "bracketType" "BracketType",
    "bracketData" JSONB,
    "heroImageUrl" TEXT,
    "story" TEXT,
    "isDone" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TimeResult" (
    "id" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "round" INTEGER NOT NULL,
    "lapTime" TEXT NOT NULL,

    CONSTRAINT "TimeResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Highlight" (
    "id" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    "quote" TEXT NOT NULL,
    "playerId" TEXT,

    CONSTRAINT "Highlight_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameMedia" (
    "id" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "GameMedia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Badge" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "rarity" "BadgeRarity" NOT NULL DEFAULT 'COMMON',
    "criteria" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Badge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlayerBadge" (
    "id" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "badgeId" TEXT NOT NULL,
    "gameId" TEXT,
    "unlockedAt" TIMESTAMP(3) NOT NULL,
    "note" TEXT,

    CONSTRAINT "PlayerBadge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SiteSettings" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "accentColor" TEXT NOT NULL DEFAULT 'neon',
    "themeMode" TEXT NOT NULL DEFAULT 'system',
    "showTettasteDuell" BOOLEAN NOT NULL DEFAULT true,
    "showLengstePodiumStripe" BOOLEAN NOT NULL DEFAULT true,
    "showComebackOfTheYear" BOOLEAN NOT NULL DEFAULT true,
    "showDebutantensSjokk" BOOLEAN NOT NULL DEFAULT true,
    "showMestAktivArrangor" BOOLEAN NOT NULL DEFAULT true,
    "showSpellKongar" BOOLEAN NOT NULL DEFAULT true,
    "showBydelskamp" BOOLEAN NOT NULL DEFAULT false,
    "showNemesis" BOOLEAN NOT NULL DEFAULT false,
    "showActivityFeed" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_GameOrganizers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_GameOrganizers_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_GameParticipants" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_GameParticipants_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_GameSpectators" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_GameSpectators_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_GameFirstPlace" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_GameFirstPlace_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_GameSecondPlace" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_GameSecondPlace_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_GameThirdPlace" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_GameThirdPlace_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Session_token_key" ON "Session"("token");

-- CreateIndex
CREATE UNIQUE INDEX "GameType_slug_key" ON "GameType"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Tournament_slug_key" ON "Tournament"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Badge_slug_key" ON "Badge"("slug");

-- CreateIndex
CREATE INDEX "_GameOrganizers_B_index" ON "_GameOrganizers"("B");

-- CreateIndex
CREATE INDEX "_GameParticipants_B_index" ON "_GameParticipants"("B");

-- CreateIndex
CREATE INDEX "_GameSpectators_B_index" ON "_GameSpectators"("B");

-- CreateIndex
CREATE INDEX "_GameFirstPlace_B_index" ON "_GameFirstPlace"("B");

-- CreateIndex
CREATE INDEX "_GameSecondPlace_B_index" ON "_GameSecondPlace"("B");

-- CreateIndex
CREATE INDEX "_GameThirdPlace_B_index" ON "_GameThirdPlace"("B");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_signatureGameId_fkey" FOREIGN KEY ("signatureGameId") REFERENCES "GameType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_gameTypeId_fkey" FOREIGN KEY ("gameTypeId") REFERENCES "GameType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimeResult" ADD CONSTRAINT "TimeResult_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimeResult" ADD CONSTRAINT "TimeResult_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Highlight" ADD CONSTRAINT "Highlight_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameMedia" ADD CONSTRAINT "GameMedia_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerBadge" ADD CONSTRAINT "PlayerBadge_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerBadge" ADD CONSTRAINT "PlayerBadge_badgeId_fkey" FOREIGN KEY ("badgeId") REFERENCES "Badge"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerBadge" ADD CONSTRAINT "PlayerBadge_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GameOrganizers" ADD CONSTRAINT "_GameOrganizers_A_fkey" FOREIGN KEY ("A") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GameOrganizers" ADD CONSTRAINT "_GameOrganizers_B_fkey" FOREIGN KEY ("B") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GameParticipants" ADD CONSTRAINT "_GameParticipants_A_fkey" FOREIGN KEY ("A") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GameParticipants" ADD CONSTRAINT "_GameParticipants_B_fkey" FOREIGN KEY ("B") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GameSpectators" ADD CONSTRAINT "_GameSpectators_A_fkey" FOREIGN KEY ("A") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GameSpectators" ADD CONSTRAINT "_GameSpectators_B_fkey" FOREIGN KEY ("B") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GameFirstPlace" ADD CONSTRAINT "_GameFirstPlace_A_fkey" FOREIGN KEY ("A") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GameFirstPlace" ADD CONSTRAINT "_GameFirstPlace_B_fkey" FOREIGN KEY ("B") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GameSecondPlace" ADD CONSTRAINT "_GameSecondPlace_A_fkey" FOREIGN KEY ("A") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GameSecondPlace" ADD CONSTRAINT "_GameSecondPlace_B_fkey" FOREIGN KEY ("B") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GameThirdPlace" ADD CONSTRAINT "_GameThirdPlace_A_fkey" FOREIGN KEY ("A") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GameThirdPlace" ADD CONSTRAINT "_GameThirdPlace_B_fkey" FOREIGN KEY ("B") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;
