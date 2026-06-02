import { Controller, Get } from "@nestjs/common";


export class AppController {
  
  getHealth() {
    return {
      status: "ok",
      framework: "NestJS 🦁",
      message: "✨ خادم تحفة السحابي مبني على NestJS ويعمل بأعلى كفاءة وأمان!",
      timestamp: new Date().toISOString()
    };
  }
}
