import Layout from '@/components/layout/Layout';
import { getLoggedInUser } from '@/lib/appwrite';

export default async function DashboardLayout({
  children,
  student,
  authority,
  employer
}: {
  children: React.ReactNode;
  student: React.ReactNode;
  authority: React.ReactNode;
  employer: React.ReactNode;
}) {
  const user = await getLoggedInUser();

  if (!user) {
    return <div>Access Denied. Contact Support</div>;
  }

  let dashboardContent;
  switch (user?.labels?.[0]) {
    case 'student':
      dashboardContent = student;
      break;
    case 'authority':
      dashboardContent = authority;
      break;
    case 'employer':
      dashboardContent = employer;
      break;
    default:
      dashboardContent = <div>Access Denied. Contact Support</div>;
  }

  return (
    <Layout>
      {children}
      {dashboardContent}
    </Layout>
  );
}