import {useState} from "react";
import SideBarLessons from "./SideBarLessons";
import { useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import './styles/CreateLessons.css';
import '../../Login/Login.css';
import TipTap from "./TipTap";
import Modal from "../../../components/Modal/Modal";
import VideoAdder from "./VideoAdder";
import AddDocs from "./AddDocs";
import { useCreateLesson } from "../../../api/courses/coursesHooks";
import { toastService } from "../../../utils/Toast";
import { ToastContainer } from "react-toastify";

const CreateLessons = () => {
    const location = useLocation();
    const {modulos} = location.state || [];
    const [selectedModule, setSelectedModule] = useState(null);
    const [selectedModuleId, setSelectedModuleId] = useState(null);
    const [content, setContent] = useState(JSON.stringify({ type: 'doc', content: [{ type: 'paragraph' }] }));
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDocModalOpen, setIsDocModalOpen] = useState(false);
    const [videos, setVideos] = useState([]);
    const [docs, setDocs] = useState([]);
    const [selectedLesson, setSelectedLesson] = useState(null);


    const {mutateAsync: createLesson, isLoading, error} = useCreateLesson();

    const {register, handleSubmit, formState: { errors }, setValue, reset} = useForm({
        mode: "onChange",
        defaultValues: {
            titulo: "",
            contenido: JSON.stringify({ type: 'doc', content: [{ type: 'paragraph' }] }),
            youtube_videos: [],

        }
    });

    const handleModuleClick = (module) => {
        setSelectedModule(module);
        setSelectedModuleId(module.mod_id);
    }

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleOpenDocModal = () => {
        setIsDocModalOpen(true);
    };

    const handleCloseDocModal = () => {
        setIsDocModalOpen(false);
    };

    const onSubmit = async (data) => {
        const formData = new FormData();
        formData.append("titulo", data.titulo);
        formData.append("contenido", JSON.stringify(data.contenido));
        formData.append("mod_id", selectedModuleId);
        formData.append("youtube_videos", JSON.stringify(videos)); 

        docs.forEach(file => {
            formData.append("archivos", file);
        });

        try {
            const response = await createLesson(formData); 
            toastService.success("Lección creada exitosamente!");
            reset(); 
            setContent(JSON.stringify({ type: 'doc', content: [{ type: 'paragraph' }] })); 
            setVideos([]);
            setDocs([]);  
        } catch (error) {
            console.error("Error creating lesson:", error);
            toastService.error("Error al crear la lección");
        }
    };



    const handleContentChange = (jsonContentString) => {
        setContent(jsonContentString);
        setValue("contenido", jsonContentString);
    }

    return (
        <>
        <ToastContainer/>
        <div className="create-lessons container">
            <SideBarLessons 
                modules={modulos} 
                onModuleSelect={handleModuleClick} 
                selectedModuleId={selectedModuleId}
            />
            <div className="main-content">
                {selectedModule ? (
                    <>
                        <h1>{selectedModule.titulo}</h1>
                        <form onSubmit={handleSubmit(onSubmit)}> 
                            <div className='login__input'>
                                <div className='error-form-course'>
                                    <label className='label__createCourse'>Titulo <p className='required'/></label>
                                    {errors.titulo && <span className="error-message-course">{errors.titulo.message}</span>}
                                </div>
                                <input 
                                    type="text" 
                                    placeholder="Titulo de la lección" 
                                    {...register("titulo", { required: "Este campo es requerido" })} 
                                />
                            </div>
                            <div className='content-input'>
                                <div className='error-form-course'>
                                    <label className='label__createCourse'>Contenido <p className='required'/></label>
                                    {errors.contenido && <span className="error-message-course">{errors.contenido.message}</span>}
                                </div>
                                <TipTap 
                                    description={content} 
                                    onChange={handleContentChange}
                                    handleVideoModal={handleOpenModal}
                                    handleDocModal={handleOpenDocModal}

                                />
                                <input 
                                    type="hidden" 
                                    {...register("contenido", { required: "El contenido es requerido" })}
                                />
                            </div>
                            <button type="submit" className="btn">
                                Crear Lección
                            </button>
                        </form>
                </>
                 ) : (
                    <h1>Selecciona un modulo</h1>
                )}
            </div>
            <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                 <VideoAdder
                    value={videos}
                    onChange={setVideos}
                />
            </Modal>
             <Modal isOpen={isDocModalOpen} onClose={handleCloseDocModal}>
                 <AddDocs
                    value={docs}
                    onChange={setDocs}
                />
            </Modal>
        </div>
        </>
    )
}

export default CreateLessons;