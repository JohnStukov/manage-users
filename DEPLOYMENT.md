# Guía de Despliegue - manage-users Function

## 📋 Resumen de Cambios

La función `manage-users` ha sido mejorada con:
- ✅ **Logs detallados** para debugging
- ✅ **Mejor manejo de errores** con códigos de estado apropiados
- ✅ **Validación de entrada** robusta
- ✅ **Mensajes de error específicos** para cada tipo de problema

## 🚀 Pasos para Desplegar

### 1. Preparar el Archivo de Despliegue

```bash
# Navegar a la carpeta manage-users
cd manage-users

# Crear archivo tar.gz para desplegar
tar -czf manage-users.tar.gz src/ package.json
```

### 2. Subir a Appwrite

1. **Abrir la consola de Appwrite**
2. **Ir a Functions** en el menú lateral
3. **Crear nueva función** o **actualizar existente**:
   - Nombre: `manage-users`
   - Runtime: `Node.js 18`
4. **Subir el archivo** `manage-users.tar.gz`
5. **Configurar variables de entorno**:
   ```
   APPWRITE_FUNCTION_PROJECT_ID=tu_project_id
   APPWRITE_FUNCTION_API_KEY=tu_api_key_con_permisos_users
   APPWRITE_FUNCTION_ENDPOINT=https://cloud.appwrite.io/v1
   APP_URL=http://tu_dominio:3000
   ```

### 3. Configurar Permisos

Asegúrate de que la API key tenga estos permisos:
- ✅ `users.read`
- ✅ `users.write`
- ✅ `teams.read`
- ✅ `teams.write`

### 4. Probar la Función

```bash
# Ejecutar el script de prueba
node test-function.js
```

## 🔍 Verificar Logs

### En la Consola de Appwrite:
1. **Ir a Functions** → **manage-users**
2. **Hacer clic en "Logs"**
3. **Ejecutar una acción** desde el frontend
4. **Revisar los logs detallados**

### Logs que Verás:

```
=== MANAGE-USERS FUNCTION START ===
Timestamp: 2024-01-01T00:00:00.000Z
Code Version: 5.0 (Enhanced Logging)

--- REQUEST DETAILS ---
Request method: POST
Request headers: {...}
Request bodyJson: {"action":"list"}

--- ENVIRONMENT VARIABLES ---
APPWRITE_FUNCTION_PROJECT_ID: SET
APPWRITE_FUNCTION_API_KEY: SET
APPWRITE_FUNCTION_ENDPOINT: SET
APP_URL: SET

--- INITIALIZING APPWRITE CLIENT ---
Configuring Appwrite client...
Client configured successfully

--- PARSING REQUEST DATA ---
Parsed action: list
Parsed userId: undefined
Parsed teamId: undefined
Parsed data: undefined

--- EXECUTING ACTION ---
Action: list
Executing: List users
Users retrieved successfully. Count: 5
Response data: {...}
=== MANAGE-USERS FUNCTION END ===
```

## 🐛 Solución de Problemas

### Error: "Function not found"
- ✅ Verificar que la función esté desplegada
- ✅ Verificar que el FUNCTION_ID sea correcto

### Error: "Unauthorized"
- ✅ Verificar que la API key tenga permisos correctos
- ✅ Verificar que el PROJECT_ID sea correcto

### Error: "Empty response from function"
- ✅ Revisar los logs de la función en Appwrite
- ✅ Verificar que las variables de entorno estén configuradas

### Error: "Invalid JSON response"
- ✅ Revisar los logs para ver qué está devolviendo la función
- ✅ Verificar que la función esté funcionando correctamente

## 📊 Monitoreo

### Métricas a Revisar:
- ✅ **Tiempo de ejecución** de la función
- ✅ **Tasa de errores** en los logs
- ✅ **Uso de memoria** de la función
- ✅ **Logs de error** específicos

### Alertas Recomendadas:
- ⚠️ Función tardando más de 10 segundos
- ⚠️ Más de 5 errores por minuto
- ⚠️ Errores de autenticación repetidos

## 🔄 Actualizaciones Futuras

Para actualizar la función:
1. **Modificar el código** en `src/index.js`
2. **Crear nuevo tar.gz** con los cambios
3. **Subir a Appwrite** como nueva versión
4. **Probar** con el script de prueba
5. **Monitorear logs** para verificar funcionamiento

## 📞 Soporte

Si encuentras problemas:
1. **Revisar logs** de la función en Appwrite
2. **Verificar configuración** de variables de entorno
3. **Probar** con el script `test-function.js`
4. **Revisar permisos** de la API key
