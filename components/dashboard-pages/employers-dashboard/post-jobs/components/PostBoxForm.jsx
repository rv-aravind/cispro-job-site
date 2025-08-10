// components/dashboard-pages/employers-dashboard/post-jobs/components/JobPostForm.jsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Select from 'react-select';

const JobPostForm = ({ mode = 'create', jobId }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    contactEmail: '',
    contactUsername: '',
    specialisms: [],
    jobType: '',
    offeredSalary: '',
    careerLevel: '',
    experience: '',
    gender: 'No Preference',
    industry: '',
    qualification: '',
    applicationDeadline: '',
    location: {
      country: '',
      city: '',
      completeAddress: '',
    },
    remoteWork: 'On-site',
    jobStatus: 'Published',
    companyProfile: '',
  });
  const [companyProfiles, setCompanyProfiles] = useState([]);
  const [errors, setErrors] = useState({});
  const isEdit = mode === 'edit';
  const isCreate = mode === 'create';
  const isView = mode === 'view';

  // Options for select fields
  const specialismOptions = [
    { value: 'Banking', label: 'Banking' },
    { value: 'Digital & Creative', label: 'Digital & Creative' },
    { value: 'Retail', label: 'Retail' },
    { value: 'Human Resources', label: 'Human Resources' },
    { value: 'Management', label: 'Management' },
    { value: 'Accounting & Finance', label: 'Accounting & Finance' },
    { value: 'Digital', label: 'Digital' },
    { value: 'Creative Art', label: 'Creative Art' },
  ];

  const jobTypeOptions = [
    { value: 'Full-time', label: 'Full-time' },
    { value: 'Part-time', label: 'Part-time' },
    { value: 'Contract', label: 'Contract' },
    { value: 'Freelance', label: 'Freelance' },
    { value: 'Internship', label: 'Internship' },
    { value: 'Temporary', label: 'Temporary' },
  ];

  const salaryOptions = [
    { value: '$1500', label: '$1500' },
    { value: '$2000', label: '$2000' },
    { value: '$2500', label: '$2500' },
    { value: '$3500', label: '$3500' },
    { value: '$4500', label: '$4500' },
    { value: '$5000', label: '$5000' },
    { value: 'Negotiable', label: 'Negotiable' },
  ];

  const careerLevelOptions = [
    { value: 'Entry Level', label: 'Entry Level' },
    { value: 'Intermediate', label: 'Intermediate' },
    { value: 'Mid Level', label: 'Mid Level' },
    { value: 'Senior Level', label: 'Senior Level' },
    { value: 'Executive', label: 'Executive' },
  ];

  const experienceOptions = [
    { value: 'Less than 1 year', label: 'Less than 1 year' },
    { value: '1-3 years', label: '1-3 years' },
    { value: '3-5 years', label: '3-5 years' },
    { value: '5-10 years', label: '5-10 years' },
    { value: '10+ years', label: '10+ years' },
  ];

  const genderOptions = [
    { value: 'No Preference', label: 'No Preference' },
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
    { value: 'Other', label: 'Other' },
  ];

  const qualificationOptions = [
    { value: 'High School', label: 'High School' },
    { value: 'Associate Degree', label: 'Associate Degree' },
    { value: 'Bachelor’s Degree', label: 'Bachelor’s Degree' },
    { value: 'Master’s Degree', label: 'Master’s Degree' },
    { value: 'Doctorate', label: 'Doctorate' },
    { value: 'Other', label: 'Other' },
  ];

  const remoteWorkOptions = [
    { value: 'On-site', label: 'On-site' },
    { value: 'Hybrid', label: 'Hybrid' },
    { value: 'Remote', label: 'Remote' },
  ];

  const jobStatusOptions = [
    { value: 'Draft', label: 'Draft' },
    { value: 'Published', label: 'Published' },
    { value: 'Closed', label: 'Closed' },
  ];

  // Fetch company profiles and job details
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No auth token');

        // Fetch company profiles
        const companyResponse = await fetch('/api/v1/employer-dashboard/company-profile/fetch-all', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const companyData = await companyResponse.json();
        if (companyData.success) {
          setCompanyProfiles(companyData.profiles);
          if (companyData.profiles.length === 1 && isCreate) {
            setFormData(prev => ({ ...prev, companyProfile: companyData.profiles[0]._id }));
          }
        } else {
          setErrors({ general: companyData.message || 'Failed to load company profiles' });
        }

        // Fetch job details if in edit/view mode
        if (!isCreate && jobId) {
          const jobResponse = await fetch(`/api/v1/employer-dashboard/jobs/fetch/${jobId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const jobData = await jobResponse.json();
          if (jobData.success && jobData.jobPost) {
            const job = jobData.jobPost;
            setFormData({
              title: job.title || '',
              description: job.description || '',
              contactEmail: job.contactEmail || '',
              contactUsername: job.contactUsername || '',
              specialisms: job.specialisms?.map(sp => ({
                value: sp,
                label: sp,
              })) || [],
              jobType: job.jobType || '',
              offeredSalary: job.offeredSalary || '',
              careerLevel: job.careerLevel || '',
              experience: job.experience || '',
              gender: job.gender || 'No Preference',
              industry: job.industry || '',
              qualification: job.qualification || '',
              applicationDeadline: job.applicationDeadline?.split('T')[0] || '',
              location: {
                country: job.location?.country || '',
                city: job.location?.city || '',
                completeAddress: job.location?.completeAddress || '',
              },
              remoteWork: job.remoteWork || 'On-site',
              jobStatus: job.status || 'Published',
              companyProfile: job.companyProfile?._id || '',
            });
          } else {
            setErrors({ general: jobData.message || 'Failed to load job details' });
          }
        }
      } catch (err) {
        console.error(err);
        setErrors({ general: 'Failed to fetch data' });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [jobId, isCreate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (['country', 'city', 'completeAddress'].includes(name)) {
      setFormData(prev => ({
        ...prev,
        location: { ...prev.location, [name]: value },
      }));
      setErrors(prev => ({ ...prev, [name]: '' }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSelectChange = (name, selected) => {
    if (name === 'specialisms') {
      setFormData(prev => ({ ...prev, [name]: selected || [] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: selected ? selected.value : '' }));
    }
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    // Validation
    const requiredFields = [
      'title',
      'description',
      'contactEmail',
      'specialisms',
      'jobType',
      'offeredSalary',
      'careerLevel',
      'experience',
      'industry',
      'qualification',
      'applicationDeadline',
      'location.country',
      'location.city',
      'location.completeAddress',
      'companyProfile',
      'jobStatus',
    ];

    const newErrors = {};
    requiredFields.forEach(field => {
      if (field.includes('location.')) {
        const [_, subField] = field.split('.');
        if (!formData.location[subField]) {
          newErrors[subField] = `${subField.charAt(0).toUpperCase() + subField.slice(1)} is required`;
        }
      } else if (!formData[field] || (field === 'specialisms' && formData[field].length === 0)) {
        newErrors[field] = `${
          field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')
        } is required`;
      }
    });

    if (!/^\S+@\S+\.\S+$/.test(formData.contactEmail)) {
      newErrors.contactEmail = 'Please enter a valid email address';
    }

    if (formData.description && formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters long';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const formattedData = {
      companyProfile: formData.companyProfile,
      title: formData.title,
      description: formData.description,
      contactEmail: formData.contactEmail,
      contactUsername: formData.contactUsername,
      specialisms: formData.specialisms.map(s => s.value),
      jobType: formData.jobType,
      offeredSalary: formData.offeredSalary,
      careerLevel: formData.careerLevel,
      experience: formData.experience,
      gender: formData.gender,
      industry: formData.industry,
      qualification: formData.qualification,
      applicationDeadline: formData.applicationDeadline,
      location: formData.location,
      remoteWork: formData.remoteWork,
      status: formData.jobStatus, // Map jobStatus to status for backend
    };

    const dataToSend = new FormData();
    dataToSend.append('data', JSON.stringify(formattedData));

    try {
      const token = localStorage.getItem('token');
      const url = isCreate
        ? '/api/v1/employer-dashboard/jobs/create'
        : `/api/v1/employer-dashboard/jobs/update/${jobId}`;
      const method = isCreate ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: dataToSend,
      });

      const data = await response.json();
      if (response.ok) {
        alert(`Job ${isCreate ? 'created' : 'updated'} successfully!`);
        router.push('/employers-dashboard/manage-jobs/');
      } else {
        setErrors({ general: data.message || `Failed to ${isCreate ? 'create' : 'update'} job` });
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setErrors({ general: `Failed to ${isCreate ? 'create' : 'update'} job` });
    }
  };

  if (loading) return <p>Loading...</p>;
  if (errors.general && isView) return <div className="alert alert-danger">{errors.general}</div>;

  return (
    <form className="default-form" onSubmit={handleSubmit}>
      {errors.general && <div className="error-message">{errors.general}</div>}
      <div className="row">
        {/* Company Profile */}
        <div className="form-group col-lg-12 col-md-12">
          <label>Company Profile</label>
          <Select
            name="companyProfile"
            options={companyProfiles.map(profile => ({
              value: profile._id,
              label: profile.companyName,
            }))}
            value={companyProfiles
              .map(profile => ({ value: profile._id, label: profile.companyName }))
              .find(option => option.value === formData.companyProfile) || null}
            onChange={selected => handleSelectChange('companyProfile', selected)}
            className="basic-single-select"
            classNamePrefix="select"
            isDisabled={isView || (companyProfiles.length <= 1)}
          />
          {errors.companyProfile && <div className="error-text">{errors.companyProfile}</div>}
        </div>

        {/* Job Title */}
        <div className="form-group col-lg-12 col-md-12">
          <label>Job Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter Job Title"
            className="form-control"
            disabled={isView}
          />
          {errors.title && <div className="error-text">{errors.title}</div>}
        </div>

        {/* Job Description */}
        <div className="form-group col-lg-12 col-md-12">
          <label>Job Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter job description"
            className="form-control"
            disabled={isView}
            rows={6}
          />
          {errors.description && <div className="error-text">{errors.description}</div>}
        </div>

        {/* Contact Email */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Contact Email</label>
          <input
            type="email"
            name="contactEmail"
            value={formData.contactEmail}
            onChange={handleChange}
            placeholder="Enter contact email"
            className="form-control"
            disabled={isView}
          />
          {errors.contactEmail && <div className="error-text">{errors.contactEmail}</div>}
        </div>

        {/* Contact Username */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Contact Username (Optional)</label>
          <input
            type="text"
            name="contactUsername"
            value={formData.contactUsername}
            onChange={handleChange}
            placeholder="Enter contact username"
            className="form-control"
            disabled={isView}
          />
        </div>

        {/* Specialisms */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Specialisms</label>
          <Select
            isMulti
            name="specialisms"
            options={specialismOptions}
            value={formData.specialisms}
            onChange={selected => handleSelectChange('specialisms', selected)}
            className="basic-multi-select"
            classNamePrefix="select"
            isDisabled={isView}
          />
          {errors.specialisms && <div className="error-text">{errors.specialisms}</div>}
        </div>

        {/* Job Type */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Job Type</label>
          <Select
            name="jobType"
            options={jobTypeOptions}
            value={jobTypeOptions.find(option => option.value === formData.jobType) || null}
            onChange={selected => handleSelectChange('jobType', selected)}
            className="basic-single-select"
            classNamePrefix="select"
            isDisabled={isView}
          />
          {errors.jobType && <div className="error-text">{errors.jobType}</div>}
        </div>

        {/* Offered Salary */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Offered Salary</label>
          <Select
            name="offeredSalary"
            options={salaryOptions}
            value={salaryOptions.find(option => option.value === formData.offeredSalary) || null}
            onChange={selected => handleSelectChange('offeredSalary', selected)}
            className="basic-single-select"
            classNamePrefix="select"
            isDisabled={isView}
          />
          {errors.offeredSalary && <div className="error-text">{errors.offeredSalary}</div>}
        </div>

        {/* Career Level */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Career Level</label>
          <Select
            name="careerLevel"
            options={careerLevelOptions}
            value={careerLevelOptions.find(option => option.value === formData.careerLevel) || null}
            onChange={selected => handleSelectChange('careerLevel', selected)}
            className="basic-single-select"
            classNamePrefix="select"
            isDisabled={isView}
          />
          {errors.careerLevel && <div className="error-text">{errors.careerLevel}</div>}
        </div>

        {/* Experience */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Experience</label>
          <Select
            name="experience"
            options={experienceOptions}
            value={experienceOptions.find(option => option.value === formData.experience) || null}
            onChange={selected => handleSelectChange('experience', selected)}
            className="basic-single-select"
            classNamePrefix="select"
            isDisabled={isView}
          />
          {errors.experience && <div className="error-text">{errors.experience}</div>}
        </div>

        {/* Gender */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Gender</label>
          <Select
            name="gender"
            options={genderOptions}
            value={genderOptions.find(option => option.value === formData.gender) || null}
            onChange={selected => handleSelectChange('gender', selected)}
            className="basic-single-select"
            classNamePrefix="select"
            isDisabled={isView}
          />
          {errors.gender && <div className="error-text">{errors.gender}</div>}
        </div>

        {/* Industry */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Industry</label>
          <input
            type="text"
            name="industry"
            value={formData.industry}
            onChange={handleChange}
            placeholder="Enter Industry"
            className="form-control"
            disabled={isView}
          />
          {errors.industry && <div className="error-text">{errors.industry}</div>}
        </div>

        {/* Qualification */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Qualification</label>
          <Select
            name="qualification"
            options={qualificationOptions}
            value={qualificationOptions.find(option => option.value === formData.qualification) || null}
            onChange={selected => handleSelectChange('qualification', selected)}
            className="basic-single-select"
            classNamePrefix="select"
            isDisabled={isView}
          />
          {errors.qualification && <div className="error-text">{errors.qualification}</div>}
        </div>

        {/* Application Deadline */}
        <div className="form-group col-lg-12 col-md-12">
          <label>Application Deadline</label>
          <input
            type="date"
            name="applicationDeadline"
            value={formData.applicationDeadline}
            onChange={handleChange}
            className="form-control"
            disabled={isView}
          />
          {errors.applicationDeadline && <div className="error-text">{errors.applicationDeadline}</div>}
        </div>

        {/* Country */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Country</label>
          <input
            type="text"
            name="country"
            value={formData.location.country}
            onChange={handleChange}
            placeholder="Enter Country"
            className="form-control"
            disabled={isView}
          />
          {errors.country && <div className="error-text">{errors.country}</div>}
        </div>

        {/* City */}
        <div className="form-group col-lg-6 col-md-12">
          <label>City</label>
          <input
            type="text"
            name="city"
            value={formData.location.city}
            onChange={handleChange}
            placeholder="Enter City"
            className="form-control"
            disabled={isView}
          />
          {errors.city && <div className="error-text">{errors.city}</div>}
        </div>

        {/* Complete Address */}
        <div className="form-group col-lg-12 col-md-12">
          <label>Complete Address</label>
          <input
            type="text"
            name="completeAddress"
            value={formData.location.completeAddress}
            onChange={handleChange}
            placeholder="Enter Complete Address"
            className="form-control"
            disabled={isView}
          />
          {errors.completeAddress && <div className="error-text">{errors.completeAddress}</div>}
        </div>

        {/* Remote Work */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Work Arrangement</label>
          <Select
            name="remoteWork"
            options={remoteWorkOptions}
            value={remoteWorkOptions.find(option => option.value === formData.remoteWork) || null}
            onChange={selected => handleSelectChange('remoteWork', selected)}
            className="basic-single-select"
            classNamePrefix="select"
            isDisabled={isView}
          />
          {errors.remoteWork && <div className="error-text">{errors.remoteWork}</div>}
        </div>

        {/* Job Status */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Job Status</label>
          <Select
            name="jobStatus"
            options={jobStatusOptions}
            value={jobStatusOptions.find(option => option.value === formData.jobStatus) || null}
            onChange={selected => handleSelectChange('jobStatus', selected)}
            className="basic-single-select"
            classNamePrefix="select"
            isDisabled={isView}
          />
          {errors.jobStatus && <div className="error-text">{errors.jobStatus}</div>}
        </div>

        {/* Action Buttons */}
        {(isEdit || isCreate) && (
          <div className="form-group col-lg-12 col-md-12 d-flex justify-content-between">
            <button type="submit" className="theme-btn btn-style-one">
              {isCreate ? 'Create Job' : 'Update Job'}
            </button>
            <button
              type="button"
              className="theme-btn btn-style-two"
              onClick={() => router.back()}
            >
              Cancel
            </button>
          </div>
        )}

        {isView && (
          <div className="form-group col-lg-12 col-md-12 d-flex justify-content-end">
            <button
              type="button"
              className="theme-btn btn-style-two"
              onClick={() => router.back()}
            >
              Back
            </button>
          </div>
        )}
      </div>
    </form>
  );
};

export default JobPostForm;