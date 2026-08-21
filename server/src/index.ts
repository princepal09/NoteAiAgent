import "dotenv/config";
import app from "./app.js";
import { env } from "./lib/constants.js";

const PORT = env.PORT

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});