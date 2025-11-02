// components/dashboard-pages/candidates-dashboard/my-profile/components/CandidateProfileForm.jsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Select from 'react-select';

import MobileMenu from "../../../../../header/MobileMenu";
import LoginPopup from "../../../../../common/form/login/LoginPopup";
import DashboardCandidatesSidebar from "../../../../../header/DashboardCandidatesSidebar";
import BreadCrumb from "../../../../BreadCrumb";
import DashboardCandidatesHeader from "../../../../../header/DashboardCandidatesHeader";
import CopyrightFooter from "../../../../CopyrightFooter";
import MenuToggler from "../../../../MenuToggler";

import FileUploadPreview from '../FileUploadPreview';


// import { toast } from 'react-hot-toast';   // npm i react-hot-toast

const salaryOptions = [
  { value: '< ₹5 LPA', label: '< ₹5 LPA' },
  { value: '₹5-10 LPA', label: '₹5-10 LPA' },
  { value: '₹10-15 LPA', label: '₹10-15 LPA' },
  { value: '₹15-20 LPA', label: '₹15-20 LPA' },
  { value: '₹20-30 LPA', label: '₹20-30 LPA' },
  { value: '₹30+ LPA', label: '₹30+ LPA' },
];

const experienceOptions = [
  { value: 'Fresher', label: 'Fresher' },
  { value: '1-2 years', label: '1-2 years' },
  { value: '2-5 years', label: '2-5 years' },
  { value: '5-10 years', label: '5-10 years' },
  { value: '10+ years', label: '10+ years' },
];

const educationOptions = [
  { value: '10th', label: '10th' },
  { value: '12th', label: '12th' },
  { value: 'Diploma', label: 'Diploma' },
  { value: 'Bachelor', label: 'Bachelor' },
  { value: 'Master', label: 'Master' },
  { value: 'Doctorate', label: 'Doctorate' },
  { value: 'Other', label: 'Other' },
];

const gender = [
  { value: 'Male', label: 'Male' },
  { value: 'Female', label: 'Female' },
  { value: 'Other', label: 'Other' },
];

const languageOptions = [
  'English','Hindi','Tamil','Telugu','Kannada',
  'Malayalam','Bengali','Marathi','Gujarati','Punjabi','Other',
].map(v => ({ value: v, label: v }));

const categoryOptions = [
  'Banking','Digital & Creative','Retail','Human Resources',
  'Management','Accounting & Finance','IT','Marketing','Engineering',
].map(v => ({ value: v, label: v }));

const remoteOptions = [
  { value: 'On-site', label: 'On-site' },
  { value: 'Hybrid', label: 'Hybrid' },
  { value: 'Remote', label: 'Remote' },
  { value: 'Any', label: 'Any' },
];

export default function CandidateProfileForm({ mode = 'view', profileId }) {
  const router = useRouter();
  const isCreate = mode === 'create';
  const isEdit   = mode === 'edit';
  const isView   = !isCreate && !isEdit;

  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [photoFile, setPhotoFile] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [photoUrl, setPhotoUrl] = useState('');
  const [resumeName, setResumeName] = useState('');

  const [form, setForm] = useState({
    fullName: '', jobTitle: '', phone: '', email: '', website: '',
    currentSalary: '', expectedSalary: '', experience: '', age: '', gender: '',
    educationLevels: [], languages: [], categories: [], allowInSearch: true,
    description: '',
    socialMedia: { facebook:'', twitter:'', linkedin:'', instagram:'', website:'' },
    location: { country:'India', city:'', completeAddress:'', remoteWork:'Any' },
  });

  /* ------------------------------------------------------------------ */
  /* 1. Load existing profile (edit / view)                              */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    if (isCreate) { setLoading(false); return; }

    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}api/v1/candidate-dashboard/profile/get/${profileId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        if (!data.success) throw new Error(data.message);

        const p = data.profile;
        setForm({
          fullName: p.fullName ?? '',
          jobTitle: p.jobTitle ?? '',
          phone: p.phone ?? '',
          email: p.email ?? '',
          website: p.website ?? '',
          currentSalary: p.currentSalary ?? '',
          expectedSalary: p.expectedSalary ?? '',
          experience: p.experience ?? '',
          age: p.age?.toString() ?? '',
          gender: p.gender ?? '',
          educationLevels: (p.educationLevels ?? []).map(v => ({ label: v, value: v })),
          languages: (p.languages ?? []).map(v => ({ label: v, value: v })),
          categories: (p.categories ?? []).map(v => ({ label: v, value: v })),
          allowInSearch: p.allowInSearch ?? true,
          description: p.description ?? '',
          socialMedia: { ...form.socialMedia, ...p.socialMedia },
          location: {
            country: p.location?.country ?? 'India',
            city: p.location?.city ?? '',
            completeAddress: p.location?.completeAddress ?? '',
            remoteWork: p.location?.remoteWork ?? 'Any',
          },
        });

        setPhotoUrl(p.profilePhoto ? `${process.env.NEXT_PUBLIC_API_BASE_URL}${p.profilePhoto}` : '');
        setResumeName(p.resume ? p.resume.split('/').pop() : '');
      } catch (e) {
        alert(e.message ?? 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [profileId, isCreate]);

  /* ------------------------------------------------------------------ */
  /* 2. Generic change handlers                                          */
  /* ------------------------------------------------------------------ */
  const handleText = e => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    setErrors(p => ({ ...p, [name]: '' }));
  };

  const handleSocial = e => {
    const { name, value } = e.target;
    setForm(p => ({
      ...p,
      socialMedia: { ...p.socialMedia, [name]: value },
    }));
  };

  const handleLocation = e => {
    const { name, value } = e.target;
    setForm(p => ({
      ...p,
      location: { ...p.location, [name]: value },
    }));
    setErrors(p => ({ ...p, [name]: '' }));
  };

  const handleSelect = (name, selected) => {
    setForm(p => ({ ...p, [name]: selected }));
    setErrors(p => ({ ...p, [name]: '' }));
  };

  const handleSingleSelect = (name, selected) => {
    setForm(p => ({ ...p, [name]: selected?.value ?? '' }));
    setErrors(p => ({ ...p, [name]: '' }));
  };

  /* ------------------------------------------------------------------ */
  /* 3. Client-side validation                                           */
  /* ------------------------------------------------------------------ */
 const validate = () => {
  const err = {};

  // Required top-level fields
  const required = ['fullName', 'jobTitle', 'phone', 'email', 'description', 'age', 'gender'];
  required.forEach(f => { if (!form[f]) err[f] = 'This field is required'; });

  // Location fields
  if (!form.location?.city) err['location.city'] = 'City is required';
  if (!form.location?.completeAddress) err['location.completeAddress'] = 'Complete address is required';

  // Multi-select validations
  if (!form.educationLevels?.length) err.educationLevels = 'Select at least one education level';
  if (!form.languages?.length) err.languages = 'Select at least one language';
  if (!form.categories?.length) err.categories = 'Select at least one category';

  // Phone & Email validation
  if (form.phone && !/^\+91\d{10}$/.test(form.phone)) err.phone = 'Enter +91 followed by 10 digits';
  if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) err.email = 'Invalid email';

  setErrors(err);
  return Object.keys(err).length === 0;
};


  /* ------------------------------------------------------------------ */
  /* 4. Submit (Create / Update)                                         */
  /* ------------------------------------------------------------------ */
  const handleSubmit = async e => {
    e.preventDefault();
    if (!validate()) return;

    const token = localStorage.getItem('token');
    const url = isCreate
      ? `${process.env.NEXT_PUBLIC_API_BASE_URL}api/v1/candidate-dashboard/profile/create`
      : `${process.env.NEXT_PUBLIC_API_BASE_URL}api/v1/candidate-dashboard/profile/update/${profileId}`;
    const method = isCreate ? 'POST' : 'PUT';

    const payload = new FormData();
   
    
    // simple fields
    const simple = ['fullName','jobTitle','phone','email','website','currentSalary','expectedSalary','experience','age','gender', 'description','allowInSearch'];
    simple.forEach(k => payload.append(k, form[k] ?? ''));

    // arrays → JSON string (backend parses with JSON.parse)
    payload.append('educationLevels', JSON.stringify(form.educationLevels.map(o => o.value)));
    payload.append('languages', JSON.stringify(form.languages.map(o => o.value)));
    payload.append('categories', JSON.stringify(form.categories.map(o => o.value)));

    payload.append('socialMedia', JSON.stringify(form.socialMedia));
    payload.append('location[country]', form.location.country);
    payload.append('location[city]', form.location.city);
    payload.append('location[completeAddress]', form.location.completeAddress);
    payload.append('location[remoteWork]', form.location.remoteWork);

    if (photoFile) payload.append('profilePhoto', photoFile);
    if (resumeFile) payload.append('resume', resumeFile);

    try {
      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: payload,
      });
      const data = await res.json();
      
      if (data.success) {
        alert(isCreate ? 'Profile created successfully' : 'Profile updated successfully');
        setTimeout(() => router.push('/candidates-dashboard/my-profile'), 1500);
      } else {
        alert(data.message ?? 'Something went wrong');
      }
    } catch {
      alert('Network error');
    }
  };

  /* ------------------------------------------------------------------ */
  /* 5. Delete profile                                                   */
  /* ------------------------------------------------------------------ */
  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete your profile? This action cannot be undone.')) return;

    const token = localStorage.getItem('token');
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}api/v1/candidate-dashboard/profile/delete/${profileId}`,
        { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      if (data.success) {
        alert('Profile deleted');
        router.push('/candidates-dashboard/my-profile');
      } else alert(data.message);
    } catch {
      alert('Failed to delete');
    }
  };

  if (loading) return <p className="text-center">Loading…</p>;

  /* ------------------------------------------------------------------ */
  /* 6. Render                                                           */
  /* ------------------------------------------------------------------ */
  return (
    <div className="page-wrapper dashboard">
      <span className="header-span"></span>

      <LoginPopup />
      <DashboardCandidatesHeader />
      <MobileMenu />
      <DashboardCandidatesSidebar />

      <section className="user-dashboard">
        <div className="dashboard-outer">
          <BreadCrumb
            title={isCreate ? 'Create Profile' : isEdit ? 'Edit Profile' : 'My Profile'}
          />
          <MenuToggler />

          <div className="row">
            <div className="col-lg-12">
              <div className="ls-widget">
                <div className="tabs-box">
                  <div className="widget-title">
                    <h4>{isCreate ? 'Create' : isEdit ? 'Edit' : 'View'} Candidate Profile</h4>
                  </div>

                  <div className="widget-content">
                    <form onSubmit={handleSubmit} className="default-form">

                      {/* ---------- Photo & Resume ---------- */}
                      <div className="row">
                        <FileUploadPreview
                          label="Profile Photo"
                          file={photoFile}
                          setFile={setPhotoFile}
                          previewUrl={photoUrl}
                          existingUrl={photoUrl}
                          accept="image/*"
                        />
                        <FileUploadPreview
                          label="Resume (PDF/DOC)"
                          file={resumeFile}
                          setFile={setResumeFile}
                          previewUrl={null}
                          existingUrl={resumeName ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/candidate/${resumeName}` : ''}
                          accept=".pdf,.doc,.docx"
                          maxSizeMB={5}
                        />
                      </div>

                      {/* ---------- Basic Info ---------- */}
                      <div className="row">
                        {[
                          { label:'Full Name', name:'fullName', type:'text' },
                          { label:'Job Title', name:'jobTitle', type:'text' },
                          { label:'Phone (+91…)', name:'phone', type:'text' },
                          { label:'Email', name:'email', type:'email' },
                        //   { label:'Website', name:'website', type:'text' },
                        ].map(f => (
                          <div className="form-group col-lg-6 col-md-12" key={f.name}>
                            <label>{f.label}</label>
                            <input
                              type={f.type}
                              name={f.name}
                              value={form[f.name] ?? ''}
                              onChange={handleText}
                              disabled={isView}
                              className={errors[f.name] ? 'border-red-500' : ''}
                            />
                            {errors[f.name] && <p className="text-red-600 text-xs mt-1">{errors[f.name]}</p>}
                          </div>
                        ))}

                        <div className="form-group col-lg-4 col-md-12">
                          <label>Gender</label>
                          <Select
                            options={gender}
                            value={gender.find(o => o.value === form.gender) || null}
                            onChange={opt => handleSingleSelect('gender', opt)}
                            isDisabled={isView}
                            placeholder="Select..."
                          />
                        </div>

                        <div className="form-group col-lg-4 col-md-12">
                          <label>Current Salary</label>
                          <Select
                            options={salaryOptions}
                            value={salaryOptions.find(o => o.value === form.currentSalary) || null}
                            onChange={opt => handleSingleSelect('currentSalary', opt)}
                            isDisabled={isView}
                            placeholder="Select..."
                          />
                        </div>

                        <div className="form-group col-lg-4 col-md-12">
                          <label>Expected Salary</label>
                          <Select
                            options={salaryOptions}
                            value={salaryOptions.find(o => o.value === form.expectedSalary) || null}
                            onChange={opt => handleSingleSelect('expectedSalary', opt)}
                            isDisabled={isView}
                            placeholder="Select..."
                          />
                        </div>

                        <div className="form-group col-lg-4 col-md-12">
                          <label>Experience</label>
                          <Select
                            options={experienceOptions}
                            value={experienceOptions.find(o => o.value === form.experience) || null}
                            onChange={opt => handleSingleSelect('experience', opt)}
                            isDisabled={isView}
                            placeholder="Select..."
                          />
                        </div>

                        <div className="form-group col-lg-4 col-md-12">
                          <label>Age</label>
                          <input
                            type="number"
                            name="age"
                            value={form.age}
                            onChange={handleText}
                            disabled={isView}
                            min="18"
                            max="65"
                            className={errors.age ? 'border-red-500' : ''}
                          />
                          {errors.age && <p className="text-red-600 text-xs mt-1">{errors.age}</p>}
                        </div>
                      </div>

                      {/* ---------- Multi-selects ---------- */}
                      <div className="row">
                        <div className="form-group col-lg-6 col-md-12">
                          <label>Education Level(s)</label>
                          <Select
                            isMulti
                            options={educationOptions}
                            value={form.educationLevels}
                            onChange={sel => handleSelect('educationLevels', sel)}
                            isDisabled={isView}
                          />
                        </div>

                        <div className="form-group col-lg-6 col-md-12">
                          <label>Known Languages</label>
                          <Select
                            isMulti
                            options={languageOptions}
                            value={form.languages}
                            onChange={sel => handleSelect('languages', sel)}
                            isDisabled={isView}
                          />
                        </div>

                        <div className="form-group col-lg-6 col-md-12">
                          <label>Job Categories</label>
                          <Select
                            isMulti
                            options={categoryOptions}
                            value={form.categories}
                            onChange={sel => handleSelect('categories', sel)}
                            isDisabled={isView}
                          />
                        </div>

                        <div className="form-group col-lg-6 col-md-12">
                          <label>Remote Work Preference</label>
                          <Select
                            options={remoteOptions}
                            value={remoteOptions.find(o => o.value === form.location.remoteWork) || null}
                            onChange={opt => setForm(p => ({
                              ...p,
                              location: { ...p.location, remoteWork: opt?.value ?? 'Any' },
                            }))}
                            isDisabled={isView}
                          />
                        </div>
                      </div>

                      {/* ---------- Description ---------- */}
                      <div className="row">
                        <div className="form-group col-lg-12">
                          <label>Description / Bio</label>
                          <textarea
                            name="description"
                            rows={5}
                            value={form.description}
                            onChange={handleText}
                            disabled={isView}
                            className={errors.description ? 'border-red-500' : ''}
                          />
                          {errors.description && <p className="text-red-600 text-xs mt-1">{errors.description}</p>}
                        </div>
                      </div>

                      {/* ---------- Social Links ---------- */}
                      <div className="row">
                        {['facebook','twitter','linkedin','instagram','website'].map(s => (
                          <div className="form-group col-lg-6 col-md-12" key={s}>
                            <label>{s.charAt(0).toUpperCase() + s.slice(1)}</label>
                            <input
                              type="text"
                              name={s}
                              value={form.socialMedia[s] ?? ''}
                              onChange={handleSocial}
                              disabled={isView}
                            />
                          </div>
                        ))}
                      </div>

                      {/* ---------- Location ---------- */}
                      <div className="row">
                        <div className="form-group col-lg-4 col-md-12">
                          <label>Country</label>
                          <input
                            type="text"
                            value={form.location.country}
                            disabled
                          />
                        </div>
                        <div className="form-group col-lg-4 col-md-12">
                          <label>City</label>
                          <input
                            type="text"
                            name="city"
                            value={form.location.city}
                            onChange={handleLocation}
                            disabled={isView}
                            className={errors['location.city'] ? 'border-red-500' : ''}
                          />
                          {errors['location.city'] && <p className="text-red-600 text-xs mt-1">{errors['location.city']}</p>}
                        </div>
                        <div className="form-group col-lg-4 col-md-12">
                          <label>Complete Address</label>
                          <input
                            type="text"
                            name="completeAddress"
                            value={form.location.completeAddress}
                            onChange={handleLocation}
                            disabled={isView}
                            className={errors['location.completeAddress'] ? 'border-red-500' : ''}
                          />
                          {errors['location.completeAddress'] && <p className="text-red-600 text-xs mt-1">{errors['location.completeAddress']}</p>}
                        </div>
                      </div>

                      {/* ---------- Allow In Search ---------- */}
                      <div className="row">
                        <div className="form-group col-lg-6 col-md-12">
                          <label>Allow In Search & Listing</label>
                          <select
                            name="allowInSearch"
                            value={form.allowInSearch ? 'true' : 'false'}
                            onChange={e => setForm(p => ({ ...p, allowInSearch: e.target.value === 'true' }))}
                            disabled={isView}
                          >
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                          </select>
                        </div>
                      </div>

                      {/* ---------- Action Buttons ---------- */}
                        <div className="row mt-4">
                        {(isEdit || isCreate) && (
                            <div className="form-group col-lg-3">
                            <button type="submit" className="theme-btn btn-style-one w-full">
                                {isCreate ? 'Create Profile' : 'Update Profile'}
                            </button>
                            </div>
                        )}

                        {isEdit && (
                            <div className="form-group col-lg-3">
                            <button
                                type="button"
                                onClick={handleDelete}
                                className="theme-btn btn-style-three w-full"
                            >
                                Delete Profile
                            </button>
                            </div>
                        )}

                        {isView && (
                            <div className="form-group col-lg-3">
                            <button
                                type="button"
                                className="theme-btn btn-style-two w-full"
                                onClick={() => router.back()}
                            >
                                Back
                            </button>
                            </div>
                        )}
                        </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CopyrightFooter />
    </div>
  );
}