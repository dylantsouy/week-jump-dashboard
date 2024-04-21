import { fetcher } from "./apiSetup";

export const login = async (props) => {
  const data = await fetcher("/signin", "POST", props);

  return data;
};
