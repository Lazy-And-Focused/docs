import { remotes } from "@/shared/config/remotes";
import { LocalModeComponent, RemoteModeComponent } from "./_view";

// export const generateStaticParams = generateStaticParamsFor("slug");

type PageProps = {
  params: Promise<{ slug: string[] }>;
};

// export async function generateMetadata(props: PageProps) {
//   const { slug } = await props.params;
//   const { metadata } = await importPage(slug);

//   return {
//     ...metadata,
//     title: `${metadata.title} ◌ Lazy And Focused`,
//   };
// }

export default async function DocumentationPage(props: PageProps) {
  const { slug } = await props.params;
  const isRemote = validateRemote(slug || []);

  if (isRemote) {
    return <RemoteModeComponent {...props} />;
  } else {
    return <LocalModeComponent {...props} />;
  }
}

function validateRemote(slug: string[]): boolean {
  const path = slug.join("/");
  const remote = remotes.find((remote) => {
    return path.startsWith(remote.localUrl);
  });

  return !!remote;
}
