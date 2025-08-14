export const TEST_FILE = `
\`\`\`lafistory
{
  "test.ts": {
    "file": "some description",
    "src": {
        "index.ts": "index.ts"
    }
  }
}
\`\`\`

# Архитектура

\`\`\`lafistory
{
  "test.ts": {
    "file": "file",
    "src": ["\`some-description\`", {
        "index.ts": "index.ts"
    }]
  }
}
\`\`\``;