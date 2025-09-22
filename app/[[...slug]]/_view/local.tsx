import { useMDXComponents as getMDXComponents } from "@/mdx-components";
import { importPage } from "nextra/pages";

type Props = {
  params: Promise<{ slug: string[] }>;
};

const Wrapper = getMDXComponents().wrapper;

export  async function LocalModeComponent(props: Props) {
  const { slug } = await props.params;
  const result = await importPage(slug);

  const { default: MDXContent, toc, metadata } = result;

  return (
    <Wrapper toc={toc} metadata={metadata}>
      <MDXContent {...props} params={props.params} />
    </Wrapper>
  );
}
