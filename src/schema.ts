export type File = {
  name: string
} & ({
  type: "file",
} | {
  type: "folder",
  content: { [name: string]: File }
});

export type InputSchema = {
  [name: string]: File
}
