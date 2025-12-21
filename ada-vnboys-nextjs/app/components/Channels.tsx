'use client';
import React, { useEffect, useRef } from 'react';
import { loadECharts } from '@/lib/echarts';
import { observeOnce } from '@/lib/observeOnce';

const Channels = () => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let disposed = false;
    let resizeListener: (() => void) | null = null;
    let chart: any = null;
    const node = chartRef.current;
    if (!node) return;

    const unobserve = observeOnce(node, () => {
      void loadECharts().then((echarts) => {
        if (disposed) return;

        chart = echarts.init(node);
        const categories = [
          "News & Politics", "Nonprofits & Activism", "Travel & Events", "Education",
          "People & Blogs", "Science & Technology", "Gaming", "Autos & Vehicles",
          "Howto & Style", "Entertainment", "Film & Animation", "Sports",
          "Pets & Animals", "Comedy", "Music"
        ];
        const values = [
          42.3, 32.3, 28.2, 27.8, 20.9, 20.2, 19.2,
          18.1, 18.1, 18.0, 17.7, 16.7, 16.4, 15.4, 12.0
        ];

        const option = {
          title: { text: "Proportion of Political Content by Video Category", left: "center" },
          tooltip: {
            trigger: "axis",
            axisPointer: { type: "shadow" },
            formatter: (p: any) => `${p[0].name}<br/>${p[0].value}%`
          },
          grid: { left: 60, right: 40, bottom: 120, top: 80 },
          xAxis: { type: "category", data: categories, axisLabel: { rotate: 45, interval: 0 } },
          yAxis: { type: "value", name: "Videos containing political vocabulary (%)", min: 0, max: 100 },
          series: [{
            type: "bar",
            data: values,
            barWidth: "60%",
            label: { show: true, position: "top", formatter: (v: any) => `${v.value}%` }
          }]
        };
        chart.setOption(option);

        resizeListener = () => chart.resize();
        window.addEventListener("resize", resizeListener);
      });
    }, { threshold: 0.25 });

    return () => {
      disposed = true;
      unobserve();
      if (resizeListener) window.removeEventListener("resize", resizeListener);
      if (chart) chart.dispose();
    };
  }, []);


  return (
    <section id="channels">
      <div className="section-title">Data Presentation</div>

      <p>
        Before presenting our answers to all these questions, we must first define the boundaries of our arena.
        YouTube is vast and noisy, Top 10 respect moments in football and Minecraft music videos are fun but not what we need; isolating the signal of political discourse requires rigorous filtering. 
      </p>

      <div className="subsection-title">2.1 The Dataset: YouNiverse</div>
      <p>
        Our analysis relies on YouNiverse, a large-scale dataset of English-speaking YouTube metadata.
        This massive archive allows us to observe the platform's evolution during the critical years of
        2008, 2012, and 2016.
        The scale of the data is monumental, establishing the statistical significance of our observations:
      </p>

      <ul className="data-list">
        <li><strong>136,470 Channels:</strong> Filtered for English content, with a minimum of 10k subscribers to ensure relevance.</li>
        <li><strong>73 Million Videos:</strong> Spanning from 2005 to late 2019.</li>
        <li><strong>8.6 Billion Comments:</strong> Representing the voice of the "electorate" (users).</li>
        <li><strong>Metadata Richness:</strong> We utilize titles, tags, view counts, and upload dates to reconstruct the timeline of events.</li>
      </ul>

      <div className="subsection-title">2.2 The Filter: Defining "Political" Content</div>
      <p>
        One of the major challenges in this analysis was distinguishing a political video from the ocean
        of gaming, music, and vlog content. To detect political content, we needed a robust lexicon.
        Initial attempts to build a dictionary using political tracts and manifestos yielded poor results,
        often capturing generic terms unrelated to the specific vernacular of YouTube. Consequently, we
        leveraged Large Language Models (LLMs) to generate a massive, comprehensive vocabulary of political
        terminology, covering the spectrum from legislative terms to campaign slogans.
      </p>

      <div className="subsection-title">2.3 The Focus: Why "News &amp; Politics"?</div>
      <p>
        With our vocabulary in place, we mapped the distribution of political terms across YouTube's
        15 primary categories. Processing the descriptions of 73 million videos was computationally
        prohibitive, so we focused our signal detection on Video Titles and Tags. The goal was to identify
        which category serves as the true "battlefield" for political discourse.
      </p>

      <div ref={chartRef} id="political-bar-chart" style={{width: '100%', height: '600px'}}></div>

      <p>
        As shown in this chart, the category <strong>"News &amp; Politics"</strong> is the clear leader,
        with 42.3% of its videos containing political vocabulary. While "Nonprofits" and "Travel"
        show some density, they lack the volume and specific focus of the News category.
      </p>
    </section>
  );
};

export default Channels;
