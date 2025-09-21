import React, { useEffect, useState} from "react";
import { useParams } from "react-router";

const Post = () => {
    const {id} = useParams();
    const [post, setPost] = useState<any>(null);

    useEffect(() => {
        fetch(`https://jsonplaceholder.typicode.com/posts/${id}`)
            .then((res) => res.json())
            .then((data) => setPost(data));
    }, []);

    return(
        <div>
            <p>Post</p>
            {post && (
                <>
                    <h2>{post.title}</h2>
                    <p>{post.body}</p>
                </>
            )}
        </div>
    )
};

export default Post;