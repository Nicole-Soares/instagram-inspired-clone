import { getUserProfile } from "../service/profile/UserService";
//funciones auxiliares para manejar perfiles de usuario

//normaliza los ids a string
export const idToString = (v) => {
  if (!v) return "";
  if (typeof v === "string") return v.trim();
  return String(v.id ?? v._id ?? v.userId ?? "").trim();
};

//comprueba si el usuario logueado esta en la lista de seguidores
const isFollowedBy = (followers, meId) => {
  if (!meId || !Array.isArray(followers)) return false;
  const me = idToString(meId);
  return followers.some((f) => idToString(f) === me);
};

export const computeProfileFlags = async (profile, meId, isFollowingOverride) => {
  const me = idToString(meId);
  const profileId = idToString(profile);

  // Trae la lista de usuarios seguidos por el usuario logueado
  const meProfile = await getUserProfile(me);
  const seguidores = Array.isArray(meProfile.followers) ? meProfile.followers : [];

  const isMe = !!me && (me === profileId);

  // Si se pasa un override, lo usamos. Si no, calculamos normalmente
  const isFollowing = isFollowingOverride !== undefined
    ? isFollowingOverride
    : (!isMe && isFollowedBy(seguidores, profileId));

  const followersCount = Number.isFinite(profile.followersCount)
    ? profile.followersCount
    : seguidores.length;

  return { isMe, isFollowing, followersCount };
};

