import { FC, useEffect } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Document from '@tiptap/extension-document';
import Placeholder from '@tiptap/extension-placeholder';
import { Page } from '../interfaces/page.interface';
import { initialPageBody } from '../utils/initialPageBody';

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
      Placeholder.configure({
        placeholder: ({ node }) => {
          if (node.type.name === 'heading') {
            return 'What’s the title?';
          }

          return 'Can you add some further context?';
        },
      }),
    ],
    content: currentSelectedPage ? currentSelectedPage.body : initialPageBody,
    onUpdate: (props) => {
      console.log(props.editor.options.content);
    },
  });

  useEffect(() => {
    if (editor) {
      // console.log('I am coming here');
      editor.options.content = currentSelectedPage.body;
      console.log(editor.options.content);
    }
  }, [currentSelectedPage]);

  // useEffect(() => {
  //   const timer = setTimeout(async () => {
  //     //make the api call to store the rems inside the page here
  //   }, 500);

  //   return () => {
  //     clearTimeout(timer);
  //   };
  // }, []);

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
