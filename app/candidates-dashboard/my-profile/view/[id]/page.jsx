import CandidateProfileForm from "@/components/dashboard-pages/candidates-dashboard/my-profile/components/my-profile/CandidateProfileForm";

export const metadata = {
  title: "View Candidate Profile",
  description: "View your candidate profile details",
};

export default function ViewCandidateProfilePage({ params }) {
  return <CandidateProfileForm mode="view" profileId={params.id} />;
}
