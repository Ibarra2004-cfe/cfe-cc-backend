import { Body, Controller, Get, Param, Post, Res } from "@nestjs/common";
import type { Response } from "express";
import { CcService } from "./cc.service";

@Controller("cc")
export class CcController {
  constructor(private readonly ccService: CcService) {}

  @Post()
  async create(@Body() body: any) {
    try {
      return await this.ccService.create(body);
    } catch (error) {
      console.error("ERROR AL GUARDAR CC:", error);
      throw error;
    }
  }

  @Get()
  findAll() {
    return this.ccService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.ccService.findOne(Number(id));
  }

  @Get(":id/pdf")
  async pdf(@Param("id") id: string, @Res() res: Response) {
    try {
      const buffer = await this.ccService.generatePdf(Number(id));

      res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="CC-${id}.pdf"`,
        "Content-Length": buffer.length,
      });

      res.end(buffer);
    } catch (error: any) {
      console.error("ERROR AL GENERAR PDF:", error);

      res.status(500).json({
        message: "Error al generar PDF",
        error: error.message,
      });
    }
  }
}