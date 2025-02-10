interface Data {
    [key: string]: any;
}

async function updateData(
    endPoint: string,
    id: number,
    updatedData: Data
): Promise<Data | null> {
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        if (!apiUrl) {
            throw new Error("API URL is not defined in the environment variables.");
        }

        const response = await fetch(`${apiUrl}/${endPoint}/${id}`, {
            method: "PUT", // veya PATCH, API'ne bağlı olarak değişebilir
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedData),
        });

        if (!response.ok) {
            console.error(
                `Failed to update data: ${response.status} ${response.statusText}`
            );
            return null;
        }

        return (await response.json()) as Data;
    } catch (error) {
        console.error("Error updating data:", error);
        return null;
    }
}

export default updateData;
