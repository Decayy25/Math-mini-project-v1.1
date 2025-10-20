window.onload = function () {
  const rumus = document.getElementById("rumus");
  const inputArea = document.getElementById("input-area");
  const hasilBox = document.getElementById("hasil");

  rumus.addEventListener("change", () => {
    const r = rumus.value;
    let html = "";

    if (r === "miring") {
      html = `<label>Alas:</label><input type="number" id="alas"><br>
              <label>Tinggi:</label><input type="number" id="tinggi"><br>`;
    } else if (r === "alas") {
      html = `<label>Miring:</label><input type="number" id="miring"><br>
              <label>Tinggi:</label><input type="number" id="tinggi"><br>`;
    } else if (r === "tinggi") {
      html = `<label>Miring:</label><input type="number" id="miring"><br>
              <label>Alas:</label><input type="number" id="alas"><br>`;
    } else if (r === "persegi") {
      html = `<label>Sisi:</label><input type="number" id="sisi"><br>`;
    } else if (r === "lp" || r === "kp") {
      html = `<label>Panjang:</label><input type="number" id="panjang"><br>
              <label>Lebar:</label><input type="number" id="lebar"><br>`;
    } else if (r === "tekanan") {
      html = `<label>Gaya (N):</label><input type="number" id="gaya"><br>
              <label>Luas (m²):</label><input type="number" id="luas"><br>`;
    } else if (r === "newton1") {
      html = `<label>Gaya Resultan (N):</label><input type="number" id="resultan"><br>`;
    } else if (r === "Gaya") {
      html = `<label>Massa (kg):</label><input type="number" id="massa"><br>
              <label>Percepatan (m/s²):</label><input type="number" id="percepatan"><br>`;
    } else if (r === "Massa") {
      html = `<label>Gaya (N):</label><input type="number" id="gaya"><br>
              <label>Percepatan (m/s²):</label><input type="number" id="percepatan"><br>`;
    } else if (r === "Percepatan") {
      html = `<label>Gaya (N):</label><input type="number" id="gaya"><br>
              <label>Massa (kg):</label><input type="number" id="massa"><br>`;
    } else if (r === "gravitasi") {
      html = `<label>Massa 1 (kg):</label><input type="number" id="massa1"><br>
              <label>Massa 2 (kg):</label><input type="number" id="massa2"><br>
              <label>Jarak (m):</label><input type="number" id="jarak"><br>`;
    } else if (r === "energi") {
      html = `<label>Massa (kg):</label><input type="number" id="massa"><br>
              <label>Kecepatan (m/s):</label><input type="number" id="kecepatan"><br>`;
    } else if (r === "subneting") {
      html = `
        <label>Pilih Kelas:</label>
        <select id="kelas">
          <option value="subneting A">Kelas A</option>
          <option value="subneting B">Kelas B</option>
          <option value="subneting C">Kelas C</option>
        </select><br>
        <label>IP Address:</label><input type="text" id="ip" placeholder="Contoh: 192.168.1.1"><br>
        <label>CIDR:</label><input type="text" id="cidr" placeholder="Contoh: 8 atau /24"><br>
        <button onclick="hitungSubnet()">Hitung Subnet</button>`;
    }

    inputArea.innerHTML = html;
    hasilBox.innerHTML = "Hasil : -";
  });
};

function hitung() {
  const r = document.getElementById("rumus").value;
  const hasilBox = document.getElementById("hasil");
  let hasil;

  if (r === "miring") {
    hasil = Math.sqrt(alas.value ** 2 + tinggi.value ** 2);
  } else if (r === "alas") {
    hasil = Math.sqrt(miring.value ** 2 - tinggi.value ** 2);
  } else if (r === "tinggi") {
    hasil = Math.sqrt(miring.value ** 2 - alas.value ** 2);
  } else if (r === "persegi") {
    hasil = sisi.value ** 2;
  } else if (r === "lp") {
    hasil = panjang.value * lebar.value;
  } else if (r === "kp") {
    hasil = 2 * (parseFloat(panjang.value) + parseFloat(lebar.value));
  } else if (r === "newton1") {
    hasil = resultan.value == 0 ? "Benda diam / GLB" : "Benda mengalami percepatan";
  } else if (r === "Gaya") {
    hasil = massa.value * percepatan.value;
  } else if (r === "Massa") {
    hasil = gaya.value / percepatan.value;
  } else if (r === "Percepatan") {
    hasil = gaya.value / massa.value;
  } else if (r === "gravitasi") {
    hasil = (6.674 * 10 ** -11 * massa1.value * massa2.value) / (jarak.value ** 2);
  } else if (r === "energi") {
    hasil = 0.5 * massa.value * kecepatan.value ** 2;
  } else if (r === "tekanan") {
    hasil = gaya.value / luas.value;
  }

  hasilBox.innerText = `Hasil : ${hasil}`;
}

/* ===================== FUNGSI SUBNETTING ====================== */

function ipToInt(ip) {
  const parts = ip.split('.').map(Number);
  if (parts.length !== 4 || parts.some(p => isNaN(p) || p < 0 || p > 255)) return null;
  return ((parts[0] << 24) >>> 0) + ((parts[1] << 16) >>> 0) + ((parts[2] << 8) >>> 0) + (parts[3] >>> 0);
}

function intToIp(int) {
  return [
    (int >>> 24) & 0xFF,
    (int >>> 16) & 0xFF,
    (int >>> 8) & 0xFF,
    int & 0xFF
  ].join('.');
}

function maskFromCIDR(cidr) {
  return cidr === 0 ? 0 : (((0xFFFFFFFF << (32 - cidr)) >>> 0) >>> 0);
}

function hitungSubnet() {
  const kelas = document.getElementById("kelas").value;
  const ipStr = document.getElementById("ip").value.trim();
  const CIDRraw = document.getElementById("cidr").value.trim();
  const hasilDiv = document.getElementById("hasil");

  const cidr = parseInt(CIDRraw.replace('/', ''), 10);
  const ipInt = ipToInt(ipStr);

  if (!ipInt) {
    hasilDiv.innerHTML = "<p style='color:red'>IP tidak valid! Contoh: 192.168.1.10</p>";
    return;
  }

  const firstOctet = parseInt(ipStr.split('.')[0]);
  let minCIDR, maxCIDR, kelasLabel;

  if (kelas === "subneting A") {
    minCIDR = 8; maxCIDR = 15; kelasLabel = "A";
    if (firstOctet < 1 || firstOctet > 126) {
      hasilDiv.innerHTML = "<p style='color:red'>IP ini bukan kelas A (1.0.0.0 - 126.255.255.255)</p>";
      return;
    }
  } else if (kelas === "subneting B") {
    minCIDR = 16; maxCIDR = 23; kelasLabel = "B";
    if (firstOctet < 128 || firstOctet > 191) {
      hasilDiv.innerHTML = "<p style='color:red'>IP ini bukan kelas B (128.0.0.0 - 191.255.255.255)</p>";
      return;
    }
  } else {
    minCIDR = 24; maxCIDR = 32; kelasLabel = "C";
    if (firstOctet < 192 || firstOctet > 223) {
      hasilDiv.innerHTML = "<p style='color:red'>IP ini bukan kelas C (192.0.0.0 - 223.255.255.255)</p>";
      return;
    }
  }

  if (isNaN(cidr) || cidr < minCIDR || cidr > maxCIDR) {
    hasilDiv.innerHTML = `<p style='color:red'>CIDR tidak valid untuk kelas ${kelasLabel} (gunakan ${minCIDR}–${maxCIDR})</p>`;
    return;
  }

  const maskInt = maskFromCIDR(cidr);
  const maskStr = intToIp(maskInt);
  const networkInt = (ipInt & maskInt) >>> 0;
  const broadcastInt = (networkInt | (~maskInt >>> 0)) >>> 0;
  const hostCount = (2 ** (32 - cidr)) - 2;

  let html = `
    <h3>Hasil Subneting Kelas ${kelasLabel}</h3>
    <table>
      <tr><th>IP Address</th><td>${ipStr}</td></tr>
      <tr><th>CIDR</th><td>/${cidr}</td></tr>
      <tr><th>Subnet Mask</th><td>${maskStr}</td></tr>
      <tr><th>Network Address</th><td>${intToIp(networkInt)}</td></tr>
      <tr><th>Broadcast Address</th><td>${intToIp(broadcastInt)}</td></tr>
      <tr><th>Host Usable</th><td>${hostCount}</td></tr>
      <tr><th>Range Host</th><td>${intToIp(networkInt + 1)} - ${intToIp(broadcastInt - 1)}</td></tr>
    </table>
  `;

  hasilDiv.innerHTML = html;
}
