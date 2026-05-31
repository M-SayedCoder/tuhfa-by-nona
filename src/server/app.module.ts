import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { FallbackController } from "./fallback.controller";

@Module({
  imports: [],
  controllers: [AppController, FallbackController],
  providers: [],
})
export class AppModule {}
