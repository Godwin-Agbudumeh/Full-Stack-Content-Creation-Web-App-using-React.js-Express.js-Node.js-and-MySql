import React from 'react';
import { Link }from "react-router-dom";
import "./pagination.css"

export default function Pagination({iterator, endingLink, page, numberOfPages, toWhere}) {
    const pageNumbers = [];

    if(page > 1){
        pageNumbers.push("<<< prev");
    }

    if(page < numberOfPages){
        pageNumbers.push("next >>>");
    }

  return (
    <div className="pagination">
        {pageNumbers.map((number)=>{
            return (
            <Link to={number === "<<< prev" ? `${toWhere}page=${page-1}` : 
                    (number === "next >>>" ? `${toWhere}page=${page+1}` : `${toWhere}page=${number}`)} className="link">
                {number}
            </Link>
            )
        })}
    </div>
  )
}
