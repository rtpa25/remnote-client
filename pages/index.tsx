import { NextPage } from 'next';
import { ThirdPartyEmailPasswordAuth } from 'supertokens-auth-react/recipe/thirdpartyemailpassword';
import {
  doesSessionExist,
  getUserId,
} from 'supertokens-auth-react/recipe/session';
import { useEffect, useState } from 'react';
import { AiOutlineDoubleLeft, AiOutlineDoubleRight } from 'react-icons/ai';

import { Drawer, TextEditor } from '../components/zExporter';
import axiosInstance from '../utils/axiosInterceptor';
import { User } from '../interfaces/user.interface';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { setCurrentUserData } from '../store/slices/CurrentUser.slice';
import { setCurrentPageData } from '../store/slices/CurrentPage.slice';
import { Page } from '../interfaces/page.interface';

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
    const lastCurrentPageId = localStorage.getItem('currentPageId');
    if (lastCurrentPageId) {
      const fetchDoc = async () => {
        try {
          const { data } = await axiosInstance.get<Page>(
            `/pages?pageId=${lastCurrentPageId as string}`
          );
          dispatch(setCurrentPageData({ page: data }));
        } catch (error) {
          console.error(
            'error while fetching locally stored last used document',
            error
          );
        }
      };
      fetchDoc();
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
