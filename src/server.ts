import app from "./app";
import config from "./config";
import { prisma } from "./lib/prisma";

async function main() {
  try {
    await prisma.$connect();

    console.log("Database Connected");

    app.listen(config.port, () => {
      console.log(`Server Running On ${config.port}`);
    });
  } catch (error) {
    console.log(error);

    await prisma.$disconnect();

    process.exit(1);
  }
}

main();
