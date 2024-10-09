import configDev from "./config.dev";
import configProd from "./config.prod";
import configGit from "./config.github";

let apiConfig;

if (process.env.NODE_ENV === "production") {
  apiConfig = configProd;
} else if (process.env.NODE_ENV === "development") {
  apiConfig = configDev;
} else {
  apiConfig = configGit;
}

export default apiConfig;
