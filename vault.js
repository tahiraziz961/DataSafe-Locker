const encoder=new TextEncoder(),decoder=new TextDecoder();
let key,vaultKey="";

// THEME
function toggleThemeUI(){
 const dark=document.body.getAttribute("data-theme")==="dark";
 document.body.setAttribute("data-theme",dark?"light":"dark");
 themeText.innerText=dark?"Light Mode":"Dark Mode";
 localStorage.setItem("theme",dark?"light":"dark");
}
document.body.setAttribute("data-theme",localStorage.getItem("theme")||"dark");

// KEY GEN
async function getKey(p,s){
 const km=await crypto.subtle.importKey("raw",encoder.encode(p),"PBKDF2",false,["deriveKey"]);
 return crypto.subtle.deriveKey({name:"PBKDF2",salt:s,iterations:100000,hash:"SHA-256"},
 km,{name:"AES-GCM",length:256},false,["encrypt","decrypt"]);
}

// CREATE MASTER
async function createMaster(){
 const pwd=masterPassword.value.trim();if(!pwd)return alert("Enter password");
 const salt=crypto.getRandomValues(new Uint8Array(16));
 key=await getKey(pwd,salt);
 localStorage.setItem("vaultSalt",btoa(String.fromCharCode(...salt)));
 statusText.innerText="Master password created ✅";
}

// LOGIN
async function login(){
 const pwd=masterPassword.value.trim();
 const saltData=localStorage.getItem("vaultSalt");
 if(!saltData)return alert("Create master first");
 const salt=Uint8Array.from(atob(saltData),c=>c.charCodeAt(0));
 key=await getKey(pwd,salt);
 vaultKey="vault_"+btoa(saltData).slice(0,12);
 authBox.style.display="none";vaultBox.style.display="flex";updateCount();
}

// LOGOUT
function logout(){location.reload();}

// ENCRYPT / DECRYPT
async function encrypt(t){
 const iv=crypto.getRandomValues(new Uint8Array(12));
 const e=await crypto.subtle.encrypt({name:"AES-GCM",iv},key,encoder.encode(t));
 return btoa(String.fromCharCode(...iv)+String.fromCharCode(...new Uint8Array(e)));
}
async function decrypt(d){
 const raw=Uint8Array.from(atob(d),c=>c.charCodeAt(0));
 return decoder.decode(await crypto.subtle.decrypt({name:"AES-GCM",iv:raw.slice(0,12)},key,raw.slice(12)));
}

// SAVE ENTRY ✅
async function saveData(){
 const labelField=document.getElementById("label");
 const secretField=document.getElementById("secret");

 const label=labelField.value.trim();
 const secret=secretField.value.trim();
 if(!label||!secret)return alert("Fill fields");

 let v=JSON.parse(localStorage.getItem(vaultKey)||"{}");
 v[label]=await encrypt(secret);

 localStorage.setItem(vaultKey,JSON.stringify(v));

 labelField.value="";
 secretField.value="";

 updateCount();
 alert("Saved ✅");
}

// COUNT
function updateCount(){
 entryCount.innerText=Object.keys(JSON.parse(localStorage.getItem(vaultKey)||"{}")).length;
}

// VIEW (ENC ONLY)
async function showData(){
 let v=JSON.parse(localStorage.getItem(vaultKey)||"{}"),html="";
 for(const n in v){
  html+=`
  <div class="record" id="entry-${encodeURIComponent(n)}">
    <div><b>${n}</b><br><span>${v[n]}</span></div>
    <div>
      <button class="action-btn btn-edit" onclick="editEntry('${escapeJs(n)}')">Edit</button>
      <button class="action-btn btn-delete" onclick="deleteEntry('${escapeJs(n)}')">Delete</button>
    </div>
  </div>`;
 }
 output.innerHTML=html;
}

// EDIT — now creates DOM elements and prefills decrypted text
async function editEntry(n){
 // Convert JS-escaped label back if needed
 const label = n;
 let v = JSON.parse(localStorage.getItem(vaultKey)||"{}");
 const enc = v[label];
 const entryId = `entry-${encodeURIComponent(label)}`;
 const entryEl = document.getElementById(entryId);

 if(!entryEl){
   // fallback: refresh list
   return showData();
 }

 // attempt to decrypt for prefill
 let plain = "";
 try {
   plain = enc ? await decrypt(enc) : "";
 } catch (e) {
   // If decryption fails, keep plain empty but notify
   plain = "";
   // Not blocking the user — they can enter a new value
 }

 // clear element and build safe DOM input/buttons
 entryEl.innerHTML = ""; // remove previous content

 // create container for input
 const left = document.createElement("div");
 left.style.flex = "1";

 const input = document.createElement("input");
 input.className = "inline-input";
 input.id = `newVal-${encodeURIComponent(label)}`;
 input.value = plain;
 input.placeholder = "Enter new text";
 left.appendChild(input);

 // create actions container
 const actions = document.createElement("div");
 actions.style.display = "flex";
 actions.style.gap = "8px";
 actions.style.alignItems = "center";

 const saveBtn = document.createElement("button");
 saveBtn.className = "action-btn btn-edit";
 saveBtn.innerText = "Save";
 saveBtn.onclick = function(){ saveEdit(label); };

 const cancelBtn = document.createElement("button");
 cancelBtn.className = "action-btn btn-delete";
 cancelBtn.innerText = "Cancel";
 cancelBtn.onclick = function(){ showData(); };

 const copyBtn = document.createElement("button");
 copyBtn.className = "action-btn";
 copyBtn.innerText = "Copy";
 copyBtn.onclick = function(){ navigator.clipboard.writeText(input.value).then(()=>alert("Copied")); };

 actions.appendChild(saveBtn);
 actions.appendChild(cancelBtn);
 actions.appendChild(copyBtn);

 entryEl.appendChild(left);
 entryEl.appendChild(actions);
}

// SAVE EDIT
async function saveEdit(n){
 const id = `newVal-${encodeURIComponent(n)}`;
 const input = document.getElementById(id);
 if(!input) return alert("Nothing to save");
 const val = input.value;
 if(!val) return alert("Value cannot be empty");

 let v = JSON.parse(localStorage.getItem(vaultKey)||"{}");
 v[n] = await encrypt(val);
 localStorage.setItem(vaultKey,JSON.stringify(v));
 updateCount();
 showData();
}

// DELETE
function deleteEntry(n){
 let v = JSON.parse(localStorage.getItem(vaultKey)||"{}");
 delete v[n];
 localStorage.setItem(vaultKey,JSON.stringify(v));
 updateCount();
 showData();
}

// NAV
function showSection(s){
 addSection.style.display="none";
 viewSection.style.display="none";
 toolSection.style.display="none";
 document.getElementById(s).style.display="block";
 if(s==="viewSection")showData();
}

// TOOL
async function toolEncrypt(){
 const val=toolInput.value.trim();if(!val)return;
 toolResult.innerText=await encrypt(val);
}
async function toolDecrypt(){
 const val=toolInput.value.trim();if(!val)return;
 try{toolResult.innerText=await decrypt(val);}
 catch{toolResult.innerText="❌ Invalid data";}
}

/* small helper to escape single quotes in inline JS calls */
function escapeJs(s){
 if(s===undefined||s===null) return "";
 return String(s).replaceAll("\\","\\\\").replaceAll("'","\\'").replaceAll("\n","\\n").replaceAll("\r","\\r");
}
