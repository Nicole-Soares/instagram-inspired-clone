import { createContext, useContext, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Api from "../service/Api";

// helper para normalizar ids (tu API a veces trae "user_123")
const cleanId = (v) => String((typeof v === "object" ? (v?.id ?? v?._id ?? v?.userId) : v) ?? "")
  .replace(/^user_/, "");

const Ctx = createContext(null);

export function FollowProvider({ children }) {
  const [me, setMe] = useState(null);
  const [followingSet, setFollowingSet] = useState(() => new Set());
  const [pendingIds, setPendingIds] = useState(() => new Set());

  useEffect(() => {
    (async () => {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;
      try {
        const meRes = await Api.getUser();
        const meData = meRes?.data ?? meRes;
        setMe(meData);

        const seguidosArray = Array.isArray(meData?.followers) ? meData.followers : []; 
        setFollowingSet(new Set(seguidosArray.map(cleanId)));
      } catch (_) {}
    })();
  }, []);

  const isFollowing = (userId) => followingSet.has(cleanId(userId));

  const toggleFollow = async (userId) => {
    const id = cleanId(userId);
    if (pendingIds.has(id)) return;

    setPendingIds((p) => new Set(p).add(id));
    const next = !isFollowing(id);

    setFollowingSet((prev) => {
      const ns = new Set(prev);
      next ? ns.add(id) : ns.delete(id);
      return ns;
    });

    try {
      await Api.toggleFollow(userId);
    } catch (e) {
      setFollowingSet((prev) => {
        const ns = new Set(prev);
        next ? ns.delete(id) : ns.add(id);
        return ns;
      });
      console.error("toggleFollow error:", e);
    } finally {
      setPendingIds((p) => {
        const ns = new Set(p);
        ns.delete(id);
        return ns;
      });
    }
  };

  const value = useMemo(
    () => ({ me, isFollowing, toggleFollow, pendingIds }),
    [me, followingSet, pendingIds]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useFollow = () => useContext(Ctx);
