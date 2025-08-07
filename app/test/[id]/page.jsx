'use client';

import CompanyProfile from '@/components/dashboard-pages/employers-dashboard/company-profile/index';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function CompanyProfilePage() {
  const params = useParams();
  const [profileId, setProfileId] = useState(null);

  useEffect(() => {
    if (params?.id && params.id !== 'favicon.ico') {
      setProfileId(params.id);
    }
  }, [params]);

  if (!profileId) return <p>Loading...</p>;
  console.log('Server params.id-2 =', profileId);
  return <CompanyProfile mode="view" profileId={profileId} />;
}