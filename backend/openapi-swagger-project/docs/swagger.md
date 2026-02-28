# Swagger API Documentation

This document provides an overview of the API endpoints defined in the OpenAPI specification for the project.

## Base URL

The base URL for all API endpoints is: `http://localhost:3000`

## Endpoints

### [GET] /example

- **Description**: Retrieves an example resource.
- **Response**:
  - **200 OK**: Returns the example resource.
  
### [POST] /example

- **Description**: Creates a new example resource.
- **Request Body**:
  - **Content-Type**: application/json
  - **Schema**: 
    ```json
    {
      "name": "string",
      "value": "string"
    }
    ```
- **Response**:
  - **201 Created**: Returns the created resource.

### [PUT] /example/{id}

- **Description**: Updates an existing example resource.
- **Parameters**:
  - **id**: The ID of the resource to update.
- **Request Body**:
  - **Content-Type**: application/json
  - **Schema**: 
    ```json
    {
      "name": "string",
      "value": "string"
    }
    ```
- **Response**:
  - **200 OK**: Returns the updated resource.

### [DELETE] /example/{id}

- **Description**: Deletes an example resource.
- **Parameters**:
  - **id**: The ID of the resource to delete.
- **Response**:
  - **204 No Content**: Indicates that the resource was successfully deleted.

## Error Responses

- **400 Bad Request**: The request was invalid.
- **404 Not Found**: The requested resource was not found.
- **500 Internal Server Error**: An error occurred on the server. 

## Authentication

This API uses token-based authentication. Include the token in the `Authorization` header as follows:

```
Authorization: Bearer <token>
```

## Contact

For any questions or issues, please contact the API support team at support@example.com.