/*
  Warnings:

  - The primary key for the `auth_links` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `auth_links` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "auth_links" DROP CONSTRAINT "auth_links_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "auth_links_pkey" PRIMARY KEY ("id");
