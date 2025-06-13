// AddDocs.jsx
import { useState, useEffect } from "react";
import './styles/VideoAdder.css'; 

const ACCEPTED_FILE_TYPES = {
    'application/pdf': '.pdf',
    'application/vnd.ms-powerpoint': '.ppt',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': '.pptx',
    'application/msword': '.doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
    'application/vnd.ms-excel': '.xls',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx',
};

const AddDocs = ({ value, onChange }) => {
    const [localDocs, setLocalDocs] = useState(value || []);

    useEffect(() => {
        if (value) {
            setLocalDocs(value);
        }
    }, [value]);

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const isAcceptedType = Object.keys(ACCEPTED_FILE_TYPES).includes(file.type) ||
                               Object.values(ACCEPTED_FILE_TYPES).some(ext => file.name.toLowerCase().endsWith(ext));

        if (!isAcceptedType) {
            alert(`Unsupported file type: ${file.type || file.name}. Please upload PDF, PPT/PPTX, DOC/DOCX, or XLS/XLSX files.`);
            event.target.value = ''; 
            return;
        }

        if (localDocs.some(doc => doc.name === file.name)) {
            alert(`A file with the name "${file.name}" is already in the list. Please rename if it's a different file.`);
            event.target.value = ''; 
            return;
        }

        try {
                const newDocs = [...localDocs, file];
                setLocalDocs(newDocs);
                onChange(newDocs);
                
        } catch (error) {
            console.error("Error adding file:", error);
            alert("Failed to upload file. Please try again.");
            event.target.value = ''; 
        }
    };

    const handleRemoveDoc = (indexToRemove) => {
        const newDocs = localDocs.filter((_, index) => index !== indexToRemove);
        setLocalDocs(newDocs);
        onChange(newDocs);
    };

    const getDisplayFileType = (mimeType, fileName) => {
        if (mimeType.includes('pdf')) return 'PDF';
        if (mimeType.includes('powerpoint') || fileName.endsWith('.ppt') || fileName.endsWith('.pptx')) return 'PPT';
        if (mimeType.includes('wordprocessingml') || mimeType.includes('msword') || fileName.endsWith('.doc') || fileName.endsWith('.docx')) return 'DOC';
        if (mimeType.includes('spreadsheetml') || mimeType.includes('excel') || fileName.endsWith('.xls') || fileName.endsWith('.xlsx')) return 'XLS';
        return mimeType.split('/')[1] || mimeType || 'File'; 
    };


    return (
        <div className="video-adder-container">
            <div className="video-input-form">
                <input
                    type="file"
                    onChange={handleFileChange}
                    className="video-input-field"
                    accept=".pdf, .doc, .docx, .ppt, .pptx, .xls, .xlsx, application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.ms-powerpoint, application/vnd.openxmlformats-officedocument.presentationml.presentation, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                />
            </div>

            {localDocs.length > 0 && (
                <div className="video-list-container">
                    <p className="list-title">Archivos para agregar:</p>
                    <ul className="video-list">
                        {localDocs.map((doc, index) => (
                            <li key={doc.url || index} className="video-list-item">
                                <span className="doc-name">{doc.name || 'Unnamed File'}</span>
                                <span className="doc-type">({getDisplayFileType(doc.type, doc.name)})</span>
                                {doc.url && (
                                    <a href={doc.url} target="_blank" rel="noopener noreferrer" className="doc-link">
                                        <div className="light-icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                            <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                                            <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    </a>
                                )}
                                <button
                                    type="button"
                                    onClick={() => handleRemoveDoc(index)}
                                    className="remove-video-button"
                                >
                                    <div className="light-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                            <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default AddDocs;