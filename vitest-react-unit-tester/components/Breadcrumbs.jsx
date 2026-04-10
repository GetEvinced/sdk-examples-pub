import React from "react";

export const Breadcrumbs = ({ source, items }) => {
  return (
    <nav data-testid="breadcrumbs" aria-label="breadcrumb">
      <ol>
        {items.map((item, index) => {
          const isLastItem = index === items.length - 1;
          return (
            <li key={index}>
              {isLastItem ? (
                <span aria-current="page">{item.text}</span> // Current page
              ) : (
                <a href={item.linkProps.toPage}>{item.text}</a>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
