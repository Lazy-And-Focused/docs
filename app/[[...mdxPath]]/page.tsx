import { generateStaticParamsFor, importPage } from "nextra/pages";
import { useMDXComponents as getMDXComponents } from "@/mdx-components";

export const generateStaticParams = generateStaticParamsFor("mdxPath");

type Props = {
  params: { mdxPath: string[] };
};

export async function generateMetadata(props: Props) {
  const { mdxPath } = await props.params;
  const { metadata } = await importPage(mdxPath);

  return metadata;
}

const Wrapper = getMDXComponents().wrapper;

export default async function Page(props: Props) {
  const { mdxPath } = await props.params;
  const result = await importPage(mdxPath);

  const { default: MDXContent, toc, metadata } = result;

  return (
    <Wrapper toc={toc} metadata={metadata}>
      <MDXContent {...props} params={props.params} />
    </Wrapper>
  );
}
