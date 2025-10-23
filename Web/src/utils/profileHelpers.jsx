import { getUserProfile } from "../service/profile/UserService";

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

  const meProfile = await getUserProfile(me);
  const seguidores = Array.isArray(meProfile.followers) ? meProfile.followers : [];

  const isMe = !!me && (me === profileId);

  const isFollowing = isFollowingOverride !== undefined
    ? isFollowingOverride
    : (!isMe && isFollowedBy(seguidores, profileId));

  const followersCount = Number.isFinite(profile.followersCount)
    ? profile.followersCount
    : seguidores.length;

  return { isMe, isFollowing, followersCount };
};

