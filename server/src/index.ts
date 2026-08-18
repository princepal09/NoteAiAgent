import "dotenv/config";
import app from "./app";
import { env } from "./lib/constants";

const PORT = env.PORT

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});