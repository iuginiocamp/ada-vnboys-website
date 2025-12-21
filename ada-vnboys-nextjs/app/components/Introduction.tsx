import React from 'react';

const Introduction = () => {
  return (
    <section id="introduction" className="justify-text">
      <div className="section-title">Introduction</div>
      <p>
        When America chooses its leader, the whole world holds its breath. Calling it a mere national voting process would be an understatement;
        it is a sacred geopolitical ritual whose consequences are felt across the globe, from Asian stock markets to European frontlines.
        The American presidential election is a quadrennial marathon punctuated by key milestones: the primaries, the national conventions, and the final race between Democrats and Republicans, a duopoly that splits the nation in two distinct colors:
      </p>

      <ul>
        <li><strong className="text-democrat">The Democratic Party:</strong> Generally representing liberal, progressive values.</li>
        <li><strong className="text-republican">The Republican Party:</strong> Generally representing conservative, traditionalist values.</li>
      </ul>

      <p>
        Our study focuses on the elections from 2008 to 2016, a period where the battlefield silently mutated. The epicenter of power shifted from television stages to a dematerialized arena, governed by new and volatile codes. Voters became users; speeches became content.
        Here, we enter what we call the "Attention Democracy." In this digital space, legitimacy is no longer won solely by the vote, but by the obsessive capture of the voter’s mind.
        Our investigation dives deep into YouTube's massive datasets to answer a crucial question: is this new digital arena a faithful mirror of a nation in turmoil, or a distortion machine that polarizes reality and tears apart the social fabric?
      </p>
    </section>
  );
};

export default Introduction;
