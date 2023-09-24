import React from 'react';

function MessageContent({ content }: any) {
    // Render the Quill content as HTML
    return (
        <div dangerouslySetInnerHTML={{ __html: JSON.parse(content) }} />
    );
}

export default MessageContent;
// Compare this snippet from src/app/industries/%5Bid%5D/Main.tsx: