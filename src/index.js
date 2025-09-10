const { Client, Users, ID, Teams } = require('node-appwrite');
const fetch = require('node-fetch');

module.exports = async ({ req, res }) => {
    console.log("=== MANAGE-USERS FUNCTION START ===");
    console.log("Timestamp:", new Date().toISOString());
    console.log("Code Version: 5.0 (Enhanced Logging)");
    
    // Log request details
    console.log("--- REQUEST DETAILS ---");
    console.log("Request method:", req.method);
    console.log("Request headers:", JSON.stringify(req.headers, null, 2));
    console.log("Request body (raw):", req.body);
    console.log("Request bodyJson:", JSON.stringify(req.bodyJson, null, 2));
    
    // Log environment variables (without sensitive data)
    console.log("--- ENVIRONMENT VARIABLES ---");
    console.log("APPWRITE_FUNCTION_PROJECT_ID:", process.env.APPWRITE_FUNCTION_PROJECT_ID ? "SET" : "NOT SET");
    console.log("APPWRITE_FUNCTION_API_KEY:", process.env.APPWRITE_FUNCTION_API_KEY ? "SET" : "NOT SET");
    console.log("APPWRITE_FUNCTION_ENDPOINT:", process.env.APPWRITE_FUNCTION_ENDPOINT || "NOT SET");
    console.log("APP_URL:", process.env.APP_URL || "NOT SET");
    
    // Initialize Appwrite client
    console.log("--- INITIALIZING APPWRITE CLIENT ---");
    const client = new Client();
    const users = new Users(client);
    const teams = new Teams(client);

    try {
        // Configure client
        console.log("Configuring Appwrite client...");
        const endpoint = process.env.APPWRITE_FUNCTION_ENDPOINT || 'http://appwrite/v1';
        console.log("Using endpoint:", endpoint);
        console.log("Project ID:", process.env.APPWRITE_FUNCTION_PROJECT_ID);
        console.log("API Key present:", !!process.env.APPWRITE_FUNCTION_API_KEY);

    client
            .setEndpoint(endpoint)
        .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
        .setKey(process.env.APPWRITE_FUNCTION_API_KEY);
        console.log("Client configured successfully");

        // Test connectivity before proceeding
        console.log("--- TESTING CONNECTIVITY ---");
        try {
            // Try to make a simple call to test connectivity
            const testCall = await client.call('GET', '/health', {}, {});
            console.log("Connectivity test successful");
        } catch (connectivityError) {
            console.log("Connectivity test failed, but continuing...");
            console.log("Connectivity error:", connectivityError.message);
        }

        // Parse request data
        console.log("--- PARSING REQUEST DATA ---");
        const { action, userId, data, teamId, userEmail } = req.bodyJson;
        console.log("Parsed action:", action);
        console.log("Parsed userId:", userId);
        console.log("Parsed teamId:", teamId);
        console.log("Parsed userEmail:", userEmail);
        console.log("Parsed data:", JSON.stringify(data, null, 2));

        // Validate required fields
        if (!action) {
            console.error("ERROR: No action provided in request");
            return res.json({ error: 'No action provided', success: false }, 400);
        }

        console.log("--- EXECUTING ACTION ---");
        console.log("Action:", action);

        switch (action) {
            case 'list':
                console.log("Executing: List users");
                try {
                const userList = await users.list();
                    console.log("Users retrieved successfully. Count:", userList.total);
                    console.log("Response data:", JSON.stringify(userList, null, 2));
                return res.json(userList);
                } catch (error) {
                    console.error("Error listing users:", error);
                    throw error;
                }

            case 'create':
                console.log("Executing: Create user");
                console.log("User data:", JSON.stringify(data, null, 2));
                try {
                    if (!data.email || !data.password || !data.name) {
                        throw new Error('Missing required fields: email, password, or name');
                    }
                const newUser = await users.create(
                    ID.unique(),
                    data.email,
                    null, // phone (optional)
                    data.password,
                    data.name
                );
                    console.log("User created successfully:", newUser.$id);
                return res.json(newUser);
                } catch (error) {
                    console.error("Error creating user:", error);
                    throw error;
                }

            case 'update':
                console.log("Executing: Update user");
                console.log("User ID:", userId);
                console.log("Update data:", JSON.stringify(data, null, 2));
                try {
                    if (!userId) {
                        throw new Error('User ID is required for update');
                    }
                const { name, email, password } = data;
                if (name) {
                        console.log("Updating name to:", name);
                    await users.updateName(userId, name);
                }
                if (email) {
                        console.log("Updating email to:", email);
                    await users.updateEmail(userId, email);
                }
                if (password) {
                        console.log("Updating password");
                    await users.updatePassword(userId, password);
                }
                const updatedUser = await users.get(userId);
                    console.log("User updated successfully");
                return res.json(updatedUser);
                } catch (error) {
                    console.error("Error updating user:", error);
                    throw error;
                }

            case 'delete':
                console.log("Executing: Delete user");
                console.log("User ID:", userId);
                try {
                    if (!userId) {
                        throw new Error('User ID is required for delete');
                    }
                await users.delete(userId);
                    console.log("User deleted successfully");
                return res.json({ success: true });
                } catch (error) {
                    console.error("Error deleting user:", error);
                    throw error;
                }

            case 'updateStatus':
                console.log("Executing: Update user status");
                console.log("User ID:", userId);
                console.log("Status:", data.status);
                try {
                    if (!userId) {
                        throw new Error('User ID is required for status update');
                    }
                const updatedStatus = await users.updateStatus(userId, data.status);
                    console.log("User status updated successfully");
                return res.json(updatedStatus);
                } catch (error) {
                    console.error("Error updating user status:", error);
                    throw error;
                }

            case 'createPasswordRecovery':
                console.log("Executing: Create password recovery");
                console.log("User ID:", userId);
                try {
                    if (!userId) {
                        throw new Error('User ID is required for password recovery');
                    }
                // 1. Get the user's email from their userId
                const user = await users.get(userId);
                const userEmail = user.email;
                    console.log("User email for recovery:", userEmail);

                // 2. Call the /account/recovery endpoint using the client's generic `call` method
                const result = await client.call('POST', '/account/recovery', {
                    'content-type': 'application/json',
                }, {
                    email: userEmail,
                    url: `${process.env.APP_URL}/reset-password`,
                });
                    console.log("Password recovery initiated successfully");
                return res.json(result);
                } catch (error) {
                    console.error("Error creating password recovery:", error);
                    throw error;
                }

            case 'updateVerification':
                console.log("Executing: Update user verification");
                console.log("User ID:", userId);
                try {
                    if (!userId) {
                        throw new Error('User ID is required for verification update');
                    }
                const updatedVerification = await users.updateEmailVerification(userId, true);
                    console.log("User verification updated successfully");
                return res.json(updatedVerification);
                } catch (error) {
                    console.error("Error updating user verification:", error);
                    throw error;
                }

            case 'teamList':
                console.log("Executing: List teams");
                try {
                const teamList = await teams.list();
                    console.log("Teams retrieved successfully. Count:", teamList.total);
                    console.log("Response data:", JSON.stringify(teamList, null, 2));
                return res.json(teamList);
                } catch (error) {
                    console.error("Error listing teams:", error);
                    throw error;
                }

            case 'teamCreate':
                console.log("Executing: Create team");
                console.log("Team data:", JSON.stringify(data, null, 2));
                try {
                    if (!data.name) {
                        throw new Error('Team name is required');
                    }
                const newTeam = await teams.create(ID.unique(), data.name);
                    console.log("Team created successfully:", newTeam.$id);
                return res.json(newTeam);
                } catch (error) {
                    console.error("Error creating team:", error);
                    throw error;
                }

            case 'teamUpdate':
                console.log("Executing: Update team");
                console.log("Team ID:", teamId);
                console.log("Update data:", JSON.stringify(data, null, 2));
                try {
                    if (!teamId) {
                        throw new Error('Team ID is required for update');
                    }
                const updatedTeam = await teams.updateName(teamId, data.name);
                    console.log("Team updated successfully");
                return res.json(updatedTeam);
                } catch (error) {
                    console.error("Error updating team:", error);
                    throw error;
                }

            case 'teamDelete':
                console.log("Executing: Delete team");
                console.log("Team ID:", teamId);
                try {
                    if (!teamId) {
                        throw new Error('Team ID is required for delete');
                    }
                await teams.delete(teamId);
                    console.log("Team deleted successfully");
                return res.json({ success: true });
                } catch (error) {
                    console.error("Error deleting team:", error);
                    throw error;
                }

            case 'teamAddMember':
                console.log("Executing: Add member to team");
                console.log("Team ID:", teamId);
                console.log("User Email received:", userEmail);
                console.log("User ID received:", userId);
                try {
                    if (!teamId || (!userEmail && !userId)) {
                        throw new Error('Team ID and either User Email or User ID are required for adding member');
                    }
                    
                    // Probar diferentes enfoques para agregar miembros
                    console.log("=== PROBANDO ENFOQUES DIFERENTES ===");
                    
                    let finalEmail = userEmail;
                    let finalName = '';
                    
                    if (userEmail) {
                        // Validar que el email sea válido con regex más estricto
                        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                        if (!emailRegex.test(userEmail)) {
                            throw new Error(`Invalid email format: ${userEmail}`);
                        }
                        
                        // Verificar que el email no esté vacío o solo espacios
                        const cleanEmail = userEmail.trim();
                        if (!cleanEmail || cleanEmail.length < 5) {
                            throw new Error(`Email too short or empty: ${userEmail}`);
                        }
                        
                        finalEmail = cleanEmail;
                        finalName = cleanEmail.split('@')[0];
                        
                        // Debugging adicional del email
                        console.log("Email validation passed:", cleanEmail);
                        console.log("Email length:", cleanEmail.length);
                        console.log("Email characters:", cleanEmail.split('').map(c => c.charCodeAt(0)));
                        console.log("Email contains special chars:", /[^\x00-\x7F]/.test(cleanEmail));
                    } else if (userId) {
                        // Si solo tenemos userId, necesitamos obtener el email del usuario
                        console.log("Fetching user email from userId:", userId);
                        const user = await users.get(userId);
                        finalEmail = user.email;
                        finalName = user.name || user.email.split('@')[0];
                        console.log("User email from database:", finalEmail);
                    }
                    
                    console.log("Email validation passed, creating membership...");
                    // Corregir URL para evitar doble barra
                    const redirectUrl = `${process.env.APP_URL.replace(/\/$/, '')}/team-invitation`;
                    
                    console.log("Creating membership with params:", {
                        teamId,
                        email: finalEmail,
                        name: finalName,
                        roles: data.roles || ['member'],
                        url: redirectUrl
                    });
                    
                    // ENFOQUE 1: createMembership con parámetros en orden estándar
                    try {
                        console.log("--- ENFOQUE 1: createMembership con orden estándar ---");
                        const member1 = await teams.createMembership(
                            teamId, 
                            finalEmail, // email
                            data.roles || ['member'], // roles
                            redirectUrl, // url
                            finalName // name
                        );
                        console.log("✅ ENFOQUE 1 EXITOSO:", member1);
                        return res.json(member1);
                    } catch (error1) {
                        console.log("❌ ENFOQUE 1 FALLÓ:", error1.message);
                    }
                    
                    // ENFOQUE 1B: Probar con email en minúsculas
                    try {
                        console.log("--- ENFOQUE 1B: createMembership con email en minúsculas ---");
                        const member1b = await teams.createMembership(
                            teamId, 
                            finalEmail.toLowerCase(), // email en minúsculas
                            data.roles || ['member'], // roles
                            redirectUrl, // url
                            finalName // name
                        );
                        console.log("✅ ENFOQUE 1B EXITOSO:", member1b);
                        return res.json(member1b);
                    } catch (error1b) {
                        console.log("❌ ENFOQUE 1B FALLÓ:", error1b.message);
                    }
                    
                    // ENFOQUE 2: createMembership sin URL
                    try {
                        console.log("--- ENFOQUE 2: createMembership sin URL ---");
                        const member2 = await teams.createMembership(
                            teamId, 
                            finalEmail, // email
                            data.roles || ['member'], // roles
                            finalName // name
                        );
                        console.log("✅ ENFOQUE 2 EXITOSO:", member2);
                        return res.json(member2);
                    } catch (error2) {
                        console.log("❌ ENFOQUE 2 FALLÓ:", error2.message);
                    }
                    
                    // ENFOQUE 3: createMembership con roles fijos
                    try {
                        console.log("--- ENFOQUE 3: createMembership con roles fijos ---");
                        const member3 = await teams.createMembership(
                            teamId, 
                            finalEmail, // email
                            ['member'], // roles fijos
                            redirectUrl, // url
                            finalName // name
                        );
                        console.log("✅ ENFOQUE 3 EXITOSO:", member3);
                        return res.json(member3);
                    } catch (error3) {
                        console.log("❌ ENFOQUE 3 FALLÓ:", error3.message);
                    }
                    
                    // ENFOQUE 4: Usar userId en lugar de email (si está disponible)
                    if (userId) {
                        try {
                            console.log("--- ENFOQUE 4: createMembership con userId ---");
                            const member4 = await teams.createMembership(
                                teamId, 
                                userId, // userId en lugar de email
                                data.roles || ['member'], // roles
                                redirectUrl, // url
                                finalName // name
                            );
                            console.log("✅ ENFOQUE 4 EXITOSO:", member4);
                            return res.json(member4);
                        } catch (error4) {
                            console.log("❌ ENFOQUE 4 FALLÓ:", error4.message);
                        }
                    }
                    
                    // ENFOQUE 5: API directa con fetch
                    try {
                        console.log("--- ENFOQUE 5: API directa con fetch ---");
                        const response = await fetch(`${process.env.APPWRITE_FUNCTION_ENDPOINT}/teams/${teamId}/memberships`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'X-Appwrite-Project': process.env.APPWRITE_FUNCTION_PROJECT_ID,
                                'X-Appwrite-Key': process.env.APPWRITE_FUNCTION_API_KEY
                            },
                            body: JSON.stringify({
                                email: finalEmail,
                                roles: data.roles || ['member'],
                                url: redirectUrl,
                                name: finalName
                            })
                        });
                        
                        if (!response.ok) {
                            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                        }
                        
                        const member5 = await response.json();
                        console.log("✅ ENFOQUE 5 EXITOSO:", member5);
                        return res.json(member5);
                    } catch (error5) {
                        console.log("❌ ENFOQUE 5 FALLÓ:", error5.message);
                        throw new Error(`Todos los enfoques fallaron. Último error: ${error5.message}`);
                    }
                } catch (error) {
                    console.error("Error adding member to team:", error);
                    throw error;
                }

            case 'teamRemoveMember':
                console.log("Executing: Remove member from team");
                console.log("Team ID:", teamId);
                console.log("Membership ID:", data.membershipId);
                try {
                    if (!teamId || !data.membershipId) {
                        throw new Error('Team ID and Membership ID are required for removing member');
                    }
                    await teams.deleteMembership(teamId, data.membershipId);
                    console.log("Member removed from team successfully");
                    return res.json({ success: true });
                } catch (error) {
                    console.error("Error removing member from team:", error);
                    throw error;
                }

            case 'teamListMembers':
                console.log("Executing: List team members");
                console.log("Team ID:", teamId);
                try {
                    if (!teamId) {
                        throw new Error('Team ID is required for listing members');
                    }
                    const members = await teams.listMemberships(teamId);
                    console.log("Team members retrieved successfully. Count:", members.total);
                    return res.json(members);
                } catch (error) {
                    console.error("Error listing team members:", error);
                    throw error;
                }

            case 'teamUpdateMemberRole':
                console.log("Executing: Update member role");
                console.log("Team ID:", teamId);
                console.log("Membership ID:", data.membershipId);
                console.log("New roles:", data.roles);
                try {
                    if (!teamId || !data.membershipId || !data.roles) {
                        throw new Error('Team ID, Membership ID and roles are required for updating member role');
                    }
                    const updatedMember = await teams.updateMembershipRoles(teamId, data.membershipId, data.roles);
                    console.log("Member role updated successfully");
                    return res.json(updatedMember);
                } catch (error) {
                    console.error("Error updating member role:", error);
                    throw error;
                }

            case 'teamAcceptInvitation':
                console.log("Executing: Accept team invitation");
                console.log("Membership ID:", data.membershipId);
                console.log("Secret:", data.secret);
                try {
                    if (!data.membershipId || !data.secret) {
                        throw new Error('Membership ID and Secret are required for accepting invitation');
                    }
                    const result = await teams.updateMembershipStatus(data.membershipId, data.secret, 'accepted');
                    console.log("Invitation accepted successfully");
                    return res.json({ success: true, data: result });
                } catch (error) {
                    console.error("Error accepting invitation:", error);
                    throw error;
                }

            case 'teamDeclineInvitation':
                console.log("Executing: Decline team invitation");
                console.log("Membership ID:", data.membershipId);
                console.log("Secret:", data.secret);
                try {
                    if (!data.membershipId || !data.secret) {
                        throw new Error('Membership ID and Secret are required for declining invitation');
                    }
                    const result = await teams.updateMembershipStatus(data.membershipId, data.secret, 'declined');
                    console.log("Invitation declined successfully");
                    return res.json({ success: true, data: result });
                } catch (error) {
                    console.error("Error declining invitation:", error);
                    throw error;
                }

            default:
                console.error("ERROR: Invalid action provided:", action);
                return res.json({ error: 'Invalid action', success: false }, 400);
        }
    } catch (error) { 
        console.error("=== FUNCTION ERROR ===");
        console.error("Error type:", error.constructor.name);
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
        console.error("Full error object:", JSON.stringify(error, null, 2));
        
        // Determine appropriate error response
        let statusCode = 500;
        let errorMessage = error.message || 'Unknown error occurred';
        
        if (error.message.includes('Unauthorized') || error.message.includes('unauthorized')) {
            statusCode = 401;
            errorMessage = 'Unauthorized access';
        } else if (error.message.includes('Forbidden') || error.message.includes('forbidden')) {
            statusCode = 403;
            errorMessage = 'Access forbidden';
        } else if (error.message.includes('Not Found') || error.message.includes('not found')) {
            statusCode = 404;
            errorMessage = 'Resource not found';
        } else if (error.message.includes('Validation') || error.message.includes('validation')) {
            statusCode = 400;
            errorMessage = 'Validation error: ' + error.message;
        }
        
        console.error("Returning error response:", { error: errorMessage, success: false, statusCode });
        return res.json({ error: errorMessage, success: false }, statusCode);
    }
    
    console.log("=== MANAGE-USERS FUNCTION END ===");
};

