import { Controller, Get, Req, Res, Next } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import path from "path";

@Controller()
export class FallbackController {
  @Get("*")
  handleFallback(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {
    // If it's an API route, pass it to NestJS's Router
    if (req.url.startsWith("/api")) {
      return next();
    }
    
    if (process.env.NODE_ENV === "production") {
      res.sendFile(path.join(process.cwd(), "dist", "index.html"));
    } else {
      next(); // In development, let Vite's dev middleware handle the frontend
    }
  }
}
