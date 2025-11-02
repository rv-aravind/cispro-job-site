import CandidateProfileForm from "@/components/dashboard-pages/candidates-dashboard/my-profile/components/my-profile/CandidateProfileForm";

export const metadata = {
  title: "Edit Candidate Profile",
  description: "Edit your candidate profile",
};

export default function EditProfilePage({ params }) {
  return <CandidateProfileForm mode="edit" profileId={params.id} />;
}
