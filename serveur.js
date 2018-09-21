const express = require('express');
const sg = require('@sendgrid/mail');
const fs = require('fs');
const port = process.env.PORT || 3000;

class SG_API {
  constructor(filePath) {
    const keys = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const htmlContent = fs.readFileSync('crasher.html', 'utf8');

    this.state = {
      keys,
      htmlContent,
    };
    this.setApiKey();
  }

  next() {
    const { keys } = this.state;
    keys.shift();
    this.setApiKey();
  }

  setApiKey() {
    const { keys } = this.state;
    if (keys.length === 0) {
      console.error('All api keys are used.');
      return;
    }

    sg.setApiKey(keys[0]);
  }

  sendEmail(
    from = 'lucas.mar@epitech.eu',
    to,
    subject = 'Paiement confirmation for 200$ in "Clash of clans".'
  ) {
    from = (from === ''
      ? 'urgency@gmail.com'
      : from
    );
    subject = (subject === ''
      ? 'Paiement confirmation for 200$ in "Clash of clans".'
      : subject
    );

    console.log(`[DEBUG] "${from}"[${subject}] ->  "${to}".`);

    const { htmlContent } = this.state;
    return (
      new Promise((resolve, reject) => (
        sg.send({
          to,
          from,
          subject,
          html: htmlContent,
        })
        .then(resolve)
        .catch(e => {
          this.next();
          console.error(e)
          reject();
        })
      ))
    );
  }
};

const sgApi = new SG_API('.sendgrid.json');

express()
  .use(express.static('web'))
  .get('/api', (req, res) => {
    const { from, to, subject } = req.query;

    if (to === undefined) {
      res.json({ success: false });
      return;
    }

    sgApi.sendEmail(from, to, subject)
      .then(() => res.json({ success: true }))
      .catch(() => res.json({ success: false }))
  })
  .listen(port, () => console.log(`Server is running on http://localhost:${port}`));
