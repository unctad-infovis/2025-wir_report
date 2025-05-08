import React, { /* useState, */useEffect, useRef, useCallback } from 'react';
import '../styles/styles.less';

// https://www.npmjs.com/package/react-is-visible
import 'intersection-observer';
import { useIsVisible } from 'react-is-visible';

import scrollIntoView from 'scroll-into-view';

import Header from './components/Header.jsx';
import ChapterHeader from './components/ChapterHeader.jsx';
import ParallaxImage from './components/ParallaxImage.jsx';

function App() {
  const appRef = useRef();
  const overviewRef = useRef();
  const chaptersContainerRef = useRef();
  const chapter1Ref = useRef();

  const analytics = window.gtag || undefined;
  const track = useCallback((label_event = false, value_event = false) => {
    if (typeof analytics !== 'undefined' && label_event !== false && value_event !== false) {
      analytics('event', 'project_interaction', {
        label: label_event,
        project_name: '2025-tir_report',
        transport_type: 'beacon',
        value: value_event
      });
    }
  }, [analytics]);

  const seenChapter = useCallback((chapter) => {
    track('Scroll', chapter);
  }, [track]);

  const isVisibleChapterOverview = useIsVisible(overviewRef);

  useEffect(() => {
    const paragraphs = document.querySelectorAll('.text_content p, .text_content ul, .text_content h3, .text_content blockquote');

    // Options for the observer (when the p tag is 50% in the viewport)
    const options = {
      threshold: 0.5, // Trigger when 50% of the paragraph is visible
    };

    // Callback function for when the intersection occurs
    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
        // Add the visible class when the element is in view
          entry.target.classList.add('visible');
        }
      });
    };

    // Create an IntersectionObserver instance with the callback and options
    const observer = new IntersectionObserver(observerCallback, options);

    // Observe each paragraph
    paragraphs.forEach(p => observer.observe(p));
    setTimeout(() => {
      window.dispatchEvent(new Event('scroll'));
    }, 500); // A short delay ensures the DOM is ready
  }, []);

  const chapterTitles = ['Chapter 1 title', 'Chapter 2 title', 'Chapter 3 title', 'Chapter 4 title', 'Chapter 5 title'];

  const downloadDocument = (event) => {
    track('Anchor', `${event.currentTarget.href}`);
    event.stopPropagation();
  };

  const scrollTo = useCallback((target, name) => {
    track('Button', name);
    if (target.includes('anchor_')) {
      setTimeout(() => {
        scrollIntoView(document.querySelector(target), {
          align: {
            left: 0,
            leftOffset: 0,
            lockX: false,
            lockY: false,
            top: 0,
            topOffset: 30
          },
          cancellable: false,
          time: 1000
        });
      }, 50);
    } else {
      setTimeout(() => {
        scrollIntoView(appRef.current.querySelector(target), {
          align: {
            left: 0,
            leftOffset: 0,
            lockX: false,
            lockY: false,
            top: 0,
            topOffset: 30
          },
          cancellable: false,
          time: 1000
        });
      }, 50);
    }
  }, [track]);

  useEffect(() => {
    if (!overviewRef.current.classList.contains('seen') && isVisibleChapterOverview) {
      overviewRef.current.classList.add('seen');
      seenChapter('Overview');
    }
  }, [overviewRef, seenChapter, isVisibleChapterOverview]);

  useEffect(() => {

  }, []);

  return (
    <div className="app" ref={appRef}>
      <Header downloadDocument={downloadDocument} scrollTo={scrollTo} chapterTitles={chapterTitles} />
      { /* Overview */}
      <div className="content_container" ref={overviewRef}>
        <div className="text_container">
          <div className="text_content">
            <h3>Bacon ipsum dolor amet cupim chicken corned beef shoulder, venison t-bone salami filet mignon boudin pastrami. Doner shoulder pork beef ribs, tongue andouille fatback picanha boudin. Meatball fatback pork loin pig, pork chop burgdoggen landjaeger frankfurter. </h3>
            <p>Short ribs corned beef sausage, prosciutto jerky boudin meatball ground round jowl capicola frankfurter shankle tongue kevin. Chuck jowl leberkas sausage burgdoggen pancetta. Sirloin frankfurter t-bone tri-tip tongue. Prosciutto turducken porchetta, bresaola rump corned beef frankfurter meatloaf chicken tongue hamburger meatball doner.</p>
            <p>Landjaeger prosciutto flank rump strip steak fatback. Pork loin brisket pancetta boudin turkey tri-tip pork belly meatball ground round. Short loin capicola pork belly, turkey fatback shankle pork loin shank drumstick frankfurter chuck biltong ham landjaeger jowl.</p>
            <p>Drumstick flank spare ribs alcatra rump pork beef. Pork spare ribs alcatra short loin. Landjaeger ham jowl tail, venison shoulder leberkas pancetta andouille beef ribs swine picanha.</p>
            <p>Frankfurter ham hock rump, sirloin chicken salami tongue beef shankle pork chop biltong:</p>
            <ul>
              <li className="oneliner"><strong>Bacon</strong></li>
              <li className="oneliner"><strong>Meat</strong></li>
              <li className="oneliner"><strong>Ribs</strong></li>
            </ul>
            <blockquote>
              <div className="quote">Boudin turkey t-bone, sirloin venison shankle pork loin burgdoggen ground round. Strip steak beef brisket fatback drumstick t-bone pork loin shank capicola venison rump.</div>
              <div className="author">
                <span className="name">Rebeca Grynspan</span>
                <span className="title">Secretary-General of UN Trade and Development (UNCTAD)</span>
              </div>
            </blockquote>
          </div>
        </div>
      </div>

      <div className="chapters_container" ref={chaptersContainerRef}>
        <div className="content_container chapter_header_1" ref={chapter1Ref}>
          <div className="text_container">
            <ChapterHeader chapter_number="1" title="AI at the technology frontier" />
            <div className="download_buttons_container">
              <a href="https://unctad.org/system/files/official-document/tir2025ch1_en.pdf" target="_blank" onClick={(event) => downloadDocument(event)} type="button" className="pdf_download" aria-label="Download Chapter 1" rel="noreferrer">Download</a>
            </div>
            <div className="media_container"><div className="image_container"><ParallaxImage src="assets/img/l/_image_01_.jpg" /></div></div>
            <div className="text_content">
              <h3>Breakthroughs in AI are reshaping all industries – from content creation and product design to automated coding and customer service.</h3>
              <p>But AI development is highly concentrated. Just 100 companies funded 40% of research and development (R&D) in 2022. None of them are based in developing countries except China. The United States and China account for about 33% of AI publications and 60% of AI patents.</p>
              <p>This imbalance is also seen in AI infrastructure. AI needs more than electricity and the internet. It requires computing power, servers and data centres.</p>
              <p>The US holds one third of the top supercomputers and over half the world’s computing power. Most supercomputers and data centres are in developed countries.</p>
              <p>Skills are also key – from data literacy to expert-level AI knowledge. But these skills are unevenly distributed.</p>
            </div>
          </div>
        </div>
      </div>
      <noscript>Your browser does not support JavaScript!</noscript>
    </div>
  );
}

export default App;
