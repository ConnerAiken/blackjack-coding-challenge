import { useEffect } from "react";

export const usePreventClose = () => {
  useEffect(() => {
    // Prompt confirmation when reload page is triggered
    window.onbeforeunload = () => {
      return "";
    };

    // Unmount the window.onbeforeunload event
    return () => {
      window.onbeforeunload = null;
    };
  }, []);
};
