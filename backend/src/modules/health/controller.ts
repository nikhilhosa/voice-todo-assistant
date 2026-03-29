export class HealthController {
  async check() {
    return {
      status: "ok",
      timestamp: new Date(),
    };
  }
}


