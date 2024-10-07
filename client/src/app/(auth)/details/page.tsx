"use client"
import Loading from '@/app/loading';
import StudentProfileForm from '@/components/forms/StudentProfileForm';
import Layout from '@/components/layout/Layout';
import { useSearchParams } from 'next/navigation';
import EmployerProfileForm from '@/components/forms/EmployerProfileForm';

const ProfilePage = () => {
    const searchParams = useSearchParams();
    const role = searchParams.get('role') || '';
    console.log(role);
    if (!role) {
        return <Loading />
    }

    return (
        <Layout>
            <div className='mt-[75px]'>
                {role === 'student' ? (
                    <StudentProfileForm />
                ) : role === 'employer' ? (
                    <EmployerProfileForm />
                ) : (
                    <div>Invalid role</div>
                )}
            </div>
        </Layout>

    );
};

export default ProfilePage;
