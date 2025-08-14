import { Generator } from "../generator";
import { TEST_FILE } from "../test.file";

const Page = () => {
  const components = new Generator(TEST_FILE).execute();
  
  return (
    <main>
      {
        components
      }
    </main>
  );
}

export default Page;
