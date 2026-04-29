import "../css/Forum.css";
import { useState, useEffect } from "react";
import Scroll from "../components/Scroll";
import { postForumRequest, formatDate } from "../utilities";

function Forum({ user }) {
  const [postData, setPostData] = useState({ title: "", content: "" });
  const [posts, setPosts] = useState([]);
  const [commentData, setCommentData] = useState({ content: "", postID: "" });
  const [comments, setComments] = useState([]);
  const mainEndpoint = `http://localhost:5000/`;

  useEffect(() => {
    fetch(mainEndpoint + "data/forum")
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setPosts(data);
      })
      .catch((error) => {
        console.error(error);
      });

    fetch(mainEndpoint + "data/forum/comments")
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setComments(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [posts, comments]);

  const handleSubmit = async (e, text) => {
    let endpoint;
    e.preventDefault();
    if (text == "post") {
      endpoint = mainEndpoint + `data/forum`;
      const data = await postForumRequest(endpoint, postData, user.id);
    } else {
      endpoint = mainEndpoint + `data/forum/comments`;
      const data = await postForumRequest(endpoint, commentData, user.id);
    }
    setTimeout(() => {
      e.target.reset();
    }, 300);
  };

  const handleChange = (e, text, postID = null) => {
    if (text == "post") {
      e.target.style.height = "auto";
      e.target.style.height = e.target.scrollHeight + "px";
      //Esto nos permite que el input del area de texto crezca conforme escribimos y cambiamos de renglon.
      setPostData({ ...postData, [e.target.name]: e.target.value });
    } else {
      setCommentData({
        ...commentData,
        [e.target.name]: e.target.value,
        postID: postID,
      });
    }
  };

  return (
    <>
      <div id="forum">
        <h2 id="forum-header">Forum</h2>
        <div id="post-input">
          <form id="post-form" onSubmit={(e) => handleSubmit(e, "post")}>
            <input
              id="title-input"
              placeholder="Insert title of your post..."
              className="input-fields"
              name="title"
              onChange={(e) => handleChange(e, "post")}
              minLength="4"
              required
            />
            <textarea
              placeholder="Insert your post here..."
              rows={1}
              className="input-fields"
              name="content"
              onChange={(e) => handleChange(e, "post")}
              minLength="30"
              required
            />
            <button id="post-button">Submit</button>
          </form>
        </div>
        <div className="posts">
          {posts.map((post) => (
            <div className="post-body" key={post.id}>
              <div className="post-data">
                <p>{post.email}</p>
                <p>{formatDate(post?.created_at)}</p>
              </div>
              <div className="post-text">
                <h3 className="post-title">{post.title}</h3>
                <p className="post-content">{post.content}</p>
              </div>
              <div>
                <div
                  style={{
                    borderBottom: comments.some(
                      (comment) => comment.post_id === post.id,
                    )
                      ? "1px solid white"
                      : "none",
                  }}
                >
                  <form
                    className="comment-form"
                    onSubmit={(e) => handleSubmit(e, "comment")}
                  >
                    <input
                      placeholder="Write a comment..."
                      className="comment-input"
                      name="content"
                      onChange={(e) => handleChange(e, "comment", post.id)}
                      minLength="4"
                      required
                    />
                    <button id="comment-button">Submit</button>
                  </form>
                </div>
                <div className="all-comments">
                  {comments
                    .filter((comment) => comment.post_id === post.id)
                    .map((comment) => (
                      <div className="comment-body" key={comment.id}>
                        <div className="comment-data">
                          <p>{comment.email}</p>
                          <p>{formatDate(comment?.created_at)}</p>
                        </div>
                        <div className="comment-text">
                          <p>{comment.content}</p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        <Scroll />
      </div>
    </>
  );
}

export default Forum;
