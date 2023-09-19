-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('anime', 'manga', 'videogame');

-- CreateEnum
CREATE TYPE "WaifuLevel" AS ENUM ('topWaifu', 'jonin', 'chunin', 'genin', 'freeAgent', 'nationalTreasure');

-- CreateEnum
CREATE TYPE "ImageFormat" AS ENUM ('apng', 'avif', 'gif', 'jpg', 'jpeg', 'jfif', 'pjpeg', 'pjp', 'png', 'svg', 'webp');

-- CreateEnum
CREATE TYPE "TradeStatus" AS ENUM ('pending', 'declined', 'accepted');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "alias" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "uid" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserImage" (
    "userId" TEXT NOT NULL,
    "imageId" TEXT NOT NULL,

    CONSTRAINT "UserImage_pkey" PRIMARY KEY ("userId","imageId")
);

-- CreateTable
CREATE TABLE "Image" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "format" "ImageFormat" NOT NULL,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MediaImage" (
    "mediaId" TEXT NOT NULL,
    "imageId" TEXT NOT NULL,

    CONSTRAINT "MediaImage_pkey" PRIMARY KEY ("mediaId","imageId")
);

-- CreateTable
CREATE TABLE "Media" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "type" "MediaType" NOT NULL,

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KnownMedia" (
    "userId" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,
    "knownAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KnownMedia_pkey" PRIMARY KEY ("userId","mediaId")
);

-- CreateTable
CREATE TABLE "Waifu" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "level" "WaifuLevel" NOT NULL,
    "since" TIMESTAMP(3) NOT NULL,
    "mediaId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "offeredTradeId" TEXT,
    "wantedTradeId" TEXT,

    CONSTRAINT "Waifu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WaifuImage" (
    "waifuId" TEXT NOT NULL,
    "imageId" TEXT NOT NULL,

    CONSTRAINT "WaifuImage_pkey" PRIMARY KEY ("waifuId","imageId")
);

-- CreateTable
CREATE TABLE "Trade" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "endedAt" TIMESTAMP(3),
    "senderId" TEXT NOT NULL,
    "recipientId" TEXT NOT NULL,
    "status" "TradeStatus" NOT NULL DEFAULT 'pending',

    CONSTRAINT "Trade_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_uid_key" ON "User"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UserImage_userId_key" ON "UserImage"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserImage_imageId_key" ON "UserImage"("imageId");

-- CreateIndex
CREATE UNIQUE INDEX "MediaImage_mediaId_key" ON "MediaImage"("mediaId");

-- CreateIndex
CREATE UNIQUE INDEX "MediaImage_imageId_key" ON "MediaImage"("imageId");

-- CreateIndex
CREATE UNIQUE INDEX "Media_title_key" ON "Media"("title");

-- CreateIndex
CREATE UNIQUE INDEX "Waifu_name_mediaId_key" ON "Waifu"("name", "mediaId");

-- CreateIndex
CREATE UNIQUE INDEX "WaifuImage_waifuId_key" ON "WaifuImage"("waifuId");

-- CreateIndex
CREATE UNIQUE INDEX "WaifuImage_imageId_key" ON "WaifuImage"("imageId");

-- AddForeignKey
ALTER TABLE "UserImage" ADD CONSTRAINT "UserImage_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserImage" ADD CONSTRAINT "UserImage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MediaImage" ADD CONSTRAINT "MediaImage_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MediaImage" ADD CONSTRAINT "MediaImage_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KnownMedia" ADD CONSTRAINT "KnownMedia_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KnownMedia" ADD CONSTRAINT "KnownMedia_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Waifu" ADD CONSTRAINT "Waifu_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Waifu" ADD CONSTRAINT "Waifu_offeredTradeId_fkey" FOREIGN KEY ("offeredTradeId") REFERENCES "Trade"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Waifu" ADD CONSTRAINT "Waifu_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Waifu" ADD CONSTRAINT "Waifu_wantedTradeId_fkey" FOREIGN KEY ("wantedTradeId") REFERENCES "Trade"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WaifuImage" ADD CONSTRAINT "WaifuImage_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WaifuImage" ADD CONSTRAINT "WaifuImage_waifuId_fkey" FOREIGN KEY ("waifuId") REFERENCES "Waifu"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trade" ADD CONSTRAINT "Trade_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trade" ADD CONSTRAINT "Trade_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
