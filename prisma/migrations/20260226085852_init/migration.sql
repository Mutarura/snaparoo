-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "plan" TEXT NOT NULL DEFAULT 'Basic',
    "paymentStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "organizerToken" TEXT NOT NULL,
    "cameraToken" TEXT NOT NULL,
    "branding" TEXT NOT NULL DEFAULT '{}',
    "maxUploads" INTEGER NOT NULL DEFAULT 25,
    "currentUploads" INTEGER NOT NULL DEFAULT 0,
    "uniqueParticipants" INTEGER NOT NULL DEFAULT 0,
    "driveFolderId" TEXT,
    "driveConnected" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Upload" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "eventId" TEXT NOT NULL,
    "participantId" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Upload_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Event_organizerToken_key" ON "Event"("organizerToken");

-- CreateIndex
CREATE UNIQUE INDEX "Event_cameraToken_key" ON "Event"("cameraToken");
