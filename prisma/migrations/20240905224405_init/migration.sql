-- CreateTable
CREATE TABLE "Client" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "faceImageUrl" TEXT NOT NULL,
    "faceImageName" TEXT NOT NULL,
    "hasPermission" BOOLEAN NOT NULL
);
