const { Client, Users, ID, Teams } = require('node-appwrite');

module.exports = async ({ req, res }) => {
    console.log("--- Running Code Version 4.0 ---");
    console.log('Full req object:', req);
    console.log('process.env object:', process.env);
    const client = new Client();
    const users = new Users(client);
    const teams = new Teams(client);

    

    client
        .setEndpoint('http://appwrite/v1')
        .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
        .setKey(process.env.APPWRITE_FUNCTION_API_KEY);

    try {
        const { action, userId, data, teamId } = req.bodyJson;

        switch (action) {
            case 'list':
                const userList = await users.list();
                return res.json(userList);
                break;

            case 'create':
                const newUser = await users.create(
                    ID.unique(),
                    data.email,
                    null, // phone (optional)
                    data.password,
                    data.name
                );
                return res.json(newUser);
                break;

            case 'update':
                const { name, email, password } = data;
                if (name) {
                    await users.updateName(userId, name);
                }
                if (email) {
                    await users.updateEmail(userId, email);
                }
                if (password) {
                    await users.updatePassword(userId, password);
                }
                const updatedUser = await users.get(userId);
                return res.json(updatedUser);
                break;

            case 'delete':
                await users.delete(userId);
                return res.json({ success: true });
                break;

            case 'updateStatus':
                const updatedStatus = await users.updateStatus(userId, data.status);
                return res.json(updatedStatus);
                break;

            case 'createPasswordRecovery':
                // 1. Get the user's email from their userId
                const user = await users.get(userId);
                const userEmail = user.email;

                // 2. Call the /account/recovery endpoint using the client's generic `call` method
                const result = await client.call('POST', '/account/recovery', {
                    'content-type': 'application/json',
                }, {
                    email: userEmail,
                    url: `${process.env.APP_URL}/reset-password`,
                });

                return res.json(result);
                break;

            case 'updateVerification':
                const updatedVerification = await users.updateEmailVerification(userId, true);
                return res.json(updatedVerification);
                break;

            case 'teamList':
                const teamList = await teams.list();
                return res.json(teamList);
                break;

            case 'teamCreate':
                const newTeam = await teams.create(ID.unique(), data.name);
                return res.json(newTeam);
                break;

            case 'teamUpdate':
                const updatedTeam = await teams.updateName(teamId, data.name);
                return res.json(updatedTeam);
                break;

            case 'teamDelete':
                await teams.delete(teamId);
                return res.json({ success: true });
                break;

            default:
                return res.json({ error: 'Invalid action' }, 400);
                break;
        }
    } catch (error) { 
        console.error(error);
        return res.json({ error: error.message }, 500);
    }
};

