'use client';
import React, { useState } from 'react';
import LazyIframe from '@/components/media/LazyIframe';
import ScrollFloat from '@/components/motion/ScrollFloat';

const Pageviews = () => {
  const [currentYear, setCurrentYear] = useState(2019);
  const years = [2014, 2015, 2016, 2017, 2018, 2019];

  return (
    <section id="pageviews">
      <ScrollFloat
        animationDuration={1}
        ease="back.inOut(2)"
        scrollStart="center bottom+=50%"
        scrollEnd="bottom bottom-=40%"
        stagger={0.03}
      >
        Does the platform foster polarization or echo chambers?
      </ScrollFloat>

      <p>In an era of algorithm-driven content, there is a widespread concern that people are increasingly exposed only to viewpoints they already agree with, leading to more fragmented and polarized "echo chambers." This analysis seeks to empirically investigate this phenomenon on YouTube.</p>
      <p>We move beyond individual videos to identify large-scale "communities" of content defined by viewers themselves—by analyzing which videos are commented on by the same groups of people. This approach reveals the thematic and political contours of the YouTube landscape, showing which conversations are central, which are niche, and how much they interact.</p>

      <div style={{ textAlign: 'center', marginBottom: '10px' }}>
        {years.map(year => (
          <button key={year} onClick={() => setCurrentYear(year)} style={{padding: '12px 24px', fontSize: '18px', cursor: 'pointer'}}>
            {year}
          </button>
        ))}
      </div>

      <div id="rq2-content-wrapper">
        {years.map(year => (
          <div key={year} id={`rq2-${year}`} className="rq2-year-content" style={{ display: year === currentYear ? 'block' : 'none' }}>
            <h3 style={{ textAlign: 'center', fontSize: '1.5em', marginBottom: '20px' }}>Analysis for {year}</h3>

            <div className="analysis-item">
              <h4>Political Makeup of Communities</h4>
              <p>This chart provides a visual breakdown of the political leanings within each identified community. Each bar represents a community, and the colored segments show the proportion of videos from different political biases (Left, Center, Right). This allows us to see if a community is politically homogeneous (an echo chamber) or diverse.</p>
              <img src={`/assets/${year}/bias_composition_plot.png`} alt={`Political Bias Composition for ${year}`} style={{ width: '100%', maxWidth: '800px', display: 'block', margin: 'auto' }} />
            </div>

            <div className="analysis-item">
              <h4>Top Discussion Topics</h4>
              <p>This chart displays the top three most discussed themes for each community, such as "Economy & jobs" or "Foreign policy." It helps define the identity of each conversation bubble by showing what issues were most important to them during the year. Hover over the bars for more details.</p>
              <LazyIframe
                src={`/assets/${year}/top_themes_plot.html`}
                title="Top Discussion Topics"
                width="100%"
                height="500"
                style={{ border: '1px solid #ccc', margin: 'auto', display: 'block' }}
              />
            </div>

            <div className="analysis-item">
              <h4>Echo Chamber Diagnostics</h4>
              <p>This figure diagnoses the "echo chamber" phenomenon. The histogram on the left shows how many videos are "echo-prone" (seen by one community) versus "cross-audience" (seen by many). The bar chart on the right summarizes how many connections are within the same community versus across different communities, indicating how siloed the network is.</p>
              <img src={`/assets/${year}/echo_chamber_diagnostics.png`} alt={`Echo Chamber Diagnostics for ${year}`} style={{ width: '100%', maxWidth: '800px', display: 'block', margin: 'auto' }} />
            </div>
            
            <div className="analysis-item">
              <h4>Monthly Echo Chamber Trends</h4>
              <p>This plot shows how the echo chamber metrics evolved month-to-month throughout the year, revealing whether the platform became more or less polarized over time.</p>
              <img src={`/assets/${year}/echo_chamber_diagnostics_monthly.png`} alt={`Monthly Echo Chamber Diagnostics for ${year}`} style={{ width: '100%', maxWidth: '800px', display: 'block', margin: 'auto' }} />
            </div>

            <div className="analysis-item">
              <h4>Community Activity Over Time</h4>
              <p>This line chart tracks the monthly activity (number of comments) for each community. Each colored line represents a community, allowing us to see which conversation clusters grew in engagement and which faded in response to major news events throughout the year.</p>
              <LazyIframe
                src={`/assets/${year}/temporal_evolution_M_plot.html`}
                title="Community Activity Over Time"
                width="100%"
                height="500"
                style={{ border: '1px solid #ccc', margin: 'auto', display: 'block' }}
              />
            </div>

            <div className="analysis-item">
              <h4>What Defines a Community?</h4>
              <p>This plot shows which factors were most important for defining a community's identity and political leaning. Longer bars indicate more influential features, such as specific themes (e.g., "Immigration") or video properties (e.g., number of connections).</p>
              <img src={`/assets/${year}/logistic_feature_importance.png`} alt={`Feature Importance for ${year}`} style={{ width: '100%', maxWidth: '800px', display: 'block', margin: 'auto' }} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Pageviews;
