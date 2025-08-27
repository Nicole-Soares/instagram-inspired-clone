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

const transformComments = (comments) => {
    return comments.map(comment => ({
        id: comment.id,
        body: comment.body,
        user: transformUser(comment.user),
        
    }));
}

const transformLikes = (likes) => {
    return likes.map(like => ({
        name: like.name }));
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
        comments: transformComments(comments),
        likes: transformLikes(likes),
        date
       
    };
}

export {transformUser, transformPost, transformComments};