const express = require('express');
const app = express();
var session = require('express-session');
var Keycloak = require('keycloak-connect');

let _keycloak;

var keycloakConfig = {
  "realm": "Demo-Realm",
  "bearer-only": true,
  "auth-server-url": "http://localhost:8181/auth/",
  "ssl-required": "external",
  "resource": "node-microservice",
  "verify-token-audience": true,
  "use-resource-role-mappings": true,
  "confidential-port": 0,
  "realmPublicKey": 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAqHp/JTon/QivLhrnzcAdKs1ia8aea5k8wBzoBsE6RtpRnPthxbYhjns+JqcqbPsu1i70824fjl6i68P3IQ/INpofNSG3r1FVwo4rLrJ2YZJLRgxjtT3IpRsH79TFueJJen4jhMtRC81Z/sFBvflKxw75HcH99dNzuWFR88dSJ74tRBwmP3Z0LSanOcb/xNQXTNXbj1OAfIUIhC3AONRa7xTYltBH0DyjvWD4K/zmPtHMLXgEFIWYubzCtU3C8WCURP6Irqfr/sF4hPDjzw0mHElpD85vwo37lssHMQZpnmZXh4tG6IQ6WhL53+AXkJQeqDyXI/2gnUDQY64+cobkdQIDAQAB'
}

function initKeycloak() {

  
  if(_keycloak) {
    console.log("Initializing Keycloak...");
    return _keycloak;
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

    _keycloak  = new Keycloak({ 
      store: memoryStore
    }, keycloakConfig);
    return _keycloak ;
  }
}

module.exports = {
  initKeycloak
}
