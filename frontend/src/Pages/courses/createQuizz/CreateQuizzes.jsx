import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import SideBarLessons from '../createQuizz/SideBarLessons';
import { ToastContainer } from "react-toastify";
import { toastService } from "../../../utils/Toast";
import '../CreateLessons/styles/CreateLessons.css';
import '../../Login/Login.css';
import { useGetLessonsbyModule } from "../../../api/courses/coursesHooks";

const CreateQuizzes = () => {
    const courseID = 4 //get it from the navigation
    const [selectedModule, setSelectedModule] = useState(null);
    const [selectedModuleId, setSelectedModuleId] = useState(null);
    const [selectedLesson, setSelectedLesson] = useState(null);
    const [selectedLessonId, setSelectedLessonId] = useState(null);
    const {data: lessons, isLoading, isError} = useGetLessonsbyModule(courseID);    

    const { register, handleSubmit, control, formState: { errors } } = useForm({
        defaultValues: {
            preguntas: [
                {
                    pregunta: "",
                    respuestas: [
                        { texto: "", correcta: false }
                    ]
                }
            ]
        }
    });

    const { fields: preguntas, append: appendPregunta, remove: removePregunta } = useFieldArray({
        control,
        name: "preguntas"
    });

    const onSubmit = async (data) => {
        if (!selectedLessonId) {
            toastService.error("Debes seleccionar una lección");
            return;
        }

        const payload = {
            titulo: data.titulo,
            descripcion: data.descripcion,
            lec_id: selectedLessonId,
            preguntas: data.preguntas
        };

        console.log("Datos para enviar:", payload);
    };

    const handleModuleSelect = (module) => {
        setSelectedModule(module);
        setSelectedModuleId(module.mod_id);
        setSelectedLesson(null);
        setSelectedLessonId(null);
    };

    const handleLessonSelect = (lesson, module) => {
        setSelectedLesson(lesson);
        setSelectedLessonId(lesson.lec_id);
        setSelectedModule(module);
        setSelectedModuleId(module.mod_id);
    };

    return (
        <>
        <ToastContainer />
        <div className="create-lessons container">
           {isLoading ? ( 
            <SideBarLessons
                modules={lessons}
                onModuleSelect={handleModuleSelect}
                selectedModuleId={selectedModuleId}
                onLessonSelect={handleLessonSelect}
                selectedLessonId={selectedLessonId}
            />
           ) : (
            <h1>...</h1>
           )
        }
            <div className="main-content">
                {selectedLesson ? (
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <h2>Crear Quiz para: {selectedLesson.titulo}</h2>

                        <div className='login__input'>
                            <label>Título del Quiz *</label>
                            <input {...register("titulo", { required: "Este campo es obligatorio" })} />
                            {errors.titulo && <p className="error">{errors.titulo.message}</p>}
                        </div>

                        <div className='login__input'>
                            <label>Descripción</label>
                            <textarea {...register("descripcion")} />
                        </div>

                        <h3>Preguntas</h3>
                        {preguntas.map((pregunta, index) => (
                            <div key={pregunta.id} className="question-block">
                                <input
                                    placeholder="Escribe la pregunta"
                                    {...register(`preguntas.${index}.pregunta`, { required: "Pregunta requerida" })}
                                />
                                {errors.preguntas?.[index]?.pregunta && <p className="error">{errors.preguntas[index].pregunta.message}</p>}

                                <h4>Respuestas</h4>
                                <RespuestaFieldArray nestIndex={index} {...{ control, register }} />

                                <button type="button" onClick={() => removePregunta(index)}>Eliminar pregunta</button>
                            </div>
                        ))}

                        <button type="button" onClick={() => appendPregunta({ pregunta: "", respuestas: [{ texto: "", correcta: false }] })}>
                            + Agregar pregunta
                        </button>

                        <button type="submit" className="btn">Crear Quiz</button>
                    </form>
                ) : (
                    <h2>Selecciona una lección para crear un cuestionario</h2>
                )}
            </div>
        </div>
        </>
    );
};

// Componente para manejar respuestas anidadas dentro de preguntas
const RespuestaFieldArray = ({ nestIndex, control, register }) => {
    const { fields, append, remove } = useFieldArray({
        control,
        name: `preguntas.${nestIndex}.respuestas`
    });

    return (
        <>
            {fields.map((field, k) => (
                <div key={field.id} className="answer-block">
                    <input
                        placeholder={`Respuesta ${k + 1}`}
                        {...register(`preguntas.${nestIndex}.respuestas.${k}.texto`, { required: "Respuesta requerida" })}
                    />
                    <label>
                        <input
                            type="checkbox"
                            {...register(`preguntas.${nestIndex}.respuestas.${k}.correcta`)}
                        />
                        Correcta
                    </label>
                    <button type="button" onClick={() => remove(k)}>Eliminar respuesta</button>
                </div>
            ))}
            <button type="button" onClick={() => append({ texto: "", correcta: false })}>+ Agregar respuesta</button>
        </>
    );
};

export default CreateQuizzes;
