-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "CardItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "game" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cardNumber" TEXT,
    "setName" TEXT,
    "rarity" TEXT,
    "language" TEXT NOT NULL DEFAULT 'EN',
    "condition" TEXT NOT NULL DEFAULT 'NM',
    "productType" TEXT NOT NULL DEFAULT 'SINGLE',
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "purchasePriceCents" INTEGER NOT NULL,
    "targetSalePriceCents" INTEGER,
    "minAcceptablePriceCents" INTEGER,
    "imageUrl" TEXT,
    "notes" TEXT,
    "stockStatus" TEXT NOT NULL DEFAULT 'IN_STOCK',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CardItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Purchase" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "cardItemId" TEXT NOT NULL,
    "source" TEXT,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "unitCostCents" INTEGER NOT NULL,
    "totalCostCents" INTEGER NOT NULL,
    "purchasedAt" DATETIME NOT NULL,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Purchase_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Purchase_cardItemId_fkey" FOREIGN KEY ("cardItemId") REFERENCES "CardItem" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Sale" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "cardItemId" TEXT NOT NULL,
    "channel" TEXT NOT NULL DEFAULT 'OTHER',
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "salePriceCents" INTEGER NOT NULL,
    "feeCents" INTEGER NOT NULL DEFAULT 0,
    "shippingCostCents" INTEGER NOT NULL DEFAULT 0,
    "netProfitCents" INTEGER NOT NULL,
    "soldAt" DATETIME NOT NULL,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Sale_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Sale_cardItemId_fkey" FOREIGN KEY ("cardItemId") REFERENCES "CardItem" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "CardItem_userId_idx" ON "CardItem"("userId");

-- CreateIndex
CREATE INDEX "CardItem_game_idx" ON "CardItem"("game");

-- CreateIndex
CREATE INDEX "CardItem_name_idx" ON "CardItem"("name");

-- CreateIndex
CREATE INDEX "CardItem_setName_idx" ON "CardItem"("setName");

-- CreateIndex
CREATE INDEX "CardItem_stockStatus_idx" ON "CardItem"("stockStatus");

-- CreateIndex
CREATE INDEX "Purchase_userId_idx" ON "Purchase"("userId");

-- CreateIndex
CREATE INDEX "Purchase_cardItemId_idx" ON "Purchase"("cardItemId");

-- CreateIndex
CREATE INDEX "Sale_userId_idx" ON "Sale"("userId");

-- CreateIndex
CREATE INDEX "Sale_cardItemId_idx" ON "Sale"("cardItemId");
