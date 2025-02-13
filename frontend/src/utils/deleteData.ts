interface DeleteResponse {
    success: boolean;
    message?: string;
  }
  
  async function deleteData(
    endPoint: string,
    id: number,
    options: {
      cache?: RequestCache;
      next?: { revalidate: number };
    } = { cache: "no-store" }
  ): Promise<DeleteResponse> {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) {
        throw new Error("API URL is not defined in the environment variables.");
      }
  
      const response = await fetch(`${apiUrl}/${endPoint}/${id}`, {
        method: "DELETE",
        cache: options.cache,
        next: options.next,
      });
  
      if (!response.ok) {
        console.error(
          `Failed to delete data: ${response.status} ${response.statusText}`
        );
        return { success: false, message: "Failed to delete data." };
      }
  
      return { success: true, message: "Data deleted successfully." };
    } catch (error) {
      console.error("Error deleting data:", error);
      return { success: false, message: "An error occurred while deleting data." };
    }
  }
  
  export default deleteData;
  