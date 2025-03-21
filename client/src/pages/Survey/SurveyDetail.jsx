import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { useUserInfo } from '../../contexts/UserContext';
import styles from '../../styles';
import { LargeSpinLoader } from '../../components/Loader/SpinLoader';
import Button from '../../components/Button';

const apiUrl = import.meta.env.VITE_API_URL;

const SurveyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userInfo } = useUserInfo();
  const [survey, setSurvey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [response, setResponse] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchSurveyDetails();
  }, [id]);

  const fetchSurveyDetails = async () => {
    try {
      const res = await fetch(`${apiUrl}/survey/get/${id}`, {
        credentials: 'include',
      });
      const data = await res.json();
      
      if (data.success) {
        setSurvey(data.survey);
      } else {
        toast.error(data.message);
        navigate('/poll/my-surveys');
      }
    } catch (error) {
      toast.error('Failed to fetch survey details');
      navigate('/poll/my-surveys');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitResponse = async (e) => {
    e.preventDefault();
    if (!response.trim()) {
      toast.error('Please enter your response');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${apiUrl}/survey/submit/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ response }),
      });

      const data = await res.json();
      
      if (data.success) {
        toast.success('Response submitted successfully');
        setResponse('');
        fetchSurveyDetails();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Failed to submit response');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className={styles.flexCenter}><LargeSpinLoader /></div>;
  }

  const hasResponded = survey.responses.some(r => r.user._id === userInfo._id);
  const isExpired = new Date(survey.endDate) < new Date();

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-2xl font-bold mb-4">{survey.title}</h1>
        <p className="text-gray-600 mb-4">{survey.description}</p>
        <div className="flex justify-between text-sm text-gray-500">
          <span>Created by: {survey.author.name}</span>
          <span>Ends: {format(new Date(survey.endDate), 'PPP')}</span>
        </div>
      </div>

      {!hasResponded && !isExpired && (
        <form onSubmit={handleSubmitResponse} className="bg-white rounded-lg shadow-md p-6 mb-6">
          <textarea
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            className="w-full p-2 border rounded-md h-32 mb-4"
            placeholder="Enter your response..."
          />
          <Button
            type="submit"
            title={submitting ? 'Submitting...' : 'Submit Response'}
            styles="py-3 px-4 w-full"
            onclicks={handleSubmitResponse}
          />
        </form>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Responses ({survey.responses.length})</h2>
        {survey.responses.map((response, index) => (
          <div key={index} className="border-b last:border-b-0 py-4">
            <div className="flex items-center gap-2 mb-2">
              <img
                src={response.user.avatar.url}
                alt={response.user.name}
                className="w-8 h-8 rounded-full"
              />
              <span className="font-medium">{response.user.name}</span>
              <span className="text-sm text-gray-500">
                • {format(new Date(response.createdAt), 'PPP')}
              </span>
            </div>
            <p className="text-gray-600">{response.response}</p>
          </div>
        ))}
        
        {survey.responses.length === 0 && (
          <p className="text-center text-gray-500">No responses yet</p>
        )}
      </div>
    </div>
  );
};

export default SurveyDetail;
