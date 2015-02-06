# hawkular-rest-service

Is a collection of angular.js ng-resources which have corresponding REST endpoints in the hawkular-metrics.

To build the service:

```shell
npm install
bower install
gulp
```

The service can be tested with the server. To run the actual testsuite you need to have hawkular-metrics server running
on localhost on port 8080. It must have a clean database (= no tenants, no metrics, ...). Once the server is up and
running execute:

```shell
gulp rest
```

to start the testsuite.
