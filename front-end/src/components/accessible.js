import React, {Component} from 'react';

class Accessible extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <section id="accessible-wrapper">
        <p>Engagement potentiel:
          10,000 partages
          3,000 commentaires
          50% positif
          40% neutre
          10% negatif
        </p>  
      </section>
    )
  }
}

export default Accessible;
