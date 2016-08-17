module.exports = {
  'Notes can be saved' : function (browser) {
      browser.loadTestData('notes.json', function(notes){
          browser
              .url('http://localhost:8082')
              .waitForElementVisible('body', 1000)
              .setValue('input[id=note-name]', notes.save.name)
              .setValue('textarea[id=note-content]', notes.save.contents)
              .click('button[id=save-button]')
              .pause(1000)
              .assert.containsText('#status', 'Saved note: ' + notes.save.name)
              .assert.remote('co.cantina.junit.http.example.ExampleTest', 'noteSaved')
              .end();
      });
  },

  'Notes can be loaded' : function (browser) {
      browser.loadTestData('notes.json', function(notes){
          browser
              .url('http://localhost:8082')
              .waitForElementVisible('body', 1000)
              .setValue('input[id=note-name]', notes.load.name)
              .click('button[id=load-button]')
              .pause(1000)
              .assert.containsText('#status', 'Loaded note: ' + notes.load.name)
              .assert.valueContains('textarea[id=note-content]', notes.load.contents)
              .end();
      });
  }
};
