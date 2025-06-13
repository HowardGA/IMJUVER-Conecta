import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

const LessonContent = ({ content }) => {
  const editor = useEditor({
    editable: false,
    extensions: [StarterKit],
    content,
  });

  if (!editor) return null;

  return <EditorContent editor={editor} />;
};

export default LessonContent;