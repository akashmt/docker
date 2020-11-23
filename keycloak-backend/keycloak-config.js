const express = require('express');
const app = express();
var session = require('express-session');
var Keycloak = require('keycloak-connect');

let keycloak;

var keycloakConfig = {
  "realm": "Demo-Realm",
  "bearer-only": true,
  "auth-server-url": "http://localhost:8181/auth/",
  "ssl-required": "external",
  "resource": "node-microservice",
  "verify-token-audience": true,
  "use-resource-role-mappings": true,
  "confidential-port": 0
}

function initKeycloak() {

  
  if(keycloak) {
    console.log("Initializing Keycloak...");
    return keycloak;
  }
  else {
    console.log("Initializing Keycloak..");
    var memoryStore = new session.MemoryStore();
    // Configure session
    app.use(session({
      secret: 'mySecret',
      resave: false,
      saveUninitialized: true,
      store: memoryStore
    }));

    keycloak = new Keycloak({ 
      store: memoryStore
    }, keycloakConfig);
    return keycloak;
  }
}

module.exports = {
  initKeycloak
}
