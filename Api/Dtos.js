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

export const transformPost = ({
    id,
    image,
    description,
    user,
    date,
    comments,
    likes
})=> {
    return {
        id,
        image,
        description,
        user: {
            id: user.id,
            name: user.name,
            image: user.image
        },
        date,
        comments: comments.map(comment => ({
            id: comment.id,
            body: comment.body,
            user: {
                id: comment.user.id,
                name: comment.user.name,
                image: comment.user.image
            }
        })),
        likes: likes.map(like => ({
            id: like.id,
            name: like.name,
            image: like.image
        }))
    };
}
