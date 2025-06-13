import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form"; 
import './styles/VideoAdder.css';

const YOUTUBE_URL_REGEX = /^(?:https?:\/\/)?(?:www\.)?(?:m\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/)?)([a-zA-Z0-9_-]{11})(?:\S+)?$/;

const VideoAdder = ({ value, onChange }) => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: { videoUrl: '' }
    });

    const [localVideos, setLocalVideos] = useState(value || []);

    useEffect(() => {
        if (value) {
            setLocalVideos(value);
        }
    }, [value]);

    const extractYoutubeVideoId = (url) => {
        const match = url.match(YOUTUBE_URL_REGEX);
        return match ? match[1] : null;
    };

    const handleAddVideo = (data) => {
        const rawUrl = data.videoUrl.trim();
        const videoId = extractYoutubeVideoId(rawUrl);

        if (!videoId) {
            alert("Please enter a valid YouTube URL.");
            return;
        }

        if (localVideos.includes(videoId)) {
            alert("This video is already in the list.");
            return;
        }

        const newVideos = [...localVideos, videoId];
        setLocalVideos(newVideos); 
        onChange(newVideos); 
        reset({ videoUrl: '' }); 
    };

    const handleRemoveVideo = (indexToRemove) => {
        const newVideos = localVideos.filter((_, index) => index !== indexToRemove);
        setLocalVideos(newVideos); 
        onChange(newVideos);
    };

    const getEmbedUrl = (videoId) => `https://www.youtube.com/embed/${videoId}`;

    return (
        <div className="video-adder-container">
            <form onSubmit={handleSubmit(handleAddVideo)} className="video-input-form">
                <input
                    type="text"
                    placeholder="YouTube URL"
                    {...register("videoUrl", {
                        required: "URL es requerida",
                        pattern: {
                            value: YOUTUBE_URL_REGEX,
                            message: "URL debe de ser de Youtube",
                        },
                    })}
                    className="video-input-field"
                />
                <button type="submit" className="add-video-button">
                    <div className="light-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                            <path fillRule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
                        </svg>
                    </div>
                </button>
                {errors.videoUrl && <p className="error-message">{errors.videoUrl.message}</p>}
            </form>

            {localVideos.length > 0 && (
                <div className="video-list-container">
                    <p className="list-title">Videos para agregar:</p>
                    <ul className="video-list">
                        {localVideos.map((videoId, index) => (
                            <li key={videoId} className="video-list-item">
                                <a href={getEmbedUrl(videoId)} target="_blank" rel="noopener noreferrer">
                                    {`youtu.be/${videoId}`}
                                </a>
                                <button
                                    type="button"
                                    onClick={() => handleRemoveVideo(index)}
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

export default VideoAdder;