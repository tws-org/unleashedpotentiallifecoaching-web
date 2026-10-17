import dotenv from 'dotenv';
import contentfulManagement from 'contentful-management';

dotenv.config({ path: ['.env.local', '.env'] });

function getContentfulEnvironment() {
  const contentfulClient = contentfulManagement.createClient({
    accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN,
  });

  return contentfulClient
    .getSpace(process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID)
    .then((space) =>
      space.getEnvironment(process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT),
    );
}

// contentful-typescript-codegen loads this file with require(), so expose the
// function itself as the CommonJS export (Node 22 require(esm)).
export { getContentfulEnvironment as 'module.exports' };
