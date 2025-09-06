# Función de Appwrite: manage-users

Esta función de Appwrite proporciona una API centralizada para gestionar cuentas de usuario dentro de tu proyecto de Appwrite. Está diseñada para ser activada mediante ejecuciones HTTP desde tu frontend u otros servicios.

## Acciones Soportadas

La función soporta las siguientes acciones, especificadas en el campo `action` del payload JSON:

-   **`list`**: Lista todos los usuarios en el proyecto.
-   **`create`**: Crea un nuevo usuario.
    -   Payload: `{ "action": "create", "data": { "email": "...", "password": "...", "name": "..." } }`
-   **`update`**: Actualiza los detalles de un usuario existente (nombre, email, contraseña).
    -   Payload: `{ "action": "update", "userId": "...", "data": { "name": "...", "email": "...", "password": "..." } }`
-   **`delete`**: Elimina un usuario.
    -   Payload: `{ "action": "delete", "userId": "..." }`
-   **`updateStatus`**: Habilita o deshabilita un usuario.
    -   Payload: `{ "action": "updateStatus", "userId": "...", "data": { "status": true/false } }`
-   **`createPasswordRecovery`**: Inicia un proceso de recuperación de contraseña para un usuario.
    -   Payload: `{ "action": "createPasswordRecovery", "userId": "..." }`
    -   **Importante**: Requiere configuración de SMTP en tu instancia de Appwrite y que el host de `APP_URL` esté registrado como una plataforma.
-   **`updateVerification`**: Marca el email de un usuario como verificado.
    -   Payload: `{ "action": "updateVerification", "userId": "..." }`

-   **`teamList`**: Lista todos los equipos en el proyecto.
    -   Payload: `{ "action": "teamList" }`
-   **`teamCreate`**: Crea un nuevo equipo.
    -   Payload: `{ "action": "teamCreate", "data": { "name": "..." } }`
-   **`teamUpdate`**: Actualiza el nombre de un equipo existente.
    -   Payload: `{ "action": "teamUpdate", "teamId": "...", "data": { "name": "..." } }`
-   **`teamDelete`**: Elimina un equipo.
    -   Payload: `{ "action": "teamDelete", "teamId": "..." }`

## Configuración

Esta función depende de varias variables de entorno, que normalmente se configuran en la consola de Appwrite, en la pestaña "Settings" de la función:

-   `APPWRITE_FUNCTION_PROJECT_ID`: El ID de tu proyecto de Appwrite.
-   `APPWRITE_FUNCTION_API_KEY`: Una clave API con permisos `users.read` y `users.write`.
-   `APPWRITE_FUNCTION_ENDPOINT`: El endpoint de la API de Appwrite (ej. `http://appwrite/v1` para comunicación interna de Docker, o `http://tu_ip/v1` para acceso externo).
-   `APP_URL`: La URL base de tu aplicación frontend (ej. `http://tu_ip:3000`). Esto es crucial para las URLs de redirección de recuperación de contraseña.

## Despliegue

Esta función se despliega típicamente empaquetando su contenido en un archivo `tar.gz` y subiéndolo a través de la consola de Appwrite.

## Solución de Problemas `createPasswordRecovery`

Si `createPasswordRecovery` falla, asegúrate de que:
1.  **SMTP esté configurado** en tu instancia de Appwrite.
2.  El host especificado en `APP_URL` (ej. `192.168.1.104`) esté añadido como una **plataforma "Web App"** en la configuración de tu proyecto de Appwrite.

