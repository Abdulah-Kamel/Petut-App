import admin from 'firebase-admin';

// Initialize Firebase Admin SDK with your credentials
admin.initializeApp({
    credential: admin.credential.applicationDefault(),
});

async function deleteAllUsers() {
    let nextPageToken;
    do {
        // Fetch the next page of users
        const listUsersResult = await admin.auth().listUsers(1000, nextPageToken);
        listUsersResult.users.forEach((userRecord) => {
            console.log('Deleting user:', userRecord.uid);
            // Delete the user
            admin.auth().deleteUser(userRecord.uid)
                .then(() => {
                    console.log(`Successfully deleted user: ${userRecord.uid}`);
                })
                .catch((error) => {
                    console.log('Error deleting user:', error);
                });
        });
        nextPageToken = listUsersResult.pageToken;
    } while (nextPageToken); // Keep fetching the next batch until all users are deleted
}

// Call the function to delete users
deleteAllUsers();
