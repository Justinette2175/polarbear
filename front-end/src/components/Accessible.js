import React, {Component} from 'react';

import statsNoral from '../utils/statNormalFunc';

class Accessible extends Component {
  constructor(props) {
    super(props);
  }

  precisionRound(number, precision) {
    var factor = Math.pow(10, precision);
    return Math.round(number * factor) / factor;
  }

  render() {
    const rawData = this.props.data || {};

    const engagement = rawData.engagement || {};
    const tone = rawData.tone || {};

    const reactions = engagement.reactions || 0;
    const shares = engagement.shares || 0;
    const comments = engagement.comments || 0;
    const dataValues = [reactions, shares, comments];

    const avg = tone.average;
    const stdDev = tone.stdDev;
    const vals = statsNoral.extractFunctSteps(avg, stdDev, 5);

    const sum = vals.reduce((acc, val) => {
      return acc + val;
    }, 0)
    const positif = this.precisionRound((vals[4] + vals[3]) / sum * 100, 2);
    const neutre = this.precisionRound(vals[2] / sum * 100, 2);
    const negatif = this.precisionRound((vals[0] + vals[1]) / sum * 100, 2);

    return (
      <section id="accessible-wrapper">
        <p>Engagement potentiel:
          {reactions} j'aime
          {shares} partages
          {comments} commentaires
          {positif}% positif
          {neutre}% neutre
          {negatif}% negatif
        </p>  
      </section>
    )
  }
}

export default Accessible;
