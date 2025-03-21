import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { format } from 'date-fns';
import styles from '../../styles';
import { LargeSpinLoader } from '../../components/Loader/SpinLoader';

const apiUrl = import.meta.env.VITE_API_URL;

const MySurveys = () => {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSurveys();
  }, []);

  const fetchSurveys = async () => {
    try {
      const res = await fetch(`${apiUrl}/survey/all`, {
        credentials: 'include',
      });
      const data = await res.json();
      
      if (data.success) {
        setSurveys(data.surveys);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Failed to fetch surveys');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className={styles.flexCenter}><LargeSpinLoader /></div>;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Surveys</h1>
        <Link
          to="/poll/create-survey"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Create Survey
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {surveys.map((survey) => (
          <Link
            key={survey._id}
            to={`/poll/survey/${survey._id}`}
            className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between">
              <h2 className="text-xl font-semibold mb-2">{survey.title}</h2>
              <span className="text-sm text-gray-500">
                {survey.responses.length} responses
              </span>
            </div>
            <p className="text-gray-600 mb-4 line-clamp-2">{survey.description}</p>
            <div className="flex justify-between text-sm text-gray-500">
              <span>By: {survey.author.name}</span>
              <span>
                Ends: {format(new Date(survey.endDate), 'MMM d, yyyy')}
              </span>
            </div>
          </Link>
        ))}
      </div>

      {surveys.length === 0 && (
        <div className="text-center text-gray-500 mt-8">
          No surveys found. Create your first survey!
        </div>
      )}
    </div>
  );
};

export default MySurveys;