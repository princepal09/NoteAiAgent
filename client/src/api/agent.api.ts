import api from "@/lib/axios";


export const chatWithAgent = async(message:string) => {
    const response = await api.post("/agent/chat", {message});
    // console.log("response", response);
    return response.data.data;
}