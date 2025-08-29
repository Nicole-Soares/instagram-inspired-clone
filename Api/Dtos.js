const transformUser = ({
    id,
    name,
    email,
    image,
    followers,
})=> {
    return {
        id,
        name,
        email,
        image,
        followers: followers.map(transformSimpleUser),
    };
}
 
const transformComments = (comments) => {
    return comments.map(comment => ({
        id: comment.id,
        body: comment.body,
        user: transformUser(comment.user) 
    }));
}

const transformSimpleComments = (comments) => {
    return comments.map(comment => ({
        id: comment.id,
        body: comment.body,
        user: transformSimpleUser(comment.user) 
    }));
}

const transformLikes = (likes) => {
    return likes.map(like => ({ 
        name: like.name 
    }));
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

const transformSimplePost = ({
    id,
    image,
    description,
    date,
    comments,
    user,
    likes
}) => {
    return {
        id,
        image,
        description,
        date,
        comments: transformSimpleComments(comments),
        user: transformSimpleUser(user),
        likes: transformLikes(likes)
    };
}

const transformSimpleUser = (user) => ({
        id: user.id,
        image: user.image,
        name: user.name,
});

const transformTimeline = ({
    id,
    email,
    description,
    image,
    user,
    date,
    comments,
    likes
})=> {
    return {
        id,
        email,
        description,
        image,
        user: transformSimpleUser(user),
        date,
        comments: transformSimpleComments(comments),
        likes: transformLikes(likes)
    };  
} 

export { transformUser, transformPost, transformTimeline, transformSimpleUser, transformSimplePost };