import React, { useEffect, useRef, useState } from 'react';

import PropTypes from 'prop-types';

function ChapterHeader(props) {
  const { chapter_number, title } = props;
  const headerRef = useRef(null);
  const [scrollPercentage, setScrollPercentage] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!headerRef.current) return;

      const rect = headerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      const triggerPoint = windowHeight * 0.5;

      const visibility = Math.min(Math.max((windowHeight - rect.top) / (windowHeight - triggerPoint), 0), 1);

      setScrollPercentage(visibility);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div ref={headerRef} className="chapter_header">
      <div className="" style={{ opacity: scrollPercentage, transform: `translateX(${-(1 - scrollPercentage) * 30}%)` }}>
        <h2>
          <div className="chapter">
            Chapter
            {' '}
            {chapter_number}
          </div>
          <div>
            {title}
          </div>
        </h2>
      </div>
    </div>
  );
}

ChapterHeader.propTypes = {
  chapter_number: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired
};

export default ChapterHeader;
