const ITERATIONS = 600000; // Proton-level security

// --- CRYPTO ENGINE ---
async function deriveKey(password, salt) {
    const encoder = new TextEncoder();
    const baseKey = await crypto.subtle.importKey(
        "raw", encoder.encode(password), "PBKDF2", false, ["deriveKey"]
    );
    return crypto.subtle.deriveKey(
        { name: "PBKDF2", salt, iterations: ITERATIONS, hash: "SHA-256" },
        baseKey,
        { name: "AES-GCM", length: 256 },
        false,
        ["encrypt", "decrypt"]
    );
}

async function encryptData(data, password) {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const key = await deriveKey(password, salt);
    const encoded = new TextEncoder().encode(JSON.stringify(data));
    
    const ciphertext = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, encoded);
    
    return {
        ct: btoa(String.fromCharCode(...new Uint8Array(ciphertext))),
        iv: btoa(String.fromCharCode(...iv)),
        salt: btoa(String.fromCharCode(...salt))
    };
}

async function decryptData(blob, password) {
    const iv = Uint8Array.from(atob(blob.iv), c => c.charCodeAt(0));
    const salt = Uint8Array.from(atob(blob.salt), c => c.charCodeAt(0));
    const ct = Uint8Array.from(atob(blob.ct), c => c.charCodeAt(0));
    
    const key = await deriveKey(password, salt);
    const decrypted = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, ct);
    return JSON.parse(new TextDecoder().decode(decrypted));
}

// --- UI LOGIC ---
let masterPassword = "";

document.getElementById('unlock-btn').addEventListener('click', async () => {
    masterPassword = document.getElementById('master-key').value;
    if (!masterPassword) return alert("Enter password");

    chrome.storage.local.get(['vault'], async (result) => {
        if (result.vault) {
            try {
                const decrypted = await decryptData(result.vault, masterPassword);
                renderVault(decrypted);
            } catch (e) {
                alert("Wrong password!");
                return;
            }
        }
        document.getElementById('lock-screen').style.display = 'none';
        document.getElementById('vault-screen').style.display = 'block';
    });
});

document.getElementById('save-btn').addEventListener('click', async () => {
    const site = document.getElementById('site-name').value;
    const pass = document.getElementById('site-pass').value;

    chrome.storage.local.get(['vault'], async (result) => {
        let vault = {};
        if (result.vault) {
            vault = await decryptData(result.vault, masterPassword);
        }
        
        vault[site] = pass;
        const encryptedVault = await encryptData(vault, masterPassword);
        chrome.storage.local.set({ vault: encryptedVault }, () => {
            renderVault(vault);
            alert("Saved securely!");
        });
    });
});

function renderVault(vault) {
    const list = document.getElementById('password-list');
    list.innerHTML = "";
    for (const [site, pass] of Object.entries(vault)) {
        const item = document.createElement('div');
        item.className = "vault-item";
        item.innerHTML = `<strong>${site}:</strong> ${pass}`;
        list.appendChild(item);
    }
}

document.getElementById('lock-btn').addEventListener('click', () => {
    location.reload(); // Wipes memory
});
