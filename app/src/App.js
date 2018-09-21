import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import ReactGA from 'react-ga';
import 'react-toastify/dist/ReactToastify.css';

const EMAIL_REGEX = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
const API_URL = '/api';
const RED = '#da7676';
const GREEN = '#72bd72';

const styles = {
  wrapper: {
    width: '100%',
    height: '75%',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'column',
  },
  h1: {
    textAlign: 'center',
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
    fontSize: '15px',
    borderRadius: 0,
    textAlign: 'center',
    padding: '10px',
  },
  label: {
    marginBottom: '10px',
    fontFamily: 'Dosis',
    fontSize: '25px',
    fontWeight: 200,
    color: '#4a4848',
    textAlign: 'center',
  },
  inputWrapper: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  formWrapper: {
    height: '60%',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-between',
    minHeight: '360px',
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
    toEmail: '',
    fromEmail: 'support@apple.com',
    subjectEmail: 'Huge issue.',
    isFetching: false,
  }

  isValidEmail = (field) => {
    const { [field]: email } = this.state;
    if (email.match(EMAIL_REGEX)) {
      return true;
    }
    return false;
  }

  getInputColor(field) {
    return !this.isValidEmail(field) ? RED : GREEN;
  }

  onChangeField = (field) => {
    return (e) => {
      this.setState({ [field]: e.target.value });
    }
  }

  onServerRespond = (res) => {
    const toastOptions = {
      autoClose: 5000,
      position: toast.POSITION.TOP_CENTER,
    };

    this.setState({ isFetching: false });
    if (res.success) {
      ReactGA.event({
        category: 'Email',
        action: 'Success to send',
      });

      toast(
        'You have turned off your friend\'s ios device ! GG !',
        toastOptions,
      );
    }
    else {
      ReactGA.event({
        category: 'Email',
        action: 'Fail to send',
      });

      toast(
        'Oups ! We have problem verify your friend\'s email !',
        toastOptions,
      );
    }
  }

  onSubmit = (e) => {
    e.preventDefault();
    if (!this.isValidEmail('toEmail')) {
      return;
    }

    const {
      toEmail,
      fromEmail,
      subjectEmail,
    } = this.state;

    this.setState({ isFetching: true });

    fetch(`${API_URL}?to=${toEmail}&subject=${subjectEmail}&from=${fromEmail}`)
      .then(res => res.json())
      .then((res) => this.onServerRespond(res))
      .catch((e) => this.onServerRespond({ success: false }))
  }

  render() {
    const {
      fromEmail,
      toEmail,
      subjectEmail,
      isFetching,
    } = this.state;

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
          <form onSubmit={this.onSubmit} style={styles.formWrapper}>

            <div>
              <p style={styles.label}>Enter an "from" email :</p>
              <input
                style={{
                  ...styles.input,
                  borderBottom: `solid 1px ${this.getInputColor('fromEmail')}`,
                  color: this.getInputColor('fromEmail'),
                }}
                type="email"
                placeholder="eg. me@gmail.com"
                onChange={this.onChangeField('fromEmail')}
                value={fromEmail}
              />
            </div>

            <div>
              <p style={styles.label}>Enter an subject :</p>
              <input
                style={styles.input}
                type="text"
                placeholder="eg. Warning!"
                onChange={this.onChangeField('subjectEmail')}
                value={subjectEmail}
              />
            </div>

            <div>
              <p style={styles.label}>Enter your target email :</p>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <input
                  style={{
                    ...styles.input,
                    borderBottom: `solid 1px ${this.getInputColor('toEmail')}`,
                    color: this.getInputColor('toEmail'),
                  }}
                  type="email"
                  placeholder="eg. friend@gmail.com"
                  onChange={this.onChangeField('toEmail')}
                  value={toEmail}
                  autoFocus
                />
                <button
                  onClick={this.onSubmit}
                  style={{
                    ...styles.button,
                    background: !isFetching
                      ? this.getInputColor('toEmail')
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

            </div>
          </form>
        </div>
      </React.Fragment>
    )
  }
}

export default App;
