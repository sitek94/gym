/*
  Warnings:

  - You are about to drop the column `createdAt` on the `ExerciseSet` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `ExerciseSet` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `ExerciseSet` table. All the data in the column will be lost.
  - Added the required column `date` to the `ExerciseSet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `ExerciseSet` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ExerciseSet" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "notes" TEXT,
    "reps" INTEGER NOT NULL,
    "weight" INTEGER NOT NULL,
    "date" DATETIME NOT NULL,
    "exerciseId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "ExerciseSet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ExerciseSet_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ExerciseSet" ("exerciseId", "id", "notes", "reps", "weight") SELECT "exerciseId", "id", "notes", "reps", "weight" FROM "ExerciseSet";
DROP TABLE "ExerciseSet";
ALTER TABLE "new_ExerciseSet" RENAME TO "ExerciseSet";
CREATE TABLE "new_Exercise" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Exercise_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Exercise" ("createdAt", "id", "name", "notes", "updatedAt", "userId") SELECT "createdAt", "id", "name", "notes", "updatedAt", "userId" FROM "Exercise";
DROP TABLE "Exercise";
ALTER TABLE "new_Exercise" RENAME TO "Exercise";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
