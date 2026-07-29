# 🛡️ TitanVault

**A Non-Custodial, Zero-Knowledge Password Management Engine for Manifest V3.**

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)
[![Security: AES-GCM](https://img.shields.io/badge/Security-AES--GCM--256-green.svg)](#)
[![Key Derivation: PBKDF2](https://img.shields.io/badge/KDF-PBKDF2--600k-orange.svg)](#)
[![Platform: Chrome Extension](https://img.shields.io/badge/Platform-Chrome_MV3-blueviolet.svg)](#)

TitanVault is a high-performance, client-side encryption utility engineered with a **Zero-Access** threat model. By leveraging the Web Crypto API, TitanVault ensures that sensitive credentials never exist in a decrypted state within persistent storage. All cryptographic primitives are executed in volatile memory, following the same security standards as industry leaders like Proton.

## 🛠️ Cryptographic Stack

TitanVault implements a robust, hardware-accelerated cryptographic pipeline:

*   **Authenticated Encryption (AEAD):** Utilizes `AES-GCM-256` for simultaneous confidentiality and integrity. The Galois/Counter Mode ensures that any bit-level tampering results in an immediate authentication failure.
*   **Key Stretching:** Employs `PBKDF2-HMAC-SHA256` with **600,000 iterations**. This configuration is specifically tuned to resist massive GPU-based dictionary attacks.
*   **Entropy & Salting:** Uses a cryptographically secure 16-byte random salt for each vault instance, ensuring that identical master passwords generate unique, non-deterministic ciphertexts.

## 🚀 Key Features

*   **Zero-Knowledge Architecture:** Decryption keys are derived on-the-fly. The application never stores the Master Password or the raw encryption key.
*   **Manifest V3 Compliant:** Built for the modern web with a strict Content Security Policy (CSP), strictly prohibiting `unsafe-eval` and preventing remote code execution.
*   **Volatile Memory Security:** Sensitive keying material is cleared from RAM upon locking or session termination.
*   **Non-Custodial & Transparent:** Fully open-source under the AGPL-3.0 license, ensuring the code remains free, auditable, and transparent.

## 📥 Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/brolookslikeanfish67-hub/TitanVault-an-password-manger.git
    ```
2.  Open Chrome and navigate to `chrome://extensions/`.
3.  Enable **Developer Mode** (toggle in the top right).
4.  Click **Load unpacked** and select the `/TitanVault` directory.

## 🛡️ Threat Model

TitanVault is engineered to mitigate:
- **Storage Layer Compromise:** Encrypted blobs remain indecipherable even if the underlying storage (Chrome LocalStorage) is accessed.
- **Side-Channel Attacks:** By using the native `SubtleCrypto` implementation, we benefit from browser-level protections against common side-channel vulnerabilities.
- **Integrity Violations:** The GCM authentication tag validates the data before it is ever presented to the user.

## ⚖️ License

TitanVault is licensed under the **GNU Affero General Public License v3.0 (AGPL-3.0)**. This ensures that the software remains free and that any improvements made to the security engine are shared back with the community.

---
**Security Warning:** This project is for educational and audit-ready demonstration. Before using any cryptographic software for production data, ensure you have reviewed the source code and understand the inherent risks of browser-based storage.
