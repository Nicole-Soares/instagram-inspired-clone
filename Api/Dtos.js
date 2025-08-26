export const transformUser = ({
    id,
    name,
    email,
    password,
    image,
    followers
})=> {
    return {
        id,
        name,
        email,
        password,
        image,
        followers: followers.map(follower => ({
            id: follower.id,
            image: follower.image,
        
        }))
    };
}
