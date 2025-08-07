// C:\aravind\Free-Lance\hr-portal\cispro-job-site\components\dashboard-pages\employers-dashboard\company-profile\components\CompanyProfileForm.jsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Select from 'react-select';

const CompanyProfile = ({ mode = 'view', profileId }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [logoImg, setLogoImg] = useState(null);
  const [logoUrl, setLogoUrl] = useState('');
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    phone: '',
    website: '',
    establishedSince: '',
    teamSize: '',
    categories: [],
    allowInSearch: 'No',
    description: '',
    facebook: '',
    twitter: '',
    linkedin: '',
    googlePlus: '',
    country: '',
    city: '',
    address: '',
  });
  const [error, setError] = useState(null);
  const isEdit = mode === 'edit';
  const isCreate = mode === 'create';

  const catOptions = [
    { value: 'Banking', label: 'Banking' },
    { value: 'Digital & Creative', label: 'Digital & Creative' },
    { value: 'Retail', label: 'Retail' },
    { value: 'Human Resources', label: 'Human Resources' },
    { value: 'Management', label: 'Management' },
    { value: 'Accounting & Finance', label: 'Accounting & Finance' },
    { value: 'Digital', label: 'Digital' },
    { value: 'Creative Art', label: 'Creative Art' },
  ];

  const companyTypeOptions = [
    { value: 'Private', label: 'Private' },
    { value: 'Public', label: 'Public' },
    { value: 'Government', label: 'Government' },
    { value: 'Non-profit', label: 'Non-profit' },
    { value: 'Startup', label: 'Startup' },
    { value: 'Other', label: 'Other' },
  ];

  useEffect(() => {
    console.log('Profile ID:', profileId);
    if (isCreate) {
      setLoading(false); // No data to fetch in create mode
      return;
    }

    const fetchProfile = async () => {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (!token) throw new Error('No auth token');

        const response = await fetch(`/api/v1/employer-dashboard/company-profile/get/${profileId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (data.success) {
          const profile = data.profile;
          setFormData({
            companyName: profile.companyName || '',
            email: profile.email || '',
            phone: profile.phone || '',
            website: profile.website || '',
            establishedSince: profile.establishedSince?.slice(0, 10) || '',
            teamSize: profile.teamSize || '',
            categories: profile.categories?.map((cat) => ({ label: cat, value: cat })) || [],
            allowInSearch: profile.allowInSearch ? 'Yes' : 'No',
            description: profile.description || '',
            facebook: profile.socialMedia?.facebook || '',
            twitter: profile.socialMedia?.twitter || '',
            linkedin: profile.socialMedia?.linkedin || '',
            googlePlus: profile.socialMedia?.googlePlus || '',
            country: profile.location?.country || '',
            city: profile.location?.city || '',
            address: profile.location?.address || '',
            industry: profile.industry || '',
            companyType: profile.companyType || '',
          });
          setLogoUrl(profile.logo || '');
        } else {
          setError(data.message || 'Failed to load profile');
        }
      } catch (err) {
        console.error(err);
        setError('Failed to fetch profile data');
      } finally {
        setLoading(false);
      }
    };

    if (profileId && !isCreate) {
      fetchProfile();
    }
  }, [profileId, isCreate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCategoryChange = (selected) => {
    setFormData({ ...formData, categories: selected });
  };

  const handleCompanyTypeChange = (selected) => {
    setFormData({ ...formData, companyType: selected ? selected.value : '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedData = {
      companyName: formData.companyName,
      email: formData.email,
      phone: formData.phone,
      website: formData.website,
      establishedSince: formData.establishedSince,
      teamSize: formData.teamSize,
      categories: formData.categories.map((cat) => cat.value),
      allowInSearch: formData.allowInSearch === 'Yes',
      description: formData.description,
      socialMedia: {
        facebook: formData.facebook,
        twitter: formData.twitter,
        linkedin: formData.linkedin,
        googlePlus: formData.googlePlus,
      },
      location: {
        country: formData.country,
        city: formData.city,
        address: formData.address,
      },
      industry: formData.industry, 
      companyType: formData.companyType, 
    };

    const dataToSend = new FormData();
    dataToSend.append('data', JSON.stringify(formattedData));
    if (logoImg) {
      dataToSend.append('logo', logoImg);
    }

    try {
      const token = localStorage.getItem('token');
      const url = isCreate
        ? '/api/v1/employer-dashboard/company-profile/create'
        : `/api/v1/employer-dashboard/company-profile/update/${profileId}`;
      const method = isCreate ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: dataToSend,
      });

      if (response.ok) {
        alert(isCreate ? 'Profile created successfully!' : 'Profile updated successfully!');
        router.push('/employers-dashboard/company-profile/');
      } else {
        const data = await response.json();
        setError(data.message || `Failed to ${isCreate ? 'create' : 'update'} profile`);
      }
    } catch (err) {
      console.error(err);
      setError(`Failed to ${isCreate ? 'create' : 'update'} profile`);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <form className="default-form" onSubmit={handleSubmit}>
      <div className="widget-content">
        <div
          className="uploading-outer"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
          }}
        >
          {logoUrl && (
            <img
              src={`http://localhost:5000${logoUrl}`}
              alt="Company Logo"
              style={{
                maxWidth: '150px',
                maxHeight: '150px',
                objectFit: 'contain',
                marginBottom: '10px',
              }}
            />
          )}

          {(isEdit || isCreate) && (
            <label
              htmlFor="upload"
              style={{
                display: 'inline-block',
                cursor: 'pointer',
                border: '1px dashed #ccc',
                padding: '10px',
                textAlign: 'center',
                width: '160px',
              }}
            >
              {logoImg ? (
                <img
                  src={URL.createObjectURL(logoImg)}
                  alt="Selected Logo"
                  style={{
                    maxWidth: '150px',
                    maxHeight: '150px',
                    objectFit: 'contain',
                  }}
                />
              ) : (
                <>
                  <div style={{ marginBottom: '5px' }}>Browse Logo</div>
                  <div style={{ fontSize: '12px', color: '#888' }}>
                    (click to upload)
                  </div>
                </>
              )}
              <input
                id="upload"
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => setLogoImg(e.target.files[0])}
              />
            </label>
          )}

          <div className="text" style={{ marginTop: '8px' }}>
            Max file size is 1MB, Minimum dimension: 330×300.<br />
            Supported: .jpg & .png
          </div>
        </div>

        <div className="row">
          {[
            { label: 'Company name', name: 'companyName' },
            { label: 'Email address', name: 'email', type: 'email' },
            { label: 'Phone', name: 'phone' },
            { label: 'Website', name: 'website' },
          ].map(({ label, name, type = 'text' }) => (
            <div className="form-group col-lg-6 col-md-12" key={name}>
              <label>{label}</label>
              <input
                name={name}
                type={type}
                value={formData[name] || ''}
                onChange={handleChange}
                disabled={!(isEdit || isCreate)}
                placeholder={label}
                className="form-control"
              />
            </div>
          ))}

          <div className="form-group col-lg-6 col-md-12">
            <label>Est. Since</label>
            <input
              name="establishedSince"
              type="date"
              value={formData.establishedSince || ''}
              onChange={handleChange}
              disabled={!(isEdit || isCreate)}
              className="form-control"
            />
          </div>

          <div className="form-group col-lg-6 col-md-12">
            <label>Team Size</label>
            <select
              name="teamSize"
              value={formData.teamSize}
              onChange={handleChange}
              disabled={!(isEdit || isCreate)}
              className="chosen-single form-select"
            >
              <option value="">Select</option>
              <option>50 - 100</option>
              <option>100 - 150</option>
              <option>200 - 250</option>
              <option>300 - 350</option>
              <option>500 - 1000</option>
            </select>
          </div>

          <div className="form-group col-lg-6 col-md-12">
            <label>Categories</label>
            <Select
              isMulti
              isDisabled={!(isEdit || isCreate)}
              options={catOptions}
              value={formData.categories}
              onChange={handleCategoryChange}
              className="basic-multi-select"
              classNamePrefix="select"
            />
          </div>

          <div className="form-group col-lg-6 col-md-12">
            <label>Allow In Search</label>
            <select
              name="allowInSearch"
              value={formData.allowInSearch}
              onChange={handleChange}
              disabled={!(isEdit || isCreate)}
              className="chosen-single form-select"
            >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>

          <div className="form-group col-lg-12 col-md-12">
            <label>About Company</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              disabled={!(isEdit || isCreate)}
            />
          </div>

          {/* New Fields */}
          <div className="form-group col-lg-6 col-md-12">
            <label>Industry</label>
            <input
              name="industry"
              type="text"
              value={formData.industry || ''}
              onChange={handleChange}
              disabled={!(isEdit || isCreate)}
              placeholder="Enter Industry"
              className="form-control"
            />
          </div>

          <div className="form-group col-lg-6 col-md-12">
            <label>Company Type</label>
            <Select
              isDisabled={!(isEdit || isCreate)}
              options={companyTypeOptions}
              value={companyTypeOptions.find((option) => option.value === formData.companyType) || null}
              onChange={handleCompanyTypeChange}
              className="basic-single-select"
              classNamePrefix="select"
            />
          </div>

          {['facebook', 'twitter', 'linkedin', 'googlePlus'].map((platform) => (
            <div className="form-group col-lg-6 col-md-12" key={platform}>
              <label>{platform.charAt(0).toUpperCase() + platform.slice(1)}</label>
              <input
                name={platform}
                type="text"
                placeholder={`Enter ${platform}`}
                value={formData[platform] || ''}
                onChange={handleChange}
                disabled={!(isEdit || isCreate)}
                className="form-control"
              />
            </div>
          ))}

          <div className="form-group col-lg-6 col-md-12">
            <label>Country</label>
            <input
              name="country"
              value={formData.country || ''}
              onChange={handleChange}
              disabled={!(isEdit || isCreate)}
              placeholder="Enter Country"
              className="form-control"
            />
          </div>

          <div className="form-group col-lg-6 col-md-12">
            <label>City</label>
            <input
              name="city"
              value={formData.city || ''}
              onChange={handleChange}
              disabled={!(isEdit || isCreate)}
              placeholder="Enter City"
              className="form-control"
            />
          </div>

          <div className="form-group col-lg-12 col-md-12">
            <label>Address</label>
            <input
              name="address"
              value={formData.address || ''}
              onChange={handleChange}
              disabled={!(isEdit || isCreate)}
              placeholder="Enter Full Address"
              className="form-control"
            />
          </div>

          {(isEdit || isCreate) && (
            <div className="form-group col-lg-12 col-md-12 d-flex justify-content-between">
              <button type="submit" className="theme-btn btn-style-one">
                {isCreate ? 'Create' : 'Update'}
              </button>
              <button type="button" className="theme-btn btn-style-two" onClick={() => router.back()}>
                Cancel
              </button>
            </div>
          )}

          {mode === 'view' && (
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
      </div>
    </form>
  );
};

export default CompanyProfile;