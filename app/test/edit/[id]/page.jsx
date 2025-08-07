'use client';

import CompanyProfile from '@/components/dashboard-pages/employers-dashboard/company-profile/index';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function EditCompanyProfilePage() {
  const params = useParams();
  const [profileId, setProfileId] = useState(null);

  useEffect(() => {
    if (params?.id && params.id !== 'favicon.ico') {
      setProfileId(params.id);
    }
  }, [params]);

  if (!profileId) return <p>Loading...</p>;
  console.log('Server params.id-1 =', profileId);
  return <CompanyProfile mode="edit" profileId={profileId} />;
}