import "./post.css"
import { Link }from "react-router-dom"
import moment from "moment";

export default function Post({post}) {
  const PF = "http://localhost:5000/images/";

  return (
    <>
    <div className="post">
        <div className="card">
          <div class="card-meta-blogpost">
              Posted by <Link to={`/profile/${post.uid}`} card-meta-blogpost-author className="link">{`${post.firstname} ${post.lastname}`}</Link> on {moment(post.date).format('ll')} {post?.cat && 
                ( <>
                  <span>in </span><Link to={`/?cat=${post.cat}`} className="link">{post.cat}</Link>
                  </>)}
          </div>
          <div className="card-image-box">
            <Link to={`/post/${post.id}`} className="link">
              {post.img && <img src={PF + post.img} alt="" />}
            </Link>
          </div>
          <div className="card-description">
            <Link to={`/post/${post.id}`} className="card-description-title"><h3>{post.title}</h3></Link>
            <p className="card-description-post">
              <div dangerouslySetInnerHTML={{__html: post.desc}} />
            </p>
            <Link to={`/post/${post.id}`} className="read-more">Read more</Link>
          </div>
        </div>
    </div>
    </>   
  )
}
