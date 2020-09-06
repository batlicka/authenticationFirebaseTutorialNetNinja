const pozdrav = (arg) => {
  console.log("hello " + arg);
};

//GET DATA FROM FIRESTORE
// db.collection('guides').get().then() .......je asynchronní task, může trvat různě dlouho, když je dokončen je vyhozena callback function
//callback funkce vezme odpověď z db.collection('guides').get()

// listen for auth status changes
auth.onAuthStateChanged((user) => {
  if (user) {
    console.log("user is logged in as" + user.email);
    db.collection("guides").onSnapshot(
      (snapshot) => {
        setupGuides(snapshot.docs);
      },
      (err) => console.log(err.message)
    );
    setupUI(user);
    // //load data from database after represh page - there si no listener
    // db.collection("guides")
    //   .get()
    //   .then((snapshot) => {
    //     setupGuides(snapshot.docs);
    //   });
  } else {
    setupGuides([]);
    setupUI();
  }
});

//create new guide
const createForm = document.querySelector("#create-form");
createForm.addEventListener("submit", (e) => {
  e.preventDefault();
  db.collection("guides")
    .add({
      title: createForm["title"].value,
      content: createForm["content"].value,
    })
    .then(() => {
      // close the create modal & reset form
      const modal = document.querySelector("#modal-create");
      M.Modal.getInstance(modal).close();
      createForm.reset();
    })
    .catch((err) => {
      console.log(err.message);
    });
});

// signup
const signupForm = document.querySelector("#signup-form");
signupForm.addEventListener("submit", (e) => {
  e.preventDefault();
  // get user info
  const email = signupForm["signup-email"].value;
  const password = signupForm["signup-password"].value;
  // sign up the user
  auth
    .createUserWithEmailAndPassword(email, password)
    .then((cred) => {
      //when we add colleciont "users" firestore automatically create colleciton and it's ID
      return db
        .collection("users")
        .doc(cred.user.uid)
        .set({ bio: signupForm["signup-bio"].value });
    })
    .then(() => {
      // close the signup modal & reset form
      const modal = document.querySelector("#modal-signup");
      M.Modal.getInstance(modal).close();
      signupForm.reset();
    });
});

// logout
const logout = document.querySelector("#logout");
logout.addEventListener("click", (e) => {
  e.preventDefault();
  auth.signOut().then(() => {
    console.log("user loged out");
  });
});

// login
const loginForm = document.querySelector("#login-form");
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // get user info
  const email = loginForm["login-email"].value;
  const password = loginForm["login-password"].value;

  // log the user in
  auth.signInWithEmailAndPassword(email, password).then((cred) => {
    console.log("user" + cred.user.email + "was logged in");
    // close the signup modal & reset form
    const modal = document.querySelector("#modal-login");
    M.Modal.getInstance(modal).close();
    loginForm.reset();
  });
});
