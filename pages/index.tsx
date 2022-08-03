import { NextPage } from 'next';
import { ThirdPartyEmailPasswordAuth } from 'supertokens-auth-react/recipe/thirdpartyemailpassword';
import {
  doesSessionExist,
  getUserId,
} from 'supertokens-auth-react/recipe/session';
import Document from '@tiptap/extension-document';
import Placeholder from '@tiptap/extension-placeholder';
import { Editor, EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import React, { useEffect, useState } from 'react';
import { AiOutlineDoubleLeft, AiOutlineDoubleRight } from 'react-icons/ai';

import { Drawer, TextEditor } from '../components/zExporter';
import axiosInstance from '../utils/axiosInterceptor';
import { User } from '../interfaces/user.interface';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { setCurrentUserData } from '../store/slices/CurrentUser.slice';
import { initialPageBody } from '../utils/initialPageBody';

const CustomDocument = Document.extend({
  content: 'heading block*',
});

const Home: NextPage = () => {
  // const [text, setText] = useState('');
  //@local-states
  const [isSideBarVisInMobile, setIsSideBarVisInMobile] = useState(false);

  //@global-states
  const currentSelectedPage = useAppSelector((state) => state.currentPage.page);
  const dispatch = useAppDispatch();

  useEffect(() => {
    async function getUserInfo() {
      if (await doesSessionExist()) {
        const supertokensId = await getUserId();
        const { data } = await axiosInstance.get<User>(
          `/users/me?supertokensId=${supertokensId}`
        );
        dispatch(setCurrentUserData({ user: data }));
      }
    }
    getUserInfo();
  }, []);

  const toggleDrawer = (open: boolean) => {
    setIsSideBarVisInMobile(open);
  };

  return (
    <ThirdPartyEmailPasswordAuth>
      <div className='h-screen w-screen flex'>
        <div className='text-gray-400 p-2 w-fit cursor-pointer absolute top-0 right-0 left-0 z-20 md:hidden text-xl'>
          {isSideBarVisInMobile ? (
            <AiOutlineDoubleLeft
              onClick={() => {
                toggleDrawer(false);
              }}
            />
          ) : (
            <AiOutlineDoubleRight
              onClick={() => {
                toggleDrawer(true);
              }}
            />
          )}
        </div>
        <Drawer isOpen={isSideBarVisInMobile} />
        {currentSelectedPage && (
          <TextEditor
            toggleDrawer={toggleDrawer}
            currentSelectedPage={currentSelectedPage}
          />
        )}
      </div>
    </ThirdPartyEmailPasswordAuth>
  );
};

export default Home;
