@echo off
echo Deploying updated Firestore rules...
firebase deploy --only firestore:rules
echo Rules deployed successfully!
pause