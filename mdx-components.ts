import { useMDXComponents as getThemeComponents } from "nextra-theme-docs"; // nextra-theme-blog or your custom theme

import { withGitHubAlert, Callout } from "nextra/components";

// Get the default MDX components
const themeComponents = getThemeComponents();

// Merge components
export function useMDXComponents(components: React.FC[] = []) {
  return {
    ...themeComponents,
    ...components,
  };
}
