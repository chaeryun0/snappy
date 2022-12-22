import { useState, useEffect, useRef, useCallback } from "react";

/**
 * ValidationInput 사용을 위한 Custom Hook
 *
 * @param {(value:string) => string | null} checkValidation
 * @returns {[inputRef: React.MutableRefObject<HTMLInputElement>, handleValidation: () => void, errorMessage: string, isPassed: boolean]}
 */
export default function useValidationInput(checkValidation) {
  const inputRef = useRef(null);
  const errorMessageCache = useRef("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isPassed, setIsPassed] = useState(false);

  const handleValidation = useCallback(() => {
    const {
      current: { value },
    } = inputRef;

    const errorMessageCalculated = checkValidation(value) || "";
    setIsPassed(!errorMessageCalculated);

    setErrorMessage(errorMessageCalculated);
    errorMessageCache.current = errorMessageCalculated;
  }, [checkValidation]);

  const clearErrorMessage = useCallback(() => setErrorMessage(""), []);
  const loadErrorMessage = useCallback(
    () => setErrorMessage(errorMessageCache.current),
    []
  );

  const addFocusListeners = useCallback(() => {
    inputRef.current.addEventListener("focusout", clearErrorMessage);
    inputRef.current.addEventListener("focusin", loadErrorMessage);
  }, [clearErrorMessage, loadErrorMessage]);

  const removeFocusListeners = useCallback(() => {
    inputRef.current.removeEventListener("focusout", clearErrorMessage);
    inputRef.current.removeEventListener("focusin", loadErrorMessage);
  }, [clearErrorMessage, loadErrorMessage]);

  useEffect(() => {
    if (inputRef.current) {
      addFocusListeners();

      return removeFocusListeners;
    }
  }, [addFocusListeners, removeFocusListeners]);

  return [inputRef, handleValidation, errorMessage, isPassed];
}
