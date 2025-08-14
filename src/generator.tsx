import React from "react";

import { Resolver } from "./resolver";
import { InputSchema } from "./schema";

export class Generator {
  public readonly schemas: InputSchema[];

  public constructor(
    public readonly file: string
  ) {
    this.schemas = new Resolver(file).execute();
  }

  public execute() {
    return this.schemas.map(schema => this.toReactComponent(schema))
  }

  private fileToReactComponent(file: InputSchema[string]) {
    if (file.type === "folder") {
      return (
        <div>
          <span>{file.name}</span>
          {
            this.toReactComponent(file.content)
          }
        </div>
      );
    } else {
      return <span>{file.name}</span>
    }
  }

  private toReactComponent(schema: InputSchema) {
    return Object.keys(schema).map(key => this.fileToReactComponent(schema[key]));
  }
}

console.log(new Generator(`
\`\`\`lafistory
{
  "test.ts": {
    "name": "test.ts",
    "type": "file"
  }
}
\`\`\`

\`\`\`lafistory
{
  "test1.ts": {
    "name": "test1.ts",
    "type": "file"
  }
}
\`\`\`  
`).execute())