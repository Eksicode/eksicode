import { getSession } from "next-auth/react";
interface AddResponse {
    success: boolean;
    message?: string;
}
interface Data {
    [key: string]: any;
}

async function addData(
    endPoint: string,
    data: Data,
    options: {
        cache?: RequestCache;
        next?: { revalidate: number };
    } = { cache: "no-store" }
): Promise<AddResponse> {
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const session = await getSession();

        if (!session) {
            throw new Error("Session not found.");
        }

        if (!apiUrl) {
            throw new Error("API URL is not defined in the environment variables.");
        }

        const response = await fetch(`${apiUrl}/${endPoint}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session.accessToken}`,
            },
            body: JSON.stringify(data),
            cache: options.cache,
            next: options.next,
        });

        if (!response.ok) {
            console.error(
                `Failed to add data: ${response.status} ${response.statusText}`
            );
            return { success: false, message: "Failed to add data." };
        }

        return { success: true, message: "Data added successfully." };
    } catch (error) {
        console.error("Error adding data:", error);
        return { success: false, message: "An error occurred while adding data." };
    }

}

export default addData;