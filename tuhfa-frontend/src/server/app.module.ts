import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { FallbackController } from "./fallback.controller";
import { OtpController } from "./otp.controller";

@Module({
  imports: [],
  controllers: [AppController, OtpController, FallbackController],
  providers: [],
})
export class AppModule {}
