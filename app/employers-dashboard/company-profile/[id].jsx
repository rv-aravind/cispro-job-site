import CompanyProfile from "@/components/dashboard-pages/employers-dashboard/company-profile/index";

export const metadata = {
  title: "View Company Profile || Superio - Job Board React NextJS Template",
  description: "Superio - Job Board React NextJS Template",
};

const CompanyProfilePage = ({ params }) => {
  console.log("Params received in [id].jsx:", params);
  return <CompanyProfile mode="view" profileId={params.id} />;
};

export default CompanyProfilePage;