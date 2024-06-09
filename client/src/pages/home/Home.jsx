import "./home.css";
import Banner from "../../components/banner/Banner";
import Sidebar from "../../components/sidebar/Sidebar";
import Posts from "../../components/posts/Posts";
import Pagination from "../../components/pagination/Pagination";
import { Link }from "react-router-dom"
import {useLocation} from "react-router";
import axios from "axios";
import { useState, useEffect } from "react";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [isfetching, setIsFetching] = useState(true)
  //useLocation returned an object, 
  //we destructured and collected only search property, you can say, const x = useLocation()
  //to view the object x returns.
  const {search} = useLocation();
  const mainQuerySplit = search.split('&')[0]
  const generalQuerySplit = search.split("=")[0]
  const category = search.split("=")[1];
 
  const [iterator, setIterator] = useState(null);
  const [endingLink, setEndingLink] = useState(null);
  const [page, setPage] = useState(null);
  const [numberOfPages, setNumberOfPages] = useState(null);

  useEffect(()=>{
    const fetchPosts = async ()=>{
      try {//note the + search is a query in the backend api,
      //and not a route like /posts/:id
      const res = await axios.get(`${process.env.REACT_APP_API}/posts` + search);

      console.log(res);

      setPosts(res.data.data);
      setIsFetching(false)
      setIterator(res.data.iterator || null);
      setEndingLink(res.data.endingLink || null);
      setPage(res.data.page || null);
      setNumberOfPages(res.data.numberOfPages || null);

      window.scrollTo(0,0)
      
      } catch(err){
        console.log(err);
      }
    };

    fetchPosts();
  },[search])

  return (
    <>
      <div className="home">
        {generalQuerySplit==="?cat" || generalQuerySplit==="?searchposts" ?(
          <>
            {generalQuerySplit==="?cat" && <h2 className="home-heading">Latest Posts in {category}</h2>}
            {generalQuerySplit==="?searchposts" && <h2 className="home-heading">Latest search results</h2>}
          </>
        ): 
          <>
            {!search && <Banner />}
            <Link to="/" className="link"><h2 className="home-heading">Latest Posts</h2></Link>
          </>
        }
        {
          isfetching && (
            <h3>Loading....</h3>
          )
        }
        <div className="home-children">
          <div className="posts-section">
            <Posts posts={posts}/>
            {posts.length === 0 && isfetching === false && (
              <h2>Sorry, no posts found</h2>
            )}
            
            {
              !search && (
                <div className="home-pagination">
                  <Pagination iterator={iterator} endingLink={endingLink} page={page} numberOfPages={numberOfPages} toWhere={'/?'}/> 
                </div>
              )
            }

            {search && (
              <div className="home-pagination">
                <Pagination iterator={iterator} endingLink={endingLink} page={page} numberOfPages={numberOfPages} toWhere={generalQuerySplit==="?cat" || generalQuerySplit==="?searchposts"?`/${mainQuerySplit}&`:'/?'}/> 
              </div>
              )}
          </div>
          <Sidebar />
        </div>
      </div> 
    </>
  )
}
