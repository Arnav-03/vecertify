"use server";

import { Client, Account, ID, Users, Databases, Query } from 'node-appwrite';
import { cookies } from 'next/headers';

export async function createSessionClient() {
    const client = new Client()
        .setEndpoint(process.env.APPWRITE_ENDPOINT!)
        .setProject(process.env.APPWRITE_PROJECT_ID!);

    const session = cookies().get("blockchain");

    if (!session || !session.value) {
        throw new Error("No session");
    }
    client.setSession(session.value);
    return {
        get account() {
            return new Account(client);
        },
    };
}
export async function createAdminClient() {
    const client = new Client()
        .setEndpoint(process.env.APPWRITE_ENDPOINT!)
        .setProject(process.env.APPWRITE_PROJECT_ID!)
        .setKey(process.env.APPWRITE_KEY!);

    return {
        get account() {
            return new Account(client);
        },
        get users() {
            return new Users(client);
        },
    };
}

export async function getLoggedInUser() {
    try {
        const { account } = await createSessionClient();
        return await account.get();
    } catch {
        return null;
    }
}

export async function signUpWithEmail(values: { name: string; email: string; password: string; role: string }) {
    const { name, email, password, role } = values;

    const { account } = await createAdminClient();
    try {
        // Create a user and send OTP for email verification
        await account.create(ID.unique(), email, password, name);
        const otpResponse = await account.createEmailToken(ID.unique(), email);

        return { success: true, otpSent: true, userId: otpResponse.userId, role, redirect: false };
    } catch (error) {
        console.error("Sign up failed:", error);
        return { success: false, error: "Sign up failed. Please try again.", redirect: false };
    }
}

export async function verifyEmailOTP(userId: string, secret: string, role: string) {
    const { account, users } = await createAdminClient();

    try {
        // Verify the OTP using the userId and secret
        const session = await account.createSession(userId, secret);

        // Assign the role-based label to the user after successful OTP verification
        await users.updateLabels(userId, [role]);

        // Set the session cookie for the user
        cookies().set("blockchain", session.secret, {
            path: "/",
            httpOnly: true,
            sameSite: "strict",
            secure: true,
        });

        return { success: true, redirect: true };
    } catch (error) {
        console.error("OTP verification failed:", error);
        return { success: false, error: "Invalid OTP. Please try again.", redirect: false };
    }
}

export async function loginWithEmail(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const role = formData.get("role") as string;

    if (!email || !password || !role) {
        return { success: false, error: "Missing required fields" };
    }

    const { account } = await createAdminClient();

    try {
        const session = await account.createEmailPasswordSession(email, password);
        cookies().set("blockchain", session.secret, {
            path: "/",
            httpOnly: true,
            sameSite: "strict",
            secure: true,
        });
        return { success: true };
    } catch (error) {
        console.error("Login failed:", error);
        return { success: false, error: "Invalid email or password" };
    }
}
export async function logout() {
    try {
        const { account } = await createSessionClient();
        await account.deleteSession('current');
        cookies().delete('blockchain');
        return { success: true, message: 'Logged out successfully' };
    } catch (error) {
        console.error('Error during logout:', error);
        return { success: false, error: 'Error during logout' };
    }
}


export async function createStudentProfile(data: {
    collegeName: string;
    rollno: string;
    degreeName: string;
    branchName: string;
    gradYear: string;
}) {
    try {
        // Fetch logged-in user's details
        const loggedInUser = await getLoggedInUser();
        if (!loggedInUser) {
            return { success: false, error: "User not logged in" };
        }

        const { name, email } = loggedInUser;
        // Initialize Appwrite client
        const client = new Client()
            .setEndpoint(process.env.APPWRITE_ENDPOINT!)
            .setProject(process.env.APPWRITE_PROJECT_ID!);

        const databases = new Databases(client);

        // Check if a profile with the same studentId already exists
        const existingProfile = await databases.listDocuments(
            process.env.APPWRITE_DATABASE_ID!,
            process.env.STUDENT_COLLECTION_ID!,
            [Query.equal('studentId', loggedInUser.$id)]
        );

        if (existingProfile.documents.length > 0) {
            return { success: false, error: "Profile already exists for this user" };
        }

        // Create the student profile document
        const response = await databases.createDocument(
            process.env.APPWRITE_DATABASE_ID!,
            process.env.STUDENT_COLLECTION_ID!,
            ID.unique(),
            {
                studentId: loggedInUser.$id,
                college: data.collegeName,
                rollno: data.rollno,
                degree: data.degreeName,
                major: data.branchName,
                gradYear: data.gradYear,
                name: name,
                email: email,
            }
        );

        return { success: true, response };
    } catch (error) {
        console.error("Error creating student profile:", error);
        return { success: false, error: "Error creating student profile" };
    }
}

export async function createAuthorityProfile(data: {
    organizationName: string;
    organizationType: string;
    designation: string;
    websiteUrl: string;
    officialIdNumber: string;
    organizationEmail: string;
    organizationPhone: string;
}) {
    try {
        // Fetch logged-in user's details
        const loggedInUser = await getLoggedInUser();
        if (!loggedInUser) {
            return { success: false, error: "User not logged in" };
        }

        const { name, email } = loggedInUser;

        // Initialize Appwrite client
        const client = new Client()
            .setEndpoint(process.env.APPWRITE_ENDPOINT!)
            .setProject(process.env.APPWRITE_PROJECT_ID!);

        const databases = new Databases(client);

        // Check if a profile with the same authorityId already exists
        const existingProfile = await databases.listDocuments(
            process.env.APPWRITE_DATABASE_ID!,
            process.env.AUTHORITY_COLLECTION_ID!,
            [Query.equal('officialId', data.officialIdNumber)]
        );

        if (existingProfile.documents.length > 0) {
            return { success: false, error: "Profile already exists for this authority" };
        }

        // Create the authority profile document
        const response = await databases.createDocument(
            process.env.APPWRITE_DATABASE_ID!,
            process.env.AUTHORITY_COLLECTION_ID!,
            ID.unique(),
            {
                organizationName: data.organizationName,
                organizationType: data.organizationType,
                websiteUrl: data.websiteUrl,
                officialId: data.officialIdNumber,
                organizationEmail: data.organizationEmail,
                organizationPhone: data.organizationPhone,
                orgIssuerName: name,
                orgIssuerEmail: email,
            }
        );

        return { success: true, response };
    } catch (error) {
        console.error("Error creating authority profile:", error);
        return { success: false, error: "Error creating authority profile" };
    }
}

 export async function createIssuedCertificate(data: {
    courseName: string;
    issueDate: string;
    studentRollNo:string;
    issuedBy: string;
    certificateId: string;
}, fileUrl: string) {
    try {
        // Fetch logged-in user's details
        const loggedInUser = await getLoggedInUser();
        if (!loggedInUser) {
            return { success: false, error: "User not logged in" };
        }

        const { name } = loggedInUser;

        // Initialize Appwrite client
        const client = new Client()
            .setEndpoint(process.env.APPWRITE_ENDPOINT!)
            .setProject(process.env.APPWRITE_PROJECT_ID!);

        const databases = new Databases(client);

        // Check if a certificate with the same certificateIdNumber and studentRollNo already exists
        const existingCertificate = await databases.listDocuments(
            process.env.APPWRITE_DATABASE_ID!,
            process.env.ISSUED_CERTIFICATE_COLLECTION_ID!,
            [
                Query.equal('certificateId', data.certificateId),
                Query.equal('studentRollNo', data.studentRollNo)
            ]
        );

        // If a matching certificate exists, return an error
        if (existingCertificate.documents.length > 0) {
            return { success: false, error: "A certificate with this ID for the same student already exists" };
        }

        // Create the issued certificate document
        const response = await databases.createDocument(
            process.env.APPWRITE_DATABASE_ID!,
            process.env.ISSUED_CERTIFICATE_COLLECTION_ID!,
            ID.unique(),
            {
                studentRollNo: data.studentRollNo,
                certificateId: data.certificateId,
                certificateName: data.courseName,
                issueDate: data.issueDate,
                issuerName: data.issuedBy,
                certificateUrl: fileUrl,
                issuerOrg: name,
            }
        );

        return { success: true, response };
    } catch (error) {
        console.error("Error issuing certificate:", error);
        return { success: false, error: "Error issuing certificate" };
    }
} 
