import Storage from "../service/storage";

//funciones auxiliares para manejar perfiles de usuario

//normaliza los ids a string
export const idToString = (v) => {
  if (!v) return "";
  if (typeof v === "string") return v.trim();
  return String(v.id ?? v._id ?? v.userId ?? "").trim();
};

//comprueba si el usuario logueado esta en la lista de seguidores
export const isFollowedBy = (followers, meId) => {
  if (!meId || !Array.isArray(followers)) return false;
  const me = idToString(meId);
  return followers.some((f) => idToString(f) === me);
};

//calcula los flags isMe, isFollowing y followersCount
export const computeProfileFlags = (profile, meId) => {
  const me = idToString(meId);
  const profileId = idToString(profile);
  const followers = Array.isArray(profile.followers) ? profile.followers : [];

  const isMe = !!me && (me === profileId);
  const isFollowing = !isMe && isFollowedBy(followers, me);
  const followersCount = Number.isFinite(profile.followersCount)
    ? profile.followersCount
    : followers.length;

  return { isMe, isFollowing, followersCount };
};


//obtiene el Id del usuario logueado y lo normaliza
export const getMeId = () => {
  const stored = Storage.getUserId?.();
  if (stored) return idToString(stored);

  try {
    const raw = (Storage.getToken() || "").replace(/^Bearer\s+/i, "");
    const payload = JSON.parse(atob(raw.split(".")[1] || ""));
    return idToString(payload.userId);
  } catch {
    return "";
  }
};