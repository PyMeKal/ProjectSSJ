import fs from "fs";
import path from "path";
import process from "process";
import { fileURLToPath, pathToFileURL } from "url";
import Sequelize from "sequelize";
import configByEnv from "../config/config.cjs";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const basename = path.basename(filename);
const env = process.env.NODE_ENV || "development";
const config = configByEnv[env];
const db = {};

// One Sequelize instance is shared by every model in this folder.
const sequelize = config.use_env_variable
  ? new Sequelize(process.env[config.use_env_variable], config)
  : new Sequelize(config.database, config.username, config.password, config);

// Load every model file next to this index file, except this file itself.
const modelFiles = fs
  .readdirSync(dirname)
  .filter((file) => (
    file.indexOf(".") !== 0 &&
    file !== basename &&
    file.slice(-3) === ".js" &&
    file.indexOf(".test.js") === -1
  ));

// Each model file exports a function: (sequelize, DataTypes) => Model.
for (const file of modelFiles) {
  const modelModule = await import(pathToFileURL(path.join(dirname, file)).href);
  const defineModel = modelModule.default;

  if (typeof defineModel === "function") {
    const model = defineModel(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  }
}

// Associations need every model to exist first, so they are wired after loading.
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export { Sequelize, sequelize };
export default db;
