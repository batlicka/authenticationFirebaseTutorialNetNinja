const functions = require("firebase-functions");
const admin = require("firebase-admin");
//initial app server side, from now we can reach out user authenticaton
//use this admin SDK
admin.initializeApp();

//if is called exports.addAdminRole from front-end then is fired call back function in "onCall"
//data - email and so on, context - about authentication
exports.addAdminRole = functions.https.onCall((data, context) => {
  // get user and add admin custom claim
  return admin
    .auth()
    .getUserByEmail(data.email)
    .then((user) => {
      return admin.auth().setCustomUserClaims(user.uid, {
        admin: true,
      });
    })
    .then(() => {
      return {
        message: `Success! ${data.email} has been made an admin.`,
      };
    })
    .catch((err) => {
      return err;
    });
});
