#!/usr/bin/env node

/**
 * Script de prueba para la función manage-users
 * Simula las llamadas que hace el frontend
 */

const { Client, Functions } = require('node-appwrite');

// Configuración (debería coincidir con tu configuración de Appwrite)
const ENDPOINT = process.env.REACT_APP_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
const PROJECT_ID = process.env.REACT_APP_APPWRITE_PROJECT_ID || 'your_project_id';
const FUNCTION_ID = process.env.REACT_APP_APPWRITE_MANAGE_USERS_FUNCTION_ID || 'your_function_id';

console.log('🧪 Testing manage-users function...');
console.log('Endpoint:', ENDPOINT);
console.log('Project ID:', PROJECT_ID);
console.log('Function ID:', FUNCTION_ID);
console.log('');

// Inicializar cliente de Appwrite
const client = new Client();
client
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID);

const functions = new Functions(client);

// Función para probar la función manage-users
async function testFunction(action, payload = {}) {
    console.log(`\n--- Testing action: ${action} ---`);
    console.log('Payload:', JSON.stringify(payload, null, 2));
    
    try {
        const result = await functions.createExecution(
            FUNCTION_ID,
            JSON.stringify({ action, ...payload }),
            false // async
        );
        
        console.log('✅ Function executed successfully');
        console.log('Status:', result.status);
        console.log('Response:', result.responseBody);
        
        if (result.status === 'completed') {
            try {
                const responseData = JSON.parse(result.responseBody);
                console.log('Parsed response:', JSON.stringify(responseData, null, 2));
            } catch (parseError) {
                console.log('⚠️ Response is not valid JSON:', result.responseBody);
            }
        } else {
            console.log('❌ Function execution failed');
            console.log('Error code:', result.responseStatusCode);
            console.log('Error body:', result.responseBody);
        }
        
    } catch (error) {
        console.error('❌ Error calling function:', error.message);
        console.error('Error details:', error);
    }
}

// Función principal de prueba
async function runTests() {
    console.log('🚀 Starting function tests...\n');
    
    // Test 1: List users
    await testFunction('list');
    
    // Test 2: List teams
    await testFunction('teamList');
    
    // Test 3: Create user (solo si tienes permisos)
    // await testFunction('create', {
    //     data: {
    //         email: 'test@example.com',
    //         password: 'password123',
    //         name: 'Test User'
    //     }
    // });
    
    // Test 4: Create team (solo si tienes permisos)
    // await testFunction('teamCreate', {
    //     data: {
    //         name: 'Test Team'
    //     }
    // });
    
    // Test 5: Invalid action
    await testFunction('invalidAction');
    
    console.log('\n✨ Tests completed!');
    console.log('\n📋 Next steps:');
    console.log('1. Check the Appwrite console logs for detailed function execution logs');
    console.log('2. Verify that the function is deployed and active');
    console.log('3. Check that the API key has the correct permissions');
    console.log('4. Verify that the environment variables are set correctly');
}

// Ejecutar tests si se llama directamente
if (require.main === module) {
    runTests().catch(console.error);
}

module.exports = { testFunction, runTests };
