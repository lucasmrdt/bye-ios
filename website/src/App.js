import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EMAIL_REGEX = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
const API_URL = 'http://fromios.alwaysdata.net/';

const styles = {
  wrapper: {
    width: '100%',
    height: '50%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'column',
  },
  h1: {
    display: 'flex',
    alignItems: 'center',
    fontFamily: 'Dosis',
    fontWeight: 200,
  },
  emoji: {
    height: '43px',
    marginLeft: '20px',
  },
  input: {
    border: 'none',
    borderBottom: '1px solid black',
    fontSize: '20px',
    textAlign: 'center',
    padding: '10px',
  },
  label: {
    marginBottom: '40px',
    fontFamily: 'Dosis',
    fontSize: '30px',
    fontWeight: 200,
    marginRight: '20px',
    color: '#4a4848',
  },
  inputWrapper: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
  },
  button: {
    cursor: 'pointer',
    marginLeft: '20px',
    border: 'none',
    height: '50px',
    width: '50px',
    background: 'none',
    borderRadius: '10%',
    color: 'white',
  }
};

class App extends React.Component {
  state = {
    targetEmail: '',
    isFetching: false,
  }

  isValidEmail = () => {
    if (this.state.targetEmail.match(EMAIL_REGEX)) {
      return true;
    }
    return false;
  }

  get inputColor() {
    return !this.isValidEmail() ? '#da7676' : '#72bd72';
  }

  onChange = (e) => {
    const targetEmail = e.target.value;
    this.setState({ targetEmail });
  }

  onServerRespond = (res) => {
    const toastOptions = {
      autoClose: 5000,
      position: toast.POSITION.BOTTOM_CENTER,
    };

    this.setState({ isFetching: false });
    if (res.success) {
      toast('You have turned off your friend\'s ios device ! GG !');
    }
    else {
      toast('Oups ! We have problem verify your friend\'s email !');
    }
  }

  onSubmit = (e) => {
    e.preventDefault();

    if (!this.isValidEmail()) {
      return;
    }

    const { targetEmail } = this.state;

    this.setState({ isFetching: true });

    fetch(`${API_URL}?email=${targetEmail}`, { mode: 'no-cors' })
      .then(res => res.json())
      .then(() => this.onServerRespond({ success: true }))
      .catch(() => this.onServerRespond({ success: false }))
  }

  render() {
    const { targetEmail, isFetching } = this.state;

    console.log(this.state.targetEmail)
    return (
      <React.Fragment>
        <ToastContainer />
        <div style={styles.wrapper}>
          <h1 style={styles.h1}>
            SAY BYE TO YOUR IOS FRIENDS ...
            <img
              src="https://assets-cdn.github.com/images/icons/emoji/unicode/1f60f.png"
              alt="smirk"
              style={styles.emoji}
            />
          </h1>
          <form onSubmit={this.onSubmit} style={styles.inputWrapper}>
            <p style={styles.label}>Enter your friend email :</p>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <input
                style={{
                  ...styles.input,
                  borderBottom: `solid 1px ${this.inputColor}`,
                  color: `${this.inputColor}`,
                }}
                type="email"
                placeholder="friend@gmail.com"
                onChange={this.onChange}
                value={targetEmail}
              />
              <button
                onClick={this.onSubmit}
                style={{
                  ...styles.button,
                  background: !isFetching
                    ? this.inputColor
                    : 'none'
                }}
              >
                {isFetching
                  ? <img
                      src="https://loading.io/spinners/coolors/index.palette-rotating-ring-loader.gif"
                      style={{ width: '100%', height: '100%' }}
                    />
                  : 'SEND'
                }
              </button>
            </div>
          </form>
        </div>
      </React.Fragment>
    )
  }
}

export default App;
