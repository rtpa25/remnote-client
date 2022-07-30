import { NextPage } from 'next';
import { ThirdPartyEmailPasswordAuth } from 'supertokens-auth-react/recipe/thirdpartyemailpassword';

const Home: NextPage = () => {
  return (
    <ThirdPartyEmailPasswordAuth>
      <div>Home</div>
    </ThirdPartyEmailPasswordAuth>
  );
};

export default Home;
