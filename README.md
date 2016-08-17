# nightwatch-js-remote-assert

A library which adds remote assertion to nightwatch

## What

This library is intended to work with a backend such as [JUnit HTTP](https://github.com/cantinac/junit-http). Check out that project for the rationale and how to set up the server component.

## How

* Clone the JUnit HTTP repository and run the example application and test servers
* Clone this repo
* Run ```npm install```
* Run ```node example.js```
* Run ```nightwatch```
* Check out the test output in the terminal

## Example 

The example Express appication (/example.js) serves up a simple frontend for the example API in the JUnit HTTP project. The test included in tests/example.js exercises that application and shows how to use the included fixtures module:

```javascript
const fixtures = require("../fixture.js");

module.exports = {
  'Example test' : function (browser) {      
      fixtures.load("note.json", function(note){
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

```

How does the assertion know where the test server is? There's a new configuration block you can add to the test settings in Nightwatch:

```json
"test_settings" : {
  "default" : {
    "remoteAssertions": {
      "host": "localhost",
      "port": 8081
    }
  },
```

In order to execute a test on the backend, you simply specify it as another assertion using ```assert.remote```. If you read through the JUnit HTTP it should be obvious how this works. 
