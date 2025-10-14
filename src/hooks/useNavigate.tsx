import { useRouter } from "next/router";
import { encryptData, decryptData } from "@/utils/encryptDecrypt";

export function useNavigate() {
  const router = useRouter();

  const navigateWithData = (page: string, data: any) => {
    if (typeof window !== "undefined") {
      const encryptedData = encryptData(data);
      sessionStorage.setItem(`secureData:${page}`, encryptedData);
      router.push(page);
    }
  };

  const readSecureData = (page: string): any | null => {
    if (typeof window !== "undefined") {
      const encryptedData = sessionStorage.getItem(`secureData:${page}`);
      if (encryptedData) {
        return decryptData(encryptedData);
      }
    }
    return null;
  };

  return { navigateWithData, readSecureData };
}
