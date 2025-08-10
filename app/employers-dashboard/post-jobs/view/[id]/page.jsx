// app/employers-dashboard/post-jobs/view/[id]/page.jsx
'use client';

import PostJobs from '@/components/dashboard-pages/employers-dashboard/post-jobs';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function ViewJobPostPage() {
  const params = useParams();
  const [jobId, setJobId] = useState(null);

  useEffect(() => {
    if (params?.id && params.id !== 'favicon.ico') {
      setJobId(params.id);
    }
  }, [params]);

  if (!jobId) return <p>Loading...</p>;
  console.log('Server params.id (View Job):', jobId);
  return <PostJobs mode="view" jobId={jobId} />;
}