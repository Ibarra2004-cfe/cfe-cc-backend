/*
  Warnings:

  - You are about to drop the column `evidenciaBase64` on the `ConstanciaCalculo` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ConstanciaCalculo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tipoCC" TEXT NOT NULL,
    "numeroMemoria" TEXT NOT NULL,
    "fecha" DATETIME NOT NULL,
    "nombre" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "medidor" TEXT,
    "tarifa" TEXT,
    "rpu" TEXT,
    "geo" TEXT,
    "agencia" TEXT,
    "descripcion" TEXT NOT NULL,
    "tipoAnomalia" TEXT NOT NULL,
    "categoriaAnomalia" TEXT,
    "descripcionAnomalia" TEXT,
    "tipoGiro" TEXT NOT NULL,
    "metodoCalculo" TEXT NOT NULL,
    "periodoAjuste" TEXT NOT NULL,
    "amperes" TEXT,
    "volts" TEXT,
    "transformadores" TEXT,
    "personaAtiende" TEXT NOT NULL,
    "ordenSuspension" TEXT,
    "tablaCalculoBase64" TEXT,
    "powerAnalisisBase64" TEXT,
    "ingenieroNombre" TEXT NOT NULL DEFAULT 'ING. MIGUEL BRAVO CRUZ',
    "puesto" TEXT NOT NULL DEFAULT 'SUPERVISOR ZONA',
    "area" TEXT NOT NULL DEFAULT 'ÁREA MEDICIÓN MATAMOROS',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_ConstanciaCalculo" ("agencia", "amperes", "area", "categoriaAnomalia", "createdAt", "descripcion", "descripcionAnomalia", "direccion", "fecha", "geo", "id", "ingenieroNombre", "medidor", "metodoCalculo", "nombre", "numeroMemoria", "ordenSuspension", "periodoAjuste", "personaAtiende", "puesto", "rpu", "tarifa", "tipoAnomalia", "tipoCC", "tipoGiro", "transformadores", "updatedAt", "volts") SELECT "agencia", "amperes", "area", "categoriaAnomalia", "createdAt", "descripcion", "descripcionAnomalia", "direccion", "fecha", "geo", "id", "ingenieroNombre", "medidor", "metodoCalculo", "nombre", "numeroMemoria", "ordenSuspension", "periodoAjuste", "personaAtiende", "puesto", "rpu", "tarifa", "tipoAnomalia", "tipoCC", "tipoGiro", "transformadores", "updatedAt", "volts" FROM "ConstanciaCalculo";
DROP TABLE "ConstanciaCalculo";
ALTER TABLE "new_ConstanciaCalculo" RENAME TO "ConstanciaCalculo";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
