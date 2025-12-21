'use client';
import React, { useState, useEffect, useRef } from 'react';
import { loadECharts } from '@/lib/echarts';
import { observeOnce } from '@/lib/observeOnce';
import ScrollFloat from '@/components/motion/ScrollFloat';

const Grouping = () => {
  const [currentYear, setCurrentYear] = useState(2008);

  const videosChartRef = useRef<HTMLDivElement>(null);
  const orientationChartRef = useRef<HTMLDivElement>(null);
  const videoShareChartRef = useRef<HTMLDivElement>(null);
  const subChartRef = useRef<HTMLDivElement>(null);
  const mainPieChartRef = useRef<HTMLDivElement>(null);

  // Videos Chart (fisheye)
  useEffect(() => {
    let disposed = false;
    let resizeListener: (() => void) | null = null;
    let myChart: any = null;
    const node = videosChartRef.current;
    if (!node) return;

    const unobserve = observeOnce(node, () => {
      void loadECharts().then((echarts) => {
        if (disposed) return;

        myChart = echarts.init(node);

        fetch('/data/videos-per-month.json')
          .then(r => r.json())
          .then(raw => {
            if (disposed) return;

            const seriesData = raw
              .map((d: any) => [d.date, d.count])
              .sort((a: any, b: any) => new Date(a[0]).getTime() - new Date(b[0]).getTime());

            const option = {
              title: {
                text: 'News & Politics videos posted on YouTube during the covered period',
                left: 'center',
                textStyle: { fontSize: 20 },
              },
              tooltip: { trigger: 'axis' },
              grid: { top: 120, bottom: 80, left: 60, right: 60 },
              xAxis: [{ type: 'time', splitLine: { show: false } }],
              yAxis: [{ type: 'value', axisTick: { show: true } }],
              series: [{
                type: 'line',
                name: 'Videos per month',
                symbol: 'circle',
                showSymbol: false,
                symbolSize: 5,
                data: seriesData
              }]
            };
            myChart.setOption(option);
          });

        resizeListener = () => myChart.resize();
        window.addEventListener('resize', resizeListener);
      });
    }, { threshold: 0.25 });

    return () => {
      disposed = true;
      unobserve();
      if (resizeListener) window.removeEventListener('resize', resizeListener);
      if (myChart) myChart.dispose();
    };
  }, []);

  // Political Orientation Chart
  useEffect(() => {
    let disposed = false;
    let resizeListener: (() => void) | null = null;
    let myChart: any = null;
    const node = orientationChartRef.current;
    if (!node) return;

    const unobserve = observeOnce(node, () => {
      void loadECharts().then((echarts) => {
        if (disposed) return;

        myChart = echarts.init(node);
        const option = {
          color: ['#CC0000', '#FF6B6B', '#808080', '#6495ED', '#4169E1'],
          title: {
            text: 'Political orientation of select US politics channels',
            subtext: 'Total Number of Channels: 57',
            left: 'center'
          },
          tooltip: { trigger: 'item', formatter: '{b}: {c}%' },
          legend: { orient: 'vertical', left: 'left' },
          series: [{
            name: 'Political Orientation', type: 'pie', radius: '50%',
            data: [
              { value: 26.3, name: 'Right' }, { value: 8.8, name: 'Lean Right' },
              { value: 31.6, name: 'Center' }, { value: 17.5, name: 'Lean Left' },
              { value: 15.8, name: 'Left' }
            ],
          }]
        };
        myChart.setOption(option);

        resizeListener = () => myChart.resize();
        window.addEventListener('resize', resizeListener);
      });
    }, { threshold: 0.25 });

    return () => {
      disposed = true;
      unobserve();
      if (resizeListener) window.removeEventListener('resize', resizeListener);
      if (myChart) myChart.dispose();
    };
  }, []);
  
  // Video Share Chart
  useEffect(() => {
    let disposed = false;
    let resizeListener: (() => void) | null = null;
    let myChart: any = null;
    const node = videoShareChartRef.current;
    if (!node) return;

    const unobserve = observeOnce(node, () => {
      void loadECharts().then((echarts) => {
        if (disposed) return;

        myChart = echarts.init(node);
        const option = {
          color: ['#CC0000', '#FF6B6B', '#808080', '#6495ED', '#4169E1'],
          title: {
            text: 'Video production share by political orientation',
            subtext: 'Total Number of Videos 908,909',
            left: 'center'
          },
          tooltip: { trigger: 'item', formatter: '{b}: {c}%' },
          legend: { orient: 'vertical', left: 'left' },
          series: [{
            name: 'Political Orientation', type: 'pie', radius: '50%',
            data: [
              { value: 10.1, name: 'Right' }, { value: 13.2, name: 'Lean Right' },
              { value: 46.3, name: 'Center' }, { value: 27.4, name: 'Lean Left' },
              { value: 3.0, name: 'Left' }
            ],
          }]
        };
        myChart.setOption(option);

        resizeListener = () => myChart.resize();
        window.addEventListener('resize', resizeListener);
      });
    }, { threshold: 0.25 });

    return () => {
      disposed = true;
      unobserve();
      if (resizeListener) window.removeEventListener('resize', resizeListener);
      if (myChart) myChart.dispose();
    };
  }, []);

  // Subscriber Share Chart
  useEffect(() => {
    let disposed = false;
    let resizeListener: (() => void) | null = null;
    let myChart: any = null;
    const node = subChartRef.current;
    if (!node) return;

    const unobserve = observeOnce(node, () => {
      void loadECharts().then((echarts) => {
        if (disposed) return;

        myChart = echarts.init(node);
        const option = {
          color: ['#CC0000', '#FF6B6B', '#808080', '#6495ED', '#4169E1'],
          title: {
            text: 'Number of subscriber share by political orientation',
            subtext: 'Total Number of Subscribers: 52,500,000',
            left: 'center'
          },
          tooltip: { trigger: 'item', formatter: '{b}: {c}%' },
          legend: { orient: 'vertical', left: 'left' },
          series: [{
            name: 'Political Orientation', type: 'pie', radius: '50%',
            data: [
              { value: 7.7, name: 'Right' }, { value: 13.4, name: 'Lean Right' },
              { value: 35.4, name: 'Center' }, { value: 26.2, name: 'Lean Left' },
              { value: 17.2, name: 'Left' }
            ],
          }]
        };
        myChart.setOption(option);

        resizeListener = () => myChart.resize();
        window.addEventListener('resize', resizeListener);
      });
    }, { threshold: 0.25 });

    return () => {
      disposed = true;
      unobserve();
      if (resizeListener) window.removeEventListener('resize', resizeListener);
      if (myChart) myChart.dispose();
    };
  }, []);

  // Main Election Year Pie Chart
  useEffect(() => {
    let disposed = false;
    let resizeListener: (() => void) | null = null;
    let mainPieChart: any = null;
    const node = mainPieChartRef.current;
    if (!node) return;

    const dataByYear = {
      2008: [
        { name: 'Right', value: 0 }, { name: 'Lean Right', value: 7.3 },
        { name: 'Center', value: 66.5 }, { name: 'Lean left', value: 26.2 },
        { name: 'Left', value: 0 }
      ],
      2012: [
        { name: 'Right', value: 0.4 }, { name: 'Lean Right', value: 5.7 },
        { name: 'Center', value: 85.5 }, { name: 'Lean left', value: 6.9 },
        { name: 'Left', value: 1 }
      ],
      2016: [
        { name: 'Right', value: 0.3 }, { name: 'Lean Right', value: 23.7 },
        { name: 'Center', value: 35.2 }, { name: 'Lean left', value: 19 },
        { name: 'Left', value: 21.7 }
      ]
    };

    const getSubtext = (year: number) => {
        if (year === 2008) return '328 videos';
        if (year === 2012) return '7,646 videos';
        return '56,519 videos';
    }

    const unobserve = observeOnce(node, () => {
      void loadECharts().then((echarts) => {
        if (disposed) return;

        mainPieChart = echarts.init(node);
        const option = {
          color: ['#CC0000', '#FF6B6B', '#808080', '#6495ED', '#4169E1'],
          title: {
            text: currentYear.toString(),
            subtext: getSubtext(currentYear),
            left: 'center'
          },
          tooltip: { trigger: 'item', formatter: '{b}: {d}%' },
          legend: { orient: 'vertical', left: 'left' },
          series: [{
            type: 'pie',
            radius: '55%',
            data: (dataByYear as any)[currentYear],
            label: { formatter: '{b}: {d}%' }
          }]
        };
        mainPieChart.setOption(option, true);

        resizeListener = () => mainPieChart.resize();
        window.addEventListener('resize', resizeListener);
      });
    }, { threshold: 0.25 });

    return () => {
      disposed = true;
      unobserve();
      if (resizeListener) window.removeEventListener('resize', resizeListener);
      if (mainPieChart) mainPieChart.dispose();
    };
  }, [currentYear]);

  return (
    <section id="grouping">
      <ScrollFloat
        animationDuration={1}
        ease="back.inOut(2)"
        scrollStart="center bottom+=50%"
        scrollEnd="bottom bottom-=40%"
        stagger={0.03}
      >
        Does YouTube act as a reliable barometer of genuine political interest?{" "}
      </ScrollFloat>
      <p>
        To understand the impact of digital media on democracy, we must first determine if YouTube is 
        simply an entertainment hub or if it has become a serious mirror of national political engagement. 
        In this section, we examine the <strong>growth of political content</strong> over the years and 
        analyze how the platform’s internal "communities" are structured.
          By mapping out the distribution of channels across the political spectrum—from 
          <span className="text-democrat" style={{fontWeight:'bold'}}>Left</span> to 
          <span className="text-republican" style={{fontWeight:'bold'}}>Right</span>—we aim to uncover 
          who holds the "share of voice" on the platform. Does the volume of videos and subscriber 
          counts align with real-world voter demographics, or does YouTube create its own 
          <strong>independent political reality</strong>?
      </p>
      <p>
        Looking at the evolution of videos in the <em>News &amp; Politics</em> category, we do not observe a regular
        four-year rhythm aligned with U.S. presidential elections. Instead, political video production follows a clear
        long-term growth trend, with a sharp acceleration after 2018. A few isolated peaks stand out and can be linked to
        major global events, such as the surge in early 2011 following the Fukushima nuclear disaster, which triggered
        widespread political debate well beyond Japan. This evolution also reshapes how attention should be interpreted:
        in the early years of YouTube, political videos were relatively rare, meaning that a single upload could carry
        significant weight, whereas in recent years each video competes within a much denser and more crowded political
        media landscape.
      </p>

      <div ref={videosChartRef} id="videos-chart" style={{ width: '100%', height: '500px', margin: '20px auto' }}></div>

      <p>
        The pie chart below shows the political orientation of the channels obtained from the external dataset us_bias.
        We can see that the distribution is fairly even with channels with a centered political orientation representing the largest part.
        This is to be expected as many channels are rather neutral or prefer to stay politically objective. We can see that the proportion of left-oriented vs right-oriented is very similar: 35.1% total on the right and 33.3% on the left.
        Interestingly, there are more Lean Left than Lean Right which suggests that the leftists are somewhat more moderate. The size of the dataset hinders us from drawing any conclusions as it is too small and not representative of all the channels in the News & Politics category.
      </p>
      <div ref={orientationChartRef} id="political_orientation-chart" style={{ width: '100%', height: '500px', margin: '20px auto' }}></div>

      <p>
        When comparing political orientations based on the number of videos posted throughout the period covered by the dataset, we see greater disparity. Nearly half of the videos are classified as neutral, while those on the left represent one-third of the total analysed, surpassing those on the right by 7.1%. This lead is significant given the large number of videos analysed.
      </p>
      <div ref={videoShareChartRef} id="video_share-chart" style={{ width: '100%', height: '500px', margin: '20px auto' }}></div>

      <p>Who is present on YouTube? We now compare political parties based on subscribers. The pie chart above once again shows an advantage for the Democrats. Indeed, 43.4% of subscribers to channels in the News & Politics category are classified as left-wing, while only 21.1% are right-wing.
        According to our analysis, there are therefore twice as many Democrats as Republicans in this category of channels.</p>
      <div ref={subChartRef} id="sub-chart" style={{ width: '100%', height: '500px', margin: '20px auto' }}></div>
      
      <div style={{textAlign: 'center'}}>
          <img src="/assets/img/happy_usa.gif"  
              style={{width: '50%', height: 'auto', maxHeight: '300px', margin: '40px 0'}} 
              alt="USA Celebration" />
      </div>

      <p>
        Let us now take a closer look at what happens during the elections covered by our dataset. Choose which election covered you would like to visualize :
      </p>

      <div style={{textAlign: 'center', marginBottom: '20px', marginTop: '20px'}}>
        <button onClick={() => setCurrentYear(2008)} style={{padding: '12px 24px', fontSize: '18px', cursor: 'pointer'}}>2008</button>
        <button onClick={() => setCurrentYear(2012)} style={{padding: '12px 24px', fontSize: '18px', cursor: 'pointer'}}>2012</button>
        <button onClick={() => setCurrentYear(2016)} style={{padding: '12px 24px', fontSize: '18px', cursor: 'pointer'}}>2016</button>
      </div>

      <div ref={mainPieChartRef} id="main" style={{ width: '100%', height: '500px', margin: '20px auto' }}></div>
      
      <p>
        Firstly, there is a significant difference between the distribution of political leanings in these three elections. Indeed, the 2016 elections show a much more varied landscape than the two previous elections, as if YouTube had been a turning point since the 2016 campaign, thus showing a particular interest in the platform. This growing interest is also illustrated by the number of videos posted during these election periods. This number increased tenfold between each election.
        In terms of distribution, the Democratic trend seen so far is once again demonstrated here, with this party leading in all three elections. This lead is particularly marked in 2008 (26.2% vs 7.3%) and in 2016 (40.7% vs 24%). One important question remains: How does this fit with the presidential election results ?
      </p>

      <p>
        On the 4th of November 2008, Barack Obama was elected as president, running as the candidate for the Democratic Party.
        He won by a margin of 7% (popular vote) which is not small and shows the increased popularity of Democrats.
        The distribution of the published videos’ political orientations does show a greater proportion of Leftist (Democrat) videos with respect to the Lean Right.
        However, the center, that is, videos with a more neutral voice, hold by far the greatest share of the videos, with more than two thirds.
        There are only 328 videos published in more than a year and a half for this graph which is a small sample size and therefore the conclusions cannot be final or considered representative of how Youtube is today with that amount of videos being published in a split second.
      </p>
      <div style={{textAlign: 'center'}}>
          <img src="/assets/img/obama_basketball.jpg"  
              style={{width: 'auto', height: '300px', margin: '40px 0', borderRadius: '8px'}} 
              alt="Obama" />
      </div>
      <p>
        In 2012, Obama was once again elected president and won by a smaller margin with respect to 2008 (4% in the popular vote).
        The “center” portion is by and large the biggest with a fairly even split between the two ends of the political spectrum in the remaining share which echoes the real results.
        However, once again, the share of videos is still quite small and therefore a greater sample size would be needed to confirm these observations.
        Moreover, the number of videos only shows presence of channel subscribing to a certain political orientation and not the activity of the viewers (which would represent the voting population)
      </p>

      <p>
        In 2016, Donald Trump, a Republican, was elected president by the American people.
        However, the popular vote actually went to Hillary Clinton by nearly 3 million votes (2%) so the results were extremely close.
        These elections are known for how polarized they were and how split the public opinion was.
        This is reflected in the pie chart where we see the lowest share of neutral “center” videos and a greater proportion of the other videos.
        The “Left” and “Lean left” is the greatest part of the pie chart, disproportionately so, as the election was a lot closer.
        This shows that the democrats were particularly active on Youtube during the elections. This is only one of the social medium used as a platform to spread their message and only one of many possible campaigning strategies.
      </p>
      <div style={{textAlign: 'center'}}>
          <img src="/assets/img/trump_dance.gif"  
              style={{maxWidth: '50%', height: 'auto', margin: '40px 0', objectFit: 'contain'}} 
              alt="Trump" />
      </div>

      <p>
        We have now seen who are the political actors on Youtube and the political orientations they express.
        We looked at their following and their activity especially during election period which allows us to get a picture of what the relationship between Youtube and U.S Politics looks like.
        This picture is more of a snapshot as the number of channels used is only a small fraction of the total number of channels in the News & Politics category but we believe it is fairly representative as it shows the most important channels.
        However, it will be useful for us in order to set the scene and compare it with the activity of the viewers.
      </p>
    </section>
  );
};

export default Grouping;
