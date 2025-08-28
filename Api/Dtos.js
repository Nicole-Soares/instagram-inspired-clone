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
    likes,
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
