import "dotenv/config";
import { ensureSchema } from "../src/lib/db";

ensureSchema()
  .then(() => {
    console.log("Schema ready.");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Migration failed:", err);
    process.exit(1);
  });
