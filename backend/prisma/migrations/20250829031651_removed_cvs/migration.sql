/*
  Warnings:

  - You are about to drop the `CVS` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CVS" DROP CONSTRAINT "CVS_usu_id_fkey";

-- DropTable
DROP TABLE "CVS";
