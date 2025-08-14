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
      <div className={style.main}>
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
      return (
        <div key={this.count} className={style.file}>
          <span className={style.name}>{file.name}</span>
          {
            file.description
              ? <span className={style.description}>{file.description}</span>
              : <></>
          }
        </div>
      )
    }
  }

  private toReactComponent(schema: InputSchema) {
    return Object.keys(schema).map(key => this.fileToReactComponent(schema[key]));
  }
}