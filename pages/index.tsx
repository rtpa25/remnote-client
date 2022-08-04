import { NextPage } from 'next';
import { ThirdPartyEmailPasswordAuth } from 'supertokens-auth-react/recipe/thirdpartyemailpassword';
import {
  doesSessionExist,
  getUserId,
} from 'supertokens-auth-react/recipe/session';
import Document from '@tiptap/extension-document';
import React, { useEffect, useState } from 'react';
import { AiOutlineDoubleLeft, AiOutlineDoubleRight } from 'react-icons/ai';

import { Drawer, TextEditor } from '../components/zExporter';
import axiosInstance from '../utils/axiosInterceptor';
import { User } from '../interfaces/user.interface';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { setCurrentUserData } from '../store/slices/CurrentUser.slice';
import { setCurrentPageData } from '../store/slices/CurrentPage.slice';

const Home: NextPage = () => {
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

  useEffect(() => {
    const lastCurrentPage = localStorage.getItem('currentPage');
    if (lastCurrentPage) {
      dispatch(setCurrentPageData({ page: JSON.parse(lastCurrentPage) }));
    }
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
