import { createContext, useContext, useState } from "react";

const TimelineRefreshContext = createContext();

export function TimelineRefreshProvider({ children }) {
  const [refreshFlag, setRefreshFlag] = useState(0);

  const triggerRefresh = () => {
    setRefreshFlag((prev) => prev + 1);
  };

  return (
    <TimelineRefreshContext.Provider value={{ refreshFlag, triggerRefresh }}>
      {children}
    </TimelineRefreshContext.Provider>
  );
}

export const useTimelineRefresh = () => useContext(TimelineRefreshContext);
