import { InputSchema } from "./schema";

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

  private validateSchema(schema: InputSchema) {
    const output: InputSchema = {};

    for (const key in schema) {
      const { type, name } = schema[key];
      if (!Resolver.INCLUDED_FILE_TYPES.includes(type)) {
        console.error("File type error, file type " + type + " is not exists");
        continue;
      }

      if (typeof name !== "string") {
        console.error("name is not a string");
        continue;
      }

      if (type === "file") {
        output[key] = schema[key];
        continue;
      } else {
        output[key] = {
          name, type,
          content: this.validateSchema(schema[key].content)
        };
      }
    }

    return output;
  }

  private toJson() {
    return this.validateFile().map(lafistory => {
      try {
        const schema: InputSchema = JSON.parse(lafistory);

        return this.validateSchema(schema);
      } catch (error) {
        console.error(error);
        return null;
      }
    }).filter(schema => schema !== null);
  }
}

console.log(new Resolver(`
\`\`\`lafistory
{
  "test": {
    "name": "test",
    "type": "file"
  }
}
\`\`\`

\`\`\`lafistory
{
  "test23": {
    "name": "test23",
    "type": "file"
  }
}
\`\`\`  
`).execute())