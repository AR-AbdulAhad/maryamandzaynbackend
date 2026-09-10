import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const url = process.env.DATABASE_URL || "";
const host = url.includes("@") ? url.substring(url.lastIndexOf("@") + 1, url.indexOf("/", url.lastIndexOf("@"))) : "unknown";
const db = url.includes("/") ? url.split("/").pop() : "unknown";

console.log("Testing DB connection...");
console.log("Host:", host, "| Database:", db);

const p = new PrismaClient();

try {
  await p.$connect();
  console.log("RESULT: DB CONNECT OK ✔");
  await p.$disconnect();
} catch (e) {
  console.log("RESULT: DB CONNECT FAIL ✘");
  console.log("Reason:", e.message.split("\n")[0]);
  await p.$disconnect().catch(() => {});
  process.exit(1);
}