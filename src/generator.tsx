import React from "react";

import { Resolver } from "./resolver";
import { InputSchema } from "./schema";

import style from "./style.module.css";

export class Generator {
  public readonly schemas: InputSchema[];
  private count = 0;

  public constructor(
    public readonly file: string
  ) {
    this.schemas = new Resolver(file).execute();
  }

  public execute() {
    return (
      <div>
        {
          this.schemas.flatMap(schema => this.toReactComponent(schema))
        }
      </div>
    )
  }

  private fileToReactComponent(file: InputSchema[string]) {
    this.count++;

    if (file.type === "folder") {
      return (
        <div key={this.count} className={style.folder}>
          <span>{file.name}</span>
          <div>
            {
              this.toReactComponent(file.content)
            }
          </div>
        </div>
      );
    } else {
      return <span key={this.count} className={style.file}>{file.name}</span>
    }
  }

  private toReactComponent(schema: InputSchema) {
    return Object.keys(schema).map(key => this.fileToReactComponent(schema[key]));
  }
}