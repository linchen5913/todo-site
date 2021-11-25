import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";

export const useAuthContext = () => {
  //context = {...state,dispatch}
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuthContext should be used inside an AuthContextProvider"
    );
  }

  return context;
};
