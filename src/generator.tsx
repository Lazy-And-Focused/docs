import React from "react";

import { Resolver } from "./resolver";
import { Schema } from "./schema";

import style from "./style.module.css";

export class Generator {
  public readonly schemas: Schema[];
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

  private fileToReactComponent(file: { name: string, data: Schema[string] }) {
    this.count++;

    if (typeof file.data !== "string") {
      return (
        <div key={this.count} className={style.folder}>
          <span>{file.name}</span>
          <div>
            {
              this.toReactComponent(file.data)
            }
          </div>
        </div>
      );
    } else {
      return (
        <div key={this.count} className={style.file}>
          <span className={style.name}>{file.name}</span>
          {
            (file.name !== file.data) && file.data !== ""
              ? <span className={style.description}>{file.data}</span>
              : <></>
          }
        </div>
      )
    }
  }

  private toReactComponent(schema: Schema) {
    return Object.keys(schema).map(key => this.fileToReactComponent({ name: key, data: schema[key] }));
  }
}