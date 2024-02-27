# Endpoint and Functionality Documentation

## Endpoint Overview

This documentation outlines the purpose and functionality of specific endpoints and functions within a Node.js application that interfaces with a Django backend for file processing. The application uses Express for routing and Multer for handling file uploads.

### Endpoints

#### 1. Main Page

- **GET** `/`
  - **Description**: Renders the main page of the application, displaying steps and benefits dynamically passed to the template.
  - **Response**: The main page is rendered with `steps` and `benefits` variables.

#### 2. File Upload

- **POST** `/file`
  - **Description**: Handles file uploads. The uploaded file is temporarily stored and then sent to a Django backend for processing.
  - **Middleware**: `upload.single('file')` - This Multer middleware handles the incoming file, ensuring a single file upload and storing it temporarily.
  - **Function**: `redirectToDjango` - After the file is uploaded, this function takes over to send the file to the Django backend.
  - **Response**: Depending on the outcome of the Django processing, this can vary. Successful processing results in forwarding the Django response.

#### 3. Favicon

- **GET** `/favicon.ico`
  - **Description**: A simple route to avoid favicon requests from cluttering logs or processing. It returns a 204 No Content response.
  - **Response**: HTTP 204 No Content.

#### 4. Error Page

- **GET** `/error-page`
  - **Description**: Renders an error page with a custom message. The message can be passed as a query parameter.
  - **Response**: The error page is rendered, displaying the provided error message.

### Functionality: `redirectToDjango`

The `redirectToDjango` function is central to the application's integration with a Django backend. It's responsible for forwarding uploaded files to a specified Django endpoint for further processing.

#### Process:

1. **File Check**: Initially, it checks if a file has been uploaded. If not, it responds with a 400 status, indicating a bad request.

2. **Form Data Preparation**: For an uploaded file, it creates a `FormData` object and appends the file stream. This object is used to send the file to the Django server.

3. **Django Request**: It then makes a POST request to the Django backend (`/transcribe/file/` endpoint), passing along the file within the form data.

4. **Error Handling**: Comprehensive error handling is in place to catch and appropriately respond to various issues, such as network errors, no response from the Django server, or Django-specific errors.

5. **Response Forwarding**: If the request to Django is successful, the function forwards the Django response back to the client.

#### Error Handling Scenarios:

- **Django Errors**: If the Django server responds with an error (e.g., a status code outside the 2xx range), the error details and status are forwarded to the client.

- **No Response**: In case no response is received from the Django server (e.g., network issues), a 500 status is returned with a message indicating the issue.

- **Request Setup Errors**: Any errors encountered while setting up the request to Django (not related to the actual network request) result in a 500 status and an error message.

## Usage

This documentation provides a clear understanding of the application's routing and its integration with a Django backend for file processing. The `redirectToDjango` function plays a crucial role in this integration, handling file uploads, error management, and response forwarding.