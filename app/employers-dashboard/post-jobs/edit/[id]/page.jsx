// app/employers-dashboard/post-jobs/edit/[id]/page.jsx
'use client';

import PostJobs from '@/components/dashboard-pages/employers-dashboard/post-jobs';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function EditJobPostPage() {
  const params = useParams();
  const [jobId, setJobId] = useState(null);

  useEffect(() => {
    if (params?.id && params.id !== 'favicon.ico') {
      setJobId(params.id);
    }
  }, [params]);

  if (!jobId) return <p>Loading...</p>;
  console.log('Server params.id (Edit Job):', jobId);
  return <PostJobs mode="edit" jobId={jobId} />;
}