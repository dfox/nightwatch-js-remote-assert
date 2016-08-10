const fixtures = require('../fixture.js');

module.exports = {
  'Example test' : function (browser) {
      fixtures.load('note.json', function(note){
          browser
              .url('http://localhost:8082')
              .waitForElementVisible('body', 1000)
              .setValue('input[id=note-name]', note.name)
              .setValue('textarea[id=note-content]', note.contents)
              .click('button[id=save-button]')
              .pause(1000)
              .assert.containsText('#status', 'Saved note: my-note')
              .assert.remote('co.cantina.junit.http.example.ExampleTest', 'noteWritten')
              .end();
      });
  }
};
