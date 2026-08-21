import api from "@/lib/axios";


export const getAllNotes = async() => {
    const response = await api.get("/note/all-notes");
    // console.log("response", response);
    return response.data.data;
}