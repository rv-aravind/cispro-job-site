// import CompanyProfile from "@/components/dashboard-pages/employers-dashboard/company-profile";
import ManageCompanyProfile from "@/components/dashboard-pages/employers-dashboard/company-profile/manage-company-profile";


export const metadata = {
  title: "Company Profile || Superio - Job Borad React NextJS Template",
  description: "Superio - Job Borad React NextJS Template",
};

const index = () => {
  return (
    <>

      <ManageCompanyProfile />

      {/* <CompanyProfile /> */}
    </>
  );
};

export default index;
