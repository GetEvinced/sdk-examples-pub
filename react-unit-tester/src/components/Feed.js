import React, { useState, useEffect } from "react";

const Feed = ({ feedUrl }) => {
  const [feedItems, setFeedItems] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const response = await fetch(feedUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch feed: ${response.statusText}`);
        }
        const data = await response.json();
        setFeedItems(data.items || []);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchFeed();
  }, [feedUrl]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Feed</h2>
      <ul>
        {feedItems.map((item, index) => (
          <li key={index}>
            <a href={item.link} target="_blank" rel="noopener noreferrer">
              {item.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Feed;
