import {useEditor, EditorContent} from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import ToolBar from './ToolBar';
import { useEffect } from 'react';
import './styles/ToolBar.css'

const TipTap = ({ description, onChange, handleVideoModal, handleDocModal }) => {
     const initialContent = description ? JSON.parse(description) : {};

    const editor = useEditor({
        extensions: [StarterKit],
        content: initialContent,
        editorProps: {
            attributes: {
                class: 'editor-content',
            },
        },
        onUpdate: ({ editor }) => { 
            const json = editor.getJSON();
            onChange(JSON.stringify(json));
        }
    });
    
    useEffect(() => {
        const currentEditorJson = editor ? JSON.stringify(editor.getJSON()) : null;
        if (editor && description && description !== currentEditorJson) {
            try {
                const parsedDescription = JSON.parse(description);
                editor.commands.setContent(parsedDescription);        
            } catch (e){
                console.error("Error parsing description for TipTap editor:", e);
                editor.commands.setContent({}); 
            }
        }
    }, [description, editor]);
    
    return (
        <>
        <ToolBar editor={editor} handleVideoModal={handleVideoModal} handleDocModal={handleDocModal}/>
        <div className="tiptap-editor">
            <EditorContent editor={editor} className="editor-content-wrapper"/>
        </div>
        </>
    );
}

export default TipTap;