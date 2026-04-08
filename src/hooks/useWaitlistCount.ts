import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { MAX_WAITLIST } from "@/lib/domains";

export function useWaitlistCount() {
  const [enrolled, setEnrolled] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, "waitlist"),
      where("estado", "==", "inscrito")
    );
    const unsub = onSnapshot(q, (snapshot) => {
      setEnrolled(snapshot.size);
      setLoading(false);
    });
    return unsub;
  }, []);

  return {
    enrolled,
    available: Math.max(0, MAX_WAITLIST - enrolled),
    isFull: enrolled >= MAX_WAITLIST,
    loading,
  };
}
