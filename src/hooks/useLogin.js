import { useAuthContext } from "./useAuthContext";
import { useState, useEffect } from "react";
import { projectAuth, projectFirestore } from "../firebase/config";

export const useLogin = () => {
  const [isCancelled, setIsCancelled] = useState(false);
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const { dispatch } = useAuthContext();

  const login = async (email, password) => {
    try {
      const response = await projectAuth.signInWithEmailAndPassword(
        email,
        password
      );
      dispatch({ type: "LOGIN", payload: response.user });

      //set the status to online
      await projectFirestore.collection("users").doc(response.user.uid).update({
        online: true,
      });

      if (!isCancelled) {
        setIsPending(false);
        setError(null);
      }
    } catch (err) {
      if (!isCancelled) {
        setError(err.message);
        setIsPending(false);
        console.log(err.message);
      }
    }
  };
  useEffect(() => {
    return () => setIsCancelled(true);
  }, []);

  return { login, error, isPending };
};
