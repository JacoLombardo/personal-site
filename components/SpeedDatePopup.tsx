"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "@/styles/speeddate.module.css";

const DELAY_MS = 3000;

// Only show the popup on the first visit to the homepage in this document lifecycle.
// Navigating back from a project or after the speed date does not show it again; a full reload does.
let hasPromptedThisDocumentLoad = false;

export default function SpeedDatePopup() {
  const [visible, setVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (hasPromptedThisDocumentLoad) return;
    const t = setTimeout(() => {
      hasPromptedThisDocumentLoad = true;
      setVisible(true);
    }, DELAY_MS);
    return () => clearTimeout(t);
  }, []);

  const handleYes = () => {
    setVisible(false);
    router.push("/speed-date");
  };

  const handleNo = () => setVisible(false);

  if (!visible) return null;

  return (
    <div className={styles.popup_backdrop} role="dialog" aria-labelledby="speeddate-title" aria-modal="true">
      <div className={styles.popup_card}>
        <h2 id="speeddate-title" className={styles.popup_title}>Speed date</h2>
        <p className={styles.popup_text}>
          In a hurry? Let me take you on a quick tour around.
        </p>
        <div className={styles.popup_actions}>
          <button type="button" className={styles.popup_btn} onClick={handleYes}>
            Yes
          </button>
          <button type="button" className={styles.popup_btn_secondary} onClick={handleNo}>
            No
          </button>
        </div>
      </div>
    </div>
  );
}
