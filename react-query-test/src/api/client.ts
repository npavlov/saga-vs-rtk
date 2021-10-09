import axios from "axios";
import {QueryClient} from "react-query";

const BASE_URL = "http://localhost:4000/";

export const axiosClient = axios.create({
    baseURL: BASE_URL
});

export const queryClient = new QueryClient();
