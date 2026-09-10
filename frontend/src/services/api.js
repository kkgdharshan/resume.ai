import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const analyzeResume = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await axios.post(`${API_URL}/analyze`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const compareJob = async (resumeId, jobDescription) => {
  const response = await axios.post(`${API_URL}/compare`, {
    resume_id: resumeId,
    job_description: jobDescription,
  });
  return response.data;
};

export const chatWithAssistant = async (resumeId, message) => {
  const response = await axios.post(`${API_URL}/chat`, {
    resume_id: resumeId,
    message: message,
  });
  return response.data;
};
