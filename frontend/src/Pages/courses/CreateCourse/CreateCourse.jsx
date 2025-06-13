import {useState, useEffect} from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import '../components/CoursesComponents.css';
import '../../Login/Login.css';
import './CreateCourse.css';
import CourseDetailsSteps from './CourseDetailsSteps.jsx';
import ModulesStep from './ModuleStep';
import { useCreateCourse } from '../../../api/courses/coursesHooks.js';
import { useNavigate } from 'react-router-dom';


const CreateCourse = () => {
    const [previewURL, setPreviewURL] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [step, setStep] = useState(1);
    const methods = useForm();
    const navigate = useNavigate();

    const {mutateAsync: createCourse, isLoading, error} = useCreateCourse();

    const handleImageChange = (event) => {
        const file = event.target.files[0];

        if (file) {
        if (previewURL) URL.revokeObjectURL(previewURL);

        const newPreviewURL = URL.createObjectURL(file);
        setPreviewURL(newPreviewURL);
        setSelectedFile(file);
        } else {
        setPreviewURL(null);
        setSelectedFile(null);
        }
    };

    useEffect(() => {
        return () => {
        if (previewURL) {
            URL.revokeObjectURL(previewURL);
        }
        };
    }, [previewURL]);

      
const onSubmit = async (data) => {
  if (step === 1) {
    setStep(2);
    console.log('Step 1 data:', data);
    console.log('Selected file:', previewURL);
  } else {
    try {
      const formData = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        if (key !== 'portada' && key !== 'modulos') {
          formData.append(key, value);
        }
      });

       if (!selectedFile) {
          throw new Error('Image is required');
        }
        console.log('Selected file:', selectedFile);
      formData.append('portada', selectedFile);

      if (data.modulos && data.modulos.length > 0) {
        formData.append('modulos', JSON.stringify(data.modulos));
      } else {
        throw new Error('At least one module is required');
      }

      console.log('FormData contents:');
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      await createCourse(formData);
      
      navigate('/courses');
    } catch (e) {
      console.error('Error creating course:', e);
    }
  }
};

    return(
        <div className="create-course__page container">
            <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          {/* Progress indicator */}
          <div className="form-steps">
            <div className={`step ${step === 1 ? 'active' : ''}`}>1. Detalles</div>
            <div className={`step ${step === 2 ? 'active' : ''}`}>2. Modulos</div>
          </div>

          {step === 1 && (
            <CourseDetailsSteps 
                previewURL={previewURL} 
                handleImageChange={handleImageChange}
                methods={methods}
            />
          )}

          {step === 2 && (
            <ModulesStep methods={methods} />
          )}

          <div className="form-navigation">
            {step > 1 && (
              <button type="button" className='btn next-button' onClick={() => setStep(step - 1)}>
                Anterior
              </button>
            )}
            <button type="submit" className='next-button btn'>
              {step === 2 ? 'Crear curso' : 'Siguiente'}
            </button>
          </div>
        </form>
      </FormProvider>
        </div>
    );
}

export default CreateCourse;