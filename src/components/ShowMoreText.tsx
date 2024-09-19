import { useState } from 'react';

const ShowMoreText = ({ text, limit = 100 }) => {
  const [showMore, setShowMore] = useState(false);

  const toggleShowMore = () => {
    setShowMore(!showMore);
  };

  return (
    <div>
      <p>
        {showMore ? text : `${text.substring(0, limit)}...`}
      </p>
      <button onClick={toggleShowMore}>
        {showMore ? 'Show Less' : 'Show More'}
      </button>
    </div>
  );
};

export default ShowMoreText;