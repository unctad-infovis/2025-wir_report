import React, {
  useState, useEffect, useRef, useCallback
} from 'react';
import '../styles/styles.less';

// https://www.npmjs.com/package/react-is-visible
import 'intersection-observer';
import { useIsVisible } from 'react-is-visible';

import scrollIntoView from 'scroll-into-view';

import Header from './components/Header.jsx';
import DwChartContainer from './components/DwChartContainer.jsx';
import ChapterHeader from './components/ChapterHeader.jsx';
import ParallaxImage from './components/ParallaxImage.jsx';
import ScrollingText from './components/ScrollingText.jsx';
import FDIExplorer from './components/FDIExplorer.jsx';

function App() {
  const appRef = useRef();
  const overviewRef = useRef();
  const chaptersContainerRef = useRef();
  const chapter1Ref = useRef();
  const chapter2Ref = useRef();
  const chapter3Ref = useRef();
  const chapter4Ref = useRef();
  const chapter5Ref = useRef();

  const [offset, setOffset] = useState(false);

  useEffect(() => {
    const onScroll = () => setOffset(window.pageYOffset);
    window.removeEventListener('scroll', onScroll);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const [sectionProgress, setSectionProgress] = useState(0);

  useEffect(() => {
    const windowHeight = 0;
    setSectionProgress((offset > chaptersContainerRef.current.offsetTop - windowHeight) ? (Math.min(((offset - (chaptersContainerRef.current.offsetTop - windowHeight)) / chaptersContainerRef.current.offsetHeight) * 100, 100)) : 0);
  }, [offset]);

  const fixedSectionRefFigureFDIExplorer = useRef();
  const chartFigureFDIExplorer = useRef(null);
  const [positionFigureFDIExplorer, setPositionFigureFDIExplorer] = useState('');
  const handleScrollFigure03 = useCallback(() => {
    if (!fixedSectionRefFigureFDIExplorer.current) return;

    // 3 screens.
    fixedSectionRefFigureFDIExplorer.current.style.height = `${3 * 130 + 80}vh`;

    const { scrollY, innerHeight } = window;
    let { top } = fixedSectionRefFigureFDIExplorer.current.getBoundingClientRect();
    top += scrollY;
    const { height } = fixedSectionRefFigureFDIExplorer.current.getBoundingClientRect();
    const fixedBottom = top + height - innerHeight;
    const relativeScroll = scrollY - top;

    // Determine position state
    setPositionFigureFDIExplorer((scrollY < top) ? 'absolute_top' : (scrollY < fixedBottom) ? 'fixed' : 'absolute_bottom');

    if (!chartFigureFDIExplorer.current) return;

    // Define switch points
    const switchPoints = [innerHeight * 0.3 + innerHeight * 0.8, innerHeight * 1.6 + innerHeight * 0.8, innerHeight * 2.9 + innerHeight * 0.8];

    const newState = {
      isAbove1: relativeScroll < switchPoints[0],
      isAbove2: relativeScroll < switchPoints[1],
      isAbove3: relativeScroll < switchPoints[2],
    };
    if (newState.isAbove2) {
      fixedSectionRefFigureFDIExplorer.current.querySelector('.fixed-background .overlay').style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
      fixedSectionRefFigureFDIExplorer.current.querySelector('.fixed-background .overlay').style.pointerEvents = 'auto';
      fixedSectionRefFigureFDIExplorer.current.querySelector('.scroll-elements').style.pointerEvents = 'auto';
    } else {
      fixedSectionRefFigureFDIExplorer.current.querySelector('.fixed-background .overlay').style.backgroundColor = 'rgba(0, 0, 0, 0)';
      fixedSectionRefFigureFDIExplorer.current.querySelector('.fixed-background .overlay').style.pointerEvents = 'none';
      fixedSectionRefFigureFDIExplorer.current.querySelector('.scroll-elements').style.pointerEvents = 'none';
    }

    chartFigureFDIExplorer.current.redraw();
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScrollFigure03);
    return () => window.removeEventListener('scroll', handleScrollFigure03);
  }, [handleScrollFigure03]);

  const analytics = window.gtag || undefined;
  const track = useCallback((label_event = false, value_event = false) => {
    if (typeof analytics !== 'undefined' && label_event !== false && value_event !== false) {
      analytics('event', 'project_interaction', {
        label: label_event,
        project_name: '2025-wir_report',
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
    const paragraphs = appRef.current.querySelectorAll('.text_content p, .text_content ul, .text_content ol, .text_content h3, .text_content blockquote');

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

  const chapterTitles = ['International investment trends', 'Investment policy trends', 'Sustainable finance trends', 'International investment in the digital economy', 'The way forward'];

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
            <h3>Global foreign direct investment (FDI) rose 4% in 2024 to $1.5 trillion, but the headline figure is misleading and masks deep underlying weaknesses</h3>
            <p>Growth was inflated by volatile financial flows through several European conduit economies, often used as intermediaries in global tax and investment chains. Excluding these, global FDI fell 11% – the third straight year of decline.</p>
            <p>This year’s World Investment Report warns that investment is slowing, risks are rising, and uncertainty is reshaping the investment landscape. Trade tensions, policy fragmentation and economic volatility are squeezing capital flows, eroding investor confidence and dimming long-term development prospects.</p>
            <p>The report calls for bold, coordinated action to redirect investment towards sustainable and inclusive development – with a sharp focus on bridging divides in digital, infrastructure and sustainable finance.</p>
            <blockquote>
              <div className="quote">Global investment must not only grow but also shift towards the sectors and countries that need it most.</div>
              <div className="author">
                <span className="name">Rebeca Grynspan</span>
                <span className="title">Secretary-General of UN Trade and Development (UNCTAD)</span>
              </div>
            </blockquote>
          </div>
        </div>
      </div>
      <div className="chapters_container" ref={chaptersContainerRef}>
        <div className="progress_indicator_container">
          <div className="section">
            <div className="progress_bar" style={{ width: `${sectionProgress}%` }} />
          </div>
        </div>
        <div className="backtotop_container">
          <button type="button" onClick={() => scrollTo('.header_container', 'Top')}>Back to top</button>
        </div>
        <ScrollingText texts={['Where is investment going?', 'Which regions and sectors are being left behind?']} chapter_text="Chapter 1" />
        <div className="content_container chapter_header_1" ref={chapter1Ref}>
          <div className="text_container">
            <ChapterHeader chapter_number="1" title="Investment trends" subtitle="Global flows remain weak and unbalanced" />
            <div className="download_buttons_container">
              <a href="https://unctad.org/system/files/official-document/wir2025ch1_en.pdf" target="_blank" onClick={(event) => downloadDocument(event)} type="button" className="pdf_download" aria-label="Download Chapter 1" rel="noreferrer">Download</a>
            </div>
            <div className="media_container"><div className="image_container"><ParallaxImage src="assets/img/2025wir-chapter1.jpg" /></div></div>
            <div className="text_content">
              <h3>Despite the headline rise in FDI in 2024, the real story is one of declining flows and growing imbalances</h3>
              <p>High borrowing costs and exchange rate volatility continue to deter long-term infrastructure investment, especially in the least developed countries.</p>
              <p>And multinationals are restructuring supply chains towards South-East Asia, Eastern Europe and Central America – a shift that began during the pandemic and is accelerating.</p>
              <h3>Regional trends reveal sharp divides</h3>
            </div>
            <div className="text_content">
              <h3>FDI to developed economies fell by 22%</h3>
              <p>
                <strong>Europe</strong>
                {' '}
                was hit hardest, with inflows down 58% in 2024. In Germany, the region’s largest economy, FDI sank 90%.
              </p>
              <p>
                <strong>North America</strong>
                {' '}
                saw a 23% rise, driven by a wave of semiconductor megaprojects in the United States, where FDI rose 20%.
              </p>
            </div>
            <div className="charts_container">
              <DwChartContainer chart_id="7SCTO" />
            </div>
            <div className="text_content">
              <p>
                <strong>Africa</strong>
                {' '}
                saw a record 75% rise in FDI, driven by a mega infrastructure project in Egypt. Excluding that, flows still grew 12%, supported by investment reforms and improved facilitation across the continent.
              </p>
            </div>
            <div className="charts_container">
              <DwChartContainer chart_id="PhbtO" />
            </div>
            <div className="text_content">
              <p>
                <strong>Asia</strong>
                {' '}
                remained the top recipient region, despite a 3% overall decline and a 29% drop in flows to China. South-East Asia stood out, with ASEAN countries up 10%, reaching a record $225 billion in FDI. India saw strong momentum in greenfield investment, even as total inflows dipped slightly.
              </p>
            </div>
            <div className="charts_container">
              <DwChartContainer chart_id="2Ot0l" />
            </div>
            <div className="text_content">
              <p>
                <strong>Latin America and the Caribbean</strong>
                {' '}
                saw a 12% drop in FDI. But new greenfield projects in Argentina, Brazil and Mexico signalled renewed investor interest and growing momentum in productive sectors.
              </p>
            </div>
            <div className="charts_container">
              <DwChartContainer chart_id="gkdFh" />
            </div>
            <div className="text_content">
              <p>
                <strong>The Middle East</strong>
                {' '}
                continued to see strong inflows, especially in the Gulf, thanks to diversification efforts and investment in non-oil sectors.
              </p>
              <p>
                <strong>Vulnerable economies</strong>
                {' '}
                saw modest gains. FDI to least developed countries rose 9% to $37 billion – just 2% of global flows. Landlocked nations saw a 10% drop, while small island developing states posted 14% growth. In all three groups, FDI remains concentrated among a few countries.
              </p>
              <div className="charts_container">
                <DwChartContainer chart_id="5EGiF" />
              </div>
              <h3>Who are the top global players?</h3>
              <p>The leading destinations for FDI were the US, Singapore, Hong Kong (China), China, Luxembourg, Canada, Brazil, Australia, Egypt and the United Arab Emirates.</p>
              <p>The top sources of outbound investment were the US, Japan, China, Luxembourg, Hong Kong (China), Canada, Singapore, the Netherlands, Spain and the Republic of Korea.</p>
              <h3>What’s happening across sectors and industries?</h3>
            </div>
            <div className="text_content">
              <p>
                <strong>Greenfield investments</strong>
                {' '}
                – where companies build new facilities abroad – rose in number but fell 5% in value. Still, total announced investment remained historically high at $1.3 trillion.
              </p>
              <p>
                <strong>Cross-border mergers and acquisitions (M&As)</strong>
                {' '}
                rose 14% to $443 billion, but the number of deals dropped to the lowest levels since the global financial crisis. Deals are increasingly shifting to regional markets amid tighter regulations and geopolitical tensions.
              </p>
              <p>
                <strong>International project finance</strong>
                {' '}
                – a key source of funding for infrastructure – dropped 26%, continuing a multi-year slump. Least developed countries were hit hardest.
              </p>
            </div>
            <div className="charts_container">
              <DwChartContainer chart_id="Qdpjt" />
              <DwChartContainer chart_id="cjpMS" />
            </div>
            <div className="text_content">
              <p>
                <strong>Sectors critical to the Sustainable Development Goals suffered.</strong>
                {' '}
                Investment in infrastructure fell 35%, renewable energy 31%, water and sanitation 30%, and agrifood systems 19%. Only the health sector saw growth. Projects rose by about one fifth in number and value, but total volumes remained small – under $15 billion.
              </p>
            </div>
            <div className="charts_container">
              <DwChartContainer chart_id="DSjzJ" />
              <DwChartContainer chart_id="S1J7B" />
            </div>
          </div>
        </div>
        <div ref={fixedSectionRefFigureFDIExplorer} className="fixed-section">
          <div className={`fixed-background ${positionFigureFDIExplorer}`}>
            <div className="overlay" />
            <div className="scroll-indicator"><div className="arrow" /></div>
            <div className="chart_container_full">
              <FDIExplorer ref={chartFigureFDIExplorer} />
            </div>
          </div>
          <div className="scroll-elements">
            <div className="scroll-content">
              <div>
                <p>
                  This chart allows you to explore the foreign direct investments
                </p>
              </div>
            </div>
            <div className="scroll-content">
              <div>
                <p>
                  Choose a region or economy of interest and compare.
                </p>
              </div>
            </div>
          </div>
        </div>
        <ScrollingText texts={['What are governments doing to attract or control investment?']} chapter_text="Chapter 2" />
        <div className="content_container chapter_header_2" ref={chapter2Ref}>
          <div className="text_container">
            <ChapterHeader chapter_number="2" title="Investment policy trends" subtitle="Incentives rise, but so do restrictions" />
            <div className="download_buttons_container">
              <a href="https://unctad.org/system/files/official-document/wir2025ch2_en.pdf" target="_blank" onClick={(event) => downloadDocument(event)} type="button" className="pdf_download" aria-label="Download Chapter 2" rel="noreferrer">Download</a>
            </div>
            <div className="media_container"><div className="image_container"><ParallaxImage src="assets/img/2025wir-chapter2.jpg" /></div></div>
            <div className="text_content">
              <h3>In 2024, investment policymaking was pulled in two directions: the need to attract capital, and the pressure to protect national interests</h3>
              <p>Roughly 78% of new measures were labelled as pro-investment – especially in developing countries (89%).</p>
            </div>
            <div className="charts_container">
              <DwChartContainer chart_id="o7dOp" />
            </div>
            <div className="text_content">
              <p>
                <strong>Africa and Asia</strong>
                {' '}
                focused on investment facilitation, such as single windows and fast-track permitting, and liberalization like lifting foreign ownership caps and relaxing joint venture requirements.
              </p>
              <p>
                <strong>Latin America</strong>
                {' '}
                launched targeted promotion strategies, including in emerging sectors like green hydrogen.
              </p>
              <h3>Incentives dominate global investment policy</h3>
              <p>Incentives, including tax breaks, grants or subsidies and credit guarantees, are now the leading tool governments are using to steer capital where they want it. They accounted for 45% of all new pro-investment measures in 2024, especially in clean energy and industrial sectors.</p>
            </div>
            <div className="charts_container">
              <DwChartContainer chart_id="GiOon" />
            </div>
            <div className="charts_container">
              <DwChartContainer chart_id="plHRH" />
            </div>
            <div className="text_content">
              <h3>Meanwhile, restrictions tightened in strategic sectors – especially in developed economies</h3>
              <p>More than 40% of all restrictive measures were screening mechanisms, aimed at monitoring foreign investment in sensitive sectors like high-tech, digital and critical minerals.</p>
              <p>The America First Investment Policy adopted in February 2024 significantly expands the scope of screening – for both inward and outward investment flows.</p>
            </div>
            <div className="charts_container">
              <DwChartContainer chart_id="jRNrd" />
            </div>
            <div className="charts_container">
              <DwChartContainer chart_id="mJKCB" />
            </div>
          </div>
        </div>
        <ScrollingText texts={['Is sustainable finance delivering?']} chapter_text="Chapter 3" />
        <div className="content_container chapter_header_3" ref={chapter3Ref}>
          <div className="text_container">
            <ChapterHeader chapter_number="3" title="Sustainable finance trends" subtitle="Bonds grow, but trust and traction wane" />
            <div className="download_buttons_container">
              <a href="https://unctad.org/system/files/official-document/wir2025ch3_en.pdf" target="_blank" onClick={(event) => downloadDocument(event)} type="button" className="pdf_download" aria-label="Download Chapter 3" rel="noreferrer">Download</a>
            </div>
            <div className="media_container"><div className="image_container"><ParallaxImage src="assets/img/2025wir-chapter3.jpg" /></div></div>
            <div className="text_content">
              <h3>Sustainable finance gave mixed signals in 2024. Bond issuance topped a record $1 trillion – more than doubling its share to 11% of total global bond issuance. </h3>
              <p>Green bonds were up 14%, with energy the most targeted sector. But sustainability-linked bonds lost ground amid growing credibility concerns.</p>
            </div>
            <div className="charts_container">
              <DwChartContainer chart_id="vOIUX" />
            </div>
            <div className="charts_container">
              <DwChartContainer chart_id="dFFXQ" />
            </div>
            <div className="text_content">
              <p>The sustainable fund market reached $3.2 trillion. But inflows collapsed, and new launches declined amid rising regulatory pressures, weak returns and a growing backlash against environmental, social and governance (ESG) initiatives.</p>
            </div>
            <div className="charts_container">
              <DwChartContainer chart_id="lKbwb" />
            </div>
            <div className="charts_container">
              <DwChartContainer chart_id="dFDyM" />
            </div>
            <div className="text_content">
              <p>Carbon markets expanded, with voluntary markets rebounding to $1.4 billion. But integrity concerns and uneven pricing continue to undermine their impact, especially in developing economies. </p>
            </div>
            <div className="charts_container">
              <DwChartContainer chart_id="Z0O0o" />
            </div>
            <div className="text_content">
              <h3>Developing countries lead on policy but face implementation gaps</h3>
              <p>In 2024, developing countries accounted for 60% of new sustainable finance policy measures. Many introduced national strategies and carbon pricing frameworks. But limited capacity and regulatory tools hinder impact.</p>
              <p>Without stronger support, they risk being left behind.</p>
              <h3>What’s needed to scale up sustainable finance?</h3>
              <p>The report calls for:</p>
              <ul>
                <li>Blended finance and guarantees to unlock private capital.</li>
                <li>Cross-border cooperation to align standards and build trust.</li>
                <li>Targeted support for developing countries to link sustainable finance to long-term development goals.</li>
              </ul>
            </div>
          </div>
        </div>
        <ScrollingText texts={['Can international investment close the digital divide?']} chapter_text="Chapter 4" />
        <div className="content_container chapter_header_4" ref={chapter4Ref}>
          <div className="text_container">
            <ChapterHeader chapter_number="4" title="International investment in the digital economy" subtitle="Rapid growth, uneven gains" />
            <div className="download_buttons_container">
              <a href="https://unctad.org/system/files/official-document/wir2025ch4_en.pdf" target="_blank" onClick={(event) => downloadDocument(event)} type="button" className="pdf_download" aria-label="Download Chapter 4" rel="noreferrer">Download</a>
            </div>
            <div className="media_container"><div className="image_container"><ParallaxImage src="assets/img/2025wir-chapter4.jpg" /></div></div>
            <div className="text_content">
              <h3>The digital economy is growing faster than any other sector. In 2024, the sector got 8.3% of global FDI – up from X% in YEAR</h3>
              <p>Investment in the digital economy brings clear benefits: better infrastructure, skilled jobs, technology transfer and more dynamic innovation ecosystems.</p>
            </div>
            <div className="charts_container">
              <DwChartContainer chart_id="qD8sl" />
            </div>
            <div className="text_content">
              <p>Many low-income countries remain locked out. Infrastructure gaps, high investment risks and weak regulatory frameworks continue to deter capital.</p>
              <h3>But growth is uneven</h3>
              <p>FDI in the digital economy jumped 40% in 2024 and now accounts for nearly a third of all greenfield projects. But about 80% went to just 10 developing countries – most of them in Asia.</p>
            </div>
            <div className="charts_container">
              <DwChartContainer chart_id="f14Aw" />
            </div>
            <div className="charts_container">
              <DwChartContainer chart_id="ibV0J" />
            </div>
            <div className="text_content">
              <p>Over the past five years, developing countries received $531 billion in digital greenfield projects – just 30% of the global total. The US remains the top source, but South–South flows are catching up, led by Asian investors.</p>
            </div>
            <div className="charts_container">
              <DwChartContainer chart_id="b0Sqp" />
            </div>
            <div className="text_content">
              <p>And while investment in digital services in developing countries tripled to $37 billion between 2020 and 2024, core digital infrastructure remains severely underfunded. In 2024, just $15 billion went into ICT infrastructure – a fraction of the $61 billion needed annually to close the global digital divide.</p>
            </div>
            <div className="charts_container">
              <DwChartContainer chart_id="LnJ2y" />
            </div>
            <div className="charts_container">
              <DwChartContainer chart_id="OfhRD" />
            </div>
            <div className="charts_container">
              <DwChartContainer chart_id="goKbo" />
            </div>
            <div className="text_content">
              <p>Fintech is a key frontier, attracting rising investment in Asia and Latin America. Data centres are also expanding in middle-income economies. But least developed countries remain on the margins. In 2024, Africa saw only 18 fintech projects – compared to 206 in developing Asia – and claimed just 3% of total data centre investment.</p>
              <h3>Concerns are rising</h3>
              <p>The digital economy’s environmental footprint is growing, with rising energy use and e-waste.</p>
              <p>Another concern is that market dominance by a few firms – mostly headquartered in the US and China – stifles competition and crowds out local players.</p>

            </div>
            <div className="charts_container">
              <DwChartContainer chart_id="EW3PH" />
            </div>
            <div className="text_content">
              <p>Policy barriers are also holding back digital investment. Many developing countries restrict foreign ownership in core infrastructure, while developed economies are tightening FDI screening over national security concerns – with up to 60% of screened projects targeting digital sectors.</p>
            </div>
            <div className="charts_container">
              <DwChartContainer chart_id="v2kj5" />
            </div>
            <div className="text_content">
              <h3>Digital strategies are in place – but not the support systems</h3>
              <p>By 2024, most developing countries had national digital strategies — 86% overall and 80% of least developed countries, up from under half in 2017.</p>
              <p>But few are linked to broader industrial or development goals. And only 20% mention investment promotion agencies, which often lack the tools to target fast-moving digital sectors.</p>
            </div>
            <div className="charts_container">
              <DwChartContainer chart_id="RYZmH" />
            </div>
            <div className="text_content">
              <p>Key regulations also lag. Data governance, intellectual property protection and competition policy – top concerns for investors – remain underdeveloped, especially in least developed countries.</p>
              <h3>What’s needed to build a more inclusive digital economy?</h3>
              <p>The report calls for a global action agenda to align digital investment with development goals. This includes:</p>
              <ul>
                <li>Establishing a global measurement framework for digital FDI</li>
                <li>Developing a policy toolkit for developing country governments</li>
                <li>Advancing a multilateral dialogue on governance</li>
                <li>Identifying leapfrog opportunities for low-income economies</li>
                <li>Launching a global partnership for sustainable investment in digital infrastructure</li>
                <li>Enhancing digital skills and innovation ecosystems in developing countries</li>
                <li>Promoting responsible digital investment and mitigating risks</li>
              </ul>
            </div>
          </div>
        </div>
        <ScrollingText texts={['More investment isn’t enough – it must be better aligned']} chapter_text="The way forward" />
        <div className="content_container chapter_header_5" ref={chapter5Ref}>
          <div className="text_container">
            <ChapterHeader chapter_number="The way forward" title="Redirecting investment towards development" />
            <div className="download_buttons_container">
              <a href="https://unctad.org/system/files/official-document/wir2025ch1_en.pdf" target="_blank" onClick={(event) => downloadDocument(event)} type="button" className="pdf_download" aria-label="Download Chapter 1" rel="noreferrer">Download</a>
            </div>
            <div className="text_content">
              <p>The World Investment Report 2025 calls for a fundamental redirection of investment.</p>
              <p>Scaling up capital flows is essential – but so is steering them towards sustainable infrastructure, digital inclusion, renewable energy and productive sectors.</p>
              <p>With COP30 and the 4th International Conference on Financing for Development on the horizon, this is a critical moment.</p>
              <h3>The report sets out six priorities for action</h3>
              <ol>
                <li>
                  <strong>Reform the international financial system.</strong>
                  {' '}
                  Triple development bank lending through hybrid capital and rechannelled special drawing rights to close financing gaps and address systemic challenges.
                </li>
                <li>
                  <strong>Mobilize capital at scale.</strong>
                  {' '}
                  Strengthen multilateral cooperation to manage global risks and build a fairer, more balanced financial system.
                </li>
                <li>
                  <strong>Scale sustainable finance.</strong>
                  {' '}
                  Embed development goals into financial strategies, apply clear sustainability standards and prioritize long-term needs – especially in countries with the greatest shortfalls.
                </li>
                <li>
                  <strong>Close the digital investment divide.</strong>
                  {' '}
                  Expand digital infrastructure, support inclusive national strategies and build local skills and innovation capacity.
                </li>
                <li>
                  <strong>Reform investment policies.</strong>
                  {' '}
                  Align national investment strategies with sustainability goals – and steer capital towards digital, clean energy, infrastructure and productive sectors.
                </li>
                <li>
                  <strong>Improve global investment governance.</strong>
                  {' '}
                  Update international rules to protect public interests, ensure fair treatment for investors and preserve national policy space.
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
      <noscript>Your browser does not support JavaScript!</noscript>
    </div>
  );
}

export default App;
