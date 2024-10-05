"use server";

import { Client, Account, ID, Users, Databases, Query } from 'node-appwrite';
import { cookies } from 'next/headers';

export async function createSessionClient() {
    const client = new Client()
        .setEndpoint(process.env.APPWRITE_ENDPOINT!)
        .setProject(process.env.APPWRITE_PROJECT_ID!);

    const session = cookies().get("blockchain");

    if (!session || !session.value) {
        console.error("No session found in cookies");
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
    } catch (error) {
        return null;
    }
}

export async function signUpWithEmail(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("fullName") as string;
    const role = formData.get("role") as string;

    if (!email || !password || !name || !role) {
        return { success: false, error: "Missing required fields" };
    }

    const { account } = await createAdminClient();

    try {
        await account.create(ID.unique(), email, password, name);
        const session = await account.createEmailPasswordSession(email, password);
        cookies().set("blockchain", session.secret, {
            path: "/",
            httpOnly: true,
            sameSite: "strict",
            secure: true,
        });
        return { success: true };
    } catch (error) {
        console.error("Sign up failed:", error);
        return { success: false, error: "Sign up failed. Please try again." };
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