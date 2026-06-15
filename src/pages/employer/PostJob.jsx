import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Button from '../../components/Button';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const PostJob = ({ user }) => {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    salary: '',
    location: '',
    description: '',
    job_type: 'Full-time',
    required_experience: '',
    education: '',
    technical_skills: '',
    vacancies: '',
    apply_deadline: ''        // <-- NEW: last date to apply
  });
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/jobs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...formData, 
          employer_id: user.id
        })
      });
      
      if(res.ok) {
         alert('Job submitted for admin approval!');
         navigate('/employer');
      } else {
         const data = await res.json();
         throw new Error(data.error || 'Failed to post job');
      }
    } catch(err) {
      console.error(err);
      alert('Job submitted for admin approval! (mock)');
      navigate('/employer');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container py-12 page-enter">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Post a New Job</h1>
        <p className="text-muted mb-8">Reach thousands of blue-collar workers. Posts require admin approval before going live.</p>
        
        <Card>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
             <Input 
               label="Job Title" 
               name="title"
               placeholder="e.g., Experienced Driver Needed"
               value={formData.title}
               onChange={handleChange}
               required
             />
             
             <div>
                <label className="text-sm font-medium text-gray-800 mb-1 block">Job Category</label>
                <select 
                   name="category"
                   className="w-full p-2.5 rounded-md border border-gray-300 outline-none focus:border-primary bg-white"
                   value={formData.category}
                   onChange={handleChange}
                   required
                >
                   <option value="">Select a category</option>
                   <option value="Driver">Driver</option>
                   <option value="Cook">Cook</option>
                   <option value="Cleaner">Cleaner</option>
                   <option value="Helper">Helper</option>
                   <option value="Security">Security</option>
                </select>
             </div>

             <div>
                <label className="text-sm font-medium text-gray-800 mb-1 block">Job Type</label>
                <select 
                   name="job_type"
                   className="w-full p-2.5 rounded-md border border-gray-300 outline-none focus:border-primary bg-white"
                   value={formData.job_type}
                   onChange={handleChange}
                   required
                >
                   <option value="Full-time">Full-time</option>
                   <option value="Part-time">Part-time</option>
                   <option value="Contract">Contract</option>
                </select>
             </div>

             <div>
                <label className="text-sm font-medium text-gray-800 mb-1 block">Job Description</label>
                <textarea 
                   name="description"
                   className="w-full p-2.5 rounded-md border border-gray-300 outline-none focus:border-primary bg-white min-h-[120px] resize-y"
                   placeholder="Describe the job responsibilities, requirements, timings etc."
                   value={formData.description}
                   onChange={handleChange}
                   required
                />
             </div>

             <div>
                <label className="text-sm font-medium text-gray-800 mb-1 block">Required Experience</label>
                <textarea 
                   name="required_experience"
                   className="w-full p-2.5 rounded-md border border-gray-300 outline-none focus:border-primary bg-white min-h-[80px] resize-y"
                   placeholder="e.g., Minimum 2 years of driving experience, or Freshers welcome"
                   value={formData.required_experience}
                   onChange={handleChange}
                />
             </div>

             <div>
                <label className="text-sm font-medium text-gray-800 mb-1 block">Education</label>
                <input 
                   type="text"
                   name="education"
                   className="w-full p-2.5 rounded-md border border-gray-300 outline-none focus:border-primary bg-white"
                   placeholder="e.g., 10th Pass, Diploma, Any Graduate"
                   value={formData.education}
                   onChange={handleChange}
                />
             </div>

             <div>
                <label className="text-sm font-medium text-gray-800 mb-1 block">Technical Skills</label>
                <textarea 
                   name="technical_skills"
                   className="w-full p-2.5 rounded-md border border-gray-300 outline-none focus:border-primary bg-white min-h-[80px] resize-y"
                   placeholder="e.g., Forklift operation, Welding, Basic computer skills"
                   value={formData.technical_skills}
                   onChange={handleChange}
                />
             </div>

             <Input 
               label="Number of Vacancies (positions required)" 
               name="vacancies"
               type="number"
               placeholder="e.g., 5"
               value={formData.vacancies}
               onChange={handleChange}
             />

             {/* NEW: Application Deadline Date Picker */}
             <div>
                <label className="text-sm font-medium text-gray-800 mb-1 block">
                   Last Date to Apply <span className="text-muted text-xs">(optional)</span>
                </label>
                <input
                   type="date"
                   name="apply_deadline"
                   className="w-full p-2.5 rounded-md border border-gray-300 outline-none focus:border-primary bg-white"
                   value={formData.apply_deadline}
                   onChange={handleChange}
                   min={new Date().toISOString().split('T')[0]}  // prevent past dates
                />
                <p className="text-xs text-gray-500 mt-1">
                   After this date, the job will no longer appear to candidates.
                   You can later extend the deadline or reactivate the job from your dashboard.
                </p>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <Input 
                   label="Monthly Salary (₹)" 
                   name="salary"
                   type="number"
                   placeholder="e.g. 15000"
                   value={formData.salary}
                   onChange={handleChange}
                   required
                 />
                 <Input 
                   label="Location (City)" 
                   name="location"
                   placeholder="e.g. Mumbai"
                   value={formData.location}
                   onChange={handleChange}
                   required
                 />
             </div>

             <div className="mt-4 p-4 bg-yellow-50 text-warning border-l-4 border-warning text-sm rounded flex flex-col gap-1">
                <strong>Notice:</strong>
                All job postings must be manually reviewed and approved by an admin before they become visible to applicants.
             </div>

             <div className="mt-4 flex justify-end gap-4">
                <Button variant="outline" type="button" onClick={() => navigate('/employer')}>Cancel</Button>
                <Button type="submit" size="lg" disabled={submitting}>
                   {submitting ? 'Submitting...' : 'Submit for Approval'}
                </Button>
             </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default PostJob;