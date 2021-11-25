import { useReducer, useEffect, useState } from "react";
import { projectFirestore, timestamp } from "../firebase/config";

let initialState = {
  document: null,
  isPending: false,
  error: null,
  success: null,
};

const firestoreReducer = (state, action) => {
  switch (action.type) {
    case "IS_PENDING":
      return { document: null, isPending: true, success: false, error: null };
    case "ADDED_DOCUMENT":
      return {
        document: action.payload,
        isPending: false,
        success: true,
        error: null,
      };
    case "DELETED_DOCUMENT":
      return {
        document: null,
        isPending: false,
        success: true,
        error: null,
      };
    case "UPDATED_DOCUMENT":
      return {
        isPending: false,
        document: action.payload,
        success: true,
        error: null,
      };
    case "ERROR":
      return {
        document: null,
        error: action.payload,
        isPending: false,
        success: false,
      };
    default:
      return state;
  }
};

export const useFirestore = (collection) => {
  //what the useReducer would return is a "state" and a dispatch function
  //you could name the "state" whatever you want
  //and the parameter you have to passin the useReducer is
  //1. handling reducer function(accepting state and action)
  //2. initial "state", and make it global(outside of hook) so we don't initiate it every render
  const [response, dispatch] = useReducer(firestoreReducer, initialState);
  const [isCancelled, setIsCancelled] = useState(false);

  //collection reference for easier access to firestore
  const ref = projectFirestore.collection(collection);

  const dispatchIfNotCancelled = (action) => {
    if (!isCancelled) {
      dispatch(action);
    }
  };
  //add document
  const addDocument = async (doc) => {
    dispatch({ type: "IS_PENDING" });
    try {
      const createAt = timestamp.fromDate(new Date());
      const addedDocument = await ref.add({ ...doc, createAt });
      dispatchIfNotCancelled({
        type: "ADDED_DOCUMENT",
        payload: addedDocument,
      });
    } catch (err) {
      dispatchIfNotCancelled({ type: "ERROR", payload: err.message });
    }
  };

  //delete document
  const deleteDocument = async (id) => {
    dispatch({ action: "IS_PENDING" });

    try {
      await ref.doc(id).delete();
      dispatchIfNotCancelled({
        type: "DELETED_DOCUMENT",
      });
    } catch (err) {
      dispatchIfNotCancelled({ type: "ERROR", payload: "could not delete" });
    }
  };

  //update document
  const updateDocument = async (id, updates) => {
    dispatch({ type: "IS_PENDING" });
    try {
      const updatedDocument = await ref.doc(id).update(updates);
      dispatchIfNotCancelled({
        type: "UPDATED_DOCUMENT",
        payload: updatedDocument,
      });
      return updatedDocument;
    } catch (err) {
      dispatchIfNotCancelled({
        type: "ERROR",
        payload: err.message,
      });
      return null;
    }
  };

  useEffect(() => {
    return () => {
      setIsCancelled(true);
    };
  }, []);

  return { addDocument, deleteDocument, updateDocument, response };
};
