"use server";

import { Client, Account, ID, Users, Databases, Query } from "node-appwrite";
import { cookies } from "next/headers";

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
    get databases() {
      return new Databases(client);
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

/* export async function signUpWithEmail(values: { name: string; email: string; password: string; role: string,metamaskAddress:string }) {
    const { name, email, password, role,metamaskAddress } = values;
    console.log("metamask iss=>>>>> ",metamaskAddress)
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
 */
export async function signUpWithEmail(values: {
  name: string;
  email: string;
  password: string;
  role: string;
  metamaskAddress: string;
}) {
  const { name, email, password, role, metamaskAddress } = values;
  console.log("metamask address =>", metamaskAddress);

  try {
    const { account, databases } = await createAdminClient();

    // Check if Metamask address is already associated with another user
    const existingMetamaskUser = await databases.listDocuments(
      process.env.APPWRITE_DATABASE_ID!,
      process.env.METAMASK_COLLECTION_ID!,
      [Query.equal("metamaskId", metamaskAddress)]
    );

    if (existingMetamaskUser.documents.length > 0) {
      return {
        success: false,
        error: "Metamask address is already associated with another account",
        redirect: false,
      };
    }

    // Create a user and send OTP for email verification
    const userCreationResponse = await account.create(
      ID.unique(),
      email,
      password,
      name
    );
    const otpResponse = await account.createEmailToken(ID.unique(), email);

    // Store Metamask address in the Metamask collection
    await databases.createDocument(
      process.env.APPWRITE_DATABASE_ID!,
      process.env.METAMASK_COLLECTION_ID!,
      userCreationResponse.$id,
      {
        userID: userCreationResponse.$id,
        metamaskId: metamaskAddress,
      }
    );

    return {
      success: true,
      otpSent: true,
      userId: otpResponse.userId,
      role,
      redirect: false,
    };
  } catch (error) {
    console.error("Sign up failed:", error);
    return {
      success: false,
      error: "Sign up failed. Please try again.",
      redirect: false,
    };
  }
}

export async function verifyEmailOTP(
  userId: string,
  secret: string,
  role: string
) {
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
    return {
      success: false,
      error: "Invalid OTP. Please try again.",
      redirect: false,
    };
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
    await account.deleteSession("current");
    cookies().delete("blockchain");
    return { success: true, message: "Logged out successfully" };
  } catch (error) {
    console.error("Error during logout:", error);
    return { success: false, error: "Error during logout" };
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
      [Query.equal("studentId", loggedInUser.$id)]
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
      [Query.equal("officialId", data.officialIdNumber)]
    );

    if (existingProfile.documents.length > 0) {
      return {
        success: false,
        error: "Profile already exists for this authority",
      };
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

export async function createEmployeeProfile(data: {
  companyName: string;
  fullName: string;
  companyCity: string;
  email: string;
  position: string;
}) {
  try {
    console.log(data.companyName)

    // Fetch logged-in user's details
    const loggedInUser = await getLoggedInUser();
    if (!loggedInUser) {
      return { success: false, error: "User not logged in" };
    }

    const { email } = loggedInUser;

    // Initialize Appwrite client
    const client = new Client()
      .setEndpoint(process.env.APPWRITE_ENDPOINT!)
      .setProject(process.env.APPWRITE_PROJECT_ID!);

    const databases = new Databases(client);

    // Create the authority profile document
    const response = await databases.createDocument(
      process.env.APPWRITE_DATABASE_ID!,
      process.env.EMPLOYEE_COLLECTION_ID!,
      ID.unique(),
      {
        companyName: data.companyName,
        name: data.fullName,
        companyCity: data.companyCity,
        email: email,
        position: data.position,
      }
    );

    return { success: true, response };
  } catch (error) {
    console.error("Error creating authority profile:", error);
    return { success: false, error: "Error creating authority profile" };
  }
}
export async function createIssuedCertificate(
  data: {
    courseName: string;
    issueDate: string;
    studentMetaMask: string;
    issuerMetaMask: string;
    certificateId: string;
    fileHash: string;
  },
  fileUrl: string
) {
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
        Query.equal("certificateId", data.certificateId),
        Query.equal("studentMetaMask", data.studentMetaMask),
      ]
    );

    // If a matching certificate exists, return an error
    if (existingCertificate.documents.length > 0) {
      return {
        success: false,
        error: "A certificate with this ID for the same student already exists",
      };
    }

    // Create the issued certificate document
    const response = await databases.createDocument(
      process.env.APPWRITE_DATABASE_ID!,
      process.env.ISSUED_CERTIFICATE_COLLECTION_ID!,
      ID.unique(),
      {
        studentMetaMask: data.studentMetaMask,
        certificateId: data.certificateId,
        certificateName: data.courseName,
        issueDate: data.issueDate,
        issuerMetaMask: data.issuerMetaMask,
        certificateUrl: fileUrl,
        fileHash: data.fileHash,
        issuerOrg: name,
      }
    );

    return { success: true, response };
  } catch (error) {
    console.error("Error issuing certificate:", error);
    return { success: false, error: "Error issuing certificate" };
  }
}

export async function getMetamaskAddress() {
  try {
    // Fetch logged-in user's details
    const loggedInUser = await getLoggedInUser();
    if (!loggedInUser) {
      return { success: false, error: "User not logged in" };
    }
    const { databases } = await createAdminClient();

    // Fetch Metamask address for the logged-in user
    const metamaskResponse = await databases.listDocuments(
      process.env.APPWRITE_DATABASE_ID!,
      process.env.METAMASK_COLLECTION_ID!,
      [Query.equal("userID", loggedInUser.$id)]
    );

    // Check if a Metamask address exists for the user
    if (metamaskResponse.documents.length > 0) {
      return {
        success: true,
        metamaskAddress: metamaskResponse.documents[0].metamaskId,
      };
    } else {
      return {
        success: false,
        error: "No Metamask address found for this user",
      };
    }
  } catch (error) {
    console.error("Error retrieving Metamask address:", error);
    return {
      success: false,
      error: "Error retrieving Metamask address",
    };
  }
}

export async function verifyMetamaskAddress() {
  try {
    // Check if ethereum object is available (MetaMask is installed)
    if (typeof window === "undefined" || !(window as any).ethereum) {
      return { success: false, error: "MetaMask not detected" };
    }

    // Request account access
    const accounts = await (window as any).ethereum.request({
      method: "eth_requestAccounts",
    });

    // Get the current MetaMask address
    const currentMetamaskAddress = accounts[0].toLowerCase();

    // Fetch stored Metamask address from database
    const storedMetamaskResult = await getMetamaskAddress();

    // If no stored address or fetch failed
    if (!storedMetamaskResult.success) {
      return { success: false, error: "No stored Metamask address found" };
    }

    // Compare addresses (convert to lowercase to ensure case-insensitive comparison)
    const storedMetamaskAddress = (
      storedMetamaskResult.metamaskAddress as string
    ).toLowerCase();

    if (currentMetamaskAddress !== storedMetamaskAddress) {
      // Addresses don't match - trigger logout
      return {
        success: false,
        error: "Metamask address mismatch",
      };
    }

    // Addresses match
    return {
      success: true,
      metamaskAddress: currentMetamaskAddress,
    };
  } catch (error) {
    console.error("Metamask address verification failed:", error);

    // If there's an error (e.g., user rejected connection), logout
    await logout();
    return {
      success: false,
      error: "Metamask verification failed. You have been logged out.",
      requiresLogin: true,
    };
  }
}

interface CertificateDocument {
  certificateId: string;
  certificateName: string;
  certificateUrl: string;
  fileHash: string;
  issueDate: string;
  issuerMetaMask: string;
  issuerOrg: string;
  studentMetaMask: string;
}


export async function getCertificateByHash(
  fileHash: string
): Promise<{
  success: boolean;
  response?: CertificateDocument;
  error?: string;
}> {
  try {
    const { databases } = await createAdminClient();

    // Search for certificate with the given file hash
    const certificateResponse = await databases.listDocuments(
      process.env.APPWRITE_DATABASE_ID!,
      process.env.ISSUED_CERTIFICATE_COLLECTION_ID!,
      [Query.equal("fileHash", fileHash)]
    );

    // Check if a certificate with the hash exists
    if (certificateResponse.documents.length > 0) {
      const doc = certificateResponse.documents[0];

      // Map to CertificateDocument structure
      const certificate: CertificateDocument = {
        certificateId: doc.certificateId,
        certificateName: doc.certificateName,
        certificateUrl: doc.certificateUrl,
        fileHash: doc.fileHash,
        issueDate: doc.issueDate,
        issuerMetaMask: doc.issuerMetaMask,
        issuerOrg: doc.issuerOrg,
        studentMetaMask: doc.studentMetaMask,
      };

      return {
        success: true,
        response: certificate,
      };
    } else {
      return {
        success: false,
        error: "No certificate found with this hash",
      };
    }
  } catch (error) {
    console.error("Error retrieving certificate:", error);
    return {
      success: false,
      error: "Error searching for certificate",
    };
  }
}
