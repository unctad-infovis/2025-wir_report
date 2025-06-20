import React, {
/* useRef, useState, useEffect, useCallback, useMemo */
} from 'react';

import PropTypes from 'prop-types';

import ShareContainer from './ShareContainer.jsx';

function App(props) {
  const { chapterTitles, downloadDocument, scrollTo } = props;
  return (
    <div className="header_container">
      <div className="content_top">
        <h2>
          <div className="name">World Investment Report</div>
          <div className="year">
            20
            <span>25</span>
          </div>
        </h2>
      </div>
      <div className="between" />
      <div className="content_bottom">
        <h2>
          International investment in the digital economy
          <div className="share_wrapper"><ShareContainer url={window.location.href} /></div>
        </h2>
        <div className="download_buttons_container">
          <a href="https://unctad.org/system/files/official-document/wir2025_overview_en.pdf" target="_blank" onClick={(event) => downloadDocument(event)} type="button" aria-label="Download Overview" className="overview" rel="noreferrer">Overview</a>
          <a href="https://unctad.org/system/files/official-document/wir2025_en.pdf" target="_blank" onClick={(event) => downloadDocument(event)} type="button" aria-label="Download Full Report" className="pdf_download" rel="noreferrer">Full report</a>
          <button type="button" className="video" onClick={() => scrollTo('.anchor_videos', 'Videos')}>Video</button>
          <button type="button" className="podcast" onClick={() => scrollTo('.anchor_podcasts', 'Podcasts')}>Podcast</button>
          <button type="button" className="press" onClick={() => scrollTo('.anchor_press', 'Press')}>Press</button>
          <a href="https://unctad.org/topic/investment/world-investment-report" target="_blank" type="button" aria-label="Regional and country data" className="regional" rel="noreferrer">Regional data</a>
          <button type="button" className="fdi_explorer" onClick={() => scrollTo('.anchor_fdi_explorer', 'FDI Explorer')}>FDI explorer</button>
        </div>
        <div className="chapters_navigation_container">
          {
            chapterTitles.map((chapter_title, i) => (
              <button onClick={() => scrollTo(`.chapter_header_${i + 1}`, `Chapter ${i + 1}`)} type="button" key={chapter_title}>
                <div className="chapter_navigation">
                  <div className="chapter_title"><h2>{chapter_title}</h2></div>
                  <div className="chapter_image"><div className={`chapter_image_${i + 1}`} /></div>
                  <div className="chapter_meta">
                    <div className="chapter_number">
                      {i + 1}
                      .
                    </div>
                    {
                      i < 4 && <a href={`https://unctad.org/system/files/official-document/wir2025_ch0${i + 1}_en.pdf`} target="_blank" onClick={(event) => downloadDocument(event)} className="chapter_download_button" aria-label={`Download Chapter ${i + 1}`} rel="noreferrer" />
                    }

                  </div>
                </div>
              </button>
            ))
          }
        </div>
      </div>
    </div>
  );
}

App.propTypes = {
  chapterTitles: PropTypes.instanceOf(Array).isRequired,
  downloadDocument: PropTypes.func.isRequired,
  scrollTo: PropTypes.func.isRequired
};

export default App;
