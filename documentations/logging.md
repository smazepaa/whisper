# Logging Strategy with Morgan

## Overview

Logging is a critical component of any application, providing insights into its operation and behavior. It aids in troubleshooting, performance monitoring, and security auditing. In the application, `morgan` is configured to log all HTTP requests, with a specific focus on capturing error-related requests separately for ease of analysis.

## Implementation Details

### Logging Setup with Morgan

```javascript
const morgan = require('morgan');
const fs = require('fs');
const logFile = fs.createWriteStream('./logs/myLogFile.log', {flags: 'a'});
const logFileErrors = fs.createWriteStream('./logs/myLogFileErrors.log', {flags: 'a'});

app.use(morgan('common', { stream: logFile }));
app.use(morgan('common', {
  stream: logFileErrors,
  skip: function (req, res) { return res.statusCode < 400 }
}));
```

## Features

- **Request Logging**: All HTTP requests are logged into `myLogFile.log`. This file serves as a comprehensive record of all incoming requests, including their HTTP method, URL, status code, response time, and other common data points.
- **Error Logging**: A separate file, `myLogFileErrors.log`, is dedicated to logging requests that result in HTTP status codes of 400 and above, indicating client or server errors. This separation simplifies the process of monitoring and analyzing erroneous requests.
- **Selective Logging**: The `skip` option in `morgan` is configured to exclude successful requests (status codes below 400) from being logged into the error log file, ensuring that `myLogFileErrors.log` only contains entries relevant to errors.

## Limitations

### Fetch Requests Logging

A significant portion of the application's traffic involves fetch requests, such as retrieving, deleting, and updating audio data. These operations are crucial for the application's functionality. However, `morgan` does not log these interactions when they are initiated from the client-side (e.g., through JavaScript's Fetch API) and do not result in direct HTTP requests to the Node.js server.

### Error Handler Logging

Errors handled by the custom error handler and redirected do not generate log entries in `morgan`. Since the error handling mechanism often results in redirection rather than the generation of a direct HTTP response with an error status code, these events are not captured by `morgan`'s logging criteria.