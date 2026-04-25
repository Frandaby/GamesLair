import "../css/Forum.css";
import { useState, useEffect } from "react";

function Forum({ user }) {
  const [postData, setPostData] = useState({ title: "", content: "" });
  const [posts, setPosts] = useState([]);
  const [commentData, setCommentData] = useState({ content: "", postID: "" });
  const [comments, setComments] = useState([]);
  useEffect(() => {
    fetch("http://localhost:5000/data/forum")
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setPosts(data);
      })
      .catch((error) => {
        console.error(error);
      });

    fetch("http://localhost:5000/data/forum/comments")
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

  async function postRequest(endpoint, data, userID) {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        data: data,
        userID: userID,
      }),
    });
    return res.json();
  }

  const handleSubmit = async (e, text) => {
    let endpoint;
    e.preventDefault();
    if (text == "post") {
      endpoint = `http://localhost:5000/data/forum`;
      const data = await postRequest(endpoint, postData, user.id);
    } else {
      endpoint = `http://localhost:5000/data/forum/comments`;
      const data = await postRequest(endpoint, commentData, user.id);
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
        <div id="post-input">
          <form id="post-form" onSubmit={(e) => handleSubmit(e, "post")}>
            <input
              id="title-input"
              placeholder="Insert title of your post..."
              class="input-fields"
              name="title"
              onChange={(e) => handleChange(e, "post")}
              minLength="4"
              required
            />
            <textarea
              placeholder="Insert your post here..."
              rows={1}
              class="input-fields"
              name="content"
              onChange={(e) => handleChange(e, "post")}
              minLength="30"
              required
            />
            <button id="post-button">Submit</button>
          </form>
        </div>
        <div class="posts">
          {posts.map((post) => (
            <div class="post-body">
              <div class="post-data">
                <p>{post.email}</p>
                <p>
                  {post?.created_at
                    ?.slice(0, 10)
                    .split("-")
                    .reverse()
                    .join("-") +
                    " at " +
                    post?.created_at
                      ?.slice(11, 19)
                      .split("-")
                      .reverse()
                      .join("-")}
                </p>
              </div>
              <div class="post-text">
                <h3 class="post-title">{post.title}</h3>
                <p class="post-content">{post.content}</p>
              </div>
              <div>
                <div
                  style={{
                    "border-bottom": comments.some(
                      (comment) => comment.post_id === post.id,
                    )
                      ? "1px solid white"
                      : "none",
                  }}
                >
                  <form
                    class="comment-form"
                    onSubmit={(e) => handleSubmit(e, "comment")}
                  >
                    <input
                      placeholder="Write a comment..."
                      class="comment-input"
                      name="content"
                      onChange={(e) => handleChange(e, "comment", post.id)}
                      minLength="4"
                      required
                    />
                    <button id="comment-button">Submit</button>
                  </form>
                </div>
                <div class="all-comments">
                  {comments
                    .filter((comment) => comment.post_id === post.id)
                    .map((comment) => (
                      <div class="comment-body">
                        <div class="comment-data">
                          <p>{comment.email}</p>
                          <p>
                            {comment?.created_at
                              ?.slice(0, 10)
                              .split("-")
                              .reverse()
                              .join("-") +
                              " at " +
                              comment?.created_at
                                ?.slice(11, 19)
                                .split("-")
                                .reverse()
                                .join("-")}
                          </p>
                        </div>
                        <div class="comment-text">
                          <p>{comment.content}</p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Forum;
