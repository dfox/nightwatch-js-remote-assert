module.exports = {
  'Example test' : function (browser) {
      browser
          .url('http://localhost:8080/notes/my-note')
          .waitForElementVisible('body', 1000)
          .setValue('input[id=contents]', 'This is my note')
          .waitForElementVisible('button[id=save]', 1000)
          .click('button[id=save]')
          .pause(1000)
          .assert.containsText('#note', 'This is my note')
          .assert.remote("co.cantina.junit.example.ExampleTest", "noteSaved")
          .end();
  }
};
