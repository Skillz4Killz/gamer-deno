import { Model, DataTypes } from "https://deno.land/x/denodb@v1.0.7/mod.ts";

class Guild extends Model {
  // Sets the table name. Good practice to use plural form.
  static table = "guilds";
  // Enables created_at and updated_at fields
  static timestamps = true;
  // Default values if none is provided
  static defaults: {
    prefix: ".";
    language: "en_US";
  };

  static fields = {
    id: {
      primaryKey: true,
      type: DataTypes.STRING,
    },
    prefix: DataTypes.STRING,
    language: DataTypes.STRING,
  };
}

export default Guild;
