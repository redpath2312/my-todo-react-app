# React + Vite Template Info

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

# React app instructions

## Data & encryption

DashTasker uses Firebase Authentication and Cloud Firestore to store user data.

- Card text is **encrypted on the client** (in your browser) using AES via `crypto-js` before being written to Firestore.
- Only the encrypted ciphertext is stored in Firestore; card text is decrypted on the client when you load your dashboard.
- Firestore security rules restrict each user to their own document.
- Cards created **before the encryption release (v0.11.0)** may still be stored in plaintext until you edit their text; saving an edit will migrate them to the encrypted format.
- This is a personal project, not a commercial service, so please avoid storing highly sensitive information in tasks.

A fuller technical write-up is on the backlog (architecture, Firestore rules, and client-side encryption details).