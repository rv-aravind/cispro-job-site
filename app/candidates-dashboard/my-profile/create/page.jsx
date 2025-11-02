import CandidateProfileForm from "@/components/dashboard-pages/candidates-dashboard/my-profile/components/my-profile/CandidateProfileForm";

export const metadata = {
  title: "Create Candidate Profile",
  description: "Create your candidate profile",
};

export default function CreateProfilePage() {
  return <CandidateProfileForm mode="create" />;
}
