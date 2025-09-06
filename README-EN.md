# Appwrite Function: manage-users

This Appwrite function provides a centralized API for managing user accounts within your Appwrite project. It is designed to be triggered by HTTP executions from your frontend or other services.

## Supported Actions

The function supports the following actions, specified in the `action` field of the JSON payload:

-   **`list`**: Lists all users in the project.
-   **`create`**: Creates a new user.
    -   Payload: `{ "action": "create", "data": { "email": "...", "password": "...", "name": "..." } }`
-   **`update`**: Updates the details of an existing user (name, email, password).
    -   Payload: `{ "action": "update", "userId": "...", "data": { "name": "...", "email": "...", "password": "..." } }`
-   **`delete`**: Deletes a user.
    -   Payload: `{ "action": "delete", "userId": "..." }`
-   **`updateStatus`**: Enables or disables a user.
    -   Payload: `{ "action": "updateStatus", "userId": "...", "data": { "status": true/false } }`
-   **`createPasswordRecovery`**: Initiates a password recovery process for a user.
    -   Payload: `{ "action": "createPasswordRecovery", "userId": "..." }`
    -   **Important**: Requires SMTP configuration in your Appwrite instance and the `APP_URL` host to be registered as a platform.
-   **`updateVerification`**: Marks a user's email as verified.
    -   Payload: `{ "action": "updateVerification", "userId": "..." }`

-   **`teamList`**: Lists all teams in the project.
    -   Payload: `{ "action": "teamList" }`
-   **`teamCreate`**: Creates a new team.
    -   Payload: `{ "action": "teamCreate", "data": { "name": "..." } }`
-   **`teamUpdate`**: Updates the name of an existing team.
    -   Payload: `{ "action": "teamUpdate", "teamId": "...", "data": { "name": "..." } }`
-   **`teamDelete`**: Deletes a team.
    -   Payload: `{ "action": "teamDelete", "teamId": "..." }`

## Configuration

This function depends on several environment variables, which are typically configured in the Appwrite console, in the "Settings" tab of the function:

-   `APPWRITE_FUNCTION_PROJECT_ID`: Your Appwrite project ID.
-   `APPWRITE_FUNCTION_API_KEY`: An API key with `users.read` and `users.write` permissions.
-   `APPWRITE_FUNCTION_ENDPOINT`: The Appwrite API endpoint (e.g., `http://appwrite/v1` for internal Docker communication, or `http://your_ip/v1` for external access).
-   `APP_URL`: The base URL of your frontend application (e.g., `http://your_ip:3000`). This is crucial for password recovery redirect URLs.

## Deployment

This function is typically deployed by packaging its contents into a `tar.gz` file and uploading it through the Appwrite console.

## Troubleshooting `createPasswordRecovery`

If `createPasswordRecovery` fails, make sure that:
1.  **SMTP is configured** in your Appwrite instance.
2.  The host specified in `APP_URL` (e.g., `192.168.1.104`) is added as a **"Web App" platform** in your Appwrite project settings.
