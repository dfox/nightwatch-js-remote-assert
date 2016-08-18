const URL = 'http://localhost:8082'
const NAME_INPUT = 'input[id=note-name]'
const CONTENT_INPUT = 'textarea[id=note-content]'
const SAVE_BUTTON = 'button[id=save-button]'
const LOAD_BUTTON = 'button[id=load-button]'
const STATUS_ELEMENT = '#status'
const REMOTE_TEST_GROUP = 'co.cantina.junit.http.example.ExampleTest'
const TEST_DATA = 'notes.json'

module.exports = {
  'Notes can be saved' : browser => {
    browser.loadTestData(TEST_DATA, notes => {
      browser
        .url(URL)
        .waitForElementVisible('body', 1000)
        .setValue(NAME_INPUT, notes.save.name)
        .setValue(CONTENT_INPUT, notes.save.contents)
        .click(SAVE_BUTTON)
        .pause(1000)
        .assert.containsText(STATUS_ELEMENT, 'Saved note: ' + notes.save.name)
        .assert.remote(REMOTE_TEST_GROUP, 'noteSaved')
        .end();
    });
  },
  
  'Notes can be loaded' : browser => {
    browser.loadTestData(TEST_DATA, notes => {
      browser
        .url(URL)
        .waitForElementVisible('body', 1000)
        .setValue(NAME_INPUT, notes.load.name)
        .click(LOAD_BUTTON)
        .pause(1000)
        .assert.containsText(STATUS_ELEMENT, 'Loaded note: ' + notes.load.name)
        .assert.valueContains(CONTENT_INPUT, notes.load.contents)
        .end();
    });
  },
  
  'Notes can be loaded using fixture' : browser => {
    browser.loadTestData(TEST_DATA, notes => {
      browser
        .url(URL)
        .waitForElementVisible('body', 1000)
        .setValue(NAME_INPUT, notes.fixture.name)
        .click(LOAD_BUTTON)
        .pause(1000)
        .assert.containsText(STATUS_ELEMENT, 'Error loading note: Not Found')
        .assert.valueContains(CONTENT_INPUT, '')
        .remoteFixture(REMOTE_TEST_GROUP, 'createNote', () => {
          browser
            .click(LOAD_BUTTON)
            .pause(1000)
            .assert.containsText(STATUS_ELEMENT, 'Loaded note: ' + notes.fixture.name)
            .assert.valueContains(CONTENT_INPUT, notes.fixture.contents)
            .end();
        });
    });
  },

  'Remote assertion should fail' : browser => {
    browser
      .assert.remote(REMOTE_TEST_GROUP, 'failedAssertion')
      .end();
  },

  'Remote fixture should fail' : browser => {
    browser
      .remoteFixture(REMOTE_TEST_GROUP, 'throwException')
      .end();
  }
};
