// components/dashboard-pages/candidates-dashboard/my-profile/components/FileUploadPreview.jsx
'use client';

import Image from 'next/image';
import { useState } from 'react';

export default function FileUploadPreview({
  label,
  file,
  setFile,
  previewUrl,
  existingUrl,
  accept = 'image/*',
  maxSizeMB = 2,
}) {
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;

    if (f.size > maxSizeMB * 1024 * 1024) {
      setError(`File too large (max ${maxSizeMB} MB)`);
      return;
    }
    setError('');
    setFile(f);
  };

//   const displayUrl = file ? URL.createObjectURL(file) : existingUrl;

// Generate display URL
  let displayUrl = '';
  let useUnoptimized = false;

  if (file) {
    displayUrl = URL.createObjectURL(file);
    useUnoptimized = true; // blob URLs must be unoptimized
  } else if (existingUrl) {
    // Remove double slashes after domain
    displayUrl = existingUrl.replace(/([^:]\/)\/+/g, '$1');
    useUnoptimized = true; // external URL, allow unoptimized
  }

  return (
    <div className="form-group col-lg-6 col-md-12">
      <label>{label}</label>

      {/* Existing preview (photo) */}
      {displayUrl && accept.includes('image') && (
        <div className="mb-2">
          <Image
            src={displayUrl}
            alt="preview"
            width={120}
            height={120}
            className="object-cover rounded"
            unoptimized={useUnoptimized}
          />
        </div>
      )}

      {/* Existing file name (resume) */}
      {displayUrl && !accept.includes('image') && (
        <p className="text-sm text-gray-600 mb-1">
          {file?.name || (existingUrl ? existingUrl.split('/').pop() : '')}
        </p>
      )}

      {/* Upload button */}
      <label className="block">
        <input
          type="file"
          accept={accept}
          className="hidden"
          onChange={handleChange}
        />
        <span className="inline-block px-4 py-2 bg-gray-100 border rounded cursor-pointer hover:bg-gray-200">
          {file ? 'Change File' : 'Choose File'}
        </span>
      </label>

      {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
    </div>
  );
}