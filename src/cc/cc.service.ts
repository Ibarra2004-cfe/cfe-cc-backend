import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";
import { ccPdfTemplate } from "./cc-template";

@Injectable()
export class CcService {
  constructor(private prisma: PrismaService) {}

  create(data: any) {
    return this.prisma.constanciaCalculo.create({
      data: {
        tipoCC: data.tipoCC,

        numeroMemoria: data.numeroMemoria,
        fecha: new Date(data.fecha),

        nombre: data.nombre,
        direccion: data.direccion,
        medidor: data.medidor || null,
        tarifa: data.tarifa || null,
        rpu: data.rpu || null,
        geo: data.geo || null,
        agencia: data.agencia || null,

        descripcion: data.descripcion,
        tipoAnomalia: data.tipoAnomalia,
        categoriaAnomalia: data.categoriaAnomalia || null,
        descripcionAnomalia: data.descripcionAnomalia || null,

        tipoGiro: data.tipoGiro,
        metodoCalculo: data.metodoCalculo,
        periodoAjuste: data.periodoAjuste,
        powerAnalisisTexto: data.powerAnalisisTexto || null,

        amperes: data.amperes || null,
        volts: data.volts || null,
        transformadores: data.transformadores || null,

        personaAtiende: data.personaAtiende,
        situacionActual: data.situacionActual || null,
        ordenSuspension: data.ordenSuspension || null,

        fotoAnomaliaBase64: data.fotoAnomaliaBase64 || null,
        tablaCalculoBase64: data.tablaCalculoBase64 || null,
        powerAnalisisBase64:
          data.tipoCC === "NORMAL" ? data.powerAnalisisBase64 || null : null,

        ingenieroNombre: data.ingenieroNombre || "ING. MIGUEL BRAVO CRUZ",
        puesto: data.puesto || "SUPERVISOR ZONA",
        area: data.area || "ÁREA MEDICIÓN MATAMOROS",
      },
    });
  }

  findAll() {
    return this.prisma.constanciaCalculo.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  async findOne(id: number) {
    const cc = await this.prisma.constanciaCalculo.findUnique({
      where: { id },
    });

    if (!cc) {
      throw new NotFoundException("CC no encontrada");
    }

    return cc;
  }

  async generatePdf(id: number) {
    const cc = await this.findOne(id);
    const html = ccPdfTemplate(cc);

    const browser = await puppeteer.launch({
      args: chromium.args as any,
      executablePath: await chromium.executablePath(),
      headless: true,
    });

    try {
      const page = await browser.newPage();

      await page.setContent(html, {
        waitUntil: "networkidle0",
      });

      return await page.pdf({
        format: "letter",
        printBackground: true,
        margin: {
          top: "0cm",
          right: "0cm",
          bottom: "0cm",
          left: "0cm",
        },
      });
    } finally {
      await browser.close();
    }
  }
}