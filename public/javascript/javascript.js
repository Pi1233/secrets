document.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname === "/register") {
    const toggle = document.getElementById("togglePassword");
    password = document.getElementById("signpass");

    password.type = "password";

    toggle.addEventListener("change", () => {
      if (toggle.checked) {
        password.type = "text";
      } else {
        password.type = "password";
      }
    });
    document.getElementById("Ssubmitbtn").addEventListener("click", (event) => {
      emailtest = document.getElementById("signemail");

      regexemail = /^[a-zA-Z0-9.+%-_]+@[a-zA-Z0-9_]+\.[a-zA-Z]{2,}$/;
      regexpass =
        /^(?=.*\d)(?=(?:.*[A-Z]){2,})(?=(?:.*[a-z]){2,})(?=.*\d)(?=.*[!@#$%^&*()\-_+={}[\]'":;?\/<,>.~`]).{6,30}$/;

      testedemail = regexemail.test(emailtest.value);
      testedpassword = regexpass.test(password.value);

      emailerr = document.getElementById("emailerr");
      passerr = document.getElementById("passerr");

      event.preventDefault();

      if (testedemail == false) {
        emailerr.style.display = "";
      } else {
        emailerr.style.display = "none";
      }
      if (testedpassword == false) {
        passerr.style.display = "";
      } else {
        passerr.style.display = "none";
      }
      if (testedpassword == true && testedemail == true) {
        const shouldSubmit = confirm("Do you really want to submit?");
        if (shouldSubmit) {
          const form = document.getElementById("registerform");
          form.submit();
        }
      }
    });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname == "/login") {
    const toggle = document.getElementById("passtogglelogin");
    const password = document.getElementById("loginpass");

    password.type = "password";

    toggle.addEventListener("change", () => {
      if (toggle.checked == false) {
        password.type = "password";
      } else {
        password.type = "text";
      }
    });

    const loginbtn = document.getElementById("loginbtn");

    loginbtn.addEventListener("click", (event) => {
      const checkemail = document.getElementById("loginemail");
      const checkpass = document.getElementById("loginpass");

      const regexpass =
        /^(?=(?:.*[A-Z]{2,}))(?=.*\d)(?=(?:.*[a-z]){2,})(?=.*\d)(?=.*[!@#$%^&*()\-_+={}[\]'":;?\/<,>.~`]).{6,30}$/;
      const regexemail = /^[a-zA-Z0-9.+%-_]+@[a-zA-Z0-9_]+\.[a-zA-Z]{2,}$/;

      const checkedemail = checkemail.test(regexemail);
      const checkedpass = checkpass.test(regexpass);

      event.preventDefault();

      if (checkedemail == false) {
        document.getElementsByClassName("loginemail").style.display = "none";
      } else {
        document.getElementsByClassName("loginemail").style.display = "";
      }
      if (checkedpass == false) {
        document.getElementsByClassName("loginpass").style.display = "none";
      } else {
        document.getElementsByClassName("loginemail").style.display = "";
      }
      if (checkedemail == true && checkedpass == true) {
        form = document.getElementById("loginform");
        form.submit();
      }
    });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname == "/secrets") {
    fetch("/userinfo", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Not authenticated");
        return res.json();
      })
      .then((data) => {
        document.getElementById(
          "user-id0"
        ).textContent = `Your secret userId: `;
        document.getElementById("user-id1").textContent = `${data.id}`;
      })
      .catch((err) => {
        console.log("User not authenticated or error:", err.message);
      });
  }
});
