import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { MySwal } from "./Alert";

export const removeAccents = (str: string) =>
  str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

export const requestSquematic = async (
  type: "GET" | "POST" | "DELETE" | "PUT",
  url: string,
  object: any,
  cancelRequest?: AbortSignal
): Promise<any> => {
  try {
    let res: AxiosResponse<any>;
    const generalParams: AxiosRequestConfig<any> = {
      signal: cancelRequest,
      timeout: 20000,
    };

    if (type === "GET") {
      res = await axios.get(process.env.NEXT_PUBLIC_DOMAIN + url, {
        ...generalParams,
        params: object,
      });
    } else if (type === "POST") {
      res = await axios.post(
        process.env.NEXT_PUBLIC_DOMAIN + url,
        object,
        generalParams
      );
    } else if (type === "PUT") {
      res = await axios.put(
        process.env.NEXT_PUBLIC_DOMAIN + url,
        object,
        generalParams
      );
    }

    const data = res.data;

    if (data.status === "OK") {
      return data;
    } else {
      !MySwal.isVisible() &&
        MySwal.fire({
          icon: "error",
          title: "¡Error!",
          text: "Typing problem...",
        });
    }
  } catch (error: any) {
    if (error instanceof TypeError) {
      !MySwal.isVisible() &&
        MySwal.fire({
          icon: "error",
          title: "¡Error!",
          text: "Typing problem...",
          footer: error.message,
        });

      return;
    } else if (axios.isCancel(error)) {
      return;
    }

    !MySwal.isVisible() &&
      MySwal.fire({
        icon: "error",
        title: "¡Error!",
        text: "Server problem...",
        footer: error,
      });
  }
};
