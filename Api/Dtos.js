 const transformUser = ({
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

 const transformPost = ({
    image,
    description,
    id,
    user,
    comments,
    likes,
    date
})=> {
    return {
        image,
        description,
        id,
        user: transformUser(user), // para no generar un loop infinito
        comments,
        likes,
        date
       
    };
}

export {transformUser, transformPost};