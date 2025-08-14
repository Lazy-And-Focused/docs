import { Schema } from "./schema";

export class Resolver {
  public static readonly REG_EXP = /(?:\`\`\`lafistory\s+([^`]*)\s+\`\`\`)*/g;
  public static readonly LOCAL_REG_EXP = /(?:\`\`\`lafistory\s+([\w\W]*)\s+\`\`\`)*/;
  public static readonly INCLUDED_FILE_TYPES = ["file", "folder"];

  public constructor(
    public readonly file: string
  ) {}

  public execute() {
    return this.toJson();
  }

  private validateFile() {
    const matched = this.file.match(Resolver.REG_EXP)

    if (!matched) return [];

    return matched
      .filter(v => !!v)
      .map(lafistory => {
        const matched = lafistory.match(Resolver.LOCAL_REG_EXP);
        
        if (!matched) return null;

        const value = matched[1]
        if (!value) return null

        return value;
      })
      .filter(v => v != null);
  }

  private validateSchema(schema: Schema) {
    const output: Schema = {};

    for (const key in schema) {
      const value = schema[key];

      const valueValided = typeof value === "object" || typeof value === "string";
      if (!valueValided) {
        continue;
      }

      if (typeof value !== "string") {
        output[key] = Array.isArray(value)
          ? [value[0], this.validateSchema(value[1])]
          : this.validateSchema(value);
      } else {
        output[key] = value;
      }
    }

    return output;
  }

  private toJson() {
    return this.validateFile().map(lafistory => {
      try {
        const schema: Schema = JSON.parse(lafistory);

        return this.validateSchema(schema);
      } catch (error) {
        console.error(error);
        return null;
      }
    }).filter(schema => schema !== null);
  }
}