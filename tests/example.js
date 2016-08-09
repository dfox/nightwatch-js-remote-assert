module.exports = {
  'Example test' : function (browser) {
      browser
          .url('http://localhost:8082')
          .waitForElementVisible('body', 1000)
          .setValue('input[id=note-name]', 'my-note')
          .setValue('textarea[id=note-content]', 'This is my note')
          .click('button[id=save-button]')
          .pause(1000)
          .assert.containsText('#status', 'Saved note: my-note')
          .assert.remote("co.cantina.junit.http.example.ExampleTest", "failedAssertion")
          .end();
  }
};
