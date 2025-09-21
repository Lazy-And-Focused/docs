
export type RemoteConfig = {
    localUrl: string;
    url: {
      user: string;
      repo: string;
      branch: string;
      docsPath: string;
    };
    files: string[];
}

/**
 * Пока что это служит только для тестов, так что будет улучшаться
 */
export const remotes: RemoteConfig[] = [
  {
    localUrl: "test-remote",
    url: {
      user: "Lazy-And-Focused",
      repo: "BAD-template",
      branch: "505e42ac8f1b400255d039f07e424faed5c3809f",
      docsPath: "docs/",
    },
    files: ["index.md", "file-structure.md", "route.md"],
  },
];
