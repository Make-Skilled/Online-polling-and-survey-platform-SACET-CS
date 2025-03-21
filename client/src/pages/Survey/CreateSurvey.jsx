import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'sonner';
import styles from '../../styles';
import Button from '../../components/Button';
import CircleLoader from '../../components/Loader/CircleLoader';

const apiUrl = import.meta.env.VITE_API_URL;

const CreateSurvey = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Add this to check if component is mounting
  useEffect(() => {
    console.log('CreateSurvey component mounted');
  }, []);

  const validationSchema = Yup.object({
    title: Yup.string()
      .required('Title is required')
      .min(5, 'Title must be at least 5 characters')
      .max(100, 'Title must not exceed 100 characters'),
    description: Yup.string()
      .required('Description is required')
      .min(10, 'Description must be at least 10 characters')
      .max(500, 'Description must not exceed 500 characters'),
    endDate: Yup.date()
      .min(new Date(), 'End date must be in the future')
      .nullable(),
  });

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      endDate: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${apiUrl}/survey/create`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(values),
        });

        const data = await res.json();

        if (data.success) {
          toast.success('Survey created successfully');
          navigate('/poll/my-surveys');
        } else {
          setError(data.message);
          toast.error(data.message);
        }
      } catch (error) {
        setError('Failed to create survey');
        toast.error('Failed to create survey');
        console.error('Survey creation error:', error);
      } finally {
        setLoading(false);
      }
    },
  });

  // Add error display
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Create New Survey</h1>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              name="title"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full p-2 border rounded-md"
              placeholder="Enter survey title"
            />
            {formik.touched.title && formik.errors.title && (
              <div className="text-red-500 text-sm mt-1">{formik.errors.title}</div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full p-2 border rounded-md"
              rows="4"
              placeholder="Enter survey description"
            />
            {formik.touched.description && formik.errors.description && (
              <div className="text-red-500 text-sm mt-1">{formik.errors.description}</div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              End Date (Optional)
            </label>
            <input
              type="datetime-local"
              name="endDate"
              value={formik.values.endDate}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full p-2 border rounded-md"
            />
            {formik.touched.endDate && formik.errors.endDate && (
              <div className="text-red-500 text-sm mt-1">{formik.errors.endDate}</div>
            )}
          </div>

          <div className="mt-6">
            <Button 
              type="submit"
              title={loading ? <CircleLoader /> : "Create Survey"}
              styles="py-3 px-4 w-full"
              onclicks={formik.handleSubmit}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateSurvey;




