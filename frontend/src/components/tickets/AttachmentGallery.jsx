import React from 'react';

const AttachmentGallery = ({ attachments = [] }) => {
    if (!attachments.length) {
        return null;
    }

    return (
        <div className="attachment-gallery">
            <h3>Attachments</h3>
            <div style={{ display: 'grid', gap: '8px' }}>
                {attachments.map((attachment, index) => (
                    <a
                        key={`${attachment}-${index}`}
                        href={attachment}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                            display: 'inline-block',
                            padding: '10px 12px',
                            border: '1px solid #ddd',
                            borderRadius: '6px',
                            textDecoration: 'none',
                            color: '#007bff'
                        }}
                    >
                        {attachment}
                    </a>
                ))}
            </div>
        </div>
    );
};

export default AttachmentGallery;
