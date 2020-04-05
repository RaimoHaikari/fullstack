import React, {useState} from 'react';
import Button from './components/Button';
import Display from './components/Display';
import Message from './components/Message'

/*
const Hello = (props) => {
  const { name, age } = props
*/
const App = (props) => {

  const [selected, setSelected] = useState(0);
  const [anecdotes, setAnecdotes] = useState(
    props.anecdotes.map((str) => ({ anecdote: str, votes: 0 }))
  );

  const [mostPopular, setMostPopular] = useState(0);


  /*
  * Varmistetaan do .. while -silmukalla, että uuden anekdootin valitsevaa painiketta
  * painettaessa esitettävä anekdootti vaituu
  */
  const getRandomInt = () => {

    let rnd = -1

    do {
      rnd = Math.floor(Math.random() * Math.floor(anecdotes.length));
    }
    while(rnd === selected)

    return  rnd;
  }


  const btnStuff = {
    text: "Näytä joku toinen anekdootti",
    handleClick: () => {

      const rnd = getRandomInt();

      setAnecdotes([ ...anecdotes ]);
      setSelected(rnd);
      topOfThePops()

      return;

    },
    className: "anecdoteButton bgBlack"
  }

  const btnVote = {
    text: "Äänestä",
    handleClick: () => {
      const copy = [ ...anecdotes ];
      copy[selected].votes++;

      setAnecdotes(copy);
      setSelected(selected);
      topOfThePops()

      return;

    },
    className: "anecdoteButton bgGray"
  }

  /*
   * Tulostetaan arvotun ja suosituimman anekdootin tiedot samalla komponentilla,
   * mutta muotoillaan komponentin ulkoasu hieman eri tavalla.
   * 
   * Kerätään tarvittava css-luokkien nimet kahteen objektiin:
   * - draw: arvonttu anekdootti
   * - popular: suosittu anekdootti
   */
  const drawStyle = {
    div: 'anecdote',
    msg1: 'selected',
    msg2: 'votes'
  }

  const popularStyle = {
    div: 'mostPopular',
    msg1: 'mostPopularSelected',
    msg2: 'mostPopularVotes'
  }

  /*
   * Etsitään suosituinta anekdoottia
   * - haetaan anekdootit sisältävästä taulukosta tykkäysten maksimi arvo
   * - suodatetaan ne anekdootit, jotka ovat keränneet tämän verran tykkäyksiä
   * - valitaan järjestyksessä eka...
   */
  const topOfThePops = () => {

    const maxVotes = Math.max.apply(Math, anecdotes.map(function(o) { return o.votes; }));

    const jihuu = anecdotes.findIndex((o) => {return o.votes === maxVotes});

    setMostPopular(jihuu);

  }

  return (
    <div className="App">
        <Message className="title" text="Päivän anekdootti" />
        <Display data={anecdotes[selected]} styling={drawStyle}/>
        <Button data={btnStuff}/>
        <Button data={btnVote}/>
        <Message className="title" text="Suosituin anekdootti" />
        <Display data={anecdotes[mostPopular]} styling={popularStyle}/>
    </div>
  );
}

export default App;
