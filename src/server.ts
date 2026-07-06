import app from "./app";
import config from "./config";
import { prisma } from "./lib/prisma";

async function main() {
  try {
    await prisma.$connect();

    console.log("✅ Database Connected");

    app.listen(config.port, () => {
      console.log(`🚀 Server Running On Port ${config.port}`);
    });
  } catch (error) {
    console.error(error);
  }
}

main();

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
