// 'use client';

import PostJobs from '@/components/dashboard-pages/employers-dashboard/post-jobs';

export const metadata = {
  title: 'Post Jobs || Superio - Job Board React NextJS Template',
  description: 'Superio - Job Board React NextJS Template',
};

export default function PostJobsPage() {
  return <PostJobs mode="create" />;
}

// import PostJob from "@/components/dashboard-pages/employers-dashboard/post-jobs";

// export const metadata = {
//   title: "Post Jobs || Superio - Job Borad React NextJS Template",
//   description: "Superio - Job Borad React NextJS Template",
// };

// const index = () => {
//   return (
//     <>
//       <PostJob />
//     </>
//   );
// };

// export default index;

