// ✅ Accordion and smooth scroll
document.querySelectorAll('.acc-head').forEach(head => {
  head.addEventListener('click', () => {
    const item = head.parentElement;
    const body = item.querySelector('.acc-body');
    const open = body.style.display === 'block';
    document.querySelectorAll('.acc-body').forEach(b => b.style.display = 'none');
    body.style.display = open ? 'none' : 'block';
  });
});

document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// ✅ Show/Hide password toggle
document.querySelectorAll(".toggle-password").forEach(btn => {
  btn.addEventListener("click", () => {
    const targetId = btn.getAttribute("data-target");
    const input = document.getElementById(targetId);
    if (!input) return;

    if (input.type === "password") {
      input.type = "text";
      btn.textContent = "🙈";
    } else {
      input.type = "password";
      btn.textContent = "👁";
    }
  });
});

// ✅ ENTER KEY for login/signup
document.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    const loginSubmit = document.querySelector("#loginSubmit");
    const signupSubmit = document.querySelector("#signupSubmit");
    if (loginSubmit && loginSubmit.offsetParent !== null) loginSubmit.click();
    else if (signupSubmit && signupSubmit.offsetParent !== null) signupSubmit.click();
  }
});

// ✅ Fetch accounts from account.json + localStorage
async function loadAccounts() {
  try {
    const response = await fetch("account.json");
    if (!response.ok) throw new Error("Failed to load account.json");
    const jsonAccounts = await response.json();

    const storedAccounts = JSON.parse(localStorage.getItem("accounts")) || [];
    const allAccounts = [...jsonAccounts, ...storedAccounts];
    return allAccounts;
  } catch (error) {
    console.error("⚠️ Could not load accounts:", error);
    return JSON.parse(localStorage.getItem("accounts")) || [];
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById('loginBtn');
  const loginSubmit = document.querySelector("#loginSubmit");
  const warningText = document.querySelector("#loginWarning");
  const googleLoginBtn = document.getElementById("google-login");
  const profileMenu = document.getElementById("profileMenu");
  const profileToggle = document.getElementById('profileToggle');
  const logoutBtn = document.getElementById("logoutBtn");
  const signupSubmit = document.getElementById("signupSubmit");
  const warning = document.getElementById("signupWarning");
  const rememberCheckbox = document.getElementById("rememberMe");
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");

  // ✅ Autofill remembered login
  const remembered = JSON.parse(localStorage.getItem("rememberedUser"));
  if (remembered) {
    if (usernameInput) usernameInput.value = remembered.username || "";
    if (passwordInput) passwordInput.value = remembered.password || "";
    if (rememberCheckbox) rememberCheckbox.checked = true;
  }

  // ✅ Redirect button to login page
  if (loginBtn) {
    loginBtn.addEventListener('click', () => window.location.href = 'login.html');
  }

  // ✅ LOGIN SYSTEM
  if (loginSubmit) {
    loginSubmit.addEventListener("click", async () => {
      const username = usernameInput.value.trim();
      const password = passwordInput.value.trim();
      warningText.style.display = "block";

      if (!username && !password) {
        warningText.textContent = "⚠️ Please enter your username and password.";
        return;
      }
      if (!username) {
        warningText.textContent = "⚠️ Please enter your username.";
        return;
      }
      if (!password) {
        warningText.textContent = "⚠️ Please enter your password.";
        return;
      }

      const accounts = await loadAccounts();
      const user = accounts.find(u => u.username === username);

      if (!user) {
        warningText.textContent = "⚠️ No account exists with that username.";
        return;
      }
      if (user.password !== password) {
        warningText.textContent = "⚠️ Incorrect password.";
        return;
      }

      // ✅ Handle "Remember Me"
      if (rememberCheckbox && rememberCheckbox.checked) {
        localStorage.setItem("rememberedUser", JSON.stringify({ username, password }));
      } else {
        localStorage.removeItem("rememberedUser");
      }

      // ✅ Successful login
      warningText.style.display = "none";
      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("currentUser", username);
      window.location.href = "index.html";
    });
  }

  // ✅ Show profile menu when logged in
  if (localStorage.getItem("loggedIn") === "true") {
    const currentUser = localStorage.getItem("currentUser");
    if (loginBtn) loginBtn.style.display = "none";
    if (profileMenu) profileMenu.style.display = "block";

    const profileName = document.querySelector(".profile-name");
    if (profileName && currentUser) profileName.textContent = currentUser;
  } else {
    if (loginBtn) loginBtn.style.display = "block";
    if (profileMenu) profileMenu.style.display = "none";
  }

  // ✅ Profile menu toggle
  if (profileToggle) {
    profileToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      profileMenu.classList.toggle("show");
    });
  }

  // ✅ Close menu when clicking outside
  document.addEventListener("click", (e) => {
    if (profileMenu && !profileMenu.contains(e.target) && !profileToggle.contains(e.target)) {
      profileMenu.classList.remove("show");
    }
  });

  // ✅ Logout button
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("loggedIn");
      localStorage.removeItem("currentUser");
      location.reload();
    });
  }

  // ✅ Google Sign-In placeholder
  if (googleLoginBtn) {
    googleLoginBtn.addEventListener("click", () => {
      alert("Google Sign-In coming soon...");
    });
  }

  // ✅ SIGNUP SYSTEM (LIVE VALIDATION + SUBMIT)
  const signupUsername = document.getElementById("signupUsername");
  const signupEmail = document.getElementById("signupEmail");
  const signupPassword = document.getElementById("signupPassword");
  const signupConfirm = document.getElementById("signupConfirm");
  const confirmCheck = document.getElementById("confirmCheck");

  // 🔸 Live username check
  if (signupUsername) {
    signupUsername.addEventListener("input", async () => {
      const username = signupUsername.value.trim();
      const usernamePattern = /^[A-Za-z][A-Za-z0-9_]{5,19}$/;
      const accounts = await loadAccounts();

      if (!usernamePattern.test(username)) {
        warning.style.display = "block";
        warning.textContent = "⚠️ Username must start with a letter and be 6–20 characters.";
      } else if (accounts.some(u => u.username === username)) {
        warning.style.display = "block";
        warning.textContent = "⚠️ Username already exists. Please choose another one.";
      } else {
        warning.style.display = "none";
      }
    });
  }

  // 🔸 Live email check
  if (signupEmail) {
    signupEmail.addEventListener("input", async () => {
      const email = signupEmail.value.trim();
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      const accounts = await loadAccounts();

      if (!emailPattern.test(email)) {
        warning.style.display = "block";
        warning.textContent = "⚠️ Please enter a valid email address.";
      } else if (accounts.some(u => u.email === email)) {
        warning.style.display = "block";
        warning.textContent = "⚠️ Email is already used. Please use another email.";
      } else {
        warning.style.display = "none";
      }
    });
  }

  // 🔸 Live password check
  if (signupPassword) {
    signupPassword.addEventListener("input", () => {
      const pass = signupPassword.value.trim();
      if (pass.length < 6 || pass.length > 20) {
        warning.style.display = "block";
        warning.textContent = "⚠️ Password must be 6–20 characters.";
      } else {
        warning.style.display = "none";
      }
    });
  }

  // 🔸 Live confirm password match
  if (signupConfirm) {
    signupConfirm.addEventListener("input", () => {
      if (signupPassword.value.trim() !== signupConfirm.value.trim()) {
        warning.style.display = "block";
        warning.textContent = "⚠️ Passwords do not match.";
      } else {
        warning.style.display = "none";
      }
    });
  }

  // 🔸 Checkbox check live
  if (confirmCheck) {
    confirmCheck.addEventListener("change", () => {
      if (!confirmCheck.checked) {
        warning.style.display = "block";
        warning.textContent = "⚠️ Please confirm that your details are correct.";
      } else {
        warning.style.display = "none";
      }
    });
  }

  // ✅ Submit validation (final)
  if (signupSubmit) {
    signupSubmit.addEventListener("click", async () => {
      const username = signupUsername.value.trim();
      const email = signupEmail.value.trim();
      const password = signupPassword.value.trim();
      const confirm = signupConfirm.value.trim();

      // 🔹 Check all fields filled
      if (!username || !email || !password || !confirm) {
        warning.style.display = "block";
        warning.textContent = "⚠️ Please fill in all fields.";
        return;
      }

      // 🔹 Check confirmation checkbox
      if (!confirmCheck.checked) {
        warning.style.display = "block";
        warning.textContent = "⚠️ Please confirm that your details are correct.";
        return;
      }

      const accounts = await loadAccounts();

      // 🔹 Check if username exists
      if (accounts.some(u => u.username === username)) {
        warning.style.display = "block";
        warning.textContent = "⚠️ Username already exists. Please choose another one.";
        return;
      }

      // 🔹 Check if email exists
      if (accounts.some(u => u.email === email)) {
        warning.style.display = "block";
        warning.textContent = "⚠️ Email is already used. Please use another email.";
        return;
      }

      // 🔹 Save new account
      const storedAccounts = JSON.parse(localStorage.getItem("accounts")) || [];
      storedAccounts.push({ username, email, password });
      localStorage.setItem("accounts", JSON.stringify(storedAccounts));

      warning.style.display = "none";
      alert("✅ Account created successfully! Redirecting to login...");
      window.location.href = "login.html";
    });
  }
});
