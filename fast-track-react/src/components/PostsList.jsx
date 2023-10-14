import classes from "./PostsList.module.css";
import Post from "./Post";
import NewPost from "./NewPost";
import Modal from "./Modal";
import { useState, useEffect } from "react";

function PostsList({ isPosting, onStopPosting }) {
  const [posts, setPosts] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  // data yang diterima useeffect berupa function dan array
  useEffect(() => {
    async function fetchPosts() {
      setIsFetching(true);
      const response = await fetch("http://localhost:8080/posts");
      const restData = await response.json();
      // if(!response.ok){} kalau fail pada saat fetch
      setPosts(restData.posts);
      setIsFetching(false);
    }

    fetchPosts();
  }, []);
  function addPostHandler(postData) {
    fetch("http://localhost:8080/posts", {
      // to send data
      method: "POST",
      body: JSON.stringify(postData),
      headers: {
        "Content-Type": "application/json",
      },
    });
    setPosts((existingPosts) => [postData, ...existingPosts]);
    // if new state depend on previous state better use this method
  }
  return (
    <>
      {isPosting && (
        <Modal onClose={onStopPosting}>
          <NewPost onCancel={onStopPosting} onAddPost={addPostHandler} />
        </Modal>
      )}
      {!isFetching && posts.length > 0 && (
        <ul className={classes.posts}>
          {posts.map((post) => (
            <Post key={post.body} author={post.author} body={post.body} />
          ))}
        </ul>
      )}
      {!isFetching && posts.length === 0 && (
        <div style={{ textAlign: "center", color: "white" }}>
          <h2>There are not posts yet.</h2>
          <p>Start adding some!</p>
        </div>
      )}
      {isFetching && (
        <div style={{ textAlign: "center", color: "white" }}>
          <p>Loading Posts...</p>
        </div>
      )}
    </>
  );
}

export default PostsList;
