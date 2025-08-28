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
        followers: followers.map(transformSimpleUser)
    };
}
 
export const transformComments = (comments) => {
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

export const transformPost = ({
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

export const transformSimpleUser = (user) => ({
            id: user.id,
            image: user.image,
            name: user.name,
        })

export const transformTimeline = ({
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
        comments: comments.map(transformComment),
        likes: likes.map(transformSimpleUser)
    }  
} 

export const transformComment = ({
    id,
    body,
    user
})=> {
    return {
        id,
        body,
        user: transformSimpleUser(user),
    }
}
