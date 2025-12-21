'use client';
import React, { useEffect, useRef } from 'react';
import { loadECharts } from '@/lib/echarts';
import { observeOnce } from '@/lib/observeOnce';
import ScrollFloat from '@/components/motion/ScrollFloat';

const Opinions = () => {
    const issuesChartRef = useRef<HTMLDivElement>(null);
    const wordChartRef = useRef<HTMLDivElement>(null);
    const tagsAreaChartRef = useRef<HTMLDivElement>(null);
    
    // Issues Chart
    useEffect(() => {
        let disposed = false;
        let resizeListener: (() => void) | null = null;
        let issuesChart: any = null;
        const node = issuesChartRef.current;
        if (!node) return;

        const unobserve = observeOnce(node, () => {
          void loadECharts().then((echarts) => {
            if (disposed) return;

            issuesChart = echarts.init(node);
      
            fetch('/data/pre-process-pools.json')
              .then(r => r.json())
              .then(rawData => {
                if (disposed) return;

                const categories = [...new Set(rawData.map((d: any) => d.Category))];
                const adaptedData = rawData.map((d: any) => [d.share, d.poll_date, d.Category, d.Category]);

                const datasetWithFilters: any[] = [];
                const seriesList: any[] = [];

                categories.forEach((cat: any) => {
                  const datasetId = 'dataset_' + cat;
                  datasetWithFilters.push({
                    id: datasetId,
                    fromDatasetId: 'dataset_raw',
                    transform: { type: 'filter', config: { dimension: 'Category', '=': cat } }
                  });
                  seriesList.push({
                    type: 'line', datasetId: datasetId, showSymbol: false, name: cat,
                    endLabel: { show: true, formatter: (params: any) => params.value[3] + ': ' + (params.value[0] * 100).toFixed(1) + '%' },
                    labelLayout: { moveOverlap: 'shiftY' },
                    emphasis: { focus: 'series' },
                    encode: { x: 'Date', y: 'Value', tooltip: ['Value'] }
                  });
                });

                const option = {
                  animationDuration: 8000,
                  dataset: [{ id: 'dataset_raw', dimensions: ['Value', 'Date', 'Category', 'Label'], source: adaptedData }, ...datasetWithFilters],
                  title: { text: 'Most important issues facing the US (poll by YouGov)' },
                  tooltip: { trigger: 'axis', valueFormatter: (v: any) => (v * 100).toFixed(1) + '%' },
                  xAxis: { type: 'time', name: 'Poll date' },
                  yAxis: { name: 'Share (%)', axisLabel: { formatter: (v: any) => (v * 100).toFixed(0) + '%' } },
                  grid: { right: 160 },
                  series: seriesList
                };
                issuesChart.setOption(option);
              });

            resizeListener = () => issuesChart.resize();
            window.addEventListener('resize', resizeListener);
          });
        }, { threshold: 0.25 });

        return () => {
          disposed = true;
          unobserve();
          if (resizeListener) window.removeEventListener('resize', resizeListener);
          if (issuesChart) issuesChart.dispose();
        };
    }, []);

    // Word Chart
    useEffect(() => {
        let disposed = false;
        let resizeListener: (() => void) | null = null;
        let chart: any = null;
        let elBtn: HTMLElement | null = null;
        let render: (() => void) | null = null;
        const node = wordChartRef.current;
        if (!node) return;

        const unobserve = observeOnce(node, () => {
          void loadECharts().then((echarts) => {
            if (disposed) return;

            chart = echarts.init(node);
          const elWords = document.getElementById("words") as HTMLInputElement;
          const elStart = document.getElementById("start") as HTMLInputElement;
          const elEnd = document.getElementById("end") as HTMLInputElement;
          elBtn = document.getElementById("plotBtn");
          const elErr = document.getElementById("err");

          let rows: any[] = [];

          function norm(s: string) {
              return String(s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\w\s-]/g, " ").replace(/\s+/g, " ").trim();
          }
          function ymToInt(ym: string) { const [Y,M] = ym.split("-").map(Number); return Y*100 + M; }
          function inRange(ym: string, startYm: string, endYm: string) {
              const v = ymToInt(ym);
              return v >= ymToInt(startYm) && v <= ymToInt(endYm);
          }
          function parseWords() {
              return elWords.value.split(",").map(s => s.trim()).filter(Boolean).slice(0, 4);
          }

          const lastToFull = new Map();
          const pop = new Map();
          const orig = new Map();

          function buildIndex() {
              for (const r of rows) {
                  const full = String(r.word);
                  const fullN = norm(full);
                  orig.set(fullN, full);
                  const c = Number(r.count) || 0;
                  pop.set(fullN, (pop.get(fullN) || 0) + c);
                  const parts = fullN.split(" ");
                  const last = parts[parts.length - 1];
                  if (!last) continue;
                  if (!lastToFull.has(last)) lastToFull.set(last, []);
                  lastToFull.get(last).push(fullN);
              }
              for (const [last, arr] of lastToFull.entries()) {
                  const uniq = [...new Set(arr)];
                  uniq.sort((a,b) => (pop.get(b)||0) - (pop.get(a)||0));
                  lastToFull.set(last, uniq);
              }
          }

          function resolveInputs(inputs: string[], maxPerLast = 1) {
              const resolved: string[] = [];
              const mapping: string[] = [];
              for (const raw of inputs) {
                  const q = norm(raw);
                  if (!q) continue;
                  if (orig.has(q)) {
                      resolved.push(orig.get(q));
                      mapping.push(`${raw} → ${orig.get(q)}`);
                      continue;
                  }
                  if (!q.includes(" ") && lastToFull.has(q)) {
                      const bucket = lastToFull.get(q).slice(0, maxPerLast).map((n: any) => orig.get(n) || n);
                      resolved.push(...bucket);
                      mapping.push(`${raw} → ${bucket.join(", ")}`);
                      continue;
                  }
                  resolved.push(raw);
                  mapping.push(`${raw} → (no match)`);
              }
              const seen = new Set();
              const out: string[] = [];
              for (const x of resolved) {
                  const k = norm(x);
                  if (!seen.has(k)) { seen.add(k); out.push(x); }
              }
              return { words: out, mapping };
          }

          render = () => {
              if(elErr) elErr.textContent = "";
              const inputs = parseWords();
              if (inputs.length < 3 || inputs.length > 4) {
                  if(elErr) elErr.textContent = "Please enter 3–4 names, comma-separated.";
                  return;
              }
              const startYM = elStart.value;
              const endYM = elEnd.value;
              if (!startYM || !endYM) {
                  if(elErr) elErr.textContent = "Start and End must be filled.";
                  return;
              }
              const { words } = resolveInputs(inputs, 1);
              const x = [...new Set(rows.map(d => String(d.date)).filter(ym => inRange(ym, startYM, endYM)))].sort((a,b) => ymToInt(a) - ymToInt(b));
              const series = words.map(w => {
                  const wKey = norm(w);
                  const mapYMtoShare = new Map(rows.filter(d => norm(d.word) === wKey).map(d => [String(d.date), Number(d.share)]));
                  const y = x.map(ym => mapYMtoShare.has(ym) ? mapYMtoShare.get(ym) : null);
                  return { name: w, type: "line", showSymbol: false, connectNulls: true, data: y };
              });
              chart.setOption({
                  title: { text: "Presence of American personalities in video titles and tags over time", left: "center" },
                  tooltip: { trigger: "axis", valueFormatter: (v: any) => (v == null ? "-" : v.toFixed(3) + "%") },
                  legend: { top: 40 },
                  grid: { top: 90, left: 55, right: 30, bottom: 50 },
                  xAxis: { type: "category", data: x, name: "Month" },
                  yAxis: { type: "value", name: "Mentions / videos (%)", axisLabel: { formatter: (v: any) => v.toFixed(2) + "%" } },
                  series
              }, true);
          };

          fetch('/data/word_presence_monthly.json')
            .then(r => r.json())
            .then(data => {
              if (disposed || !render) return;
              rows = data;
              buildIndex();
              const allYM = rows.map(d => String(d.date));
              const minYM = allYM.reduce((a,b) => ymToInt(a) < ymToInt(b) ? a : b);
              const maxYM = allYM.reduce((a,b) => ymToInt(a) > ymToInt(b) ? a : b);
              elStart.value = minYM;
              elEnd.value = maxYM;
              if(elBtn) elBtn.addEventListener("click", render);
              render();
            })
            .catch(e => { if(elErr) elErr.textContent = e.message; });
        
          resizeListener = () => chart.resize();
          window.addEventListener("resize", resizeListener);
        });
        }, { rootMargin: "400px 0px", threshold: 0 });

        return () => {
          disposed = true;
          unobserve();
          if (resizeListener) window.removeEventListener("resize", resizeListener);
          if (elBtn && render) elBtn.removeEventListener("click", render);
          if (chart) chart.dispose();
        };
    }, []);

    // Tags Area Chart
    useEffect(() => {
        let disposed = false;
        let resizeListener: (() => void) | null = null;
        let chart: any = null;
        const node = tagsAreaChartRef.current;
        if (!node) return;

        const unobserve = observeOnce(node, () => {
          void loadECharts().then((echarts) => {
            if (disposed) return;

            chart = echarts.init(node);

          fetch('/data/top10_tags_share_of_voice_yearly.json')
              .then(r => r.json())
              .then(rows => {
                  if (disposed) return;

                  const years = rows.map((d: any) => String(d.year));
                  const tags = Object.keys(rows[0]).filter(k => k !== "year");
                  const TAB10 = ["#1f77b4","#ff7f0e","#2ca02c","#d62728","#8c564b","#9467bd","#e377c2","#7f7f7f","#bcbd22","#17becf"];
                  const series = tags.map((tag: any, i: number) => ({
                      name: tag, type: "line", stack: "Total", areaStyle: {}, emphasis: { focus: "series" },
                      showSymbol: false, data: rows.map((d: any) => Number(d[tag] ?? 0))
                  }));
                  const option = {
                      color: TAB10, title: { text: "Cumulative prevalence of the top 10 leading political tags over time", left: "center" },
                      tooltip: { trigger: "axis", axisPointer: { type: "cross", label: { backgroundColor: "#6a7985" } }, valueFormatter: (v: any) => `${Number(v).toFixed(2)}%` },
                      legend: { top: 35, data: tags },
                      grid: { top: 90, left: 60, right: 60, bottom: 60 },
                      xAxis: [{ type: "category", boundaryGap: false, data: years, name: "Year" }],
                      yAxis: [{ type: "value", name: "Cumulative share of voice (%)", axisLabel: { formatter: (v: any) => `${v}%` } }],
                      series
                  };
                  chart.setOption(option);
              })
              .catch(e => { if(tagsAreaChartRef.current) tagsAreaChartRef.current.innerHTML = `<p style="color:#b00020;font-weight:600;">${e.message}</p>`; });
        
          resizeListener = () => chart.resize();
          window.addEventListener('resize', resizeListener);
        });
        }, { threshold: 0.25 });

        return () => {
          disposed = true;
          unobserve();
          if (resizeListener) window.removeEventListener('resize', resizeListener);
          if (chart) chart.dispose();
        };
    }, []);

    return(
        <section id="opinions">
            <ScrollFloat
              animationDuration={1}
              ease="back.inOut(2)"
              scrollStart="center bottom+=50%"
              scrollEnd="bottom bottom-=40%"
              stagger={0.03}
            >
              Do the sentiments and topics discussed align with public opinion?
            </ScrollFloat>
            <p>
                A digital ecosystem as vast as YouTube does not exist in a vacuum. To understand if the platform 
                truly reflects the American spirit, we must compare the digital "noise" with official 
                <strong>public opinion polls</strong>. 
                In this section, we analyze whether the topics that trended on YouTube—such as the economy, 
                healthcare, or immigration—matched the actual priorities of voters during election cycles. 
                Is YouTube an accurate <strong>barometer of the national mood</strong>, or does the platform's 
                algorithm amplify specific niche issues that don't represent the average citizen's concerns? 
            </p>

            <div style={{maxWidth: '1100px', margin: '0 auto'}}>
                <p style={{margin:'6px 0 12px 0', color:'#444'}}>
                From a political perspective, the interactive graph allows for comparison between different candidates during elections or otherwise.
                Enter <b>3–4 names</b> (comma-separated). You can type <b>last names</b> only (e.g., <i>Biden</i>) and we will match them to full names (e.g., <i>Joe Biden</i>).
                Dates are pre-filled; adjust them if needed, then click <b>Plot</b>.
                </p>

                <div style={{display:'flex', gap:'12px', flexWrap:'wrap', alignItems:'end', margin: '10px 0'}}>
                <div>
                    <label>Names (3–4, comma-separated)</label><br />
                    <input id="words" type="text" defaultValue="Clinton, Trump, Obama" style={{width:'320px'}} />
                </div>
                <div>
                    <label>Start</label><br />
                    <input id="start" type="month" />
                </div>
                <div>
                    <label>End</label><br />
                    <input id="end" type="month" />
                </div>
                <button id="plotBtn">Plot</button>
                <div id="err" style={{color:'#b00020', fontWeight:600}}></div>
                </div>

                <div ref={wordChartRef} id="word-chart" style={{width:'100%', height:'520px'}}></div>
            </div>

            <p>
                To analyze hundreds of thousands of video titles and tags without reading them one by one, we used a powerful "unsupervised" machine learning algorithm called Latent Dirichlet Allocation (LDA).
                It is a probabilistic model that assumes every document is a "mixture" of several topics, and every topic is a "mixture" of specific words. 
                It doesn't need us to tell it what the topics are; it discovers them automatically by identifying patterns of co-occurrence between words.
                We use it to turn a chaotic cloud of millions of tags into 6 topics, giving us a structural map of the American political landscape.
            </p>
            <p>
            ajouter graph LDA
            </p>
            <p style={{margin:'6px 0 12px 0', color:'#444'}}>
            HOW TO READ THE GRAPH: Each bubble represents a topic. The larger the bubble, the higher percentage of the number of documents in the corpus is about that topic.
            Blue bars represent the overall frequency of each word in the corpus. If no topic is selected, the blue bars of the most frequently used words will be displayed.
            Red bars give the estimated number of times a given term was generated by a given topic.
            The further the bubbles are away from each other, the more different they are.
            The λ slider allows to rank the terms according to term relevance.
            By default, the terms of a topic are ranked in decreasing order according their topic-specific probability ( λ = 1 ). Moving the slider allows to adjust the rank of terms based on relevance for the specific topic.
            </p>

            <div className="split-section">
                <div className="column">
                    <h3>Opinion poll</h3>
                    <p>Analysis of the left-wing engagement shows a steady increase in video production during the primaries.</p>
                    <div ref={issuesChartRef} id="issues-chart" style={{width:'100%', height:'600px', margin: '40px 0'}}></div>
                    <p>Additional insights regarding the Democratic base on YouTube.</p>
                </div>
                <div className="column">
                    <h3>YouTube topics</h3>
                    <p>On the other side, conservative channels exhibit higher engagement rates per video posted.</p>
                    <div id="chart-right" style={{width:'100%', height:'300px'}}></div>
                    <p>Observations on the Republican content distribution strategy.</p>
                </div>
            </div>

            <p> Who doesn't love polls? The graph here shows us the topics Americans found most important during the 2010s. </p>
            <p> We can see that the economy was a big worry throughout most of the decade most likely due to the Great Recession and its tough aftershocks. After all, the heart of capitalism must worry about its economy.
            Health and warfare seems to be a big concern, no surprise there as people do  want to be able to live and be able to go to the hospital. Healthcare being privatized is an obvious issue that is constantly being discussed
            Another topic that results high in the polls is education and environment. Climate change and global warming are obviously issues that worry a lot of the population but sensitive topics like how to teach the children (e.g Critical Race Theory)   Less polarizing topics like public spending and government are not as important, seemingly, as they may be too technical for the average Joe and not controversial enough to care. </p>¨
            <p> Now we have looked at the topics that show up in the polls, let us see which ones catch people's attention on Youtube!</p>

            <div ref={tagsAreaChartRef} id="tags-area-chart" style={{width:'100%', height:'600px', margin: '20px auto'}}></div>

            <p>
                The graph above shows the evolution over time of the top 10 most used tags filtered on the selected US channels in their share of total tags. 
                We can see that many tags stay relatively stable in their use but a few vary significantly. 
                Business and economy saw spikes during the years 2008-2009 which were the years of the Great Recession. 
                The tag “elections” spiked in 2016, a lot more than in 2008 or 2012. This was an extremely mediatized and discussed election and therefore the jump makes sense. 
            </p>
        </section>
    );
}

export default Opinions;
