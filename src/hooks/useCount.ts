import useSQData from "./useSQData";
import { useUserData } from "./useUserData";

export const useCounts = () => {
  const { CountUsers } = useUserData();
  const { areaCount, sqCount } = useSQData();

  return { CountUsers, areaCount, sqCount };
};