import { FC, useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInterceptor';
import {
  AiOutlineLoading3Quarters,
  AiOutlinePlus,
  AiOutlinePoweroff,
} from 'react-icons/ai';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { signOut } from 'supertokens-auth-react/recipe/thirdpartyemailpassword';
import { initialPageBody } from '../utils/initialPageBody';
import { Page } from '../interfaces/page.interface';
import { Loader } from './zExporter';
import { addPage, setPages } from '../store/slices/Pages.slice';
import { nanoid } from 'nanoid';
import { setCurrentPageData } from '../store/slices/CurrentPage.slice';

interface DrawerProps {
  isOpen: boolean;
}

const Drawer: FC<DrawerProps> = ({ isOpen }) => {
  //@local states
  const [isLoading, setIsLoading] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [isPagesLoading, setIsPagesLoading] = useState(false);

  //@global states
  const currentUser = useAppSelector((state) => state.currentUser.user)!;
  const pages = useAppSelector((state) => state.pages.pages);
  const currentSelectedPage = useAppSelector((state) => state.currentPage.page);
  const dispatch = useAppDispatch();

  const createPageHandler = async () => {
    if (!currentUser) return;
    setIsLoading(true);
    const newPage: Page = {
      _id: nanoid(),
      name: 'New Page',
      body: initialPageBody,
      createdAt: Date.now().toString(),
      updatedAt: Date.now().toString(),
      user: currentUser._id,
    };
    try {
      dispatch(addPage({ page: newPage }));

      const { data } = await axiosInstance.post<Page>('/pages', {
        name: 'New Page',
        userId: currentUser._id,
        body: initialPageBody,
      });

      localStorage.setItem('currentPage', JSON.stringify(data));
      dispatch(setCurrentPageData({ page: data }));
    } catch (error: any) {
      console.error('error while creating page', error);
    }
    setIsLoading(false);
  };

  const logoutHandler = async () => {
    setLogoutLoading(true);
    try {
      await signOut();
      window.location.href = '/';
    } catch (error) {
      console.error('SUPERTOKENS ERROR AT LOGOUT', error);
    }
    setLogoutLoading(false);
  };

  const pageClickHandler = (page: Page) => {
    localStorage.setItem('currentPage', JSON.stringify(page));
    dispatch(setCurrentPageData({ page: page }));
  };

  useEffect(() => {
    const fetchPages = async () => {
      if (!currentUser) return;
      setIsPagesLoading(true);
      try {
        const { data } = await axiosInstance.get<Page[]>(
          `/pages/user?userId=${currentUser._id}`
        );
        dispatch(setPages({ pages: data }));
      } catch (error) {
        console.error(error);
      }
      setIsPagesLoading(false);
    };
    fetchPages();
  }, [currentUser]);

  if (!currentUser) return <div></div>;

  return (
    <div
      className={`md:w-1/4 bg-gray-100 h-full flex flex-col justify-between md:flex 
      ${isOpen ? 'w-3/5 z-10 absolute shadow-sm' : 'hidden'}`}>
      <div
        className='absolute top-0 right-0 md:right-3/4 m-2 text-xl cursor-pointer'
        onClick={logoutHandler}>
        {logoutLoading ? <AiOutlineLoading3Quarters /> : <AiOutlinePoweroff />}
      </div>
      <div className='flex mt-24 items-center mx-4'>
        <img
          src={`https://ui-avatars.com/api/?background=00002&color=fff&name=${currentUser.name}&font-size=0.3`}
          alt={currentUser.name}
          className='rounded-full scale-150 mx-4'
        />
        <span className='font-semibold mx-3 text-lg'>Ronit Panda</span>
      </div>
      <div className='overflow-y-auto'>
        <hr className='my-4' />
        <h3 className='text-gray-500 text-sm font-semibold mx-4'>DOCUMENTS</h3>
        {isPagesLoading ? (
          <Loader />
        ) : (
          <div className='mx-3'>
            {pages.map((page) => {
              return (
                <div
                  className={`my-3 text-gray-600 hover:bg-gray-200 cursor-pointer p-2 rounded-md bg-gray-100 ${
                    currentSelectedPage?._id === page._id ? 'bg-gray-300' : ''
                  }`}
                  key={page._id}
                  onClick={() => {
                    pageClickHandler(page);
                  }}>
                  {page.name}
                </div>
              );
            })}
          </div>
        )}
      </div>
      <div className='w-full flex justify-center items-center'>
        <button
          className='bg-gray-800 text-white w-11/12 m-2 p-2 rounded-md hover:bg-black duration-100 flex justify-center items-end font-semibold'
          onClick={createPageHandler}>
          {isLoading ? (
            <AiOutlineLoading3Quarters />
          ) : (
            <div className='flex items-center'>
              <AiOutlinePlus className='mr-2' /> Create
            </div>
          )}
        </button>
      </div>
    </div>
  );
};

export default Drawer;
