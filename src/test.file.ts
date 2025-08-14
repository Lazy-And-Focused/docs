export const TEST_FILE = `
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
  "some-folder": {
    "name": "some-folder",
    "type": "folder",
    "content": {
      ".json": {
        "name": ".json",
        "type": "file"
      },

      "some-folder2": {
        "name": "some-folder2",
        "type": "folder",
        "content": {
          "index.ts": {
            "name": "index.ts",
            "type": "file"
          },

          "index.test.ts": {
            "name": "index.test.ts",
            "type": "file"
          }
        }
      }
    }
  }
}
\`\`\``;