import {
  Google,
  init,
} from 'supertokens-auth-react/recipe/thirdpartyemailpassword';
import SessionReact from 'supertokens-auth-react/recipe/session';
import { appInfo } from './appInfo';

export const frontendConfig = () => {
  return {
    appInfo,
    recipeList: [
      init({
        signInAndUpFeature: {
          providers: [Google.init()],
          signUpForm: {
            formFields: [
              {
                id: 'name',
                label: 'User name',
                placeholder: 'User name',
              },
            ],
          },
        },
        palette: {
          primary: '#16161A',
        },
      }),
      SessionReact.init(),
    ],
  };
};
