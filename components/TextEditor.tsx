import { FC, useEffect } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Document from '@tiptap/extension-document';
import Placeholder from '@tiptap/extension-placeholder';
import { Page } from '../interfaces/page.interface';
import { initialPageBody } from '../utils/initialPageBody';
import axiosInstance from '../utils/axiosInterceptor';
import { useAppDispatch } from '../hooks/redux';
import { updateCurrentPageData } from '../store/slices/CurrentPage.slice';
import { updatePage } from '../store/slices/Pages.slice';
import { SmilieReplacer } from '../plugins/SmileyReplacer';
import TaskItem from '@tiptap/extension-task-item';
import TaskList from '@tiptap/extension-task-list';

interface TextEditorProps {
  toggleDrawer: (open: boolean) => void;
  currentSelectedPage: Page;
}

const CustomDocument = Document.extend({
  content: 'heading block*',
});

const TextEditor: FC<TextEditorProps> = ({
  toggleDrawer,
  currentSelectedPage,
}) => {
  const editor = useEditor({
    extensions: [
      CustomDocument,
      StarterKit.configure({
        document: false,
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),

      Placeholder.configure({
        placeholder: ({ node }) => {
          if (node.type.name === 'heading') {
            return 'What’s the title?';
          }

          return 'Can you add some further context?';
        },
      }),
      SmilieReplacer,
    ],
    content: currentSelectedPage ? currentSelectedPage.body : initialPageBody,
    onTransaction: (props) => {
      localStorage.setItem(
        'currentCursor',
        props.transaction.selection.anchor.toString()
      );
    },
    autofocus: localStorage.getItem('currentCursor')
      ? parseInt(localStorage.getItem('currentCursor') as string)
      : 0,
  });

  const dispatch = useAppDispatch();

  //gets the initial state of the document from the database
  useEffect(() => {
    if (editor) {
      editor.commands.setContent(currentSelectedPage.body);
      const lastCursorLocation = localStorage.getItem('currentCursor');
      if (lastCursorLocation) {
        editor.commands.setTextSelection(parseInt(lastCursorLocation));
      }
    }
  }, [currentSelectedPage]);

  useEffect(() => {
    const timer = setInterval(async () => {
      if (!editor?.isFocused) return;

      const text = editor?.getHTML();
      const jsonText = editor?.getJSON();

      if (!jsonText?.content) return;
      const newHeading = jsonText.content[0].content![0].text;

      if (newHeading && text && editor?.isFocused) {
        dispatch(updateCurrentPageData({ name: newHeading, body: text }));
        dispatch(
          updatePage({
            page: { ...currentSelectedPage, name: newHeading, body: text },
          })
        );
        localStorage.setItem(
          'currentPage',
          JSON.stringify(currentSelectedPage)
        );
        await axiosInstance.patch('/pages', {
          pageId: currentSelectedPage._id,
          name: newHeading,
          body: text,
        });
      }
    }, 9000);

    return () => clearInterval(timer);
  }, [editor, currentSelectedPage]);

  return (
    <EditorContent
      editor={editor}
      className='w-full md:w-3/4 overflow-y-auto'
      onClick={() => {
        toggleDrawer(false);
      }}
    />
  );
};

export default TextEditor;
