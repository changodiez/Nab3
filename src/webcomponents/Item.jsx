import React from "react";

function Item({ title, link }) {
  return (
    <>
      <li onClick={() => window.appHistory.push(`/${link}`)}>
        <h2>{title}</h2>
      </li>
    </>
  );
}

export default Item;
