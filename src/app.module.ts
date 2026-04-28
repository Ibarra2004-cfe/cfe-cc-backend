import { Module } from "@nestjs/common";
import { CcModule } from "./cc/cc.module";

@Module({
  imports: [CcModule],
})
export class AppModule {}