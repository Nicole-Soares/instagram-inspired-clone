export const transformUser = ({
    id,
    email,
    password,
    image,
    followers
})=> {
    return {
        id,
        email,
        password,
        image,
        followers: followers.map(follower => ({
            id: follower.id,
            image: follower.image,
        
        }))
    };
}


