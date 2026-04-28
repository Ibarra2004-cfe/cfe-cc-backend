import { Module } from "@nestjs/common";
import { CcController } from "./cc.controller";
import { CcService } from "./cc.service";
import { PrismaModule } from "prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [CcController],
  providers: [CcService],
})
export class CcModule {}