import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <main>
        <DrumMachine />
      </main>
      <Footer/>
    </div>
  );
}
class DrumMachine extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      power: true,
      bank: 1,
      press: '',
      volume: 0.8,
      timeoutID: 0,
      keys: [],
      pads: {
        1: {
          Q: "drum/W.wav",
          W: "drum/W.wav",
          E: "drum/E.wav",
          A: "drum/S.wav",
          S: "drum/S.wav",
          D: "drum/D.wav",
          Z: "drum/X.wav",
          X: "drum/X.wav",
          C: "drum/C.wav"
          },
        2: {
          Q: "https://s3.amazonaws.com/freecodecamp/drums/Heater-1.mp3",
          W: "https://s3.amazonaws.com/freecodecamp/drums/Heater-2.mp3",
          E: "https://s3.amazonaws.com/freecodecamp/drums/Heater-3.mp3",
          A: "https://s3.amazonaws.com/freecodecamp/drums/Heater-4_1.mp3",
          S: "https://s3.amazonaws.com/freecodecamp/drums/Heater-6.mp3",
          D: "https://s3.amazonaws.com/freecodecamp/drums/Dsc_Oh.mp3",
          Z: "https://s3.amazonaws.com/freecodecamp/drums/Kick_n_Hat.mp3",
          X: "https://s3.amazonaws.com/freecodecamp/drums/RP4_KICK_1.mp3",
          C: "https://s3.amazonaws.com/freecodecamp/drums/Cev_H2.mp3"
          }
        }
    };

    this.powerON = this.powerON.bind(this);
    this.bankSwitch = this.bankSwitch.bind(this);
    this.keyClick = this.keyClick.bind(this);
    this.keypress = this.keypress.bind(this);
    this.keyUp = this.keyUp.bind(this);
    this.keyBlur = this.keyBlur.bind(this);
    this.volumeChange = this.volumeChange.bind(this);
  }

  powerON () {
    for (var i = this.state.keys.length - 1; i >= 0; i--) {
      this.state.power 
        ? this.state.keys[i].classList.remove('keyON')
        : this.state.keys[i].classList.add('keyON');
    }
    this.setState(
      {power: !this.state.power, 
      press: ''});
  }

  bankSwitch () {
    this.setState({bank: this.state.bank === 1 ? 2 : 1});
  }

  keyClick (e) {
    if (!this.state.power) return;
    let s = e.target.firstElementChild;
    s.volume = this.state.volume;
    s.play();
    s.currentTime = 0;
    this.setState({press: e.target.id});
  }

  componentDidMount () {
    document.addEventListener('keypress', this.keypress);
    document.addEventListener('keyup', this.keyUp);
    for (let keys = Object.keys(this.state.pads[1]), i = keys.length - 1; i >= 0; i--) {
      this.state.keys.push(document.getElementById(keys[i]));
    }
  }
  componentWillUnmount() {
    document.removeEventListener('keypress', this.keypress);
    document.removeEventListener('keyup', this.keyUp);
  }

  keypress (e) {
    if (!this.state.power) return
    let key = e.key.toUpperCase();
    if (!this.state.pads[this.state.bank].hasOwnProperty(key)) return
    for (var i = this.state.keys.length - 1; i >= 0; i--) {
      this.state.keys[i].classList.remove('key_active');
    }
    let k = document.getElementById(key);
    k.classList.add('key_active');
    k.focus();
    k.click();
    window.clearTimeout(this.state.timeoutID);
  }

  keyUp () {
    this.state.press && this.setState({timeoutID: window.setTimeout(this.keyBlur,100)});
  }

  keyBlur () {
    document.getElementById(this.state.press).classList.remove('key_active');
  }

  volumeChange (e) {
    this.setState({volume: e.target.value});
  }

  render () {
    return <section className='drumMachine'>
      <Keys keyClick={this.keyClick} pads={this.state.pads} bank={this.state.bank}/>
      <ControlSection 
        power={this.state.power} 
        bank={this.state.bank} 
        press={this.state.press} 
        powerON={this.powerON} 
        bankSwitch={this.bankSwitch} 
        volume={this.state.volume} 
        volumeChange={this.volumeChange}/>
    </section>
  }
}

function Keys (props) {
  let keysArr = Object.keys(props.pads[props.bank]).map((el)=>{
    return (
      <Key key={el}
        id={el}
        pads={props.pads}
        bank={props.bank}
        keyClick={props.keyClick}
        />
    );
  });

  return (
    <section className='keys'>
      {keysArr}
    </section>
  );
}

function Key (props) {
  return (
    <button className='key keyON'
      id={props.id}
      onClick={props.keyClick}
    >
      {props.id}
      <Sample src={props.pads[props.bank][props.id]}/>
    </button>
  );
}

function Sample (props) {
  return <audio className="sample" src={props.src} preload="auto"></audio>
}

function ControlSection (props) {
  return (
    <fieldset className='controlSection'>
    <PowerButton power={props.power} powerON={props.powerON}/>
    <Display power={props.power} press={props.press}/>
    <Volume volume={props.volume} volumeChange={props.volumeChange}/>
    <BankButton bank={props.bank} bankSwitch={props.bankSwitch}/>
  </fieldset>
  );
}

function Button (props) {
  return (
    <div>
    <label htmlFor={props.setUp.name}>{props.setUp.value}</label>
    <button className={'button ' + props.setUp.name} 
      id={props.setUp.name} 
      onClick={props.onClick}>
      {props.switch}
    </button>
    </div>
  );
}

function PowerButton (props) {
  return (
    <Button setUp={{name: 'powerButton', value: 'Power'}} 
      onClick={props.powerON}
      switch={
        <SwitchPower power={props.power}/>
      }/>
  );
}

function BankButton (props) {
  return (
    <Button setUp={{name: 'bankButton', value: 'Bank'}} 
      onClick={props.bankSwitch}
      switch={
        <SwitchBank bank={props.bank}/>
      }/>
  );
}

function SwitchPower (props) {
  return <div className={props.power ? 'switch' : 'switch switchOFF'}/>
}

function SwitchBank (props) {
  return <div className={props.bank === 1 ? 'switch' : 'switch switchBank2'}/>
}

function Display (props) {
  let output = '';
  if (props.power) {
    output = 'Make some noise!';
    props.press !== '' && (output = props.press + ' key');
  }
  return (
    <div className={props.power ? 'display' : 'display displayOFF'}>
      <p className='displayText'>{output}</p>
    </div>
  );
}

function Volume (props) {
  return <input className='volume' type="range" min="0" max="1" step="0.1" value={props.volume} onChange={props.volumeChange}/>
}

function Footer () {
  return (
    <footer>
      <a className="footer__link" href="https://www.instagram.com/miroslavpetrov_/" target="_blank" rel="noopener noreferrer">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style={{verticalAlign: "middle", width: 16}}>
          <path d="M256 49c67 0 75 1 102 2 24 1 38 5 47 9a78 78 0 0129 18 78 78 0 0118 29c4 9 8 23 9 47 1 27 2 35 2 102l-2 102c-1 24-5 38-9 47a83 83 0 01-47 47c-9 4-23 8-47 9-27 1-35 2-102 2l-102-2c-24-1-38-5-47-9a78 78 0 01-29-18 78 78 0 01-18-29c-4-9-8-23-9-47-1-27-2-35-2-102l2-102c1-24 5-38 9-47a78 78 0 0118-29 78 78 0 0129-18c9-4 23-8 47-9 27-1 35-2 102-2m0-45c-68 0-77 0-104 2-27 1-45 5-61 11a123 123 0 00-45 29 123 123 0 00-29 45c-6 16-10 34-11 61-2 27-2 36-2 104l2 104c1 27 5 45 11 61a123 123 0 0029 45 123 123 0 0045 29c16 6 34 10 61 11a1796 1796 0 00208 0c27-1 45-5 61-11a129 129 0 0074-74c6-16 10-34 11-61 2-27 2-36 2-104l-2-104c-1-27-5-45-11-61a123 123 0 00-29-45 123 123 0 00-45-29c-16-6-34-10-61-11-27-2-36-2-104-2z"></path>
          <path d="M256 127a129 129 0 10129 129 129 129 0 00-129-129zm0 213a84 84 0 1184-84 84 84 0 01-84 84z"></path>
          <circle cx="390.5" cy="121.5" r="30.2"></circle>
        </svg> Miroslav Petrov</a>
    </footer>
  );
}
export default App;
