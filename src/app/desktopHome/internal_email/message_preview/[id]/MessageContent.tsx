'use client'

import Loading from '@/app/loading';
import { ContentState, Editor, EditorState, convertFromRaw } from 'draft-js';
import { Suspense, useEffect, useState } from 'react';

interface MessageContentProps {
    content: any
}



const MessageContent: React.FC<MessageContentProps> = ({ content }) => {
    const [editorState, setEditorState] = useState<any>('')

    useEffect(() => {
        if (content) {

            const rawContent = JSON?.parse(content);
            const contentState = convertFromRaw(rawContent);
            const editorState = EditorState.createWithContent(contentState);
            setEditorState(editorState)

        }
    }, [content])

    return (
        <>
            <Suspense fallback={<div><Loading /></div>}>
                <div className="px-4 lg:px-0 mt-12 text-gray-700 text-lg leading-relaxed w-full lg:w-3/4">
                    <div className="pb-6">
                        {
                            editorState && <Editor editorState={editorState} readOnly={true} onChange={() => { }} />
                        }
                    </div>
                </div>
            </Suspense>
        </>
    );
};

export default MessageContent;