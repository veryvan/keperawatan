import React, { useState } from 'react';
import nursingWallpaper from './assets/nursing_wallpaper.png';
import certificateBackground from './assets/sertifikat.png';
import logoRS from './assets/logo.png';
import logoKudus from './assets/logo_kudus.png';
import logoLars from './assets/lars.png';
import AdminSoal from './AdminSoal';
import AdminPejabat from './AdminPejabat';
import {
  Users, Award, Stethoscope, FileText, ClipboardCheck,
  Clock, BookOpen, LayoutDashboard, Settings, Bell,
  Search, Menu, X, ChevronRight, Activity, Sun, Moon,
  Building, Briefcase, Tags, Edit2, Trash2, Check, XCircle, Eye, CheckCircle,
  Lock, LogOut, Shield, UserCheck, UserX, UserPlus, User, GraduationCap,
  ChevronDown, Plus, ChevronLeft, AlertTriangle, Printer
} from 'lucide-react';

const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
  <div
    onClick={onClick}
    className={`flex items-center space-x-3 px-4 py-3 rounded-lg cursor-pointer transition-all duration-200 ${active
      ? 'bg-primary text-primary-foreground shadow-md'
      : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
      }`}
  >
    <Icon size={20} />
    <span className="font-medium text-sm">{label}</span>
  </div>
);



const SearchableSelect = ({ options, value, onChange, placeholder, name }) => {
  const [search, setSearch] = React.useState('');
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    if (!isOpen) {
      if (value) {
        const selected = options.find(o => String(o.value) === String(value));
        if (selected) setSearch(selected.label);
      } else {
        setSearch('');
      }
    }
  }, [value, options, isOpen]);

  const filtered = options.filter(o => o.label.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="relative">
      <input
        type="text"
        className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
        placeholder={placeholder}
        value={search}
        onChange={e => { setSearch(e.target.value); setIsOpen(true); onChange({ target: { name, value: '' } }); }}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
      />
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-background border border-border rounded-md shadow-lg max-h-60 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="px-3 py-2 text-sm text-muted-foreground">Tidak ditemukan</div>
          ) : (
            filtered.map((o, idx) => (
              <div
                key={idx}
                className="px-3 py-2 text-sm cursor-pointer hover:bg-muted"
                onClick={() => {
                  setSearch(o.label);
                  onChange({ target: { name, value: o.value } });
                  setIsOpen(false);
                }}
              >
                {o.label}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, trend, trendUp }) => (
  <div className="bg-card p-6 rounded-xl border border-border shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-muted-foreground text-sm font-medium mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-foreground">{value}</h3>
      </div>
      <div className="p-3 bg-primary/10 rounded-lg text-primary">
        <Icon size={24} />
      </div>
    </div>
    {trend && (
      <div className="mt-4 flex items-center text-sm">
        <span className={`font-medium ${trendUp ? 'text-green-500' : 'text-destructive'}`}>
          {trend}
        </span>
        <span className="text-muted-foreground ml-2">vs bulan lalu</span>
      </div>
    )}
  </div>
);

const SignaturePad = ({ value, onChange, onClear, disabled, label }) => {
  const canvasRef = React.useRef(null);
  const [isDrawing, setIsDrawing] = React.useState(false);

  React.useEffect(() => {
    if (!value && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.strokeStyle = '#1e3a8a'; // Dark blue stroke
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    }
  }, [value]);

  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    if (e.touches && e.touches.length > 0) {
      const touch = e.touches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
      };
    }
    
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const startDrawing = (e) => {
    if (disabled || value) return;
    const coords = getCoordinates(e);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
    setIsDrawing(true);
    e.preventDefault();
  };

  const draw = (e) => {
    if (!isDrawing || disabled || value) return;
    const coords = getCoordinates(e);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
    e.preventDefault();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    
    const canvas = canvasRef.current;
    const base64 = canvas.toDataURL('image/png');
    onChange(base64);
  };

  const clearCanvas = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    onClear();
  };

  return (
    <div className="flex flex-col items-center w-full">
      {value ? (
        <div className="relative border border-border rounded bg-white p-1 flex items-center justify-center w-full h-[120px] shadow-inner">
          <img src={value} alt={label} className="max-h-full max-w-full object-contain" />
          {!disabled && (
            <button 
              type="button" 
              onClick={clearCanvas} 
              className="absolute top-2 right-2 px-2.5 py-1 bg-destructive/10 text-destructive hover:bg-destructive hover:text-white text-[9px] font-bold rounded-md transition-colors border border-destructive/20"
            >
              Ulangi
            </button>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center w-full space-y-1.5">
          <canvas
            ref={canvasRef}
            width={240}
            height={120}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            className={`border-2 border-dashed border-border rounded-lg bg-white w-full max-w-[240px] h-[120px] cursor-crosshair shadow-sm hover:border-primary/50 transition-colors ${disabled ? 'opacity-50 pointer-events-none' : ''}`}
          />
          {!disabled && (
            <div className="flex gap-2">
              <button 
                type="button" 
                onClick={clearCanvas} 
                className="px-2.5 py-1 bg-muted hover:bg-muted/80 text-foreground text-[9px] font-bold rounded border border-border transition-colors uppercase tracking-wider"
              >
                Bersihkan
              </button>
              <span className="text-[9px] text-muted-foreground self-center italic">Gambarkan tanda tangan Anda di atas</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const ReminderItem = ({ title, date, type, onClickDetail }) => (
  <div className="flex items-center justify-between p-4 border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
    <div className="flex items-center space-x-4">
      <div className={`p-2 rounded-full ${type === 'urgent' ? 'bg-destructive/10 text-destructive' :
        type === 'warning' ? 'bg-yellow-500/10 text-yellow-500' :
          'bg-primary/10 text-primary'
        }`}>
        <Clock size={16} />
      </div>
      <div>
        <p className="font-medium text-sm text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground">Jatuh tempo: {date}</p>
      </div>
    </div>
    <button onClick={onClickDetail} className="text-xs text-primary hover:underline font-medium">Detail</button>
  </div>
);

const getStatusDoc = (expiryDate) => {
  if (!expiryDate) return { label: 'Belum Diisi', class: 'bg-muted text-muted-foreground' };
  const today = new Date();
  const exp = new Date(expiryDate);
  const diffTime = exp - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return { label: 'Expired', class: 'bg-destructive/10 text-destructive border border-destructive/20' };
  } else if (diffDays <= 30) {
    return { label: `Kritis (${diffDays} hari)`, class: 'bg-orange-500/10 text-orange-500 border border-orange-500/20 animate-pulse' };
  } else if (diffDays <= 90) {
    return { label: `Peringatan (${diffDays} hari)`, class: 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' };
  } else {
    return { label: 'Aktif', class: 'bg-green-500/10 text-green-500 border border-green-500/20' };
  }
};

const LIST_12_KOMPETENSI = [
  {
    kode: 'KD-01',
    judul: 'Melakukan komunikasi interpersonal dalam melaksanakan tindakan keperawatan',
    keterangan: 'SKKNI: Komunikasi terapeutik, penjelasan tindakan, empati, edukasi pasien',
    form02: {
      elemen1: 'Mempersiapkan komunikasi interpersonal dengan pasien',
      k1_1: 'Mampu mengidentifikasi kesiapan pasien untuk menerima pesan',
      k1_2: 'Mampu menyiapkan lingkungan yang kondusif bagi kelancaran komunikasi',
      k1_3: 'Mampu menentukan media komunikasi yang tepat sesuai kebutuhan pasien',
      elemen2: 'Melaksanakan komunikasi interpersonal terapeutik',
      k2_1: 'Mampu memperlihatkan sikap terapeutik dan ramah (senyum, sapa, salam)',
      k2_2: 'Mampu melakukan active listening (mendengar aktif) dan klarifikasi respon',
      k2_3: 'Mampu memberikan umpan balik dan edukasi klinis yang jelas kepada pasien'
    },
    form03: {
      acuan: 'KD-01 / KES.PG02.001.01 KOMUNIKASI INTERPERSONAL',
      q_obs1: 'Melakukan bina hubungan saling percaya (BHSP) dengan pasien sebelum tindakan',
      q_obs2: 'Menjelaskan tujuan dan langkah tindakan keperawatan dengan bahasa yang dipahami pasien',
      q_obs3: 'Menunjukkan komunikasi terapeutik yang aktif, empati, dan menghargai privasi',
      q_obs4: 'Memverifikasi pemahaman pasien dengan memberikan kesempatan bertanya',
      q_lisan1: 'Bagaimana Anda menghadapi pasien yang menolak diajak berkomunikasi atau marah?',
      q_lisan2: 'Jelaskan fase-fase dalam komunikasi terapeutik (prainteraksi, orientasi, kerja, terminasi).',
      q_tulis: 'Uraikan prinsip-prinsip komunikasi terapeutik pada pasien anak-anak dan lansia yang mengalami kendala kognitif.',
      dok1: 'Logbook Asuhan Keperawatan Komunikasi Terapeutik',
      dok2: 'Sertifikat Pelatihan Konseling / Edukasi Kesehatan Pasien'
    }
  },
  {
    kode: 'KD-02',
    judul: 'Menerapkan prinsip etika dan etiket dalam pelayanan keperawatan',
    keterangan: 'SKKNI: Informed consent, otonomi, beneficence, justice, confidentiality',
    form02: {
      elemen1: 'Menerapkan prinsip-prinsip moral/etik keperawatan',
      k1_1: 'Mampu mempraktikkan informed consent sebelum melaksanakan asuhan',
      k1_2: 'Mampu menjaga rahasia klinis and privasi data pasien dengan aman',
      k1_3: 'Mampu memperlakukan semua pasien secara adil tanpa membeda-bedakan (justice)',
      elemen2: 'Menunjukkan etiket dan profesionalisme dalam asuhan',
      k2_1: 'Mampu menggunakan tutur kata dan sikap yang sopan, empati, serta asertif',
      k2_2: 'Mampu mengenakan atribut kerja lengkap dan rapi sesuai SOP RS',
      k2_3: 'Mampu menyelesaikan dilema etik klinis dasar secara profesional dengan koordinasi tim'
    },
    form03: {
      acuan: 'KD-02 / KES.PG02.002.01 ETIKA DAN ETIKET KEPERAWATAN',
      q_obs1: 'Menyediakan dan membacakan informed consent dengan lengkap sebelum tindakan berisiko',
      q_obs2: 'Menutup tirai pembatas tempat tidur untuk menjaga privasi fisik pasien saat asuhan',
      q_obs3: 'Berbicara sopan, ramah, dan bersikap jujur kepada pasien serta keluarga',
      q_obs4: 'Mendokumentasikan tindakan klinis dengan jujur, objektif, dan tepat waktu',
      q_lisan1: 'Berikan contoh dilema etik beneficence vs autonomy yang sering dihadapi perawat di bangsal.',
      q_lisan2: 'Bagaimana langkah Anda menjaga kerahasiaan informasi pasien (confidentiality) di era digital?',
      q_tulis: 'Jelaskan 8 prinsip utama etika keperawatan (Autonomy, Beneficence, Non-maleficence, Justice, Veracity, Fidelity, Confidentiality, Accountability) beserta aplikasinya.',
      dok1: 'Surat Pernyataan Kepatuhan Kode Etik Perawat RS',
      dok2: 'Sertifikat Pelatihan Aspek Hukum & Etika Keperawatan'
    }
  },
  {
    kode: 'KD-03',
    judul: 'Melakukan pengukuran tanda-tanda vital (TTV)',
    keterangan: 'SKKNI: Pengukuran TD, Nadi, Suhu, Pernapasan, interpretasi hasil klinis',
    form02: {
      elemen1: 'Menyiapkan peralatan pengukuran tanda-tanda vital',
      k1_1: 'Mampu memastikan tensimeter, stetoskop, termometer, dan oximeter berfungsi baik dan bersih',
      k1_2: 'Mampu memvalidasi identitas pasien dan menjelaskan prosedur pengukuran TTV',
      k1_3: 'Mampu memposisikan pasien dengan nyaman dan rileks sebelum pengukuran dimulai',
      elemen2: 'Melaksanakan pengukuran dan pencatatan tanda-tanda vital',
      k2_1: 'Mampu mengukur TD, Nadi, Suhu, RR, dan SpO2 dengan teknik yang akurat dan tepat',
      k2_2: 'Mampu mendeteksi dan melaporkan deviasi/kelainan TTV yang kritis dengan segera',
      k2_3: 'Mampu mencatat hasil TTV pada lembar observasi / rekam medis dengan tepat'
    },
    form03: {
      acuan: 'KD-03 / KES.PG02.003.01 PENGUKURAN TANDA-TANDA VITAL (TTV)',
      q_obs1: 'Melakukan hand hygiene sebelum dan sesudah menyentuh pasien serta peralatan TTV',
      q_obs2: 'Menggunakan cuff tensimeter dengan ukuran dan posisi yang tepat di lengan pasien',
      q_obs3: 'Menghitung denyut nadi radialis dan frekuensi pernapasan penuh selama satu menit penuh',
      q_obs4: 'Mensterilkan termometer sebelum dan sesudah digunakan pada pasien',
      q_lisan1: 'Apa tindakan klinis segera yang harus Anda lakukan jika menemukan pasien dewasa dengan tensi 180/110 mmHg dan SpO2 88%?',
      q_lisan2: 'Jelaskan faktor-faktor fisiologis yang dapat memengaruhi nilai tekanan darah dan laju nadi pasien.',
      q_tulis: 'Sebutkan rentang normal tanda-tanda vital pada pasien dewasa dan neonatus, serta deskripsikan klasifikasi tingkat hipertensi menurut JNC-8.',
      dok1: 'Logbook Klinis 50 Tindakan Pengukuran TTV Pasien',
      dok2: 'Sertifikat Kalibrasi Alat Kesehatan Mandiri / BTCLS Valid'
    }
  },
  {
    kode: 'KD-04',
    judul: 'Melakukan pengkajian keperawatan yang holistik',
    keterangan: 'SKKNI: Anamnesa, pemeriksaan fisik head-to-toe, pengkajian biopsikososial-spiritual',
    form02: {
      elemen1: 'Melakukan anamnesa riwayat kesehatan pasien',
      k1_1: 'Mampu menggali keluhan utama pasien secara terstruktur menggunakan PQRST',
      k1_2: 'Mampu mengumpulkan riwayat penyakit dahulu, keluarga, dan alergi obat/makanan',
      k1_3: 'Mampu melakukan pengkategorian kebutuhan dasar fungsional (bio-psiko-sosio-spiritual)',
      elemen2: 'Melaksanakan pemeriksaan fisik klinis',
      k2_1: 'Mampu melakukan inspeksi, palpasi, perkusi, dan auskultasi secara head-to-toe',
      k2_2: 'Mampu mengidentifikasi kebutuhan keselamatan pasien dan resiko jatuh (Humpty Dumpty / Morse)',
      k2_3: 'Mampu merumuskan masalah keperawatan awal berdasarkan data objektif dan subjektif'
    },
    form03: {
      acuan: 'KD-04 / KES.PG02.004.01 PENGKAJIAN HOLISTIK',
      q_obs1: 'Melakukan wawancara dengan teknik komunikasi terapeutik yang terarah dan empati',
      q_obs2: 'Melakukan pengkajian skala nyeri (NRS/VAS/FLACC) secara presisi dan terdokumentasi',
      q_obs3: 'Melakukan pemeriksaan fisik dada (suara napas dan bunyi jantung) secara benar dan tepat',
      q_obs4: 'Menentukan skor resiko jatuh pasien dengan menggunakan kriteria pengkajian yang baku',
      q_lisan1: 'Bagaimana cara Anda menggali keluhan nyeri pasien secara lengkap menggunakan metode PQRST?',
      q_lisan2: 'Jelaskan perbedaan pengkategorian data objektif dan subjektif serta berikan contohnya dalam asuhan keperawatan.',
      q_tulis: 'Jelaskan tahapan proses keperawatan mulai dari pengkajian hingga evaluasi, serta sebutkan komponen pengkajian fungsional menurut Pola Gordon.',
      dok1: 'Salinan Rekam Medis Pengkajian Awal Keperawatan yang Disupervisi',
      dok2: 'Sertifikat Pelatihan Asesmen Pasien / NANDA-I NOC NIC'
    }
  },
  {
    kode: 'KD-05',
    judul: 'Melakukan perawatan luka dasar (Wound Care)',
    keterangan: 'SKKNI: Perawatan luka bersih, luka post-op tanpa komplikasi, teknik aseptik sterilitas',
    form02: {
      elemen1: 'Menyiapkan alat dan lingkungan perawatan luka bersih',
      k1_1: 'Mampu menyiapkan set steril perawatan luka dan obat topikal sesuai instruksi medis',
      k1_2: 'Mampu menjelaskan prosedur perawatan luka kepada pasien dan menjaga privasi',
      k1_3: 'Mampu mengatur posisi pasien agar luka mudah dijangkau dan pasien tetap nyaman',
      elemen2: 'Melaksanakan pembersihan dan pembalutan luka dasar',
      k2_1: 'Mampu membersihkan luka menggunakan cairan fisiologis (NaCl 0.9%) secara steril',
      k2_2: 'Mampu menilai kondisi luka (warna dasar luka, eksudat, tanda-tanda infeksi lokal)',
      k2_3: 'Mampu memasang balutan penutup luka (modern dressing / konvensional) dengan rapi'
    },
    form03: {
      acuan: 'KD-05 / KES.PG02.005.01 PERAWATAN LUKA DASAR',
      q_obs1: 'Melakukan cuci tangan 6 langkah steril dan memakai handscoen steril dengan tepat',
      q_obs2: 'Mengangkat balutan lama dengan pinset bersih tanpa menyakiti jaringan granulasi pasien',
      q_obs3: 'Melakukan irigasi luka dengan cairan steril secara lembut dan mengeringkannya secara steril',
      q_obs4: 'Membuang sampah infeksius dan alat tajam ke dalam sharp container / safety box',
      q_lisan1: 'Sebutkan tanda-tanda klinis terjadinya infeksi lokal pada luka post-operasi yang perlu diwaspadai.',
      q_lisan2: 'Jelaskan apa yang dimaksud dengan eksudat serosa, sanguinosa, dan purulen beserta maknanya dalam penyembuhan luka.',
      q_tulis: 'Uraikan fase-fase penyembuhan luka (inflamasi, proliferasi, maturasi) serta sebutkan perbedaan prinsip perawatan luka basah (moist healing) dibanding kering.',
      dok1: 'Logbook Perawatan Luka Bersih / Post-Operasi Minimal 10 Kasus',
      dok2: 'Sertifikat Pelatihan Wound Care / Perawatan Luka Modern (CWCCA / sejenis)'
    }
  },
  {
    kode: 'KD-06',
    judul: 'Memfasilitasi pemenuhan kebutuhan oksigenasi',
    keterangan: 'SKKNI: Pemberian oksigen nasal kanul, masker, monitoring terapi oksigenasi',
    form02: {
      elemen1: 'Menyiapkan kebutuhan alat terapi oksigenasi',
      k1_1: 'Mampu memastikan tabung oksigen, regulator, flowmeter, dan humidifier berfungsi optimal',
      k1_2: 'Mampu mencocokkan identitas pasien dan memeriksa kepatenan jalan napas',
      k1_3: 'Mampu menentukan ukuran nasal kanul / masker oksigen yang sesuai usia pasien',
      elemen2: 'Memberikan asuhan keperawatan terapi oksigenasi',
      k2_1: 'Mampu memasang nasal kanul / masker ke wajah pasien dengan posisi presisi dan fiksasi aman',
      k2_2: 'Mampu mengatur aliran laju volume oksigen (liter per menit) sesuai kolaborasi medis',
      k2_3: 'Mampu memonitor saturasi oksigen (SpO2) dan respon pernapasan pasien secara berkala'
    },
    form03: {
      acuan: 'KD-06 / KES.PG02.006.01 FASILITASI OKSIGENASI',
      q_obs1: 'Memeriksa tingkat air steril di dalam tabung humidifier agar berada pada batas yang aman',
      q_obs2: 'Mengatur posisi pasien setengah duduk (Semi-Fowler) untuk meluaskan ekspansi paru',
      q_obs3: 'Menguji hembusan udara oksigen pada kanul sebelum dipasangkan ke hidung pasien',
      q_obs4: 'Menanyakan kenyamanan aliran oksigen serta memeriksa integritas kulit di belakang telinga pasien',
      q_lisan1: 'Berapa batasan laju aliran oksigen (Lpm) yang aman jika menggunakan nasal kanul dan masker sederhana?',
      q_lisan2: 'Sebutkan tanda-tanda klinis bahwa pasien mengalami hipoksia berat dan memerlukan tindakan resusitasi.',
      q_tulis: 'Tuliskan rumus perhitungan kebutuhan oksigenasi pasien, interpretasi nilai Analisa Gas Darah (AGD) pada asidosis respiratorik, dan komplikasi keracunan oksigen.',
      dok1: 'Logbook Terapi Oksigenasi Nasal Kanul & Masker Minimal 15 Pasien',
      dok2: 'Sertifikat Pelatihan Keperawatan Kritis / Emergency Nursing (BTCLS)'
    }
  },
  {
    kode: 'KD-07',
    judul: 'Memfasilitasi pemenuhan kebutuhan cairan dan elektrolit',
    keterangan: 'SKKNI: Pemasangan infus, balance cairan, pencegahan dehidrasi',
    form02: {
      elemen1: 'Menyiapkan pemberian cairan dan elektrolit intravena',
      k1_1: 'Mampu mencocokkan instruksi dokter mengenai jenis, volume, dan kecepatan tetesan cairan infus',
      k1_2: 'Mampu menyiapkan set infus, cairan infus steril, IV catheter, tourniquet, dan desinfektan swab',
      k1_3: 'Mampu menjelaskan prosedur pemasangan infus kepada pasien secara ramah dan suportif',
      elemen2: 'Melakukan pemasangan infus dan penghitungan tetesan',
      k2_1: 'Mampu melakukan kanulasi vena (tusukan infus) secara aseptik dengan satu kali tusukan berhasil',
      k2_2: 'Mampu menghitung kecepatan tetesan cairan infus per menit dengan akurat dan presisi',
      k2_3: 'Mampu melakukan pemantauan balance cairan (intake & output) secara cermat tiap shift'
    },
    form03: {
      acuan: 'KD-07 / KES.PG02.037.01 CAIRAN DAN ELEKTROLIT',
      q_obs1: 'Melakukan disinfeksi kulit area penusukan infus dengan swab alkohol secara melingkar dari dalam ke luar',
      q_obs2: 'Mengatur tetesan infus dengan tepat menggunakan rumus tetesan (makro/mikro) sesuai kolaborasi medis',
      q_obs3: 'Memasang dressing transparan steril di atas area insersi jarum untuk mencegah infeksi nosokomial',
      q_obs4: 'Menghitung balance cairan masuk (infus, minum, makan) vs keluar (urine, IWL) dengan benar',
      q_lisan1: 'Bagaimana rumus menghitung tetesan infus makrodrip dan mikrodrip? Berikan contoh perhitungannya.',
      q_lisan2: 'Apa saja tanda klinis dari komplikasi flebitis dan infiltrasi ekstravasasi pada pasien yang diinfus?',
      q_tulis: 'Tuliskan klasifikasi dehidrasi (ringan, sedang, berat), rumus perhitungan Insensible Water Loss (IWL) pada anak dan dewasa, serta penanganan ketidakseimbangan kalium klinis.',
      dok1: 'Logbook Pemasangan Infus & Pemantauan Balance Cairan Minimal 20 Kasus',
      dok2: 'Sertifikat Pelatihan Manajemen Cairan & Elektrolit (BTCLS)'
    }
  },
  {
    kode: 'KD-08',
    judul: 'Melakukan pemberian obat dengan aman dan benar (6 Benar)',
    keterangan: 'SKKNI: Pemberian obat oral, injeksi (IV, IM, SC, IC), prinsip keselamatan pasien',
    form02: {
      elemen1: 'Mempersiapkan pemberian obat sesuai kolaborasi medis',
      k1_1: 'Mampu melakukan double-check kesesuaian resep obat pada lembar terapi dokter',
      k1_2: 'Mampu mengidentifikasi 6 prinsip benar (Benar Pasien, Obat, Dosis, Rute, Waktu, Dokumentasi)',
      k1_3: 'Mampu menanyakan riwayat alergi obat kepada pasien sebelum pemberian dilakukan',
      elemen2: 'Melaksanakan pemberian obat secara aman',
      k2_1: 'Mampu mengoleskan/menyuntikkan/memberikan obat sesuai dengan rute pemberian yang ditentukan',
      k2_2: 'Mampu memonitor timbulnya efek samping obat / reaksi alergi setelah obat diberikan',
      k2_3: 'Mampu mendokumentasikan pemberian obat segera pada rekam medis / E-MR'
    },
    form03: {
      acuan: 'KD-08 / KES.PG02.008.01 PEMBERIAN OBAT (6 BENAR)',
      q_obs1: 'Meminta pasien menyebutkan nama lengkap dan tanggal lahir serta mencocokkan dengan gelang identitas',
      q_obs2: 'Melakukan desinfeksi karet vial/ampul obat dan kulit area suntikan sebelum menyuntikkan obat',
      q_obs3: 'Membaca etiket obat sebanyak tiga kali (saat mengambil, menyiapkan, dan mengembalikan wadah obat)',
      q_obs4: 'Menunggu di sisi pasien hingga obat oral diminum habis secara mandiri atau dengan bantuan',
      q_lisan1: 'Sebutkan dan jelaskan dengan lengkap prinsip 6 Benar Pemberian Obat beserta kepentingannya.',
      q_lisan2: 'Apa tindakan emergency medis pertama yang harus Anda lakukan apabila terjadi syok anafilaktik akibat injeksi antibiotik?',
      q_tulis: 'Uraikan perbedaan farmakokinetik absorpsi obat melalui rute intravena, intramuskular, subkutan, dan per-oral, serta jelaskan batas waktu penyimpanan obat setelah dibuka (Beyond Use Date/BUD).',
      dok1: 'Logbook Pemberian Obat Injeksi (IV, IM, SC) Minimal 30 Tindakan',
      dok2: 'Sertifikat Pelatihan Keamanan Obat (Medication Safety / Patient Safety)'
    }
  },
  {
    kode: 'KD-09',
    judul: 'Memfasilitasi pemenuhan kebutuhan eliminasi urine dan alvi',
    keterangan: 'SKKNI: Pemasangan kateter urine steril, pemberian enema, huknah, perawatan pispot',
    form02: {
      elemen1: 'Menyiapkan bantuan eliminasi urine dan alvi',
      k1_1: 'Mampu menyiapkan pispot / set kateter steril lengkap sesuai instruksi medis',
      k1_2: 'Mampu menjaga privasi pasien dengan memasang sampiran / menutup pintu bangsal',
      k1_3: 'Mampu memposisikan pasien (dorsal recumbent / litotomi) secara nyaman dan fisiologis',
      elemen2: 'Melaksanakan asuhan keperawatan eliminasi',
      k2_1: 'Mampu melakukan pemasangan kateter urine menetap secara steril dan atraumatik',
      k2_2: 'Mampu melakukan perineal hygiene / pembersihan setelah eliminasi dengan bersih',
      k2_3: 'Mampu mendokumentasikan karakteristik urine / feses (warna, konsistensi, volume) dengan benar'
    },
    form03: {
      acuan: 'KD-09 / KES.PG02.009.01 PEMENUHAN ELIMINASI',
      q_obs1: 'Membuka set steril kateter dengan teknik aseptik yang ketat tanpa menyentuh bagian dalam set',
      q_obs2: 'Melakukan desinfeksi area meatus uretra eksternal (vulva/glans hygiene) dengan cairan antiseptik secara searah',
      q_obs3: 'Memberikan lubrikasi jeli steril pada kateter dan memasukkannya perlahan tanpa paksaan',
      q_obs4: 'Mengisi balon kateter (fiksasi) dengan cairan aquabidest steril sesuai ukuran balon',
      q_lisan1: 'Mengapa pemasangan kateter urine wajib menerapkan teknik steril mutlak? Apa komplikasi utama jika teknik ini terabaikan?',
      q_lisan2: 'Bagaimana penanganan keperawatan pada pasien lansia yang mengalami inkontinensia urine atau retensi urine akut?',
      q_tulis: 'Jelaskan indikasi klinis pemasangan kateter urine menetap (indwelling), kateter intermiten (straight catheter), dan kateter kondom, serta sebutkan komplikasi infeksi saluran kemih akibat kateter (CAUTI).',
      dok1: 'Logbook Tindakan Pemasangan Kateter Urine Steril Minimal 10 Kasus',
      dok2: 'Sertifikat Pelatihan Pencegahan Infeksi Saluran Kemih Terkait Layanan Kesehatan (CAUTI)'
    }
  },
  {
    kode: 'KD-10',
    judul: 'Memfasilitasi pemenuhan kebutuhan nutrisi pasien',
    keterangan: 'SKKNI: Pemasangan NGT, pemberian makanan oral / sonde, pencegahan aspirasi',
    form02: {
      elemen1: 'Menyiapkan pemberian nutrisi klinis',
      k1_1: 'Mampu mencocokkan diet makanan pasien dengan daftar menu gizi rumah sakit',
      k1_2: 'Mampu mengidentifikasi pasien dengan resiko alergi makanan / disfagia',
      k1_3: 'Mampu menyiapkan set sonde NGT / makanan hangat beserta air minum pasien',
      elemen2: 'Melaksanakan pemberian nutrisi oral dan enteral',
      k2_1: 'Mampu mengukur panjang selang NGT dan melakukan pemasangan secara aman dan benar',
      k2_2: 'Mampu melakukan konfirmasi ketepatan posisi selang NGT di lambung (auskultasi / aspirasi)',
      k2_3: 'Mampu menyuapkan makanan / mengalirkan nutrisi cair melalui selang NGT secara perlahan'
    },
    form03: {
      acuan: 'KD-10 / KES.PG02.010.01 PEMENUHAN NUTRISI',
      q_obs1: 'Mengatur posisi pasien duduk tegak (Fowler) atau setengah duduk sebelum makan/sonde',
      q_obs2: 'Melakukan aspirasi cairan lambung sebelum memberikan sonde makanan untuk memeriksa sisa volume residu',
      q_obs3: 'Memberikan bilasan air putih hangat sebelum dan sesudah menyalurkan makanan cair lewat NGT',
      q_obs4: 'Menjaga kepala pasien tetap terangkat minimal 30 derajat selama 30-45 menit pasca makan/sonde',
      q_lisan1: 'Bagaimana 3 cara memvalidasi bahwa ujung selang NGT telah masuk dengan tepat ke dalam lambung pasien?',
      q_lisan2: 'Apa tindakan segera Anda apabila pasien batuk mendadak, sianosis, atau sesak napas saat Anda memasang selang NGT?',
      q_tulis: 'Uraikan etiologi dan patofisiologi terjadinya sindrom aspirasi lambung, sebutkan batasan volume residu lambung yang aman untuk kelanjutan sonde, dan jelaskan indikasi pemberian nutrisi enteral vs parenteral.',
      dok1: 'Logbook Pemasangan NGT & Pemberian Nutrisi Enteral Minimal 10 Tindakan',
      dok2: 'Sertifikat Pelatihan Keperawatan Nutrisi / Kursus Asuhan Gizi Klinis'
    }
  },
  {
    kode: 'KD-11',
    judul: 'Menerapkan prinsip-prinsip pencegahan dan pengendalian infeksi (PPI)',
    keterangan: 'SKKNI: 5 moments hand hygiene, pemakaian APD (masker, goggle, gaun, sarung tangan), pemilahan limbah',
    form02: {
      elemen1: 'Melaksanakan kebersihan tangan (Hand Hygiene)',
      k1_1: 'Mampu mempraktikkan 6 langkah cuci tangan WHO menggunakan handrub dan air mengalir secara fasih',
      k1_2: 'Mampu mematuhi 5 Momen Kebersihan Tangan di bangsal dengan konsisten tanpa terlewat',
      k1_3: 'Mampu melepas semua perhiasan tangan dan menjaga kuku tetap pendek sebelum dinas',
      elemen2: 'Menggunakan Alat Pelindung Diri (APD) dan pembuangan limbah',
      k2_1: 'Mampu memakai (donning) dan melepas (doffing) APD sesuai tingkat resiko infeksi',
      k2_2: 'Mampu memilah limbah medis infeksius (plastik kuning), non-infeksius (hitam), dan benda tajam',
      k2_3: 'Mampu menerapkan etika batuk dan bersin yang benar di area pelayanan klinis'
    },
    form03: {
      acuan: 'KD-11 / KES.PG02.011.01 PENCEGAHAN & PENGENDALIAN INFEKSI',
      q_obs1: 'Melakukan kebersihan tangan segera sebelum kontak fisik dengan pasien dan sebelum tindakan steril',
      q_obs2: 'Mengenakan masker medis dan sarung tangan steril dengan teknik steril yang benar',
      q_obs3: 'Membuang jarum bekas injeksi langsung to safety box tanpa melakukan penutupan kembali (no recapping)',
      q_obs4: 'Melakukan desinfeksi permukaan peralatan yang dipakai bersama antar-pasien dengan cairan disinfektan',
      q_lisan1: 'Sebutkan 5 momen cuci tangan WHO (5 Moments for Hand Hygiene) secara lengkap dan urut.',
      q_lisan2: 'Mengapa perawat sangat dilarang melakukan recapping (menutup kembali) jarum suntik bekas pakai?',
      q_tulis: 'Uraikan perbedaan kewaspadaan transmisi airborne, droplet, dan kontak, serta jelaskan rantai penularan penyakit infeksi (Chain of Infection) dan cara memutuskannya.',
      dok1: 'Hasil Audit Kepatuhan Hand Hygiene Bangsal yang Menunjukkan Skor Baik',
      dok2: 'Sertifikat Pelatihan PPI (Pencegahan & Pengendalian Infeksi) Tingkat Dasar'
    }
  },
  {
    kode: 'KD-12',
    judul: 'Melakukan tindakan pencegahan cedera dan keselamatan pasien (Patient Safety)',
    keterangan: 'SKKNI: Identifikasi pasien (gelang), pencegahan pasien jatuh, komunikasi SBAR / TBAK',
    form02: {
      elemen1: 'Menerapkan identifikasi pasien yang benar',
      k1_1: 'Mampu mencocokkan identitas minimal dengan 2 indikator (Nama Lengkap, Tgl Lahir / No RM) sebelum asuhan',
      k1_2: 'Mampu memastikan gelang identitas pasien terpasang dengan warna berkode tepat (Biru/Merah Muda/Kuning/Merah)',
      k1_3: 'Mampu menerapkan verifikasi identitas pasien pada pemberian obat, darah, dan tindakan bedah',
      elemen2: 'Menerapkan pencegahan pasien jatuh dan keselamatan fisik',
      k2_1: 'Mampu memasang dan mengunci side rails tempat tidur pasien beresiko tinggi jatuh',
      k2_2: 'Mampu memasang pin penanda resiko jatuh kuning pada gelang pasien dan menempelkan stiker di bed',
      k2_3: 'Mampu menggunakan teknik serah terima pasien dengan komunikasi SBAR dan konfirmasi TBAK'
    },
    form03: {
      acuan: 'KD-12 / KES.PG02.012.01 PATIENT SAFETY & CEGAH CEDERA',
      q_obs1: 'Melakukan identifikasi pasien secara aktif dengan menanyakan nama sebelum menyuntikkan obat',
      q_obs2: 'Memastikan bel pemanggil perawat terjangkau oleh tangan pasien dan roda bed dalam keadaan terkunci',
      q_obs3: 'Menuliskan laporan serah terima pasien memakai format SBAR (Situation, Background, Assessment, Recommendation)',
      q_obs4: 'Melaporkan Insiden Keselamatan Pasien (KTD/KNC/KTC/Sentinel) kepada atasan dalam waktu <24 jam',
      q_lisan1: 'Jelaskan apa itu 6 Sasaran Keselamatan Pasien (IPSG) di rumah sakit secara lengkap.',
      q_lisan2: 'Bagaimana prosedur komunikasi verbal yang aman menggunakan metode TBAK (Tulis, Baca kembali, Konfirmasi)?',
      q_tulis: 'Jelaskan definisi dan perbedaan Kejadian Nyaris Cedera (KNC), Kejadian Tidak Diharapkan (KTD), Kejadian Tidak Cedera (KTC), dan Sentinel Event beserta alur pelaporan insidennya.',
      dok1: 'Laporan Kepatuhan Identifikasi Pasien & Pengkajian Resiko Jatuh Bangsal',
      dok2: 'Sertifikat Pelatihan Keselamatan Pasien Rumah Sakit (KPRS / Patient Safety)'
    }
  }
];

const LIST_12_KOMPETENSI_KEBIDANAN = [
  {
    kode: 'KDB-01',
    judul: 'Asuhan antenatal (kehamilan) fisiologis',
    keterangan: 'Asuhan kehamilan normal, Leopold, TFU, edukasi nutrisi dan tablet Fe',
    form02: {
      elemen1: 'Melakukan pemeriksaan fisik dan obstetrik ibu hamil',
      k1_1: 'Mampu melakukan palpasi Leopold I - IV dengan benar',
      k1_2: 'Mampu mengukur Tinggi Fundus Uteri (TFU) menggunakan pita ukur',
      k1_3: 'Mampu mendengarkan DJJ janin dengan Doppler',
      elemen2: 'Memberikan edukasi asuhan antenatal fisiologis',
      k2_1: 'Mampu mengedukasi ibu tentang nutrisi dan tablet Fe selama kehamilan',
      k2_2: 'Mampu mengidentifikasi tanda bahaya kehamilan trimester I, II, dan III',
      k2_3: 'Mampu menentukan usia kehamilan dan Hari Perkiraan Lahir (HPL)'
    },
    form03: {
      acuan: 'KDB-01 ASUHAN ANTENATAL FISIOLOGIS',
      q_obs1: 'Melakukan palpasi Leopold dan mendengarkan DJJ dengan Doppler',
      q_obs2: 'Mengukur Tinggi Fundus Uteri (TFU) dan lingkar perut ibu hamil',
      q_obs3: 'Mengidentifikasi status imunisasi TT dan tablet Fe ibu hamil',
      q_obs4: 'Memberikan konseling tanda bahaya kehamilan dan nutrisi ibu',
      q_lisan1: 'Sebutkan minimal 5 tanda bahaya kehamilan pada Trimester III.',
      q_lisan2: 'Bagaimana cara menentukan TFU menurut Mc Donald dan menghitung HPL?',
      q_tulis: 'Jelaskan patofisiologi mual muntah berlebihan (hiperemesis gravidarum) dan cara pencegahan anemia pada ibu hamil.',
      dok1: 'Buku KIA / Kartu Ibu (ANC)',
      dok2: 'Sertifikat Pelatihan ANC Terpadu / USG Terbatas'
    }
  },
  {
    kode: 'KDB-02',
    judul: 'Asuhan persalinan dan kelahiran fisiologis',
    keterangan: 'Asuhan persalinan normal (APN) kala I, II, III, dan IV, Partograf',
    form02: {
      elemen1: 'Melakukan pemantauan kemajuan persalinan',
      k1_1: 'Mampu mengisi lembar partograf secara akurat dan tepat waktu',
      k1_2: 'Mampu melakukan pemeriksaan dalam (VT) secara aseptik',
      k1_3: 'Mampu menilai his (frekuensi, durasi, kekuatan) and DJJ saat inpartu',
      elemen2: 'Menolong persalinan normal',
      k2_1: 'Mampu memimpin persalinan Kala II sesuai 60 langkah APN',
      k2_2: 'Mampu melakukan manajemen aktif kala III (MAK III) secara tepat',
      k2_3: 'Mampu mengidentifikasi dan merawat luka perineum derajat 1-2'
    },
    form03: {
      acuan: 'KDB-02 ASUHAN PERSALINAN DAN KELAHIRAN FISIOLOGIS',
      q_obs1: 'Menerapkan teknik 60 langkah asuhan persalinan normal (APN)',
      q_obs2: 'Melakukan pemantauan kala I aktif menggunakan partograf',
      q_obs3: 'Menyuntikkan oksitosin 10 IU IM segera setelah bayi lahir',
      q_obs4: 'Melakukan pemeriksaan plasenta (selaput dan kotiledon) setelah lahir',
      q_lisan1: 'Jelaskan 3 pilar penting dalam manajemen aktif kala III (MAK III).',
      q_lisan2: 'Kapan lembar partograf mulai diisi dan apa indikasi garis waspada?',
      q_tulis: 'Deskripsikan langkah-langkah penanganan laserasi jalan lahir derajat 2.',
      dok1: 'Logbook Partus Normal (Minimal 50 kasus)',
      dok2: 'Sertifikat Asuhan Persalinan Normal (APN) Valid'
    }
  },
  {
    kode: 'KDB-03',
    judul: 'Asuhan nifas dan menyusui fisiologis',
    keterangan: 'Asuhan post partum, involusi uteri, pengeluaran lochea, laktasi',
    form02: {
      elemen1: 'Melakukan pemantauan involusi dan lochea',
      k1_1: 'Mampu memeriksa TFU dan kontraksi uterus post partum',
      k1_2: 'Mampu mengidentifikasi jenis dan karakteristik lochea normal',
      k1_3: 'Mampu memantau pengeluaran ASI dan kondisi payudara ibu nifas',
      elemen2: 'Edukasi dan konseling laktasi',
      k2_1: 'Mampu mengajarkan teknik menyusui yang benar (posisi dan pelekatan)',
      k2_2: 'Mampu mengedukasi ibu tentang gizi ibu menyusui dan KB pasca salin',
      k2_3: 'Mampu melakukan perawatan payudara (breast care) dan bendungan ASI'
    },
    form03: {
      acuan: 'KDB-03 ASUHAN NIFAS DAN MENYUSUI FISIOLOGIS',
      q_obs1: 'Memeriksa TFU, kontraksi uterus, dan lochea pada ibu nifas',
      q_obs2: 'Membimbing ibu tentang posisi dan pelekatan menyusui yang benar',
      q_obs3: 'Melakukan edukasi perawatan payudara pasca melahirkan',
      q_obs4: 'Mendokumentasikan pemantauan masa nifas pada rekam medis',
      q_lisan1: 'Bagaimana cara membedakan lochea rubra, sanguinolenta, serosa, dan alba?',
      q_lisan2: 'Apa tanda-tanda pelekatan menyusui yang baik dan efektif?',
      q_tulis: 'Jelaskan penanganan bendungan ASI dan edukasi menyusui eksklusif.',
      dok1: 'Logbook Pemantauan Nifas',
      dok2: 'Sertifikat Pelatihan Konseling Menyusui / Laktasi'
    }
  },
  {
    kode: 'KDB-04',
    judul: 'Asuhan bayi baru lahir (neonatus) fisiologis',
    keterangan: 'Pemeriksaan fisik bayi baru lahir, APGAR score, imunisasi Hb0, salep mata, vitamin K1',
    form02: {
      elemen1: 'Melakukan asuhan segera bayi baru lahir',
      k1_1: 'Mampu melakukan penilaian APGAR score menit 1 dan 5',
      k1_2: 'Mampu melakukan Inisiasi Menyusu Dini (IMD) minimal 1 jam',
      k1_3: 'Mampu memberikan salep mata antibiotik dan injeksi Vitamin K1 IM',
      elemen2: 'Melakukan pemeriksaan fisik dan perawatan neonatus',
      k2_1: 'Mampu mengukur berat badan, panjang badan, dan lingkar kepala neonatus',
      k2_2: 'Mampu memandikan bayi baru lahir dan merawat tali pusat dengan steril',
      k2_3: 'Mampu memberikan imunisasi Hepatitis B0 (HB0) secara tepat'
    },
    form03: {
      acuan: 'KDB-04 ASUHAN BAYI BBL FISIOLOGIS',
      q_obs1: 'Melakukan penilaian awal bayi baru lahir dan menjaga kehangatan tubuh bayi',
      q_obs2: 'Melakukan penyuntikan vitamin K1 1 mg IM di paha kiri anterolateral',
      q_obs3: 'Melakukan pemeriksaan fisik neonatus secara head-to-toe',
      q_obs4: 'Memberikan salep mata profilaksis pada kedua mata bayi baru lahir',
      q_lisan1: 'Mengapa vitamin K1 sangat penting diberikan pada bayi baru lahir?',
      q_lisan2: 'Bagaimana kriteria penilaian APGAR score untuk menilai derajat asfiksia?',
      q_tulis: 'Jelaskan langkah-langkah pencegahan hipotermia pada neonatus.',
      dok1: 'Logbook Asuhan Neonatus Baru Lahir',
      dok2: 'Sertifikat Pelatihan Resusitasi Neonatus / Manajemen BBLR'
    }
  },
  {
    kode: 'KDB-05',
    judul: 'Pelayanan kontrasepsi dan keluarga berencana (KB)',
    keterangan: 'Konseling KB, pemasangan dan pencabutan kontrasepsi suntik, IUD, implan',
    form02: {
      elemen1: 'Melakukan konseling KB menggunakan alat bantu',
      k1_1: 'Mampu menggunakan Lembar Balik ABPK KB untuk konseling pasutri',
      k1_2: 'Mampu mengidentifikasi indikasi dan kontraindikasi tiap metode kontrasepsi',
      k1_3: 'Mampu menghitung efektivitas dan menjelaskan efek samping KB',
      elemen2: 'Melaksanakan pemasangan dan pencabutan alat kontrasepsi',
      k2_1: 'Mampu melakukan penyuntikan KB (1 bulanan / 3 bulanan) dengan benar',
      k2_2: 'Mampu mempersiapkan dan melakukan insersi IUD/AKDR secara aseptik',
      k2_3: 'Mampu mempersiapkan dan melakukan insersi/ekstraksi implan/AKBK'
    },
    form03: {
      acuan: 'KDB-05 PELAYANAN KONTRASEPSI DAN KELUARGA BERENCANA',
      q_obs1: 'Memberikan konseling KB menggunakan ABPK secara lengkap',
      q_obs2: 'Melakukan teknik insersi IUD/AKDR menggunakan uterus model',
      q_obs3: 'Melakukan teknik insersi/ekstraksi implan/AKBK di bawah pengawasan',
      q_obs4: 'Mendokumentasikan pilihan dan tanggal kontrol KB pasien',
      q_lisan1: 'Sebutkan kontraindikasi mutlak dari penggunaan pil KB kombinasi.',
      q_lisan2: 'Bagaimana penanganan efek samping spotting dan amenore pada akseptor KB suntik 3 bulan?',
      q_tulis: 'Jelaskan mekanisme kerja IUD dan implan dalam mencegah kehamilan.',
      dok1: 'Logbook Pemasangan IUD/Implan',
      dok2: 'Sertifikat Pelatihan CTU (Contraceptive Technology Update)'
    }
  },
  {
    kode: 'KDB-06',
    judul: 'Asuhan kesehatan reproduksi perempuan sepanjang siklus kehidupan',
    keterangan: 'Asuhan masa remaja, pra-nikah, klimakterium/menopause, IVA test/Papsmear',
    form02: {
      elemen1: 'Melakukan pengkajian kesehatan reproduksi',
      k1_1: 'Mampu mendeteksi gangguan menstruasi (dismenore, amenore) pada remaja',
      k1_2: 'Mampu melakukan konseling pra-nikah (kesehatan reproduksi dan gizi)',
      k1_3: 'Mampu mengedukasi perempuan klimakterium tentang gejala menopause',
      elemen2: 'Melakukan skrining kanker organ reproduksi',
      k2_1: 'Mampu mempersiapkan pasien dan alat untuk skrining IVA Test',
      k2_2: 'Mampu mengaplikasikan asam asetat 3-5% pada serviks secara tepat',
      k2_3: 'Mampu melakukan rujukan dini jika ditemukan lesi pra-kanker serviks'
    },
    form03: {
      acuan: 'KDB-06 ASUHAN KESEHATAN REPRODUKSI PEREMPUAN',
      q_obs1: 'Menyiapkan alat dan melakukan pemeriksaan IVA Test',
      q_obs2: 'Melakukan konseling masa klimakterium/menopause pada wanita paruh baya',
      q_obs3: 'Melakukan edukasi SADARI (Pemeriksaan Payudara Sendiri) pada pasien',
      q_obs4: 'Mendokumentasikan hasil pemeriksaan reproduksi secara rahasia',
      q_lisan1: 'Jelaskan interpretasi hasil pemeriksaan IVA Test (positif/negatif).',
      q_lisan2: 'Bagaimana edukasi gizi dan psikologis bagi wanita yang memasuki masa menopause?',
      q_tulis: 'Uraikan peran bidan dalam konseling pranikah untuk pencegahan stunting.',
      dok1: 'Logbook Pelayanan Kesehatan Reproduksi / IVA',
      dok2: 'Sertifikat Pelatihan IVA Test / Skrining Kanker Serviks'
    }
  },
  {
    kode: 'KDB-07',
    judul: 'Deteksi dini komplikasi maternal dan neonatal',
    keterangan: 'Skrining komplikasi kehamilan, preeklamsia, perdarahan, ikterus, asfiksia',
    form02: {
      elemen1: 'Mendeteksi dini komplikasi pada ibu hamil/melahirkan',
      k1_1: 'Mampu mendeteksi tanda-tanda preeklamsia (edema, proteinuria, hipertensi)',
      k1_2: 'Mampu mengidentifikasi gejala perdarahan antepartum (plasenta previa, solusio)',
      k1_3: 'Mampu mendeteksi tanda-tanda inpartu patologis (partus lama/macet)',
      elemen2: 'Mendeteksi dini komplikasi pada neonatus',
      k2_1: 'Mampu menilai tanda-tanda ikterus patologis pada bayi baru lahir',
      k2_2: 'Mampu menilai status pernapasan bayi (asfiksia/respiratory distress)',
      k2_3: 'Mampu mendeteksi tanda bahaya infeksi tali pusat (omfalitis) dan sepsis'
    },
    form03: {
      acuan: 'KDB-07 DETEKSI DINI KOMPLIKASI MATERNAL DAN NEONATAL',
      q_obs1: 'Melakukan pemeriksaan urine protein celup (proteinuria dipstick)',
      q_obs2: 'Menghitung skor Poedji Rochjati untuk menilai risiko kehamilan ibu',
      q_obs3: 'Melakukan penilaian refleks hisap dan refleks moro pada bayi',
      q_obs4: 'Mendokumentasikan data subjektif dan objektif tanda komplikasi',
      q_lisan1: 'Sebutkan batasan proteinuria pada preeklamsia ringan vs berat.',
      q_lisan2: 'Bagaimana cara membedakan ikterus fisiologis dan patologis pada neonatus?',
      q_tulis: 'Jelaskan patofisiologi preeklamsia dan klasifikasi risiko kehamilan berdasarkan skor Poedji Rochjati.',
      dok1: 'Logbook Deteksi Risti Ibu Hamil',
      dok2: 'Sertifikat Pelatihan Skrining Kehamilan Risiko Tinggi'
    }
  },
  {
    kode: 'KDB-08',
    judul: 'Penanganan kegawatdaruratan maternal dan neonatal (PONED)',
    keterangan: 'Penanganan eklamsia (MgSO4), perdarahan postpartum, resusitasi neonatus',
    form02: {
      elemen1: 'Melaksanakan penanganan awal kegawatdaruratan maternal',
      k1_1: 'Mampu memberikan dosis inisial dan rumatan MgSO4 secara aman',
      k1_2: 'Mampu melakukan Kompresi Bimanual Interna (KBI) dan Eksterna (KBE)',
      k1_3: 'Mampu memasang tampon kondom kateter untuk perdarahan postpartum',
      elemen2: 'Melaksanakan penanganan awal kegawatdaruratan neonatal',
      k2_1: 'Mampu melakukan langkah awal resusitasi neonatus (stabilisasi, isap lendir)',
      k2_2: 'Mampu melakukan Ventilasi Tekanan Positif (VTP) menggunakan balon-sungkup',
      k2_3: 'Mampu mempersiapkan rujukan pasien gawat darurat dengan prinsip BAKSOKU'
    },
    form03: {
      acuan: 'KDB-08 PENANGANAN KEGAWATDARURATAN MATERNAL DAN NEONATAL',
      q_obs1: 'Melakukan simulasi pemberian MgSO4 sesuai syarat keamanan klinis',
      q_obs2: 'Melakukan kompresi bimanual interna (KBI) pada phantom uterus',
      q_obs3: 'Menerapkan siklus VTP pada phantom resusitasi bayi baru lahir',
      q_obs4: 'Mengisi form rujukan BAKSOKU secara lengkap dan tepat',
      q_lisan1: 'Sebutkan syarat-syarat mutlak sebelum menyuntikkan MgSO4 pada pasien preeklamsia/eklamsia.',
      q_lisan2: 'Apa langkah penanganan awal jika terjadi retensio plasenta setelah MAK III?',
      q_tulis: 'Jelaskan alur resusitasi neonatus menurut panduan IDAI terbaru.',
      dok1: 'Logbook Penanganan Kasus Gadar Maternal/Neonatal',
      dok2: 'Sertifikat Pelatihan APN / PONED / PONEK Aktif'
    }
  },
  {
    kode: 'KDB-09',
    judul: 'Komunikasi interpersonal dan konseling dalam praktik kebidanan',
    keterangan: 'Konseling masa kehamilan, KB, kesehatan reproduksi, breaking bad news',
    form02: {
      elemen1: 'Membina hubungan saling percaya dengan pasien/klien',
      k1_1: 'Mampu menerapkan prinsip komunikasi verbal dan non-verbal yang hangat',
      k1_2: 'Mampu mendengarkan keluhan pasien secara aktif tanpa menghakimi',
      k1_3: 'Mampu mengklarifikasi pemahaman klien dengan metode re-call/re-phrase',
      elemen2: 'Melakukan konseling kasus kebidanan',
      k2_1: 'Mampu mendampingi ibu hamil dengan kecemasan tinggi menjelang persalinan',
      k2_2: 'Mampu melakukan konseling pasca-keguguran dengan empati',
      k2_3: 'Mampu menyampaikan berita buruk (breaking bad news) secara taktis'
    },
    form03: {
      acuan: 'KDB-09 KOMUNIKASI INTERPERSONAL DAN KONSELING',
      q_obs1: 'Menunjukkan empati dan kontak mata yang baik saat pasien konseling',
      q_obs2: 'Menjelaskan pilihan kontrasepsi dengan seimbang dan tidak memihak',
      q_obs3: 'Menyampaikan penjelasan tentang kondisi kehamilan berisiko kepada keluarga',
      q_obs4: 'Melakukan dokumentasi catatan konseling secara rahasia',
      q_lisan1: 'Bagaimana cara menyampaikan berita duka atau kematian janin kepada ibu hamil?',
      q_lisan2: 'Jelaskan perbedaan mendasar antara penyuluhan kelompok dan konseling individual.',
      q_tulis: 'Uraikan teknik-teknik komunikasi terapeutik untuk meredakan kecemasan ibu bersalin primigravida.',
      dok1: 'Logbook Konseling Kebidanan',
      dok2: 'Sertifikat Pelatihan Komunikasi Terapeutik / Konseling Kesehatan'
    }
  },
  {
    kode: 'KDB-10',
    judul: 'Penerapan etika, hukum kesehatan, dan keselamatan pasien dalam pelayanan kebidanan',
    keterangan: 'Informed consent, kewenangan bidan, hak reproduksi perempuan, keselamatan pasien',
    form02: {
      elemen1: 'Menerapkan prinsip etik dan hukum kebidanan',
      k1_1: 'Mampu menghormati hak otonomi pasien dalam memilih metode melahirkan',
      k1_2: 'Mampu bertindak sesuai kewenangan profesi bidan (PMK 21/2021)',
      k1_3: 'Mampu menjelaskan aspek legal informed choice dan informed consent',
      elemen2: 'Menerapkan sasaran keselamatan pasien kebidanan',
      k2_1: 'Mampu verifikasi identitas pasien dengan benar sebelum pemberian obat',
      k2_2: 'Mampu berkomunikasi efektif menggunakan metode SBAR dan Write down-Read back',
      k2_3: 'Mampu mencegah risiko jatuh pada ibu pasca persalinan (early mobilization)'
    },
    form03: {
      acuan: 'KDB-10 ETIKA HUKUM DAN KESELAMATAN PASIEN KEBIDANAN',
      q_obs1: 'Meminta persetujuan lisan/tertulis sebelum melakukan pemeriksaan dalam (VT)',
      q_obs2: 'Melakukan verifikasi identitas pasien menggunakan gelang identitas',
      q_obs3: 'Melaporkan kondisi pasien kritis menggunakan format komunikasi SBAR',
      q_obs4: 'Mendokumentasikan persetujuan tindakan medis dengan lengkap',
      q_lisan1: 'Apa perbedaan antara informed choice dan informed consent dalam kebidanan?',
      q_lisan2: 'Bagaimana batasan kewenangan bidan dalam penanganan kasus darurat di luar fasilitas?',
      q_tulis: 'Jelaskan 6 Sasaran Keselamatan Pasien (SKP) dan aplikasinya di ruang bersalin.',
      dok1: 'Surat Pernyataan Kode Etik Bidan RS',
      dok2: 'Sertifikat Pelatihan Sasaran Keselamatan Pasien / Aspek Legal'
    }
  },
  {
    kode: 'KDB-11',
    judul: 'Manajemen dan pelayanan kebidanan komunitas',
    keterangan: 'Asuhan kebidanan di komunitas, imunisasi dasar, penyuluhan kesehatan, posyandu',
    form02: {
      elemen1: 'Melakukan asuhan kebidanan di wilayah komunitas',
      k1_1: 'Mampu melakukan kunjungan rumah nifas (KF) dan neonatus (KN) di desa',
      k1_2: 'Mampu mendeteksi masalah kesehatan ibu dan anak di tingkat komunitas',
      k1_3: 'Mampu mengkoordinasikan rujukan ibu hamil risiko tinggi dari desa ke faskes',
      elemen2: 'Mengelola pelayanan imunisasi dan penyuluhan',
      k2_1: 'Mampu mempersiapkan cold chain dan logistik vaksin dengan benar',
      k2_2: 'Mampu memberikan imunisasi dasar (BCG, DPT-HB-Hib, Polio, Campak)',
      k2_3: 'Mampu menyelenggarakan penyuluhan gizi, ASI, dan KB di Posyandu'
    },
    form03: {
      acuan: 'KDB-11 MANAJEMEN DAN PELAYANAN KEBIDANAN KOMUNITAS',
      q_obs1: 'Melakukan teknik penyuntikan imunisasi dasar secara intramuskular dan intrakutan',
      q_obs2: 'Melakukan pemantauan suhu lemari es penyimpanan vaksin (cold chain)',
      q_obs3: 'Melakukan konseling KIA menggunakan lembar balik atau poster',
      q_obs4: 'Mengisi buku registers imunisasi dan register KIA posyandu',
      q_lisan1: 'Sebutkan jadwal dan jenis imunisasi dasar lengkap pada bayi usia 0-11 bulan.',
      q_lisan2: 'Bagaimana cara menjaga rantai dingin vaksin (cold chain) di tingkat puskesmas pembantu?',
      q_tulis: 'Jelaskan peran posyandu dan program PWS-KIA (Pemantauan Wilayah Setempat KIA) di komunitas.',
      dok1: 'Logbook Kunjungan Rumah KIA',
      dok2: 'Sertifikat Pelatihan Imunisasi / Kebidanan Komunitas'
    }
  },
  {
    kode: 'KDB-12',
    judul: 'Penerapan pencegahan dan pengendalian infeksi (PPI) dalam pelayanan kebidanan',
    keterangan: 'Dekontaminasi alat, APD, pembuangan limbah tajam, cuci tangan 6 langkah',
    form02: {
      elemen1: 'Menerapkan teknik kewaspadaan standar',
      k1_1: 'Mampu mempraktikkan cuci tangan 6 langkah WHO pada 5 momen',
      k1_2: 'Mampu mengenakan APD lengkap (celemek, masker, sarung tangan) dengan benar',
      k1_3: 'Mampu melakukan dekontaminasi dan pencucian alat kebidanan bekas pakai',
      elemen2: 'Mengelola limbah medis dan sterilisasi alat',
      k2_1: 'Mampu melakukan pembuangan spuit bekas ke safety box (no recapping)',
      k2_2: 'Mampu melakukan sterilisasi alat logam dan karet menggunakan autoclave',
      k2_3: 'Mampu mengelola penanganan plasenta pasca persalinan secara hygienis'
    },
    form03: {
      acuan: 'KDB-12 PENCEGAHAN DAN PENGENDALIAN INFEKSI (PPI)',
      q_obs1: 'Mempraktikkan teknik mencuci tangan 6 langkah WHO di depan penguji',
      q_obs2: 'Melakukan dekontaminasi alat bekas pakai menggunakan larutan klorin 0.5% selama 10 menit',
      q_obs3: 'Membuang jarum suntik bekas ke safety box tanpa menutup kembali jarum',
      q_obs4: 'Melakukan teknik pemakaian sarung tangan steril (handscoon steril) yang benar',
      q_lisan1: 'Mengapa dilarang melakukan recapping (menutup kembali jarum) setelah menyuntik?',
      q_lisan2: 'Jelaskan prosedur pengolahan alat bekas pakai mulai dari dekontaminasi, pencucian, hingga DTT/sterilisasi.',
      q_tulis: 'Jelaskan perbedaan antara sterilisasi, desinfeksi tingkat tinggi (DTT), dan dekontaminasi.',
      dok1: 'Sertifikat Pelatihan PPI (Pencegahan & Pengendalian Infeksi)',
      dok2: 'Logbook Kepatuhan Hand Hygiene RS / Puskesmas'
    }
  }
];

const getCompetencyDetails = (comp) => {
  const code = comp?.kode_kompetensi || comp?.kode || 'KD-07';
  const name = comp?.nama_kompetensi || comp?.judul || comp?.nama || 'Memfasilitasi pemenuhan kebutuhan cairan dan elektrolit';
  const unit = comp?.unit || 'Keperawatan Umum';
  const category = comp?.kategori || 'Kompetensi Dasar';

  const existing = LIST_12_KOMPETENSI.find(c => c.kode === code) || LIST_12_KOMPETENSI_KEBIDANAN.find(c => c.kode === code);
  if (existing) return existing;

  return {
    kode: code,
    judul: name,
    keterangan: `${category} : Asuhan keperawatan pada unit ${unit}`,
    form02: {
      elemen1: `Mempersiapkan tindakan pelaksanaan ${name}`,
      k1_1: `Mampu mengidentifikasi indikasi dan kontraindikasi tindakan ${name}`,
      k1_2: `Mampu menyiapkan instrumen medis dan bahan habis pakai untuk ${name} secara higienis`,
      k1_3: `Mampu memposisikan pasien dengan aman serta melakukan verifikasi identitas`,
      elemen2: `Melaksanakan tindakan asuhan ${name} sesuai standar`,
      k2_1: `Mampu mendemonstrasikan langkah-langkah prosedural tindakan ${name} secara terampil`,
      k2_2: `Mampu mendeteksi kemungkinan komplikasi atau penyimpangan klinis selama tindakan`,
      k2_3: `Mampu merapikan pasien, membersihkan alat, dan mencatat respon pasien pada rekam medis`
    },
    form03: {
      acuan: `${code} / ${name}`,
      q_obs1: `Menyiapkan instrumen dan bahan habis pakai medis yang bersih/steril sesuai SOP ${name}`,
      q_obs2: `Mengidentifikasi pasien secara aktif dan menjelaskan tujuan tindakan ${name} secara terapeutik`,
      q_obs3: `Melakukan prosedur klinis tindakan ${name} secara steril/aseptik dengan terampil dan aman`,
      q_obs4: `Mendokumentasikan tindakan keperawatan, volume, respon subjektif, dan objektif pasien`,
      q_lisan1: `Jelaskan indikasi utama dan komplikasi potensial yang dapat terjadi saat melakukan tindakan ${name}.`,
      q_lisan2: `Bagaimana langkah pencegahan infeksi (PPI) yang wajib Anda lakukan saat mempraktikkan asuhan ini?`,
      q_tulis: `Uraikan landasan teori klinis di balik tindakan ${name}, sebutkan instrumen yang digunakan beserta fungsinya, dan jelaskan kriteria evaluasi hasil asuhannya.`,
      dok1: `Logbook Asuhan Keperawatan Tindakan ${name} yang Terverifikasi`,
      dok2: `Sertifikat Pelatihan Kompetensi Terkait / Bukti Asesmen Kredensial Internal`
    }
  };
};

const getDefaultForm01 = (comp) => ({
  kodeUnit: comp?.kode || '',
  judulUnit: comp?.judul || '',
  keterangan: comp?.keterangan || '',
  buktiSerkom: false, buktiJobdes: false, buktiSket: false, buktiLain: false,
  rekomendasi: '',
  catatan: ''
});

const getDefaultForm02 = (comp) => ({
  k1_1: '', k1_2: '', k1_3: '',
  k2_1: '', k2_2: '', k2_3: '',
  bukti_1: '',
  rekomendasi: ''
});

const getDefaultForm03 = (comp) => ({
  pendekatan: '',
  tujuan: '',
  acuan: comp?.form03?.acuan || '',
  metodeObservasi: false, metodeUjiLisan: false, metodeStudiKasus: false, metodeUjiTulis: false, metodePortofolio: false, metodeSimulasi: false,
  validitas: '', reliabilitas: '', fleksibilitas: '', keadilan: ''
});

const getDefaultForm03a = (comp) => ({
  q1: '', q2: '', q3: '', q4: '',
  umpanBalik: ''
});

const getDefaultForm03b = (comp) => ({
  q1: '',
  q2: '',
  grade1: '', grade2: ''
});

const getDefaultForm03c = (comp) => ({
  essay1: '',
  grade1: ''
});

const getDefaultForm03d = (comp) => ({
  dok1: '', dok2: '',
  v1: false, a1: false, t1: false, k1: false,
  v2: false, a2: false, t2: false, k2: false
});

const getDefaultForm04 = () => ({
  tujuanJelas: undefined,
  standarJelas: undefined,
  buktiDimengerti: undefined,
  hakJelas: undefined,
  bandingJelas: undefined,
  kerahasiaanJelas: undefined,
  hariTanggal: '',
  waktu: '',
  tempat: '',
  asesorSign: false, asesiSign: false
});

const getDefaultForm05 = () => ({
  cekMandiri: false, cekBukti: false, cekMetode: false, cekPerangkat: false,
  rekomendasi: ''
});

const getDefaultForm06 = () => ({
  observasiOk: false, lisanOk: false, tulisOk: false, portofolioOk: false,
  catatanPelaksanaan: ''
});

const getDefaultForm07 = () => ({
  keputusan: '',
  tindakLanjut: '',
  catatanAsesor: ''
});

const getDefaultForm08 = () => ({
  penjelasanOk: false, kesempatanOk: false, adilOk: false,
  catatanAsesi: ''
});

const getDefaultForm09 = () => ({
  konsistensiOk: false, keadilanOk: false, perbaikanOk: false,
  rekomendasiKajiUlang: ''
});

const formatIndoDate = (dateStr) => {
  if (!dateStr) return '...';
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? '...' : d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
};

const toProperCase = (str) => {
  if (!str) return '';
  return str.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
};

const cleanJenjang = (jenjangStr) => {
  if (!jenjangStr) return '';
  return jenjangStr
    .replace(/\b(terampil|ahli\s+pertama|ahli\s+muda|ahli\s+madya|ahli\s+utama|ahli)\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
};

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [filterStatusProses, setFilterStatusProses] = useState('Open');
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [perawatData, setPerawatData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Kredensial & RKK states
  const [jenisList, setJenisList] = useState([]);
  const [rkkList, setRkkList] = useState([]);
  const [kredensialList, setKredensialList] = useState([]);
  const [kredensialSelectedPerawatId, setKredensialSelectedPerawatId] = useState('');
  const [kredensialSearchPerawat, setKredensialSearchPerawat] = useState('');
  const [jenisForm, setJenisForm] = useState({ kd_jenis: '', nm_jenis: '' });
  const [editingJenisKd, setEditingJenisKd] = useState(null);
  const [showJenisModal, setShowJenisModal] = useState(false);
  const [rkkForm, setRkkForm] = useState({ kd_jenis: '', level_pk: 1, kewenangan: '', aktif: 1 });
  const [editingRkkId, setEditingRkkId] = useState(null);
  const [showRkkModal, setShowRkkModal] = useState(false);
  const [kredensialWorksheet, setKredensialWorksheet] = useState({});
  const [kredensialWorksheetDate, setKredensialWorksheetDate] = useState(new Date().toISOString().split('T')[0]);

  // Master RKK Tab tracking
  const [activeRkkJenisTab, setActiveRkkJenisTab] = useState('');
  const [activeRkkLevelTab, setActiveRkkLevelTab] = useState(1);
  const [currentPageRkk, setCurrentPageRkk] = useState(1);
  const [itemsPerPageRkk, setItemsPerPageRkk] = useState(10);
  const [currentPageJenis, setCurrentPageJenis] = useState(1);
  const [itemsPerPageJenis, setItemsPerPageJenis] = useState(10);
  const [kredensialActiveJenis, setKredensialActiveJenis] = useState('');


  // Authentication states
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('currentUser')) || null;
    } catch {
      return null;
    }
  });
  const getApiUrl = () => {
    const path = window.location.pathname;
    let folder = 'keperawatan3';
    if (path.includes('keperawatan3')) {
      folder = 'keperawatan3';
    } else if (path.includes('keperawatan')) {
      const match = path.match(/\/(keperawatan[^\/]*)/);
      if (match) {
        folder = match[1];
      }
    }
    if (window.location.port === '5173') {
      return `${window.location.protocol}//${window.location.hostname}/${folder}/public/api`;
    }
    return `${window.location.origin}/${folder}/public/api`;
  };
  const API_URL = getApiUrl();
  const BASE_URL = API_URL.replace('/api', '');
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // OTP states
  const [requireOtp, setRequireOtp] = useState(false);
  const [otpCode, setOtpCode] = useState('');

  // Settings / Profile states
  const [passwordForm, setPasswordForm] = useState({ old_password: '', new_password: '', confirm_password: '' });
  const [hpForm, setHpForm] = useState({ no_hp: '', otp: '' });
  const [showHpOtpInput, setShowHpOtpInput] = useState(false);
  const [tempUsername, setTempUsername] = useState('');
  const [devOtpMsg, setDevOtpMsg] = useState('');

  // Register states
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register' | 'create_account' | 'forgot_password'

  // Create Account states
  const [createAccountStep, setCreateAccountStep] = useState(1);
  const [createAccountForm, setCreateAccountForm] = useState({ nik: '', id_perawat: '', nama: '', username: '', password: '', hp: '', is_hp_validated: 0 });

  const handleCheckNikExisting = (e) => {
    e.preventDefault();
    if (!createAccountForm.nik) return;
    setIsRegistering(true);
    setRegisterError('');
    fetch(API_URL + '/register/check-nik-existing', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nik: createAccountForm.nik })
    })
      .then(res => res.json())
      .then(data => {
        setIsRegistering(false);
        if (data.exists && !data.has_account) {
          setCreateAccountForm({ ...createAccountForm, id_perawat: data.id_perawat, nama: data.nama });
          setCreateAccountStep(2);
        } else {
          setRegisterError(data.message || 'Terjadi kesalahan.');
        }
      })
      .catch(() => {
        setIsRegistering(false);
        setRegisterError('Terjadi kesalahan saat mengecek NIK.');
      });
  };

  const handleCreateAccountSubmit = (e) => {
    e.preventDefault();
    setIsRegistering(true);
    setRegisterError('');
    fetch(API_URL + '/register/create-account', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(createAccountForm)
    })
      .then(res => res.json())
      .then(data => {
        setIsRegistering(false);
        if (data.success) {
          setCreateAccountStep(3);
        } else {
          setRegisterError(data.messages?.error || data.message || 'Gagal membuat akun.');
        }
      })
      .catch(() => {
        setIsRegistering(false);
        setRegisterError('Terjadi kesalahan sistem.');
      });
  };

  // Forgot Password states
  const [forgotPasswordStep, setForgotPasswordStep] = useState(1);
  const [forgotPasswordForm, setForgotPasswordForm] = useState({ username: '', otp: '', new_password: '' });

  const handleForgotPasswordOtp = (e) => {
    e.preventDefault();
    if (!forgotPasswordForm.username) return;
    setIsRegistering(true);
    setRegisterError('');
    fetch(API_URL + '/auth/forgot-password-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: forgotPasswordForm.username })
    })
      .then(res => res.json())
      .then(data => {
        setIsRegistering(false);
        if (data.success) {
          setForgotPasswordStep(2);
        } else {
          setRegisterError(data.messages?.error || data.message || 'Gagal meminta OTP.');
        }
      })
      .catch(() => {
        setIsRegistering(false);
        setRegisterError('Terjadi kesalahan sistem.');
      });
  };

  const handleResetPasswordSubmit = (e) => {
    e.preventDefault();
    setIsRegistering(true);
    setRegisterError('');
    fetch(API_URL + '/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(forgotPasswordForm)
    })
      .then(res => res.json())
      .then(data => {
        setIsRegistering(false);
        if (data.success) {
          setForgotPasswordStep(3);
        } else {
          setRegisterError(data.messages?.error || data.message || 'Gagal mereset password.');
        }
      })
      .catch(() => {
        setIsRegistering(false);
        setRegisterError('Terjadi kesalahan sistem.');
      });
  };
  const [registerStep, setRegisterStep] = useState(1);
  const [registerForm, setRegisterForm] = useState({
    nik: '', nip: '', nama: '', tempat_lahir: '', tanggal_lahir: '', jk: 'L', alamat: '', hp: '', email: '', profesi: '', unit_kerja: '', pendidikan_terakhir: '', username: '', password: '', is_hp_validated: 0
  });
  const [registerError, setRegisterError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const handleCheckNik = (e) => {
    e.preventDefault();
    if (!registerForm.nik) return;
    setIsRegistering(true);
    setRegisterError('');
    fetch(API_URL + '/register/check-nik', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nik: registerForm.nik })
    })
      .then(res => res.json())
      .then(data => {
        setIsRegistering(false);
        if (data.exists) {
          setRegisterError(data.message || 'NIK sudah terdaftar.');
        } else {
          setRegisterStep(2);
        }
      })
      .catch(() => {
        setIsRegistering(false);
        setRegisterError('Terjadi kesalahan saat mengecek NIK.');
      });
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setIsRegistering(true);
    setRegisterError('');
    fetch(API_URL + '/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(registerForm)
    })
      .then(res => res.json())
      .then(data => {
        setIsRegistering(false);
        if (data.success) {
          setRegisterStep(4); // Success step
        } else {
          setRegisterError(data.messages?.error || data.message || 'Gagal mendaftar.');
        }
      })
      .catch(() => {
        setIsRegistering(false);
        setRegisterError('Terjadi kesalahan saat mendaftar.');
      });
  };

  // Master User Management states
  const [userData, setUserData] = useState([]);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [currentPageUser, setCurrentPageUser] = useState(1);
  const [itemsPerPageUser, setItemsPerPageUser] = useState(10);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [userModalMode, setUserModalMode] = useState('add');
  const [userFormData, setUserFormData] = useState({
    id: '', username: '', password: '', nama: '', role: 'Perawat', status: 'A', id_perawat: ''
  });

  // Toast notifications state
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 4000);
  };

  // Sertifikasi 13 Forms states
  const [sertifikatSelectedNurseId, setSertifikatSelectedNurseId] = useState('');
  const [sertifikatSubTab, setSertifikatSubTab] = useState('form_01');

  // Custom states to handle dynamic competency-bound saving & switching
  const [selectedKompetensiKode, setSelectedKompetensiKode] = useState('KD-07');
  const [competencyForms, setCompetencyForms] = useState({});
  const [competencies, setCompetencies] = useState([]);

  // New certification application history and workflow states
  const [pengajuanHistoryList, setPengajuanHistoryList] = useState([]);
  const [activePengajuan, setActivePengajuan] = useState(null);
  const [activeNurseCertificates, setActiveNurseCertificates] = useState([]);
  const [activeNursePelatihan, setActiveNursePelatihan] = useState([]);
  const [previewPhotoUrl, setPreviewPhotoUrl] = useState(null);
  const [sertifikatData, setSertifikatData] = useState(null);
  const [customTglMulaiAsesmen, setCustomTglMulaiAsesmen] = useState('');
  const [customTglSelesaiAsesmen, setCustomTglSelesaiAsesmen] = useState('');
  const [customTglDitetapkan, setCustomTglDitetapkan] = useState('');
  const [selectedPengajuanForMatriks, setSelectedPengajuanForMatriks] = useState(null);
  const [showDetailMatriksModal, setShowDetailMatriksModal] = useState(false);
  const [matriksTulisExamDetails, setMatriksTulisExamDetails] = useState(null);
  const [searchQueryAsesmenRecap, setSearchQueryAsesmenRecap] = useState('');
  const [filterUnitAsesmenRecap, setFilterUnitAsesmenRecap] = useState('');
  const [filterJenisAsesmenRecap, setFilterJenisAsesmenRecap] = useState('');
  const [filterRekomendasiAsesmenRecap, setFilterRekomendasiAsesmenRecap] = useState('');
  const [isCreatingPengajuan, setIsCreatingPengajuan] = useState(false);
  const [newPengajuanForm, setNewPengajuanForm] = useState({
    jenis_sertifikasi: 'Kompetensi Dasar',
    id_perawat: '',
    detail_kompetensi: ['KD-01', 'KD-02', 'KD-03', 'KD-04', 'KD-05', 'KD-06', 'KD-07', 'KD-08', 'KD-09', 'KD-10', 'KD-11', 'KD-12']
  });
  const [newPengajuanFile, setNewPengajuanFile] = useState(null);
  const [isSubmittingPengajuan, setIsSubmittingPengajuan] = useState(false);

  // Exam States
  const [jadwalUjianInput, setJadwalUjianInput] = useState('');
  const [batasAkhirUjianInput, setBatasAkhirUjianInput] = useState('');
  const [cheatCount, setCheatCount] = useState(0);
  const [cheatWarningModal, setCheatWarningModal] = useState({
    show: false,
    message: '',
    count: 0,
    isLast: false
  });
  const [ujianData, setUjianData] = useState(null);
  const [selectedPengajuanIds, setSelectedPengajuanIds] = useState([]);
  const [kolektifJadwalMulai, setKolektifJadwalMulai] = useState('');
  const [kolektifBatasAkhir, setKolektifBatasAkhir] = useState('');
  const [jawabanUjian, setJawabanUjian] = useState({});
  const [isSubmittingUjian, setIsSubmittingUjian] = useState(false);
  const [ujianTimeLeft, setUjianTimeLeft] = useState(0);
  const [currentUjianIndex, setCurrentUjianIndex] = useState(0);
  const [showNilaiModal, setShowNilaiModal] = useState(false);
  const [finalNilai, setFinalNilai] = useState(0);
  const [detailHasilUjian, setDetailHasilUjian] = useState(null);
  const [isViewingHasilUjian, setIsViewingHasilUjian] = useState(false);
  const [isAssessorModalOpen, setIsAssessorModalOpen] = useState(false);
  const [selectedAssessorId, setSelectedAssessorId] = useState('');
  const [selectedCoAssessorId, setSelectedCoAssessorId] = useState('');

  const fetchPengajuanHistory = () => {
    fetch(API_URL + '/pengajuan_sertifikasi')
      .then(res => res.json())
      .then(data => {
        setPengajuanHistoryList(Array.isArray(data) ? data : []);
      })
      .catch(err => console.error("Error fetching pengajuan history:", err));
  };

  const currentPerawatRecord = React.useMemo(() => {
    if (!currentUser || currentUser.role !== 'Perawat') return null;
    return perawatData.find(p => String(p.id_user) === String(currentUser.id));
  }, [currentUser, perawatData]);

  const handleSelectPengajuan = (pengajuan) => {
    setActivePengajuan(pengajuan);
    setSertifikatSelectedNurseId(String(pengajuan.id_perawat));
    setIsCreatingPengajuan(false);

    let parsedForms = {};
    try {
      if (pengajuan.form_data) {
        parsedForms = JSON.parse(pengajuan.form_data);
      }
    } catch (e) {
      console.error("Error parsing form_data:", e);
    }
    setCompetencyForms(parsedForms);

    let codes = [];
    try {
      codes = JSON.parse(pengajuan.detail_kompetensi);
    } catch (e) {
      if (pengajuan.detail_kompetensi) {
        codes = pengajuan.detail_kompetensi.split(',');
      }
    }
    if (Array.isArray(codes) && codes.length > 0) {
      setSelectedKompetensiKode(codes[0]);
    } else {
      setSelectedKompetensiKode('KD-01');
    }
    setSertifikatSubTab('form_01');
  };

  React.useEffect(() => {
    if (activePengajuan) {
      // Input datetime-local expects format YYYY-MM-DDTHH:MM
      setJadwalUjianInput(activePengajuan.jadwal_ujian ? activePengajuan.jadwal_ujian.replace(' ', 'T').substring(0, 16) : '');
      setBatasAkhirUjianInput(activePengajuan.batas_akhir_ujian ? activePengajuan.batas_akhir_ujian.replace(' ', 'T').substring(0, 16) : '');
    } else {
      setJadwalUjianInput('');
      setBatasAkhirUjianInput('');
    }
  }, [activePengajuan]);

  const get12KompetensiForPerawat = (perawat) => {
    if (!perawat) return LIST_12_KOMPETENSI;
    const pendidikan = (perawat.pendidikan_terakhir || '').toLowerCase();
    const profesi = (perawat.profesi || '').toLowerCase();
    if (pendidikan.includes('kebidanan') || profesi === 'bidan') {
      return LIST_12_KOMPETENSI_KEBIDANAN;
    }
    return LIST_12_KOMPETENSI;
  };

  const get12KompetensiForPengajuan = (pengajuan) => {
    if (!pengajuan) return LIST_12_KOMPETENSI;
    const perawat = perawatData.find(p => String(p.id_perawat) === String(pengajuan.id_perawat));
    return get12KompetensiForPerawat(perawat);
  };



  const handleUpdatePengajuanStatus = (id, newStatus, idAsesor = null, idAsesorPendamping = null) => {
    setIsLoading(true);
    const bodyData = { status: newStatus };
    if (idAsesor) bodyData.id_asesor = idAsesor;
    if (idAsesorPendamping !== null && idAsesorPendamping !== undefined) {
      bodyData.id_asesor_pendamping = idAsesorPendamping === '' ? null : idAsesorPendamping;
    }

    fetch(API_URL + `/pengajuan_sertifikasi/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bodyData)
    })
      .then(res => res.json())
      .then(updated => {
        setIsLoading(false);
        fetchPengajuanHistory();
        if (activePengajuan && String(activePengajuan.id) === String(id)) {
          setActivePengajuan(updated);
        }
        showToast(`Status pengajuan berhasil diperbarui menjadi: ${newStatus === 'Approved' ? 'Disetujui' : 'Ditolak'}`, 'success');
      })
      .catch(err => {
        setIsLoading(false);
        console.error("Error updating status:", err);
        showToast("Gagal memperbarui status pengajuan.", 'error');
      });
  };

  const handleUpdateStatusProses = (id, newStatusProses) => {
    setIsLoading(true);
    fetch(API_URL + `/pengajuan_sertifikasi/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        status_proses: newStatusProses
      })
    })
      .then(res => res.json())
      .then(updated => {
        setIsLoading(false);
        fetchPengajuanHistory();
        if (activePengajuan && String(activePengajuan.id) === String(id)) {
          setActivePengajuan(updated);
        }
        showToast(`Status proses sertifikasi berhasil diubah menjadi: ${newStatusProses}`, 'success');
      })
      .catch(err => {
        setIsLoading(false);
        console.error("Error updating status_proses:", err);
        showToast("Gagal memperbarui status proses.", 'error');
      });
  };

  const handleSetJadwalUjian = (e) => {
    e.preventDefault();
    if (!jadwalUjianInput || !batasAkhirUjianInput || !activePengajuan) return;
    setIsLoading(true);
    fetch(API_URL + '/ujian/set-jadwal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id_pengajuan: activePengajuan.id,
        jadwal_ujian: jadwalUjianInput,
        batas_akhir_ujian: batasAkhirUjianInput,
        durasi_ujian: 120
      })
    })
      .then(res => res.json())
      .then(data => {
        setIsLoading(false);
        if (data.success) {
          showToast('Jadwal ujian berhasil ditetapkan', 'success');
          setActivePengajuan(prev => ({ ...prev, jadwal_ujian: jadwalUjianInput, batas_akhir_ujian: batasAkhirUjianInput, durasi_ujian: 120, status_ujian: 'Belum' }));
          fetchPengajuanHistory();
        } else {
          showToast(data.message || 'Gagal set jadwal', 'error');
        }
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
        showToast('Terjadi kesalahan', 'error');
      });
  };

  const handleSetJadwalKolektif = (e) => {
    e.preventDefault();
    if (!kolektifJadwalMulai || !kolektifBatasAkhir || selectedPengajuanIds.length === 0) return;
    setIsLoading(true);
    fetch(API_URL + '/ujian/set-jadwal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id_pengajuan: selectedPengajuanIds,
        jadwal_ujian: kolektifJadwalMulai,
        batas_akhir_ujian: kolektifBatasAkhir,
        durasi_ujian: 120
      })
    })
      .then(res => res.json())
      .then(data => {
        setIsLoading(false);
        if (data.success) {
          showToast(`Jadwal ujian untuk ${selectedPengajuanIds.length} pengajuan berhasil ditetapkan secara kolektif`, 'success');
          setSelectedPengajuanIds([]);
          if (activePengajuan && selectedPengajuanIds.includes(activePengajuan.id)) {
            setActivePengajuan(prev => ({
              ...prev,
              jadwal_ujian: kolektifJadwalMulai,
              batas_akhir_ujian: kolektifBatasAkhir,
              durasi_ujian: 120,
              status_ujian: 'Belum'
            }));
          }
          fetchPengajuanHistory();
        } else {
          showToast(data.message || 'Gagal set jadwal kolektif', 'error');
        }
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
        showToast('Terjadi kesalahan koneksi', 'error');
      });
  };

  const handleMulaiUjian = () => {
    if (!activePengajuan) return;
    setIsLoading(true);
    fetch(`${API_URL}/ujian/soal/${activePengajuan.id}`)
      .then(res => res.json())
      .then(data => {
        setIsLoading(false);
        if (data.success) {
          // Check if there is an existing timer
          const existingEndTime = localStorage.getItem('ujian_end_time');
          let durationSeconds = data.durasi * 60;
          if (existingEndTime && parseInt(existingEndTime) > Date.now()) {
            durationSeconds = Math.floor((parseInt(existingEndTime) - Date.now()) / 1000);
            const savedAnswers = JSON.parse(localStorage.getItem('ujian_answers') || '{}');
            setJawabanUjian(savedAnswers);
          } else {
            const newEndTime = Date.now() + (data.durasi * 60 * 1000);
            localStorage.setItem('ujian_end_time', newEndTime.toString());
            localStorage.setItem('ujian_answers', JSON.stringify({}));
            localStorage.setItem('ujian_active_pengajuan_id', activePengajuan.id.toString());
            setJawabanUjian({});
          }

          setUjianData(data.soal);
          setUjianTimeLeft(durationSeconds); // in seconds
          setCurrentUjianIndex(0);
          setCheatCount(parseInt(localStorage.getItem('ujian_cheat_count') || '0'));
          setSertifikatSubTab('ujian_kompetensi');
        } else {
          showToast(data.messages?.error || data.message || 'Gagal memuat soal ujian', 'error');
        }
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
        showToast('Terjadi kesalahan koneksi', 'error');
      });
  };

  const handleJawabanSelect = (idSoal, opt) => {
    const updated = { ...jawabanUjian, [idSoal]: opt };
    setJawabanUjian(updated);
    localStorage.setItem('ujian_answers', JSON.stringify(updated));
  };

  const handleSubmitUjian = (isAuto = false) => {
    // We might not have activePengajuan if it auto-submitted on refresh, but activePengajuan should be loaded by fetchPengajuanHistory
    const targetId = activePengajuan?.id || localStorage.getItem('ujian_active_pengajuan_id');
    if (!targetId || !ujianData) return;

    if (!isAuto) {
      const confirmSubmit = window.confirm("Apakah Anda yakin ingin mengakhiri dan mengirimkan jawaban ujian ini?");
      if (!confirmSubmit) return;
    }

    setIsSubmittingUjian(true);

    // get answers from local state or localStorage
    const submitAnswers = Object.keys(jawabanUjian).length > 0 ? jawabanUjian : JSON.parse(localStorage.getItem('ujian_answers') || '{}');

    fetch(`${API_URL}/ujian/submit/${targetId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jawaban: submitAnswers })
    })
      .then(res => res.json())
      .then(data => {
        setIsSubmittingUjian(false);
        // Clear local storage exam state
        localStorage.removeItem('ujian_end_time');
        localStorage.removeItem('ujian_answers');
        localStorage.removeItem('ujian_active_pengajuan_id');
        localStorage.removeItem('ujian_cheat_count');

        if (data.success) {
          setFinalNilai(data.nilai);
          setShowNilaiModal(true);
          if (activePengajuan) {
            setActivePengajuan(prev => ({ ...prev, status_ujian: 'Selesai', nilai_ujian: data.nilai }));
          }
          fetchPengajuanHistory();
        } else {
          showToast(data.messages?.error || data.message || 'Gagal submit ujian', 'error');
        }
      })
      .catch(err => {
        console.error(err);
        setIsSubmittingUjian(false);
        showToast('Terjadi kesalahan submit', 'error');
      });
  };

  const handleLihatHasilUjian = () => {
    if (!activePengajuan) return;
    setIsLoading(true);
    fetch(`${API_URL}/ujian/hasil/${activePengajuan.id}`)
      .then(res => res.json())
      .then(data => {
        setIsLoading(false);
        if (data.success) {
          setDetailHasilUjian(data);
          setIsViewingHasilUjian(true);
        } else {
          showToast(data.message || 'Gagal memuat hasil ujian', 'error');
        }
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
        showToast('Terjadi kesalahan koneksi', 'error');
      });
  };

  const handleResetUjian = () => {
    if (!activePengajuan) return;
    if (!confirm('Apakah Anda yakin ingin me-reset ujian ini? Seluruh jawaban dan nilai peserta akan dihapus, dan peserta dapat memulai ujian kembali dari awal sesuai jadwal.')) return;
    setIsLoading(true);
    fetch(`${API_URL}/ujian/reset/${activePengajuan.id}`, { method: 'POST' })
      .then(res => res.json())
      .then(data => {
        setIsLoading(false);
        if (data.success) {
          showToast(data.message, 'success');
          fetchPengajuanHistory(); // Refresh data
          setActivePengajuan(prev => ({ ...prev, status_ujian: 'Belum', nilai_ujian: 0, detail_jawaban_ujian: null }));
        } else {
          showToast(data.messages?.error || data.message || 'Gagal me-reset ujian', 'error');
        }
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
        showToast('Terjadi kesalahan koneksi', 'error');
      });
  };


  const isSaveButtonDisabled = (tabId) => {
    if (currentUser?.role === 'Perawat') {
      const nurseTabs = ['form_01', 'form_02', 'form_04', 'form_08'];
      return !nurseTabs.includes(tabId);
    }
    return false;
  };

  const isTabLocked = (tabId) => {
    if (!activePengajuan) {
      return tabId !== 'form_01';
    }

    // Role-based lockout bypass: Asesor and Admin can access any tab
    if (currentUser?.role !== 'Perawat') {
      return false;
    }

    if (tabId === 'form_03c') {
      return false;
    }

    if (activePengajuan?.status !== 'Approved' && tabId !== 'form_01') {
      return true;
    }

    const tabsOrder = [
      { id: 'form_01', key: 'form01' },
      { id: 'form_02', key: 'form02' },
      { id: 'form_03', key: 'form03' },
      { id: 'form_03a', key: 'form03a' },
      { id: 'form_03b', key: 'form03b' },
      { id: 'form_03c', key: 'form03c' },
      { id: 'form_03d', key: 'form03d' },
      { id: 'form_04', key: 'form04' },
      { id: 'form_05', key: 'form05' },
      { id: 'form_06', key: 'form06' },
      { id: 'form_07', key: 'form07' },
      { id: 'form_08', key: 'form08' },
      { id: 'form_09', key: 'form09' }
    ];

    const targetIndex = tabsOrder.findIndex(t => t.id === tabId);
    if (targetIndex <= 0) return false;

    const prevTab = tabsOrder[targetIndex - 1];
    const prevKey = `${selectedKompetensiKode}_${prevTab.key}`;
    if (!competencyForms[prevKey]) {
      return true;
    }

    return false;
  };

  const myPengajuans = React.useMemo(() => {
    if (!currentPerawatRecord) return [];
    return pengajuanHistoryList.filter(p => String(p.id_perawat) === String(currentPerawatRecord.id_perawat));
  }, [pengajuanHistoryList, currentPerawatRecord]);

  React.useEffect(() => {
    let targetNurseId = null;
    if (activePengajuan && activePengajuan.id_perawat) {
      targetNurseId = activePengajuan.id_perawat;
    } else if (isCreatingPengajuan) {
      targetNurseId = currentUser?.role === 'Perawat' ? (currentPerawatRecord?.id_perawat) : newPengajuanForm.id_perawat;
    }

    if (targetNurseId) {
      fetch(API_URL + '/sertifikat')
        .then(res => res.json())
        .then(data => {
          const filtered = Array.isArray(data) ? data.filter(s => String(s.id_perawat) === String(targetNurseId)) : [];
          setActiveNurseCertificates(filtered);
        })
        .catch(err => console.error("Error fetching active nurse certificates:", err));

      fetch(API_URL + '/pelatihan')
        .then(res => res.json())
        .then(data => {
          const filtered = Array.isArray(data) ? data.filter(p => String(p.id_perawat) === String(targetNurseId)) : [];
          setActiveNursePelatihan(filtered);
        })
        .catch(err => console.error("Error fetching active nurse training:", err));
    } else {
      setActiveNurseCertificates([]);
      setActiveNursePelatihan([]);
    }
  }, [activePengajuan, isCreatingPengajuan, newPengajuanForm.id_perawat, currentPerawatRecord]);

  React.useEffect(() => {
    if (activePengajuan && activeTab === 'sertifikasi' && sertifikatSubTab === 'sertifikat') {
      fetch(`${API_URL}/riwayat_sertifikat`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            const existing = data.find(s => String(s.id_pengajuan) === String(activePengajuan.id));
            if (existing) {
              setSertifikatData(existing);
            } else {
              // Auto-save untuk mem-booking nomor sertifikat
              const pejabatKabid = pejabatData?.find(p => p.jabatan.includes('Kepala Bidang'))?.id || null;
              const pejabatKetua = pejabatData?.find(p => p.jabatan.includes('Ketua Panitia'))?.id || null;

              const payload = {
                id_pengajuan: activePengajuan.id,
                id_perawat: activePengajuan.id_perawat,
                jenjang: activePengajuan.jenjang_tujuan,
                pejabat_1_id: pejabatKabid,
                pejabat_2_id: pejabatKetua,
                tanggal_terbit: new Date().toISOString().split('T')[0]
              };

              fetch(`${API_URL}/riwayat_sertifikat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
              })
                .then(res => res.json())
                .then(savedData => setSertifikatData(savedData))
                .catch(err => console.error("Error auto-saving sertifikat data:", err));
            }
          }
        })
        .catch(err => console.error("Error fetching sertifikat data:", err));
    }
  }, [activePengajuan, activeTab, sertifikatSubTab]);

  React.useEffect(() => {
    if (activePengajuan && !customTglMulaiAsesmen) {
      const defaultMulai = activePengajuan.tanggal_pengajuan || activePengajuan.created_at || '';
      if (defaultMulai) {
        setCustomTglMulaiAsesmen(defaultMulai.split('T')[0]);
      } else {
        setCustomTglMulaiAsesmen(new Date().toISOString().split('T')[0]);
      }
    }
  }, [activePengajuan, customTglMulaiAsesmen]);

  React.useEffect(() => {
    if (!customTglSelesaiAsesmen || !customTglDitetapkan) {
      if (sertifikatData && sertifikatData.tanggal_terbit) {
        if (!customTglSelesaiAsesmen) setCustomTglSelesaiAsesmen(sertifikatData.tanggal_terbit.split('T')[0]);
        if (!customTglDitetapkan) setCustomTglDitetapkan(sertifikatData.tanggal_terbit.split('T')[0]);
      } else {
        if (!customTglSelesaiAsesmen) setCustomTglSelesaiAsesmen(new Date().toISOString().split('T')[0]);
        if (!customTglDitetapkan) setCustomTglDitetapkan(new Date().toISOString().split('T')[0]);
      }
    }
  }, [sertifikatData, customTglSelesaiAsesmen, customTglDitetapkan]);

  const handleSimpanSertifikat = () => {
    if (!activePengajuan) return;

    // Temukan ID pejabat
    const pejabatKabid = pejabatData.find(p => p.jabatan.includes('Kepala Bidang'))?.id || null;
    const pejabatKetua = pejabatData.find(p => p.jabatan.includes('Ketua Panitia'))?.id || null;

    const payload = {
      id_pengajuan: activePengajuan.id,
      id_perawat: activePengajuan.id_perawat,
      jenjang: activePengajuan.jenjang_tujuan,
      pejabat_1_id: pejabatKabid,
      pejabat_2_id: pejabatKetua,
      tanggal_terbit: customTglDitetapkan || new Date().toISOString().split('T')[0] // Format YYYY-MM-DD
    };

    fetch(`${API_URL}/riwayat_sertifikat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(data => {
        // Setelah berhasil simpan, perbarui state
        setSertifikatData(data);
        // Wait for React to render the new state, then print
        setTimeout(() => window.print(), 500);
      })
      .catch(err => {
        console.error("Gagal menyimpan riwayat sertifikat", err);
        showToast("Gagal menyimpan riwayat sertifikat, mencetak tetap dilanjutkan...", "error");
        window.print();
      });
  };

  const handleSaveCompetencyForms = () => {
    if (!activePengajuan) {
      showToast("Tidak ada pengajuan aktif yang dipilih.", 'error');
      return;
    }
    if (isSaveButtonDisabled(sertifikatSubTab)) {
      showToast("Formulir ini hanya dapat diisi dan disimpan oleh Asesor.", 'error');
      return;
    }

    let statusProsesToUpdate = activePengajuan.status_proses;
    if (sertifikatSubTab === 'form_07' && form07Data?.keputusan === 'Kompeten') {
      if (confirm("Rekomendasi kelulusan adalah Kompeten (K). Apakah Anda ingin menyimpan hasil asesmen sekaligus menutup (Close) status proses sertifikasi ini secara otomatis?")) {
        statusProsesToUpdate = 'Closed';
      }
    }

    setIsLoading(true);
    fetch(`${API_URL}/pengajuan_sertifikasi/${activePengajuan.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        form_data: JSON.stringify(competencyForms),
        status_proses: statusProsesToUpdate
      })
    })
      .then(res => res.json())
      .then(updated => {
        setIsLoading(false);
        fetchPengajuanHistory();
        setActivePengajuan(updated);
        showToast("Seluruh data formulir sertifikasi berhasil disimpan ke database!", 'success');
      })
      .catch(err => {
        setIsLoading(false);
        console.error("Error saving form data:", err);
        showToast("Gagal menyimpan perubahan formulir.", 'error');
      });
  };

  const handleCreatePengajuanSubmit = (e) => {
    e.preventDefault();
    let targetNurseId = newPengajuanForm.id_perawat;
    if (currentUser?.role === 'Perawat') {
      targetNurseId = currentPerawatRecord?.id_perawat;
    }

    if (!targetNurseId) {
      showToast("Silakan pilih Perawat terlebih dahulu.", 'error');
      return;
    }

    if (!newPengajuanForm.detail_kompetensi || newPengajuanForm.detail_kompetensi.length === 0) {
      showToast("Silakan pilih minimal satu unit kompetensi yang diajukan.", 'error');
      return;
    }

    setIsSubmittingPengajuan(true);

    const payload = new FormData();
    payload.append('id_perawat', targetNurseId);
    payload.append('jenis_sertifikasi', newPengajuanForm.jenis_sertifikasi);
    payload.append('detail_kompetensi', JSON.stringify(newPengajuanForm.detail_kompetensi));
    payload.append('status', 'Pending');

    const emptyForms = {};
    newPengajuanForm.detail_kompetensi.forEach(code => {
      const comp = LIST_12_KOMPETENSI.find(c => c.kode === code) || LIST_12_KOMPETENSI_KEBIDANAN.find(c => c.kode === code) || competencies.find(c => (c.kode_kompetensi || c.kode) === code) || { kode: code, judul: code };
      emptyForms[`${code}_form01`] = getDefaultForm01(comp);
      emptyForms[`${code}_form02`] = getDefaultForm02(comp);
      emptyForms[`${code}_form03`] = getDefaultForm03(comp);
      emptyForms[`${code}_form03a`] = getDefaultForm03a(comp);
      emptyForms[`${code}_form03b`] = getDefaultForm03b(comp);
      emptyForms[`${code}_form03c`] = getDefaultForm03c(comp);
      emptyForms[`${code}_form03d`] = getDefaultForm03d(comp);
      emptyForms[`${code}_form04`] = getDefaultForm04();
      emptyForms[`${code}_form05`] = getDefaultForm05();
      emptyForms[`${code}_form06`] = getDefaultForm06();
      emptyForms[`${code}_form07`] = getDefaultForm07();
      emptyForms[`${code}_form08`] = getDefaultForm08();
      emptyForms[`${code}_form09`] = getDefaultForm09();
    });

    payload.append('form_data', JSON.stringify(emptyForms));

    if (newPengajuanFile) {
      payload.append('file_pendukung', newPengajuanFile);
    }

    fetch(API_URL + '/pengajuan_sertifikasi', {
      method: 'POST',
      body: payload
    })
      .then(res => res.json())
      .then(data => {
        setIsSubmittingPengajuan(false);
        setIsCreatingPengajuan(false);
        setNewPengajuanFile(null);
        fetchPengajuanHistory();
        showToast("Pengajuan sertifikasi baru berhasil diajukan!", 'success');
      })
      .catch(err => {
        setIsSubmittingPengajuan(false);
        console.error("Error creating pengajuan:", err);
        showToast("Gagal membuat pengajuan sertifikasi.", 'error');
      });
  };

  const handleDeletePengajuan = (id) => {
    if (confirm("Apakah Anda yakin ingin menghapus riwayat pengajuan ini?")) {
      setIsLoading(true);
      fetch(`${API_URL}/pengajuan_sertifikasi/${id}`, {
        method: 'DELETE'
      })
        .then(() => {
          setIsLoading(false);
          fetchPengajuanHistory();
          if (activePengajuan && String(activePengajuan.id) === String(id)) {
            setActivePengajuan(null);
          }
          showToast("Riwayat pengajuan berhasil dihapus.", 'success');
        })
        .catch(err => {
          setIsLoading(false);
          console.error("Error deleting pengajuan:", err);
          showToast("Gagal menghapus pengajuan.", 'error');
        });
    }
  };

  // Helper to resolve active competency details
  const activeComp = React.useMemo(() => {
    const fromList = LIST_12_KOMPETENSI.find(c => c.kode === selectedKompetensiKode) || LIST_12_KOMPETENSI_KEBIDANAN.find(c => c.kode === selectedKompetensiKode);
    if (fromList) return fromList;
    const dbComp = competencies.find(c => c.kode_kompetensi === selectedKompetensiKode || c.kode === selectedKompetensiKode);
    return getCompetencyDetails(dbComp || { kode_kompetensi: selectedKompetensiKode });
  }, [selectedKompetensiKode, competencies]);

  // Wrapper function to lookup state dynamically or fallback to default
  const getFormData = (formKey, defaultGenerator) => {
    const key = `${selectedKompetensiKode}_${formKey}`;
    if (competencyForms[key]) return competencyForms[key];
    return defaultGenerator(activeComp);
  };

  // Wrapper function to dispatch updates specific to active competency
  const setFormDataWrapper = (formKey) => (newVal) => {
    const key = `${selectedKompetensiKode}_${formKey}`;
    setCompetencyForms(prev => {
      const current = prev[key] || getFormData(formKey, (c) => {
        switch (formKey) {
          case 'form01': return getDefaultForm01(c);
          case 'form02': return getDefaultForm02(c);
          case 'form03': return getDefaultForm03(c);
          case 'form03a': return getDefaultForm03a(c);
          case 'form03b': return getDefaultForm03b(c);
          case 'form03c': return getDefaultForm03c(c);
          case 'form03d': return getDefaultForm03d(c);
          case 'form04': return getDefaultForm04(c);
          case 'form05': return getDefaultForm05(c);
          case 'form06': return getDefaultForm06(c);
          case 'form07': return getDefaultForm07(c);
          case 'form08': return getDefaultForm08(c);
          case 'form09': return getDefaultForm09(c);
          default: return {};
        }
      });
      const updated = typeof newVal === 'function' ? newVal(current) : newVal;
      return { ...prev, [key]: updated };
    });
  };

  // Dynamic state hooks matching the original naming conventions transparently
  const form01Data = getFormData('form01', getDefaultForm01);
  const setForm01Data = setFormDataWrapper('form01');

  const form02Data = React.useMemo(() => {
    if (competencyForms['global_form02']) {
      return competencyForms['global_form02'];
    }
    const merged = {};
    [...LIST_12_KOMPETENSI, ...LIST_12_KOMPETENSI_KEBIDANAN].forEach(komp => {
      const legacyKey = `${komp.kode}_form02`;
      if (competencyForms[legacyKey]) {
        const legacyData = competencyForms[legacyKey];
        if (legacyData.k1_1) merged[`${komp.kode}_k1_1`] = legacyData.k1_1;
        if (legacyData.k1_2) merged[`${komp.kode}_k1_2`] = legacyData.k1_2;
        if (legacyData.k1_3) merged[`${komp.kode}_k1_3`] = legacyData.k1_3;
        if (legacyData.k2_1) merged[`${komp.kode}_k2_1`] = legacyData.k2_1;
        if (legacyData.k2_2) merged[`${komp.kode}_k2_2`] = legacyData.k2_2;
        if (legacyData.k2_3) merged[`${komp.kode}_k2_3`] = legacyData.k2_3;
        if (legacyData.bukti_1) merged[`${komp.kode}_bukti`] = legacyData.bukti_1;
        if (legacyData.rekomendasi) merged[`${komp.kode}_rekomendasi`] = legacyData.rekomendasi;
      }
    });
    return merged;
  }, [competencyForms]);

  const setForm02Data = (newVal) => {
    setCompetencyForms(prev => {
      const current = prev['global_form02'] || form02Data;
      const updated = typeof newVal === 'function' ? newVal(current) : newVal;
      return {
        ...prev,
        global_form02: updated
      };
    });
  };

  const form03Data = getFormData('form03', getDefaultForm03);
  const setForm03Data = setFormDataWrapper('form03');

  React.useEffect(() => {
    if (activePengajuan && form03Data && !form03Data.pendekatan) {
      setForm03Data({ ...form03Data, pendekatan: activePengajuan.jenjang_tujuan });
    }
  }, [activePengajuan]);

  const form03aData = React.useMemo(() => {
    if (competencyForms['global_form03a']) {
      return competencyForms['global_form03a'];
    }
    const merged = {};
    Object.keys(competencyForms).forEach(key => {
      if (key.endsWith('_form03a')) {
        Object.assign(merged, competencyForms[key]);
      }
    });
    return merged;
  }, [competencyForms]);

  const setForm03aData = (newVal) => {
    setCompetencyForms(prev => {
      const current = prev['global_form03a'] || form03aData;
      const updated = typeof newVal === 'function' ? newVal(current) : newVal;
      return {
        ...prev,
        global_form03a: updated
      };
    });
  };

  const form03bData = React.useMemo(() => {
    if (competencyForms['global_form03b']) {
      return competencyForms['global_form03b'];
    }
    const merged = {};
    Object.keys(competencyForms).forEach(key => {
      if (key.endsWith('_form03b')) {
        Object.assign(merged, competencyForms[key]);
      }
    });
    return merged;
  }, [competencyForms]);

  const setForm03bData = (newVal) => {
    setCompetencyForms(prev => {
      const current = prev['global_form03b'] || form03bData;
      const updated = typeof newVal === 'function' ? newVal(current) : newVal;
      return {
        ...prev,
        global_form03b: updated
      };
    });
  };

  const form03cData = getFormData('form03c', getDefaultForm03c);
  const setForm03cData = setFormDataWrapper('form03c');

  const [tulisExamDetails, setTulisExamDetails] = React.useState(null);

  const mapDbCompToKd = (dbComp) => {
    if (!dbComp) return null;
    const clean = dbComp.trim().toUpperCase();
    if (clean.includes('KDB-01')) return 'KDB-01';
    if (clean.includes('KDB-02')) return 'KDB-02';
    if (clean.includes('KDB-03')) return 'KDB-03';
    if (clean.includes('KDB-04')) return 'KDB-04';
    if (clean.includes('KDB-05')) return 'KDB-05';
    if (clean.includes('KDB-06')) return 'KDB-06';
    if (clean.includes('KDB-07')) return 'KDB-07';
    if (clean.includes('KDB-08')) return 'KDB-08';
    if (clean.includes('KDB-09')) return 'KDB-09';
    if (clean.includes('KDB-10')) return 'KDB-10';
    if (clean.includes('KDB-11')) return 'KDB-11';
    if (clean.includes('KDB-12')) return 'KDB-12';
    if (clean.includes('KD-01')) return 'KD-01';
    if (clean.includes('KD-02')) return 'KD-02';
    if (clean.includes('KD-03')) return 'KD-03';
    if (clean.includes('KD-04')) return 'KD-04';
    if (clean.includes('KD-05')) return 'KD-05';
    if (clean.includes('KD-06')) return 'KD-06';
    if (clean.includes('KD-07')) return 'KD-07';
    if (clean.includes('KD-08')) return 'KD-08';
    if (clean.includes('KD-09')) return 'KD-09';
    if (clean.includes('KD-10')) return 'KD-10';
    if (clean.includes('KD-11')) return 'KD-11';
    if (clean.includes('KD-12')) return 'KD-12';
    if (clean.includes('KOMUNIKASI')) return 'KD-01';
    if (clean.includes('ETIKA') || clean.includes('LEGAL')) return 'KD-02';
    if (clean.includes('VITAL') || clean.includes('TTV')) return 'KD-03';
    if (clean.includes('SAFETY') || clean.includes('INFEKSI')) return 'KD-04';
    if (clean.includes('LUKA')) return 'KD-05';
    if (clean.includes('OKSIGEN')) return 'KD-06';
    if (clean.includes('CAIRAN') || clean.includes('ELEKTROLIT')) return 'KD-07';
    if (clean.includes('OBAT')) return 'KD-08';
    if (clean.includes('ELIMINASI')) return 'KD-09';
    if (clean.includes('NUTRISI')) return 'KD-10';
    if (clean.includes('ISTIRAHAT') || clean.includes('TIDUR')) return 'KD-11';
    if (clean.includes('MOBILISASI') || clean.includes('IMOBILISASI')) return 'KD-12';
    return null;
  };

  React.useEffect(() => {
    if (activePengajuan && activePengajuan.status_ujian === 'Selesai' && sertifikatSubTab === 'form_03c') {
      if (!tulisExamDetails || String(tulisExamDetails.id_pengajuan) !== String(activePengajuan.id)) {
        fetch(`${API_URL}/ujian/hasil/${activePengajuan.id}`)
          .then(res => res.json())
          .then(data => {
            if (data.success) {
              setTulisExamDetails({
                id_pengajuan: activePengajuan.id,
                soal: data.soal,
                jawaban_user: data.jawaban_user,
                nilai: data.nilai
              });
            }
          })
          .catch(err => console.error("Error loading tulis exam details:", err));
      }
    } else if (sertifikatSubTab !== 'form_03c') {
      setTulisExamDetails(null);
    }
  }, [activePengajuan, sertifikatSubTab, tulisExamDetails]);

  const compScores = React.useMemo(() => {
    if (!tulisExamDetails || !tulisExamDetails.soal) return {};
    const stats = {};
    const currentList = get12KompetensiForPengajuan(activePengajuan);
    currentList.forEach(c => {
      stats[c.kode] = { correct: 0, total: 0 };
    });
    tulisExamDetails.soal.forEach(s => {
      const kdCode = mapDbCompToKd(s.id_kompetensi);
      if (kdCode && stats[kdCode]) {
        stats[kdCode].total += 1;
        const userAns = (tulisExamDetails.jawaban_user[s.id_soal] || '').trim().toUpperCase();
        const correctAns = (s.jawaban_benar || '').trim().toUpperCase();
        if (userAns === correctAns) {
          stats[kdCode].correct += 1;
        }
      }
    });
    const scores = {};
    currentList.forEach(c => {
      const stat = stats[c.kode];
      scores[c.kode] = stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : null;
    });
    return scores;
  }, [tulisExamDetails, activePengajuan, perawatData]);

  React.useEffect(() => {
    if (activePengajuan && activePengajuan.status_ujian === 'Selesai') {
      const score = parseFloat(activePengajuan.nilai_ujian || '0');
      const autoGrade = score >= 70 ? 'K' : 'BK';
      if (form03cData.grade1 !== autoGrade) {
        setForm03cData({ ...form03cData, grade1: autoGrade });
      }
    }
  }, [activePengajuan, selectedKompetensiKode, form03cData.grade1]);

  const getRekomendasiAkhir = (p) => {
    if (!p) return 'Dalam Proses';
    const forms = p.form_data ? JSON.parse(p.form_data) : {};
    const form07Key = Object.keys(forms).find(key => key.endsWith('_form07'));
    const form07Data = form07Key ? (forms[form07Key] || {}) : {};
    return form07Data.keputusan || 'Dalam Proses';
  };

  const getUjiLisanStatus = (p) => {
    if (!p) return 'Belum Dinilai';
    const forms = p.form_data ? JSON.parse(p.form_data) : {};
    const oralData = forms['global_form03b'] || {};
    const units = get12KompetensiForPengajuan(p);
    
    let evaluated = false;
    let count = 0;
    units.forEach(u => {
      const val = oralData[`${u.kode}_nilai`];
      if (val === 'K' || val === 'BK') {
        evaluated = true;
      }
      if (val === 'K') {
        count++;
      }
    });
    
    if (!evaluated) return 'Belum Dinilai';
    return `${count}/${units.length} K`;
  };

  const getUjiObservasiStatus = (p) => {
    if (!p) return 'Belum Dinilai';
    const forms = p.form_data ? JSON.parse(p.form_data) : {};
    const obsData = forms['global_form03a'] || {};
    const units = get12KompetensiForPengajuan(p);
    
    let evaluated = false;
    let count = 0;
    units.forEach(u => {
      const val = obsData[`${u.kode}_nilai`];
      if (val === 'K' || val === 'BK') {
        evaluated = true;
      }
      if (val === 'K') {
        count++;
      }
    });
    
    if (!evaluated) return 'Belum Dinilai';
    return `${count}/${units.length} K`;
  };

  const getUnitWrittenScore = (kompKode, examDetails) => {
    if (!examDetails || !examDetails.soal) return null;
    let correct = 0;
    let total = 0;
    examDetails.soal.forEach(s => {
      const kdCode = mapDbCompToKd(s.id_kompetensi);
      if (kdCode === kompKode) {
        total++;
        const userAns = (examDetails.jawaban_user[s.id_soal] || '').trim().toUpperCase();
        const correctAns = (s.jawaban_benar || '').trim().toUpperCase();
        if (userAns === correctAns) {
          correct++;
        }
      }
    });
    return total > 0 ? Math.round((correct / total) * 100) : null;
  };

  const processedList = React.useMemo(() => {
    return pengajuanHistoryList.filter(p => p.status === 'Approved');
  }, [pengajuanHistoryList]);

  const uniqueJenisSertifikasi = React.useMemo(() => {
    const set = new Set(processedList.map(p => p.jenis_sertifikasi).filter(Boolean));
    return Array.from(set);
  }, [processedList]);

  const filteredRecapList = React.useMemo(() => {
    return processedList.filter(item => {
      const nurse = perawatData.find(n => String(n.id_perawat) === String(item.id_perawat)) || {};
      
      const matchSearch = !searchQueryAsesmenRecap || 
        (nurse.nama || '').toLowerCase().includes(searchQueryAsesmenRecap.toLowerCase()) ||
        (nurse.nip || '').toLowerCase().includes(searchQueryAsesmenRecap.toLowerCase());
        
      const matchUnit = !filterUnitAsesmenRecap || nurse.unit_kerja === filterUnitAsesmenRecap;
      
      const matchJenis = !filterJenisAsesmenRecap || item.jenis_sertifikasi === filterJenisAsesmenRecap;
      
      const statusRecom = getRekomendasiAkhir(item);
      const matchRecom = !filterRekomendasiAsesmenRecap || 
        (filterRekomendasiAsesmenRecap === 'Dalam Proses' && statusRecom !== 'Kompeten' && statusRecom !== 'Belum Kompeten') ||
        (filterRekomendasiAsesmenRecap === statusRecom);
        
      return matchSearch && matchUnit && matchJenis && matchRecom;
    });
  }, [processedList, perawatData, searchQueryAsesmenRecap, filterUnitAsesmenRecap, filterJenisAsesmenRecap, filterRekomendasiAsesmenRecap]);

  const [currentPageRecap, setCurrentPageRecap] = useState(1);
  const itemsPerPageRecap = 10;

  React.useEffect(() => {
    setCurrentPageRecap(1);
  }, [searchQueryAsesmenRecap, filterUnitAsesmenRecap, filterJenisAsesmenRecap, filterRekomendasiAsesmenRecap]);

  const handleExportExcel = () => {
    const headers = ["NO", "NAMA ASESI", "NIP", "UNIT KERJA", "JABATAN", "JENIS SERTIFIKASI", "ASESOR UTAMA", "ASESOR PENDAMPING", "UJI TULIS", "UJI LISAN", "UJI OBSERVASI", "REKOMENDASI AKHIR"];
    const rows = filteredRecapList.map((item, idx) => {
      const nurse = perawatData.find(n => String(n.id_perawat) === String(item.id_perawat)) || {};
      const primary = userData.find(u => String(u.id) === String(item.id_asesor))?.nama || '-';
      const pendamping = userData.find(u => String(u.id) === String(item.id_asesor_pendamping))?.nama || '-';
      const score = item.status_ujian === 'Selesai' ? `${parseFloat(item.nilai_ujian || '0')}%` : 'Belum Ujian';
      const lisan = getUjiLisanStatus(item);
      const obs = getUjiObservasiStatus(item);
      const recom = getRekomendasiAkhir(item);
      return [
        idx + 1,
        nurse.nama || '-',
        nurse.nip || '-',
        nurse.unit_kerja || '-',
        nurse.jabatan || '-',
        item.jenis_sertifikasi || '-',
        primary,
        pendamping,
        score,
        lisan,
        obs,
        recom
      ];
    });
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(","))].join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Rekap_Asesmen_Kompetensi.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const form03dData = getFormData('form03d', getDefaultForm03d);
  const setForm03dData = setFormDataWrapper('form03d');

  const form04Data = getFormData('form04', getDefaultForm04);
  const setForm04Data = setFormDataWrapper('form04');

  const form05Data = getFormData('form05', getDefaultForm05);
  const setForm05Data = setFormDataWrapper('form05');

  const form06Data = getFormData('form06', getDefaultForm06);
  const setForm06Data = setFormDataWrapper('form06');

  const form07Data = getFormData('form07', getDefaultForm07);
  const setForm07Data = setFormDataWrapper('form07');

  const form08Data = getFormData('form08', getDefaultForm08);
  const setForm08Data = setFormDataWrapper('form08');

  const form09Data = getFormData('form09', getDefaultForm09);
  const setForm09Data = setFormDataWrapper('form09');


  const fetchUserData = () => {
    setIsLoading(true);
    fetch(API_URL + '/user')
      .then(res => res.json())
      .then(data => {
        setUserData(Array.isArray(data) ? data : []);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Error fetching users:", err);
        setIsLoading(false);
      });
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);
    fetch(API_URL + '/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginForm)
    })
      .then(async res => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.messages?.error || data.message || 'Login gagal.');
        }
        return data;
      })
      .then(data => {
        if (data.require_otp) {
          setRequireOtp(true);
          setTempUsername(loginForm.username);
          setDevOtpMsg(`Dev OTP: ${data.dev_otp}`);
        } else {
          localStorage.setItem('currentUser', JSON.stringify(data.user));
          setCurrentUser(data.user);
          setActiveTab('dashboard');
        }
      })
      .catch(err => {
        setLoginError(err.message);
      })
      .finally(() => {
        setIsLoggingIn(false);
      });
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);
    fetch(API_URL + '/login/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: tempUsername, otp: otpCode })
    })
      .then(async res => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.messages?.error || data.message || 'OTP tidak valid.');
        }
        return data;
      })
      .then(data => {
        localStorage.setItem('currentUser', JSON.stringify(data.user));
        setCurrentUser(data.user);
        setActiveTab('dashboard');
        setRequireOtp(false);
        setOtpCode('');
      })
      .catch(err => {
        setLoginError(err.message);
      })
      .finally(() => {
        setIsLoggingIn(false);
      });
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('lastActivityTime');
    setCurrentUser(null);
    setActiveTab('dashboard');
  };

  // Auto-Logout after 30 minutes of inactivity
  React.useEffect(() => {
    if (!currentUser) {
      localStorage.removeItem('lastActivityTime');
      return;
    }

    // Set initial activity time if not present
    if (!localStorage.getItem('lastActivityTime')) {
      localStorage.setItem('lastActivityTime', Date.now().toString());
    }

    const resetTimer = () => {
      localStorage.setItem('lastActivityTime', Date.now().toString());
    };

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'mousemove'];
    events.forEach(e => window.addEventListener(e, resetTimer));

    // Check every 10 seconds
    const interval = setInterval(() => {
      const lastActivity = localStorage.getItem('lastActivityTime');
      if (lastActivity) {
        const elapsed = Date.now() - parseInt(lastActivity, 10);
        const thirtyMinutes = 30 * 60 * 1000;
        if (elapsed > thirtyMinutes) {
          handleLogout();
          showToast('Sesi Anda telah berakhir karena tidak ada aktivitas selama 30 menit.', 'error');
        }
      }
    }, 10000);

    return () => {
      events.forEach(e => window.removeEventListener(e, resetTimer));
      clearInterval(interval);
    };
  }, [currentUser]);



  const handleOpenUserModal = (mode, data = null) => {
    setUserModalMode(mode);
    if (mode === 'edit' && data) {
      setUserFormData({
        id: data.id,
        username: data.username,
        password: '',
        nama: data.nama,
        role: data.role,
        status: data.status,
        id_perawat: data.id_perawat || ''
      });
    } else {
      setUserFormData({
        id: '',
        username: '',
        password: '',
        nama: '',
        role: 'Perawat',
        status: 'A',
        id_perawat: ''
      });
    }
    setIsUserModalOpen(true);
  };

  const handleCloseUserModal = () => {
    setIsUserModalOpen(false);
  };

  const handleUserChange = (e) => {
    setUserFormData({ ...userFormData, [e.target.name]: e.target.value });
  };

  const handleUserSubmit = (e) => {
    e.preventDefault();
    const url = userModalMode === 'add'
      ? API_URL + '/user'
      : API_URL + `/user/${userFormData.id}`;

    const method = userModalMode === 'add' ? 'POST' : 'PUT';

    fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userFormData)
    })
      .then(async res => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.messages?.error || data.message || 'Gagal menyimpan data user.');
        }
        return data;
      })
      .then(() => {
        fetchUserData();
        setIsUserModalOpen(false);
      })
      .catch(err => {
        alert(err.message);
      });
  };

  const handleDeleteUser = (id, username) => {
    if (username === 'admin') {
      alert('Akun admin utama tidak dapat dihapus.');
      return;
    }
    if (confirm(`Yakin ingin menghapus user "${username}"?`)) {
      fetch(`${API_URL}/user/${id}`, {
        method: 'DELETE'
      })
        .then(async res => {
          const data = await res.json();
          if (!res.ok) {
            throw new Error(data.messages?.error || data.message || 'Gagal menghapus user.');
          }
          return data;
        })
        .then(() => {
          fetchUserData();
        })
        .catch(err => {
          alert(err.message);
        });
    }
  };

  // Master states
  const [unitKerjaData, setUnitKerjaData] = useState([]);
  const [jabatanData, setJabatanData] = useState([]);
  const [pendidikanData, setPendidikanData] = useState([]);
  const [grupData, setGrupData] = useState([]);
  const [newUnitKerja, setNewUnitKerja] = useState('');
  const [newJabatan, setNewJabatan] = useState('');
  const [newPendidikan, setNewPendidikan] = useState('');
  const [editingUnitId, setEditingUnitId] = useState(null);
  const [editUnitName, setEditUnitName] = useState('');
  const [editingJabatanId, setEditingJabatanId] = useState(null);
  const [editJabatanName, setEditJabatanName] = useState('');
  const [editingPendidikanId, setEditingPendidikanId] = useState(null);
  const [editPendidikanName, setEditPendidikanName] = useState('');

  // Jenjang Jabatan master states
  const [jenjangJabatanData, setJenjangJabatanData] = useState([]);

  // Pejabat master states
  const [pejabatData, setPejabatData] = useState([]);
  const [newJenjangNama, setNewJenjangNama] = useState('');
  const [newJenjangPendidikan, setNewJenjangPendidikan] = useState('D3');
  const [newJenjangProfesi, setNewJenjangProfesi] = useState('Perawat');
  const [editingJenjangId, setEditingJenjangId] = useState(null);
  const [editJenjangNama, setEditJenjangNama] = useState('');
  const [editJenjangPendidikan, setEditJenjangPendidikan] = useState('D3');
  const [editJenjangProfesi, setEditJenjangProfesi] = useState('Perawat');

  // Form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedPerawat, setSelectedPerawat] = useState(null);
  const [activeDetailTab, setActiveDetailTab] = useState('profil');
  const [assessments, setAssessments] = useState([]);
  const [allAssessmentsList, setAllAssessmentsList] = useState([]);
  const [searchQueryAsesmen, setSearchQueryAsesmen] = useState('');
  const [filterUnitAsesmen, setFilterUnitAsesmen] = useState('');
  const [filterStatusAsesmen, setFilterStatusAsesmen] = useState('');
  const [currentPageAsesmen, setCurrentPageAsesmen] = useState(1);
  const [itemsPerPageAsesmen, setItemsPerPageAsesmen] = useState(10);
  const [riwayatKerja, setRiwayatKerja] = useState([]);
  const [sertifikatDataList, setSertifikatDataList] = useState([]);

  // Search & Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [filterUnit, setFilterUnit] = useState('');
  const [filterGrup, setFilterGrup] = useState('');
  const [filterProfesi, setFilterProfesi] = useState('');

  // Pagination states
  const [currentPagePerawat, setCurrentPagePerawat] = useState(1);
  const [currentPageStr, setCurrentPageStr] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Reset pagination on search/filter changes
  React.useEffect(() => {
    setCurrentPagePerawat(1);
    setCurrentPageStr(1);
  }, [searchQuery, filterUnit, filterGrup, filterProfesi]);

  // Competency CRUD states
  const [isKompetensiModalOpen, setIsKompetensiModalOpen] = useState(false);
  const [kompetensiModalMode, setKompetensiModalMode] = useState('add');
  const [kompetensiFormData, setKompetensiFormData] = useState({
    id: '',
    kode_kompetensi: '',
    nama_kompetensi: '',
    kategori: '',
    unit: ''
  });

  // Competency Search & Filter states
  const [kompetensiSearchQuery, setKompetensiSearchQuery] = useState('');
  const [kompetensiFilterUnit, setKompetensiFilterUnit] = useState('');
  const [kompetensiFilterKategori, setKompetensiFilterKategori] = useState('');

  // Competency Pagination states
  const [currentPageKompetensi, setCurrentPageKompetensi] = useState(1);
  const [itemsPerPageKompetensi, setItemsPerPageKompetensi] = useState(10);

  // Reset competency pagination on search/filter changes
  React.useEffect(() => {
    setCurrentPageKompetensi(1);
  }, [kompetensiSearchQuery, kompetensiFilterUnit, kompetensiFilterKategori]);

  const [competencyForm, setCompetencyForm] = useState({
    id_kompetensi: '',
    asesor: '',
    nilai: '',
    status: 'Kompeten',
    catatan: '',
    tanggal: new Date().toISOString().split('T')[0]
  });

  const [riwayatKerjaForm, setRiwayatKerjaForm] = useState({
    posisi: '',
    instansi: '',
    tahun_masuk: '',
    tahun_keluar: '',
    deskripsi: ''
  });
  const [sertifikatForm, setSertifikatForm] = useState({
    nama_sertifikat: '',
    nomor: '',
    tgl_terbit: '',
    tgl_expired: '',
    file: null
  });

  // Pelatihan states
  const [pelatihanList, setPelatihanList] = useState([]);
  const [pelatihanForm, setPelatihanForm] = useState({
    nama_pelatihan: '', penyelenggara: '', tanggal_mulai: '', tanggal_selesai: '', jumlah_jam: '', no_sertifikat: '', file: null
  });
  const [allPelatihanData, setAllPelatihanData] = useState([]);
  const [pelatihanSearchQuery, setPelatihanSearchQuery] = useState('');
  const [currentPagePelatihan, setCurrentPagePelatihan] = useState(1);
  const [isPelatihanModalOpen, setIsPelatihanModalOpen] = useState(false);
  const [pelatihanModalMode, setPelatihanModalMode] = useState('add');
  const [pelatihanModalForm, setPelatihanModalForm] = useState({
    id: '', id_perawat: '', nama_pelatihan: '', penyelenggara: '', tanggal_mulai: '', tanggal_selesai: '', jumlah_jam: '', no_sertifikat: '', file: null
  });

  // STR/SIP inline edit states
  const [isEditingStrSip, setIsEditingStrSip] = useState(false);
  const [strSipForm, setStrSipForm] = useState({
    no_str: '', masa_berlaku_str: '', file_str: null,
    no_sip: '', masa_berlaku_sip: '', file_sip: null
  });

  // Kompetensi grouping expand state
  const [isKdGroupExpanded, setIsKdGroupExpanded] = useState(false);

  const [formData, setFormData] = useState({
    id_perawat: '', nik: '', nip: '', nama: '', tempat_lahir: '', tanggal_lahir: '', jk: 'L',
    alamat: '', hp: '', email: '', profesi: '', unit_kerja: '', jabatan: '', status: 'A',
    pendidikan_terakhir: '', no_ijazah: '', grup: '',
    foto: null, file_str: null, file_sip: null,
    no_str: '', masa_berlaku_str: '', no_sip: '', masa_berlaku_sip: ''
  });

  // Menerapkan class "dark" ke root sesuai state
  React.useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleUbahPassword = (e) => {
    e.preventDefault();
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      showToast('Konfirmasi password tidak cocok!', 'error');
      return;
    }
    fetch(API_URL + '/user/ubah-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id_user: currentUser.id,
        old_password: passwordForm.old_password,
        new_password: passwordForm.new_password
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          showToast('Password berhasil diubah!', 'success');
          setPasswordForm({ old_password: '', new_password: '', confirm_password: '' });
        } else {
          showToast(data.messages?.error || 'Gagal mengubah password.', 'error');
        }
      })
      .catch(() => showToast('Terjadi kesalahan sistem.', 'error'));
  };

  const handleSendHpOtp = () => {
    if (!hpForm.no_hp) {
      showToast('Masukkan nomor WhatsApp terlebih dahulu.', 'error');
      return;
    }
    fetch(API_URL + '/user/send-otp-hp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id_user: currentUser.id,
        no_hp: hpForm.no_hp
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setShowHpOtpInput(true);
          showToast('OTP telah dikirim ke WhatsApp Anda.', 'success');
          // Update current user temporarily to allow showing "Menunggu verifikasi"
          setCurrentUser(prev => ({ ...prev, no_hp: hpForm.no_hp, is_hp_validated: 0 }));
        } else {
          showToast(data.messages?.error || 'Gagal mengirim OTP.', 'error');
        }
      })
      .catch(() => showToast('Terjadi kesalahan sistem.', 'error'));
  };

  const handleVerifyHpOtp = () => {
    if (!hpForm.otp) {
      showToast('Masukkan kode OTP terlebih dahulu.', 'error');
      return;
    }
    fetch(API_URL + '/user/verify-otp-hp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id_user: currentUser.id,
        otp: hpForm.otp
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setShowHpOtpInput(false);
          showToast('Nomor WhatsApp berhasil divalidasi!', 'success');
          const updatedUser = { ...currentUser, is_hp_validated: 1 };
          setCurrentUser(updatedUser);
          localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        } else {
          showToast(data.messages?.error || 'OTP salah atau kedaluwarsa.', 'error');
        }
      })
      .catch(() => showToast('Terjadi kesalahan sistem.', 'error'));
  };

  const fetchAllAssessments = () => {
    setIsLoading(true);
    fetch(`${API_URL}/assessment?t=${Date.now()}`)
      .then(res => res.json())
      .then(data => {
        setAllAssessmentsList(Array.isArray(data) ? data : []);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Error fetching all assessments:", err);
        setIsLoading(false);
      });
  };

  const fetchPerawatData = () => {
    setIsLoading(true);
    fetch(`${API_URL}/perawat?t=${Date.now()}`)
      .then(res => res.json())
      .then(data => {
        setPerawatData(Array.isArray(data) ? data : []);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Error fetching data:", err);
        setIsLoading(false);
      });
  };

  const fetchCompetencies = () => {
    setIsLoading(true);
    fetch(API_URL + '/kompetensi')
      .then(res => res.json())
      .then(data => {
        setCompetencies(Array.isArray(data) ? data : []);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Error fetching competencies:", err);
        setIsLoading(false);
      });
  };

  // Fetch data perawat dari CI4 backend
  React.useEffect(() => {
    if (!currentUser) return;
    if (jenisList.length === 0) fetchJenisList();
    if (rkkList.length === 0) fetchRkkList();
    if (activeTab === 'perawat' || activeTab === 'str' || activeTab === 'dashboard') {
      fetchPerawatData();
      fetchUnitKerja();
      fetchJabatan();
      fetchPendidikanData();
      fetchGrupData();
      fetchCompetencies();
      fetchJenjangJabatan();
      if (activeTab === 'dashboard') {
        fetchPengajuanHistory();
      }
      if (activeTab === 'perawat' && currentUser?.role !== 'Perawat') {
        fetchUserData();
      }
    } else if (activeTab === 'kompetensi') {
      fetchCompetencies();
    } else if (['pengaturan', 'master_unit_kerja', 'master_jabatan', 'master_jenjang_jabatan', 'master_pendidikan'].includes(activeTab)) {
      fetchUnitKerja();
      fetchJabatan();
      fetchJenjangJabatan();
      fetchPendidikanData();
    } else if (activeTab === 'master_user') {
      fetchUserData();
      fetchPerawatData();
    } else if (activeTab === 'sertifikasi') {
      fetchUserData();
      fetchPerawatData();
      fetchCompetencies();
      fetchPengajuanHistory();
      fetchJenjangJabatan();
      fetchPejabatData();
    } else if (['kredensial', 'master_jenis', 'master_rkk'].includes(activeTab)) {
      fetchPerawatData();
      fetchJenisList();
      fetchRkkList();
      fetchKredensialList();
    } else if (activeTab === 'asesmen') {
      fetchPerawatData();
      fetchCompetencies();
      fetchUnitKerja();
      fetchAllAssessments();
    }
  }, [activeTab, currentUser]);

  React.useEffect(() => {
    if (perawatData.length > 0 && !sertifikatSelectedNurseId) {
      if (currentUser?.role === 'Perawat') {
        const matchingPerawat = perawatData.find(p => String(p.id_user) === String(currentUser.id));
        if (matchingPerawat) {
          setSertifikatSelectedNurseId(String(matchingPerawat.id_perawat));
        } else {
          setSertifikatSelectedNurseId(String(perawatData[0].id_perawat));
        }
      } else {
        setSertifikatSelectedNurseId(String(perawatData[0].id_perawat));
      }
    }
  }, [perawatData, currentUser, sertifikatSelectedNurseId]);

  React.useEffect(() => {
    if (jenisList.length > 0) {
      if (!activeRkkJenisTab) setActiveRkkJenisTab(jenisList[0].kd_jenis);
      if (!kredensialActiveJenis) setKredensialActiveJenis(jenisList[0].kd_jenis);
    }
  }, [jenisList, activeRkkJenisTab, kredensialActiveJenis]);

  React.useEffect(() => {
    setCurrentPageRkk(1);
  }, [activeRkkJenisTab, activeRkkLevelTab]);


  React.useEffect(() => {
    if (kredensialSelectedPerawatId) {
      const nurseCreds = kredensialList.filter(c => String(c.id_perawat) === String(kredensialSelectedPerawatId));
      const worksheetData = {};
      nurseCreds.forEach(c => {
        worksheetData[c.id_rkk] = c.nilai;
      });
      setKredensialWorksheet(worksheetData);
      
      const firstCred = nurseCreds[0];
      if (firstCred && firstCred.tgl_kredensial) {
        setKredensialWorksheetDate(firstCred.tgl_kredensial);
      } else {
        setKredensialWorksheetDate(new Date().toISOString().split('T')[0]);
      }
    } else {
      setKredensialWorksheet({});
      setKredensialWorksheetDate(new Date().toISOString().split('T')[0]);
    }
  }, [kredensialSelectedPerawatId, kredensialList]);



  React.useEffect(() => {
    if (currentUser?.role === 'Perawat' && perawatData.length > 0) {
      const myRecord = perawatData.find(p => String(p.id_user) === String(currentUser.id));
      if (myRecord) {
        if (!selectedPerawat || selectedPerawat.id_perawat !== myRecord.id_perawat) {
          setSelectedPerawat(myRecord);
          fetchDetailData(myRecord.id_perawat);
        } else if (
          selectedPerawat.file_str !== myRecord.file_str ||
          selectedPerawat.file_sip !== myRecord.file_sip ||
          selectedPerawat.no_str !== myRecord.no_str ||
          selectedPerawat.no_sip !== myRecord.no_sip ||
          selectedPerawat.masa_berlaku_str !== myRecord.masa_berlaku_str ||
          selectedPerawat.masa_berlaku_sip !== myRecord.masa_berlaku_sip ||
          selectedPerawat.foto !== myRecord.foto ||
          selectedPerawat.nama !== myRecord.nama
        ) {
          setSelectedPerawat(myRecord);
        }
      }
    }
  }, [perawatData, currentUser, activeTab, selectedPerawat]);

  React.useEffect(() => {
    let timerId;
    if (sertifikatSubTab === 'ujian_kompetensi' && ujianTimeLeft > 0) {
      timerId = setInterval(() => {
        const existingEndTime = localStorage.getItem('ujian_end_time');
        if (existingEndTime) {
          const remaining = Math.max(0, Math.floor((parseInt(existingEndTime) - Date.now()) / 1000));
          setUjianTimeLeft(remaining);
          if (remaining <= 0) {
            clearInterval(timerId);
            handleSubmitUjian(true); // auto submit when time is up
          }
        } else {
          setUjianTimeLeft(prev => {
            if (prev <= 1) {
              clearInterval(timerId);
              handleSubmitUjian(true); // auto submit when time is up
              return 0;
            }
            return prev - 1;
          });
        }
      }, 1000);
    }
    return () => clearInterval(timerId);
  }, [sertifikatSubTab, ujianTimeLeft]);

  // Anti Cheat useEffect
  React.useEffect(() => {
    const handleVisibilityChange = () => {
      if (sertifikatSubTab === 'ujian_kompetensi' && document.visibilityState === 'hidden') {
        const currentCount = parseInt(localStorage.getItem('ujian_cheat_count') || '0') + 1;
        localStorage.setItem('ujian_cheat_count', currentCount.toString());
        setCheatCount(currentCount);

        if (currentCount >= 3) {
          setCheatWarningModal({
            show: true,
            message: 'Anda telah melanggar aturan ujian sebanyak 3 kali dengan membuka tab/aplikasi lain. Ujian akan disubmit otomatis.',
            count: currentCount,
            isLast: true
          });
          handleSubmitUjian(true);
        } else {
          setCheatWarningModal({
            show: true,
            message: `Anda terdeteksi berpindah tab/aplikasi. Peringatan ke-${currentCount} dari 3. Jika mencapai 3 kali, ujian akan diakhiri otomatis.`,
            count: currentCount,
            isLast: false
          });
        }
      }
    };

    window.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      window.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [sertifikatSubTab, jawabanUjian, ujianData]);

  const fetchUnitKerja = () => {
    fetch(API_URL + '/unit_kerja')
      .then(res => res.json())
      .then(data => setUnitKerjaData(Array.isArray(data) ? data : []));
  };

  const fetchJabatan = () => {
    fetch(API_URL + '/jabatan')
      .then(res => res.json())
      .then(data => setJabatanData(Array.isArray(data) ? data : []));
  };

  const fetchGrupData = () => {
    fetch(API_URL + '/grup')
      .then(res => res.json())
      .then(data => setGrupData(Array.isArray(data) ? data : []));
  };

  const fetchPendidikanData = () => {
    fetch(API_URL + '/pendidikan')
      .then(res => res.json())
      .then(data => setPendidikanData(Array.isArray(data) ? data : []))
      .catch(err => console.error("Error fetching pendidikan:", err));
  };

  const fetchPejabatData = () => {
    fetch(API_URL + '/pejabat')
      .then(res => res.json())
      .then(data => setPejabatData(Array.isArray(data) ? data : []))
      .catch(err => console.error("Error fetching pejabat:", err));
  };

  const fetchJenisList = () => {
    fetch(API_URL + '/jenis')
      .then(res => res.json())
      .then(data => {
        const list = Array.isArray(data) ? data : [];
        setJenisList(list);
      })
      .catch(err => console.error("Error fetching RKK jenis:", err));
  };

  const fetchRkkList = () => {
    fetch(API_URL + '/master_rkk')
      .then(res => res.json())
      .then(data => setRkkList(Array.isArray(data) ? data : []))
      .catch(err => console.error("Error fetching master RKK:", err));
  };

  const fetchKredensialList = () => {
    fetch(API_URL + '/kredensial')
      .then(res => res.json())
      .then(data => setKredensialList(Array.isArray(data) ? data : []))
      .catch(err => console.error("Error fetching kredensial list:", err));
  };

  const getLevelNote = (lvl) => {
    if (Number(lvl) === 2) return "Level PK 2 mencakup seluruh kewenangan klinis di PK 1.";
    if (Number(lvl) === 3) return "Level PK 3 mencakup seluruh kewenangan klinis di PK 1 dan PK 2.";
    if (Number(lvl) === 4) return "Level PK 4 mencakup seluruh kewenangan klinis di PK 1, PK 2, dan PK 3.";
    if (Number(lvl) === 5) return "Level PK 5 mencakup seluruh kewenangan klinis di PK 1, PK 2, PK 3, dan PK 4.";
    return null;
  };

  const handleAddJenis = (e) => {
    e.preventDefault();
    if (!jenisForm.kd_jenis || !jenisForm.nm_jenis) {
      showToast('Kode dan nama jenis RKK wajib diisi.', 'error');
      return;
    }
    fetch(API_URL + '/jenis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(jenisForm)
    })
      .then(res => res.json())
      .then(data => {
        if (data.messages?.error) {
          showToast(data.messages.error, 'error');
        } else {
          showToast('Jenis RKK berhasil ditambahkan.', 'success');
          fetchJenisList();
          setJenisForm({ kd_jenis: '', nm_jenis: '' });
          setShowJenisModal(false);
        }
      })
      .catch(() => showToast('Gagal menambahkan jenis RKK.', 'error'));
  };

  const handleEditJenis = (e) => {
    e.preventDefault();
    if (!jenisForm.nm_jenis) {
      showToast('Nama jenis RKK wajib diisi.', 'error');
      return;
    }
    fetch(API_URL + `/jenis/${editingJenisKd}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nm_jenis: jenisForm.nm_jenis })
    })
      .then(res => res.json())
      .then(data => {
        if (data.messages?.error) {
          showToast(data.messages.error, 'error');
        } else {
          showToast('Jenis RKK berhasil diperbarui.', 'success');
          fetchJenisList();
          setJenisForm({ kd_jenis: '', nm_jenis: '' });
          setEditingJenisKd(null);
          setShowJenisModal(false);
        }
      })
      .catch(() => showToast('Gagal memperbarui jenis RKK.', 'error'));
  };

  const handleDeleteJenis = (kd) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus jenis RKK ini? Semua RKK terkait mungkin akan terpengaruh.')) return;
    fetch(API_URL + `/jenis/${kd}`, {
      method: 'DELETE'
    })
      .then(res => {
        if (res.ok) {
          showToast('Jenis RKK berhasil dihapus.', 'success');
          fetchJenisList();
        } else {
          showToast('Gagal menghapus jenis RKK.', 'error');
        }
      })
      .catch(() => showToast('Gagal menghapus jenis RKK.', 'error'));
  };

  const handleSaveRkk = (e) => {
    e.preventDefault();
    if (!rkkForm.kd_jenis || !rkkForm.kewenangan) {
      showToast('Jenis dan kewenangan RKK wajib diisi.', 'error');
      return;
    }
    const isEdit = editingRkkId !== null;
    const url = isEdit ? API_URL + `/master_rkk/${editingRkkId}` : API_URL + '/master_rkk';
    const method = isEdit ? 'PUT' : 'POST';

    fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rkkForm)
    })
      .then(res => res.json())
      .then(data => {
        if (data.messages?.error) {
          showToast(data.messages.error, 'error');
        } else {
          showToast(isEdit ? 'Master RKK berhasil diperbarui.' : 'Master RKK berhasil ditambahkan.', 'success');
          fetchRkkList();
          const initialJenis = (activeRkkLevelTab === 1 && activeRkkJenisTab !== 'MGR' && activeRkkJenisTab !== 'MATER') ? 'KMB' : (activeRkkJenisTab || (jenisList[0]?.kd_jenis || ''));
          setRkkForm({ kd_jenis: initialJenis, level_pk: activeRkkLevelTab || 1, kewenangan: '', aktif: 1 });
          setEditingRkkId(null);
          setShowRkkModal(false);
        }
      })
      .catch(() => showToast('Gagal menyimpan Master RKK.', 'error'));
  };

  const handleDeleteRkk = (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus RKK ini?')) return;
    fetch(API_URL + `/master_rkk/${id}`, {
      method: 'DELETE'
    })
      .then(res => {
        if (res.ok) {
          showToast('Master RKK berhasil dihapus.', 'success');
          fetchRkkList();
        } else {
          showToast('Gagal menghapus Master RKK.', 'error');
        }
      })
      .catch(() => showToast('Gagal menghapus Master RKK.', 'error'));
  };

  const handleSaveKredensial = () => {
    if (!kredensialSelectedPerawatId) {
      showToast('Pilih perawat terlebih dahulu.', 'error');
      return;
    }
    const items = Object.entries(kredensialWorksheet).map(([id_rkk, nilai]) => ({
      id_rkk: parseInt(id_rkk),
      nilai: parseInt(nilai)
    })).filter(item => item.nilai > 0);

    const payload = {
      id_perawat: parseInt(kredensialSelectedPerawatId),
      tgl_kredensial: kredensialWorksheetDate,
      items: items
    };

    fetch(API_URL + '/kredensial', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          showToast('Kredensial perawat berhasil disimpan.', 'success');
          fetchKredensialList();
        } else {
          showToast(data.message || 'Gagal menyimpan kredensial.', 'error');
        }
      })
      .catch(() => showToast('Gagal menyimpan kredensial.', 'error'));
  };


  const handleAddUnitKerja = (e) => {
    e.preventDefault();
    if (!newUnitKerja) return;
    fetch(API_URL + '/unit_kerja', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nama_unit: newUnitKerja })
    }).then(() => { fetchUnitKerja(); setNewUnitKerja(''); });
  };

  const handleAddJabatan = (e) => {
    e.preventDefault();
    if (!newJabatan) return;
    fetch(API_URL + '/jabatan', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nama_jabatan: newJabatan })
    }).then(() => { fetchJabatan(); setNewJabatan(''); });
  };

  const handleDeleteUnitKerja = (id) => {
    if (confirm('Yakin hapus unit kerja ini?')) {
      fetch(`${API_URL}/unit_kerja/${id}`, { method: 'DELETE' }).then(() => fetchUnitKerja());
    }
  };

  const handleUpdateUnitKerja = (id, e) => {
    e.preventDefault();
    fetch(`${API_URL}/unit_kerja/${id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nama_unit: editUnitName })
    }).then(() => { fetchUnitKerja(); setEditingUnitId(null); });
  };

  const handleDeleteJabatan = (id) => {
    if (confirm('Yakin hapus jabatan ini?')) {
      fetch(`${API_URL}/jabatan/${id}`, { method: 'DELETE' }).then(() => fetchJabatan());
    }
  };

  const handleUpdateJabatan = (id, e) => {
    e.preventDefault();
    fetch(`${API_URL}/jabatan/${id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nama_jabatan: editJabatanName })
    }).then(() => { fetchJabatan(); setEditingJabatanId(null); });
  };

  const handleAddPendidikan = (e) => {
    e.preventDefault();
    if (!newPendidikan) return;
    fetch(API_URL + '/pendidikan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nama_pendidikan: newPendidikan })
    })
      .then(res => res.json())
      .then(() => {
        fetchPendidikanData();
        setNewPendidikan('');
        showToast("Pendidikan berhasil ditambahkan!", "success");
      })
      .catch(err => {
        console.error("Error adding pendidikan:", err);
        showToast("Gagal menambahkan pendidikan", "error");
      });
  };

  const handleUpdatePendidikan = (id, e) => {
    e.preventDefault();
    if (!editPendidikanName) return;
    fetch(`${API_URL}/pendidikan/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nama_pendidikan: editPendidikanName, _method: 'PUT' })
    })
      .then(res => res.json())
      .then(() => {
        fetchPendidikanData();
        setEditingPendidikanId(null);
        showToast("Pendidikan berhasil diubah!", "success");
      })
      .catch(err => {
        console.error("Error updating pendidikan:", err);
        showToast("Gagal mengubah pendidikan", "error");
      });
  };

  const handleDeletePendidikan = (id) => {
    if (confirm('Yakin ingin menghapus data pendidikan ini?')) {
      fetch(`${API_URL}/pendidikan/${id}`, {
        method: 'DELETE'
      })
        .then(() => {
          fetchPendidikanData();
          showToast("Pendidikan berhasil dihapus!", "success");
        })
        .catch(err => {
          console.error("Error deleting pendidikan:", err);
          showToast("Gagal menghapus pendidikan", "error");
        });
    }
  };

  const fetchJenjangJabatan = () => {
    fetch(API_URL + '/jenjang_jabatan')
      .then(res => res.json())
      .then(data => setJenjangJabatanData(Array.isArray(data) ? data : []))
      .catch(err => console.error("Error fetching jenjang jabatan:", err));
  };

  const handleAddJenjangJabatan = (e) => {
    e.preventDefault();
    if (!newJenjangNama) return;
    fetch(API_URL + '/jenjang_jabatan', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nama_jenjang: newJenjangNama,
        kategori_pendidikan: newJenjangPendidikan,
        profesi: newJenjangProfesi
      })
    }).then(res => {
      if (res.ok) {
        showToast('Berhasil menyimpan data jenjang jabatan.', 'success');
        fetchJenjangJabatan();
        setNewJenjangNama('');
      } else {
        showToast('Gagal menyimpan data jenjang jabatan.', 'error');
      }
    });
  };

  const handleDeleteJenjangJabatan = (id) => {
    if (confirm('Yakin hapus jenjang jabatan fungsional ini?')) {
      fetch(`${API_URL}/jenjang_jabatan/${id}`, { method: 'DELETE' }).then(res => {
        if (res.ok) {
          showToast('Data jenjang jabatan berhasil dihapus.', 'success');
          fetchJenjangJabatan();
        } else {
          showToast('Gagal menghapus data jenjang jabatan.', 'error');
        }
      });
    }
  };

  const handleUpdateJenjangJabatan = (id, e) => {
    e.preventDefault();
    fetch(`${API_URL}/jenjang_jabatan/${id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nama_jenjang: editJenjangNama,
        kategori_pendidikan: editJenjangPendidikan,
        profesi: editJenjangProfesi
      })
    }).then(res => {
      if (res.ok) {
        showToast('Data jenjang jabatan berhasil diperbarui.', 'success');
        fetchJenjangJabatan();
        setEditingJenjangId(null);
      } else {
        showToast('Gagal memperbarui data jenjang jabatan.', 'error');
      }
    });
  };

  const handleOpenModal = (mode, data = null) => {
    setModalMode(mode);
    if (mode === 'edit' && data) {
      setFormData({ ...data, foto: null, file_str: null, file_sip: null, current_foto: data.foto, current_str: data.file_str, current_sip: data.file_sip });
    } else {
      setFormData({ id_perawat: '', nik: '', nip: '', nama: '', tempat_lahir: '', tanggal_lahir: '', jk: 'L', alamat: '', hp: '', email: '', profesi: '', unit_kerja: '', jabatan: '', pendidikan_terakhir: '', no_ijazah: '', grup: '', status: 'A', id_user: '', foto: null, file_str: null, file_sip: null, current_foto: null, current_str: null, current_sip: null, no_str: '', masa_berlaku_str: '', no_sip: '', masa_berlaku_sip: '' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleChange = (e) => {
    if (e.target.type === 'file') {
      setFormData({ ...formData, [e.target.name]: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const url = modalMode === 'add'
      ? API_URL + '/perawat'
      : API_URL + `/perawat/${formData.id_perawat}`;
    const method = 'POST'; // We use POST for FormData so CI4 processes $_FILES natively

    const payload = new FormData();
    Object.keys(formData).forEach(key => {
      if (formData[key] !== null && formData[key] !== undefined) {
        // Prevent empty or invalid id_user from causing foreign key errors
        if (key === 'id_user' && (formData[key] === '' || formData[key] === '0' || formData[key] === 'null')) {
          // Skip appending
        } else {
          payload.append(key, formData[key]);
        }
      }
    });

    if (modalMode === 'edit') {
      payload.append('_method', 'PUT'); // Trick CodeIgniter's ResourceController
    }

    fetch(url, {
      method: method,
      body: payload
    })
      .then(res => {
        if (!res.ok) {
          throw new Error("HTTP error " + res.status);
        }
        return res.json();
      })
      .then(result => {
        showToast("Data perawat berhasil disimpan!", "success");
        fetchPerawatData();
        setIsModalOpen(false);
        const isSelfPerawat = activeTab === 'perawat' && currentUser?.role === 'Perawat';
        if (selectedPerawat && (activeTab === 'detail_perawat' || isSelfPerawat)) {
          fetch(`${API_URL}/perawat/${selectedPerawat.id_perawat}?t=${Date.now()}`)
            .then(r => r.json())
            .then(updated => {
              if (updated) setSelectedPerawat(updated);
            })
            .catch(err => console.error("Error updating detail nurse:", err));
        }
      })
      .catch(err => {
        console.error("Error saving data:", err);
        showToast("Gagal menyimpan data perawat. Cek koneksi atau data input Anda.", "error");
      });
  };

  const handleDelete = (id) => {
    if (confirm('Yakin ingin menghapus data ini?')) {
      fetch(`${API_URL}/perawat/${id}`, {
        method: 'DELETE'
      })
        .then(res => res.json())
        .then(res => fetchPerawatData())
        .catch(err => console.error("Error deleting data:", err));
    }
  };

  const fetchDetailData = (id_perawat) => {
    // Fetch assessments
    fetch(API_URL + '/assessment')
      .then(res => res.json())
      .then(data => {
        const filtered = Array.isArray(data) ? data.filter(a => String(a.id_perawat) === String(id_perawat)) : [];
        setAssessments(filtered);
      })
      .catch(err => console.error("Error fetching assessments:", err));

    // Fetch riwayat kerja
    fetch(API_URL + '/riwayat_kerja')
      .then(res => res.json())
      .then(data => {
        const filtered = Array.isArray(data) ? data.filter(w => String(w.id_perawat) === String(id_perawat)) : [];
        setRiwayatKerja(filtered);
      })
      .catch(err => console.error("Error fetching riwayat kerja:", err));

    // Fetch competencies (cache)
    fetch(API_URL + '/kompetensi')
      .then(res => res.json())
      .then(data => {
        setCompetencies(Array.isArray(data) ? data : []);
      })
      .catch(err => console.error("Error fetching competencies:", err));

    // Fetch other documents / certificates
    fetch(API_URL + '/sertifikat')
      .then(res => res.json())
      .then(data => {
        const filtered = Array.isArray(data) ? data.filter(s => String(s.id_perawat) === String(id_perawat)) : [];
        setSertifikatDataList(filtered);
      })
      .catch(err => console.error("Error fetching sertifikat list:", err));

    // Fetch pelatihan history
    fetch(API_URL + '/pelatihan')
      .then(res => res.json())
      .then(data => {
        const filtered = Array.isArray(data) ? data.filter(p => String(p.id_perawat) === String(id_perawat)) : [];
        setPelatihanList(filtered);
      })
      .catch(err => console.error("Error fetching pelatihan list:", err));
  };

  const handleViewDetail = (perawat) => {
    setSelectedPerawat(perawat);
    setActiveTab('detail_perawat');
    fetchDetailData(perawat.id_perawat);
  };

  const handleToggleStatus = (perawat) => {
    const newStatus = perawat.status === 'A' ? 'N' : 'A';
    const payload = new FormData();
    payload.append('status', newStatus);
    payload.append('_method', 'PUT');

    fetch(`${API_URL}/perawat/${perawat.id_perawat}`, {
      method: 'POST',
      body: payload
    })
      .then(res => res.json())
      .then(() => {
        fetchPerawatData();
        setSelectedPerawat({ ...perawat, status: newStatus });
      })
      .catch(err => console.error("Error updating status:", err));
  };

  const handleAddCompetencySubmit = (e) => {
    e.preventDefault();
    if (!selectedPerawat) return;
    const body = {
      ...competencyForm,
      id_perawat: selectedPerawat.id_perawat
    };

    fetch(API_URL + '/assessment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
      .then(res => res.json())
      .then(() => {
        fetchDetailData(selectedPerawat.id_perawat);
        setCompetencyForm({
          id_kompetensi: '',
          asesor: '',
          nilai: '',
          status: 'Kompeten',
          catatan: '',
          tanggal: new Date().toISOString().split('T')[0]
        });
      })
      .catch(err => console.error("Error adding competency history:", err));
  };

  const handleAddRiwayatKerjaSubmit = (e) => {
    e.preventDefault();
    if (!selectedPerawat) return;
    const body = {
      ...riwayatKerjaForm,
      id_perawat: selectedPerawat.id_perawat
    };

    fetch(API_URL + '/riwayat_kerja', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
      .then(res => res.json())
      .then(() => {
        fetchDetailData(selectedPerawat.id_perawat);
        setRiwayatKerjaForm({
          posisi: '',
          instansi: '',
          tahun_masuk: '',
          tahun_keluar: '',
          deskripsi: ''
        });
      })
      .catch(err => console.error("Error adding work history:", err));
  };

  const handleDeleteRiwayatKerja = (id) => {
    if (confirm('Yakin ingin menghapus data riwayat bekerja ini?')) {
      fetch(`${API_URL}/riwayat_kerja/${id}`, { method: 'DELETE' })
        .then(res => res.json())
        .then(() => {
          if (selectedPerawat) {
            fetchDetailData(selectedPerawat.id_perawat);
          }
        })
        .catch(err => console.error("Error deleting work history:", err));
    }
  };

  const handleDeleteCompetency = (id) => {
    if (confirm('Yakin ingin menghapus riwayat asesmen kompetensi ini?')) {
      fetch(`${API_URL}/assessment/${id}`, { method: 'DELETE' })
        .then(res => res.json())
        .then(() => {
          if (selectedPerawat) {
            fetchDetailData(selectedPerawat.id_perawat);
          }
        })
        .catch(err => console.error("Error deleting competency history:", err));
    }
  };

  const handleAddSertifikatSubmit = (e) => {
    e.preventDefault();
    if (!selectedPerawat) return;

    const payload = new FormData();
    payload.append('id_perawat', selectedPerawat.id_perawat);
    payload.append('nama_sertifikat', sertifikatForm.nama_sertifikat);
    payload.append('nomor', sertifikatForm.nomor);
    payload.append('tgl_terbit', sertifikatForm.tgl_terbit);
    payload.append('tgl_expired', sertifikatForm.tgl_expired);
    if (sertifikatForm.file) {
      payload.append('file', sertifikatForm.file);
    }

    fetch(API_URL + '/sertifikat', {
      method: 'POST',
      body: payload
    })
      .then(res => res.json())
      .then(() => {
        fetchDetailData(selectedPerawat.id_perawat);
        setSertifikatForm({
          nama_sertifikat: '',
          nomor: '',
          tgl_terbit: '',
          tgl_expired: '',
          file: null
        });
        const fileInput = document.getElementById('sertifikat_file_input');
        if (fileInput) fileInput.value = '';
      })
      .catch(err => console.error("Error adding sertifikat:", err));
  };

  const handleDeleteSertifikat = (id) => {
    if (confirm('Yakin ingin menghapus dokumen ini?')) {
      fetch(`${API_URL}/sertifikat/${id}`, {
        method: 'DELETE'
      })
        .then(res => res.json())
        .then(() => {
          if (selectedPerawat) {
            fetchDetailData(selectedPerawat.id_perawat);
          }
        })
        .catch(err => console.error("Error deleting sertifikat:", err));
    }
  };

  // Pelatihan detail handlers
  const handleAddPelatihanSubmit = (e) => {
    e.preventDefault();
    if (!selectedPerawat) return;
    const payload = new FormData();
    payload.append('id_perawat', selectedPerawat.id_perawat);
    payload.append('nama_pelatihan', pelatihanForm.nama_pelatihan);
    payload.append('penyelenggara', pelatihanForm.penyelenggara);
    payload.append('tanggal_mulai', pelatihanForm.tanggal_mulai);
    payload.append('tanggal_selesai', pelatihanForm.tanggal_selesai);
    payload.append('jumlah_jam', pelatihanForm.jumlah_jam);
    payload.append('no_sertifikat', pelatihanForm.no_sertifikat);
    if (pelatihanForm.file) payload.append('file', pelatihanForm.file);

    fetch(API_URL + '/pelatihan', {
      method: 'POST',
      body: payload
    })
      .then(res => res.json())
      .then(() => {
        fetchDetailData(selectedPerawat.id_perawat);
        setPelatihanForm({ nama_pelatihan: '', penyelenggara: '', tanggal_mulai: '', tanggal_selesai: '', jumlah_jam: '', no_sertifikat: '', file: null });
        const fi = document.getElementById('pelatihan_file_input');
        if (fi) fi.value = '';
      })
      .catch(err => console.error("Error adding pelatihan:", err));
  };

  const handleDeletePelatihan = (id) => {
    if (confirm('Yakin ingin menghapus data pelatihan ini?')) {
      fetch(`${API_URL}/pelatihan/${id}`, { method: 'DELETE' })
        .then(res => res.json())
        .then(() => { if (selectedPerawat) fetchDetailData(selectedPerawat.id_perawat); })
        .catch(err => console.error("Error deleting pelatihan:", err));
    }
  };

  // STR/SIP inline edit handler
  const handleStrSipInlineSubmit = (e) => {
    e.preventDefault();
    if (!selectedPerawat) return;
    const payload = new FormData();
    payload.append('_method', 'PUT');
    payload.append('no_str', strSipForm.no_str);
    payload.append('masa_berlaku_str', strSipForm.masa_berlaku_str);
    payload.append('no_sip', strSipForm.no_sip);
    payload.append('masa_berlaku_sip', strSipForm.masa_berlaku_sip);
    if (strSipForm.file_str) payload.append('file_str', strSipForm.file_str);
    if (strSipForm.file_sip) payload.append('file_sip', strSipForm.file_sip);

    fetch(`${API_URL}/perawat/${selectedPerawat.id_perawat}`, {
      method: 'POST',
      body: payload
    })
      .then(res => res.json())
      .then(result => {
        // 1. Merge updated fields directly to selectedPerawat state for instant UI update
        if (result) {
          setSelectedPerawat(prev => ({
            ...prev,
            ...result
          }));
        }

        // 2. Fetch full updated perawat record with cache buster in background
        fetch(`${API_URL}/perawat/${selectedPerawat.id_perawat}?t=${Date.now()}`)
          .then(r => r.json())
          .then(updated => {
            if (updated) setSelectedPerawat(updated);
          })
          .catch(err => console.error("Error background fetching perawat detail:", err));

        fetchPerawatData();
        setIsEditingStrSip(false);
      })
      .catch(err => console.error("Error updating STR/SIP:", err));
  };

  // Fetch all pelatihan for sidebar page
  const fetchAllPelatihan = () => {
    fetch(API_URL + '/pelatihan')
      .then(res => res.json())
      .then(data => setAllPelatihanData(Array.isArray(data) ? data : []))
      .catch(err => console.error("Error fetching all pelatihan:", err));
  };

  // Pelatihan sidebar CRUD handlers
  const handleOpenPelatihanModal = (mode, data = null) => {
    setPelatihanModalMode(mode);
    if (mode === 'edit' && data) {
      setPelatihanModalForm({ ...data, file: null });
    } else {
      setPelatihanModalForm({ id: '', id_perawat: '', nama_pelatihan: '', penyelenggara: '', tanggal_mulai: '', tanggal_selesai: '', jumlah_jam: '', no_sertifikat: '', file: null });
    }
    setIsPelatihanModalOpen(true);
  };

  const handlePelatihanModalSubmit = (e) => {
    e.preventDefault();
    const url = pelatihanModalMode === 'add'
      ? API_URL + '/pelatihan'
      : API_URL + `/pelatihan/${pelatihanModalForm.id}`;
    const payload = new FormData();
    if (pelatihanModalMode === 'edit') payload.append('_method', 'PUT');
    payload.append('id_perawat', pelatihanModalForm.id_perawat);
    payload.append('nama_pelatihan', pelatihanModalForm.nama_pelatihan);
    payload.append('penyelenggara', pelatihanModalForm.penyelenggara);
    payload.append('tanggal_mulai', pelatihanModalForm.tanggal_mulai);
    payload.append('tanggal_selesai', pelatihanModalForm.tanggal_selesai);
    payload.append('jumlah_jam', pelatihanModalForm.jumlah_jam);
    payload.append('no_sertifikat', pelatihanModalForm.no_sertifikat);
    if (pelatihanModalForm.file) payload.append('file', pelatihanModalForm.file);

    fetch(url, { method: 'POST', body: payload })
      .then(res => res.json())
      .then(() => { fetchAllPelatihan(); setIsPelatihanModalOpen(false); })
      .catch(err => console.error("Error saving pelatihan:", err));
  };

  const handleDeletePelatihanSidebar = (id) => {
    if (confirm('Yakin ingin menghapus data pelatihan ini?')) {
      fetch(`${API_URL}/pelatihan/${id}`, { method: 'DELETE' })
        .then(res => res.json())
        .then(() => fetchAllPelatihan())
        .catch(err => console.error("Error deleting pelatihan:", err));
    }
  };

  const handleOpenKompetensiModal = (mode, data = null) => {
    setKompetensiModalMode(mode);
    if (mode === 'edit' && data) {
      setKompetensiFormData({
        id: data.id,
        kode_kompetensi: data.kode_kompetensi || '',
        nama_kompetensi: data.nama_kompetensi || '',
        kategori: data.kategori || '',
        unit: data.unit || ''
      });
    } else {
      setKompetensiFormData({
        id: '',
        kode_kompetensi: '',
        nama_kompetensi: '',
        kategori: '',
        unit: ''
      });
    }
    setIsKompetensiModalOpen(true);
  };

  const handleCloseKompetensiModal = () => {
    setIsKompetensiModalOpen(false);
  };

  const handleKompetensiChange = (e) => {
    let val = e.target.value;
    if (e.target.name === 'kode_kompetensi') {
      val = val.toUpperCase();
    }
    setKompetensiFormData({ ...kompetensiFormData, [e.target.name]: val });
  };

  const handleKompetensiSubmit = (e) => {
    e.preventDefault();
    const url = kompetensiModalMode === 'add'
      ? API_URL + '/kompetensi'
      : API_URL + `/kompetensi/${kompetensiFormData.id}`;

    const method = kompetensiModalMode === 'add' ? 'POST' : 'PUT';

    fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        kode_kompetensi: kompetensiFormData.kode_kompetensi,
        nama_kompetensi: kompetensiFormData.nama_kompetensi,
        kategori: kompetensiFormData.kategori,
        unit: kompetensiFormData.unit
      })
    })
      .then(res => res.json())
      .then(res => {
        fetchCompetencies();
        setIsKompetensiModalOpen(false);
      })
      .catch(err => console.error("Error saving competency:", err));
  };

  const handleDeleteKompetensi = (id) => {
    if (confirm('Yakin ingin menghapus kompetensi ini?')) {
      fetch(`${API_URL}/kompetensi/${id}`, {
        method: 'DELETE'
      })
        .then(res => res.json())
        .then(res => fetchCompetencies())
        .catch(err => console.error("Error deleting competency:", err));
    }
  };

  // Mathematical logic for searching, filtering, and pagination
  const visiblePerawatData = React.useMemo(() => {
    if (currentUser?.role === 'Perawat') {
      return perawatData.filter(p =>
        p.nama.toLowerCase().includes(currentUser.nama.toLowerCase()) ||
        p.email === currentUser.username
      );
    }
    return perawatData;
  }, [perawatData, currentUser]);

  const filteredData = visiblePerawatData.filter(p => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = !query ||
      (p.nama && p.nama.toLowerCase().includes(query)) ||
      (p.nip && p.nip.toLowerCase().includes(query)) ||
      (p.nik && p.nik.toLowerCase().includes(query)) ||
      (p.email && p.email.toLowerCase().includes(query)) ||
      (p.hp && p.hp.toLowerCase().includes(query));

    const matchesUnit = !filterUnit || p.unit_kerja === filterUnit;
    const matchesGrup = !filterGrup || p.grup === filterGrup;
    const matchesProfesi = !filterProfesi || p.profesi === filterProfesi;

    return matchesSearch && matchesUnit && matchesGrup && matchesProfesi;
  });

  // Data Perawat pagination
  const totalItemsPerawat = filteredData.length;
  const totalPagesPerawat = Math.ceil(totalItemsPerawat / itemsPerPage) || 1;
  const indexOfLastItemPerawat = currentPagePerawat * itemsPerPage;
  const indexOfFirstItemPerawat = indexOfLastItemPerawat - itemsPerPage;
  const currentItemsPerawat = filteredData.slice(indexOfFirstItemPerawat, indexOfLastItemPerawat);

  // STR & SIP Monitoring pagination
  const totalItemsStr = filteredData.length;
  const totalPagesStr = Math.ceil(totalItemsStr / itemsPerPage) || 1;
  const indexOfLastItemStr = currentPageStr * itemsPerPage;
  const indexOfFirstItemStr = indexOfLastItemStr - itemsPerPage;
  const currentItemsStr = filteredData.slice(indexOfFirstItemStr, indexOfLastItemStr);

  // Master Kompetensi searching, filtering, and pagination math
  const filteredKompetensi = competencies.filter(c => {
    const query = kompetensiSearchQuery.toLowerCase();
    const matchesSearch = !query ||
      (c.kode_kompetensi && c.kode_kompetensi.toLowerCase().includes(query)) ||
      (c.nama_kompetensi && c.nama_kompetensi.toLowerCase().includes(query));

    const matchesUnit = !kompetensiFilterUnit || c.unit === kompetensiFilterUnit;
    const matchesKategori = !kompetensiFilterKategori || c.kategori === kompetensiFilterKategori;

    return matchesSearch && matchesUnit && matchesKategori;
  });

  const totalItemsKompetensi = filteredKompetensi.length;
  const totalPagesKompetensi = Math.ceil(totalItemsKompetensi / itemsPerPageKompetensi) || 1;
  const indexOfLastItemKompetensi = currentPageKompetensi * itemsPerPageKompetensi;
  const indexOfFirstItemKompetensi = indexOfLastItemKompetensi - itemsPerPageKompetensi;
  const currentItemsKompetensi = filteredKompetensi.slice(indexOfFirstItemKompetensi, indexOfLastItemKompetensi);

  // Master User searching and pagination math
  const filteredUserData = userData.filter(u => {
    const query = userSearchQuery.toLowerCase();
    return !query ||
      (u.nama && u.nama.toLowerCase().includes(query)) ||
      (u.username && u.username.toLowerCase().includes(query)) ||
      (u.role && u.role.toLowerCase().includes(query));
  });

  const totalItemsUser = filteredUserData.length;
  const totalPagesUser = Math.ceil(totalItemsUser / itemsPerPageUser) || 1;
  const indexOfLastItemUser = currentPageUser * itemsPerPageUser;
  const indexOfFirstItemUser = indexOfLastItemUser - itemsPerPageUser;
  const currentItemsUser = filteredUserData.slice(indexOfFirstItemUser, indexOfLastItemUser);

  React.useEffect(() => {
    setCurrentPageUser(1);
  }, [userSearchQuery]);

  if (!currentUser) {
    return (
      <div className={`min-h-screen flex transition-all duration-500 ${isDarkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
        {/* Left Side: Brand & Visuals */}
        <div className="hidden lg:flex w-1/2 bg-slate-900 relative overflow-hidden flex-col items-center justify-center p-12 text-white">
          <div className="absolute top-0 left-0 w-full h-full bg-cover bg-center bg-no-repeat opacity-50 mix-blend-overlay z-0" style={{ backgroundImage: `url(${nursingWallpaper})` }}></div>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/90 to-blue-800/80 z-0"></div>

          {/* Decorative Elements */}
          <div className="absolute top-[-10%] right-[-10%] w-[35rem] h-[35rem] rounded-full bg-white/10 blur-3xl opacity-60 animate-pulse"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[35rem] h-[35rem] rounded-full bg-cyan-400/20 blur-3xl opacity-60 animate-pulse" style={{ animationDelay: '2s' }}></div>

          {/* Content */}
          <div className="relative z-10 w-full max-w-lg">
            <div className="mb-8 p-5 bg-white/10 backdrop-blur-md rounded-2xl w-fit border border-white/20 shadow-xl">
              <Activity size={48} className="text-white drop-shadow-md" />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 leading-tight">
              Sistem Informasi<br />Keperawatan & Kebidanan
            </h1>
            <p className="text-primary-foreground/80 text-lg mb-12 max-w-md font-medium leading-relaxed">
              Platform terintegrasi untuk mengelola kredensial, sertifikasi, serta kompetensi tenaga perawat secara efisien dan transparan.
            </p>

            <div className="flex gap-4">
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/10 px-4 py-3 rounded-xl">
                <Shield className="text-cyan-300" size={24} />
                <div className="text-sm font-semibold">Keamanan Data</div>
              </div>
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/10 px-4 py-3 rounded-xl">
                <CheckCircle className="text-green-300" size={24} />
                <div className="text-sm font-semibold">Cepat & Akurat</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
          {/* Theme toggle in Login */}
          <div className="absolute top-6 right-6">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="text-muted-foreground hover:text-foreground transition-colors p-2.5 rounded-full hover:bg-muted border border-border bg-card/40 backdrop-blur-md shadow-sm"
              title="Toggle Theme"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>

          <div className="w-full max-w-md space-y-8 mt-12 lg:mt-0">
            {authMode === 'login' ? (
              <>
                <div className="text-center flex flex-col items-center w-full">
                  <img src={logoRS} alt="Logo" className="w-5/6 object-contain mb-2 mx-auto" />
                </div>

                {loginError && (
                  <div className="w-full p-4 rounded-xl bg-destructive/10 text-destructive text-sm font-semibold border border-destructive/20 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                    <XCircle size={18} className="shrink-0" />
                    <span>{loginError}</span>
                  </div>
                )}

                {!requireOtp ? (
                  <>
                    <form onSubmit={handleLoginSubmit} className="space-y-6 bg-card border border-border/50 p-8 rounded-2xl shadow-xl shadow-primary/5">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Username</label>
                          <input
                            type="text"
                            value={loginForm.username}
                            onChange={e => setLoginForm({ ...loginForm, username: e.target.value })}
                            placeholder="Masukkan username"
                            required
                            className="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-muted-foreground/50 font-medium"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Password</label>
                          <input
                            type="password"
                            value={loginForm.password}
                            onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
                            placeholder="Masukkan kata sandi"
                            required
                            className="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-muted-foreground/50 font-medium"
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-end">
                        <button type="button" onClick={() => { setAuthMode('forgot_password'); setForgotPasswordStep(1); setForgotPasswordForm({ username: '', otp: '', new_password: '' }); setRegisterError(''); }} className="text-xs font-semibold text-primary hover:underline">Lupa Password?</button>
                      </div>

                      <button
                        type="submit"
                        disabled={isLoggingIn}
                        className="w-full py-3.5 bg-primary text-primary-foreground font-bold hover:bg-primary/95 rounded-xl transition-all shadow-lg shadow-primary/20 hover:shadow-primary/30 disabled:opacity-70 disabled:shadow-none flex items-center justify-center gap-2 text-sm"
                      >
                        {isLoggingIn ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            <span>Memverifikasi...</span>
                          </>
                        ) : (
                          <>
                            <Lock size={18} />
                            <span>Masuk ke Dasbor</span>
                          </>
                        )}
                      </button>
                    </form>
                    <div className="mt-6 text-center">
                      <p className="text-sm text-muted-foreground mb-2">
                        Belum punya akun?{' '}
                        <button onClick={() => { setAuthMode('create_account'); setCreateAccountStep(1); setRegisterError(''); setCreateAccountForm({ nik: '', id_perawat: '', nama: '', username: '', password: '', hp: '', is_hp_validated: 0 }); }} className="text-primary font-bold hover:underline">
                          Buat Akun Pegawai
                        </button>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Bukan pegawai?{' '}
                        <button onClick={() => { setAuthMode('register'); setRegisterStep(1); setRegisterError(''); }} className="text-primary font-bold hover:underline">
                          Daftar Perawat Baru
                        </button>
                      </p>
                    </div>
                  </>
                ) : (
                  <form onSubmit={handleOtpSubmit} className="space-y-6 bg-card border border-border/50 p-8 rounded-2xl shadow-xl shadow-primary/5 animate-in fade-in slide-in-from-right-4">
                    <div className="text-center mb-2">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                        <Shield size={28} />
                      </div>
                      <h3 className="font-bold text-lg">Verifikasi 2 Langkah</h3>
                      <p className="text-xs text-muted-foreground mt-1">Kami telah mengirimkan OTP ke WhatsApp Anda.</p>
                    </div>

                    {devOtpMsg && (
                      <div className="w-full p-4 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-semibold border border-blue-500/20 text-center">
                        {devOtpMsg}
                      </div>
                    )}

                    <div>
                      <input
                        type="text"
                        value={otpCode}
                        onChange={e => setOtpCode(e.target.value)}
                        placeholder="------"
                        required
                        maxLength={6}
                        className="w-full px-4 py-4 bg-background border border-border rounded-xl text-2xl text-center tracking-[0.5em] font-mono focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-muted-foreground/30 font-bold"
                      />
                    </div>

                    <div className="space-y-3">
                      <button
                        type="submit"
                        disabled={isLoggingIn}
                        className="w-full py-3.5 bg-primary text-primary-foreground font-bold hover:bg-primary/95 rounded-xl transition-all shadow-lg shadow-primary/20 disabled:opacity-70 flex items-center justify-center gap-2 text-sm"
                      >
                        {isLoggingIn ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            <span>Memproses...</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle size={18} />
                            <span>Validasi & Masuk</span>
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => { setRequireOtp(false); setLoginForm({ ...loginForm, password: '' }); }}
                        className="w-full py-3.5 bg-secondary text-secondary-foreground font-bold hover:bg-secondary/80 rounded-xl transition-all shadow-sm"
                      >
                        Batal
                      </button>
                    </div>
                  </form>
                )}
              </>
            ) : authMode === 'create_account' ? (
              <div className="space-y-6">
                <div className="text-center lg:text-left relative">
                  {createAccountStep === 2 && (
                    <button onClick={() => setCreateAccountStep(1)} className="absolute -left-2 -top-2 p-2 text-muted-foreground hover:text-foreground">
                      <ChevronLeft size={20} />
                    </button>
                  )}
                  <h2 className="text-3xl font-extrabold tracking-tight text-foreground pl-8 lg:pl-0">
                    {createAccountStep === 1 ? 'Buat Akun Pegawai' : createAccountStep === 2 ? 'Detail Akun' : 'Berhasil'}
                  </h2>
                  <p className="text-muted-foreground text-sm mt-2 font-medium">
                    {createAccountStep === 1 ? 'Masukkan NIK Anda untuk membuat akun.' : createAccountStep === 2 ? `Halo ${createAccountForm.nama}, silakan buat username & password.` : ''}
                  </p>
                </div>

                {registerError && (
                  <div className="w-full p-4 rounded-xl bg-destructive/10 text-destructive text-sm font-semibold border border-destructive/20 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                    <XCircle size={18} className="shrink-0" />
                    <span>{registerError}</span>
                  </div>
                )}

                {createAccountStep === 1 && (
                  <form onSubmit={handleCheckNikExisting} className="space-y-6 bg-card border border-border/50 p-8 rounded-2xl shadow-xl shadow-primary/5 animate-in fade-in slide-in-from-right-4">
                    <div>
                      <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Nomor Induk Kependudukan (NIK)</label>
                      <input type="text" value={createAccountForm.nik} onChange={e => setCreateAccountForm({ ...createAccountForm, nik: e.target.value })} placeholder="Masukkan 16 digit NIK" required className="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-muted-foreground/50 font-medium" />
                    </div>
                    <button type="submit" disabled={isRegistering} className="w-full py-3.5 bg-primary text-primary-foreground font-bold hover:bg-primary/95 rounded-xl transition-all flex justify-center items-center gap-2">
                      {isRegistering ? 'Mengecek...' : 'Lanjut'}
                    </button>
                  </form>
                )}

                {createAccountStep === 2 && (
                  <form onSubmit={handleCreateAccountSubmit} className="space-y-4 bg-card border border-border/50 p-8 rounded-2xl shadow-xl shadow-primary/5 animate-in fade-in slide-in-from-right-4">
                    <div>
                      <label className="block text-xs font-bold text-muted-foreground mb-1">Username Login *</label>
                      <input type="text" required value={createAccountForm.username} onChange={e => setCreateAccountForm({ ...createAccountForm, username: e.target.value })} className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-muted-foreground mb-1">Password *</label>
                      <input type="password" required value={createAccountForm.password} onChange={e => setCreateAccountForm({ ...createAccountForm, password: e.target.value })} className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-muted-foreground mb-1">No. HP (WhatsApp) *</label>
                      <input type="text" required value={createAccountForm.hp} onChange={e => setCreateAccountForm({ ...createAccountForm, hp: e.target.value })} placeholder="Cth: 0812..." className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm" />
                      <p className="text-[10px] text-muted-foreground mt-1">Digunakan untuk reset password atau keamanan ganda.</p>
                      <div className="flex items-center gap-2 mt-2">
                        <input type="checkbox" id="create_hp_validated" checked={createAccountForm.is_hp_validated === 1} onChange={e => setCreateAccountForm({ ...createAccountForm, is_hp_validated: e.target.checked ? 1 : 0 })} className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
                        <label htmlFor="create_hp_validated" className="text-xs font-medium text-foreground cursor-pointer select-none">Tandai nomor HP sebagai langsung tervalidasi</label>
                      </div>
                    </div>
                    <button type="submit" disabled={isRegistering} className="w-full py-3.5 bg-primary text-primary-foreground font-bold hover:bg-primary/95 rounded-xl transition-all flex justify-center items-center gap-2 mt-6">
                      {isRegistering ? 'Menyimpan...' : 'Buat Akun'}
                    </button>
                  </form>
                )}

                {createAccountStep === 3 && (
                  <div className="bg-card border border-border/50 p-8 rounded-2xl shadow-xl shadow-primary/5 text-center animate-in zoom-in-95">
                    <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-green-500">
                      <CheckCircle size={32} />
                    </div>
                    <h3 className="font-bold text-xl mb-2">Akun Berhasil Dibuat!</h3>
                    <p className="text-sm text-muted-foreground mb-6">Anda sekarang dapat login menggunakan Username dan Password yang baru saja dibuat.</p>
                    <button onClick={() => { setAuthMode('login'); setCreateAccountStep(1); }} className="w-full py-3 bg-primary text-primary-foreground font-bold hover:bg-primary/95 rounded-xl transition-all">Kembali ke Login</button>
                  </div>
                )}

                {createAccountStep < 3 && (
                  <div className="mt-6 text-center">
                    <button onClick={() => setAuthMode('login')} className="text-sm font-semibold text-muted-foreground hover:text-primary">Kembali ke Halaman Login</button>
                  </div>
                )}
              </div>
            ) : authMode === 'forgot_password' ? (
              <div className="space-y-6">
                <div className="text-center lg:text-left relative">
                  {forgotPasswordStep === 2 && (
                    <button onClick={() => setForgotPasswordStep(1)} className="absolute -left-2 -top-2 p-2 text-muted-foreground hover:text-foreground">
                      <ChevronLeft size={20} />
                    </button>
                  )}
                  <h2 className="text-3xl font-extrabold tracking-tight text-foreground pl-8 lg:pl-0">Lupa Password</h2>
                  <p className="text-muted-foreground text-sm mt-2 font-medium">
                    {forgotPasswordStep === 1 ? 'Masukkan username Anda untuk mereset password.' : forgotPasswordStep === 2 ? 'Masukkan OTP dan Password baru Anda.' : 'Berhasil'}
                  </p>
                </div>

                {registerError && (
                  <div className="w-full p-4 rounded-xl bg-destructive/10 text-destructive text-sm font-semibold border border-destructive/20 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                    <XCircle size={18} className="shrink-0" />
                    <span>{registerError}</span>
                  </div>
                )}

                {forgotPasswordStep === 1 && (
                  <form onSubmit={handleForgotPasswordOtp} className="space-y-6 bg-card border border-border/50 p-8 rounded-2xl shadow-xl shadow-primary/5 animate-in fade-in slide-in-from-right-4">
                    <div>
                      <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Username</label>
                      <input type="text" value={forgotPasswordForm.username} onChange={e => setForgotPasswordForm({ ...forgotPasswordForm, username: e.target.value })} required className="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-muted-foreground/50 font-medium" />
                    </div>
                    <button type="submit" disabled={isRegistering} className="w-full py-3.5 bg-primary text-primary-foreground font-bold hover:bg-primary/95 rounded-xl transition-all flex justify-center items-center gap-2">
                      {isRegistering ? 'Memproses...' : 'Kirim OTP ke WhatsApp'}
                    </button>
                  </form>
                )}

                {forgotPasswordStep === 2 && (
                  <form onSubmit={handleResetPasswordSubmit} className="space-y-4 bg-card border border-border/50 p-8 rounded-2xl shadow-xl shadow-primary/5 animate-in fade-in slide-in-from-right-4">
                    <div>
                      <label className="block text-xs font-bold text-muted-foreground mb-1">Kode OTP (WhatsApp) *</label>
                      <input type="text" required maxLength={6} value={forgotPasswordForm.otp} onChange={e => setForgotPasswordForm({ ...forgotPasswordForm, otp: e.target.value })} className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-center tracking-[0.5em] font-mono font-bold" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-muted-foreground mb-1">Password Baru *</label>
                      <input type="password" required value={forgotPasswordForm.new_password} onChange={e => setForgotPasswordForm({ ...forgotPasswordForm, new_password: e.target.value })} className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm" />
                    </div>
                    <button type="submit" disabled={isRegistering} className="w-full py-3.5 bg-primary text-primary-foreground font-bold hover:bg-primary/95 rounded-xl transition-all flex justify-center items-center gap-2 mt-6">
                      {isRegistering ? 'Menyimpan...' : 'Reset Password'}
                    </button>
                  </form>
                )}

                {forgotPasswordStep === 3 && (
                  <div className="bg-card border border-border/50 p-8 rounded-2xl shadow-xl shadow-primary/5 text-center animate-in zoom-in-95">
                    <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-green-500">
                      <CheckCircle size={32} />
                    </div>
                    <h3 className="font-bold text-xl mb-2">Password Berhasil Direset!</h3>
                    <p className="text-sm text-muted-foreground mb-6">Silakan login menggunakan password baru Anda.</p>
                    <button onClick={() => { setAuthMode('login'); setForgotPasswordStep(1); setForgotPasswordForm({ username: '', otp: '', new_password: '' }); }} className="w-full py-3 bg-primary text-primary-foreground font-bold hover:bg-primary/95 rounded-xl transition-all">Kembali ke Login</button>
                  </div>
                )}

                {forgotPasswordStep < 3 && (
                  <div className="mt-6 text-center">
                    <button onClick={() => setAuthMode('login')} className="text-sm font-semibold text-muted-foreground hover:text-primary">Kembali ke Halaman Login</button>
                  </div>
                )}
              </div>
            ) : authMode === 'register' ? (
              /* Register Form Flow */
              <div className="space-y-6">
                <div className="text-center lg:text-left relative">
                  {registerStep > 1 && registerStep < 4 && (
                    <button onClick={() => setRegisterStep(registerStep - 1)} className="absolute -left-2 -top-2 p-2 text-muted-foreground hover:text-foreground">
                      <ChevronLeft size={20} />
                    </button>
                  )}
                  <h2 className="text-3xl font-extrabold tracking-tight text-foreground pl-8 lg:pl-0">
                    {registerStep === 1 ? 'Pendaftaran Baru' : registerStep === 2 ? 'Data Pribadi' : registerStep === 3 ? 'Data Akun' : 'Berhasil'}
                  </h2>
                  <p className="text-muted-foreground text-sm mt-2 font-medium">
                    {registerStep === 1 ? 'Masukkan NIK Anda untuk memulai.' : registerStep === 2 ? 'Lengkapi profil perawat Anda.' : registerStep === 3 ? 'Buat detail login akun Anda.' : ''}
                  </p>
                </div>

                {registerError && (
                  <div className="w-full p-4 rounded-xl bg-destructive/10 text-destructive text-sm font-semibold border border-destructive/20 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                    <XCircle size={18} className="shrink-0" />
                    <span>{registerError}</span>
                  </div>
                )}

                {registerStep === 1 && (
                  <form onSubmit={handleCheckNik} className="space-y-6 bg-card border border-border/50 p-8 rounded-2xl shadow-xl shadow-primary/5 animate-in fade-in slide-in-from-right-4">
                    <div>
                      <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Nomor Induk Kependudukan (NIK)</label>
                      <input
                        type="text"
                        value={registerForm.nik}
                        onChange={e => setRegisterForm({ ...registerForm, nik: e.target.value })}
                        placeholder="Masukkan 16 digit NIK"
                        required
                        className="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-muted-foreground/50 font-medium"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isRegistering}
                      className="w-full py-3.5 bg-primary text-primary-foreground font-bold hover:bg-primary/95 rounded-xl transition-all flex justify-center items-center gap-2"
                    >
                      {isRegistering ? 'Mengecek...' : 'Lanjut Isi Data'}
                    </button>
                  </form>
                )}

                {registerStep === 2 && (
                  <form onSubmit={(e) => { e.preventDefault(); setRegisterStep(3); }} className="space-y-4 bg-card border border-border/50 p-8 rounded-2xl shadow-xl shadow-primary/5 animate-in fade-in slide-in-from-right-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <label className="block text-xs font-bold text-muted-foreground mb-1">Nama Lengkap</label>
                        <input type="text" required value={registerForm.nama} onChange={e => setRegisterForm({ ...registerForm, nama: e.target.value })} className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-muted-foreground mb-1">Tempat Lahir</label>
                        <input type="text" value={registerForm.tempat_lahir} onChange={e => setRegisterForm({ ...registerForm, tempat_lahir: e.target.value })} className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-muted-foreground mb-1">Tanggal Lahir</label>
                        <input type="date" value={registerForm.tanggal_lahir} onChange={e => setRegisterForm({ ...registerForm, tanggal_lahir: e.target.value })} className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm" />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs font-bold text-muted-foreground mb-1">Jenis Kelamin</label>
                        <select value={registerForm.jk} onChange={e => setRegisterForm({ ...registerForm, jk: e.target.value })} className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm">
                          <option value="L">Laki-laki</option>
                          <option value="P">Perempuan</option>
                        </select>
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs font-bold text-muted-foreground mb-1">Alamat</label>
                        <textarea value={registerForm.alamat} onChange={e => setRegisterForm({ ...registerForm, alamat: e.target.value })} className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm" rows="2"></textarea>
                      </div>
                    </div>
                    <div className="flex gap-3 mt-6">
                      <button type="button" onClick={() => setRegisterStep(1)} className="w-1/3 py-3 bg-secondary text-secondary-foreground font-bold hover:bg-secondary/80 rounded-xl transition-all">
                        Kembali
                      </button>
                      <button type="submit" className="w-2/3 py-3 bg-primary text-primary-foreground font-bold hover:bg-primary/95 rounded-xl transition-all">
                        Lanjut
                      </button>
                    </div>
                  </form>
                )}

                {registerStep === 3 && (
                  <form onSubmit={handleRegisterSubmit} className="space-y-4 bg-card border border-border/50 p-8 rounded-2xl shadow-xl shadow-primary/5 animate-in fade-in slide-in-from-right-4">
                    <div>
                      <label className="block text-xs font-bold text-muted-foreground mb-1">No. HP (WhatsApp)</label>
                      <input type="text" value={registerForm.hp} onChange={e => setRegisterForm({ ...registerForm, hp: e.target.value })} placeholder="Cth: 0812..." className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm" />
                      <div className="flex items-center gap-2 mt-2">
                        <input type="checkbox" id="register_hp_validated" checked={registerForm.is_hp_validated === 1} onChange={e => setRegisterForm({ ...registerForm, is_hp_validated: e.target.checked ? 1 : 0 })} className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
                        <label htmlFor="register_hp_validated" className="text-xs font-medium text-foreground cursor-pointer select-none">Tandai nomor HP sebagai langsung tervalidasi</label>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-muted-foreground mb-1">Email</label>
                      <input type="email" value={registerForm.email} onChange={e => setRegisterForm({ ...registerForm, email: e.target.value })} className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm" />
                    </div>
                    <div className="pt-4 border-t border-border mt-2">
                      <label className="block text-xs font-bold text-muted-foreground mb-1">Username Login *</label>
                      <input type="text" required value={registerForm.username} onChange={e => setRegisterForm({ ...registerForm, username: e.target.value })} className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-muted-foreground mb-1">Password *</label>
                      <input type="password" required value={registerForm.password} onChange={e => setRegisterForm({ ...registerForm, password: e.target.value })} className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm" />
                    </div>
                    <div className="flex gap-3 mt-6">
                      <button type="button" onClick={() => setRegisterStep(2)} disabled={isRegistering} className="w-1/3 py-3.5 bg-secondary text-secondary-foreground font-bold hover:bg-secondary/80 rounded-xl transition-all">
                        Kembali
                      </button>
                      <button type="submit" disabled={isRegistering} className="w-2/3 py-3.5 bg-primary text-primary-foreground font-bold hover:bg-primary/95 rounded-xl transition-all flex justify-center items-center gap-2">
                        {isRegistering ? 'Menyimpan...' : 'Kirim Pendaftaran'}
                      </button>
                    </div>
                  </form>
                )}

                {registerStep === 4 && (
                  <div className="bg-card border border-border/50 p-8 rounded-2xl shadow-xl shadow-primary/5 text-center animate-in zoom-in-95">
                    <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-green-500">
                      <CheckCircle size={32} />
                    </div>
                    <h3 className="font-bold text-xl mb-2">Pendaftaran Berhasil!</h3>
                    <p className="text-sm text-muted-foreground mb-6">
                      Data Anda telah berhasil disimpan. Saat ini akun Anda berstatus menunggu verifikasi oleh Admin. Silakan coba login secara berkala atau hubungi Admin.
                    </p>
                    <button
                      onClick={() => { setAuthMode('login'); setRegisterStep(1); setRegisterForm({ nik: '', nip: '', nama: '', tempat_lahir: '', tanggal_lahir: '', jk: 'L', alamat: '', hp: '', email: '', profesi: '', unit_kerja: '', pendidikan_terakhir: '', username: '', password: '', is_hp_validated: 0 }); }}
                      className="w-full py-3 bg-primary text-primary-foreground font-bold hover:bg-primary/95 rounded-xl transition-all"
                    >
                      Kembali ke Halaman Login
                    </button>
                  </div>
                )}

                {registerStep < 4 && (
                  <div className="mt-6 text-center">
                    <p className="text-sm text-muted-foreground">
                      Sudah punya akun?{' '}
                      <button onClick={() => setAuthMode('login')} className="text-primary font-bold hover:underline">
                        Masuk di sini
                      </button>
                    </p>
                  </div>
                )}
              </div>
            ) : null}

            <div className="text-center text-[11px] text-muted-foreground/60 font-medium pt-8">
              SIMRS RSUDLH v1.1.0 &copy; 2026.
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex overflow-hidden">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 print:hidden`}>
        <div className="h-16 flex items-center px-6 border-b border-border">
          <Activity className="text-primary mr-2" size={24} />
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-400">
            NMS Dashboard
          </h1>
        </div>

        <div className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-4rem)]">
          <div className="mb-6">
            <p className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Main Menu</p>
            <div className="space-y-1">
              <SidebarItem icon={LayoutDashboard} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
              <SidebarItem icon={Users} label={currentUser?.role === 'Perawat' ? 'Profil Saya' : 'Data Perawat'} active={activeTab === 'perawat'} onClick={() => setActiveTab('perawat')} />
              {currentUser?.role === 'Admin' && (
                <SidebarItem icon={Award} label="Kompetensi" active={activeTab === 'kompetensi'} onClick={() => setActiveTab('kompetensi')} />
              )}
              {currentUser?.role === 'Admin' && (
                <SidebarItem icon={GraduationCap} label="Pelatihan" active={activeTab === 'pelatihan'} onClick={() => setActiveTab('pelatihan')} />
              )}
            </div>
          </div>

          <div className="mb-6">
            <p className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Manajemen</p>
            <div className="space-y-1">
              <SidebarItem icon={FileText} label="Asesmen Kompetensi" active={activeTab === 'sertifikasi'} onClick={() => { setActiveTab('sertifikasi'); setActivePengajuan(null); setIsCreatingPengajuan(false); }} />
              {['Admin', 'Asesor'].includes(currentUser?.role) && (
                <SidebarItem icon={ClipboardCheck} label="Rekap Asesmen" active={activeTab === 'asesmen'} onClick={() => setActiveTab('asesmen')} />
              )}
              {currentUser?.role === 'Admin' && (
                <>
                  <SidebarItem icon={Stethoscope} label="Kredensial" active={activeTab === 'kredensial'} onClick={() => setActiveTab('kredensial')} />
                </>
              )}
            </div>
          </div>

          {currentUser?.role === 'Admin' && (
            <div className="mb-6">
              <p className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Data Master</p>
              <div className="space-y-1">
                <SidebarItem icon={Building} label="Master Unit Kerja" active={activeTab === 'master_unit_kerja'} onClick={() => setActiveTab('master_unit_kerja')} />
                <SidebarItem icon={Briefcase} label="Master Jabatan" active={activeTab === 'master_jabatan'} onClick={() => setActiveTab('master_jabatan')} />
                <SidebarItem icon={Briefcase} label="Master Jenjang Jabatan" active={activeTab === 'master_jenjang_jabatan'} onClick={() => setActiveTab('master_jenjang_jabatan')} />
                <SidebarItem icon={GraduationCap} label="Master Pendidikan" active={activeTab === 'master_pendidikan'} onClick={() => setActiveTab('master_pendidikan')} />
                <SidebarItem icon={Tags} label="Master Kategori" active={activeTab === 'master_kategori'} onClick={() => setActiveTab('master_kategori')} />
                <SidebarItem icon={User} label="Master User" active={activeTab === 'master_user'} onClick={() => setActiveTab('master_user')} />
                <SidebarItem icon={FileText} label="Master Soal" active={activeTab === 'master_soal'} onClick={() => setActiveTab('master_soal')} />
                <SidebarItem icon={User} label="Master Pejabat" active={activeTab === 'master_pejabat'} onClick={() => setActiveTab('master_pejabat')} />
                <SidebarItem icon={Tags} label="Master Jenis RKK" active={activeTab === 'master_jenis'} onClick={() => setActiveTab('master_jenis')} />
                <SidebarItem icon={ClipboardCheck} label="Master RKK" active={activeTab === 'master_rkk'} onClick={() => setActiveTab('master_rkk')} />
              </div>

            </div>
          )}

          <div className="mb-6">
            <p className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Lainnya</p>
            <div className="space-y-1">
              <SidebarItem icon={Clock} label="STR & SIP" active={activeTab === 'str'} onClick={() => setActiveTab('str')} />
              <SidebarItem icon={BookOpen} label="Pelatihan" active={activeTab === 'pelatihan'} onClick={() => setActiveTab('pelatihan')} />
              {currentUser?.role === 'Admin' && (
                <SidebarItem icon={Settings} label="Pengaturan" active={activeTab === 'pengaturan'} onClick={() => setActiveTab('pengaturan')} />
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Header */}
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 z-10 print:hidden">
          <div className="flex items-center">
            <button
              className="lg:hidden text-muted-foreground hover:text-foreground mr-4"
              onClick={() => setSidebarOpen(!isSidebarOpen)}
            >
              <Menu size={24} />
            </button>
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <input
                type="text"
                placeholder="Cari perawat..."
                value={searchQuery}
                onChange={e => {
                  setSearchQuery(e.target.value);
                  if (activeTab === 'detail_perawat') {
                    setActiveTab('perawat');
                  }
                }}
                className="pl-10 pr-4 py-2 bg-muted rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary w-64 transition-all"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-full hover:bg-muted"
              title="Toggle Theme"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button className="relative text-muted-foreground hover:text-foreground transition-colors">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-destructive rounded-full"></span>
            </button>
            <div className="relative group flex items-center gap-2.5 cursor-pointer pl-2.5 py-1 hover:bg-muted/60 rounded-xl transition-colors">
              <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center text-primary font-bold text-sm">
                {currentUser?.nama?.charAt(0).toUpperCase()}
              </div>
              <div className="hidden md:block text-left text-xs pr-1.5">
                <p className="font-semibold text-foreground leading-none">{currentUser?.nama}</p>
                <p className="text-muted-foreground font-semibold text-[10px] leading-tight mt-0.5">{currentUser?.role}</p>
              </div>

              {/* Dropdown Menu */}
              <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-border shadow-xl rounded-xl py-1 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 z-50 before:content-[''] before:absolute before:-top-2 before:left-0 before:right-0 before:h-2">
                <div className="px-4 py-2 border-b border-border text-xs">
                  <p className="font-semibold text-foreground text-ellipsis overflow-hidden">{currentUser?.nama}</p>
                  <p className="text-muted-foreground mt-0.5">{currentUser?.username}</p>
                </div>
                {currentUser?.role === 'Perawat' && (
                  <button
                    onClick={() => {
                      const myData = perawatData.find(p => String(p.id_user) === String(currentUser.id));
                      if (myData) {
                        fetchDetailData(myData.id_perawat);
                        setActiveTab('detail_perawat');
                      }
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-xs hover:bg-muted transition-colors text-left font-semibold text-foreground border-b border-border"
                  >
                    <User size={14} /> Profil Saya
                  </button>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-destructive hover:bg-destructive/10 transition-colors text-left font-semibold"
                >
                  <LogOut size={14} /> Keluar Sesi
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto space-y-8">

            {activeTab === 'dashboard' && currentUser?.role === 'Perawat' && (() => {
              const strExp = currentPerawatRecord?.masa_berlaku_str;
              const sipExp = currentPerawatRecord?.masa_berlaku_sip;

              const today = new Date();
              const getDays = (dateStr) => {
                if (!dateStr) return null;
                const diff = new Date(dateStr) - today;
                return Math.ceil(diff / (1000 * 60 * 60 * 24));
              };

              const strDaysLeft = getDays(strExp);
              const sipDaysLeft = getDays(sipExp);

              const getStatusBadge = (daysLeft, dateStr) => {
                if (!dateStr) return { label: 'Belum Ada', class: 'bg-secondary text-muted-foreground border border-border' };
                if (daysLeft < 0) return { label: 'Expired', class: 'bg-red-500/10 text-red-500 border border-red-500/20' };
                if (daysLeft <= 90) return { label: `Kritis (${daysLeft} hari)`, class: 'bg-orange-500/10 text-orange-500 border border-orange-500/20 animate-pulse' };
                return { label: 'Aktif', class: 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' };
              };

              const strBadge = getStatusBadge(strDaysLeft, strExp);
              const sipBadge = getStatusBadge(sipDaysLeft, sipExp);

              const pendingCount = myPengajuans.filter(p => p.status === 'Pending').length;
              const approvedCount = myPengajuans.filter(p => p.status === 'Approved').length;
              const rejectedCount = myPengajuans.filter(p => p.status === 'Rejected').length;

              const list12Comps = ['KD-01', 'KD-02', 'KD-03', 'KD-04', 'KD-05', 'KD-06', 'KD-07', 'KD-08', 'KD-09', 'KD-10', 'KD-11', 'KD-12'];
              const completedComps = list12Comps.filter(code => {
                const key = `${code}_form01`;
                return !!competencyForms[key];
              });
              const progressPct = Math.round((completedComps.length / 12) * 100);

              const competencyTitles = {
                'KD-01': 'Komunikasi Interpersonal',
                'KD-02': 'Etika dan Etiket Keperawatan',
                'KD-03': 'Pengukuran TTV',
                'KD-04': 'Pengkajian Holistik',
                'KD-05': 'Perawatan Luka Dasar',
                'KD-06': 'Fasilitasi Oksigenasi',
                'KD-07': 'Cairan & Elektrolit',
                'KD-08': 'Pemberian Obat (6 Benar)',
                'KD-09': 'Pemenuhan Eliminasi',
                'KD-10': 'Pemenuhan Nutrisi',
                'KD-11': 'Pencegahan & Pengendalian Infeksi',
                'KD-12': 'Patient Safety & Cegah Cedera'
              };

              return (
                <div className="space-y-6">
                  {/* Premium Welcome Header */}
                  <div className="p-6 rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
                    <div>
                      <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                        <Activity className="text-primary animate-pulse" size={24} />
                        Selamat Datang Kembali, <span className="text-primary">{currentUser?.nama || 'Rekan Perawat'}</span>
                      </h2>
                      <p className="text-muted-foreground text-sm mt-1">
                        Unit Kerja: <span className="font-semibold text-foreground">{currentPerawatRecord?.unit_kerja || '-'}</span> | Jabatan: <span className="font-semibold text-foreground">{currentPerawatRecord?.jabatan || '-'}</span>
                      </p>
                    </div>
                    <div className="px-4 py-2 rounded-xl bg-background/50 border border-border text-xs font-semibold text-muted-foreground flex items-center gap-1.5 shadow-sm">
                      <Shield size={14} className="text-primary" /> Perawat Klinis Dashboard
                    </div>
                  </div>

                  {/* Dynamic Nurse Metrics Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Card 1: STR */}
                    <div className="bg-card p-5 rounded-xl border border-border shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group animate-in fade-in duration-300">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider mb-1">Masa Berlaku STR</p>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${strBadge.class}`}>
                            {strBadge.label}
                          </span>
                        </div>
                        <div className="p-2.5 bg-primary/10 rounded-lg text-primary">
                          <Clock size={20} />
                        </div>
                      </div>
                      <div className="mt-4 pt-3 border-t border-border/50">
                        <p className="text-[10px] text-muted-foreground">Masa berlaku dokumen:</p>
                        <p className="text-sm font-bold text-foreground mt-0.5">
                          {strExp ? new Date(strExp).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Belum Terunggah'}
                        </p>
                      </div>
                    </div>

                    {/* Card 2: SIP */}
                    <div className="bg-card p-5 rounded-xl border border-border shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group animate-in fade-in duration-350">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider mb-1">Masa Berlaku SIP</p>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${sipBadge.class}`}>
                            {sipBadge.label}
                          </span>
                        </div>
                        <div className="p-2.5 bg-primary/10 rounded-lg text-primary">
                          <FileText size={20} />
                        </div>
                      </div>
                      <div className="mt-4 pt-3 border-t border-border/50">
                        <p className="text-[10px] text-muted-foreground">Masa berlaku dokumen:</p>
                        <p className="text-sm font-bold text-foreground mt-0.5">
                          {sipExp ? new Date(sipExp).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Belum Terunggah'}
                        </p>
                      </div>
                    </div>

                    {/* Card 3: Sertifikasi */}
                    <div className="bg-card p-5 rounded-xl border border-border shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group animate-in fade-in duration-400">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider mb-1">Status Sertifikasi</p>
                          <h3 className="text-2xl font-bold text-foreground mt-1">{myPengajuans.length} <span className="text-xs text-muted-foreground font-normal">Pengajuan</span></h3>
                        </div>
                        <div className="p-2.5 bg-primary/10 rounded-lg text-primary">
                          <Award size={20} />
                        </div>
                      </div>
                      <div className="mt-4 pt-3 border-t border-border/50 flex gap-2 justify-between text-[10px]">
                        <span className="text-yellow-500 font-semibold">{pendingCount} Pending</span>
                        <span className="text-emerald-500 font-semibold">{approvedCount} Disetujui</span>
                        <span className="text-red-500 font-semibold">{rejectedCount} Ditolak</span>
                      </div>
                    </div>

                    {/* Card 4: Berkas Pendukung */}
                    <div className="bg-card p-5 rounded-xl border border-border shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group animate-in fade-in duration-450">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider mb-1">Berkas Pendukung</p>
                          <h3 className="text-2xl font-bold text-foreground mt-1">{sertifikatDataList.length} <span className="text-xs text-muted-foreground font-normal">Sertifikat</span></h3>
                        </div>
                        <div className="p-2.5 bg-primary/10 rounded-lg text-primary">
                          <ClipboardCheck size={20} />
                        </div>
                      </div>
                      <div className="mt-4 pt-3 border-t border-border/50">
                        <p className="text-[10px] text-muted-foreground">Persyaratan portofolio asesmen</p>
                        <p className="text-[10px] text-primary hover:underline mt-0.5 cursor-pointer font-semibold" onClick={() => setActiveTab('str')}>Lihat STR & SIP Saya</p>
                      </div>
                    </div>
                  </div>

                  {/* Columns Section */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Progress Panel: 12 Competencies Completion */}
                    <div className="lg:col-span-2 bg-card rounded-xl border border-border shadow-sm p-6 space-y-6">
                      <div className="flex flex-col md:flex-row justify-between md:items-center gap-2 border-b border-border pb-4">
                        <div>
                          <h3 className="font-semibold text-lg text-foreground">Pemenuhan Kompetensi Dasar</h3>
                          <p className="text-xs text-muted-foreground mt-0.5">Pemenuhan 12 Kompetensi Dasar Klinis Keperawatan</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-lg">
                            {completedComps.length} / 12 Kompeten
                          </span>
                          <span className="text-lg font-black text-foreground">{progressPct}%</span>
                        </div>
                      </div>

                      {/* Premium Progress Bar */}
                      <div>
                        <div className="w-full bg-secondary rounded-full h-3 overflow-hidden border border-border shadow-inner">
                          <div
                            className="bg-gradient-to-r from-primary to-primary/80 rounded-full h-full transition-all duration-500 shadow-[0_0_8px_rgba(var(--primary),0.3)]"
                            style={{ width: `${progressPct}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* 12 Competencies Checklist */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                        {list12Comps.map(code => {
                          const isDone = completedComps.includes(code);
                          return (
                            <div
                              key={code}
                              className={`p-3 rounded-xl border transition-all duration-200 flex items-center justify-between gap-3 ${isDone
                                ? 'bg-emerald-500/5 border-emerald-500/20 text-foreground'
                                : 'bg-secondary/20 border-border text-muted-foreground hover:border-muted-foreground/20 hover:text-foreground'
                                }`}
                            >
                              <div className="flex items-center gap-2">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${isDone ? 'bg-emerald-500/10 text-emerald-500' : 'bg-muted text-muted-foreground'}`}>
                                  {code}
                                </span>
                                <span className="text-xs font-semibold truncate max-w-[170px]">{competencyTitles[code]}</span>
                              </div>
                              {isDone ? (
                                <CheckCircle size={16} className="text-emerald-500 flex-shrink-0 animate-in zoom-in duration-300" />
                              ) : (
                                <Lock size={12} className="text-muted-foreground/30 flex-shrink-0" />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Column 2: Reminders and Actions Panel */}
                    <div className="lg:col-span-1 bg-card rounded-xl border border-border shadow-sm flex flex-col">
                      <div className="p-5 border-b border-border flex justify-between items-center">
                        <h3 className="font-semibold text-lg text-foreground">Reminders & Panduan</h3>
                        <span className="w-2.5 h-2.5 bg-primary rounded-full animate-pulse"></span>
                      </div>
                      <div className="p-5 space-y-4 flex-1">
                        {/* Dynamic Reminders List */}
                        <div className="space-y-3">
                          {strDaysLeft !== null && strDaysLeft < 0 && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-500 flex gap-2">
                              <XCircle size={16} className="flex-shrink-0 animate-pulse" />
                              <div>
                                <strong className="block font-bold">STR Expired!</strong>
                                Dokumen STR Anda sudah melewati masa berlaku. Segera perpanjang dokumen STR Anda.
                              </div>
                            </div>
                          )}

                          {strDaysLeft !== null && strDaysLeft >= 0 && strDaysLeft <= 90 && (
                            <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-xl text-xs text-orange-500 flex gap-2">
                              <Clock size={16} className="flex-shrink-0 animate-bounce" />
                              <div>
                                <strong className="block font-bold">STR Kritis!</strong>
                                STR Anda akan habis dalam {strDaysLeft} hari. Silakan unggah STR baru.
                              </div>
                            </div>
                          )}

                          {sipDaysLeft !== null && sipDaysLeft < 0 && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-500 flex gap-2">
                              <XCircle size={16} className="flex-shrink-0 animate-pulse" />
                              <div>
                                <strong className="block font-bold">SIP Expired!</strong>
                                Dokumen SIP Anda sudah melewati masa berlaku. Segera hubungi bagian administrasi.
                              </div>
                            </div>
                          )}

                          {sipDaysLeft !== null && sipDaysLeft >= 0 && sipDaysLeft <= 90 && (
                            <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-xl text-xs text-orange-500 flex gap-2">
                              <Clock size={16} className="flex-shrink-0 animate-bounce" />
                              <div>
                                <strong className="block font-bold">SIP Kritis!</strong>
                                SIP Anda akan habis dalam {sipDaysLeft} hari. Harap bersiap untuk melakukan perpanjangan.
                              </div>
                            </div>
                          )}

                          {myPengajuans.length === 0 && (
                            <div className="p-3 bg-primary/5 border border-primary/20 rounded-xl text-xs text-muted-foreground flex gap-2 animate-pulse">
                              <Award size={16} className="text-primary flex-shrink-0" />
                              <div>
                                <strong className="block font-bold text-foreground">Sertifikasi Baru</strong>
                                Anda belum memiliki pengajuan sertifikasi aktif. Silakan masuk ke menu Sertifikasi untuk memulai pengajuan.
                              </div>
                            </div>
                          )}

                          {myPengajuans.length > 0 && pendingCount > 0 && (
                            <div className="p-3 bg-yellow-500/5 border border-yellow-500/20 rounded-xl text-xs text-muted-foreground flex gap-2">
                              <Clock size={16} className="text-yellow-500 flex-shrink-0 animate-pulse" />
                              <div>
                                <strong className="block font-bold text-foreground">Verifikasi Sedang Berjalan</strong>
                                {pendingCount} pengajuan sertifikasi Anda sedang menunggu proses verifikasi dan asesmen oleh tim Asesor.
                              </div>
                            </div>
                          )}

                          {completedComps.length < 12 && (
                            <div className="p-3 bg-secondary/30 border border-border rounded-xl text-xs text-muted-foreground flex gap-2">
                              <FileText size={16} className="text-muted-foreground flex-shrink-0" />
                              <div>
                                <strong className="block font-bold text-foreground">Lengkapi Formulir Mandiri</strong>
                                Anda baru mengisi {completedComps.length} dari 12 Kompetensi Dasar. Silakan selesaikan FORM-01 dan FORM-02 di menu Sertifikasi.
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Fast Navigation Buttons */}
                        <div className="pt-4 border-t border-border flex flex-col gap-2">
                          <button
                            onClick={() => { setActiveTab('sertifikasi'); setActivePengajuan(null); setIsCreatingPengajuan(false); }}
                            className="w-full py-2.5 bg-primary text-primary-foreground font-semibold rounded-lg text-xs hover:bg-primary/95 transition-all shadow-sm flex items-center justify-center gap-1.5"
                          >
                            <Award size={14} /> Isi Formulir Sertifikasi
                          </button>
                          <button
                            onClick={() => setActiveTab('str')}
                            className="w-full py-2.5 bg-secondary text-foreground font-semibold rounded-lg text-xs hover:bg-secondary/80 border border-border transition-all flex items-center justify-center gap-1.5"
                          >
                            <Clock size={14} /> Lihat STR & SIP Saya
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {activeTab === 'dashboard' && currentUser?.role !== 'Perawat' && (() => {
              const totalPerawatAktif = perawatData.filter(p => p.status === 'A').length;

              const today = new Date();
              const strAkanExpired = perawatData.filter(p => {
                if (p.status !== 'A') return false; // Hanya hitung untuk perawat aktif
                if (!p.masa_berlaku_str) return false;
                const diff = new Date(p.masa_berlaku_str) - today;
                const days = diff / (1000 * 60 * 60 * 24);
                return days >= 0 && days <= 90;
              }).length;

              const sertifikasiPending = pengajuanHistoryList.filter(p => p.status === 'Pending').length;
              const ujianSelesai = pengajuanHistoryList.filter(p => p.status_ujian === 'Selesai').length;

              const expiringItems = [];
              perawatData.forEach(p => {
                if (p.status !== 'A') return; // Hanya tampilkan reminder untuk perawat aktif

                if (p.masa_berlaku_str) {
                  const diff = new Date(p.masa_berlaku_str) - today;
                  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
                  if (days <= 90) {
                    expiringItems.push({ title: `STR ${p.nama}`, days, type: days < 30 ? 'urgent' : 'warning', perawat: p });
                  }
                }
                if (p.masa_berlaku_sip) {
                  const diff = new Date(p.masa_berlaku_sip) - today;
                  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
                  if (days <= 90) {
                    expiringItems.push({ title: `SIP ${p.nama}`, days, type: days < 30 ? 'urgent' : 'warning', perawat: p });
                  }
                }
              });
              expiringItems.sort((a, b) => a.days - b.days);

              return (
                <>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-bold tracking-tight">Dashboard Monitoring</h2>
                      <p className="text-muted-foreground text-sm mt-1">Overview kinerja dan status perawat secara real-time.</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
                        Unduh Laporan
                      </button>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard title="Total Perawat Aktif" value={totalPerawatAktif.toString()} icon={Users} trend="" trendUp={true} />
                    <StatCard title="STR/SIP Akan Expired" value={expiringItems.filter(e => e.days >= 0 && e.days <= 90).length.toString()} icon={Clock} trend="" trendUp={false} />
                    <StatCard title="Sertifikasi Pending" value={sertifikasiPending.toString()} icon={Award} trend="" trendUp={true} />
                    <StatCard title="Ujian Selesai" value={ujianSelesai.toString()} icon={Stethoscope} trend="" trendUp={true} />
                  </div>

                  {/* Main Sections */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Reminder Panel */}
                    <div className="lg:col-span-1 bg-card rounded-xl border border-border shadow-sm flex flex-col">
                      <div className="p-5 border-b border-border flex justify-between items-center">
                        <h3 className="font-semibold text-lg">Reminder Mendatang</h3>
                      </div>
                      <div className="flex-1 overflow-auto max-h-[400px]">
                        {expiringItems.length > 0 ? (
                          expiringItems.slice(0, 10).map((item, idx) => (
                            <ReminderItem
                              key={idx}
                              title={item.title}
                              date={item.days < 0 ? 'Sudah Expired' : `${item.days} Hari lagi`}
                              type={item.type}
                              onClickDetail={() => {
                                setSelectedPerawat(item.perawat);
                                fetchDetailData(item.perawat.id_perawat);
                                setActiveTab('detail_perawat');
                              }}
                            />
                          ))
                        ) : (
                          <div className="p-4 text-center text-sm text-muted-foreground">Tidak ada reminder.</div>
                        )}
                      </div>
                    </div>

                    {/* Status & Activities */}
                    <div className="lg:col-span-2 bg-card rounded-xl border border-border shadow-sm p-6">
                      <h3 className="font-semibold text-lg mb-6">Status Kompetensi Unit</h3>
                      <div className="space-y-6">
                        {/* Progress Bars */}
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="font-medium">IGD (Instalasi Gawat Darurat)</span>
                            <span className="text-primary font-medium">85%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div className="bg-primary rounded-full h-2 w-[85%]"></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="font-medium">ICU (Intensive Care Unit)</span>
                            <span className="text-yellow-500 font-medium">60%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div className="bg-yellow-500 rounded-full h-2 w-[60%]"></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="font-medium">Rawat Inap Bedah</span>
                            <span className="text-primary font-medium">92%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div className="bg-primary rounded-full h-2 w-[92%]"></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="font-medium">Rawat Inap Penyakit Dalam</span>
                            <span className="text-primary font-medium">78%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div className="bg-primary rounded-full h-2 w-[78%]"></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="font-medium">OK (Kamar Operasi)</span>
                            <span className="text-destructive font-medium">45%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div className="bg-destructive rounded-full h-2 w-[45%]"></div>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                </>);
            })()}

            {activeTab === 'perawat' && currentUser?.role !== 'Perawat' && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight">Data Perawat</h2>
                    <p className="text-muted-foreground text-sm mt-1">Kelola data induk tenaga keperawatan.</p>
                  </div>
                  {currentUser?.role === 'Admin' && (
                    <button onClick={() => handleOpenModal('add')} className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm">
                      + Tambah Perawat
                    </button>
                  )}
                </div>

                {/* Modern Filter & Search Bar */}
                <div className="bg-card p-4 rounded-xl border border-border shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
                  <div className="relative w-full md:max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                    <input
                      type="text"
                      placeholder="Cari nama, NIP, kontak..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="pl-9 pr-4 py-2 w-full bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                    <select
                      value={filterProfesi}
                      onChange={e => setFilterProfesi(e.target.value)}
                      className="px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <option value="">Semua Profesi</option>
                      <option value="Perawat">Perawat</option>
                      <option value="Bidan">Bidan</option>
                    </select>

                    <select
                      value={filterUnit}
                      onChange={e => setFilterUnit(e.target.value)}
                      className="px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <option value="">Semua Unit Kerja</option>
                      {unitKerjaData.map(u => (
                        <option key={u.id} value={u.nama_unit}>{u.nama_unit}</option>
                      ))}
                    </select>

                    <select
                      value={filterGrup}
                      onChange={e => setFilterGrup(e.target.value)}
                      className="px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <option value="">Semua Grup Pegawai</option>
                      {grupData.map((g, idx) => (
                        <option key={idx} value={g.nama_grup}>{g.nama_grup}</option>
                      ))}
                    </select>

                    {(searchQuery || filterProfesi || filterUnit || filterGrup) && (
                      <button
                        onClick={() => {
                          setSearchQuery('');
                          setFilterProfesi('');
                          setFilterUnit('');
                          setFilterGrup('');
                        }}
                        className="px-3 py-2 bg-destructive/10 text-destructive hover:bg-destructive hover:text-white rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5"
                      >
                        <X size={15} /> Reset
                      </button>
                    )}
                  </div>
                </div>

                <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
                        <tr>
                          <th className="px-6 py-4 font-medium">Profil</th>
                          <th className="px-6 py-4 font-medium">NIP & NIK</th>
                          <th className="px-6 py-4 font-medium">Kontak</th>
                          <th className="px-6 py-4 font-medium">Unit & Jabatan</th>
                          <th className="px-6 py-4 font-medium">Status</th>
                          <th className="px-6 py-4 font-medium text-right">Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {isLoading ? (
                          <tr><td colSpan="6" className="px-6 py-8 text-center text-muted-foreground">Memuat data...</td></tr>
                        ) : visiblePerawatData.length === 0 ? (
                          <tr><td colSpan="6" className="px-6 py-8 text-center text-muted-foreground">Belum ada data perawat di sistem.</td></tr>
                        ) : currentItemsPerawat.length === 0 ? (
                          <tr><td colSpan="6" className="px-6 py-8 text-center text-muted-foreground">Tidak ada data perawat yang cocok dengan kriteria pencarian.</td></tr>
                        ) : (
                          currentItemsPerawat.map((p, idx) => (
                            <tr key={idx} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  {p.foto ? (
                                    <img src={`${BASE_URL}/${p.foto}`} alt={p.nama} className="w-10 h-10 rounded-full object-cover border border-border" />
                                  ) : (
                                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                                      {p.nama.charAt(0)}
                                    </div>
                                  )}
                                  <div>
                                    <div className="font-medium text-foreground">{p.nama}</div>
                                    <div className="text-xs text-muted-foreground">{p.jk === 'P' ? 'Perempuan' : 'Laki-laki'}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 font-medium">
                                <div className="text-foreground font-semibold text-sm">NIP: {p.nip || '-'}</div>
                                <div className="text-[11px] text-muted-foreground font-mono">NIK: {p.nik || '-'}</div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="text-sm">{p.hp || '-'}</div>
                                <div className="text-xs text-muted-foreground">{p.email || '-'}</div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="text-sm">
                                  {p.profesi ? <span className="font-semibold text-primary">[{p.profesi}] </span> : ''}
                                  {p.unit_kerja}
                                </div>
                                <div className="text-xs text-muted-foreground">{p.jabatan}{p.pendidikan_terakhir ? ` • ${p.pendidikan_terakhir}` : ''}</div>
                                {p.grup && (
                                  <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-primary/10 text-primary border border-primary/20">
                                    {p.grup}
                                  </span>
                                )}
                              </td>
                              <td className="px-6 py-4">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${p.status === 'A' ? 'bg-green-500/10 text-green-500' : 'bg-destructive/10 text-destructive'}`}>
                                  {p.status === 'A' ? 'Aktif' : 'Nonaktif'}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center justify-end space-x-2">
                                  <button onClick={() => handleViewDetail(p)} className="p-2 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground rounded-lg transition-colors flex items-center justify-center gap-1 font-semibold text-xs px-2.5" title="Detail">
                                    <Eye size={15} /> Detail
                                  </button>
                                  {currentUser?.role === 'Admin' && (
                                    <button onClick={() => handleDelete(p.id_perawat)} className="p-2 bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground rounded-lg transition-colors flex items-center justify-center" title="Hapus">
                                      <Trash2 size={16} />
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination Controls */}
                  <div className="p-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 bg-muted/10">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="text-xs text-muted-foreground font-medium">Tampilkan</span>
                      <select
                        value={itemsPerPage}
                        onChange={e => {
                          setItemsPerPage(Number(e.target.value));
                          setCurrentPagePerawat(1);
                        }}
                        className="px-2 py-1 bg-background border border-border rounded text-xs focus:outline-none focus:ring-1 focus:ring-primary font-semibold"
                      >
                        <option value={5}>5 baris</option>
                        <option value={10}>10 baris</option>
                        <option value={25}>25 baris</option>
                        <option value={50}>50 baris</option>
                      </select>
                      <span className="text-xs text-muted-foreground font-medium">
                        Menampilkan {totalItemsPerawat > 0 ? indexOfFirstItemPerawat + 1 : 0} - {Math.min(indexOfLastItemPerawat, totalItemsPerawat)} dari {totalItemsPerawat} perawat
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setCurrentPagePerawat(p => Math.max(1, p - 1))}
                        disabled={currentPagePerawat === 1}
                        className="p-1.5 border border-border rounded-md text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-muted-foreground transition-colors"
                        title="Sebelumnya"
                      >
                        <ChevronRight size={15} className="rotate-180" />
                      </button>

                      {Array.from({ length: totalPagesPerawat }, (_, i) => i + 1).map((pageNum) => {
                        if (
                          pageNum === 1 ||
                          pageNum === totalPagesPerawat ||
                          (pageNum >= currentPagePerawat - 1 && pageNum <= currentPagePerawat + 1)
                        ) {
                          return (
                            <button
                              key={pageNum}
                              onClick={() => setCurrentPagePerawat(pageNum)}
                              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${currentPagePerawat === pageNum
                                ? 'bg-primary text-primary-foreground shadow-sm'
                                : 'hover:bg-muted text-muted-foreground hover:text-foreground border border-transparent hover:border-border'
                                }`}
                            >
                              {pageNum}
                            </button>
                          );
                        } else if (
                          (pageNum === 2 && currentPagePerawat > 3) ||
                          (pageNum === totalPagesPerawat - 1 && currentPagePerawat < totalPagesPerawat - 2)
                        ) {
                          return <span key={pageNum} className="text-muted-foreground text-xs px-0.5">...</span>;
                        }
                        return null;
                      })}

                      <button
                        onClick={() => setCurrentPagePerawat(p => Math.min(totalPagesPerawat, p + 1))}
                        disabled={currentPagePerawat === totalPagesPerawat}
                        className="p-1.5 border border-border rounded-md text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-muted-foreground transition-colors"
                        title="Selanjutnya"
                      >
                        <ChevronRight size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'str' && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight">Monitoring STR & SIP Perawat</h2>
                    <p className="text-muted-foreground text-sm mt-1">Pantau keabsahan dan masa berlaku dokumen STR (Surat Tanda Registrasi) dan SIP (Surat Izin Praktik).</p>
                  </div>
                </div>

                {/* Ringkasan Status Dokumen */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-card p-6 rounded-xl border border-border shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
                    <div>
                      <p className="text-muted-foreground text-sm font-medium">Dokumen Aktif</p>
                      <h3 className="text-3xl font-bold text-green-500">
                        {visiblePerawatData.filter(p => {
                          const today = new Date();
                          const strOk = p.masa_berlaku_str && (new Date(p.masa_berlaku_str) > today);
                          const sipOk = p.masa_berlaku_sip && (new Date(p.masa_berlaku_sip) > today);
                          return strOk && sipOk;
                        }).length}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">STR & SIP keduanya valid</p>
                    </div>
                    <div className="p-3 bg-green-500/10 rounded-lg text-green-500">
                      <Check size={24} />
                    </div>
                  </div>

                  <div className="bg-card p-6 rounded-xl border border-border shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
                    <div>
                      <p className="text-muted-foreground text-sm font-medium">Dokumen Expired</p>
                      <h3 className="text-3xl font-bold text-destructive">
                        {visiblePerawatData.filter(p => {
                          const today = new Date();
                          const strExp = p.masa_berlaku_str && (new Date(p.masa_berlaku_str) < today);
                          const sipExp = p.masa_berlaku_sip && (new Date(p.masa_berlaku_sip) < today);
                          return strExp || sipExp;
                        }).length}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">STR atau SIP kadaluarsa</p>
                    </div>
                    <div className="p-3 bg-destructive/10 rounded-lg text-destructive">
                      <XCircle size={24} />
                    </div>
                  </div>

                  <div className="bg-card p-6 rounded-xl border border-border shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
                    <div>
                      <p className="text-muted-foreground text-sm font-medium">Masa Kritis (&lt;90 Hari)</p>
                      <h3 className="text-3xl font-bold text-yellow-500">
                        {visiblePerawatData.filter(p => {
                          const today = new Date();
                          const getDays = (dateStr) => {
                            if (!dateStr) return 999;
                            const diff = new Date(dateStr) - today;
                            return Math.ceil(diff / (1000 * 60 * 60 * 24));
                          };
                          const strDays = getDays(p.masa_berlaku_str);
                          const sipDays = getDays(p.masa_berlaku_sip);
                          return (strDays >= 0 && strDays <= 90) || (sipDays >= 0 && sipDays <= 90);
                        }).length}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">Perlu perpanjangan segera</p>
                    </div>
                    <div className="p-3 bg-yellow-500/10 rounded-lg text-yellow-500">
                      <Clock size={24} />
                    </div>
                  </div>
                </div>

                {/* Modern Filter & Search Bar */}
                {currentUser?.role !== 'Perawat' && (
                  <div className="bg-card p-4 rounded-xl border border-border shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full md:max-w-xs">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                      <input
                        type="text"
                        placeholder="Cari nama, NIP, kontak..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="pl-9 pr-4 py-2 w-full bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                      />
                    </div>

                    <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                      <select
                        value={filterProfesi}
                        onChange={e => setFilterProfesi(e.target.value)}
                        className="px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <option value="">Semua Profesi</option>
                        <option value="Perawat">Perawat</option>
                        <option value="Bidan">Bidan</option>
                      </select>

                      <select
                        value={filterUnit}
                        onChange={e => setFilterUnit(e.target.value)}
                        className="px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <option value="">Semua Unit Kerja</option>
                        {unitKerjaData.map(u => (
                          <option key={u.id} value={u.nama_unit}>{u.nama_unit}</option>
                        ))}
                      </select>

                      <select
                        value={filterGrup}
                        onChange={e => setFilterGrup(e.target.value)}
                        className="px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <option value="">Semua Grup Pegawai</option>
                        {grupData.map((g, idx) => (
                          <option key={idx} value={g.nama_grup}>{g.nama_grup}</option>
                        ))}
                      </select>

                      {(searchQuery || filterProfesi || filterUnit || filterGrup) && (
                        <button
                          onClick={() => {
                            setSearchQuery('');
                            setFilterProfesi('');
                            setFilterUnit('');
                            setFilterGrup('');
                          }}
                          className="px-3 py-2 bg-destructive/10 text-destructive hover:bg-destructive hover:text-white rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5"
                        >
                          <X size={15} /> Reset
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Tabel Monitoring STR/SIP */}
                <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                  <div className="p-5 border-b border-border bg-muted/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h3 className="font-semibold text-lg text-foreground">Daftar Dokumen STR & SIP Perawat</h3>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
                        <tr>
                          <th className="px-6 py-4 font-medium">Nama Perawat</th>
                          <th className="px-6 py-4 font-medium">NIP/NIK & Unit</th>
                          <th className="px-6 py-4 font-medium">Dokumen STR</th>
                          <th className="px-6 py-4 font-medium">Dokumen SIP</th>
                          <th className="px-6 py-4 font-medium text-right">Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {isLoading ? (
                          <tr><td colSpan="5" className="px-6 py-8 text-center text-muted-foreground">Memuat data...</td></tr>
                        ) : visiblePerawatData.length === 0 ? (
                          <tr><td colSpan="5" className="px-6 py-8 text-center text-muted-foreground">Belum ada data perawat di sistem.</td></tr>
                        ) : currentItemsStr.length === 0 ? (
                          <tr><td colSpan="5" className="px-6 py-8 text-center text-muted-foreground">Tidak ada data perawat yang cocok dengan kriteria pencarian.</td></tr>
                        ) : (
                          currentItemsStr.map((p, idx) => {
                            const strStatus = getStatusDoc(p.masa_berlaku_str);
                            const sipStatus = getStatusDoc(p.masa_berlaku_sip);

                            return (
                              <tr key={idx} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-3">
                                    {p.foto ? (
                                      <img src={`${BASE_URL}/${p.foto}`} alt={p.nama} className="w-10 h-10 rounded-full object-cover border border-border" />
                                    ) : (
                                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                                        {p.nama.charAt(0)}
                                      </div>
                                    )}
                                    <div>
                                      <div className="font-medium text-foreground">{p.nama}</div>
                                      <div className="text-xs text-muted-foreground">{p.jabatan}</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="font-medium text-foreground">NIP: {p.nip || '-'}</div>
                                  <div className="text-[10px] text-muted-foreground font-mono">NIK: {p.nik || '-'}</div>
                                  <div className="text-xs text-muted-foreground mt-0.5">
                                    {p.profesi ? <span className="font-semibold text-primary">[{p.profesi}] </span> : ''}
                                    {p.unit_kerja || '-'}
                                  </div>
                                  {p.grup && (
                                    <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-primary/10 text-primary border border-primary/20">
                                      {p.grup}
                                    </span>
                                  )}
                                </td>
                                <td className="px-6 py-4">
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                      <span className="text-xs font-semibold text-muted-foreground">No:</span>
                                      <span className="font-medium text-foreground">{p.no_str || '-'}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs">
                                      <span className="text-muted-foreground">Berlaku:</span>
                                      <span className="text-foreground">{p.masa_berlaku_str || '-'}</span>
                                    </div>
                                    <div className="pt-1 flex items-center gap-2">
                                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${strStatus.class}`}>
                                        {strStatus.label}
                                      </span>
                                      {p.file_str && (
                                        <a href={`${BASE_URL}/${p.file_str}`} target="_blank" rel="noreferrer" className="text-[10px] text-primary hover:underline font-semibold flex items-center gap-0.5">
                                          📄 Lihat File
                                        </a>
                                      )}
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                      <span className="text-xs font-semibold text-muted-foreground">No:</span>
                                      <span className="font-medium text-foreground">{p.no_sip || '-'}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs">
                                      <span className="text-muted-foreground">Berlaku:</span>
                                      <span className="text-foreground">{p.masa_berlaku_sip || '-'}</span>
                                    </div>
                                    <div className="pt-1 flex items-center gap-2">
                                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${sipStatus.class}`}>
                                        {sipStatus.label}
                                      </span>
                                      {p.file_sip && (
                                        <a href={`${BASE_URL}/${p.file_sip}`} target="_blank" rel="noreferrer" className="text-[10px] text-primary hover:underline font-semibold flex items-center gap-0.5">
                                          📄 Lihat File
                                        </a>
                                      )}
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="flex items-center justify-end space-x-2">
                                    <button onClick={() => handleViewDetail(p)} className="px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground rounded-lg transition-colors text-xs font-semibold flex items-center gap-1">
                                      <Eye size={14} /> Detail Perawat
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination Controls */}
                  <div className="p-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 bg-muted/10">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="text-xs text-muted-foreground font-medium">Tampilkan</span>
                      <select
                        value={itemsPerPage}
                        onChange={e => {
                          setItemsPerPage(Number(e.target.value));
                          setCurrentPageStr(1);
                        }}
                        className="px-2 py-1 bg-background border border-border rounded text-xs focus:outline-none focus:ring-1 focus:ring-primary font-semibold"
                      >
                        <option value={5}>5 baris</option>
                        <option value={10}>10 baris</option>
                        <option value={25}>25 baris</option>
                        <option value={50}>50 baris</option>
                      </select>
                      <span className="text-xs text-muted-foreground font-medium">
                        Menampilkan {totalItemsStr > 0 ? indexOfFirstItemStr + 1 : 0} - {Math.min(indexOfLastItemStr, totalItemsStr)} dari {totalItemsStr} perawat
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setCurrentPageStr(p => Math.max(1, p - 1))}
                        disabled={currentPageStr === 1}
                        className="p-1.5 border border-border rounded-md text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-muted-foreground transition-colors"
                        title="Sebelumnya"
                      >
                        <ChevronRight size={15} className="rotate-180" />
                      </button>

                      {Array.from({ length: totalPagesStr }, (_, i) => i + 1).map((pageNum) => {
                        if (
                          pageNum === 1 ||
                          pageNum === totalPagesStr ||
                          (pageNum >= currentPageStr - 1 && pageNum <= currentPageStr + 1)
                        ) {
                          return (
                            <button
                              key={pageNum}
                              onClick={() => setCurrentPageStr(pageNum)}
                              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${currentPageStr === pageNum
                                ? 'bg-primary text-primary-foreground shadow-sm'
                                : 'hover:bg-muted text-muted-foreground hover:text-foreground border border-transparent hover:border-border'
                                }`}
                            >
                              {pageNum}
                            </button>
                          );
                        } else if (
                          (pageNum === 2 && currentPageStr > 3) ||
                          (pageNum === totalPagesStr - 1 && currentPageStr < totalPagesStr - 2)
                        ) {
                          return <span key={pageNum} className="text-muted-foreground text-xs px-0.5">...</span>;
                        }
                        return null;
                      })}

                      <button
                        onClick={() => setCurrentPageStr(p => Math.min(totalPagesStr, p + 1))}
                        disabled={currentPageStr === totalPagesStr}
                        className="p-1.5 border border-border rounded-md text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-muted-foreground transition-colors"
                        title="Selanjutnya"
                      >
                        <ChevronRight size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'master_soal' && currentUser?.role === 'Admin' && (
              <AdminSoal
                API_URL={API_URL}
                showToast={(msg, type) => setToast({ show: true, message: msg, type })}
                LIST_12_KOMPETENSI={[...LIST_12_KOMPETENSI, ...LIST_12_KOMPETENSI_KEBIDANAN]}
                SearchableSelect={SearchableSelect}
                pendidikanData={pendidikanData}
              />
            )}

            {activeTab === 'master_pejabat' && (
              <AdminPejabat API_URL={API_URL} showToast={showToast} />
            )}

            {activeTab === 'pengaturan' && currentUser?.role === 'Admin' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">Pengaturan Aplikasi</h2>
                  <p className="text-muted-foreground text-sm mt-1">Konfigurasi sistem dan preferensi pengguna.</p>
                </div>

                <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
                  <p className="text-muted-foreground">Silakan gunakan menu Data Master di sidebar untuk mengelola Unit Kerja, Jabatan, dan Kategori.</p>
                </div>
              </div>
            )}

            {activeTab === 'master_unit_kerja' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">Master Unit Kerja</h2>
                  <p className="text-muted-foreground text-sm mt-1">Kelola data referensi unit kerja di rumah sakit.</p>
                </div>

                <div className="bg-card p-6 rounded-xl border border-border shadow-sm max-w-2xl">
                  <form onSubmit={handleAddUnitKerja} className="flex gap-2 mb-6">
                    <input type="text" value={newUnitKerja} onChange={e => setNewUnitKerja(e.target.value)} placeholder="Nama Unit Kerja Baru..." className="flex-1 px-4 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                    <button type="submit" className="px-6 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">Simpan</button>
                  </form>
                  <div className="overflow-y-auto max-h-[500px] pr-2">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
                        <tr>
                          <th className="px-4 py-3 font-medium">Nama Unit Kerja</th>
                          <th className="px-4 py-3 font-medium text-right">Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {unitKerjaData.length === 0 ? (
                          <tr><td colSpan="2" className="py-8 text-center text-muted-foreground">Belum ada data unit kerja.</td></tr>
                        ) : unitKerjaData.map(u => (
                          <tr key={u.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                            <td className="py-3 px-4 font-medium">
                              {editingUnitId === u.id ? (
                                <form onSubmit={(e) => handleUpdateUnitKerja(u.id, e)} className="flex items-center gap-2">
                                  <input type="text" autoFocus value={editUnitName} onChange={e => setEditUnitName(e.target.value)} className="px-2 py-1 bg-background border border-border rounded text-sm w-full focus:outline-none focus:ring-1 focus:ring-primary" />
                                  <button type="submit" className="p-1.5 bg-green-500/10 text-green-600 hover:bg-green-500 hover:text-white rounded-md transition-colors" title="Simpan"><Check size={16} /></button>
                                  <button type="button" onClick={() => setEditingUnitId(null)} className="p-1.5 bg-muted text-muted-foreground hover:bg-muted-foreground hover:text-background rounded-md transition-colors" title="Batal"><XCircle size={16} /></button>
                                </form>
                              ) : (
                                u.nama_unit
                              )}
                            </td>
                            <td className="py-3 px-4">
                              {editingUnitId !== u.id && (
                                <div className="flex items-center justify-end space-x-2">
                                  <button onClick={() => { setEditingUnitId(u.id); setEditUnitName(u.nama_unit); }} className="p-1.5 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground rounded-md transition-colors flex items-center justify-center" title="Edit"><Edit2 size={16} /></button>
                                  <button onClick={() => handleDeleteUnitKerja(u.id)} className="p-1.5 bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground rounded-md transition-colors flex items-center justify-center" title="Hapus"><Trash2 size={16} /></button>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'master_pendidikan' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">Master Pendidikan</h2>
                  <p className="text-muted-foreground text-sm mt-1">Kelola data referensi pendidikan terakhir untuk Perawat & Bidan.</p>
                </div>

                <div className="bg-card p-6 rounded-xl border border-border shadow-sm max-w-2xl">
                  <form onSubmit={handleAddPendidikan} className="flex gap-2 mb-6">
                    <input
                      type="text"
                      value={newPendidikan}
                      onChange={e => setNewPendidikan(e.target.value)}
                      placeholder="Nama Pendidikan Baru..."
                      className="flex-1 px-4 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                      required
                    />
                    <button type="submit" className="px-6 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm">Simpan</button>
                  </form>
                  <div className="overflow-y-auto max-h-[500px] pr-2">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
                        <tr>
                          <th className="px-4 py-3 font-medium">Nama Pendidikan</th>
                          <th className="px-4 py-3 font-medium text-right">Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pendidikanData.length === 0 ? (
                          <tr><td colSpan="2" className="py-8 text-center text-muted-foreground">Belum ada data pendidikan.</td></tr>
                        ) : pendidikanData.map(p => (
                          <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                            <td className="py-3 px-4 font-medium text-foreground">
                              {editingPendidikanId === p.id ? (
                                <form onSubmit={(e) => handleUpdatePendidikan(p.id, e)} className="flex items-center gap-2">
                                  <input
                                    type="text"
                                    autoFocus
                                    value={editPendidikanName}
                                    onChange={e => setEditPendidikanName(e.target.value)}
                                    className="px-2 py-1 bg-background border border-border rounded text-sm w-full focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                                    required
                                  />
                                  <button type="submit" className="p-1.5 bg-green-500/10 text-green-600 hover:bg-green-500 hover:text-white rounded-md transition-colors" title="Simpan"><Check size={16} /></button>
                                  <button type="button" onClick={() => setEditingPendidikanId(null)} className="p-1.5 bg-muted text-muted-foreground hover:bg-muted-foreground hover:text-background rounded-md transition-colors" title="Batal"><XCircle size={16} /></button>
                                </form>
                              ) : (
                                p.nama_pendidikan
                              )}
                            </td>
                            <td className="py-3 px-4">
                              {editingPendidikanId !== p.id && (
                                <div className="flex items-center justify-end space-x-2">
                                  <button onClick={() => { setEditingPendidikanId(p.id); setEditPendidikanName(p.nama_pendidikan); }} className="p-1.5 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground rounded-md transition-colors flex items-center justify-center" title="Edit"><Edit2 size={16} /></button>
                                  <button onClick={() => handleDeletePendidikan(p.id)} className="p-1.5 bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground rounded-md transition-colors flex items-center justify-center" title="Hapus"><Trash2 size={16} /></button>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'master_jabatan' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">Master Jabatan</h2>
                  <p className="text-muted-foreground text-sm mt-1">Kelola data referensi jabatan fungsional/struktural.</p>
                </div>

                <div className="bg-card p-6 rounded-xl border border-border shadow-sm max-w-2xl">
                  <form onSubmit={handleAddJabatan} className="flex gap-2 mb-6">
                    <input type="text" value={newJabatan} onChange={e => setNewJabatan(e.target.value)} placeholder="Nama Jabatan Baru..." className="flex-1 px-4 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                    <button type="submit" className="px-6 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">Simpan</button>
                  </form>
                  <div className="overflow-y-auto max-h-[500px] pr-2">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
                        <tr>
                          <th className="px-4 py-3 font-medium">Nama Jabatan</th>
                          <th className="px-4 py-3 font-medium text-right">Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {jabatanData.length === 0 ? (
                          <tr><td colSpan="2" className="py-8 text-center text-muted-foreground">Belum ada data jabatan.</td></tr>
                        ) : jabatanData.map(j => (
                          <tr key={j.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                            <td className="py-3 px-4 font-medium">
                              {editingJabatanId === j.id ? (
                                <form onSubmit={(e) => handleUpdateJabatan(j.id, e)} className="flex items-center gap-2">
                                  <input type="text" autoFocus value={editJabatanName} onChange={e => setEditJabatanName(e.target.value)} className="px-2 py-1 bg-background border border-border rounded text-sm w-full focus:outline-none focus:ring-1 focus:ring-primary" />
                                  <button type="submit" className="p-1.5 bg-green-500/10 text-green-600 hover:bg-green-500 hover:text-white rounded-md transition-colors" title="Simpan"><Check size={16} /></button>
                                  <button type="button" onClick={() => setEditingJabatanId(null)} className="p-1.5 bg-muted text-muted-foreground hover:bg-muted-foreground hover:text-background rounded-md transition-colors" title="Batal"><XCircle size={16} /></button>
                                </form>
                              ) : (
                                j.nama_jabatan
                              )}
                            </td>
                            <td className="py-3 px-4">
                              {editingJabatanId !== j.id && (
                                <div className="flex items-center justify-end space-x-2">
                                  <button onClick={() => { setEditingJabatanId(j.id); setEditJabatanName(j.nama_jabatan); }} className="p-1.5 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground rounded-md transition-colors flex items-center justify-center" title="Edit"><Edit2 size={16} /></button>
                                  <button onClick={() => handleDeleteJabatan(j.id)} className="p-1.5 bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground rounded-md transition-colors flex items-center justify-center" title="Hapus"><Trash2 size={16} /></button>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'master_jenjang_jabatan' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-foreground">Master Jenjang Jabatan Fungsional</h2>
                  <p className="text-muted-foreground text-sm mt-1">Kelola data referensi Jenjang Jabatan Fungsional untuk Perawat & Bidan.</p>
                </div>

                <div className="bg-card p-6 rounded-xl border border-border shadow-sm max-w-4xl">
                  <form onSubmit={handleAddJenjangJabatan} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 items-end">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold text-muted-foreground uppercase">Nama Jenjang</label>
                      <input
                        type="text"
                        value={newJenjangNama}
                        onChange={e => setNewJenjangNama(e.target.value)}
                        placeholder="Contoh: Terampil, Ahli Pertama..."
                        className="px-4 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold text-muted-foreground uppercase">Kategori Pendidikan</label>
                      <select
                        value={newJenjangPendidikan}
                        onChange={e => setNewJenjangPendidikan(e.target.value)}
                        className="px-4 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                      >
                        <option value="D3">D3</option>
                        <option value="S1">S1/Ners/Keahlian</option>
                        <option value="Semua">Semua Pendidikan</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold text-muted-foreground uppercase">Profesi</label>
                      <select
                        value={newJenjangProfesi}
                        onChange={e => setNewJenjangProfesi(e.target.value)}
                        className="px-4 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                      >
                        <option value="Perawat">Perawat</option>
                        <option value="Bidan">Bidan</option>
                        <option value="Semua">Semua Profesi</option>
                      </select>
                    </div>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
                    >
                      Tambah Jenjang
                    </button>
                  </form>
                  <div className="overflow-y-auto max-h-[500px] pr-2">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
                        <tr>
                          <th className="px-4 py-3 font-medium">Nama Jenjang</th>
                          <th className="px-4 py-3 font-medium">Kategori Pendidikan</th>
                          <th className="px-4 py-3 font-medium">Profesi</th>
                          <th className="px-4 py-3 font-medium text-right">Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {jenjangJabatanData.length === 0 ? (
                          <tr><td colSpan="4" className="py-8 text-center text-muted-foreground">Belum ada data jenjang jabatan.</td></tr>
                        ) : jenjangJabatanData.map(j => (
                          <tr key={j.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                            <td className="py-3 px-4 font-medium text-foreground">
                              {editingJenjangId === j.id ? (
                                <input
                                  type="text"
                                  autoFocus
                                  value={editJenjangNama}
                                  onChange={e => setEditJenjangNama(e.target.value)}
                                  className="px-2 py-1 bg-background border border-border rounded text-sm w-full focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                                />
                              ) : (
                                j.nama_jenjang
                              )}
                            </td>
                            <td className="py-3 px-4 text-foreground">
                              {editingJenjangId === j.id ? (
                                <select
                                  value={editJenjangPendidikan}
                                  onChange={e => setEditJenjangPendidikan(e.target.value)}
                                  className="px-2 py-1 bg-background border border-border rounded text-sm w-full focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                                >
                                  <option value="D3">D3</option>
                                  <option value="S1">S1/Ners/Keahlian</option>
                                  <option value="Semua">Semua Pendidikan</option>
                                </select>
                              ) : (
                                j.kategori_pendidikan === 'S1' ? 'S1/Ners/Keahlian' : j.kategori_pendidikan
                              )}
                            </td>
                            <td className="py-3 px-4 text-foreground">
                              {editingJenjangId === j.id ? (
                                <select
                                  value={editJenjangProfesi}
                                  onChange={e => setEditJenjangProfesi(e.target.value)}
                                  className="px-2 py-1 bg-background border border-border rounded text-sm w-full focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                                >
                                  <option value="Perawat">Perawat</option>
                                  <option value="Bidan">Bidan</option>
                                  <option value="Semua">Semua Profesi</option>
                                </select>
                              ) : (
                                j.profesi
                              )}
                            </td>
                            <td className="py-3 px-4 text-right">
                              {editingJenjangId === j.id ? (
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    onClick={(e) => handleUpdateJenjangJabatan(j.id, e)}
                                    className="p-1.5 bg-green-500/10 text-green-600 hover:bg-green-500 hover:text-white rounded-md transition-colors"
                                    title="Simpan"
                                  >
                                    <Check size={16} />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setEditingJenjangId(null)}
                                    className="p-1.5 bg-muted text-muted-foreground hover:bg-muted-foreground hover:text-background rounded-md transition-colors"
                                    title="Batal"
                                  >
                                    <XCircle size={16} />
                                  </button>
                                </div>
                              ) : (
                                <div className="flex items-center justify-end space-x-2">
                                  <button
                                    onClick={() => {
                                      setEditingJenjangId(j.id);
                                      setEditJenjangNama(j.nama_jenjang);
                                      setEditJenjangPendidikan(j.kategori_pendidikan);
                                      setEditJenjangProfesi(j.profesi);
                                    }}
                                    className="p-1.5 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground rounded-md transition-colors flex items-center justify-center"
                                    title="Edit"
                                  >
                                    <Edit2 size={16} />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteJenjangJabatan(j.id)}
                                    className="p-1.5 bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground rounded-md transition-colors flex items-center justify-center"
                                    title="Hapus"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'master_kategori' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">Master Kategori</h2>
                  <p className="text-muted-foreground text-sm mt-1">Kelola data master referensi kategori (Kompetensi/Pelatihan).</p>
                </div>

                <div className="bg-card p-12 rounded-xl border border-border shadow-sm max-w-2xl flex flex-col items-center justify-center text-center">
                  <Tags size={48} className="text-muted-foreground/30 mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-1">Sedang Dalam Pengembangan</h3>
                  <p className="text-muted-foreground text-sm">Modul Master Kategori akan segera tersedia di pembaruan berikutnya.</p>
                </div>
              </div>
            )}

            {activeTab === 'perawat' && currentUser?.role === 'Perawat' && !selectedPerawat && (
              <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8 bg-card rounded-xl border border-border shadow-sm">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mb-4"></div>
                <h3 className="font-semibold text-foreground text-lg mb-1">Memuat Profil Anda...</h3>
                <p className="text-muted-foreground text-sm">Sedang mengambil data profil dari sistem keperawatan.</p>
              </div>
            )}

            {((activeTab === 'detail_perawat' && selectedPerawat) || (activeTab === 'perawat' && currentUser?.role === 'Perawat' && selectedPerawat)) && (
              <div className="space-y-6 animate-in fade-in duration-300">
                {/* Header Profile Section */}
                <div className="bg-card rounded-xl border border-border p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-6">
                    {selectedPerawat.foto ? (
                      <img
                        src={`${BASE_URL}/${selectedPerawat.foto}`}
                        alt={selectedPerawat.nama}
                        onClick={() => setPreviewPhotoUrl(`${BASE_URL}/${selectedPerawat.foto}`)}
                        className="w-20 h-20 rounded-full object-cover border-2 border-primary shadow-sm cursor-zoom-in hover:opacity-90 transition-opacity"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-3xl border-2 border-primary/50 shadow-sm">
                        {selectedPerawat.nama.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h2 className="text-2xl font-bold text-foreground">{selectedPerawat.nama}</h2>
                      <p className="text-sm text-muted-foreground font-medium mb-1.5">NIP: {selectedPerawat.nip}</p>
                      <div className="flex flex-wrap gap-2 items-center">
                        {selectedPerawat.profesi && (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                            {selectedPerawat.profesi}
                          </span>
                        )}
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                          {selectedPerawat.unit_kerja || 'Unit Kerja Belum Set'}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-500 border border-blue-500/20">
                          {selectedPerawat.jabatan || 'Jabatan Belum Set'}
                        </span>
                        {selectedPerawat.grup && (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-500 border border-purple-500/20">
                            {selectedPerawat.grup}
                          </span>
                        )}
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${selectedPerawat.status === 'A' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-destructive/10 text-destructive border border-destructive/20'}`}>
                          {selectedPerawat.status === 'A' ? 'Aktif' : 'Nonaktif'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Admin controls */}
                  <div className="flex flex-wrap items-center gap-3">
                    {currentUser?.role !== 'Perawat' && (
                      <button onClick={() => setActiveTab('perawat')} className="px-4 py-2 bg-muted text-foreground hover:bg-muted/80 rounded-lg text-sm font-medium transition-colors">
                        Kembali
                      </button>
                    )}
                    {['Admin', 'Perawat'].includes(currentUser?.role) && (
                      <>
                        <button onClick={() => handleOpenModal('edit', selectedPerawat)} className="px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-1.5">
                          <Edit2 size={16} /> Edit Profil
                        </button>
                        {currentUser?.role === 'Admin' && (
                          <button onClick={() => handleToggleStatus(selectedPerawat)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-1.5 ${selectedPerawat.status === 'A' ? 'bg-destructive/10 text-destructive hover:bg-destructive hover:text-white' : 'bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white'}`}>
                            {selectedPerawat.status === 'A' ? 'Nonaktifkan' : 'Aktifkan'}
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* Sub-tab navigation */}
                <div className="border-b border-border flex space-x-6">
                  {['profil', 'dokumen', 'kompetensi', 'riwayat_kerja', 'riwayat_pelatihan', 'dokumen_lain', 'pengaturan_akun'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveDetailTab(tab)}
                      className={`pb-3 font-semibold text-sm transition-all border-b-2 capitalize whitespace-nowrap ${activeDetailTab === tab
                        ? 'border-primary text-primary'
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                        }`}
                    >
                      {tab === 'riwayat_kerja' ? 'Riwayat Bekerja' : tab === 'riwayat_pelatihan' ? 'Riwayat Pelatihan' : tab === 'kompetensi' ? 'Riwayat Kompetensi' : tab === 'dokumen' ? 'Dokumen STR & SIP' : tab === 'dokumen_lain' ? 'Dokumen Lain' : 'Akun'}
                    </button>
                  ))}
                </div>

                {/* Tab content */}
                <div className="mt-6">
                  {/* PROFIL LENGKAP */}
                  {activeDetailTab === 'profil' && (
                    <div className="bg-card rounded-xl border border-border p-6 shadow-sm space-y-6">
                      <h3 className="font-bold text-lg text-foreground border-b border-border pb-2.5 flex items-center gap-2">
                        <Users className="text-primary" size={20} /> Biodata & Informasi Pribadi
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                        <div className="space-y-4">
                          <div className="grid grid-cols-3 py-2 border-b border-border/40">
                            <span className="font-medium text-muted-foreground">NIP</span>
                            <span className="col-span-2 text-foreground font-semibold">{selectedPerawat.nip || '-'}</span>
                          </div>
                          <div className="grid grid-cols-3 py-2 border-b border-border/40">
                            <span className="font-medium text-muted-foreground">NIK</span>
                            <span className="col-span-2 text-foreground font-semibold">{selectedPerawat.nik || '-'}</span>
                          </div>
                          <div className="grid grid-cols-3 py-2 border-b border-border/40">
                            <span className="font-medium text-muted-foreground">Nama Lengkap</span>
                            <span className="col-span-2 text-foreground font-semibold">{selectedPerawat.nama}</span>
                          </div>
                          <div className="grid grid-cols-3 py-2 border-b border-border/40">
                            <span className="font-medium text-muted-foreground">Jenis Kelamin</span>
                            <span className="col-span-2 text-foreground">{selectedPerawat.jk === 'P' ? 'Perempuan' : 'Laki-laki'}</span>
                          </div>
                          <div className="grid grid-cols-3 py-2 border-b border-border/40">
                            <span className="font-medium text-muted-foreground">Tempat Lahir</span>
                            <span className="col-span-2 text-foreground">{selectedPerawat.tempat_lahir || '-'}</span>
                          </div>
                          <div className="grid grid-cols-3 py-2 border-b border-border/40">
                            <span className="font-medium text-muted-foreground">Tanggal Lahir</span>
                            <span className="col-span-2 text-foreground">{selectedPerawat.tanggal_lahir || '-'}</span>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="grid grid-cols-3 py-2 border-b border-border/40">
                            <span className="font-medium text-muted-foreground">No. Handphone</span>
                            <span className="col-span-2 text-foreground">{selectedPerawat.hp || '-'}</span>
                          </div>
                          <div className="grid grid-cols-3 py-2 border-b border-border/40">
                            <span className="font-medium text-muted-foreground">Alamat Email</span>
                            <span className="col-span-2 text-foreground">{selectedPerawat.email || '-'}</span>
                          </div>
                          <div className="grid grid-cols-3 py-2 border-b border-border/40">
                            <span className="font-medium text-muted-foreground">Profesi</span>
                            <span className="col-span-2 text-indigo-500 font-semibold">{selectedPerawat.profesi || '-'}</span>
                          </div>
                          <div className="grid grid-cols-3 py-2 border-b border-border/40">
                            <span className="font-medium text-muted-foreground">Pendidikan Terakhir</span>
                            <span className="col-span-2 text-foreground font-semibold text-primary">{selectedPerawat.pendidikan_terakhir || '-'}</span>
                          </div>
                          <div className="grid grid-cols-3 py-2 border-b border-border/40">
                            <span className="font-medium text-muted-foreground">No. Ijazah</span>
                            <span className="col-span-2 text-foreground">{selectedPerawat.no_ijazah || '-'}</span>
                          </div>
                          <div className="grid grid-cols-3 py-2 border-b border-border/40">
                            <span className="font-medium text-muted-foreground">Grup Pegawai</span>
                            <span className="col-span-2 text-foreground font-semibold text-primary">{selectedPerawat.grup || '-'}</span>
                          </div>
                          <div className="grid grid-cols-3 py-2 border-b border-border/40">
                            <span className="font-medium text-muted-foreground">Alamat</span>
                            <span className="col-span-2 text-foreground">{selectedPerawat.alamat || '-'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* DOKUMEN STR & SIP */}
                  {activeDetailTab === 'dokumen' && (
                    <div className="space-y-6">
                      {/* Edit toggle button */}
                      <div className="flex justify-end">
                        <button
                          onClick={() => {
                            if (!isEditingStrSip) {
                              setStrSipForm({
                                no_str: selectedPerawat.no_str || '',
                                masa_berlaku_str: selectedPerawat.masa_berlaku_str || '',
                                file_str: null,
                                no_sip: selectedPerawat.no_sip || '',
                                masa_berlaku_sip: selectedPerawat.masa_berlaku_sip || '',
                                file_sip: null
                              });
                            }
                            setIsEditingStrSip(!isEditingStrSip);
                          }}
                          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${isEditingStrSip ? 'bg-muted text-foreground hover:bg-muted/80' : 'bg-primary/10 text-primary hover:bg-primary hover:text-white border border-primary/20'}`}
                        >
                          <Edit2 size={15} /> {isEditingStrSip ? 'Batal Edit' : 'Edit STR & SIP'}
                        </button>
                      </div>

                      {isEditingStrSip ? (
                        <form onSubmit={handleStrSipInlineSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* STR Edit */}
                          <div className="bg-card rounded-xl border border-primary/30 p-6 shadow-sm space-y-4">
                            <h4 className="font-bold text-base text-foreground flex items-center gap-2 border-b border-border pb-3">
                              <Award className="text-primary" size={18} /> Edit Dokumen STR
                            </h4>
                            <div className="space-y-3 text-xs">
                              <div>
                                <label className="block font-medium mb-1 text-muted-foreground">Nomor STR</label>
                                <input type="text" value={strSipForm.no_str} onChange={e => setStrSipForm({ ...strSipForm, no_str: e.target.value })} placeholder="Masukkan No. STR" className="w-full px-2.5 py-2 bg-background border border-border rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-primary" />
                              </div>
                              <div>
                                <label className="block font-medium mb-1 text-muted-foreground">Masa Berlaku STR</label>
                                <input type="date" value={strSipForm.masa_berlaku_str} onChange={e => setStrSipForm({ ...strSipForm, masa_berlaku_str: e.target.value })} className="w-full px-2.5 py-2 bg-background border border-border rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-primary" />
                              </div>
                              <div>
                                <label className="block font-medium mb-1 text-muted-foreground">Upload File STR (PDF, JPG, PNG)</label>
                                <input type="file" onChange={e => setStrSipForm({ ...strSipForm, file_str: e.target.files[0] })} accept=".pdf,.jpg,.jpeg,.png" className="w-full px-2.5 py-2 bg-background border border-border rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-primary file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-[11px] file:font-semibold file:bg-primary/10 file:text-primary" />
                              </div>
                              {selectedPerawat.file_str && <a href={`${BASE_URL}/${selectedPerawat.file_str}`} target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline font-medium">📄 File STR saat ini</a>}
                            </div>
                          </div>
                          {/* SIP Edit */}
                          <div className="bg-card rounded-xl border border-primary/30 p-6 shadow-sm space-y-4">
                            <h4 className="font-bold text-base text-foreground flex items-center gap-2 border-b border-border pb-3">
                              <Stethoscope className="text-primary" size={18} /> Edit Dokumen SIP
                            </h4>
                            <div className="space-y-3 text-xs">
                              <div>
                                <label className="block font-medium mb-1 text-muted-foreground">Nomor SIP</label>
                                <input type="text" value={strSipForm.no_sip} onChange={e => setStrSipForm({ ...strSipForm, no_sip: e.target.value })} placeholder="Masukkan No. SIP" className="w-full px-2.5 py-2 bg-background border border-border rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-primary" />
                              </div>
                              <div>
                                <label className="block font-medium mb-1 text-muted-foreground">Masa Berlaku SIP</label>
                                <input type="date" value={strSipForm.masa_berlaku_sip} onChange={e => setStrSipForm({ ...strSipForm, masa_berlaku_sip: e.target.value })} className="w-full px-2.5 py-2 bg-background border border-border rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-primary" />
                              </div>
                              <div>
                                <label className="block font-medium mb-1 text-muted-foreground">Upload File SIP (PDF, JPG, PNG)</label>
                                <input type="file" onChange={e => setStrSipForm({ ...strSipForm, file_sip: e.target.files[0] })} accept=".pdf,.jpg,.jpeg,.png" className="w-full px-2.5 py-2 bg-background border border-border rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-primary file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-[11px] file:font-semibold file:bg-primary/10 file:text-primary" />
                              </div>
                              {selectedPerawat.file_sip && <a href={`${BASE_URL}/${selectedPerawat.file_sip}`} target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline font-medium">📄 File SIP saat ini</a>}
                            </div>
                          </div>
                          <div className="md:col-span-2 flex justify-end">
                            <button type="submit" className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors shadow-sm flex items-center gap-1.5">
                              <Check size={16} /> Simpan Dokumen STR & SIP
                            </button>
                          </div>
                        </form>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* STR Card (Read-only) */}
                          <div className="bg-card rounded-xl border border-border p-6 shadow-sm flex flex-col justify-between">
                            <div>
                              <div className="flex justify-between items-start border-b border-border pb-3.5 mb-4">
                                <h4 className="font-bold text-base text-foreground flex items-center gap-2">
                                  <Award className="text-primary" size={18} /> Dokumen STR (Surat Tanda Registrasi)
                                </h4>
                                {selectedPerawat.file_str && <span className="text-[10px] bg-green-500/10 text-green-500 px-2 py-0.5 rounded-full font-medium">Terunggah</span>}
                              </div>
                              <div className="space-y-3 text-sm mb-6">
                                <div className="flex justify-between py-1 border-b border-border/30">
                                  <span className="text-muted-foreground">Nomor STR</span>
                                  <span className="font-semibold text-foreground">{selectedPerawat.no_str || '-'}</span>
                                </div>
                                <div className="flex justify-between py-1 border-b border-border/30">
                                  <span className="text-muted-foreground">Masa Berlaku</span>
                                  <span className="font-semibold text-foreground">{selectedPerawat.masa_berlaku_str || '-'}</span>
                                </div>
                                <div className="flex justify-between py-1">
                                  <span className="text-muted-foreground">Status Validitas</span>
                                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getStatusDoc(selectedPerawat.masa_berlaku_str).class}`}>
                                    {getStatusDoc(selectedPerawat.masa_berlaku_str).label}
                                  </span>
                                </div>
                              </div>
                            </div>
                            {selectedPerawat.file_str ? (
                              <a href={`${BASE_URL}/${selectedPerawat.file_str}`} target="_blank" rel="noreferrer" className="w-full text-center py-2.5 bg-primary/10 hover:bg-primary hover:text-white text-primary text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 border border-primary/20">
                                📄 Lihat Dokumen STR
                              </a>
                            ) : (
                              <div className="text-xs text-muted-foreground text-center py-4 bg-muted/30 border border-dashed border-border rounded-lg">
                                Dokumen STR belum diunggah.
                              </div>
                            )}
                          </div>

                          {/* SIP Card (Read-only) */}
                          <div className="bg-card rounded-xl border border-border p-6 shadow-sm flex flex-col justify-between">
                            <div>
                              <div className="flex justify-between items-start border-b border-border pb-3.5 mb-4">
                                <h4 className="font-bold text-base text-foreground flex items-center gap-2">
                                  <Stethoscope className="text-primary" size={18} /> Dokumen SIP (Surat Izin Praktik)
                                </h4>
                                {selectedPerawat.file_sip && <span className="text-[10px] bg-green-500/10 text-green-500 px-2 py-0.5 rounded-full font-medium">Terunggah</span>}
                              </div>
                              <div className="space-y-3 text-sm mb-6">
                                <div className="flex justify-between py-1 border-b border-border/30">
                                  <span className="text-muted-foreground">Nomor SIP</span>
                                  <span className="font-semibold text-foreground">{selectedPerawat.no_sip || '-'}</span>
                                </div>
                                <div className="flex justify-between py-1 border-b border-border/30">
                                  <span className="text-muted-foreground">Masa Berlaku</span>
                                  <span className="font-semibold text-foreground">{selectedPerawat.masa_berlaku_sip || '-'}</span>
                                </div>
                                <div className="flex justify-between py-1">
                                  <span className="text-muted-foreground">Status Validitas</span>
                                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getStatusDoc(selectedPerawat.masa_berlaku_sip).class}`}>
                                    {getStatusDoc(selectedPerawat.masa_berlaku_sip).label}
                                  </span>
                                </div>
                              </div>
                            </div>
                            {selectedPerawat.file_sip ? (
                              <a href={`${BASE_URL}/${selectedPerawat.file_sip}`} target="_blank" rel="noreferrer" className="w-full text-center py-2.5 bg-primary/10 hover:bg-primary hover:text-white text-primary text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 border border-primary/20">
                                📄 Lihat Dokumen SIP
                              </a>
                            ) : (
                              <div className="text-xs text-muted-foreground text-center py-4 bg-muted/30 border border-dashed border-border rounded-lg">
                                Dokumen SIP belum diunggah.
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* RIWAYAT KOMPETENSI */}
                  {activeDetailTab === 'kompetensi' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Competency Assessment History List */}
                      <div className={['Admin', 'Asesor', 'Perawat'].includes(currentUser?.role) ? "lg:col-span-2 bg-card rounded-xl border border-border p-6 shadow-sm space-y-4 flex flex-col" : "lg:col-span-3 bg-card rounded-xl border border-border p-6 shadow-sm space-y-4 flex flex-col"}>
                        <h3 className="font-bold text-base text-foreground border-b border-border pb-2">
                          Daftar Riwayat Asesmen Kompetensi
                        </h3>
                        <div className="overflow-x-auto flex-1">
                          <table className="w-full text-xs text-left">
                            <thead className="bg-muted/50 border-b border-border text-muted-foreground uppercase text-[10px] font-semibold">
                              <tr>
                                <th className="px-4 py-3 font-medium">Tanggal</th>
                                <th className="px-4 py-3 font-medium">Kompetensi</th>
                                <th className="px-4 py-3 font-medium">Asesor</th>
                                <th className="px-4 py-3 font-medium">Nilai</th>
                                <th className="px-4 py-3 font-medium">Status</th>
                                {['Admin', 'Asesor', 'Perawat'].includes(currentUser?.role) && (
                                  <th className="px-4 py-3 font-medium text-right">Aksi</th>
                                )}
                              </tr>
                            </thead>
                            <tbody>
                              {(() => {
                                if (assessments.length === 0) {
                                  return (
                                    <tr>
                                      <td colSpan={['Admin', 'Asesor', 'Perawat'].includes(currentUser?.role) ? "6" : "5"} className="px-4 py-8 text-center text-muted-foreground">
                                        Belum ada riwayat kompetensi keperawatan.
                                      </td>
                                    </tr>
                                  );
                                }

                                const kdAssessments = [];
                                const otherAssessments = [];

                                assessments.forEach(a => {
                                  const matchedComp = competencies.find(c => String(c.id) === String(a.id_kompetensi));
                                  if (matchedComp && matchedComp.kode_kompetensi && matchedComp.kode_kompetensi.startsWith('KD-')) {
                                    kdAssessments.push({ ...a, matchedComp });
                                  } else {
                                    otherAssessments.push({ ...a, matchedComp });
                                  }
                                });

                                const renderRow = (a, matchedComp, isSubRow = false) => (
                                  <tr key={a.id || Math.random()} className={`border-b border-border/40 last:border-0 hover:bg-muted/10 ${isSubRow ? 'bg-muted/5' : ''}`}>
                                    <td className={`px-4 py-3 font-medium text-foreground ${isSubRow ? 'pl-8' : ''}`}>{a.tanggal ? a.tanggal.split(' ')[0] : '-'}</td>
                                    <td className="px-4 py-3">
                                      <div className="font-semibold text-foreground">{matchedComp ? matchedComp.nama_kompetensi : `Kompetensi #${a.id_kompetensi}`}</div>
                                      <div className="text-[10px] text-muted-foreground">{matchedComp ? matchedComp.kode_kompetensi : '-'}</div>
                                    </td>
                                    <td className="px-4 py-3">{a.asesor || '-'}</td>
                                    <td className="px-4 py-3 font-semibold text-foreground">{a.nilai || '-'}</td>
                                    <td className="px-4 py-3">
                                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${a.status === 'Kompeten' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                                        a.status === 'Belum Kompeten' ? 'bg-destructive/10 text-destructive border border-destructive/20' :
                                          'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
                                        }`}>
                                        {a.status || 'Kompeten'}
                                      </span>
                                    </td>
                                    {['Admin', 'Asesor', 'Perawat'].includes(currentUser?.role) && (
                                      <td className="px-4 py-3 text-right">
                                        <button
                                          onClick={() => handleDeleteCompetency(a.id)}
                                          className="p-1 text-destructive hover:bg-destructive/10 rounded transition-colors"
                                          title="Hapus Asesmen"
                                        >
                                          <Trash2 size={14} />
                                        </button>
                                      </td>
                                    )}
                                  </tr>
                                );

                                const rows = [];

                                if (kdAssessments.length > 0) {
                                  const allKompeten = kdAssessments.every(a => a.status === 'Kompeten');
                                  const anyBelum = kdAssessments.some(a => a.status === 'Belum Kompeten');
                                  const groupStatus = anyBelum ? 'Belum Kompeten' : (kdAssessments.length === 12 && allKompeten ? 'Kompeten' : 'Proses');
                                  const sumNilai = kdAssessments.reduce((sum, a) => sum + (parseFloat(a.nilai) || 0), 0);
                                  const avgNilai = (sumNilai / kdAssessments.length).toFixed(1);

                                  rows.push(
                                    <React.Fragment key="kd-group">
                                      <tr className="border-b border-border/40 bg-primary/5 hover:bg-primary/10 cursor-pointer transition-colors" onClick={() => setIsKdGroupExpanded(!isKdGroupExpanded)}>
                                        <td className="px-4 py-3 font-medium text-foreground">
                                          <div className="flex items-center gap-2">
                                            {isKdGroupExpanded ? <ChevronDown size={14} className="text-primary" /> : <ChevronRight size={14} className="text-primary" />}
                                            Beragam
                                          </div>
                                        </td>
                                        <td className="px-4 py-3">
                                          <div className="font-bold text-primary">Kompetensi Dasar</div>
                                          <div className="text-[10px] text-muted-foreground">{kdAssessments.length} / 12 Unit Kompetensi Terdata</div>
                                        </td>
                                        <td className="px-4 py-3 italic text-muted-foreground">Multiple</td>
                                        <td className="px-4 py-3 font-semibold text-foreground">{avgNilai} (Rata-rata)</td>
                                        <td className="px-4 py-3">
                                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${groupStatus === 'Kompeten' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                                            groupStatus === 'Belum Kompeten' ? 'bg-destructive/10 text-destructive border border-destructive/20' :
                                              'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
                                            }`}>
                                            {groupStatus}
                                          </span>
                                        </td>
                                        {['Admin', 'Asesor', 'Perawat'].includes(currentUser?.role) && <td></td>}
                                      </tr>
                                      {isKdGroupExpanded && kdAssessments.map(a => renderRow(a, a.matchedComp, true))}
                                    </React.Fragment>
                                  );
                                }

                                otherAssessments.forEach(a => {
                                  rows.push(renderRow(a, a.matchedComp));
                                });

                                return rows;
                              })()}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Add competency history form */}
                      {['Admin', 'Asesor', 'Perawat'].includes(currentUser?.role) && (
                        <div className="bg-card rounded-xl border border-border p-6 shadow-sm space-y-4">
                          <h4 className="font-bold text-base text-foreground border-b border-border pb-2">
                            Tambah Asesmen Baru
                          </h4>
                          <form onSubmit={handleAddCompetencySubmit} className="space-y-3.5 text-xs">
                            <div>
                              <label className="block font-medium mb-1">Pilih Kompetensi</label>
                              <select
                                name="id_kompetensi"
                                value={competencyForm.id_kompetensi}
                                onChange={e => setCompetencyForm({ ...competencyForm, id_kompetensi: e.target.value })}
                                required
                                className="w-full px-2.5 py-2 bg-background border border-border rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                              >
                                <option value="">Pilih Kompetensi</option>
                                {competencies.map(c => (
                                  <option key={c.id} value={c.id}>{c.nama_kompetensi} ({c.kode_kompetensi})</option>
                                ))}
                              </select>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block font-medium mb-1">Nama Asesor</label>
                                <input
                                  type="text"
                                  value={competencyForm.asesor}
                                  onChange={e => setCompetencyForm({ ...competencyForm, asesor: e.target.value })}
                                  required
                                  placeholder="Nama Asesor"
                                  className="w-full px-2.5 py-2 bg-background border border-border rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                                />
                              </div>
                              <div>
                                <label className="block font-medium mb-1">Nilai</label>
                                <input
                                  type="number"
                                  min="0"
                                  max="100"
                                  value={competencyForm.nilai}
                                  onChange={e => setCompetencyForm({ ...competencyForm, nilai: e.target.value })}
                                  placeholder="Nilai (0-100)"
                                  className="w-full px-2.5 py-2 bg-background border border-border rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block font-medium mb-1">Status</label>
                                <select
                                  value={competencyForm.status}
                                  onChange={e => setCompetencyForm({ ...competencyForm, status: e.target.value })}
                                  className="w-full px-2.5 py-2 bg-background border border-border rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                                >
                                  <option value="Kompeten">Kompeten</option>
                                  <option value="Belum Kompeten">Belum Kompeten</option>
                                  <option value="Perlu Pembinaan">Perlu Pembinaan</option>
                                </select>
                              </div>
                              <div>
                                <label className="block font-medium mb-1">Tanggal</label>
                                <input
                                  type="date"
                                  value={competencyForm.tanggal}
                                  onChange={e => setCompetencyForm({ ...competencyForm, tanggal: e.target.value })}
                                  className="w-full px-2.5 py-2 bg-background border border-border rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block font-medium mb-1">Catatan</label>
                              <textarea
                                rows="2"
                                value={competencyForm.catatan}
                                onChange={e => setCompetencyForm({ ...competencyForm, catatan: e.target.value })}
                                placeholder="Ketik catatan di sini..."
                                className="w-full px-2.5 py-2 bg-background border border-border rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                              ></textarea>
                            </div>
                            <button type="submit" className="w-full py-2 bg-primary text-primary-foreground font-bold hover:bg-primary/95 rounded-md transition-colors shadow-sm">
                              Simpan Asesmen
                            </button>
                          </form>
                        </div>
                      )}
                    </div>
                  )}

                  {/* RIWAYAT BEKERJA */}
                  {activeDetailTab === 'riwayat_kerja' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Work history listings */}
                      <div className={['Admin', 'Asesor', 'Perawat'].includes(currentUser?.role) ? "lg:col-span-2 bg-card rounded-xl border border-border p-6 shadow-sm space-y-6 flex flex-col" : "lg:col-span-3 bg-card rounded-xl border border-border p-6 shadow-sm space-y-6 flex flex-col"}>
                        <h3 className="font-bold text-base text-foreground border-b border-border pb-2">
                          Daftar Riwayat Bekerja
                        </h3>
                        <div className="space-y-4 flex-1 overflow-y-auto max-h-[500px] pr-2">
                          {riwayatKerja.length === 0 ? (
                            <div className="text-center text-muted-foreground py-12">
                              Belum ada data riwayat bekerja.
                            </div>
                          ) : (
                            riwayatKerja.map((w, idx) => (
                              <div key={idx} className="p-4 border border-border rounded-lg bg-muted/10 space-y-2 hover:bg-muted/20 transition-colors">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h4 className="font-bold text-sm text-foreground">{w.posisi}</h4>
                                    <p className="text-xs text-primary font-medium">{w.instansi}</p>
                                  </div>
                                  <span className="text-[10px] font-semibold bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full">
                                    {w.tahun_masuk} - {w.tahun_keluar || 'Sekarang'}
                                  </span>
                                </div>
                                {w.deskripsi && (
                                  <p className="text-[11px] text-muted-foreground mt-1 line-clamp-3">{w.deskripsi}</p>
                                )}
                                <div className="flex justify-end pt-2 border-t border-border/20 mt-2">
                                  {['Admin', 'Asesor', 'Perawat'].includes(currentUser?.role) && (
                                    <button onClick={() => handleDeleteRiwayatKerja(w.id)} className="p-1.5 bg-destructive/10 text-destructive hover:bg-destructive hover:text-white rounded-lg transition-all" title="Hapus">
                                      <Trash2 size={14} />
                                    </button>
                                  )}
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>

                      {/* Add work history form */}
                      {['Admin', 'Asesor', 'Perawat'].includes(currentUser?.role) && (
                        <div className="bg-card rounded-xl border border-border p-6 shadow-sm space-y-4">
                          <h4 className="font-bold text-base text-foreground border-b border-border pb-2">
                            Tambah Riwayat Kerja
                          </h4>
                          <form onSubmit={handleAddRiwayatKerjaSubmit} className="space-y-3.5 text-xs">
                            <div>
                              <label className="block font-medium mb-1">Posisi / Jabatan</label>
                              <input
                                type="text"
                                value={riwayatKerjaForm.posisi}
                                onChange={e => setRiwayatKerjaForm({ ...riwayatKerjaForm, posisi: e.target.value })}
                                required
                                placeholder="Contoh: Perawat Pelaksana IGD"
                                className="w-full px-2.5 py-2 bg-background border border-border rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                              />
                            </div>
                            <div>
                              <label className="block font-medium mb-1">Nama Instansi / Rumah Sakit</label>
                              <input
                                type="text"
                                value={riwayatKerjaForm.instansi}
                                onChange={e => setRiwayatKerjaForm({ ...riwayatKerjaForm, instansi: e.target.value })}
                                required
                                placeholder="Contoh: RSUD Bhakti Dharma"
                                className="w-full px-2.5 py-2 bg-background border border-border rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block font-medium mb-1">Tahun Masuk</label>
                                <input
                                  type="number"
                                  min="1950"
                                  max="2100"
                                  value={riwayatKerjaForm.tahun_masuk}
                                  onChange={e => setRiwayatKerjaForm({ ...riwayatKerjaForm, tahun_masuk: e.target.value })}
                                  placeholder="Masuk (Tahun)"
                                  required
                                  className="w-full px-2.5 py-2 bg-background border border-border rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                                />
                              </div>
                              <div>
                                <label className="block font-medium mb-1">Tahun Keluar</label>
                                <input
                                  type="number"
                                  min="1950"
                                  max="2100"
                                  value={riwayatKerjaForm.tahun_keluar}
                                  onChange={e => setRiwayatKerjaForm({ ...riwayatKerjaForm, tahun_keluar: e.target.value })}
                                  placeholder="Keluar (Tahun)"
                                  className="w-full px-2.5 py-2 bg-background border border-border rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block font-medium mb-1">Deskripsi Tugas / Pekerjaan</label>
                              <textarea
                                rows="3"
                                value={riwayatKerjaForm.deskripsi}
                                onChange={e => setRiwayatKerjaForm({ ...riwayatKerjaForm, deskripsi: e.target.value })}
                                placeholder="Tulis ringkasan tugas klinis Anda..."
                                className="w-full px-2.5 py-2 bg-background border border-border rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                              ></textarea>
                            </div>
                            <button type="submit" className="w-full py-2 bg-primary text-primary-foreground font-bold hover:bg-primary/95 rounded-md transition-colors shadow-sm">
                              Simpan Riwayat Kerja
                            </button>
                          </form>
                        </div>
                      )}
                    </div>
                  )}

                  {/* RIWAYAT PELATIHAN */}
                  {activeDetailTab === 'riwayat_pelatihan' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div className={['Admin', 'Asesor', 'Perawat'].includes(currentUser?.role) ? "lg:col-span-2 bg-card rounded-xl border border-border p-6 shadow-sm space-y-6 flex flex-col" : "lg:col-span-3 bg-card rounded-xl border border-border p-6 shadow-sm space-y-6 flex flex-col"}>
                        <h3 className="font-bold text-base text-foreground border-b border-border pb-2">
                          Daftar Riwayat Pelatihan
                        </h3>
                        <div className="space-y-4 flex-1 overflow-y-auto max-h-[500px] pr-2">
                          {pelatihanList.length === 0 ? (
                            <div className="text-center text-muted-foreground py-12">
                              Belum ada riwayat pelatihan.
                            </div>
                          ) : (
                            pelatihanList.map((pel) => (
                              <div key={pel.id} className="p-4 border border-border rounded-lg bg-muted/10 space-y-3 hover:bg-muted/20 transition-all duration-200">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                                  <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-primary/10 rounded-lg text-primary">
                                      <GraduationCap size={22} />
                                    </div>
                                    <div>
                                      <h4 className="font-bold text-sm text-foreground">{pel.nama_pelatihan}</h4>
                                      <p className="text-xs text-muted-foreground font-medium mt-0.5">{pel.penyelenggara || '-'}</p>
                                    </div>
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3 border-t border-border/40 text-xs">
                                  <div>
                                    <span className="block text-muted-foreground mb-1">Mulai</span>
                                    <span className="font-medium text-foreground">{pel.tanggal_mulai || '-'}</span>
                                  </div>
                                  <div>
                                    <span className="block text-muted-foreground mb-1">Selesai</span>
                                    <span className="font-medium text-foreground">{pel.tanggal_selesai || '-'}</span>
                                  </div>
                                  <div>
                                    <span className="block text-muted-foreground mb-1">Jam/JPL</span>
                                    <span className="font-medium text-foreground">{pel.jumlah_jam ? `${pel.jumlah_jam} Jam` : '-'}</span>
                                  </div>
                                  <div>
                                    <span className="block text-muted-foreground mb-1">Sertifikat</span>
                                    <span className="font-medium text-foreground">{pel.no_sertifikat || '-'}</span>
                                  </div>
                                </div>
                                <div className="flex justify-end gap-2 pt-2">
                                  {pel.file && (
                                    <a href={`${BASE_URL}/${pel.file}`} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground rounded-lg text-xs font-semibold transition-all flex items-center gap-1">
                                      <Eye size={13} /> Lihat
                                    </a>
                                  )}
                                  {['Admin', 'Asesor', 'Perawat'].includes(currentUser?.role) && (
                                    <button onClick={() => handleDeletePelatihan(pel.id)} className="p-1.5 bg-destructive/10 text-destructive hover:bg-destructive hover:text-white rounded-lg transition-all" title="Hapus">
                                      <Trash2 size={14} />
                                    </button>
                                  )}
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>

                      {['Admin', 'Asesor', 'Perawat'].includes(currentUser?.role) && (
                        <div className="bg-card rounded-xl border border-border p-6 shadow-sm space-y-4">
                          <h4 className="font-bold text-base text-foreground border-b border-border pb-2">
                            Tambah Pelatihan Baru
                          </h4>
                          <form onSubmit={handleAddPelatihanSubmit} className="space-y-3.5 text-xs">
                            <div>
                              <label className="block font-medium mb-1 text-muted-foreground">Nama Pelatihan *</label>
                              <input type="text" value={pelatihanForm.nama_pelatihan} onChange={e => setPelatihanForm({ ...pelatihanForm, nama_pelatihan: e.target.value })} required className="w-full px-2.5 py-2 bg-background border border-border rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-primary text-foreground" />
                            </div>
                            <div>
                              <label className="block font-medium mb-1 text-muted-foreground">Penyelenggara</label>
                              <input type="text" value={pelatihanForm.penyelenggara} onChange={e => setPelatihanForm({ ...pelatihanForm, penyelenggara: e.target.value })} className="w-full px-2.5 py-2 bg-background border border-border rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-primary text-foreground" />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block font-medium mb-1 text-muted-foreground">Tgl Mulai</label>
                                <input type="date" value={pelatihanForm.tanggal_mulai} onChange={e => setPelatihanForm({ ...pelatihanForm, tanggal_mulai: e.target.value })} className="w-full px-2.5 py-2 bg-background border border-border rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-primary text-foreground" />
                              </div>
                              <div>
                                <label className="block font-medium mb-1 text-muted-foreground">Tgl Selesai</label>
                                <input type="date" value={pelatihanForm.tanggal_selesai} onChange={e => setPelatihanForm({ ...pelatihanForm, tanggal_selesai: e.target.value })} className="w-full px-2.5 py-2 bg-background border border-border rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-primary text-foreground" />
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block font-medium mb-1 text-muted-foreground">Jumlah Jam/JPL</label>
                                <input type="number" value={pelatihanForm.jumlah_jam} onChange={e => setPelatihanForm({ ...pelatihanForm, jumlah_jam: e.target.value })} className="w-full px-2.5 py-2 bg-background border border-border rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-primary text-foreground" />
                              </div>
                              <div>
                                <label className="block font-medium mb-1 text-muted-foreground">No. Sertifikat</label>
                                <input type="text" value={pelatihanForm.no_sertifikat} onChange={e => setPelatihanForm({ ...pelatihanForm, no_sertifikat: e.target.value })} className="w-full px-2.5 py-2 bg-background border border-border rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-primary text-foreground" />
                              </div>
                            </div>
                            <div>
                              <label className="block font-medium mb-1 text-muted-foreground">File Sertifikat (PDF/Img)</label>
                              <input id="pelatihan_file_input" type="file" onChange={e => setPelatihanForm({ ...pelatihanForm, file: e.target.files[0] })} accept=".pdf,.jpg,.jpeg,.png" className="w-full px-2.5 py-2 bg-background border border-border rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-primary text-foreground file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-[11px] file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
                            </div>
                            <button type="submit" className="w-full py-2 bg-primary text-primary-foreground font-bold hover:bg-primary/95 rounded-md transition-colors shadow-sm text-xs mt-2">
                              Simpan Pelatihan
                            </button>
                          </form>
                        </div>
                      )}
                    </div>
                  )}


                  {/* DOKUMEN LAINNYA */}
                  {activeDetailTab === 'dokumen_lain' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Document listing */}
                      <div className="lg:col-span-2 bg-card rounded-xl border border-border p-6 shadow-sm space-y-6 flex flex-col">
                        <h3 className="font-bold text-base text-foreground border-b border-border pb-2">
                          Daftar Dokumen Pendukung Lainnya
                        </h3>
                        <div className="space-y-4 flex-1 overflow-y-auto max-h-[500px] pr-2">
                          {sertifikatDataList.length === 0 ? (
                            <div className="text-center text-muted-foreground py-12">
                              Belum ada dokumen lain yang diunggah.
                            </div>
                          ) : (
                            sertifikatDataList.map((doc) => {
                              const docStatus = getStatusDoc(doc.tgl_expired);
                              return (
                                <div key={doc.id} className="p-4 border border-border rounded-lg bg-muted/10 space-y-2 hover:bg-muted/20 transition-all duration-200">
                                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                                    <div className="flex items-center gap-3">
                                      <div className="p-2.5 bg-primary/10 rounded-lg text-primary">
                                        <FileText size={22} />
                                      </div>
                                      <div>
                                        <h4 className="font-bold text-sm text-foreground">{doc.nama_sertifikat}</h4>
                                        <p className="text-xs text-muted-foreground font-mono mt-0.5">No: {doc.nomor || '-'}</p>
                                      </div>
                                    </div>
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${docStatus.class}`}>
                                      {docStatus.label}
                                    </span>
                                  </div>

                                  <div className="flex flex-wrap items-center justify-between gap-4 mt-3 pt-3 border-t border-border/40 text-xs">
                                    <div className="flex gap-4 text-muted-foreground">
                                      <span>Terbit: <span className="font-medium text-foreground">{doc.tgl_terbit || '-'}</span></span>
                                      <span>Masa Berlaku: <span className="font-medium text-foreground">{doc.tgl_expired || '-'}</span></span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      {doc.file && (
                                        <a
                                          href={`${BASE_URL}/${doc.file}`}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground rounded-lg text-xs font-semibold transition-all flex items-center gap-1"
                                        >
                                          <Eye size={13} /> Lihat Dokumen
                                        </a>
                                      )}
                                      <button
                                        onClick={() => handleDeleteSertifikat(doc.id)}
                                        className="p-1.5 bg-destructive/10 text-destructive hover:bg-destructive hover:text-white rounded-lg transition-all"
                                        title="Hapus Dokumen"
                                      >
                                        <Trash2 size={14} />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              );
                            })
                          )}
                        </div>
                      </div>

                      {/* Upload form */}
                      <div className="bg-card rounded-xl border border-border p-6 shadow-sm space-y-4">
                        <h4 className="font-bold text-base text-foreground border-b border-border pb-2">
                          Unggah Dokumen Baru
                        </h4>
                        <form onSubmit={handleAddSertifikatSubmit} className="space-y-3.5 text-xs">
                          <div>
                            <label className="block font-medium mb-1 text-muted-foreground">Nama Dokumen / Sertifikat</label>
                            <input
                              type="text"
                              value={sertifikatForm.nama_sertifikat}
                              onChange={e => setSertifikatForm({ ...sertifikatForm, nama_sertifikat: e.target.value })}
                              required
                              placeholder="Contoh: Sertifikat BTCLS, Ijazah Ners"
                              className="w-full px-2.5 py-2 bg-background border border-border rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                            />
                          </div>
                          <div>
                            <label className="block font-medium mb-1 text-muted-foreground">Nomor Dokumen</label>
                            <input
                              type="text"
                              value={sertifikatForm.nomor}
                              onChange={e => setSertifikatForm({ ...sertifikatForm, nomor: e.target.value })}
                              placeholder="Contoh: 123/BTCLS/2026"
                              className="w-full px-2.5 py-2 bg-background border border-border rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block font-medium mb-1 text-muted-foreground">Tanggal Terbit</label>
                              <input
                                type="date"
                                value={sertifikatForm.tgl_terbit}
                                onChange={e => setSertifikatForm({ ...sertifikatForm, tgl_terbit: e.target.value })}
                                className="w-full px-2.5 py-2 bg-background border border-border rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                              />
                            </div>
                            <div>
                              <label className="block font-medium mb-1 text-muted-foreground">Tanggal Expired</label>
                              <input
                                type="date"
                                value={sertifikatForm.tgl_expired}
                                onChange={e => setSertifikatForm({ ...sertifikatForm, tgl_expired: e.target.value })}
                                className="w-full px-2.5 py-2 bg-background border border-border rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block font-medium mb-1 text-muted-foreground">File Dokumen (PDF, JPG, PNG)</label>
                            <input
                              id="sertifikat_file_input"
                              type="file"
                              onChange={e => setSertifikatForm({ ...sertifikatForm, file: e.target.files[0] })}
                              required
                              accept=".pdf,.jpg,.jpeg,.png"
                              className="w-full px-2.5 py-2 bg-background border border-border rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-primary text-foreground file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-[11px] file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                            />
                          </div>
                          <button type="submit" className="w-full py-2 bg-primary text-primary-foreground font-bold hover:bg-primary/95 rounded-md transition-colors shadow-sm text-xs mt-2">
                            Simpan & Unggah Dokumen
                          </button>
                        </form>
                      </div>
                    </div>
                  )}

                  {/* PENGATURAN AKUN */}
                  {activeDetailTab === 'pengaturan_akun' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Form Ubah Password */}
                      <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="p-2.5 bg-primary/10 rounded-lg text-primary">
                            <Lock size={22} />
                          </div>
                          <div>
                            <h3 className="font-bold text-foreground">Ubah Kata Sandi</h3>
                            <p className="text-xs text-muted-foreground mt-0.5">Perbarui kata sandi akun Anda</p>
                          </div>
                        </div>
                        <form onSubmit={handleUbahPassword} className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">Kata Sandi Lama</label>
                            <input
                              type="password"
                              value={passwordForm.old_password}
                              onChange={e => setPasswordForm({ ...passwordForm, old_password: e.target.value })}
                              required
                              className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:ring-1 focus:ring-primary focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Kata Sandi Baru</label>
                            <input
                              type="password"
                              value={passwordForm.new_password}
                              onChange={e => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
                              required
                              minLength={6}
                              className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:ring-1 focus:ring-primary focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Konfirmasi Kata Sandi Baru</label>
                            <input
                              type="password"
                              value={passwordForm.confirm_password}
                              onChange={e => setPasswordForm({ ...passwordForm, confirm_password: e.target.value })}
                              required
                              minLength={6}
                              className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:ring-1 focus:ring-primary focus:outline-none"
                            />
                          </div>
                          <button type="submit" className="w-full py-2.5 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors mt-2">
                            Simpan Kata Sandi
                          </button>
                        </form>
                      </div>

                      {/* Form Validasi Nomor WhatsApp */}
                      <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-3">
                            <div className={`p-2.5 rounded-lg ${currentUser?.is_hp_validated ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-600'}`}>
                              {currentUser?.is_hp_validated ? <CheckCircle size={22} /> : <Activity size={22} />}
                            </div>
                            <div>
                              <h3 className="font-bold text-foreground">Validasi Nomor WhatsApp</h3>
                              <p className="text-xs text-muted-foreground mt-0.5">Untuk menerima OTP login via WhatsApp</p>
                            </div>
                          </div>
                          {currentUser?.is_hp_validated == 1 && (
                            <span className="px-2.5 py-1 bg-green-500/20 text-green-600 text-xs font-bold rounded-full border border-green-500/30">
                              Terverifikasi
                            </span>
                          )}
                        </div>

                        {!showHpOtpInput ? (
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium mb-1">Nomor WhatsApp Aktif</label>
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  value={hpForm.no_hp || currentUser?.no_hp || ''}
                                  onChange={e => setHpForm({ ...hpForm, no_hp: e.target.value })}
                                  placeholder="Cth: 081234567890"
                                  className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:ring-1 focus:ring-primary focus:outline-none"
                                />
                              </div>
                              <p className="text-[11px] text-muted-foreground mt-1.5 leading-relaxed">
                                Nomor harus aktif di WhatsApp. Kami akan mengirimkan pesan OTP Fonnte ke nomor ini untuk verifikasi.
                              </p>
                            </div>
                            <button
                              onClick={handleSendHpOtp}
                              className={`w-full py-2.5 font-semibold rounded-lg transition-colors mt-2 ${currentUser?.is_hp_validated ? 'bg-secondary text-secondary-foreground hover:bg-secondary/80' : 'bg-primary text-primary-foreground hover:bg-primary/90'}`}
                            >
                              {currentUser?.is_hp_validated ? 'Ubah & Verifikasi Ulang Nomor' : 'Kirim Kode Verifikasi'}
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                            <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
                              <p className="text-sm font-medium text-primary mb-1">Cek WhatsApp Anda</p>
                              <p className="text-xs text-muted-foreground">Kami telah mengirimkan 6 digit kode OTP ke nomor <span className="font-bold text-foreground">{hpForm.no_hp}</span></p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">Kode OTP Verifikasi</label>
                              <input
                                type="text"
                                maxLength={6}
                                value={hpForm.otp}
                                onChange={e => setHpForm({ ...hpForm, otp: e.target.value.replace(/\D/g, '') })}
                                placeholder="Masukkan 6 digit OTP"
                                className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:ring-1 focus:ring-primary focus:outline-none text-center tracking-[0.25em] font-bold text-lg"
                              />
                            </div>
                            <div className="flex gap-2 pt-2">
                              <button onClick={() => setShowHpOtpInput(false)} className="w-1/3 py-2.5 bg-secondary text-secondary-foreground font-semibold rounded-lg hover:bg-secondary/80 transition-colors">
                                Batal
                              </button>
                              <button onClick={handleVerifyHpOtp} className="w-2/3 py-2.5 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
                                <Check size={18} /> Validasi Nomor
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            {activeTab === 'pelatihan' && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight">Data Pelatihan Perawat</h2>
                    <p className="text-muted-foreground text-sm mt-1">Kelola riwayat pelatihan yang diikuti oleh perawat.</p>
                  </div>
                  {['Admin'].includes(currentUser?.role) && (
                    <button onClick={() => handleOpenPelatihanModal('add')} className="px-5 py-2.5 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-all flex items-center gap-2 shadow-sm">
                      <Plus size={18} /> Tambah Data Pelatihan
                    </button>
                  )}
                </div>

                {/* Filters */}
                <div className="bg-card p-4 rounded-xl shadow-sm border border-border flex flex-col md:flex-row gap-4 items-end">
                  <div className="w-full md:w-1/2 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <input type="text" placeholder="Cari nama perawat, pelatihan, atau penyelenggara..." value={pelatihanSearchQuery} onChange={e => setPelatihanSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" />
                  </div>
                </div>

                {/* Table */}
                <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-muted/50 border-b border-border text-muted-foreground uppercase text-xs font-semibold">
                        <tr>
                          <th className="px-6 py-4">No</th>
                          <th className="px-6 py-4">Nama Perawat</th>
                          <th className="px-6 py-4">Pelatihan</th>
                          <th className="px-6 py-4">Penyelenggara</th>
                          <th className="px-6 py-4">Tanggal</th>
                          <th className="px-6 py-4">Jam</th>
                          <th className="px-6 py-4">Sertifikat</th>
                          <th className="px-6 py-4 text-center">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {(() => {
                          const filtered = allPelatihanData.filter(p => {
                            const perawat = perawatData.find(pr => pr.id_perawat == p.id_perawat);
                            const perawatName = perawat ? perawat.nama.toLowerCase() : '';
                            const q = pelatihanSearchQuery.toLowerCase();
                            return perawatName.includes(q) || (p.nama_pelatihan || '').toLowerCase().includes(q) || (p.penyelenggara || '').toLowerCase().includes(q);
                          });
                          const startIndex = (currentPagePelatihan - 1) * itemsPerPage;
                          const currentData = filtered.slice(startIndex, startIndex + itemsPerPage);
                          const totalPages = Math.ceil(filtered.length / itemsPerPage);

                          if (filtered.length === 0) return <tr><td colSpan="8" className="px-6 py-12 text-center text-muted-foreground font-medium">Data pelatihan tidak ditemukan.</td></tr>;

                          return (
                            <>
                              {currentData.map((item, index) => {
                                const perawat = perawatData.find(pr => pr.id_perawat == item.id_perawat);
                                return (
                                  <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                                    <td className="px-6 py-4 font-medium">{startIndex + index + 1}</td>
                                    <td className="px-6 py-4">
                                      <div className="font-semibold text-foreground">{perawat ? perawat.nama : '-'}</div>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-foreground">{item.nama_pelatihan}</td>
                                    <td className="px-6 py-4">{item.penyelenggara || '-'}</td>
                                    <td className="px-6 py-4">{item.tanggal_mulai ? item.tanggal_mulai.split(' ')[0] : '-'}</td>
                                    <td className="px-6 py-4">{item.jumlah_jam ? `${item.jumlah_jam} Jam` : '-'}</td>
                                    <td className="px-6 py-4">
                                      {item.file ? (
                                        <a href={`${BASE_URL}/${item.file}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1 font-medium"><Eye size={14} /> Lihat</a>
                                      ) : (
                                        <span className="text-muted-foreground">-</span>
                                      )}
                                    </td>
                                    <td className="px-6 py-4">
                                      <div className="flex items-center justify-center gap-2">
                                        {['Admin', 'Asesor'].includes(currentUser?.role) && (
                                          <button onClick={() => handleDeletePelatihanSidebar(item.id)} className="p-1.5 text-destructive hover:bg-destructive hover:text-white rounded-md transition-colors" title="Hapus">
                                            <Trash2 size={16} />
                                          </button>
                                        )}
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })}
                              {/* Pagination */}
                              {totalPages > 1 && (
                                <tr>
                                  <td colSpan="8" className="px-6 py-4 border-t border-border">
                                    <div className="flex justify-between items-center text-sm">
                                      <span className="text-muted-foreground">
                                        Menampilkan <span className="font-medium text-foreground">{startIndex + 1}</span> - <span className="font-medium text-foreground">{Math.min(startIndex + itemsPerPage, filtered.length)}</span> dari <span className="font-medium text-foreground">{filtered.length}</span> data
                                      </span>
                                      <div className="flex gap-1">
                                        <button onClick={() => setCurrentPagePelatihan(p => Math.max(1, p - 1))} disabled={currentPagePelatihan === 1} className="p-2 rounded-lg border border-border hover:bg-muted disabled:opacity-50 transition-colors">
                                          <ChevronLeft size={16} />
                                        </button>
                                        <div className="flex items-center px-4 font-medium text-foreground">
                                          {currentPagePelatihan} / {totalPages}
                                        </div>
                                        <button onClick={() => setCurrentPagePelatihan(p => Math.min(totalPages, p + 1))} disabled={currentPagePelatihan === totalPages} className="p-2 rounded-lg border border-border hover:bg-muted disabled:opacity-50 transition-colors">
                                          <ChevronRight size={16} />
                                        </button>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </>
                          );
                        })()}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'kompetensi' && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight">Master Kompetensi</h2>
                    <p className="text-muted-foreground text-sm mt-1">Kelola data kompetensi dasar, klinis, dan khusus untuk perawat.</p>
                  </div>
                  {currentUser?.role === 'Admin' && (
                    <button onClick={() => handleOpenKompetensiModal('add')} className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
                      + Tambah Kompetensi
                    </button>
                  )}
                </div>

                {/* Modern Filter & Search Bar */}
                <div className="bg-card p-4 rounded-xl border border-border shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
                  <div className="relative w-full md:max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                    <input
                      type="text"
                      placeholder="Cari kode atau nama kompetensi..."
                      value={kompetensiSearchQuery}
                      onChange={e => setKompetensiSearchQuery(e.target.value)}
                      className="pl-9 pr-4 py-2 w-full bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                    <select
                      value={kompetensiFilterKategori}
                      onChange={e => setKompetensiFilterKategori(e.target.value)}
                      className="px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <option value="">Semua Kategori</option>
                      <option value="Kompetensi Dasar">Kompetensi Dasar</option>
                      <option value="Kompetensi Klinis (PK)">Kompetensi Klinis (PK)</option>
                      <option value="Kompetensi Khusus">Kompetensi Khusus</option>
                    </select>

                    <select
                      value={kompetensiFilterUnit}
                      onChange={e => setKompetensiFilterUnit(e.target.value)}
                      className="px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <option value="">Semua Unit Kerja</option>
                      {unitKerjaData.map(u => (
                        <option key={u.id} value={u.nama_unit}>{u.nama_unit}</option>
                      ))}
                      <option value="Keperawatan Umum">Keperawatan Umum</option>
                    </select>

                    {(kompetensiSearchQuery || kompetensiFilterKategori || kompetensiFilterUnit) && (
                      <button
                        onClick={() => {
                          setKompetensiSearchQuery('');
                          setKompetensiFilterKategori('');
                          setKompetensiFilterUnit('');
                        }}
                        className="px-3 py-2 bg-destructive/10 text-destructive hover:bg-destructive hover:text-white rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5"
                      >
                        <X size={15} /> Reset
                      </button>
                    )}
                  </div>
                </div>

                <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
                        <tr>
                          <th className="px-6 py-4 font-medium">Kode</th>
                          <th className="px-6 py-4 font-medium">Nama Kompetensi</th>
                          <th className="px-6 py-4 font-medium">Kategori</th>
                          <th className="px-6 py-4 font-medium">Unit Kerja</th>
                          {currentUser?.role === 'Admin' && <th className="px-6 py-4 font-medium text-right">Aksi</th>}
                        </tr>
                      </thead>
                      <tbody>
                        {isLoading ? (
                          <tr><td colSpan={currentUser?.role === 'Admin' ? 5 : 4} className="px-6 py-8 text-center text-muted-foreground">Memuat data...</td></tr>
                        ) : competencies.length === 0 ? (
                          <tr><td colSpan={currentUser?.role === 'Admin' ? 5 : 4} className="px-6 py-8 text-center text-muted-foreground">Belum ada data kompetensi di sistem.</td></tr>
                        ) : currentItemsKompetensi.length === 0 ? (
                          <tr><td colSpan={currentUser?.role === 'Admin' ? 5 : 4} className="px-6 py-8 text-center text-muted-foreground">Tidak ada data kompetensi yang cocok dengan kriteria pencarian.</td></tr>
                        ) : (
                          currentItemsKompetensi.map((c, idx) => (
                            <tr key={idx} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                              <td className="px-6 py-4 font-semibold text-primary">{c.kode_kompetensi}</td>
                              <td className="px-6 py-4 font-medium text-foreground">{c.nama_kompetensi}</td>
                              <td className="px-6 py-4">
                                <span className="px-2 py-0.5 rounded text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                                  {c.kategori}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-muted-foreground">{c.unit}</td>
                              {currentUser?.role === 'Admin' && (
                                <td className="px-6 py-4">
                                  <div className="flex items-center justify-end space-x-2">
                                    <button onClick={() => handleOpenKompetensiModal('edit', c)} className="p-1.5 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground rounded-md transition-colors flex items-center justify-center" title="Edit">
                                      <Edit2 size={16} />
                                    </button>
                                    <button onClick={() => handleDeleteKompetensi(c.id)} className="p-1.5 bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground rounded-md transition-colors flex items-center justify-center" title="Hapus">
                                      <Trash2 size={16} />
                                    </button>
                                  </div>
                                </td>
                              )}
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination Controls */}
                  <div className="p-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 bg-muted/10">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="text-xs text-muted-foreground font-medium">Tampilkan</span>
                      <select
                        value={itemsPerPageKompetensi}
                        onChange={e => {
                          setItemsPerPageKompetensi(Number(e.target.value));
                          setCurrentPageKompetensi(1);
                        }}
                        className="px-2 py-1 bg-background border border-border rounded text-xs focus:outline-none focus:ring-1 focus:ring-primary font-semibold"
                      >
                        <option value={5}>5 baris</option>
                        <option value={10}>10 baris</option>
                        <option value={25}>25 baris</option>
                        <option value={50}>50 baris</option>
                      </select>
                      <span className="text-xs text-muted-foreground font-medium">
                        Menampilkan {totalItemsKompetensi > 0 ? indexOfFirstItemKompetensi + 1 : 0} - {Math.min(indexOfLastItemKompetensi, totalItemsKompetensi)} dari {totalItemsKompetensi} kompetensi
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setCurrentPageKompetensi(p => Math.max(1, p - 1))}
                        disabled={currentPageKompetensi === 1}
                        className="p-1.5 border border-border rounded-md text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-muted-foreground transition-colors"
                        title="Sebelumnya"
                      >
                        <ChevronRight size={15} className="rotate-180" />
                      </button>

                      {Array.from({ length: totalPagesKompetensi }, (_, i) => i + 1).map((pageNum) => {
                        if (
                          pageNum === 1 ||
                          pageNum === totalPagesKompetensi ||
                          (pageNum >= currentPageKompetensi - 1 && pageNum <= currentPageKompetensi + 1)
                        ) {
                          return (
                            <button
                              key={pageNum}
                              onClick={() => setCurrentPageKompetensi(pageNum)}
                              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${currentPageKompetensi === pageNum
                                ? 'bg-primary text-primary-foreground shadow-sm'
                                : 'hover:bg-muted text-muted-foreground hover:text-foreground border border-transparent hover:border-border'
                                }`}
                            >
                              {pageNum}
                            </button>
                          );
                        } else if (
                          (pageNum === 2 && currentPageKompetensi > 3) ||
                          (pageNum === totalPagesKompetensi - 1 && currentPageKompetensi < totalPagesKompetensi - 2)
                        ) {
                          return <span key={pageNum} className="text-muted-foreground text-xs px-0.5">...</span>;
                        }
                        return null;
                      })}

                      <button
                        onClick={() => setCurrentPageKompetensi(p => Math.min(totalPagesKompetensi, p + 1))}
                        disabled={currentPageKompetensi === totalPagesKompetensi}
                        className="p-1.5 border border-border rounded-md text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-muted-foreground transition-colors"
                        title="Selanjutnya"
                      >
                        <ChevronRight size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'sertifikasi' && (
              <div className="space-y-6">

                {/* 1. History Landing Screen */}
                {!activePengajuan && !isCreatingPengajuan && (
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <h2 className="text-2xl font-bold tracking-tight text-foreground">Sertifikasi & Kredensial Klinis</h2>
                        <p className="text-muted-foreground text-sm mt-1">Daftar pengajuan sertifikasi kompetensi dan kredensial klinis perawat.</p>
                      </div>
                      <button
                        onClick={() => {
                          setIsCreatingPengajuan(true);
                          const isBidan = currentUser?.role === 'Perawat' && currentPerawatRecord && (
                            (currentPerawatRecord.pendidikan_terakhir || '').toLowerCase().includes('kebidanan') || 
                            (currentPerawatRecord.profesi || '').toLowerCase() === 'bidan'
                          );
                          setNewPengajuanForm({
                            jenis_sertifikasi: 'Kompetensi Dasar',
                            id_perawat: currentUser?.role === 'Perawat' ? (currentPerawatRecord?.id_perawat || '') : '',
                            detail_kompetensi: isBidan 
                              ? ['KDB-01', 'KDB-02', 'KDB-03', 'KDB-04', 'KDB-05', 'KDB-06', 'KDB-07', 'KDB-08', 'KDB-09', 'KDB-10', 'KDB-11', 'KDB-12']
                              : ['KD-01', 'KD-02', 'KD-03', 'KD-04', 'KD-05', 'KD-06', 'KD-07', 'KD-08', 'KD-09', 'KD-10', 'KD-11', 'KD-12']
                          });
                        }}
                        className="px-4 py-2.5 bg-primary text-primary-foreground hover:bg-primary/95 rounded-lg text-xs font-bold transition-all shadow-md flex items-center gap-2"
                      >
                        <UserPlus size={16} />
                        Buat Pengajuan Baru
                      </button>
                    </div>

                    {/* Stats Dashboard */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="bg-card border border-border p-5 rounded-xl shadow-sm flex items-center gap-4">
                        <div className="p-3 bg-primary/10 rounded-lg text-primary"><FileText size={20} /></div>
                        <div>
                          <p className="text-[11px] font-bold text-muted-foreground uppercase">Total Pengajuan</p>
                          <h4 className="text-xl font-bold text-foreground">
                            {currentUser?.role === 'Perawat'
                              ? pengajuanHistoryList.filter(p => currentPerawatRecord && String(p.id_perawat) === String(currentPerawatRecord.id_perawat)).length
                              : currentUser?.role === 'Asesor'
                                ? pengajuanHistoryList.filter(p => String(p.id_asesor) === String(currentUser.id) || String(p.id_asesor_pendamping) === String(currentUser.id)).length
                                : pengajuanHistoryList.length}
                          </h4>
                        </div>
                      </div>
                      <div className="bg-card border border-border p-5 rounded-xl shadow-sm flex items-center gap-4">
                        <div className="p-3 bg-yellow-500/10 rounded-lg text-yellow-500"><Clock size={20} /></div>
                        <div>
                          <p className="text-[11px] font-bold text-muted-foreground uppercase">Pending Asesmen</p>
                          <h4 className="text-xl font-bold text-foreground">
                            {currentUser?.role === 'Perawat'
                              ? pengajuanHistoryList.filter(p => currentPerawatRecord && String(p.id_perawat) === String(currentPerawatRecord.id_perawat) && p.status === 'Pending').length
                              : currentUser?.role === 'Asesor'
                                ? pengajuanHistoryList.filter(p => (String(p.id_asesor) === String(currentUser.id) || String(p.id_asesor_pendamping) === String(currentUser.id)) && p.status === 'Pending').length
                                : pengajuanHistoryList.filter(p => p.status === 'Pending').length}
                          </h4>
                        </div>
                      </div>
                      <div className="bg-card border border-border p-5 rounded-xl shadow-sm flex items-center gap-4">
                        <div className="p-3 bg-green-500/10 rounded-lg text-green-500"><CheckCircle size={20} /></div>
                        <div>
                          <p className="text-[11px] font-bold text-muted-foreground uppercase">Disetujui (Approved)</p>
                          <h4 className="text-xl font-bold text-foreground">
                            {currentUser?.role === 'Perawat'
                              ? pengajuanHistoryList.filter(p => currentPerawatRecord && String(p.id_perawat) === String(currentPerawatRecord.id_perawat) && p.status === 'Approved').length
                              : currentUser?.role === 'Asesor'
                                ? pengajuanHistoryList.filter(p => (String(p.id_asesor) === String(currentUser.id) || String(p.id_asesor_pendamping) === String(currentUser.id)) && p.status === 'Approved').length
                                : pengajuanHistoryList.filter(p => p.status === 'Approved').length}
                          </h4>
                        </div>
                      </div>
                      <div className="bg-card border border-border p-5 rounded-xl shadow-sm flex items-center gap-4">
                        <div className="p-3 bg-destructive/10 rounded-lg text-destructive"><XCircle size={20} /></div>
                        <div>
                          <p className="text-[11px] font-bold text-muted-foreground uppercase">Ditolak (Rejected)</p>
                          <h4 className="text-xl font-bold text-foreground">
                            {currentUser?.role === 'Perawat'
                              ? pengajuanHistoryList.filter(p => currentPerawatRecord && String(p.id_perawat) === String(currentPerawatRecord.id_perawat) && p.status === 'Rejected').length
                              : currentUser?.role === 'Asesor'
                                ? pengajuanHistoryList.filter(p => (String(p.id_asesor) === String(currentUser.id) || String(p.id_asesor_pendamping) === String(currentUser.id)) && p.status === 'Rejected').length
                                : pengajuanHistoryList.filter(p => p.status === 'Rejected').length}
                          </h4>
                        </div>
                      </div>
                    </div>

                    {/* Card Set Jadwal Kolektif */}
                    {selectedPengajuanIds.length > 0 && (
                      <div className="mb-4 p-5 bg-primary/5 border border-primary/20 rounded-xl flex flex-col md:flex-row md:items-end justify-between gap-4 animate-fade-in shadow-sm">
                        <div>
                          <h4 className="font-bold text-sm text-primary mb-1">Set Jadwal Kolektif</h4>
                          <p className="text-xs text-muted-foreground">{selectedPengajuanIds.length} pengajuan terpilih.</p>
                        </div>
                        <form onSubmit={handleSetJadwalKolektif} className="flex flex-wrap gap-3 items-end">
                          <div>
                            <label className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">Jadwal Mulai</label>
                            <input
                              type="datetime-local"
                              className="text-xs rounded bg-background border border-border p-2 focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                              value={kolektifJadwalMulai}
                              onChange={e => setKolektifJadwalMulai(e.target.value)}
                              required
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">Batas Akhir</label>
                            <input
                              type="datetime-local"
                              className="text-xs rounded bg-background border border-border p-2 focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                              value={kolektifBatasAkhir}
                              onChange={e => setKolektifBatasAkhir(e.target.value)}
                              required
                            />
                          </div>
                          <div className="flex gap-2">
                            <button type="submit" className="px-4 py-2.5 bg-primary text-primary-foreground font-bold rounded text-xs hover:bg-primary/95 transition shadow-sm">
                              Terapkan Jadwal
                            </button>
                            <button type="button" onClick={() => setSelectedPengajuanIds([])} className="px-3 py-2.5 bg-muted text-foreground font-bold rounded text-xs hover:bg-muted/80 transition">
                              Batal
                            </button>
                          </div>
                        </form>
                      </div>
                    )}

                    {/* History Table */}
                    <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                      <div className="p-5 border-b border-border flex justify-between items-center bg-muted/10">
                        <h3 className="font-bold text-sm text-foreground">Daftar Riwayat Pengajuan</h3>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1.5 text-xs">
                            <label className="font-semibold text-muted-foreground">Status Proses:</label>
                            <select
                              value={filterStatusProses}
                              onChange={(e) => setFilterStatusProses(e.target.value)}
                              className="px-2.5 py-1 rounded bg-background border border-border text-foreground font-bold text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                            >
                              <option value="Open">Open</option>
                              <option value="Closed">Closed</option>
                              <option value="Semua">Semua</option>
                            </select>
                          </div>
                          <span className="text-[10px] bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded font-bold font-mono">LIVE DATABASE</span>
                        </div>
                      </div>
                      <div className="overflow-x-auto">
                        {(() => {
                          let filteredList = currentUser?.role === 'Perawat'
                            ? pengajuanHistoryList.filter(p => currentPerawatRecord && String(p.id_perawat) === String(currentPerawatRecord.id_perawat))
                            : currentUser?.role === 'Asesor'
                              ? pengajuanHistoryList.filter(p => String(p.id_asesor) === String(currentUser.id) || String(p.id_asesor_pendamping) === String(currentUser.id))
                              : pengajuanHistoryList;

                          if (filterStatusProses !== 'Semua') {
                            filteredList = filteredList.filter(p => (p.status_proses || 'Open') === filterStatusProses);
                          }

                          if (currentUser?.role === 'Admin') {
                            filteredList = [...filteredList].sort((a, b) => {
                              const valA = a.id_asesor === null || a.id_asesor === undefined ? -1 : Number(a.id_asesor);
                              const valB = b.id_asesor === null || b.id_asesor === undefined ? -1 : Number(b.id_asesor);
                              if (valA !== valB) return valA - valB;
                              return Number(b.id) - Number(a.id);
                            });
                          }

                          if (filteredList.length === 0) {
                            return (
                              <div className="text-center py-16 text-muted-foreground text-sm">
                                <Award size={48} className="mx-auto text-muted-foreground/30 mb-3 animate-pulse text-primary" />
                                Belum ada riwayat pengajuan sertifikasi kompetensi.
                              </div>
                            );
                          }

                          const selectableItems = filteredList.filter(item => item.status === 'Approved' && item.status_ujian !== 'Selesai');

                          let currentAssessorGroupColorIndex = 0;
                          let lastAssessorId = undefined;

                          return (
                            <table className="w-full text-xs text-left border-collapse">
                              <thead className="bg-muted/30 border-b border-border font-bold text-muted-foreground uppercase tracking-wider">
                                <tr>
                                  {currentUser?.role !== 'Perawat' && (
                                    <th className="px-5 py-3.5 w-10 text-center">
                                      <input
                                        type="checkbox"
                                        disabled={selectableItems.length === 0}
                                        checked={selectableItems.length > 0 && selectableItems.every(item => selectedPengajuanIds.includes(item.id))}
                                        onChange={(e) => {
                                          if (e.target.checked) {
                                            setSelectedPengajuanIds(selectableItems.map(item => item.id));
                                          } else {
                                            setSelectedPengajuanIds([]);
                                          }
                                        }}
                                        className="rounded text-primary focus:ring-primary border-muted-foreground/30 w-4 h-4 cursor-pointer disabled:opacity-50"
                                      />
                                    </th>
                                  )}
                                  <th className="px-5 py-3.5 w-12 text-center">No.</th>
                                  {currentUser?.role !== 'Perawat' && <th className="px-5 py-3.5">Asesi (Perawat)</th>}
                                  <th className="px-5 py-3.5">Jenis Sertifikasi</th>
                                  <th className="px-5 py-3.5">Tanggal Pengajuan</th>
                                  <th className="px-5 py-3.5 w-40">Status</th>
                                  <th className="px-5 py-3.5">Hasil Uji Tulis</th>
                                  <th className="px-5 py-3.5">Tim Asesor</th>
                                  <th className="px-5 py-3.5 w-36 text-center">Aksi</th>
                                </tr>
                              </thead>
                              <tbody>
                                {filteredList.map((item, idx) => {
                                  const nurse = perawatData.find(p => String(p.id_perawat) === String(item.id_perawat)) || { nama: 'Nurse', nip: '-' };
                                  
                                  if (item.id_asesor !== lastAssessorId) {
                                    currentAssessorGroupColorIndex = (currentAssessorGroupColorIndex + 1) % 2;
                                    lastAssessorId = item.id_asesor;
                                  }
                                  
                                  const rowBgClass = currentUser?.role === 'Admin'
                                    ? (currentAssessorGroupColorIndex === 1 
                                        ? 'bg-primary/[0.03] dark:bg-primary/[0.015] hover:bg-primary/[0.07] border-l-2 border-l-primary/40' 
                                        : 'bg-background hover:bg-muted/10')
                                    : 'hover:bg-muted/20';

                                  return (
                                    <tr key={item.id} className={`border-b border-border transition-colors ${rowBgClass}`}>
                                      {currentUser?.role !== 'Perawat' && (
                                        <td className="px-5 py-4 text-center">
                                          {item.status === 'Approved' && item.status_ujian !== 'Selesai' ? (
                                            <input
                                              type="checkbox"
                                              checked={selectedPengajuanIds.includes(item.id)}
                                              onChange={(e) => {
                                                if (e.target.checked) {
                                                  setSelectedPengajuanIds(prev => [...prev, item.id]);
                                                } else {
                                                  setSelectedPengajuanIds(prev => prev.filter(id => id !== item.id));
                                                }
                                              }}
                                              className="rounded text-primary focus:ring-primary border-muted-foreground/30 w-4 h-4 cursor-pointer"
                                            />
                                          ) : (
                                            <span className="text-muted-foreground/30 font-bold">-</span>
                                          )}
                                        </td>
                                      )}
                                      <td className="px-5 py-4 text-center font-semibold text-muted-foreground">{idx + 1}</td>
                                      {currentUser?.role !== 'Perawat' && (
                                        <td className="px-5 py-4">
                                          <div className="font-bold text-foreground">{nurse.nama}</div>
                                          <div className="text-[10px] text-muted-foreground font-mono">NIP: {nurse.nip || '-'}</div>
                                        </td>
                                      )}
                                      <td className="px-5 py-4 font-bold text-foreground">{item.jenis_sertifikasi}</td>
                                      <td className="px-5 py-4 text-muted-foreground">{item.tanggal_pengajuan || '-'}</td>
                                      <td className="px-5 py-4">
                                        <div className="flex flex-col gap-1.5 items-start">
                                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase ${item.status === 'Approved' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                                            item.status === 'Rejected' ? 'bg-destructive/10 text-destructive border border-destructive/20' :
                                              'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
                                            }`}>
                                            {item.status || 'Pending'}
                                          </span>
                                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${item.status_proses === 'Closed' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-blue-500/10 text-blue-500 border border-blue-500/20'}`}>
                                            {item.status_proses || 'Open'}
                                          </span>
                                        </div>
                                      </td>
                                      <td className="px-5 py-4">
                                        {item.status_ujian === 'Selesai' ? (
                                          <div className="flex flex-col gap-1 items-start">
                                            <span className="font-bold text-foreground text-xs">Nilai: {item.nilai_ujian}</span>
                                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                                              parseFloat(item.nilai_ujian || '0') >= 70
                                                ? 'bg-green-500/10 text-green-500 border border-green-500/20'
                                                : 'bg-destructive/10 text-destructive border border-destructive/20'
                                            }`}>
                                              {parseFloat(item.nilai_ujian || '0') >= 70 ? 'Kompeten (K)' : 'Belum Kompeten (BK)'}
                                            </span>
                                          </div>
                                        ) : item.status_ujian === 'Sedang Dikerjakan' ? (
                                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold bg-yellow-500/10 text-yellow-600 border border-yellow-500/20 uppercase">
                                            Sedang Dikerjakan
                                          </span>
                                        ) : (
                                          <span className="text-muted-foreground italic text-xs">Belum Ujian</span>
                                        )}
                                      </td>
                                      <td className="px-5 py-4">
                                        {item.id_asesor ? (
                                          <div className="space-y-1">
                                            <div className="font-semibold text-foreground text-xs">
                                              Utama: {userData.find(u => String(u.id) === String(item.id_asesor))?.nama || '-'}
                                            </div>
                                            {item.id_asesor_pendamping && (
                                              <div className="text-[10px] text-muted-foreground">
                                                Pendamping: {userData.find(u => String(u.id) === String(item.id_asesor_pendamping))?.nama || '-'}
                                              </div>
                                            )}
                                          </div>
                                        ) : (
                                          <span className="text-muted-foreground italic text-xs">-</span>
                                        )}
                                      </td>
                                      <td className="px-5 py-4 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                          <button
                                            onClick={() => handleSelectPengajuan(item)}
                                            className="px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground font-bold rounded transition-all"
                                          >
                                            Buka Formulir
                                          </button>
                                          {currentUser?.role === 'Admin' && (
                                            <>
                                              <button
                                                onClick={() => {
                                                  setActivePengajuan(item);
                                                  setSelectedAssessorId(item.id_asesor || '');
                                                  setSelectedCoAssessorId(item.id_asesor_pendamping || '');
                                                  setIsAssessorModalOpen(true);
                                                }}
                                                className="px-3 py-1.5 bg-blue-500/10 text-blue-600 hover:bg-blue-500 hover:text-white font-bold rounded transition-all"
                                                title="Ubah Asesor"
                                              >
                                                Ubah Asesor
                                              </button>
                                              <button
                                                onClick={() => handleDeletePengajuan(item.id)}
                                                className="p-1.5 bg-destructive/10 text-destructive hover:bg-destructive hover:text-white rounded transition-all"
                                                title="Hapus Pengajuan"
                                              >
                                                <Trash2 size={13} />
                                              </button>
                                            </>
                                          )}
                                        </div>
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. Creation Panel (FORM-01) */}
                {isCreatingPengajuan && (
                  <div className="bg-card p-6 rounded-xl border border-border shadow-sm space-y-6">
                    <div className="flex items-center justify-between border-b border-border pb-4">
                      <div>
                        <h2 className="text-xl font-bold text-foreground">Formulir Pengajuan Sertifikasi Baru (FORM-01)</h2>
                        <p className="text-xs text-muted-foreground mt-0.5">Lengkapi formulir permohonan sertifikasi kompetensi klinis Anda.</p>
                      </div>
                      <button
                        onClick={() => setIsCreatingPengajuan(false)}
                        className="px-3 py-1.5 bg-secondary text-foreground hover:bg-secondary/80 rounded-lg text-xs font-semibold transition-all border border-border"
                      >
                        Kembali ke Riwayat
                      </button>
                    </div>

                    <form onSubmit={handleCreatePengajuanSubmit} className="space-y-6 text-xs">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Left column: metadata */}
                        <div className="space-y-4">
                          <div>
                            <label className="block font-bold text-muted-foreground mb-1 uppercase tracking-wide">Pilih Perawat (Asesi)</label>
                            {currentUser?.role === 'Perawat' ? (
                              <div className="p-3 bg-secondary/40 border border-border rounded-lg text-foreground font-bold flex items-center gap-2">
                                <Users size={16} className="text-primary" />
                                <span>{currentPerawatRecord?.nama} (NIP: {currentPerawatRecord?.nip || '-'})</span>
                              </div>
                            ) : (
                              <select
                                required
                                value={newPengajuanForm.id_perawat}
                                onChange={e => {
                                  const pId = e.target.value;
                                  const nurse = perawatData.find(p => String(p.id_perawat) === String(pId));
                                  const isBidan = nurse && (
                                    (nurse.pendidikan_terakhir || '').toLowerCase().includes('kebidanan') || 
                                    (nurse.profesi || '').toLowerCase() === 'bidan'
                                  );
                                  let comps = newPengajuanForm.detail_kompetensi;
                                  if (newPengajuanForm.jenis_sertifikasi === 'Kompetensi Dasar') {
                                    comps = isBidan 
                                      ? ['KDB-01', 'KDB-02', 'KDB-03', 'KDB-04', 'KDB-05', 'KDB-06', 'KDB-07', 'KDB-08', 'KDB-09', 'KDB-10', 'KDB-11', 'KDB-12']
                                      : ['KD-01', 'KD-02', 'KD-03', 'KD-04', 'KD-05', 'KD-06', 'KD-07', 'KD-08', 'KD-09', 'KD-10', 'KD-11', 'KD-12'];
                                  }
                                  setNewPengajuanForm({
                                    ...newPengajuanForm,
                                    id_perawat: pId,
                                    detail_kompetensi: comps
                                  });
                                }}
                                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-xs font-semibold"
                              >
                                <option value="">-- Pilih Perawat --</option>
                                {perawatData.map(p => (
                                  <option key={p.id_perawat} value={p.id_perawat}>{p.nama} (NIP: {p.nip || '-'})</option>
                                ))}
                              </select>
                            )}
                          </div>
 
                          <div>
                            <label className="block font-bold text-muted-foreground mb-1 uppercase tracking-wide">Jenis Sertifikasi</label>
                            <select
                              value={newPengajuanForm.jenis_sertifikasi}
                              onChange={e => {
                                const jenis = e.target.value;
                                let comps = [];
                                if (jenis === 'Kompetensi Dasar') {
                                  const targetId = currentUser?.role === 'Perawat' ? (currentPerawatRecord?.id_perawat) : newPengajuanForm.id_perawat;
                                  const nurse = perawatData.find(p => String(p.id_perawat) === String(targetId));
                                  const isBidan = nurse && (
                                    (nurse.pendidikan_terakhir || '').toLowerCase().includes('kebidanan') || 
                                    (nurse.profesi || '').toLowerCase() === 'bidan'
                                  );
                                  comps = isBidan 
                                    ? ['KDB-01', 'KDB-02', 'KDB-03', 'KDB-04', 'KDB-05', 'KDB-06', 'KDB-07', 'KDB-08', 'KDB-09', 'KDB-10', 'KDB-11', 'KDB-12']
                                    : ['KD-01', 'KD-02', 'KD-03', 'KD-04', 'KD-05', 'KD-06', 'KD-07', 'KD-08', 'KD-09', 'KD-10', 'KD-11', 'KD-12'];
                                }
                                setNewPengajuanForm({
                                  ...newPengajuanForm,
                                  jenis_sertifikasi: jenis,
                                  detail_kompetensi: comps
                                });
                              }}
                              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-xs font-semibold"
                            >
                              <option value="Kompetensi Dasar">Kompetensi Dasar (12 Kompetensi)</option>
                              <option value="Kompetensi Khusus">Kompetensi Khusus Klinis</option>
                              <option value="Kredensial Baru">Kredensial Baru</option>
                              <option value="Kredensial Ulang">Kredensial Ulang</option>
                            </select>
                          </div>
 
                          <div>
                            <label className="block font-bold text-muted-foreground mb-1 uppercase tracking-wide">Unggah Dokumen Pendukung Baru (Opsional)</label>
                            <input
                              type="file"
                              onChange={e => setNewPengajuanFile(e.target.files[0])}
                              accept=".pdf,.jpg,.jpeg,.png"
                              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-primary/10 file:text-primary file:text-[10px] file:font-bold hover:file:bg-primary/20"
                            />
                            <p className="text-[10px] text-muted-foreground mt-1">Gunakan ini jika ingin melampirkan berkas PDF khusus pengajuan ini.</p>
                            {['Kredensial Baru', 'Kredensial Ulang'].includes(newPengajuanForm.jenis_sertifikasi) && (
                              <div className="mt-2.5 p-3 rounded-lg border border-primary/20 bg-primary/5 text-xs text-foreground font-sans space-y-1">
                                <p className="font-semibold text-primary">Form Permohonan Kredensial:</p>
                                <p className="text-muted-foreground text-[10px]">Silakan unduh template form permohonan kredensial di bawah ini, isi data Anda, dan unggah berkas yang telah ditandatangani.</p>
                                <a 
                                  href={`${BASE_URL}/uploads/form_permohonan_kredensial.md`} 
                                  download="form_permohonan_kredensial.md"
                                  className="inline-flex items-center gap-1 text-primary hover:underline font-bold mt-1 text-[11px]"
                                >
                                  Unduh Template Form (.md)
                                </a>
                              </div>
                            )}
                          </div>
                        </div>
 
                        {/* Right column: checkmarks / warnings */}
                        <div className="space-y-4">
                          <div>
                            <label className="block font-bold text-muted-foreground mb-2 uppercase tracking-wide">Pilih Unit Kompetensi Yang Diajukan</label>
                            {(() => {
                              const targetId = currentUser?.role === 'Perawat' ? (currentPerawatRecord?.id_perawat) : newPengajuanForm.id_perawat;
                              const selectedNurse = perawatData.find(p => String(p.id_perawat) === String(targetId));
                              const isBidan = selectedNurse && (
                                (selectedNurse.pendidikan_terakhir || '').toLowerCase().includes('kebidanan') || 
                                (selectedNurse.profesi || '').toLowerCase() === 'bidan'
                              );
                              const list12 = isBidan ? LIST_12_KOMPETENSI_KEBIDANAN : LIST_12_KOMPETENSI;
                              const labelText = isBidan ? "Kebidanan" : "Keperawatan";
 
                              if (newPengajuanForm.jenis_sertifikasi === 'Kompetensi Dasar') {
                                return (
                                  <div className="p-4 bg-muted/20 border border-border rounded-xl space-y-2">
                                    <p className="font-bold text-primary mb-1">Membundel 12 Kompetensi Dasar {labelText}:</p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 text-[11px] font-semibold text-foreground">
                                      {list12.map(k => (
                                        <div key={k.kode} className="flex items-center gap-1.5">
                                          <CheckCircle size={13} className="text-green-500" />
                                          <span>{k.kode} - {k.judul.substring(0, 30)}...</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                );
                              } else {
                                return (
                                  <div className="p-4 bg-muted/20 border border-border rounded-xl space-y-2 max-h-56 overflow-y-auto pr-2">
                                    <p className="text-muted-foreground font-bold mb-2">Pilih unit kompetensi klinis:</p>
                                    {[
                                      ...list12,
                                      ...competencies.filter(c => !list12.some(k => k.kode === (c.kode_kompetensi || c.kode)))
                                        .map(c => ({ kode: c.kode_kompetensi || c.kode, judul: c.nama_kompetensi || c.nama }))
                                    ].map(k => {
                                      const isChecked = newPengajuanForm.detail_kompetensi.includes(k.kode);
                                      return (
                                        <label key={k.kode} className="flex items-start gap-2.5 p-2 rounded border border-border bg-background hover:bg-muted/10 cursor-pointer">
                                          <input
                                            type="checkbox"
                                            checked={isChecked}
                                            onChange={e => {
                                              let updated = [...newPengajuanForm.detail_kompetensi];
                                              if (e.target.checked) {
                                                if (!updated.includes(k.kode)) updated.push(k.kode);
                                              } else {
                                                updated = updated.filter(code => code !== k.kode);
                                              }
                                              setNewPengajuanForm({ ...newPengajuanForm, detail_kompetensi: updated });
                                            }}
                                            className="rounded border-border text-primary focus:ring-primary mt-0.5"
                                          />
                                          <div>
                                            <span className="font-bold text-foreground">{k.kode}</span>
                                            <p className="text-[10px] text-muted-foreground mt-0.5">{k.judul}</p>
                                          </div>
                                        </label>
                                      );
                                    })}
                                  </div>
                                );
                              }
                            })()}
                          </div>
                        </div>
                      </div>

                      {/* Documents verification card */}
                      {(() => {
                        const nurseId = currentUser?.role === 'Perawat' ? (currentPerawatRecord?.id_perawat) : newPengajuanForm.id_perawat;
                        const nurse = perawatData.find(p => String(p.id_perawat) === String(nurseId));

                        if (!nurse) return null;

                        return (
                          <div className="bg-muted/20 border border-border p-5 rounded-xl space-y-3.5">
                            <h4 className="font-bold text-xs text-foreground uppercase tracking-wide border-b border-border pb-1.5">Verifikasi Kelengkapan Dokumen Profil Perawat</h4>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              {/* STR Document Check */}
                              <div className="p-3 rounded-lg bg-background border border-border flex flex-col justify-between min-h-[90px]">
                                <div className="flex justify-between items-start gap-2">
                                  <div>
                                    <span className="font-bold text-[11px] text-foreground">Dokumen Surat Tanda Registrasi (STR)</span>
                                    <p className="text-[10px] text-muted-foreground mt-0.5">
                                      {nurse.no_str ? `No: ${nurse.no_str}` : "Belum diisi"}
                                    </p>
                                  </div>
                                  {nurse.file_str ? (
                                    <span className="text-[10px] px-2 py-0.5 bg-green-500/10 text-green-500 border border-green-500/20 rounded font-semibold uppercase">Tersedia</span>
                                  ) : (
                                    <span className="text-[10px] px-2 py-0.5 bg-destructive/10 text-destructive border border-destructive/20 rounded font-semibold uppercase animate-pulse">Kosong</span>
                                  )}
                                </div>
                                {nurse.file_str ? (
                                  <a
                                    href={`${BASE_URL}/${nurse.file_str}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-primary hover:underline font-bold mt-2 flex items-center gap-1"
                                  >
                                    <Eye size={12} /> Lihat File STR
                                  </a>
                                ) : (
                                  <p className="text-[10px] text-destructive italic mt-2 font-medium">STR belum diunggah. Silakan lengkapi di menu Data Perawat &rarr; STR &amp; SIP.</p>
                                )}
                              </div>

                              {/* SIP Document Check */}
                              <div className="p-3 rounded-lg bg-background border border-border flex flex-col justify-between min-h-[90px]">
                                <div className="flex justify-between items-start gap-2">
                                  <div>
                                    <span className="font-bold text-[11px] text-foreground">Dokumen Surat Izin Praktik (SIP)</span>
                                    <p className="text-[10px] text-muted-foreground mt-0.5">
                                      {nurse.no_sip ? `No: ${nurse.no_sip}` : "Belum diisi"}
                                    </p>
                                  </div>
                                  {nurse.file_sip ? (
                                    <span className="text-[10px] px-2 py-0.5 bg-green-500/10 text-green-500 border border-green-500/20 rounded font-semibold uppercase">Tersedia</span>
                                  ) : (
                                    <span className="text-[10px] px-2 py-0.5 bg-destructive/10 text-destructive border border-destructive/20 rounded font-semibold uppercase animate-pulse">Kosong</span>
                                  )}
                                </div>
                                {nurse.file_sip ? (
                                  <a
                                    href={`${BASE_URL}/${nurse.file_sip}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-primary hover:underline font-bold mt-2 flex items-center gap-1"
                                  >
                                    <Eye size={12} /> Lihat File SIP
                                  </a>
                                ) : (
                                  <p className="text-[10px] text-destructive italic mt-2 font-medium">SIP belum diunggah. Silakan lengkapi di menu Data Perawat &rarr; STR &amp; SIP.</p>
                                )}
                              </div>

                              {/* Other Documents & Trainings Check */}
                              <div className="p-3 rounded-lg bg-background border border-border flex flex-col justify-between min-h-[90px]">
                                <div className="flex justify-between items-start gap-2">
                                  <div>
                                    <span className="font-bold text-[11px] text-foreground">Sertifikat &amp; Pelatihan Lainnya</span>
                                    <p className="text-[10px] text-muted-foreground mt-0.5">
                                      Terunggah di profil perawat
                                    </p>
                                  </div>
                                  <span className="text-[10px] px-2 py-0.5 bg-indigo-500/10 text-indigo-600 border border-indigo-500/20 rounded font-semibold uppercase">
                                    {(activeNurseCertificates?.length || 0) + (activeNursePelatihan?.length || 0)} File
                                  </span>
                                </div>
                                <div className="space-y-1.5 mt-2 max-h-[70px] overflow-y-auto pr-1">
                                  {activeNurseCertificates.map((doc, idx) => (
                                    <div key={`cert-cr-${idx}`} className="flex justify-between items-center text-[9px] py-0.5 border-b border-border/40 last:border-0 gap-2">
                                      <span className="truncate flex-grow font-medium text-foreground text-left">{doc.nama_sertifikat}</span>
                                      {doc.file ? (
                                        <a href={`${BASE_URL}/${doc.file}`} target="_blank" rel="noreferrer" className="text-primary hover:underline font-bold shrink-0">Buka</a>
                                      ) : (
                                        <span className="text-muted-foreground text-[8px] shrink-0">No File</span>
                                      )}
                                    </div>
                                  ))}
                                  {activeNursePelatihan.map((train, idx) => (
                                    <div key={`train-cr-${idx}`} className="flex justify-between items-center text-[9px] py-0.5 border-b border-border/40 last:border-0 gap-2">
                                      <span className="truncate flex-grow font-medium text-foreground text-left">{train.nama_pelatihan}</span>
                                      {train.file ? (
                                        <a href={`${BASE_URL}/${train.file}`} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline font-bold shrink-0">Buka</a>
                                      ) : (
                                        <span className="text-muted-foreground text-[8px] shrink-0">No File</span>
                                      )}
                                    </div>
                                  ))}
                                  {activeNurseCertificates.length === 0 && activeNursePelatihan.length === 0 && (
                                    <span className="text-[9px] text-muted-foreground italic">Belum ada file lain</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })()}

                      <div className="pt-4 border-t border-border flex justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => setIsCreatingPengajuan(false)}
                          className="px-5 py-2 bg-secondary text-foreground font-bold hover:bg-secondary/80 rounded-lg transition-colors border border-border"
                        >
                          Batal
                        </button>
                        <button
                          type="submit"
                          disabled={isSubmittingPengajuan}
                          className="px-5 py-2 bg-primary text-primary-foreground font-bold hover:bg-primary/95 rounded-lg transition-all shadow-md"
                        >
                          {isSubmittingPengajuan ? "Sedang Mengirim..." : "Kirim Pengajuan (Submit)"}
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* 3. Forms View Panel */}
                {activePengajuan && (
                  <div className="space-y-6">
                    <div className="bg-card border border-border p-5 rounded-xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 bg-muted/5 print:hidden">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            onClick={() => setActivePengajuan(null)}
                            className="mr-2 px-2.5 py-1 bg-secondary text-foreground hover:bg-secondary/80 border border-border rounded font-bold transition-all text-[11px]"
                          >
                            ← Kembali ke Riwayat
                          </button>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${activePengajuan.status === 'Approved' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                            activePengajuan.status === 'Rejected' ? 'bg-destructive/10 text-destructive border border-destructive/20' :
                              'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
                            }`}>
                            Status: {activePengajuan.status || 'Pending'}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ml-2 ${activePengajuan.status_proses === 'Closed' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-blue-500/10 text-blue-500 border border-blue-500/20'}`}>
                            Proses: {activePengajuan.status_proses || 'Open'}
                          </span>
                          {(currentUser?.role === 'Admin' || currentUser?.role === 'Asesor') && (
                            <div className="inline-flex items-center gap-1 ml-3 bg-secondary/50 border border-border px-2 py-0.5 rounded">
                              <label className="text-[10px] text-muted-foreground font-semibold">Ubah Proses:</label>
                              <select
                                value={activePengajuan.status_proses || 'Open'}
                                onChange={(e) => handleUpdateStatusProses(activePengajuan.id, e.target.value)}
                                className="text-[10px] font-bold rounded bg-background border-none p-0 focus:ring-0 text-foreground cursor-pointer"
                              >
                                <option value="Open">Open</option>
                                <option value="Closed">Closed</option>
                              </select>
                            </div>
                          )}
                        </div>
                        <h2 className="text-lg font-bold text-foreground mt-2">
                          Asesmen Sertifikasi: {activePengajuan.jenis_sertifikasi}
                        </h2>
                        {(() => {
                          const nurse = perawatData.find(p => String(p.id_perawat) === String(activePengajuan.id_perawat)) || { nama: 'Nurse', nip: '-' };
                          return (
                            <p className="text-xs text-muted-foreground mt-0.5 font-medium">
                              Peserta Asesi: <strong className="text-foreground">{nurse.nama}</strong> (NIP: {nurse.nip}) | Tanggal Pengajuan: {activePengajuan.tanggal_pengajuan}
                            </p>
                          );
                        })()}
                        {(activePengajuan.id_asesor || activePengajuan.id_asesor_pendamping) && (
                          <div className="text-xs text-muted-foreground mt-0.5 font-medium space-y-0.5">
                            {activePengajuan.id_asesor && (
                              <p>Asesor Utama: <strong className="text-foreground">{userData.find(u => String(u.id) === String(activePengajuan.id_asesor))?.nama || 'Data Asesor Tidak Ditemukan'}</strong></p>
                            )}
                            {activePengajuan.id_asesor_pendamping && (
                              <p>Asesor Pendamping: <strong className="text-foreground">{userData.find(u => String(u.id) === String(activePengajuan.id_asesor_pendamping))?.nama || 'Data Asesor Tidak Ditemukan'}</strong></p>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Approval Actions for Admin/Asesor */}
                      {(currentUser?.role === 'Admin' || currentUser?.role === 'Asesor') && activePengajuan.status === 'Pending' && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedAssessorId('');
                              setSelectedCoAssessorId('');
                              setIsAssessorModalOpen(true);
                            }}
                            className="px-3.5 py-2 bg-green-500 text-white font-bold hover:bg-green-600 rounded-lg text-xs transition-all shadow flex items-center gap-1.5"
                          >
                            <Check size={14} />
                            Setujui Pengajuan
                          </button>
                          <button
                            onClick={() => handleUpdatePengajuanStatus(activePengajuan.id, 'Rejected')}
                            className="px-3.5 py-2 bg-destructive text-white font-bold hover:bg-destructive/90 rounded-lg text-xs transition-all shadow flex items-center gap-1.5"
                          >
                            <XCircle size={14} />
                            Tolak Pengajuan
                          </button>
                        </div>
                      )}

                      {/* Exam Schedule & Status Panel */}
                      {activePengajuan.status === 'Approved' && (
                        <div className="mt-4 p-4 rounded-xl bg-blue-50/50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800">
                          <h3 className="font-bold text-blue-800 dark:text-blue-300 mb-2 flex items-center gap-2">
                            <Clock size={16} /> Ujian Kompetensi
                          </h3>
                          <div className="flex flex-col gap-3">
                            <div className="flex justify-between items-center text-sm">
                              <span>Status Ujian: <strong className="uppercase">{activePengajuan.status_ujian || 'Belum'}</strong></span>
                              {activePengajuan.status_ujian === 'Selesai' && (
                                <div className="flex items-center gap-2">
                                  <span className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 px-2 py-1 rounded font-bold">
                                    Nilai: {activePengajuan.nilai_ujian}
                                  </span>
                                  {(currentUser?.role === 'Admin' || currentUser?.role === 'Asesor') && (
                                    <>
                                      <button onClick={handleLihatHasilUjian} className="px-2 py-1 bg-blue-600 text-white rounded text-xs font-bold hover:bg-blue-700 transition">
                                        Lihat Detail Jawaban
                                      </button>
                                      {currentUser?.role === 'Admin' && (
                                        <button onClick={handleResetUjian} className="px-2 py-1 bg-yellow-500 text-white rounded text-xs font-bold hover:bg-yellow-600 transition ml-2">
                                          Reset / Ujian Ulang
                                        </button>
                                      )}
                                    </>
                                  )}
                                </div>
                              )}
                            </div>

                            {/* For Admin/Asesor: Set Jadwal */}
                            {(currentUser?.role === 'Admin' || currentUser?.role === 'Asesor') && activePengajuan.status_ujian !== 'Selesai' && (
                              <form onSubmit={handleSetJadwalUjian} className="flex gap-2 items-end mt-2">
                                <div className="flex-1">
                                  <label className="text-xs font-bold text-muted-foreground block mb-1">Jadwal Mulai</label>
                                  <input
                                    type="datetime-local"
                                    className="w-full text-sm rounded bg-background border border-border p-2"
                                    value={jadwalUjianInput}
                                    onChange={e => setJadwalUjianInput(e.target.value)}
                                    required
                                  />
                                </div>
                                <div className="flex-1">
                                  <label className="text-xs font-bold text-muted-foreground block mb-1">Batas Akhir</label>
                                  <input
                                    type="datetime-local"
                                    className="w-full text-sm rounded bg-background border border-border p-2"
                                    value={batasAkhirUjianInput}
                                    onChange={e => setBatasAkhirUjianInput(e.target.value)}
                                    required
                                  />
                                </div>
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white font-bold rounded text-sm hover:bg-blue-700">
                                  Simpan Jadwal
                                </button>
                              </form>
                            )}

                            {/* For Perawat: Jadwal & Mulai Ujian */}
                            {currentUser?.role === 'Perawat' && (
                              <div className="mt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div>
                                  <p className="text-xs text-muted-foreground font-medium">Jadwal Ujian:</p>
                                  <p className="font-bold text-foreground">{activePengajuan.jadwal_ujian ? new Date(activePengajuan.jadwal_ujian).toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'short' }) : 'Belum ditetapkan'}</p>
                                  {activePengajuan.batas_akhir_ujian && (
                                    <p className="text-xs text-muted-foreground font-medium mt-1">s/d {new Date(activePengajuan.batas_akhir_ujian).toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'short' })}</p>
                                  )}
                                </div>
                                {activePengajuan.jadwal_ujian && activePengajuan.status_ujian !== 'Selesai' && new Date() >= new Date(activePengajuan.jadwal_ujian) && (!activePengajuan.batas_akhir_ujian || new Date() <= new Date(activePengajuan.batas_akhir_ujian)) && (
                                  <button onClick={handleMulaiUjian} className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg shadow transition-all">
                                    Mulai Ujian Sekarang
                                  </button>
                                )}
                                {activePengajuan.jadwal_ujian && activePengajuan.status_ujian !== 'Selesai' && new Date() < new Date(activePengajuan.jadwal_ujian) && (
                                  <p className="text-xs text-yellow-600 dark:text-yellow-400 font-bold bg-yellow-100 dark:bg-yellow-900/30 px-3 py-1.5 rounded">
                                    Menunggu jadwal ujian tiba...
                                  </p>
                                )}
                                {activePengajuan.batas_akhir_ujian && activePengajuan.status_ujian !== 'Selesai' && new Date() > new Date(activePengajuan.batas_akhir_ujian) && (
                                  <p className="text-xs text-destructive font-bold bg-destructive/10 px-3 py-1.5 rounded">
                                    Jadwal ujian telah berakhir.
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    {/* Unified Selector Panel */}
                    {(() => {
                      // Parse detail_kompetensi
                      let codes = [];
                      try {
                        codes = JSON.parse(activePengajuan.detail_kompetensi);
                      } catch (e) {
                        if (activePengajuan.detail_kompetensi) {
                          codes = activePengajuan.detail_kompetensi.split(',');
                        }
                      }
                      if (!Array.isArray(codes)) codes = [];

                      const current12 = get12KompetensiForPengajuan(activePengajuan);
                      const combined = [
                        ...current12,
                        ...competencies.filter(c => {
                          const code = c.kode_kompetensi || c.kode;
                          return !current12.some(item => item.kode === code);
                        }).map(c => ({
                          kode: c.kode_kompetensi || c.kode,
                          judul: c.nama_kompetensi || c.judul || c.nama,
                          keterangan: `${c.kategori || 'Kompetensi Dasar'} : ${c.unit || 'Keperawatan Umum'}`
                        }))
                      ];

                      const filteredComps = combined.filter(c => codes.includes(c.kode));

                      return (
                        <div className="bg-card p-5 rounded-xl border border-border shadow-sm print:hidden">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">Asesi Keperawatan (Perawat)</label>
                              {(() => {
                                const nurse = perawatData.find(p => String(p.id_perawat) === String(activePengajuan.id_perawat)) || { nama: 'Nurse', nip: '-' };
                                return (
                                  <div className="flex items-center gap-3 px-4 py-2.5 bg-secondary/40 border border-border rounded-lg">
                                    <Users size={18} className="text-primary" />
                                    <span className="text-sm font-bold text-foreground">{nurse.nama} <span className="text-xs text-muted-foreground font-normal">(NIP: {nurse.nip})</span></span>
                                  </div>
                                );
                              })()}
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">Aktif Mengedit Formulir Untuk:</label>
                              <select
                                value={selectedKompetensiKode}
                                onChange={e => {
                                  setSelectedKompetensiKode(e.target.value);
                                  setSertifikatSubTab('form_01');
                                }}
                                className="w-full pl-3 pr-10 py-2.5 bg-background border border-border rounded-lg text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                              >
                                {filteredComps.map(c => (
                                  <option key={c.kode} value={c.kode}>{c.kode} - {c.judul}</option>
                                ))}
                                {filteredComps.length === 0 && (
                                  <option value="">Tidak ada kompetensi</option>
                                )}
                              </select>
                            </div>
                          </div>
                        </div>
                      );
                    })()}

                    {/* 13 Horizontal scrollable tabs bar */}
                    <div className="bg-card p-3 rounded-xl border border-border shadow-sm overflow-hidden print:hidden">
                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-2 px-1">Navigasi Formulir Asesmen (13 Tab)</p>
                      <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 scrollbar-thin scrollbar-thumb-primary/10 scrollbar-track-transparent">
                        {[
                          { id: 'form_01', name: 'FORM-01', label: 'Permohonan' },
                          { id: 'form_02', name: 'FORM-02', label: 'Asesmen Mandiri' },
                          { id: 'form_03', name: 'FORM-03', label: 'Rencana Asesmen' },
                          { id: 'form_03c', name: 'FORM-03 A', label: 'Uji Tulis' },
                          { id: 'form_03b', name: 'FORM-03 B', label: 'Uji Lisan' },
                          { id: 'form_03a', name: 'FORM-03 C', label: 'Obs (Observasi)' },
                          { id: 'form_03d', name: 'FORM-03 D', label: 'Portofolio' },
                          { id: 'form_04', name: 'FORM-04', label: 'Persetujuan' },
                          { id: 'form_05', name: 'FORM-05', label: 'Pra Asesmen' },
                          { id: 'form_06', name: 'FORM-06', label: 'Pelaksanaan' },
                          { id: 'form_07', name: 'FORM-07', label: 'Rekomendasi' },
                          { id: 'form_08', name: 'FORM-08', label: 'Umpan Balik' },
                          { id: 'form_09', name: 'FORM-09', label: 'Kaji Ulang' },
                          ...(form07Data?.keputusan === 'Kompeten' ? [{ id: 'sertifikat', name: 'Sertifikat', label: 'Cetak' }] : [])

                        ].filter(tab => {
                          if (currentUser?.role === 'Perawat') {
                            const allowedTabs = ['form_01', 'form_02', 'form_03c', 'form_04', 'form_07', 'form_08', 'sertifikat'];
                            return allowedTabs.includes(tab.id);
                          }
                          return true;
                        }).map(tab => (
                          <button
                            key={tab.id}
                            disabled={isTabLocked(tab.id)}
                            onClick={() => setSertifikatSubTab(tab.id)}
                            className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-all whitespace-nowrap flex flex-col items-start min-w-[125px] relative ${isTabLocked(tab.id)
                              ? 'bg-secondary/40 text-muted-foreground/50 border-border cursor-not-allowed opacity-60'
                              : sertifikatSubTab === tab.id
                                ? 'bg-primary text-primary-foreground border-primary shadow-md scale-[1.02]'
                                : 'bg-background text-muted-foreground border-border hover:border-muted-foreground/30 hover:text-foreground'
                              }`}
                          >
                            <span className="flex items-center justify-between w-full">
                              <span className={`text-[9px] leading-tight ${sertifikatSubTab === tab.id && !isTabLocked(tab.id) ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>{tab.name}</span>
                              {isTabLocked(tab.id) && <Lock size={10} className="text-muted-foreground/50" />}
                            </span>
                            <span className="text-xs mt-0.5 leading-none font-bold">{tab.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Locking Gating Banner for Forms 02 through 09 */}
                    {activePengajuan.status !== 'Approved' && sertifikatSubTab !== 'form_01' && (
                      <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-xl p-4 text-xs flex items-start gap-3">
                        <Lock size={18} className="mt-0.5 animate-pulse text-destructive" />
                        <div>
                          <strong className="block uppercase text-[10px] tracking-wide mb-1">Formulir Dikunci</strong>
                          <span>Seluruh formulir asesmen mandiri dan penilaian asesor (FORM-02 sampai FORM-09) hanya dapat diisi atau diedit setelah pengajuan disetujui (Approved) oleh Asesor atau Admin.</span>
                        </div>
                      </div>
                    )}

                    {currentUser?.role === 'Perawat' && isSaveButtonDisabled(sertifikatSubTab) && (
                      <div className="bg-primary/5 border border-primary/20 text-primary-foreground rounded-xl p-4 text-xs flex items-start gap-3 shadow-inner my-3 backdrop-blur-md">
                        <Shield size={18} className="mt-0.5 text-primary animate-pulse flex-shrink-0" />
                        <div>
                          <strong className="block uppercase text-[10px] tracking-wide mb-1 text-primary">Formulir Khusus Asesor</strong>
                          <span className="text-muted-foreground font-semibold">Formulir ini diisi oleh Asesor. Tombol simpan dinonaktifkan untuk peran Perawat.</span>
                        </div>
                      </div>
                    )}

                    {/* Form Content Display Card */}
                    {(() => {
                      const activeNurse = perawatData.find(p => String(p.id_perawat) === String(activePengajuan.id_perawat)) || {
                        nama: 'Nurse',
                        nip: '-'
                      };

                      const isFormLocked = activePengajuan.status !== 'Approved';

                      const nurseEdu = activeNurse.pendidikan_terakhir ? activeNurse.pendidikan_terakhir.toLowerCase() : '';
                      const nurseProfesi = activeNurse.profesi ? activeNurse.profesi.toLowerCase() : 'perawat';

                      let filteredJenjang = jenjangJabatanData.filter(j => {
                        const matchesProfesi = j.profesi.toLowerCase() === 'semua' || j.profesi.toLowerCase() === nurseProfesi;
                        if (!matchesProfesi) return false;

                        const isD3 = nurseEdu.includes('d3') || nurseEdu.includes('d-iii') || nurseEdu.includes('d iii') || nurseEdu.includes('diii');
                        if (isD3) {
                          return j.kategori_pendidikan.toLowerCase() === 'd3' || j.kategori_pendidikan.toLowerCase() === 'semua';
                        } else {
                          return j.kategori_pendidikan.toLowerCase() === 's1' || j.kategori_pendidikan.toLowerCase() === 'semua';
                        }
                      });

                      let jenjangOptions = [];
                      const suffix = nurseProfesi === 'perawat' ? 'PK' : 'PKB';
                      const profesiLabel = activeNurse.profesi || (nurseProfesi === 'perawat' ? 'Perawat' : 'Bidan');

                      filteredJenjang.forEach(j => {
                        const nama = j.nama_jenjang;
                        // Support standard clinical prefix and formats
                        jenjangOptions.push(`${profesiLabel} ${nama} ${suffix}1`);
                        jenjangOptions.push(`${profesiLabel} ${nama} ${suffix}2`);
                        jenjangOptions.push(`${profesiLabel} ${nama} ${suffix}3`);
                        jenjangOptions.push(`${profesiLabel} ${nama} ${suffix} 1`);
                        jenjangOptions.push(`${profesiLabel} ${nama} ${suffix} 2`);
                        jenjangOptions.push(`${profesiLabel} ${nama} ${suffix} 3`);
                      });

                      jenjangOptions = [...new Set(jenjangOptions)];

                      let codes = [];
                      try {
                        codes = JSON.parse(activePengajuan.detail_kompetensi);
                      } catch (e) {
                        if (activePengajuan.detail_kompetensi) {
                          codes = activePengajuan.detail_kompetensi.split(',');
                        }
                      }
                      if (!Array.isArray(codes)) codes = [];

                      const current12 = get12KompetensiForPengajuan(activePengajuan);
                      const combined = [
                        ...current12,
                        ...competencies.filter(c => {
                          const code = c.kode_kompetensi || c.kode;
                          return !current12.some(item => item.kode === code);
                        }).map(c => ({
                          kode: c.kode_kompetensi || c.kode,
                          judul: c.nama_kompetensi || c.judul || c.nama,
                          keterangan: `${c.kategori || 'Kompetensi Dasar'} : ${c.unit || 'Keperawatan Umum'}`
                        }))
                      ];

                      const filteredComps = combined.filter(c => codes.includes(c.kode));

                      return (
                        <div className="bg-card rounded-xl border border-border shadow-sm p-6 space-y-6">

                          {sertifikatSubTab === 'form_01' && (
                             <div className="space-y-6">
                               <div className="border-b border-border pb-4 flex justify-between items-center">
                                 <div>
                                   <h3 className="text-lg font-bold text-primary">
                                     {['Kredensial Baru', 'Kredensial Ulang'].includes(activePengajuan.jenis_sertifikasi)
                                       ? 'K.3. FORMULIR PERMOHONAN KREDENSIALING KEPERAWATAN'
                                       : 'FORM-01. FORMULIR PERMOHONAN SERTIFIKASI KOMPETENSI'}
                                   </h3>
                                   <p className="text-xs text-muted-foreground mt-0.5">
                                     {['Kredensial Baru', 'Kredensial Ulang'].includes(activePengajuan.jenis_sertifikasi)
                                       ? 'Rincian Data Pemohon Kredensial dan Prasyarat Kredensial'
                                       : 'Rincian Data Peserta dan Daftar Unit Kompetensi yang diajukan'}
                                   </p>
                                 </div>
                                 <span className="text-[10px] px-2 py-0.5 bg-primary/10 text-primary border border-primary/20 rounded font-bold">
                                   {['Kredensial Baru', 'Kredensial Ulang'].includes(activePengajuan.jenis_sertifikasi) ? 'KREDENSIAL' : 'UMUM'}
                                 </span>
                               </div>

                               {['Kredensial Baru', 'Kredensial Ulang'].includes(activePengajuan.jenis_sertifikasi) && (
                                 <div className="bg-primary/5 border border-primary/20 text-foreground p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-sans animate-in fade-in duration-200">
                                   <div className="space-y-1">
                                     <h4 className="font-bold text-primary flex items-center gap-1.5"><FileText size={15} /> Unduh Form Permohonan Kredensial (K.3)</h4>
                                     <p className="text-muted-foreground text-[11px]">Gunakan berkas ini untuk mengisi detail identitas, status registrasi, status kredensialing yang diusulkan, prasyarat kredensialing, program CPD, dan pernyataan kredensial.</p>
                                   </div>
                                   <a
                                     href={`${BASE_URL}/uploads/form_permohonan_kredensial.md`}
                                     download="form_permohonan_kredensial.md"
                                     className="px-4 py-2 bg-primary text-primary-foreground font-bold hover:bg-primary/95 rounded-lg text-xs shadow-sm transition-all whitespace-nowrap text-center shrink-0"
                                   >
                                     Unduh Template Form
                                   </a>
                                 </div>
                               )}

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Personal Details */}
                                <div className="bg-muted/30 p-4 rounded-xl border border-border space-y-3">
                                  <h4 className="font-bold text-xs text-foreground border-b border-border pb-1.5 uppercase tracking-wide">a. Data Pribadi</h4>
                                  <div className="flex flex-col sm:flex-row gap-4">
                                    {/* Left side: Photo */}
                                    <div className="flex flex-col items-center shrink-0">
                                      {activeNurse.foto ? (
                                        <img
                                          src={`${BASE_URL}/${activeNurse.foto}`}
                                          alt={activeNurse.nama}
                                          onClick={() => setPreviewPhotoUrl(`${BASE_URL}/${activeNurse.foto}`)}
                                          className="w-24 h-24 rounded-lg object-cover border border-border shadow-sm cursor-zoom-in hover:opacity-90 transition-opacity"
                                        />
                                      ) : (
                                        <div className="w-24 h-24 rounded-lg bg-primary/10 border border-border flex flex-col items-center justify-center text-primary font-bold text-3xl select-none">
                                          {activeNurse.nama ? activeNurse.nama.charAt(0) : 'N'}
                                        </div>
                                      )}
                                      <span className="text-[10px] text-muted-foreground font-semibold mt-1">Foto Profil</span>
                                    </div>
                                    {/* Right side: Fields */}
                                    <div className="grid grid-cols-3 text-xs gap-y-2 flex-grow">
                                      <span className="text-muted-foreground">Nama Lengkap</span>
                                      <span className="col-span-2 font-semibold text-foreground">: {activeNurse.nama}</span>

                                      <span className="text-muted-foreground">TTL</span>
                                      <span className="col-span-2 text-foreground">: {activeNurse.tempat_lahir || '-'}, {activeNurse.tanggal_lahir || '-'}</span>

                                      <span className="text-muted-foreground">Jenis Kelamin</span>
                                      <span className="col-span-2 text-foreground">: {activeNurse.jk === 'L' ? 'Laki-laki' : 'Wanita'}</span>

                                      <span className="text-muted-foreground">Alamat Rumah</span>
                                      <span className="col-span-2 text-foreground text-wrap">: {activeNurse.alamat || '-'}</span>

                                      <span className="text-muted-foreground">HP / Email</span>
                                      <span className="col-span-2 text-foreground">: {activeNurse.hp || '-'} / {activeNurse.email || '-'}</span>
                                    </div>
                                  </div>
                                </div>

                                {/* Education and Job */}
                                <div className="space-y-4">
                                  <div className="bg-muted/30 p-4 rounded-xl border border-border space-y-3">
                                    <h4 className="font-bold text-xs text-foreground border-b border-border pb-1.5 uppercase tracking-wide">b. Data Pendidikan Formal</h4>
                                    <div className="grid grid-cols-3 text-xs gap-y-2">
                                      <span className="text-muted-foreground">Pendidikan</span>
                                      <span className="col-span-2 font-semibold text-foreground">: {activeNurse.pendidikan_terakhir || '-'}</span>

                                      <span className="text-muted-foreground">No. Ijazah</span>
                                      <span className="col-span-2 text-foreground">: {activeNurse.no_ijazah || '-'}</span>
                                    </div>
                                  </div>

                                  <div className="bg-muted/30 p-4 rounded-xl border border-border space-y-3">
                                    <h4 className="font-bold text-xs text-foreground border-b border-border pb-1.5 uppercase tracking-wide">c. Pekerjaan Sekarang</h4>
                                    <div className="grid grid-cols-3 text-xs gap-y-2">
                                      <span className="text-muted-foreground">Jabatan / Profesi</span>
                                      <span className="col-span-2 font-semibold text-foreground">: {activeNurse.jabatan || '-'} / {activeNurse.profesi || '-'}</span>

                                      <span className="text-muted-foreground">Unit / Instansi</span>
                                      <span className="col-span-2 text-foreground">: {activeNurse.unit_kerja || '-'} (Grup: {activeNurse.grup || '-'})</span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Unit Kompetensi */}
                              <div className="space-y-3">
                                <h4 className="font-bold text-xs text-foreground border-b border-border pb-1 text-wrap">Bagian 2 : Daftar Unit Kompetensi Yang Diajukan</h4>
                                <div className="overflow-x-auto rounded-lg border border-border">
                                  <table className="w-full text-xs text-left">
                                    <thead className="bg-muted/50 font-bold text-muted-foreground border-b border-border">
                                      <tr>
                                        <th className="px-4 py-3">No.</th>
                                        <th className="px-4 py-3">Kode Unit</th>
                                        <th className="px-4 py-3">Judul Unit Kompetensi</th>
                                        <th className="px-4 py-3">Keterangan</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {filteredComps.map((comp, idx) => (
                                        <tr key={comp.kode} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                                          <td className="px-4 py-3 font-semibold text-muted-foreground">{idx + 1}</td>
                                          <td className="px-4 py-3 font-bold text-primary">{comp.kode}</td>
                                          <td className="px-4 py-3 font-semibold text-foreground">{comp.judul}</td>
                                          <td className="px-4 py-3 text-muted-foreground font-medium">{comp.keterangan || 'Kompetensi Dasar'}</td>
                                        </tr>
                                      ))}
                                      {filteredComps.length === 0 && (
                                        <tr>
                                          <td colSpan="4" className="px-4 py-6 text-center text-muted-foreground font-semibold">Tidak ada unit kompetensi yang diajukan.</td>
                                        </tr>
                                      )}
                                    </tbody>
                                  </table>
                                </div>
                              </div>

                              {/* Bukti Pendukung */}
                              <div className="space-y-4">
                                <h4 className="font-bold text-xs text-foreground border-b border-border pb-1">Bagian 3 : Dokumen Bukti Kompetensi & Pendukung</h4>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                  {[
                                    { key: 'buktiSerkom', label: 'SERKOM (Sertifikat Keahlian)' },
                                    { key: 'buktiJobdes', label: 'JOBDES (Uraian Tugas Kerja)' },
                                    { key: 'buktiSket', label: 'SKET (Surat Keterangan Atasan)' },
                                    { key: 'buktiLain', label: 'LAIN-LAIN (Bukti Relevan)' }
                                  ].map(item => (
                                    <label key={item.key} className="flex items-center gap-2.5 p-3 rounded-lg border border-border bg-background hover:bg-muted/20 cursor-pointer select-none">
                                      <input
                                        type="checkbox"
                                        disabled={activePengajuan.status !== 'Pending'}
                                        checked={form01Data[item.key] || false}
                                        onChange={e => setForm01Data({ ...form01Data, [item.key]: e.target.checked })}
                                        className="rounded border-border text-primary focus:ring-primary w-4 h-4"
                                      />
                                      <span className="text-[11px] font-semibold text-foreground leading-tight">{item.label}</span>
                                    </label>
                                  ))}
                                </div>

                                {currentUser?.role !== 'Perawat' && (
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                      <label className="block text-xs font-semibold mb-1">Rekomendasi Penilaian Lanjut (Diisi Asesor)</label>
                                      <input
                                        type="text"
                                        disabled={currentUser?.role === 'Perawat'}
                                        value={form01Data.rekomendasi || ''}
                                        onChange={e => setForm01Data({ ...form01Data, rekomendasi: e.target.value })}
                                        className="w-full px-3 py-2 bg-background border border-border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary text-foreground font-medium"
                                        placeholder="Rekomendasi kelanjutan asesmen..."
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-xs font-semibold mb-1">Catatan Asesor (Diisi Asesor)</label>
                                      <input
                                        type="text"
                                        disabled={currentUser?.role === 'Perawat'}
                                        value={form01Data.catatan || ''}
                                        onChange={e => setForm01Data({ ...form01Data, catatan: e.target.value })}
                                        className="w-full px-3 py-2 bg-background border border-border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary text-foreground font-medium"
                                        placeholder="Catatan keahlian/perbaikan..."
                                      />
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* Bagian 4: Kredensialing Keperawatan Form Integration */}
                              {['Kredensial Baru', 'Kredensial Ulang'].includes(activePengajuan.jenis_sertifikasi) && (
                                <div className="space-y-4 pt-4 border-t border-border animate-in fade-in duration-200">
                                  <h4 className="font-bold text-xs text-foreground border-b border-border pb-1 uppercase tracking-wider">Bagian 4 : Pengusulan Status &amp; Peminatan Kredensial</h4>
                                  
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {/* Kualifikasi Klinis */}
                                    <div className="bg-muted/30 p-4 rounded-xl border border-border space-y-2">
                                      <label className="block text-xs font-bold text-primary uppercase tracking-wide">Kualifikasi Klinis</label>
                                      <select
                                        disabled={activePengajuan.status !== 'Pending'}
                                        value={form01Data.kualifikasi_klinis || ''}
                                        onChange={e => setForm01Data({ ...form01Data, kualifikasi_klinis: e.target.value })}
                                        className="w-full px-3 py-2 bg-background border border-border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary text-foreground font-semibold"
                                      >
                                        <option value="">-- Pilih Kualifikasi Klinis --</option>
                                        {['Pra', 'I', 'II', 'III', 'IV', 'IVA', 'IVB', 'IVC', 'IVD', 'V', 'VA', 'VB', 'VC', 'VD'].map(val => (
                                          <option key={val} value={val}>{val}</option>
                                        ))}
                                      </select>
                                    </div>

                                    {/* Manajer */}
                                    <div className="bg-muted/30 p-4 rounded-xl border border-border space-y-2">
                                      <label className="block text-xs font-bold text-primary uppercase tracking-wide">Kualifikasi Manajer</label>
                                      <select
                                        disabled={activePengajuan.status !== 'Pending'}
                                        value={form01Data.kualifikasi_manajer || ''}
                                        onChange={e => setForm01Data({ ...form01Data, kualifikasi_manajer: e.target.value })}
                                        className="w-full px-3 py-2 bg-background border border-border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary text-foreground font-semibold"
                                      >
                                        <option value="">-- Pilih Manajer --</option>
                                        {['None', 'I', 'II', 'III', 'IV', 'V'].map(val => (
                                          <option key={val} value={val}>{val === 'None' ? 'Bukan Manajer' : `Tingkat ${val}`}</option>
                                        ))}
                                      </select>
                                    </div>

                                    {/* Riset */}
                                    <div className="bg-muted/30 p-4 rounded-xl border border-border space-y-2">
                                      <label className="block text-xs font-bold text-primary uppercase tracking-wide">Kualifikasi Riset</label>
                                      <select
                                        disabled={activePengajuan.status !== 'Pending'}
                                        value={form01Data.kualifikasi_riset || ''}
                                        onChange={e => setForm01Data({ ...form01Data, kualifikasi_riset: e.target.value })}
                                        className="w-full px-3 py-2 bg-background border border-border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary text-foreground font-semibold"
                                      >
                                        <option value="">-- Pilih Riset --</option>
                                        {['None', 'I', 'II', 'III', 'IV', 'V'].map(val => (
                                          <option key={val} value={val}>{val === 'None' ? 'Bukan Riset' : `Tingkat ${val}`}</option>
                                        ))}
                                      </select>
                                    </div>
                                  </div>

                                  {/* Keahlian / Peminatan Checkboxes */}
                                  <div className="bg-muted/30 p-4 rounded-xl border border-border space-y-3">
                                    <label className="block text-xs font-bold text-foreground border-b border-border pb-1.5 uppercase tracking-wide">Keahlian / Peminatan Keperawatan</label>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                      {jenisList.map(j => {
                                        const item = j.nm_jenis;
                                        const peminatanList = form01Data.peminatan || [];
                                        const isChecked = peminatanList.includes(item);
                                        return (
                                          <label key={j.kd_jenis} className="flex items-center gap-2.5 p-3 rounded-lg border border-border bg-background hover:bg-muted/20 cursor-pointer select-none">
                                            <input
                                              type="checkbox"
                                              disabled={activePengajuan.status !== 'Pending'}
                                              checked={isChecked}
                                              onChange={e => {
                                                let newList = [...peminatanList];
                                                if (e.target.checked) {
                                                  newList.push(item);
                                                } else {
                                                  newList = newList.filter(x => x !== item);
                                                }
                                                setForm01Data({ ...form01Data, peminatan: newList });
                                              }}
                                              className="rounded border-border text-primary focus:ring-primary w-4 h-4"
                                            />
                                            <span className="text-[11px] font-semibold text-foreground leading-tight">{item}</span>
                                          </label>
                                        );
                                      })}
                                    </div>
                                  </div>

                                  {/* Tim Kredensialing (Asesor / Admin) */}
                                  {currentUser?.role !== 'Perawat' && (
                                    <div className="bg-muted/30 p-4 rounded-xl border border-border space-y-3">
                                      <label className="block text-xs font-bold text-foreground border-b border-border pb-1.5 uppercase tracking-wide">Identitas Tim Kredensialing (Diisi Asesor / Admin)</label>
                                      <div className="overflow-x-auto rounded-lg border border-border bg-background">
                                        <table className="w-full text-xs text-left">
                                          <thead className="bg-muted/50 font-bold text-muted-foreground border-b border-border">
                                            <tr>
                                              <th className="px-4 py-2 w-12 text-center">No</th>
                                              <th className="px-4 py-2">Nama Lengkap</th>
                                              <th className="px-4 py-2">Kualifikasi Khusus / Jabatan</th>
                                              <th className="px-4 py-2">Bidang Keahlian</th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {[0, 1, 2].map(idx => {
                                              const tim = form01Data.tim_kredensial || [];
                                              const row = tim[idx] || { nama: '', jabatan: '', keahlian: '' };
                                              const updateRow = (field, val) => {
                                                const newTim = [...tim];
                                                newTim[idx] = { ...row, [field]: val };
                                                setForm01Data({ ...form01Data, tim_kredensial: newTim });
                                              };
                                              return (
                                                <tr key={idx} className="border-b border-border last:border-0">
                                                  <td className="px-4 py-2 font-bold text-muted-foreground text-center">{idx + 1}</td>
                                                  <td className="px-2 py-2">
                                                    <input
                                                      type="text"
                                                      disabled={currentUser?.role === 'Perawat'}
                                                      value={row.nama || ''}
                                                      onChange={e => updateRow('nama', e.target.value)}
                                                      placeholder="Nama Anggota Tim..."
                                                      className="w-full px-2 py-1 bg-background border border-border rounded text-xs focus:outline-none focus:ring-1 focus:ring-primary text-foreground font-semibold"
                                                    />
                                                  </td>
                                                  <td className="px-2 py-2">
                                                    <input
                                                      type="text"
                                                      disabled={currentUser?.role === 'Perawat'}
                                                      value={row.jabatan || ''}
                                                      onChange={e => updateRow('jabatan', e.target.value)}
                                                      placeholder="Jabatan di Tim..."
                                                      className="w-full px-2 py-1 bg-background border border-border rounded text-xs focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                                                    />
                                                  </td>
                                                  <td className="px-2 py-2">
                                                    <input
                                                      type="text"
                                                      disabled={currentUser?.role === 'Perawat'}
                                                      value={row.keahlian || ''}
                                                      onChange={e => updateRow('keahlian', e.target.value)}
                                                      placeholder="Bidang Keahlian..."
                                                      className="w-full px-2 py-1 bg-background border border-border rounded text-xs focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                                                    />
                                                  </td>
                                                </tr>
                                              );
                                            })}
                                          </tbody>
                                        </table>
                                      </div>
                                    </div>
                                  )}

                                  {/* Rekomendasi Mitra Bestari */}
                                  {currentUser?.role === 'Perawat' ? (
                                    form01Data.rekomendasi_kredensial && (
                                      <div className="bg-primary/5 p-4 rounded-xl border border-primary/20 space-y-2 text-xs">
                                        <span className="font-bold text-primary block uppercase tracking-wide">Rekomendasi Sub Komite Kredensial</span>
                                        <p className="font-bold text-foreground">
                                          {form01Data.rekomendasi_kredensial === 'disetujui_penuh' && 'Direkomendasikan diberi kewenangan klinis penuh'}
                                          {form01Data.rekomendasi_kredensial === 'disetujui_supervisi' && 'Direkomendasikan diberi kewenangan klinis dengan supervisi'}
                                          {form01Data.rekomendasi_kredensial === 'ditangguhkan' && 'Ditangguhkan / belum disetujui'}
                                        </p>
                                        {form01Data.catatan_rekomendasi && (
                                          <p className="text-muted-foreground mt-1">Catatan: {form01Data.catatan_rekomendasi}</p>
                                        )}
                                      </div>
                                    )
                                  ) : (
                                    <div className="bg-muted/30 p-4 rounded-xl border border-border space-y-3">
                                      <label className="block text-xs font-bold text-foreground border-b border-border pb-1.5 uppercase tracking-wide">Rekomendasi Mitra Bestari (Sub Komite Kredensial)</label>
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                          <label className="block text-xs font-semibold mb-1 text-muted-foreground">Rekomendasi Kredensial</label>
                                          <select
                                            disabled={currentUser?.role === 'Perawat'}
                                            value={form01Data.rekomendasi_kredensial || ''}
                                            onChange={e => setForm01Data({ ...form01Data, rekomendasi_kredensial: e.target.value })}
                                            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary text-foreground font-semibold"
                                          >
                                            <option value="">-- Pilih Rekomendasi Kredensial --</option>
                                            <option value="disetujui_penuh">Direkomendasikan diberi kewenangan klinis penuh</option>
                                            <option value="disetujui_supervisi">Direkomendasikan diberi kewenangan klinis dengan supervisi</option>
                                            <option value="ditangguhkan">Ditangguhkan / belum disetujui</option>
                                          </select>
                                        </div>
                                        <div>
                                          <label className="block text-xs font-semibold mb-1 text-muted-foreground">Catatan Rekomendasi</label>
                                          <input
                                            type="text"
                                            disabled={currentUser?.role === 'Perawat'}
                                            value={form01Data.catatan_rekomendasi || ''}
                                            onChange={e => setForm01Data({ ...form01Data, catatan_rekomendasi: e.target.value })}
                                            placeholder="Catatan tambahan mitra bestari..."
                                            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary text-foreground font-medium"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* Dokumen Lampiran Profil Perawat */}
                              <div className="space-y-3 pt-2">
                                <h4 className="font-bold text-xs text-foreground border-b border-border pb-1">Dokumen Lampiran Profil Perawat (Untuk Verifikasi Asesor)</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {/* STR & SIP Card */}
                                  <div className="bg-muted/30 p-4 rounded-xl border border-border space-y-3">
                                    <h5 className="font-bold text-xs text-foreground border-b border-border pb-1.5 flex items-center gap-1.5 uppercase tracking-wide">
                                      <Shield size={14} className="text-primary" /> Dokumen Legalitas (STR &amp; SIP)
                                    </h5>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                      {/* STR */}
                                      <div className="p-3 bg-background border border-border rounded-lg flex flex-col justify-between min-h-[100px]">
                                        <div>
                                          <div className="flex justify-between items-start gap-1">
                                            <span className="font-bold text-[10px] text-foreground block">Surat Tanda Registrasi (STR)</span>
                                            {activeNurse.file_str ? (
                                              <span className="text-[8px] px-1.5 py-0.5 bg-green-500/10 text-green-500 border border-green-500/20 rounded font-semibold uppercase shrink-0">Ada</span>
                                            ) : (
                                              <span className="text-[8px] px-1.5 py-0.5 bg-destructive/10 text-destructive border border-destructive/20 rounded font-semibold uppercase shrink-0 animate-pulse">Kosong</span>
                                            )}
                                          </div>
                                          <p className="text-[10px] text-muted-foreground mt-1.5 font-medium">
                                            No: {activeNurse.no_str || "-"}
                                          </p>
                                          <p className="text-[9px] text-muted-foreground mt-0.5 font-medium">
                                            Berlaku: {activeNurse.masa_berlaku_str || "-"}
                                          </p>
                                        </div>
                                        {activeNurse.file_str ? (
                                          <a
                                            href={`${BASE_URL}/${activeNurse.file_str}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-[10px] text-primary hover:underline font-bold mt-2 flex items-center gap-1"
                                          >
                                            <Eye size={10} /> Lihat File STR
                                          </a>
                                        ) : (
                                          <p className="text-[9px] text-destructive italic mt-2 font-medium">Belum diupload</p>
                                        )}
                                      </div>

                                      {/* SIP */}
                                      <div className="p-3 bg-background border border-border rounded-lg flex flex-col justify-between min-h-[100px]">
                                        <div>
                                          <div className="flex justify-between items-start gap-1">
                                            <span className="font-bold text-[10px] text-foreground block">Surat Izin Praktik (SIP)</span>
                                            {activeNurse.file_sip ? (
                                              <span className="text-[8px] px-1.5 py-0.5 bg-green-500/10 text-green-500 border border-green-500/20 rounded font-semibold uppercase shrink-0">Ada</span>
                                            ) : (
                                              <span className="text-[8px] px-1.5 py-0.5 bg-destructive/10 text-destructive border border-destructive/20 rounded font-semibold uppercase shrink-0 animate-pulse">Kosong</span>
                                            )}
                                          </div>
                                          <p className="text-[10px] text-muted-foreground mt-1.5 font-medium">
                                            No: {activeNurse.no_sip || "-"}
                                          </p>
                                          <p className="text-[9px] text-muted-foreground mt-0.5 font-medium">
                                            Berlaku: {activeNurse.masa_berlaku_sip || "-"}
                                          </p>
                                        </div>
                                        {activeNurse.file_sip ? (
                                          <a
                                            href={`${BASE_URL}/${activeNurse.file_sip}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-[10px] text-primary hover:underline font-bold mt-2 flex items-center gap-1"
                                          >
                                            <Eye size={10} /> Lihat File SIP
                                          </a>
                                        ) : (
                                          <p className="text-[9px] text-destructive italic mt-2 font-medium">Belum diupload</p>
                                        )}
                                      </div>
                                    </div>
                                  </div>

                                  {/* Additional Certificates & Training Card */}
                                  <div className="bg-muted/30 p-4 rounded-xl border border-border space-y-3">
                                    <h5 className="font-bold text-xs text-foreground border-b border-border pb-1.5 flex items-center gap-1.5 uppercase tracking-wide">
                                      <Award size={14} className="text-primary" /> Sertifikat Pelatihan &amp; Kompetensi Lainnya
                                    </h5>
                                    <div className="space-y-2 max-h-[110px] overflow-y-auto pr-1">
                                      {activeNurseCertificates.length === 0 && activeNursePelatihan.length === 0 ? (
                                        <div className="p-4 text-center bg-background border border-dashed border-border rounded-lg text-[10px] text-muted-foreground font-medium">
                                          Belum ada dokumen sertifikat atau pelatihan tambahan yang diunggah.
                                        </div>
                                      ) : (
                                        <>
                                          {activeNurseCertificates.map((doc, idx) => (
                                            <div key={`cert-${idx}`} className="p-2 bg-background border border-border rounded-lg flex items-center justify-between text-[10px] gap-2">
                                              <div className="truncate flex-grow">
                                                <span className="font-bold text-foreground block truncate">{doc.nama_sertifikat}</span>
                                                <span className="text-muted-foreground text-[9px]">No: {doc.nomor || '-'}</span>
                                              </div>
                                              {doc.file ? (
                                                <a
                                                  href={`${BASE_URL}/${doc.file}`}
                                                  target="_blank"
                                                  rel="noopener noreferrer"
                                                  className="px-2 py-1 bg-primary/10 text-primary rounded font-bold hover:bg-primary hover:text-white transition-colors shrink-0"
                                                >
                                                  Lihat File
                                                </a>
                                              ) : (
                                                <span className="text-[9px] text-muted-foreground shrink-0">Tidak ada file</span>
                                              )}
                                            </div>
                                          ))}
                                          {activeNursePelatihan.map((train, idx) => (
                                            <div key={`train-${idx}`} className="p-2 bg-background border border-border rounded-lg flex items-center justify-between text-[10px] gap-2">
                                              <div className="truncate flex-grow">
                                                <span className="font-bold text-foreground block truncate">{train.nama_pelatihan}</span>
                                                <span className="text-muted-foreground text-[9px]">Penyelenggara: {train.penyelenggara || '-'}</span>
                                              </div>
                                              {train.file ? (
                                                <a
                                                  href={`${BASE_URL}/${train.file}`}
                                                  target="_blank"
                                                  rel="noopener noreferrer"
                                                  className="px-2 py-1 bg-indigo-500/10 text-indigo-600 rounded font-bold hover:bg-indigo-600 hover:text-white transition-colors shrink-0"
                                                >
                                                  Lihat File
                                                </a>
                                              ) : (
                                                <span className="text-[9px] text-muted-foreground shrink-0">Tidak ada file</span>
                                              )}
                                            </div>
                                          ))}
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="pt-4 border-t border-border flex justify-end gap-3">
                                {activePengajuan.file_pendukung && (
                                  <a
                                    href={`${BASE_URL}/${activePengajuan.file_pendukung}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-4 py-2 bg-secondary text-foreground hover:bg-secondary/80 border border-border font-bold rounded-lg text-xs transition-all flex items-center gap-1"
                                  >
                                    <Eye size={13} /> Lihat Berkas Pendukung Pengajuan
                                  </a>
                                )}
                                {activePengajuan?.status !== 'Approved' && (
                                  <button
                                    type="button"
                                    disabled={isSaveButtonDisabled('form_01')}
                                    onClick={handleSaveCompetencyForms}
                                    className="px-5 py-2 bg-primary text-primary-foreground font-bold hover:bg-primary/95 rounded-lg text-xs transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    Simpan Data Formulir ini
                                  </button>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Active SubTab 02 */}
                          {sertifikatSubTab === 'form_02' && (
                            <div className="space-y-6">
                              <div className="border-b border-border pb-4 flex justify-between items-center">
                                <div>
                                  <h3 className="text-lg font-bold text-primary">FORM-02. ASESMEN MANDIRI / SELF ASSESSMENT</h3>
                                  <p className="text-xs text-muted-foreground mt-0.5">Penilaian mandiri kriteria unjuk kerja secara obyektif</p>
                                </div>
                                <span className="text-[10px] px-2 py-0.5 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 rounded font-bold">MANDIRI</span>
                              </div>

                              <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-xs space-y-2 text-foreground">
                                <p className="font-bold text-primary uppercase tracking-wide text-[10px]">Petunjuk Pengisian:</p>
                                <p>Tentukan tingkat kemampuan klinis Anda terhadap Kriteria Unjuk Kerja (KUK) pada 12 Kompetensi Dasar di bawah ini dengan mencentang pilihan <strong>K</strong> (Kompeten) atau <strong>BK</strong> (Belum Kompeten).</p>
                              </div>

                              <div className="space-y-6">
                                {get12KompetensiForPengajuan(activePengajuan).map((komp, idx) => {
                                  const k1_1Key = `${komp.kode}_k1_1`;
                                  const k1_2Key = `${komp.kode}_k1_2`;
                                  const k1_3Key = `${komp.kode}_k1_3`;
                                  const k2_1Key = `${komp.kode}_k2_1`;
                                  const k2_2Key = `${komp.kode}_k2_2`;
                                  const k2_3Key = `${komp.kode}_k2_3`;
                                  const buktiKey = `${komp.kode}_bukti`;
                                  const rekomKey = `${komp.kode}_rekomendasi`;

                                  return (
                                    <div key={komp.kode} className="bg-card border border-border/60 rounded-xl p-5 shadow-sm space-y-4">
                                      <div className="flex justify-between items-start gap-4 pb-3 border-b border-border">
                                        <div>
                                          <span className="text-[10px] font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded border border-primary/20">{komp.kode}</span>
                                          <h4 className="font-bold text-sm text-foreground mt-1.5">{komp.judul}</h4>
                                          <p className="text-[10px] text-muted-foreground mt-0.5">{komp.keterangan}</p>
                                        </div>
                                      </div>

                                      <div className="overflow-x-auto rounded-lg border border-border">
                                        <table className="w-full text-xs text-left">
                                          <thead className="bg-muted/50 font-bold text-muted-foreground border-b border-border">
                                            <tr>
                                              <th className="px-4 py-2.5">Kriteria Unjuk Kerja (KUK)</th>
                                              <th className="px-4 py-2.5 text-center w-24">Kompeten (K)</th>
                                              <th className="px-4 py-2.5 text-center w-36">Belum Kompeten (BK)</th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {/* Elemen 1 */}
                                            <tr className="bg-muted/10 font-bold border-b border-border text-[11px] text-foreground">
                                              <td colSpan="3" className="px-4 py-2">Elemen 1: {komp.form02.elemen1}</td>
                                            </tr>
                                            {[
                                              { key: k1_1Key, label: `1.1 ${komp.form02.k1_1}` },
                                              { key: k1_2Key, label: `1.2 ${komp.form02.k1_2}` },
                                              { key: k1_3Key, label: `1.3 ${komp.form02.k1_3}` }
                                            ].map(item => (
                                              <tr key={item.key} className="border-b border-border last:border-0 hover:bg-muted/5">
                                                <td className="px-4 py-2.5 text-foreground font-medium">{item.label}</td>
                                                <td className="px-4 py-2.5 text-center">
                                                  <input
                                                    type="radio"
                                                    name={`${komp.kode}_k1_${item.key}`}
                                                    disabled={isFormLocked || currentUser?.role !== 'Perawat'}
                                                    checked={form02Data[item.key] === 'K'}
                                                    onChange={() => setForm02Data({ ...form02Data, [item.key]: 'K' })}
                                                    className="text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                                                  />
                                                </td>
                                                <td className="px-4 py-2.5 text-center">
                                                  <input
                                                    type="radio"
                                                    name={`${komp.kode}_k1_${item.key}`}
                                                    disabled={isFormLocked || currentUser?.role !== 'Perawat'}
                                                    checked={form02Data[item.key] === 'BK'}
                                                    onChange={() => setForm02Data({ ...form02Data, [item.key]: 'BK' })}
                                                    className="text-destructive focus:ring-destructive w-4 h-4 cursor-pointer"
                                                  />
                                                </td>
                                              </tr>
                                            ))}

                                            {/* Elemen 2 */}
                                            <tr className="bg-muted/10 font-bold border-b border-border text-[11px] text-foreground">
                                              <td colSpan="3" className="px-4 py-2">Elemen 2: {komp.form02.elemen2}</td>
                                            </tr>
                                            {[
                                              { key: k2_1Key, label: `2.1 ${komp.form02.k2_1}` },
                                              { key: k2_2Key, label: `2.2 ${komp.form02.k2_2}` },
                                              { key: k2_3Key, label: `2.3 ${komp.form02.k2_3}` }
                                            ].map(item => (
                                              <tr key={item.key} className="border-b border-border last:border-0 hover:bg-muted/5">
                                                <td className="px-4 py-2.5 text-foreground font-medium">{item.label}</td>
                                                <td className="px-4 py-2.5 text-center">
                                                  <input
                                                    type="radio"
                                                    name={`${komp.kode}_k2_${item.key}`}
                                                    disabled={isFormLocked || currentUser?.role !== 'Perawat'}
                                                    checked={form02Data[item.key] === 'K'}
                                                    onChange={() => setForm02Data({ ...form02Data, [item.key]: 'K' })}
                                                    className="text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                                                  />
                                                </td>
                                                <td className="px-4 py-2.5 text-center">
                                                  <input
                                                    type="radio"
                                                    name={`${komp.kode}_k2_${item.key}`}
                                                    disabled={isFormLocked || currentUser?.role !== 'Perawat'}
                                                    checked={form02Data[item.key] === 'BK'}
                                                    onChange={() => setForm02Data({ ...form02Data, [item.key]: 'BK' })}
                                                    className="text-destructive focus:ring-destructive w-4 h-4 cursor-pointer"
                                                  />
                                                </td>
                                              </tr>
                                            ))}
                                          </tbody>
                                        </table>
                                      </div>

                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                        <div className={currentUser?.role === 'Perawat' ? 'col-span-2' : ''}>
                                          <label className="block text-[11px] font-semibold text-muted-foreground mb-1 uppercase tracking-wide">Bukti-bukti Kompetensi Terkait</label>
                                          <input
                                            type="text"
                                            disabled={isFormLocked || currentUser?.role !== 'Perawat'}
                                            value={form02Data[buktiKey] || ''}
                                            onChange={e => setForm02Data({ ...form02Data, [buktiKey]: e.target.value })}
                                            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary text-foreground font-medium"
                                            placeholder="Cth: Sertifikat pelatihan terkait, logbook..."
                                          />
                                        </div>
                                        {currentUser?.role !== 'Perawat' && (
                                          <div>
                                            <label className="block text-[11px] font-semibold text-muted-foreground mb-1 uppercase tracking-wide">Rekomendasi Asesor / Admin</label>
                                            <input
                                              type="text"
                                              disabled={isFormLocked || currentUser?.role === 'Perawat'}
                                              value={form02Data[rekomKey] || ''}
                                              onChange={e => setForm02Data({ ...form02Data, [rekomKey]: e.target.value })}
                                              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary text-foreground font-medium"
                                              placeholder="Rekomendasi kelanjutan asesmen mandiri..."
                                            />
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>

                              <div className="pt-4 border-t border-border flex justify-end">
                                <button
                                  type="button"
                                  disabled={isFormLocked || isSaveButtonDisabled('form_02')}
                                  onClick={handleSaveCompetencyForms}
                                  className="px-5 py-2 bg-primary text-primary-foreground font-bold hover:bg-primary/95 rounded-lg text-xs transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  Simpan Data Formulir ini
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Active SubTab 03 */}
                          {sertifikatSubTab === 'form_03' && (
                            <div className="space-y-6">
                              <div className="border-b border-border pb-4 flex justify-between items-center">
                                <div>
                                  <h3 className="text-lg font-bold text-primary">FORM-03. MERENCANAKAN DAN MENGEMBANGKAN ASESMEN</h3>
                                  <p className="text-xs text-muted-foreground mt-0.5">Penetapan rancangan metode dan instrumen asesmen lengkap</p>
                                </div>
                                <span className="text-[10px] px-2 py-0.5 bg-primary/10 text-primary border border-primary/20 rounded font-bold">RENCANA</span>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3.5">
                                  <div>
                                    <label className="block text-xs font-semibold mb-1">Pendekatan Asesmen</label>
                                    <select
                                      disabled={isFormLocked || currentUser?.role === 'Perawat'}
                                      value={form03Data.pendekatan || ''}
                                      onChange={e => setForm03Data({ ...form03Data, pendekatan: e.target.value })}
                                      className="w-full px-3 py-2 bg-background border border-border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary text-foreground font-medium"
                                    >
                                      <option value="">Pilih Pendekatan Asesmen</option>
                                      {jenjangOptions.map(opt => (
                                        <option key={opt} value={opt}>{opt}</option>
                                      ))}
                                    </select>
                                  </div>
                                  <div>
                                    <label className="block text-xs font-semibold mb-1">Tujuan Asesmen</label>
                                    <select
                                      disabled={isFormLocked || currentUser?.role === 'Perawat'}
                                      value={form03Data.tujuan || ''}
                                      onChange={e => setForm03Data({ ...form03Data, tujuan: e.target.value })}
                                      className="w-full px-3 py-2 bg-background border border-border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary text-foreground font-medium"
                                    >
                                      <option value="">Pilih Tujuan Asesmen</option>
                                      <option value="RPL ( Recognation of Prior Learning )">RPL ( Recognation of Prior Learning )</option>
                                      <option value="Pencapaian Proses pembelajaran">Pencapaian Proses pembelajaran</option>
                                      <option value="RCC ( Recognation Current Competencies )">RCC ( Recognation Current Competencies )</option>
                                      <option value="Sertifikasi">Sertifikasi</option>
                                      <option value="lainnya">lainnya</option>
                                    </select>
                                  </div>
                                  <div>
                                    <label className="block text-xs font-semibold mb-1">Acuan Pembanding</label>
                                    <input
                                      type="text"
                                      disabled={isFormLocked || currentUser?.role === 'Perawat'}
                                      value={form03Data.acuan || ''}
                                      onChange={e => setForm03Data({ ...form03Data, acuan: e.target.value })}
                                      className="w-full px-3 py-2 bg-background border border-border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary text-foreground font-medium"
                                      placeholder="Acuan standar..."
                                    />
                                  </div>
                                </div>

                                <div className="space-y-4">
                                  <h4 className="font-bold text-xs text-foreground uppercase tracking-wide">Rencana Metode Asesmen</h4>
                                  <div className="grid grid-cols-2 gap-3.5">
                                    {[
                                      { key: 'metodeObservasi', label: 'Observasi Langsung' },
                                      { key: 'metodeUjiLisan', label: 'Uji Pertanyaan Lisan' },
                                      { key: 'metodeStudiKasus', label: 'Studi Kasus Klinis' },
                                      { key: 'metodeUjiTulis', label: 'Uji Pertanyaan Tulis' },
                                      { key: 'metodePortofolio', label: 'Evaluasi Portofolio' },
                                      { key: 'metodeSimulasi', label: 'Metode Simulasi' }
                                    ].map(m => (
                                      <label key={m.key} className="flex items-center gap-2.5 p-3 rounded-lg border border-border bg-background hover:bg-muted/10 cursor-pointer select-none">
                                        <input
                                          type="checkbox"
                                          disabled={isFormLocked || currentUser?.role === 'Perawat'}
                                          checked={form03Data[m.key] || false}
                                          onChange={e => setForm03Data({ ...form03Data, [m.key]: e.target.checked })}
                                          className="rounded border-border text-primary focus:ring-primary w-4 h-4"
                                        />
                                        <span className="text-[11px] font-semibold text-foreground leading-tight">{m.label}</span>
                                      </label>
                                    ))}
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-3">
                                <h4 className="font-bold text-xs text-foreground uppercase tracking-wide border-b border-border pb-1">Aturan Pengumpulan Bukti</h4>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
                                  {[
                                    { key: 'validitas', label: 'Validitas (V)' },
                                    { key: 'reliabilitas', label: 'Reliabilitas (R)' },
                                    { key: 'fleksibilitas', label: 'Fleksibilitas (F)' },
                                    { key: 'keadilan', label: 'Keadilan (K)' }
                                  ].map(r => (
                                    <div key={r.key} className="space-y-1">
                                      <label className="block text-[10px] font-bold text-muted-foreground uppercase">{r.label}</label>
                                      <input
                                        type="text"
                                        disabled={isFormLocked || currentUser?.role === 'Perawat'}
                                        value={form03Data[r.key] || ''}
                                        onChange={e => setForm03Data({ ...form03Data, [r.key]: e.target.value })}
                                        className="w-full px-2.5 py-1.5 bg-background border border-border rounded text-xs focus:outline-none focus:ring-2 focus:ring-primary text-foreground font-semibold"
                                        placeholder="Ya / Tidak"
                                      />
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <div className="pt-4 border-t border-border flex justify-end">
                                <button
                                  type="button"
                                  disabled={isFormLocked || isSaveButtonDisabled('form_03')}
                                  onClick={handleSaveCompetencyForms}
                                  className="px-5 py-2 bg-primary text-primary-foreground font-bold hover:bg-primary/95 rounded-lg text-xs transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  Simpan Data Rencana Asesmen
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Active SubTab 03A */}
                          {sertifikatSubTab === 'form_03a' && (
                            <div className="space-y-6">
                              <div className="border-b border-border pb-4 flex justify-between items-center">
                                <div>
                                  <h3 className="text-lg font-bold text-primary">FORM-03 C. CEKLIST OBSERVASI DEMONSTRASI KLINIS</h3>
                                  <p className="text-xs text-muted-foreground mt-0.5">Lembar checklist penilaian unjuk kerja langsung untuk 12 kompetensi dasar</p>
                                </div>
                                <span className="text-[10px] px-2 py-0.5 bg-primary/10 text-primary border border-primary/20 rounded font-bold">OBSERVASI</span>
                              </div>

                              <div className="overflow-x-auto rounded-lg border border-border">
                                <table className="w-full text-xs text-left">
                                  <thead className="bg-muted/50 font-bold text-muted-foreground border-b border-border">
                                    <tr>
                                      <th className="px-4 py-3 text-center w-12">NO</th>
                                      <th className="px-4 py-3">KOMPETENSI</th>
                                      <th className="px-4 py-3 w-1/3">KETERANGAN</th>
                                      <th className="px-4 py-3 text-center w-48">NILAI</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {get12KompetensiForPengajuan(activePengajuan).map((komp, idx) => {
                                      const nilaiKey = `${komp.kode}_nilai`;
                                      const ketKey = `${komp.kode}_ket`;
                                      return (
                                        <tr key={komp.kode} className="border-b border-border last:border-0 hover:bg-muted/10">
                                          <td className="px-4 py-3 text-center font-semibold text-muted-foreground">{idx + 1}.</td>
                                          <td className="px-4 py-3">
                                            <div className="font-bold text-foreground">{komp.kode}</div>
                                            <div className="text-[10px] text-muted-foreground font-medium mt-0.5">{komp.judul}</div>
                                          </td>
                                          <td className="px-4 py-3">
                                            <input
                                              type="text"
                                              disabled={isFormLocked || currentUser?.role === 'Perawat'}
                                              value={form03aData[ketKey] || ''}
                                              onChange={e => setForm03aData({ ...form03aData, [ketKey]: e.target.value })}
                                              className="w-full px-2.5 py-1.5 bg-background border border-border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary text-foreground font-medium"
                                              placeholder="Tulis keterangan observasi..."
                                            />
                                          </td>
                                          <td className="px-4 py-3 text-center">
                                            <div className="flex justify-center gap-4">
                                              <label className="flex items-center gap-1.5 cursor-pointer">
                                                <input
                                                  type="radio"
                                                  name={`${komp.kode}_obs_nilai`}
                                                  disabled={isFormLocked || currentUser?.role === 'Perawat'}
                                                  checked={form03aData[nilaiKey] === 'K'}
                                                  onChange={() => setForm03aData({ ...form03aData, [nilaiKey]: 'K' })}
                                                  className="text-primary focus:ring-primary w-4 h-4"
                                                />
                                                <span className="font-semibold text-foreground text-xs">K</span>
                                              </label>
                                              <label className="flex items-center gap-1.5 cursor-pointer">
                                                <input
                                                  type="radio"
                                                  name={`${komp.kode}_obs_nilai`}
                                                  disabled={isFormLocked || currentUser?.role === 'Perawat'}
                                                  checked={form03aData[nilaiKey] === 'BK'}
                                                  onChange={() => setForm03aData({ ...form03aData, [nilaiKey]: 'BK' })}
                                                  className="text-destructive focus:ring-destructive w-4 h-4"
                                                />
                                                <span className="font-semibold text-foreground text-xs">BK</span>
                                              </label>
                                            </div>
                                          </td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              </div>

                              <div>
                                <label className="block text-xs font-semibold mb-1">Catatan & Umpan Balik Observasi Asesor</label>
                                <textarea
                                  rows="3"
                                  disabled={isFormLocked || currentUser?.role === 'Perawat'}
                                  value={form03aData.umpanBalik || ''}
                                  onChange={e => setForm03aData({ ...form03aData, umpanBalik: e.target.value })}
                                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary text-foreground font-medium"
                                  placeholder="Tulis umpan balik mengenai demonstrasi klinis..."
                                />
                              </div>

                              <div className="pt-4 border-t border-border flex justify-end">
                                <button
                                  type="button"
                                  disabled={isFormLocked || isSaveButtonDisabled('form_03a')}
                                  onClick={handleSaveCompetencyForms}
                                  className="px-5 py-2 bg-primary text-primary-foreground font-bold hover:bg-primary/95 rounded-lg text-xs transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  Simpan Hasil Observasi (FORM-03 C)
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Active SubTab 03B */}
                          {sertifikatSubTab === 'form_03b' && (
                            <div className="space-y-6">
                              <div className="border-b border-border pb-4 flex justify-between items-center">
                                <div>
                                  <h3 className="text-lg font-bold text-primary">FORM-03 B. INSTRUMEN PENILAIAN LISAN</h3>
                                  <p className="text-xs text-muted-foreground mt-0.5">Penilaian wawancara lisan 12 unit kompetensi dasar</p>
                                </div>
                                <span className="text-[10px] px-2 py-0.5 bg-primary/10 text-primary border border-primary/20 rounded font-bold">LISAN</span>
                              </div>

                              <div className="overflow-x-auto rounded-lg border border-border">
                                <table className="w-full text-xs text-left">
                                  <thead className="bg-muted/50 font-bold text-muted-foreground border-b border-border">
                                    <tr>
                                      <th className="px-4 py-3 text-center w-12">NO</th>
                                      <th className="px-4 py-3">KOMPETENSI</th>
                                      <th className="px-4 py-3 w-1/3">KETERANGAN</th>
                                      <th className="px-4 py-3 text-center w-48">NILAI</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {get12KompetensiForPengajuan(activePengajuan).map((komp, idx) => {
                                      const nilaiKey = `${komp.kode}_nilai`;
                                      const ketKey = `${komp.kode}_ket`;
                                      return (
                                        <tr key={komp.kode} className="border-b border-border last:border-0 hover:bg-muted/10">
                                          <td className="px-4 py-3 text-center font-semibold text-muted-foreground">{idx + 1}.</td>
                                          <td className="px-4 py-3">
                                            <div className="font-bold text-foreground">{komp.kode}</div>
                                            <div className="text-[10px] text-muted-foreground font-medium mt-0.5">{komp.judul}</div>
                                          </td>
                                          <td className="px-4 py-3">
                                            <input
                                              type="text"
                                              disabled={isFormLocked || currentUser?.role === 'Perawat'}
                                              value={form03bData[ketKey] || ''}
                                              onChange={e => setForm03bData({ ...form03bData, [ketKey]: e.target.value })}
                                              className="w-full px-2.5 py-1.5 bg-background border border-border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary text-foreground font-medium"
                                              placeholder="Tulis keterangan lisan..."
                                            />
                                          </td>
                                          <td className="px-4 py-3 text-center">
                                            <div className="flex justify-center gap-4">
                                              <label className="flex items-center gap-1.5 cursor-pointer">
                                                <input
                                                  type="radio"
                                                  name={`${komp.kode}_lisan_nilai`}
                                                  disabled={isFormLocked || currentUser?.role === 'Perawat'}
                                                  checked={form03bData[nilaiKey] === 'K'}
                                                  onChange={() => setForm03bData({ ...form03bData, [nilaiKey]: 'K' })}
                                                  className="text-primary focus:ring-primary w-4 h-4"
                                                />
                                                <span className="font-semibold text-foreground text-xs">K</span>
                                              </label>
                                              <label className="flex items-center gap-1.5 cursor-pointer">
                                                <input
                                                  type="radio"
                                                  name={`${komp.kode}_lisan_nilai`}
                                                  disabled={isFormLocked || currentUser?.role === 'Perawat'}
                                                  checked={form03bData[nilaiKey] === 'BK'}
                                                  onChange={() => setForm03bData({ ...form03bData, [nilaiKey]: 'BK' })}
                                                  className="text-destructive focus:ring-destructive w-4 h-4"
                                                />
                                                <span className="font-semibold text-foreground text-xs">BK</span>
                                              </label>
                                            </div>
                                          </td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              </div>

                              <div className="pt-4 border-t border-border flex justify-end">
                                <button
                                  type="button"
                                  disabled={isFormLocked || isSaveButtonDisabled('form_03b')}
                                  onClick={handleSaveCompetencyForms}
                                  className="px-5 py-2 bg-primary text-primary-foreground font-bold hover:bg-primary/95 rounded-lg text-xs transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  Simpan Hasil Tanya Jawab Lisan (FORM-03 B)
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Active SubTab 03C */}
                          {sertifikatSubTab === 'form_03c' && (
                            <div className="space-y-6">
                              <div className="border-b border-border pb-4 flex justify-between items-center">
                                <div>
                                  <h3 className="text-lg font-bold text-primary">FORM-03 A. INSTRUMEN PENILAIAN PENGETAHUAN TULIS</h3>
                                  <p className="text-xs text-muted-foreground mt-0.5">Hasil ujian kompetensi tertulis sistem online</p>
                                </div>
                                <span className="text-[10px] px-2 py-0.5 bg-primary/10 text-primary border border-primary/20 rounded font-bold">TULIS</span>
                              </div>

                              <div className="p-6 bg-blue-500/5 border border-blue-500/20 dark:bg-blue-950/20 dark:border-blue-500/30 rounded-xl space-y-4 text-xs shadow-sm">
                                <h4 className="font-bold text-foreground text-sm flex items-center gap-2">
                                  <Clock size={16} className="text-blue-500" /> Hasil Ujian Tertulis Asesi
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                                  <div className="space-y-3">
                                    <div>
                                      <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block mb-1">Status Ujian Online</span>
                                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
                                        activePengajuan?.status_ujian === 'Selesai'
                                          ? 'bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400'
                                          : 'bg-yellow-500/10 text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-400'
                                      }`}>
                                        {activePengajuan?.status_ujian || 'Belum'}
                                      </span>
                                    </div>
                                    {activePengajuan?.status_ujian === 'Selesai' && (
                                      <div>
                                        <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block mb-1">Nilai Akhir Ujian</span>
                                        <span className="text-2xl font-black text-foreground">
                                          {activePengajuan?.nilai_ujian}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                  <div className="space-y-3">
                                    <div>
                                      <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block mb-1">Hasil Kelulusan Asesor</span>
                                      <div className="flex items-center gap-4 mt-2">
                                        <label className="flex items-center gap-1.5 cursor-pointer">
                                          <input
                                            type="radio"
                                            name="essayGrade"
                                            disabled={true}
                                            checked={form03cData.grade1 === 'K'}
                                            className="text-primary focus:ring-primary w-4 h-4"
                                          />
                                          <span className="font-semibold text-foreground text-xs">Kompeten (K) (Nilai &gt;= 70)</span>
                                        </label>
                                        <label className="flex items-center gap-1.5 cursor-pointer">
                                          <input
                                            type="radio"
                                            name="essayGrade"
                                            disabled={true}
                                            checked={form03cData.grade1 === 'BK'}
                                            className="text-destructive focus:ring-destructive w-4 h-4"
                                          />
                                          <span className="font-semibold text-foreground text-xs">Belum Kompeten (BK) (Nilai &lt; 70)</span>
                                        </label>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                {activePengajuan?.status_ujian !== 'Selesai' && (
                                  <div className="bg-yellow-500/10 text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-400 p-3 rounded-lg border border-yellow-500/20 mt-2 font-semibold">
                                    Perawat belum menyelesaikan ujian tertulis online. Penilaian akan tersedia otomatis setelah ujian disubmit.
                                  </div>
                                )}
                              </div>

                              {activePengajuan?.status_ujian === 'Selesai' && (
                                <div className="space-y-4">
                                  <h4 className="font-bold text-foreground text-sm flex items-center gap-2 mt-2">
                                    <ClipboardCheck size={16} className="text-primary" /> Rincian Nilai 12 Kompetensi Dasar
                                  </h4>
                                  <div className="overflow-x-auto rounded-lg border border-border">
                                    <table className="w-full text-xs text-left">
                                      <thead className="bg-muted/50 font-bold text-muted-foreground border-b border-border">
                                        <tr>
                                          <th className="px-4 py-3 text-center w-12">NO</th>
                                          <th className="px-4 py-3">KOMPETENSI</th>
                                          <th className="px-4 py-3 text-center w-32">SKOR</th>
                                          <th className="px-4 py-3 text-center w-48">STATUS KELULUSAN</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {get12KompetensiForPengajuan(activePengajuan).map((komp, idx) => {
                                          const score = compScores[komp.kode];
                                          const isTested = score !== null && score !== undefined;
                                          let statusLabel = '-';
                                          let statusClass = 'text-muted-foreground';

                                          if (isTested) {
                                            if (score >= 70) {
                                              statusLabel = 'Lolos';
                                              statusClass = 'bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400 border border-green-500/20';
                                            } else {
                                              statusLabel = 'Belum Lolos';
                                              statusClass = 'bg-destructive/10 text-destructive border border-destructive/20';
                                            }
                                          }

                                          return (
                                            <tr key={komp.kode} className="border-b border-border last:border-0 hover:bg-muted/10">
                                              <td className="px-4 py-3 text-center font-semibold text-muted-foreground">{idx + 1}.</td>
                                              <td className="px-4 py-3">
                                                <div className="font-bold text-foreground">{komp.kode}</div>
                                                <div className="text-[10px] text-muted-foreground font-medium mt-0.5">{komp.judul}</div>
                                              </td>
                                              <td className="px-4 py-3 text-center font-bold text-sm">
                                                {isTested ? `${score}%` : '-'}
                                              </td>
                                              <td className="px-4 py-3 text-center">
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase ${statusClass}`}>
                                                  {statusLabel}
                                                </span>
                                              </td>
                                            </tr>
                                          );
                                        })}
                                        {/* Total Score Row */}
                                        <tr className="bg-muted/30 font-bold border-t border-border">
                                          <td colSpan={2} className="px-4 py-4 text-right text-sm">TOTAL SKOR:</td>
                                          <td className="px-4 py-4 text-center text-base font-black text-foreground">
                                            {activePengajuan?.nilai_ujian}%
                                          </td>
                                          <td className="px-4 py-4 text-center">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-black uppercase ${
                                              parseFloat(activePengajuan?.nilai_ujian || '0') >= 70
                                                ? 'bg-green-500 text-white'
                                                : 'bg-destructive text-white'
                                            }`}>
                                              {parseFloat(activePengajuan?.nilai_ujian || '0') >= 70 ? 'KOMPETEN (K)' : 'BELUM KOMPETEN (BK)'}
                                            </span>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              )}

                              <div className="pt-4 border-t border-border flex justify-end">
                                <button
                                  type="button"
                                  disabled={isFormLocked || isSaveButtonDisabled('form_03c')}
                                  onClick={handleSaveCompetencyForms}
                                  className="px-5 py-2 bg-primary text-primary-foreground font-bold hover:bg-primary/95 rounded-lg text-xs transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  Simpan Lembar Ujian Tulis (FORM-03 A)
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Active SubTab 03D */}
                          {sertifikatSubTab === 'form_03d' && (
                            <div className="space-y-6">
                              <div className="border-b border-border pb-4 flex justify-between items-center">
                                <div>
                                  <h3 className="text-lg font-bold text-primary">FORM-03 D. INSTRUMEN EVALUASI PORTOFOLIO KLINIS</h3>
                                  <p className="text-xs text-muted-foreground mt-0.5">Lembar evaluasi kesesuaian dokumen riwayat medis asesi</p>
                                </div>
                                <span className="text-[10px] px-2 py-0.5 bg-primary/10 text-primary border border-primary/20 rounded font-bold">PORTOFOLIO</span>
                              </div>

                              <div className="space-y-4 text-xs">
                                <div className="overflow-x-auto rounded-lg border border-border">
                                  <table className="w-full text-xs text-left">
                                    <thead className="bg-muted/50 font-bold text-muted-foreground border-b border-border">
                                      <tr>
                                        <th className="px-4 py-3">Nama Dokumen Portofolio Asesi</th>
                                        <th className="px-4 py-3 text-center w-20">Valid (V)</th>
                                        <th className="px-4 py-3 text-center w-20">Asli (A)</th>
                                        <th className="px-4 py-3 text-center w-20">Terkini (T)</th>
                                        <th className="px-4 py-3 text-center w-20">Memadai (K)</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {/* Dokumen 1 */}
                                      <tr className="border-b border-border hover:bg-muted/10">
                                        <td className="px-4 py-3">
                                          <div className="font-bold text-foreground">Dokumen 1:</div>
                                          <div className="text-muted-foreground mt-0.5">{activeComp.form03.dok1}</div>
                                        </td>
                                        {['v1', 'a1', 't1', 'k1'].map(key => (
                                          <td key={key} className="px-4 py-3 text-center">
                                            <input
                                              type="checkbox"
                                              disabled={isFormLocked || currentUser?.role === 'Perawat'}
                                              checked={form03dData[key] || false}
                                              onChange={e => setForm03dData({ ...form03dData, [key]: e.target.checked })}
                                              className="rounded border-border text-primary focus:ring-primary w-4 h-4"
                                            />
                                          </td>
                                        ))}
                                      </tr>

                                      {/* Dokumen 2 */}
                                      <tr className="border-b border-border hover:bg-muted/10">
                                        <td className="px-4 py-3">
                                          <div className="font-bold text-foreground">Dokumen 2:</div>
                                          <div className="text-muted-foreground mt-0.5">{activeComp.form03.dok2}</div>
                                        </td>
                                        {['v2', 'a2', 't2', 'k2'].map(key => (
                                          <td key={key} className="px-4 py-3 text-center">
                                            <input
                                              type="checkbox"
                                              disabled={isFormLocked || currentUser?.role === 'Perawat'}
                                              checked={form03dData[key] || false}
                                              onChange={e => setForm03dData({ ...form03dData, [key]: e.target.checked })}
                                              className="rounded border-border text-primary focus:ring-primary w-4 h-4"
                                            />
                                          </td>
                                        ))}
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                              </div>

                              <div className="pt-4 border-t border-border flex justify-end">
                                <button
                                  type="button"
                                  disabled={isFormLocked || isSaveButtonDisabled('form_03d')}
                                  onClick={handleSaveCompetencyForms}
                                  className="px-5 py-2 bg-primary text-primary-foreground font-bold hover:bg-primary/95 rounded-lg text-xs transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  Simpan Evaluasi Portofolio (FORM-03 D)
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Active SubTab 04 */}
                          {sertifikatSubTab === 'form_04' && (
                            <div className="space-y-6">
                              <div className="border-b border-border pb-4 flex justify-between items-center">
                                <div>
                                  <h3 className="text-lg font-bold text-primary">FORM-04. PERSETUJUAN ASESMEN DAN KERAHASIAN</h3>
                                  <p className="text-xs text-muted-foreground mt-0.5">Kesepakatan jadwal, lokasi, dan jaminan keamanan data asesi</p>
                                </div>
                                <span className="text-[10px] px-2 py-0.5 bg-primary/10 text-primary border border-primary/20 rounded font-bold">PERSETUJUAN</span>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                                <div>
                                  <label className="block text-xs font-semibold mb-1">Hari & Tanggal Ujian</label>
                                  <input
                                    type="text"
                                    disabled={isFormLocked || currentUser?.role === 'Perawat'}
                                    value={form04Data.hariTanggal || ''}
                                    onChange={e => setForm04Data({ ...form04Data, hariTanggal: e.target.value })}
                                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary text-foreground font-medium"
                                    placeholder="Contoh: Senin, 25 Mei 2026"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-semibold mb-1">Waktu Pelaksanaan</label>
                                  <input
                                    type="text"
                                    disabled={isFormLocked || currentUser?.role === 'Perawat'}
                                    value={form04Data.waktu || ''}
                                    onChange={e => setForm04Data({ ...form04Data, waktu: e.target.value })}
                                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary text-foreground font-medium"
                                    placeholder="Contoh: 09:00 - 11:30 WIB"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-semibold mb-1">Tempat / Ruangan</label>
                                  <input
                                    type="text"
                                    disabled={isFormLocked || currentUser?.role === 'Perawat'}
                                    value={form04Data.tempat || ''}
                                    onChange={e => setForm04Data({ ...form04Data, tempat: e.target.value })}
                                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary text-foreground font-medium"
                                    placeholder="Contoh: Poli Rawat Inap RS"
                                  />
                                </div>
                              </div>

                              <div className="bg-muted/10 border border-border rounded-xl overflow-hidden text-xs my-4">
                                <table className="w-full text-left border-collapse">
                                  <thead>
                                    <tr className="bg-muted/30 border-b border-border">
                                      <th className="px-3 py-2 w-10 text-center font-bold">No</th>
                                      <th className="px-3 py-2 font-bold">Pertanyaan</th>
                                      <th className="px-3 py-2 w-16 text-center font-bold">Ya</th>
                                      <th className="px-3 py-2 w-16 text-center font-bold">Tidak</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-border">
                                    {[
                                      { key: 'tujuanJelas', no: 1, label: 'Apakah tujuan asesmen dan konsekuensi sudah dijelaskan dengan benar?' },
                                      { key: 'standarJelas', no: 2, label: 'Apakah asesi telah menerima dan dijelaskan standar kompetensi yang akan di asess?' },
                                      { key: 'buktiDimengerti', no: 3, label: 'Apakah asesi mengerti bukti apa saja yang akan dikumpulkan?' },
                                      { key: 'hakJelas', no: 4, label: 'Apakah hak-hak asesi selama asesmen telah di jelaskan dengan rinci?' },
                                      { key: 'bandingJelas', no: 5, label: 'Apakah asesi telah dijelaskan dengan rinci proses banding terhadap asesmen?' },
                                      { key: 'kerahasiaanJelas', no: 6, label: 'Apakah asesi telah mengetahui bahwa bukti-bukti informasi yang dikumpulkan hanya untuk kepentingan assesmen dan disimpan serta di akses hanya oleh orang tertentu?' },
                                    ].map((q) => (
                                      <tr key={q.key} className="hover:bg-muted/5 transition-colors">
                                        <td className="px-3 py-2 text-center text-muted-foreground">{q.no}</td>
                                        <td className="px-3 py-2 text-foreground font-medium">{q.label}</td>
                                        <td className="px-3 py-2 text-center">
                                          <input
                                            type="radio"
                                            name={`form04_${q.key}`}
                                            disabled={isFormLocked || currentUser?.role !== 'Perawat'}
                                            checked={form04Data[q.key] === true}
                                            onChange={() => setForm04Data({ ...form04Data, [q.key]: true })}
                                            className="w-4 h-4 text-primary focus:ring-primary cursor-pointer"
                                          />
                                        </td>
                                        <td className="px-3 py-2 text-center">
                                          <input
                                            type="radio"
                                            name={`form04_${q.key}`}
                                            disabled={isFormLocked || currentUser?.role !== 'Perawat'}
                                            checked={form04Data[q.key] === false}
                                            onChange={() => setForm04Data({ ...form04Data, [q.key]: false })}
                                            className="w-4 h-4 text-primary focus:ring-primary cursor-pointer"
                                          />
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>

                              <div className="p-4 bg-muted/20 border border-border rounded-xl text-xs space-y-4">
                                <h4 className="font-bold text-foreground border-b border-border pb-1">Tanda Tangan Pernyataan Komitmen Asesmen</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-center">
                                  {/* Asesi Signature Box */}
                                  <div className="p-4 border border-border bg-background rounded-lg flex flex-col justify-between items-center min-h-[200px] space-y-3">
                                    <span className="font-bold text-muted-foreground uppercase text-[10px]">Tanda Tangan Asesi (Perawat)</span>
                                    <SignaturePad
                                      value={typeof form04Data.asesiSign === 'string' && form04Data.asesiSign.startsWith('data:image') ? form04Data.asesiSign : null}
                                      onChange={(base64) => setForm04Data({ ...form04Data, asesiSign: base64 })}
                                      onClear={() => setForm04Data({ ...form04Data, asesiSign: null })}
                                      disabled={isFormLocked || currentUser?.role !== 'Perawat'}
                                      label="Tanda Tangan Asesi"
                                    />
                                    <span className="text-xs font-bold text-foreground">{activeNurse.nama}</span>
                                  </div>

                                  {/* Asesor Signature Box */}
                                  <div className="p-4 border border-border bg-background rounded-lg flex flex-col justify-between items-center min-h-[200px] space-y-3">
                                    <span className="font-bold text-muted-foreground uppercase text-[10px]">Tanda Tangan Asesor</span>
                                    <SignaturePad
                                      value={typeof form04Data.asesorSign === 'string' && form04Data.asesorSign.startsWith('data:image') ? form04Data.asesorSign : null}
                                      onChange={(base64) => setForm04Data({ ...form04Data, asesorSign: base64 })}
                                      onClear={() => setForm04Data({ ...form04Data, asesorSign: null })}
                                      disabled={isFormLocked || currentUser?.role === 'Perawat'}
                                      label="Tanda Tangan Asesor"
                                    />
                                    <span className="text-xs font-bold text-foreground">
                                      {userData.find(u => String(u.id) === String(activePengajuan?.id_asesor))?.nama || 'Asesor Pilihan RS'}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="pt-4 border-t border-border flex justify-end">
                                <button
                                  type="button"
                                  disabled={isFormLocked || isSaveButtonDisabled('form_04')}
                                  onClick={handleSaveCompetencyForms}
                                  className="px-5 py-2 bg-primary text-primary-foreground font-bold hover:bg-primary/95 rounded-lg text-xs transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  Simpan Persetujuan (FORM-04)
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Active SubTab 05 */}
                          {sertifikatSubTab === 'form_05' && (
                            <div className="space-y-6">
                              <div className="border-b border-border pb-4 flex justify-between items-center">
                                <div>
                                  <h3 className="text-lg font-bold text-primary">FORM-05. DAFTAR CEK VERIFIKASI PRA-ASESMEN</h3>
                                  <p className="text-xs text-muted-foreground mt-0.5">Penilaian kelayakan seluruh instrumen, akomodasi, dan berkas ujian sebelum dimulai</p>
                                </div>
                                <span className="text-[10px] px-2 py-0.5 bg-primary/10 text-primary border border-primary/20 rounded font-bold">PRA-ASESMEN</span>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                                {[
                                  { key: 'cekMandiri', label: 'Verifikasi Asesmen Mandiri Asesi Lengkap' },
                                  { key: 'cekBukti', label: 'Dokumen Bukti STR/SIP Telah Tervalidasi' },
                                  { key: 'cekMetode', label: 'Metode Pengumpulan Bukti Disepakati Bersama' },
                                  { key: 'cekPerangkat', label: 'Seluruh Perangkat Asesmen Tersedia & Siap Digunakan' }
                                ].map(c => (
                                  <label key={c.key} className="flex items-center gap-2.5 p-3 rounded-lg border border-border bg-background hover:bg-muted/10 cursor-pointer select-none">
                                    <input
                                      type="checkbox"
                                      disabled={isFormLocked || currentUser?.role === 'Perawat'}
                                      checked={form05Data[c.key] || false}
                                      onChange={e => setForm05Data({ ...form05Data, [c.key]: e.target.checked })}
                                      className="rounded border-border text-primary focus:ring-primary w-4 h-4"
                                    />
                                    <span className="font-semibold text-foreground">{c.label}</span>
                                  </label>
                                ))}
                              </div>

                              <div>
                                <label className="block text-xs font-semibold mb-1">Rekomendasi Kesiapan Pra-Asesmen</label>
                                <input
                                  type="text"
                                  disabled={isFormLocked || currentUser?.role === 'Perawat'}
                                  value={form05Data.rekomendasi || ''}
                                  onChange={e => setForm05Data({ ...form05Data, rekomendasi: e.target.value })}
                                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary text-foreground font-medium"
                                  placeholder="Rekomendasi..."
                                />
                              </div>

                              <div className="pt-4 border-t border-border flex justify-end">
                                <button
                                  type="button"
                                  disabled={isFormLocked || isSaveButtonDisabled('form_05')}
                                  onClick={handleSaveCompetencyForms}
                                  className="px-5 py-2 bg-primary text-primary-foreground font-bold hover:bg-primary/95 rounded-lg text-xs transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  Simpan Verifikasi Pra-Asesmen (FORM-05)
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Active SubTab 06 */}
                          {sertifikatSubTab === 'form_06' && (
                            <div className="space-y-6">
                              <div className="border-b border-border pb-4 flex justify-between items-center">
                                <div>
                                  <h3 className="text-lg font-bold text-primary">FORM-06. DAFTAR CEK PELAKSANAAN ASESMEN</h3>
                                  <p className="text-xs text-muted-foreground mt-0.5">Checklist review keadilan dan tata tertib pelaksanaan oleh asesor</p>
                                </div>
                                <span className="text-[10px] px-2 py-0.5 bg-primary/10 text-primary border border-primary/20 rounded font-bold">PELAKSANAAN</span>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                                {[
                                  { key: 'observasiOk', label: 'Pelaksanaan Observasi Berjalan Sesuai Rencana' },
                                  { key: 'lisanOk', label: 'Pertanyaan Lisan Dinilai Secara Obyektif & Adil' },
                                  { key: 'tulisOk', label: 'Hasil Ujian Tertulis Sesuai Dengan Aturan Penilaian' },
                                  { key: 'portofolioOk', label: 'Dokumen Portofolio Asli, Sah, & Sesuai PK Asesi' }
                                ].map(c => (
                                  <label key={c.key} className="flex items-center gap-2.5 p-3 rounded-lg border border-border bg-background hover:bg-muted/10 cursor-pointer select-none">
                                    <input
                                      type="checkbox"
                                      disabled={isFormLocked || currentUser?.role === 'Perawat'}
                                      checked={form06Data[c.key] || false}
                                      onChange={e => setForm06Data({ ...form06Data, [c.key]: e.target.checked })}
                                      className="rounded border-border text-primary focus:ring-primary w-4 h-4"
                                    />
                                    <span className="font-semibold text-foreground">{c.label}</span>
                                  </label>
                                ))}
                              </div>

                              <div>
                                <label className="block text-xs font-semibold mb-1">Catatan Pelaksanaan Asesmen</label>
                                <textarea
                                  rows="3"
                                  disabled={isFormLocked || currentUser?.role === 'Perawat'}
                                  value={form06Data.catatanPelaksanaan || ''}
                                  onChange={e => setForm06Data({ ...form06Data, catatanPelaksanaan: e.target.value })}
                                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary text-foreground font-medium"
                                  placeholder="Catatan pelaksanaan..."
                                />
                              </div>

                              <div className="pt-4 border-t border-border flex justify-end">
                                <button
                                  type="button"
                                  disabled={isFormLocked || isSaveButtonDisabled('form_06')}
                                  onClick={handleSaveCompetencyForms}
                                  className="px-5 py-2 bg-primary text-primary-foreground font-bold hover:bg-primary/95 rounded-lg text-xs transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  Simpan Pelaksanaan (FORM-06)
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Active SubTab 07 */}
                          {sertifikatSubTab === 'form_07' && (
                            <div className="space-y-6">
                              <div className="border-b border-border pb-4 flex justify-between items-center">
                                <div>
                                  <h3 className="text-lg font-bold text-primary">FORM-07. MELAKSANAKAN ASESMEN & REKOMENDASI</h3>
                                  <p className="text-xs text-muted-foreground mt-0.5">Penetapan kelulusan kompetensi dan penerbitan sertifikasi</p>
                                </div>
                                <span className="text-[10px] px-2 py-0.5 bg-primary/10 text-primary border border-primary/20 rounded font-bold">REKOMENDASI</span>
                              </div>

                              <div className={`grid grid-cols-1 ${currentUser?.role === 'Perawat' ? '' : 'md:grid-cols-2'} gap-6 text-xs`}>
                                <div className="space-y-3.5">
                                  <h4 className="font-bold text-foreground border-b border-border pb-1">Keputusan Kelulusan Kompetensi</h4>
                                  <div className="flex items-center gap-6 mt-2">
                                    <label className="flex items-center gap-1.5 cursor-pointer">
                                      <input
                                        type="radio"
                                        name="keputusanKelulusan"
                                        disabled={isFormLocked || currentUser?.role === 'Perawat'}
                                        checked={form07Data.keputusan === 'Kompeten'}
                                        onChange={() => setForm07Data({ ...form07Data, keputusan: 'Kompeten' })}
                                        className="text-primary focus:ring-primary w-4 h-4"
                                      />
                                      <span className="font-bold text-foreground text-xs">Kompeten (K)</span>
                                    </label>
                                    <label className="flex items-center gap-1.5 cursor-pointer">
                                      <input
                                        type="radio"
                                        name="keputusanKelulusan"
                                        disabled={isFormLocked || currentUser?.role === 'Perawat'}
                                        checked={form07Data.keputusan === 'Belum Kompeten'}
                                        onChange={() => setForm07Data({ ...form07Data, keputusan: 'Belum Kompeten' })}
                                        className="text-destructive focus:ring-destructive w-4 h-4"
                                      />
                                      <span className="font-bold text-foreground text-xs">Belum Kompeten (BK)</span>
                                    </label>
                                  </div>

                                  <div className="pt-2">
                                    <label className="block text-xs font-semibold mb-1">Tindak Lanjut & Rekomendasi Sertifikasi</label>
                                    <input
                                      type="text"
                                      disabled={isFormLocked || currentUser?.role === 'Perawat'}
                                      value={form07Data.tindakLanjut || ''}
                                      onChange={e => setForm07Data({ ...form07Data, tindakLanjut: e.target.value })}
                                      className="w-full px-3 py-2 bg-background border border-border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary text-foreground font-medium"
                                      placeholder="Contoh: Direkomendasikan mendapatkan sertifikat PK 1"
                                    />
                                  </div>
                                </div>

                                {currentUser?.role !== 'Perawat' && (
                                  <div>
                                    <label className="block text-xs font-semibold mb-1">Catatan & Evaluasi Akhir Asesor</label>
                                    <textarea
                                      rows="5"
                                      disabled={isFormLocked || currentUser?.role === 'Perawat'}
                                      value={form07Data.catatanAsesor || ''}
                                      onChange={e => setForm07Data({ ...form07Data, catatanAsesor: e.target.value })}
                                      className="w-full px-3 py-2 bg-background border border-border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary text-foreground font-medium"
                                      placeholder="Tulis saran tindak lanjut/perbaikan berkelanjutan..."
                                    />
                                  </div>
                                )}
                              </div>

                              <div className="pt-4 border-t border-border flex justify-end">
                                <button
                                  type="button"
                                  disabled={isFormLocked || isSaveButtonDisabled('form_07')}
                                  onClick={handleSaveCompetencyForms}
                                  className="px-5 py-2 bg-primary text-primary-foreground font-bold hover:bg-primary/95 rounded-lg text-xs transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  Simpan Hasil & Rekomendasi (FORM-07)
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Active SubTab 08 */}
                          {sertifikatSubTab === 'form_08' && (
                            <div className="space-y-6">
                              <div className="border-b border-border pb-4 flex justify-between items-center">
                                <div>
                                  <h3 className="text-lg font-bold text-primary">FORM-08. UMPAN BALIK ASESMEN DARI ASESI</h3>
                                  <p className="text-xs text-muted-foreground mt-0.5">Lembar evaluasi asesi mengenai keadilan, kelengkapan fasilitas, dan kejujuran asesmen</p>
                                </div>
                                <span className="text-[10px] px-2 py-0.5 bg-primary/10 text-primary border border-primary/20 rounded font-bold">UMPAN BALIK</span>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                                {[
                                  { key: 'penjelasanOk', label: 'Mendapat Penjelasan Lengkap Terkait Metode & Hasil' },
                                  { key: 'kesempatanOk', label: 'Diberikan Kesempatan Umpan Balik Secara Terbuka' },
                                  { key: 'adilOk', label: 'Proses Asesmen Adil & Sesuai Rencana Awal' }
                                ].map(c => (
                                  <label key={c.key} className="flex items-center gap-2.5 p-3 rounded-lg border border-border bg-background hover:bg-muted/10 cursor-pointer select-none">
                                    <input
                                      type="checkbox"
                                      disabled={isFormLocked || currentUser?.role !== 'Perawat'}
                                      checked={form08Data[c.key] || false}
                                      onChange={e => setForm08Data({ ...form08Data, [c.key]: e.target.checked })}
                                      className="rounded border-border text-primary focus:ring-primary w-4 h-4"
                                    />
                                    <span className="font-semibold text-foreground">{c.label}</span>
                                  </label>
                                ))}
                              </div>

                              <div>
                                <label className="block text-xs font-semibold mb-1">Pernyataan & Masukan dari Asesi (Diisi Perawat / Asesi)</label>
                                <textarea
                                  rows="4"
                                  disabled={isFormLocked || currentUser?.role !== 'Perawat'}
                                  value={form08Data.catatanAsesi || ''}
                                  onChange={e => setForm08Data({ ...form08Data, catatanAsesi: e.target.value })}
                                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary text-foreground font-medium"
                                  placeholder="Berikan saran, masukan, atau kendala asesi..."
                                />
                              </div>

                              <div className="pt-4 border-t border-border flex justify-end">
                                <button
                                  type="button"
                                  disabled={isFormLocked || isSaveButtonDisabled('form_08')}
                                  onClick={handleSaveCompetencyForms}
                                  className="px-5 py-2 bg-primary text-primary-foreground font-bold hover:bg-primary/95 rounded-lg text-xs transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  Simpan Umpan Balik (FORM-08)
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Active SubTab 09 */}
                          {sertifikatSubTab === 'form_09' && (
                            <div className="space-y-6">
                              <div className="border-b border-border pb-4 flex justify-between items-center">
                                <div>
                                  <h3 className="text-lg font-bold text-primary">FORM-09. KAJI ULANG PELAKSANAAN ASESMEN</h3>
                                  <p className="text-xs text-muted-foreground mt-0.5">Penetapan evaluasi mutu sistem asesmen berkelanjutan</p>
                                </div>
                                <span className="text-[10px] px-2 py-0.5 bg-primary/10 text-primary border border-primary/20 rounded font-bold">KAJI ULANG</span>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                                {[
                                  { key: 'konsistensiOk', label: 'Pelaksanaan Konsisten Sesuai Prosedur Ujian' },
                                  { key: 'keadilanOk', label: 'Prinsip Keadilan Klinis Dijunjung Tinggi' },
                                  { key: 'perbaikanOk', label: 'Terdapat Rekomendasi/Perbaikan Mutu Ke Depan' }
                                ].map(c => (
                                  <label key={c.key} className="flex items-center gap-2.5 p-3 rounded-lg border border-border bg-background hover:bg-muted/10 cursor-pointer select-none">
                                    <input
                                      type="checkbox"
                                      disabled={isFormLocked || currentUser?.role === 'Perawat'}
                                      checked={form09Data[c.key] || false}
                                      onChange={e => setForm09Data({ ...form09Data, [c.key]: e.target.checked })}
                                      className="rounded border-border text-primary focus:ring-primary w-4 h-4"
                                    />
                                    <span className="font-semibold text-foreground">{c.label}</span>
                                  </label>
                                ))}
                              </div>

                              <div>
                                <label className="block text-xs font-semibold mb-1">Rekomendasi Mutu / Tindak Lanjut Asesmen</label>
                                <textarea
                                  rows="4"
                                  disabled={isFormLocked || currentUser?.role === 'Perawat'}
                                  value={form09Data.rekomendasiKajiUlang || ''}
                                  onChange={e => setForm09Data({ ...form09Data, rekomendasiKajiUlang: e.target.value })}
                                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary text-foreground font-medium"
                                  placeholder="Tuliskan rekomendasi peningkatan..."
                                />
                              </div>

                              <div className="pt-4 border-t border-border flex justify-end">
                                <button
                                  type="button"
                                  disabled={isFormLocked || isSaveButtonDisabled('form_09')}
                                  onClick={handleSaveCompetencyForms}
                                  className="px-5 py-2 bg-primary text-primary-foreground font-bold hover:bg-primary/95 rounded-lg text-xs transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  Simpan Kaji Ulang (FORM-09)
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Active SubTab Ujian Kompetensi */}
                          {sertifikatSubTab === 'ujian_kompetensi' && ujianData && (
                            <div className="space-y-6 relative">
                              <div className="border-b border-border pb-4 flex justify-between items-center sticky top-0 bg-card z-10 pt-2 shadow-sm">
                                <div>
                                  <h3 className="text-lg font-bold text-primary flex items-center gap-2"><Clock size={20} /> Ujian Kompetensi</h3>
                                  <p className="text-xs text-muted-foreground mt-0.5">Selesaikan seluruh soal sebelum waktu habis</p>
                                </div>
                                <div className="text-right px-4 py-2 bg-secondary/30 rounded-lg border border-border">
                                  <span className={`text-xl font-bold tracking-wider ${ujianTimeLeft < 300 ? 'text-destructive animate-pulse' : 'text-primary'}`}>
                                    {Math.floor(ujianTimeLeft / 60).toString().padStart(2, '0')}:{(ujianTimeLeft % 60).toString().padStart(2, '0')}
                                  </span>
                                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Sisa Waktu</p>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 min-h-[65vh]">
                                {/* Kolom Kiri: Soal Aktif */}
                                <div className="md:col-span-3 space-y-6">
                                  {ujianData[currentUjianIndex] && (() => {
                                    const soal = ujianData[currentUjianIndex];
                                    return (
                                      <div className="p-6 rounded-xl border border-border bg-card shadow-sm h-full flex flex-col">
                                        <h4 className="font-bold text-base mb-6 leading-relaxed text-foreground flex items-start">
                                          <span className="text-primary mr-3 font-black text-xl bg-primary/10 px-3 py-1.5 rounded-md shadow-sm">{currentUjianIndex + 1}</span>
                                          <span className="mt-1">{soal.pertanyaan}</span>
                                        </h4>
                                        <div className="space-y-3 pl-2 sm:pl-12 flex-grow">
                                          {['A', 'B', 'C', 'D', 'E'].map(opt => {
                                            const opsiText = soal[`opsi_${opt.toLowerCase()}`];
                                            if (!opsiText) return null;
                                            return (
                                              <label key={opt} className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-all ${jawabanUjian[soal.id_soal] === opt ? 'border-primary bg-primary/5 shadow-md scale-[1.01]' : 'border-border bg-background hover:bg-muted/50 hover:border-primary/40'}`}>
                                                <input
                                                  type="radio"
                                                  name={`soal_${soal.id_soal}`}
                                                  value={opt}
                                                  checked={jawabanUjian[soal.id_soal] === opt}
                                                  onChange={() => handleJawabanSelect(soal.id_soal, opt)}
                                                  className="mt-1 w-5 h-5 text-primary focus:ring-primary border-muted-foreground/30"
                                                />
                                                <span className="text-sm font-medium text-foreground leading-relaxed">
                                                  <strong className="text-primary mr-2 font-bold">{opt}.</strong> {opsiText}
                                                </span>
                                              </label>
                                            );
                                          })}
                                        </div>

                                        <div className="flex justify-between items-center mt-8 pt-6 border-t border-border">
                                          <button
                                            type="button"
                                            disabled={currentUjianIndex === 0}
                                            onClick={() => setCurrentUjianIndex(prev => prev - 1)}
                                            className="px-5 py-2.5 bg-secondary text-secondary-foreground font-bold hover:bg-secondary/80 rounded-lg text-sm transition-all disabled:opacity-50 flex items-center gap-2"
                                          >
                                            <ChevronLeft size={18} /> Sebelumnya
                                          </button>

                                          {currentUjianIndex < ujianData.length - 1 ? (
                                            <button
                                              type="button"
                                              onClick={() => setCurrentUjianIndex(prev => prev + 1)}
                                              className="px-5 py-2.5 bg-primary text-primary-foreground font-bold hover:bg-primary/90 rounded-lg text-sm transition-all shadow-md flex items-center gap-2"
                                            >
                                              Selanjutnya <ChevronLeft size={18} className="rotate-180" />
                                            </button>
                                          ) : (
                                            <button
                                              type="button"
                                              disabled={isSubmittingUjian}
                                              onClick={() => handleSubmitUjian(false)}
                                              className="px-6 py-2.5 bg-green-600 text-white font-bold hover:bg-green-700 rounded-lg text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-50 flex items-center gap-2"
                                            >
                                              {isSubmittingUjian ? 'Menyimpan...' : 'Selesai'}
                                              <CheckCircle size={18} />
                                            </button>
                                          )}
                                        </div>
                                      </div>
                                    );
                                  })()}
                                </div>

                                {/* Kolom Kanan: Navigasi Nomor Soal */}
                                <div className="md:col-span-1 border border-border bg-card rounded-xl shadow-sm p-4 h-full">
                                  <h4 className="font-bold text-sm text-foreground mb-4 pb-2 border-b border-border flex items-center gap-2"><CheckCircle size={16} className="text-primary" /> Navigasi Soal</h4>
                                  <div className="grid grid-cols-4 gap-2 max-h-[50vh] overflow-y-auto pr-2 pb-2">
                                    {ujianData.map((soal, idx) => {
                                      const isAnswered = !!jawabanUjian[soal.id_soal];
                                      const isActive = currentUjianIndex === idx;
                                      return (
                                        <button
                                          key={soal.id_soal}
                                          onClick={() => setCurrentUjianIndex(idx)}
                                          className={`py-2 text-xs font-bold rounded transition-all border
                                            ${isActive ? 'ring-2 ring-primary ring-offset-1 ring-offset-background' : ''}
                                            ${isAnswered ? 'bg-green-500 text-white border-green-600 shadow-sm' : 'bg-muted text-muted-foreground border-border hover:bg-secondary'}
                                          `}
                                        >
                                          {idx + 1}
                                        </button>
                                      );
                                    })}
                                  </div>
                                  <div className="mt-4 pt-4 border-t border-border space-y-2">
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                      <div className="w-3 h-3 bg-green-500 rounded-full"></div> Sudah Dijawab
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                      <div className="w-3 h-3 bg-muted border border-border rounded-full"></div> Belum Dijawab
                                    </div>
                                    <div className="mt-4 pt-2">
                                      <button
                                        type="button"
                                        disabled={isSubmittingUjian}
                                        onClick={() => handleSubmitUjian(false)}
                                        className="w-full px-4 py-2 bg-green-600 text-white font-bold hover:bg-green-700 rounded-lg text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                                      >
                                        <CheckCircle size={16} /> {isSubmittingUjian ? 'Menyimpan...' : 'Submit Ujian'}
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                          {sertifikatSubTab === 'sertifikat' && (
                            <div className="space-y-6">
                              <div className="border-b border-border pb-4 flex justify-between items-center print:hidden">
                                <div>
                                  <h3 className="text-lg font-bold text-primary flex items-center gap-2"><Award size={20} /> Sertifikat Kompetensi</h3>
                                  <p className="text-xs text-muted-foreground mt-0.5">Pratinjau dan cetak sertifikat asesi.</p>
                                </div>
                                <button
                                  onClick={handleSimpanSertifikat}
                                  className="px-4 py-2 bg-primary text-white text-sm font-bold rounded flex items-center gap-2"
                                >
                                  <Printer size={16} /> Simpan & Cetak Sertifikat
                                </button>
                              </div>

                              {/* CONFIGURATION INPUT FOR DATES */}
                              <div className="p-4 bg-muted/40 border border-border rounded-lg grid grid-cols-1 md:grid-cols-4 gap-4 print:hidden items-end">
                                <div className="space-y-1">
                                  <label className="text-xs font-bold text-foreground">Tanggal Mulai Asesmen</label>
                                  <input
                                    type="date"
                                    value={customTglMulaiAsesmen}
                                    onChange={(e) => setCustomTglMulaiAsesmen(e.target.value)}
                                    className="w-full text-sm bg-background border border-border rounded p-2 focus:ring-1 focus:ring-primary focus:outline-none text-foreground"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-xs font-bold text-foreground">Tanggal Selesai Asesmen</label>
                                  <input
                                    type="date"
                                    value={customTglSelesaiAsesmen}
                                    onChange={(e) => setCustomTglSelesaiAsesmen(e.target.value)}
                                    className="w-full text-sm bg-background border border-border rounded p-2 focus:ring-1 focus:ring-primary focus:outline-none text-foreground"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-xs font-bold text-foreground">Tanggal Ditetapkan</label>
                                  <input
                                    type="date"
                                    value={customTglDitetapkan}
                                    onChange={(e) => setCustomTglDitetapkan(e.target.value)}
                                    className="w-full text-sm bg-background border border-border rounded p-2 focus:ring-1 focus:ring-primary focus:outline-none text-foreground"
                                  />
                                </div>
                                <div className="pt-2">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setCustomTglMulaiAsesmen('');
                                      setCustomTglSelesaiAsesmen('');
                                      setCustomTglDitetapkan('');
                                    }}
                                    className="w-full py-2 bg-secondary hover:bg-secondary/80 text-foreground text-xs font-bold rounded border border-border transition-all"
                                    title="Klik untuk mereset dan memuat tanggal default dari asesi yang sedang aktif"
                                  >
                                    Reset ke Default Asesi
                                  </button>
                                </div>
                              </div>

                              <style>
                                {`
                                  .sertifikat-container-scroll {
                                    overflow-x: auto;
                                    max-width: 100%;
                                  }
                                  .printable-sertifikat {
                                    background: #e2e8f0;
                                    padding: 2rem 0;
                                  }
                                  .sertifikat-page {
                                    width: 297mm;
                                    height: 210mm;
                                    box-sizing: border-box;
                                    position: relative;
                                    overflow: hidden;
                                    background-color: white;
                                    font-family: Georgia, Cambria, "Times New Roman", Times, serif;
                                  }
                                  .sertifikat-border-outer {
                                    border: 2px solid #002d62;
                                    padding: 8px;
                                    box-sizing: border-box;
                                    width: 100%;
                                    height: 100%;
                                    position: relative;
                                  }
                                  .sertifikat-border-inner {
                                    border: 4px double #002d62;
                                    box-sizing: border-box;
                                    width: 100%;
                                    height: 100%;
                                    padding: 12px 24px 24px 24px;
                                    position: relative;
                                  }
                                  @media print {
                                    @page { 
                                      size: A4 landscape; 
                                      margin: 0; 
                                    }
                                    body { 
                                      -webkit-print-color-adjust: exact !important; 
                                      print-color-adjust: exact !important; 
                                      background-color: white !important;
                                      margin: 0 !important;
                                      padding: 0 !important;
                                    }
                                    /* Hide all components except the print container */
                                    body * {
                                      visibility: hidden !important;
                                    }
                                    .printable-sertifikat, .printable-sertifikat * {
                                      visibility: visible !important;
                                    }
                                    .printable-sertifikat {
                                      position: absolute !important;
                                      left: 0 !important;
                                      top: 0 !important;
                                      width: 297mm !important;
                                      height: auto !important;
                                      margin: 0 !important;
                                      padding: 0 !important;
                                      background: white !important;
                                    }
                                    .sertifikat-page {
                                      width: 297mm !important;
                                      height: 210mm !important;
                                      max-width: 297mm !important;
                                      max-height: 210mm !important;
                                      min-width: 297mm !important;
                                      min-height: 210mm !important;
                                      page-break-after: always !important;
                                      page-break-inside: avoid !important;
                                      break-after: page !important;
                                      box-sizing: border-box !important;
                                      margin: 0 !important;
                                      padding: 0 !important;
                                      position: relative !important;
                                      overflow: hidden !important;
                                      background-color: white !important;
                                    }
                                    .sertifikat-border-outer {
                                      border: 2px solid #002d62 !important;
                                      padding: 8px !important;
                                      box-sizing: border-box !important;
                                      width: 297mm !important;
                                      height: 210mm !important;
                                      position: relative !important;
                                    }
                                    .sertifikat-border-inner {
                                      border: 4px double #002d62 !important;
                                      box-sizing: border-box !important;
                                      width: 100% !important;
                                      height: 100% !important;
                                      padding: 12px 24px 24px 24px !important;
                                      position: relative !important;
                                    }
                                  }
                                `}
                              </style>

                              <div className="sertifikat-container-scroll print:overflow-visible">
                                <div className="printable-sertifikat space-y-8 print:space-y-0">
                                  {/* HALAMAN 1 */}
                                  <div className="sertifikat-page bg-white text-black mx-auto font-serif relative shadow-md print:shadow-none" id="print-area">
                                    <div className="sertifikat-border-outer">
                                      <div className="sertifikat-border-inner">
                                        {/* BACKGROUND WATERMARK */}
                                        <div
                                          className="absolute inset-0 z-0 opacity-100 pointer-events-none"
                                          style={{ backgroundImage: `url(${certificateBackground})`, backgroundSize: '100% 100%', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}
                                        ></div>

                                        <div className="relative z-10 px-8 pt-0 pb-2 flex flex-col justify-between" style={{ height: 'calc(210mm - 60px)' }}>
                                          {/* KOP SURAT */}
                                          <div className="flex justify-between items-end relative pb-4 mb-4" style={{ minHeight: '100px' }}>
                                            {/* Left Kudus Crest Logo */}
                                            <div className="absolute left-0 top-[4px]">
                                              <img src={logoKudus} alt="Logo Pemkab" className="h-[88px] w-auto object-contain" />
                                            </div>

                                            {/* Center Text */}
                                            <div className="text-center w-full px-[240px] pb-1">
                                              <h1 className="text-[13px] font-bold uppercase tracking-wide text-gray-800">Pemerintah Kabupaten Kudus</h1>
                                              <h2 className="text-[16px] font-bold uppercase tracking-wide mt-0.5 text-blue-900">Rumah Sakit Umum Daerah dr.LOEKMONO HADI</h2>
                                              <p className="text-[9.5px] mt-0.5 text-gray-600 font-sans">Jl. dr. Lukmonohadi No. 19 Kudus 59348 ☎ (0291) 444001 📠 (0291) 438195</p>
                                              <p className="text-[9.5px] text-gray-600 font-sans">Email : rsuddrloekmonohadi@kuduskab.go.id ; rsudkudus@yahoo.co.id</p>
                                              <p className="text-[9.5px] text-gray-600 font-sans">Website : www.rsuddrloekmonohadi.kuduskab.go.id</p>
                                            </div>

                                            {/* Right Logos */}
                                            <div className="absolute right-0 top-0 flex items-center gap-3 h-full pb-4">
                                              <img src={logoRS} alt="Logo RSUD" className="h-[78px] w-auto object-contain" />
                                              <img src={logoLars} alt="Logo LARS" className="h-[78px] w-auto object-contain" />
                                            </div>

                                            {/* Divider Line */}
                                            <div className="absolute bottom-0 left-0 right-0 border-b-[3px] border-black"></div>
                                          </div>

                                          {/* CENTER BODY CONTENT */}
                                          <div className="flex-1 flex flex-col justify-center my-2 space-y-4">
                                            {/* JUDUL */}
                                            <div className="text-center">
                                              <h3 style={{ fontFamily: '"Great Vibes", cursive' }} className="text-5xl sm:text-6xl font-normal text-blue-900 leading-none">Sertifikat Kompetensi</h3>
                                              <div className="text-center text-xs mt-1 text-gray-700 font-sans">
                                                Nomor : {sertifikatData?.nomor_sertifikat || "11/.../ASKOM/BIDKEP/" + new Date().getFullYear()}
                                              </div>
                                            </div>

                                            {/* CONTENT */}
                                            <div className="space-y-2 text-sm leading-relaxed text-center font-serif text-gray-900">
                                              <p className="text-center text-gray-800">Menyatakan bahwa :</p>
                                              <div className="flex flex-col items-center my-1">
                                                <h2 className="text-2xl font-bold font-serif text-blue-950 border-b border-gray-400 pb-0.5 px-3 inline-block tracking-wider">
                                                  {toProperCase(activeNurse?.nama || activePengajuan?.nama_pemohon)}
                                                </h2>
                                              </div>
                                              <p className="text-center text-xs text-gray-700">
                                                Lahir di {activeNurse?.tempat_lahir || '................'}, Tanggal : {activeNurse?.tanggal_lahir ? new Date(activeNurse.tanggal_lahir).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '................'}
                                              </p>

                                              <div className="text-center my-2">
                                                <h2 className="text-3xl font-extrabold tracking-widest text-[#2e7d32] font-sans">KOMPETEN</h2>
                                              </div>

                                              <p className="text-center text-xs text-gray-800 font-sans">
                                                Sebagai <strong>{cleanJenjang(form03Data?.pendekatan || activePengajuan?.jenjang_tujuan)}</strong> <br />
                                                Setelah dilakukan asesmen kompetensi {cleanJenjang(form03Data?.pendekatan || activePengajuan?.jenjang_tujuan)} <br />
                                                pada tanggal {formatIndoDate(customTglMulaiAsesmen)} s/d {formatIndoDate(customTglSelesaiAsesmen)} <br />
                                                ( Daftar unit kompetensi terlampir pada halaman 2 )
                                              </p>
                                            </div>
                                          </div>

                                          {/* TANDA TANGAN */}
                                          <div className="flex justify-end text-xs font-sans pb-4">
                                            <div className="text-center w-64 text-gray-800">
                                              <p className="text-left pl-6">Ditetapkan di : KUDUS</p>
                                              <p className="text-left pl-6 mb-2">Pada Tanggal : {formatIndoDate(customTglDitetapkan)}</p>

                                              <p className="font-bold mb-1 text-center">{pejabatData.find(p => p.jabatan.includes('Kepala Bidang'))?.jabatan || 'Kepala Bidang Keperawatan'}</p>

                                              {pejabatData.find(p => p.jabatan.includes('Kepala Bidang'))?.nip ? (
                                                <img
                                                  src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${pejabatData.find(p => p.jabatan.includes('Kepala Bidang'))?.nip}`}
                                                  alt="QR Code"
                                                  className="mx-auto w-16 h-16 mb-1"
                                                />
                                              ) : (
                                                <div className="h-16"></div>
                                              )}

                                              <p className="font-bold underline decoration-1 underline-offset-4 text-blue-950 text-center font-serif">{pejabatData.find(p => p.jabatan.includes('Kepala Bidang'))?.nama || '................................'}</p>
                                              <p className="text-center">NIP. {pejabatData.find(p => p.jabatan.includes('Kepala Bidang'))?.nip || '................................'}</p>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  {/* HALAMAN 2 */}
                                  <div className="sertifikat-page bg-white text-black mx-auto font-serif relative shadow-md print:shadow-none mt-8 print:mt-0" style={{ pageBreakBefore: 'always', breakBefore: 'page' }}>
                                    <div className="sertifikat-border-outer">
                                      <div className="sertifikat-border-inner">
                                        {/* BACKGROUND WATERMARK */}
                                        <div
                                          className="absolute inset-0 z-0 opacity-100 pointer-events-none"
                                          style={{ backgroundImage: `url(${certificateBackground})`, backgroundSize: '100% 100%', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}
                                        ></div>

                                        <div className="relative z-10 px-8 pt-0 pb-2 flex flex-col justify-between" style={{ height: 'calc(210mm - 60px)' }}>
                                          {/* KOP SURAT */}
                                          <div className="flex justify-between items-end relative pb-4 mb-3" style={{ minHeight: '100px' }}>
                                            {/* Left Kudus Crest Logo */}
                                            <div className="absolute left-0 top-[4px]">
                                              <img src={logoKudus} alt="Logo Pemkab" className="h-[88px] w-auto object-contain" />
                                            </div>

                                            {/* Center Text */}
                                            <div className="text-center w-full px-[240px] pb-1">
                                              <h1 className="text-[13px] font-bold uppercase tracking-wide text-gray-800">Pemerintah Kabupaten Kudus</h1>
                                              <h2 className="text-[16px] font-bold uppercase tracking-wide mt-0.5 text-blue-900">Rumah Sakit Umum Daerah dr.LOEKMONO HADI</h2>
                                              <p className="text-[9.5px] mt-0.5 text-gray-600 font-sans">Jl. dr. Lukmonohadi No. 19 Kudus 59348 ☎ (0291) 444001 📠 (0291) 438195</p>
                                              <p className="text-[9.5px] text-gray-600 font-sans">Email : rsuddrloekmonohadi@kuduskab.go.id ; rsudkudus@yahoo.co.id</p>
                                              <p className="text-[9.5px] text-gray-600 font-sans">Website : www.rsuddrloekmonohadi.kuduskab.go.id</p>
                                            </div>

                                            {/* Right Logos */}
                                            <div className="absolute right-0 top-0 flex items-center gap-3 h-full pb-4">
                                              <img src={logoRS} alt="Logo RSUD" className="h-[78px] w-auto object-contain" />
                                              <img src={logoLars} alt="Logo LARS" className="h-[78px] w-auto object-contain" />
                                            </div>

                                            {/* Divider Line */}
                                            <div className="absolute bottom-0 left-0 right-0 border-b-[3px] border-black"></div>
                                          </div>

                                          {/* LAMPIRAN DETAILS */}
                                          <div className="text-center space-y-0.5 my-0.5">
                                            <h3 className="text-sm font-bold uppercase tracking-wide text-blue-950">Lampiran Sertifikat Kompetensi</h3>
                                            <p className="text-xs font-bold text-gray-800">
                                              Nomor : {sertifikatData?.nomor_sertifikat || "11/.../ASKOM/BIDKEP/" + new Date().getFullYear()}
                                            </p>
                                            <p className="text-xs text-gray-700">
                                              Nama Asesi: <strong className="font-bold text-gray-900">{toProperCase(activeNurse?.nama || activePengajuan?.nama_pemohon)}</strong> | Jenjang: <strong className="font-bold text-gray-900">{activePengajuan?.jenis_sertifikasi}</strong>
                                            </p>
                                          </div>

                                          {/* TABLE HEADER */}
                                          <div className="text-left mt-1">
                                            <h4 className="text-[10px] font-bold text-blue-950 uppercase tracking-wider">Daftar Unit Kompetensi Yang Dicapai:</h4>
                                          </div>

                                          {/* TABLE LIST */}
                                          <div className="my-2 flex-1">
                                            <table className="w-full border-collapse border border-black text-[10px] relative bg-white/90">
                                              <thead className="bg-gray-100">
                                                <tr>
                                                  <th className="border border-black p-1 w-10 text-center">NO</th>
                                                  <th className="border border-black p-1 text-left">KOMPETENSI</th>
                                                  <th className="border border-black p-1 w-24 text-center">HASIL</th>
                                                </tr>
                                              </thead>
                                              <tbody>
                                                {get12KompetensiForPengajuan(activePengajuan).map((komp, idx) => (
                                                  <tr key={idx}>
                                                    <td className="border border-black p-1 text-center">{idx + 1}.</td>
                                                    <td className="border border-black p-1">{komp.judul}</td>
                                                    <td className="border border-black p-1 text-center font-bold text-emerald-700">Kompeten</td>
                                                  </tr>
                                                ))}
                                              </tbody>
                                            </table>
                                          </div>

                                          {/* TANDA TANGAN KETUA PANITIA */}
                                          <div className="flex justify-end text-xs font-sans pb-2">
                                            <div className="text-center w-72 text-gray-800">
                                              {(() => {
                                                const rawJabatan = pejabatData.find(p => p.jabatan.includes('Ketua Panitia'))?.jabatan || 'Ketua Panitia Asesmen Kompetensi Perawat/Bidan Klinis';
                                                const cleaned = rawJabatan.replace(/perawat\/bidan klinis/gi, '').trim();
                                                return (
                                                  <>
                                                    <p className="font-bold text-center leading-tight">{cleaned}</p>
                                                    <p className="text-center text-[11px] text-gray-600 mb-1 leading-tight">Perawat/Bidan Klinis</p>
                                                  </>
                                                );
                                              })()}

                                              {pejabatData.find(p => p.jabatan.includes('Ketua Panitia'))?.nip ? (
                                                <img
                                                  src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${pejabatData.find(p => p.jabatan.includes('Ketua Panitia'))?.nip}`}
                                                  alt="QR Code"
                                                  className="mx-auto w-14 h-14 mb-1"
                                                />
                                              ) : (
                                                <div className="h-14"></div>
                                              )}

                                              <p className="font-bold underline decoration-1 underline-offset-4 text-blue-950 text-center font-serif">
                                                {pejabatData.find(p => p.jabatan.includes('Ketua Panitia'))?.nama || '................................'}
                                              </p>
                                              <p className="text-center text-[11px]">
                                                NIP. {pejabatData.find(p => p.jabatan.includes('Ketua Panitia'))?.nip || '................................'}
                                              </p>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}


                        </div>
                      );
                    })()}

                  </div>
                )}

              </div>
            )}

            {activeTab === 'master_kategori' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">Master Kategori</h2>
                  <p className="text-muted-foreground text-sm mt-1">Kelola data master referensi kategori (Kompetensi/Pelatihan).</p>
                </div>

                <div className="bg-card p-12 rounded-xl border border-border shadow-sm max-w-2xl flex flex-col items-center justify-center text-center">
                  <Tags size={48} className="text-muted-foreground/30 mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-1">Sedang Dalam Pengembangan</h3>
                  <p className="text-muted-foreground text-sm">Modul Master Kategori akan segera tersedia di pembaruan berikutnya.</p>
                </div>
              </div>
            )}

            {activeTab === 'master_user' && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight">Master User</h2>
                    <p className="text-muted-foreground text-sm mt-1">Kelola data pengguna sistem, peranan (role), dan kredensial login.</p>
                  </div>
                  <button onClick={() => handleOpenUserModal('add')} className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm animate-fade-in">
                    + Tambah User
                  </button>
                </div>

                {/* Filter & Search Bar */}
                <div className="bg-card p-4 rounded-xl border border-border shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
                  <div className="relative w-full md:max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                    <input
                      type="text"
                      placeholder="Cari nama, username, atau role..."
                      value={userSearchQuery}
                      onChange={e => setUserSearchQuery(e.target.value)}
                      className="pl-9 pr-4 py-2 w-full bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all text-foreground"
                    />
                  </div>

                  {userSearchQuery && (
                    <button
                      onClick={() => setUserSearchQuery('')}
                      className="px-3 py-2 bg-destructive/10 text-destructive hover:bg-destructive hover:text-white rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 animate-fade-in"
                    >
                      <X size={15} /> Reset
                    </button>
                  )}
                </div>

                <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left animate-fade-in">
                      <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
                        <tr>
                          <th className="px-6 py-4 font-medium">Nama Lengkap</th>
                          <th className="px-6 py-4 font-medium">Username</th>
                          <th className="px-6 py-4 font-medium">Role</th>
                          <th className="px-6 py-4 font-medium">Status</th>
                          <th className="px-6 py-4 font-medium text-right">Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {isLoading ? (
                          <tr><td colSpan="5" className="px-6 py-8 text-center text-muted-foreground">Memuat data...</td></tr>
                        ) : userData.length === 0 ? (
                          <tr><td colSpan="5" className="px-6 py-8 text-center text-muted-foreground">Belum ada data user di sistem.</td></tr>
                        ) : currentItemsUser.length === 0 ? (
                          <tr><td colSpan="5" className="px-6 py-8 text-center text-muted-foreground">Tidak ada data user yang cocok dengan kriteria pencarian.</td></tr>
                        ) : (
                          currentItemsUser.map((u, idx) => (
                            <tr key={idx} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                              <td className="px-6 py-4 font-medium text-foreground">{u.nama}</td>
                              <td className="px-6 py-4 font-semibold text-primary">{u.username}</td>
                              <td className="px-6 py-4">
                                <span className={`px-2 py-0.5 rounded text-xs font-bold ${u.role === 'Admin' ? 'bg-primary/10 text-primary border border-primary/20' :
                                  u.role === 'Asesor' ? 'bg-purple-500/10 text-purple-500 border border-purple-500/20' :
                                    'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                                  }`}>
                                  {u.role}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <span className={`px-2 py-0.5 rounded text-xs font-bold ${u.status === 'A' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-destructive/10 text-destructive border border-destructive/20'
                                  }`}>
                                  {u.status === 'A' ? 'Aktif' : 'Nonaktif'}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end space-x-2">
                                  <button onClick={() => handleOpenUserModal('edit', u)} className="p-1.5 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground rounded-md transition-colors flex items-center justify-center" title="Edit">
                                    <Edit2 size={16} />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteUser(u.id, u.username)}
                                    disabled={u.username === 'admin'}
                                    className="p-1.5 bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground rounded-md transition-colors flex items-center justify-center disabled:opacity-30 disabled:hover:bg-destructive/10 disabled:hover:text-destructive"
                                    title={u.username === 'admin' ? "Admin tidak bisa dihapus" : "Hapus"}
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination Controls */}
                  <div className="p-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 bg-muted/10">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="text-xs text-muted-foreground font-medium">Tampilkan</span>
                      <select
                        value={itemsPerPageUser}
                        onChange={e => {
                          setItemsPerPageUser(Number(e.target.value));
                          setCurrentPageUser(1);
                        }}
                        className="px-2 py-1 bg-background border border-border rounded text-xs focus:outline-none focus:ring-1 focus:ring-primary font-semibold"
                      >
                        <option value={5}>5 baris</option>
                        <option value={10}>10 baris</option>
                        <option value={25}>25 baris</option>
                        <option value={50}>50 baris</option>
                      </select>
                      <span className="text-xs text-muted-foreground font-medium">
                        Menampilkan {totalItemsUser > 0 ? indexOfFirstItemUser + 1 : 0} - {Math.min(indexOfLastItemUser, totalItemsUser)} dari {totalItemsUser} user
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setCurrentPageUser(p => Math.max(1, p - 1))}
                        disabled={currentPageUser === 1}
                        className="p-1.5 border border-border rounded-md text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-muted-foreground transition-colors"
                        title="Sebelumnya"
                      >
                        <ChevronRight size={15} className="rotate-180" />
                      </button>

                      {Array.from({ length: totalPagesUser }, (_, i) => i + 1).map((pageNum) => {
                        if (
                          pageNum === 1 ||
                          pageNum === totalPagesUser ||
                          (pageNum >= currentPageUser - 1 && pageNum <= currentPageUser + 1)
                        ) {
                          return (
                            <button
                              key={pageNum}
                              onClick={() => setCurrentPageUser(pageNum)}
                              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${currentPageUser === pageNum
                                ? 'bg-primary text-primary-foreground shadow-sm'
                                : 'hover:bg-muted text-muted-foreground hover:text-foreground border border-transparent hover:border-border'
                                }`}
                            >
                              {pageNum}
                            </button>
                          );
                        } else if (
                          (pageNum === 2 && currentPageUser > 3) ||
                          (pageNum === totalPagesUser - 1 && currentPageUser < totalPagesUser - 2)
                        ) {
                          return <span key={pageNum} className="text-muted-foreground text-xs px-0.5">...</span>;
                        }
                        return null;
                      })}

                      <button
                        onClick={() => setCurrentPageUser(p => Math.min(totalPagesUser, p + 1))}
                        disabled={currentPageUser === totalPagesUser}
                        className="p-1.5 border border-border rounded-md text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-muted-foreground transition-colors"
                        title="Selanjutnya"
                      >
                        <ChevronRight size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'kredensial' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-foreground">Kredensial & Kewenangan Klinis Perawat</h2>
                  <p className="text-muted-foreground text-sm mt-1">Kelola rincian kewenangan klinis (RKK) per perawat.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Pane: Nurse List */}
                  <div className="bg-card border border-border rounded-xl p-4 flex flex-col h-[650px] shadow-sm">
                    <div className="relative mb-4">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                      <input
                        type="text"
                        placeholder="Cari perawat..."
                        value={kredensialSearchPerawat}
                        onChange={e => setKredensialSearchPerawat(e.target.value)}
                        className="pl-9 pr-4 py-2 w-full bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div className="overflow-y-auto flex-1 space-y-2 pr-1">
                      {perawatData
                        .filter(p => p.nama.toLowerCase().includes(kredensialSearchPerawat.toLowerCase()))
                        .map(p => {
                          const isSelected = String(p.id_perawat) === String(kredensialSelectedPerawatId);
                          return (
                            <button
                              key={p.id_perawat}
                              onClick={() => setKredensialSelectedPerawatId(String(p.id_perawat))}
                              className={`w-full text-left p-3 rounded-lg border text-sm transition-all flex flex-col gap-1 ${
                                isSelected
                                  ? 'bg-primary/10 border-primary text-primary font-semibold'
                                  : 'bg-background hover:bg-muted border-border text-foreground'
                              }`}
                            >
                              <div className="font-bold flex items-center justify-between">
                                <span>{p.nama}</span>
                                {kredensialList.some(c => String(c.id_perawat) === String(p.id_perawat)) && (
                                  <span className="text-[10px] bg-green-500/20 text-green-600 px-1.5 py-0.5 rounded font-bold">
                                    Terkredensial
                                  </span>
                                )}
                              </div>
                              <span className="text-xs text-muted-foreground font-medium">NIK: {p.nik}</span>
                              <span className="text-xs text-muted-foreground font-medium">Unit: {p.unit_kerja}</span>
                            </button>
                          );
                        })}
                    </div>
                  </div>

                  {/* Right Pane: Worksheet */}
                  <div className="lg:col-span-2 bg-card border border-border rounded-xl shadow-sm flex flex-col h-[650px] overflow-hidden">
                    {!kredensialSelectedPerawatId ? (
                      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
                        <Stethoscope size={48} className="text-muted-foreground/30 mb-4" />
                        <h3 className="text-lg font-medium text-foreground mb-1">Perawat Belum Dipilih</h3>
                        <p className="text-sm max-w-sm">Pilih perawat di sebelah kiri untuk mulai mengisi atau mengubah kewenangan klinis (RKK).</p>
                      </div>
                    ) : (
                      <>
                        {/* Worksheet Header */}
                        {(() => {
                          const currentPerawat = perawatData.find(p => String(p.id_perawat) === String(kredensialSelectedPerawatId));
                          return (
                            <>
                              <div className="p-5 border-b border-border bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                  <h3 className="font-bold text-foreground">{currentPerawat?.nama}</h3>
                                  <p className="text-xs text-muted-foreground mt-0.5">NIK: {currentPerawat?.nik} | Unit: {currentPerawat?.unit_kerja}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <label className="text-xs font-semibold text-muted-foreground">Tgl Kredensial:</label>
                                  <input
                                    type="date"
                                    value={kredensialWorksheetDate}
                                    onChange={e => setKredensialWorksheetDate(e.target.value)}
                                    className="px-2.5 py-1.5 bg-background border border-border rounded-lg text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                                  />
                                </div>
                              </div>

                              {/* Category selector for worksheet */}
                              {jenisList.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 p-4 bg-muted/10 border-b border-border">
                                  {jenisList.map(j => (
                                    <button
                                      key={j.kd_jenis}
                                      type="button"
                                      onClick={() => setKredensialActiveJenis(j.kd_jenis)}
                                      className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                                        kredensialActiveJenis === j.kd_jenis
                                          ? 'bg-primary text-primary-foreground shadow-sm'
                                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                      }`}
                                    >
                                      {j.nm_jenis} ({j.kd_jenis})
                                    </button>
                                  ))}
                                </div>
                              )}

                              {/* Worksheet Content */}
                              <div className="flex-1 overflow-y-auto p-5 space-y-6">
                                {jenisList.length === 0 ? (
                                  <p className="text-sm text-center text-muted-foreground">Data jenis RKK tidak ditemukan. Isi data master jenis RKK terlebih dahulu.</p>
                                ) : (() => {
                                  const selectedJenisObj = jenisList.find(j => j.kd_jenis === kredensialActiveJenis) || jenisList[0];
                                  if (!selectedJenisObj) return null;

                                  return (
                                    <div className="space-y-6">
                                      <h4 className="font-extrabold text-sm text-primary uppercase tracking-wide border-b border-primary/20 pb-1.5 flex items-center justify-between font-sans">
                                        <span>Rincian Kewenangan: {selectedJenisObj.nm_jenis} ({selectedJenisObj.kd_jenis})</span>
                                      </h4>

                                      {[1, 2, 3, 4, 5].map(lvl => {
                                        const targetJenis = (lvl === 1 && selectedJenisObj.kd_jenis !== 'MGR' && selectedJenisObj.kd_jenis !== 'MATER') ? 'KMB' : selectedJenisObj.kd_jenis;
                                        const lvlItems = rkkList.filter(r => r.kd_jenis === targetJenis && Number(r.level_pk) === lvl && Number(r.aktif) === 1);
                                        if (lvlItems.length === 0) return null;

                                        return (
                                          <div key={lvl} className="ml-2 space-y-2">
                                            <div className="flex flex-col gap-1 bg-muted/40 px-3 py-2 rounded-md">
                                              <div className="flex items-center justify-between">
                                                <h5 className="font-bold text-xs text-foreground font-sans">Level PK {lvl}</h5>
                                                <span className="text-[10px] text-muted-foreground font-bold font-sans">{lvlItems.length} tindakan</span>
                                              </div>
                                              {getLevelNote(lvl) && (
                                                <p className="text-[10px] text-primary font-semibold font-sans">{getLevelNote(lvl)}</p>
                                              )}

                                            </div>
                                            <div className="border border-border rounded-lg overflow-hidden divide-y divide-border">
                                              {lvlItems.map((item, idx) => (
                                                <div key={item.id_rkk} className="p-3 bg-card flex items-start justify-between gap-4 text-xs hover:bg-muted/10 transition">
                                                  <div className="flex-1 flex gap-2">
                                                    <span className="font-semibold text-muted-foreground w-6 font-sans">{idx + 1}.</span>
                                                    <span className="text-foreground font-medium leading-relaxed font-sans">{item.kewenangan}</span>
                                                  </div>
                                                  <div className="flex gap-1 shrink-0">
                                                    {[
                                                      { val: 0, lbl: 'TA', activeClass: 'bg-muted text-muted-foreground border-border' },
                                                      { val: 1, lbl: 'M', activeClass: 'bg-green-600 text-white border-green-600 font-bold shadow-sm' },
                                                      { val: 2, lbl: 'DS', activeClass: 'bg-amber-600 text-white border-amber-600 font-bold shadow-sm' }
                                                    ].map(opt => {
                                                      const isSelected = (kredensialWorksheet[item.id_rkk] || 0) === opt.val;
                                                      return (
                                                        <button
                                                          key={opt.val}
                                                          type="button"
                                                          onClick={() => {
                                                            setKredensialWorksheet(prev => ({
                                                              ...prev,
                                                              [item.id_rkk]: opt.val
                                                            }));
                                                          }}
                                                          className={`px-2.5 py-1 rounded text-[10px] font-bold border transition ${
                                                            isSelected
                                                              ? opt.activeClass
                                                              : 'bg-background hover:bg-muted text-muted-foreground border-border'
                                                          }`}
                                                        >
                                                          {opt.lbl}
                                                        </button>
                                                      );
                                                    })}
                                                  </div>
                                                </div>
                                              ))}
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  );
                                })()}
                              </div>

                              {/* Worksheet Footer Actions */}
                              <div className="p-4 border-t border-border bg-muted/20 flex justify-end gap-3">
                                <button
                                  type="button"
                                  onClick={() => setKredensialSelectedPerawatId('')}
                                  className="px-4 py-2 text-xs font-semibold hover:bg-muted border border-border rounded-lg transition"
                                >
                                  Batal
                                </button>
                                <button
                                  type="button"
                                  onClick={handleSaveKredensial}
                                  className="px-5 py-2 text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/95 rounded-lg shadow-sm transition"
                                >
                                  Simpan Kredensial
                                </button>
                              </div>
                            </>
                          );
                        })()}
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'asesmen' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-primary/10 rounded-xl text-primary shrink-0">
                      <ClipboardCheck size={26} />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">Rekap Asesmen Kompetensi</h2>
                      <p className="text-muted-foreground text-xs mt-0.5">Rekapitulasi hasil uji tulis (ujian online), uji lisan, dan unjuk kerja/observasi seluruh asesi.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={handleExportExcel}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-all flex items-center gap-2 shadow-sm"
                    >
                      <FileText size={14} /> Export Excel
                    </button>
                    <button
                      onClick={() => window.print()}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-all flex items-center gap-2 shadow-sm"
                    >
                      <Printer size={14} /> Cetak Laporan
                    </button>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-xl shadow-sm p-5 space-y-4">
                  {/* Filters */}
                  <div className="flex flex-wrap gap-3 items-center justify-between">
                    <div className="flex flex-wrap gap-3 items-center flex-1 max-w-4xl">
                      {/* Search */}
                      <div className="relative flex-1 min-w-[240px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
                        <input
                          type="text"
                          placeholder="Cari nama perawat atau NIP..."
                          value={searchQueryAsesmenRecap}
                          onChange={e => setSearchQueryAsesmenRecap(e.target.value)}
                          className="pl-9 pr-4 py-2 w-full bg-background border border-border rounded-lg text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </div>
                      
                      {/* Unit Kerja Filter */}
                      <select
                        value={filterUnitAsesmenRecap}
                        onChange={e => setFilterUnitAsesmenRecap(e.target.value)}
                        className="px-3 py-2 bg-background border border-border rounded-lg text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary min-w-[160px]"
                      >
                        <option value="">Semua Unit Kerja</option>
                        {unitKerjaData.map(u => (
                          <option key={u.id} value={u.nama_unit}>{u.nama_unit}</option>
                        ))}
                      </select>

                      {/* Jenis Sertifikasi Filter */}
                      <select
                        value={filterJenisAsesmenRecap}
                        onChange={e => setFilterJenisAsesmenRecap(e.target.value)}
                        className="px-3 py-2 bg-background border border-border rounded-lg text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary min-w-[180px]"
                      >
                        <option value="">Semua Jenis Sertifikasi</option>
                        {uniqueJenisSertifikasi.map(j => (
                          <option key={j} value={j}>{j}</option>
                        ))}
                      </select>

                      {/* Rekomendasi Filter */}
                      <select
                        value={filterRekomendasiAsesmenRecap}
                        onChange={e => setFilterRekomendasiAsesmenRecap(e.target.value)}
                        className="px-3 py-2 bg-background border border-border rounded-lg text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary min-w-[160px]"
                      >
                        <option value="">Semua Rekomendasi</option>
                        <option value="Kompeten">Kompeten</option>
                        <option value="Belum Kompeten">Belum Kompeten</option>
                        <option value="Dalam Proses">Dalam Proses</option>
                      </select>
                    </div>
                  </div>

                  {/* Stat Cards */}
                  {(() => {
                    const totalAsesi = filteredRecapList.length;
                    const kompetenCount = filteredRecapList.filter(item => getRekomendasiAkhir(item) === 'Kompeten').length;
                    const bkCount = filteredRecapList.filter(item => getRekomendasiAkhir(item) === 'Belum Kompeten').length;
                    const prosesCount = totalAsesi - kompetenCount - bkCount;
                    return (
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-1 pb-3">
                        <div className="bg-card p-4 rounded-xl border border-border flex items-center justify-between shadow-sm">
                          <div>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Total Asesi</p>
                            <h3 className="text-2xl font-bold text-foreground">{totalAsesi}</h3>
                          </div>
                          <div className="p-2.5 bg-blue-500/10 text-blue-500 rounded-lg">
                            <Users size={18} />
                          </div>
                        </div>
                        <div className="bg-card p-4 rounded-xl border border-border flex items-center justify-between shadow-sm">
                          <div>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Kompeten (K)</p>
                            <h3 className="text-2xl font-bold text-green-600">{kompetenCount}</h3>
                          </div>
                          <div className="p-2.5 bg-green-500/10 text-green-500 rounded-lg">
                            <CheckCircle size={18} />
                          </div>
                        </div>
                        <div className="bg-card p-4 rounded-xl border border-border flex items-center justify-between shadow-sm">
                          <div>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Belum Kompeten (BK)</p>
                            <h3 className="text-2xl font-bold text-red-600">{bkCount}</h3>
                          </div>
                          <div className="p-2.5 bg-red-500/10 text-red-500 rounded-lg">
                            <XCircle size={18} />
                          </div>
                        </div>
                        <div className="bg-card p-4 rounded-xl border border-border flex items-center justify-between shadow-sm">
                          <div>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Dalam Proses</p>
                            <h3 className="text-2xl font-bold text-amber-500">{prosesCount}</h3>
                          </div>
                          <div className="p-2.5 bg-amber-500/10 text-amber-500 rounded-lg">
                            <Clock size={18} />
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Table */}
                  <div className="overflow-x-auto rounded-lg border border-border bg-card">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-muted/50 border-b border-border text-muted-foreground uppercase text-[10px] font-bold">
                        <tr>
                          <th className="px-4 py-3.5 w-12 text-center">NO</th>
                          <th className="px-4 py-3.5">NAMA ASESI / NIP</th>
                          <th className="px-4 py-3.5">UNIT KERJA & JABATAN</th>
                          <th className="px-4 py-3.5">JENIS SERTIFIKASI</th>
                          <th className="px-4 py-3.5">ASESOR</th>
                          <th className="px-4 py-3.5 text-center">UJI TULIS</th>
                          <th className="px-4 py-3.5 text-center">UJI LISAN</th>
                          <th className="px-4 py-3.5 text-center">UJI OBSERVASI</th>
                          <th className="px-4 py-3.5 text-center">REKOMENDASI AKHIR</th>
                          <th className="px-4 py-3.5 text-center">AKSI</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/40">
                        {(() => {
                          if (filteredRecapList.length === 0) {
                            return (
                              <tr>
                                <td colSpan="10" className="px-4 py-16 text-center text-muted-foreground font-medium">
                                  Tidak ada data asesmen yang cocok dengan filter.
                                </td>
                              </tr>
                            );
                          }

                          // Pagination
                          const idxLast = currentPageRecap * itemsPerPageRecap;
                          const idxFirst = idxLast - itemsPerPageRecap;
                          const currentItems = filteredRecapList.slice(idxFirst, idxLast);
                          const totalPages = Math.ceil(filteredRecapList.length / itemsPerPageRecap);

                          return (
                            <>
                              {currentItems.map((item, idx) => {
                                const nurse = perawatData.find(n => String(n.id_perawat) === String(item.id_perawat)) || {};
                                const primaryAsesor = userData.find(u => String(u.id) === String(item.id_asesor))?.nama || '-';
                                const coAsesor = userData.find(u => String(u.id) === String(item.id_asesor_pendamping))?.nama || '-';
                                const lisanStatus = getUjiLisanStatus(item);
                                const obsStatus = getUjiObservasiStatus(item);
                                const recom = getRekomendasiAkhir(item);
                                
                                return (
                                  <tr key={item.id || idx} className="hover:bg-muted/10 transition-colors">
                                    <td className="px-4 py-4 text-center font-semibold text-muted-foreground">
                                      {idxFirst + idx + 1}.
                                    </td>
                                    <td className="px-4 py-4 font-bold text-foreground">
                                      <div>{toProperCase(nurse.nama)}</div>
                                      <div className="text-[10px] text-muted-foreground font-medium mt-0.5">{nurse.nip || '-'}</div>
                                    </td>
                                    <td className="px-4 py-4">
                                      <div className="font-bold text-foreground text-xs">{nurse.unit_kerja || '-'}</div>
                                      <div className="text-[10px] text-muted-foreground mt-0.5">{nurse.jabatan || '-'}</div>
                                    </td>
                                    <td className="px-4 py-4 font-medium text-foreground">
                                      {item.jenis_sertifikasi || '-'}
                                    </td>
                                    <td className="px-4 py-4 text-xs font-semibold text-foreground">
                                      <div>{primaryAsesor}</div>
                                      {item.id_asesor_pendamping && (
                                        <div className="text-[9.5px] text-muted-foreground font-medium mt-0.5">Pendamping: {coAsesor}</div>
                                      )}
                                    </td>
                                    <td className="px-4 py-4 text-center whitespace-nowrap">
                                      {item.status_ujian === 'Selesai' ? (
                                        (() => {
                                          const scoreVal = parseFloat(item.nilai_ujian || '0');
                                          return (
                                            <span className={`px-2.5 py-1 rounded font-bold text-xs whitespace-nowrap inline-block ${
                                              scoreVal >= 70 ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
                                            }`}>
                                              {scoreVal.toFixed(1)}%
                                            </span>
                                          );
                                        })()
                                      ) : item.status_ujian === 'Sedang Dikerjakan' ? (
                                        <span className="px-2 py-0.5 bg-yellow-50 text-yellow-755 border border-yellow-200 rounded font-semibold text-[10px] whitespace-nowrap inline-block">Sedang Dikerjakan</span>
                                      ) : (
                                        <span className="text-gray-400 italic text-[11px] font-medium whitespace-nowrap">Belum Ujian</span>
                                      )}
                                    </td>
                                    <td className="px-4 py-4 text-center whitespace-nowrap">
                                      {lisanStatus === 'Belum Dinilai' ? (
                                        <span className="text-gray-400 italic text-[11px] font-medium whitespace-nowrap">Belum Dinilai</span>
                                      ) : (
                                        <span className="px-2 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded font-bold text-xs whitespace-nowrap inline-block">
                                          {lisanStatus}
                                        </span>
                                      )}
                                    </td>
                                    <td className="px-4 py-4 text-center whitespace-nowrap">
                                      {obsStatus === 'Belum Dinilai' ? (
                                        <span className="text-gray-400 italic text-[11px] font-medium whitespace-nowrap">Belum Dinilai</span>
                                      ) : (
                                        <span className="px-2 py-1 bg-green-50 text-green-700 border border-green-200 rounded font-bold text-xs whitespace-nowrap inline-block">
                                          {obsStatus}
                                        </span>
                                      )}
                                    </td>
                                    <td className="px-4 py-4 text-center whitespace-nowrap">
                                      {recom === 'Kompeten' ? (
                                        <span className="px-2.5 py-1 bg-green-600 text-white rounded font-bold text-[10px] uppercase tracking-wider shadow-sm whitespace-nowrap inline-block">KOMPETEN</span>
                                      ) : recom === 'Belum Kompeten' ? (
                                        <span className="px-2.5 py-1 bg-red-600 text-white rounded font-bold text-[10px] uppercase tracking-wider shadow-sm whitespace-nowrap inline-block">BELUM KOMPETEN</span>
                                      ) : (
                                        <span className="px-2.5 py-1 bg-amber-500 text-white rounded font-bold text-[10px] uppercase tracking-wider shadow-sm whitespace-nowrap inline-block">DALAM PROSES</span>
                                      )}
                                    </td>
                                    <td className="px-4 py-4 text-center whitespace-nowrap">
                                      <button
                                        onClick={() => {
                                          setSelectedPengajuanForMatriks(item);
                                          setShowDetailMatriksModal(true);
                                          if (item.status_ujian === 'Selesai') {
                                            fetch(`${API_URL}/ujian/hasil/${item.id}`)
                                              .then(res => res.json())
                                              .then(data => {
                                                if (data.success) {
                                                  setMatriksTulisExamDetails(data);
                                                }
                                              })
                                              .catch(err => console.error("Error loading exam details:", err));
                                          } else {
                                            setMatriksTulisExamDetails(null);
                                          }
                                        }}
                                        className="px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 border border-blue-200 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm mx-auto whitespace-nowrap"
                                      >
                                        <Eye size={12} /> Detail
                                      </button>
                                    </td>
                                  </tr>
                                );
                              })}
                              
                              {/* Pagination Controls */}
                              {totalPages > 1 && (
                                <tr>
                                  <td colSpan="10" className="px-4 py-3 bg-muted/10 border-t border-border">
                                    <div className="flex items-center justify-between">
                                      <span className="text-[11px] text-muted-foreground font-medium">
                                        Menampilkan {idxFirst + 1} - {Math.min(idxLast, filteredRecapList.length)} dari {filteredRecapList.length} data
                                      </span>
                                      <div className="flex items-center gap-1">
                                        <button
                                          onClick={() => setCurrentPageRecap(p => Math.max(1, p - 1))}
                                          disabled={currentPageRecap === 1}
                                          className="p-1 border border-border rounded text-muted-foreground hover:bg-muted disabled:opacity-40 transition-colors"
                                        >
                                          <ChevronLeft size={14} />
                                        </button>
                                        <span className="px-3 py-1 text-[11px] font-bold bg-primary/10 text-primary rounded border border-primary/20">
                                          {currentPageRecap} / {totalPages}
                                        </span>
                                        <button
                                          onClick={() => setCurrentPageRecap(p => Math.min(totalPages, p + 1))}
                                          disabled={currentPageRecap === totalPages}
                                          className="p-1 border border-border rounded text-muted-foreground hover:bg-muted disabled:opacity-40 transition-colors"
                                        >
                                          <ChevronRight size={14} />
                                        </button>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </>
                          );
                        })()}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'master_jenis' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight text-foreground">Master Jenis RKK</h2>
                    <p className="text-muted-foreground text-sm mt-1">Kelola data kategori / kelompok Kewenangan Klinis (RKK).</p>
                  </div>
                  <button
                    onClick={() => {
                      setJenisForm({ kd_jenis: '', nm_jenis: '' });
                      setEditingJenisKd(null);
                      setShowJenisModal(true);
                    }}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors shadow-sm"
                  >
                    + Tambah Kategori RKK
                  </button>
                </div>

                <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border font-bold">
                        <tr>
                          <th className="px-6 py-4 font-semibold">Kode Kategori</th>
                          <th className="px-6 py-4 font-semibold">Nama Kategori RKK</th>
                          <th className="px-6 py-4 text-center font-semibold w-32">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {(() => {
                          const totalItemsJenis = jenisList.length;
                          const indexOfLastItemJenis = currentPageJenis * itemsPerPageJenis;
                          const indexOfFirstItemJenis = indexOfLastItemJenis - itemsPerPageJenis;
                          const currentItemsJenis = jenisList.slice(indexOfFirstItemJenis, indexOfLastItemJenis);
                          const totalPagesJenis = Math.ceil(totalItemsJenis / itemsPerPageJenis);

                          if (totalItemsJenis === 0) {
                            return (
                              <tr>
                                <td colSpan={3} className="px-6 py-8 text-center text-muted-foreground">
                                  Tidak ada data kategori RKK.
                                </td>
                              </tr>
                            );
                          }

                          return (
                            <>
                              {currentItemsJenis.map(j => (
                                <tr key={j.kd_jenis} className="hover:bg-muted/10 transition">
                                  <td className="px-6 py-4 font-bold text-foreground">{j.kd_jenis}</td>
                                  <td className="px-6 py-4 font-medium text-foreground">{j.nm_jenis}</td>
                                  <td className="px-6 py-4 text-center">
                                    <div className="flex justify-center gap-2">
                                      <button
                                        onClick={() => {
                                          setJenisForm({ kd_jenis: j.kd_jenis, nm_jenis: j.nm_jenis });
                                          setEditingJenisKd(j.kd_jenis);
                                          setShowJenisModal(true);
                                        }}
                                        className="p-1.5 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded transition"
                                        title="Edit"
                                      >
                                        <Edit2 size={14} />
                                      </button>
                                      <button
                                        onClick={() => handleDeleteJenis(j.kd_jenis)}
                                        className="p-1.5 bg-destructive/10 text-destructive hover:bg-destructive hover:text-white rounded transition"
                                        title="Hapus"
                                      >
                                        <Trash2 size={14} />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}

                              {/* Nested pagination control render row for Jenis RKK */}
                              {totalPagesJenis > 1 && (
                                <tr>
                                  <td colSpan={3} className="p-0 border-t border-border">
                                    <div className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4 bg-muted/5">
                                      <div className="flex flex-wrap items-center gap-2.5">
                                        <span className="text-xs text-muted-foreground font-semibold font-sans">Tampilkan</span>
                                        <select
                                          value={itemsPerPageJenis}
                                          onChange={e => {
                                            setItemsPerPageJenis(Number(e.target.value));
                                            setCurrentPageJenis(1);
                                          }}
                                          className="px-2 py-1 bg-background border border-border rounded text-xs focus:outline-none focus:ring-1 focus:ring-primary font-semibold"
                                        >
                                          <option value={5}>5 baris</option>
                                          <option value={10}>10 baris</option>
                                          <option value={25}>25 baris</option>
                                        </select>
                                        <span className="text-xs text-muted-foreground font-semibold font-sans">
                                          Menampilkan {indexOfFirstItemJenis + 1} - {Math.min(indexOfLastItemJenis, totalItemsJenis)} dari {totalItemsJenis} data
                                        </span>
                                      </div>

                                      <div className="flex items-center gap-1">
                                        <button
                                          onClick={() => setCurrentPageJenis(p => Math.max(1, p - 1))}
                                          disabled={currentPageJenis === 1}
                                          className="p-1.5 border border-border rounded-md text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-muted-foreground transition-colors"
                                          title="Sebelumnya"
                                        >
                                          <ChevronRight size={15} className="rotate-180" />
                                        </button>

                                        {Array.from({ length: totalPagesJenis }, (_, i) => i + 1).map((pageNum) => {
                                          if (
                                            pageNum === 1 ||
                                            pageNum === totalPagesJenis ||
                                            (pageNum >= currentPageJenis - 1 && pageNum <= currentPageJenis + 1)
                                          ) {
                                            return (
                                              <button
                                                key={pageNum}
                                                onClick={() => setCurrentPageJenis(pageNum)}
                                                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                                                  currentPageJenis === pageNum
                                                    ? 'bg-primary text-primary-foreground shadow-sm'
                                                    : 'hover:bg-muted text-muted-foreground hover:text-foreground border border-transparent hover:border-border'
                                                }`}
                                              >
                                                {pageNum}
                                              </button>
                                            );
                                          } else if (
                                            (pageNum === 2 && currentPageJenis > 3) ||
                                            (pageNum === totalPagesJenis - 1 && currentPageJenis < totalPagesJenis - 2)
                                          ) {
                                            return <span key={pageNum} className="text-muted-foreground text-xs px-0.5">...</span>;
                                          }
                                          return null;
                                        })}

                                        <button
                                          onClick={() => setCurrentPageJenis(p => Math.min(totalPagesJenis, p + 1))}
                                          disabled={currentPageJenis === totalPagesJenis}
                                          className="p-1.5 border border-border rounded-md text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-muted-foreground transition-colors"
                                          title="Selanjutnya"
                                        >
                                          <ChevronRight size={15} />
                                        </button>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </>
                          );
                        })()}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'master_rkk' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight text-foreground">Master Rincian Kewenangan Klinis (RKK)</h2>
                    <p className="text-muted-foreground text-sm mt-1">Daftar standard kewenangan klinis perawat berdasarkan kelompok dan jenjang PK.</p>
                  </div>
                  <button
                   onClick={() => {
                      const initialJenis = (activeRkkLevelTab === 1 && activeRkkJenisTab !== 'MGR' && activeRkkJenisTab !== 'MATER') ? 'KMB' : (activeRkkJenisTab || (jenisList[0]?.kd_jenis || ''));
                      setRkkForm({ kd_jenis: initialJenis, level_pk: activeRkkLevelTab || 1, kewenangan: '', aktif: 1 });
                      setEditingRkkId(null);
                      setShowRkkModal(true);
                    }}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors shadow-sm"
                  >
                    + Tambah Rincian RKK
                  </button>
                </div>

                {/* Top tabs for Jenis RKK */}
                {jenisList.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pb-2 border-b border-border">
                    {jenisList.map(j => (
                      <button
                        key={j.kd_jenis}
                        onClick={() => {
                          setActiveRkkJenisTab(j.kd_jenis);
                          setActiveRkkLevelTab(1);
                        }}
                        className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                          activeRkkJenisTab === j.kd_jenis
                            ? 'bg-primary text-primary-foreground shadow-sm'
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                        }`}
                      >
                        {j.nm_jenis} ({j.kd_jenis})
                      </button>
                    ))}
                  </div>
                )}

                {/* Sub-tabs for Level PK */}
                <div className="flex flex-wrap gap-2 mb-4 bg-muted/20 p-2 rounded-xl border border-border">
                  {[1, 2, 3, 4, 5].map(lvl => {
                    const targetJenis = (lvl === 1 && activeRkkJenisTab !== 'MGR' && activeRkkJenisTab !== 'MATER') ? 'KMB' : activeRkkJenisTab;
                    const count = rkkList.filter(r => r.kd_jenis === targetJenis && Number(r.level_pk) === lvl).length;
                    const isActive = activeRkkLevelTab === lvl;
                    return (
                      <button
                        key={lvl}
                        onClick={() => setActiveRkkLevelTab(lvl)}
                        className={`px-4 py-2 text-xs font-semibold rounded-lg border transition-all flex items-center gap-2 ${
                          isActive
                            ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                            : 'bg-background border-border text-muted-foreground hover:border-muted-foreground/30 hover:text-foreground'
                        }`}
                      >
                        <span>Level PK {lvl}</span>
                        <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                          isActive ? 'bg-primary-foreground text-primary' : 'bg-muted text-muted-foreground'
                        }`}>
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Note/Alert Blocks based on Level & Jenis */}
                {getLevelNote(activeRkkLevelTab) && (
                  <div className="bg-primary/5 border border-primary/20 text-primary p-3 rounded-lg flex items-center gap-2.5 text-xs font-medium font-sans animate-in fade-in duration-200">
                    <AlertTriangle size={16} className="text-primary shrink-0" />
                    <span>{getLevelNote(activeRkkLevelTab)}</span>
                  </div>
                )}
                


                {/* Table display */}
                <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border font-bold">
                        <tr>
                          <th className="px-5 py-4 font-semibold w-16 text-center">No</th>
                          <th className="px-5 py-4 font-semibold">Kewenangan Klinis</th>
                          <th className="px-5 py-4 font-semibold w-28 text-center">Status</th>
                          <th className="px-5 py-4 text-center font-semibold w-32">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {(() => {
                          const targetJenis = (Number(activeRkkLevelTab) === 1 && activeRkkJenisTab !== 'MGR' && activeRkkJenisTab !== 'MATER') ? 'KMB' : activeRkkJenisTab;
                          const filtered = rkkList.filter(r => r.kd_jenis === targetJenis && Number(r.level_pk) === activeRkkLevelTab);
                          
                          const totalItemsRkk = filtered.length;
                          const indexOfLastItemRkk = currentPageRkk * itemsPerPageRkk;
                          const indexOfFirstItemRkk = indexOfLastItemRkk - itemsPerPageRkk;
                          const currentItemsRkk = filtered.slice(indexOfFirstItemRkk, indexOfLastItemRkk);
                          const totalPagesRkk = Math.ceil(totalItemsRkk / itemsPerPageRkk);

                          if (filtered.length === 0) {
                            return (
                              <tr>
                                <td colSpan={4} className="px-5 py-8 text-center text-muted-foreground">
                                  Tidak ada data kewenangan klinis untuk {activeRkkJenisTab} Level PK {activeRkkLevelTab}.
                                </td>
                              </tr>
                            );
                          }

                          return (
                            <>
                              {currentItemsRkk.map((r, idx) => (
                                <tr key={r.id_rkk} className="hover:bg-muted/10 transition">
                                  <td className="px-5 py-4 text-center font-medium text-muted-foreground">{indexOfFirstItemRkk + idx + 1}</td>
                                  <td className="px-5 py-4 font-medium text-foreground leading-relaxed">{r.kewenangan}</td>
                                  <td className="px-5 py-4 text-center">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                      Number(r.aktif) === 1
                                        ? 'bg-green-500/10 text-green-600 border border-green-500/20'
                                        : 'bg-destructive/10 text-destructive border border-destructive/20'
                                    }`}>
                                      {Number(r.aktif) === 1 ? 'Aktif' : 'Nonaktif'}
                                    </span>
                                  </td>
                                  <td className="px-5 py-4 text-center">
                                    <div className="flex justify-center gap-2">
                                      <button
                                        onClick={() => {
                                          setRkkForm({ kd_jenis: r.kd_jenis, level_pk: Number(r.level_pk), kewenangan: r.kewenangan, aktif: Number(r.aktif) });
                                          setEditingRkkId(r.id_rkk);
                                          setShowRkkModal(true);
                                        }}
                                        className="p-1.5 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded transition"
                                        title="Edit"
                                      >
                                        <Edit2 size={13} />
                                      </button>
                                      <button
                                        onClick={() => handleDeleteRkk(r.id_rkk)}
                                        className="p-1.5 bg-destructive/10 text-destructive hover:bg-destructive hover:text-white rounded transition"
                                        title="Hapus"
                                      >
                                        <Trash2 size={13} />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}

                              {/* Nested pagination control render row */}
                              {totalPagesRkk > 1 && (
                                <tr>
                                  <td colSpan={4} className="p-0 border-t border-border">
                                    <div className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4 bg-muted/5">
                                      <div className="flex flex-wrap items-center gap-2.5">
                                        <span className="text-xs text-muted-foreground font-semibold font-sans">Tampilkan</span>
                                        <select
                                          value={itemsPerPageRkk}
                                          onChange={e => {
                                            setItemsPerPageRkk(Number(e.target.value));
                                            setCurrentPageRkk(1);
                                          }}
                                          className="px-2 py-1 bg-background border border-border rounded text-xs focus:outline-none focus:ring-1 focus:ring-primary font-semibold"
                                        >
                                          <option value={5}>5 baris</option>
                                          <option value={10}>10 baris</option>
                                          <option value={25}>25 baris</option>
                                          <option value={50}>50 baris</option>
                                        </select>
                                        <span className="text-xs text-muted-foreground font-semibold font-sans">
                                          Menampilkan {indexOfFirstItemRkk + 1} - {Math.min(indexOfLastItemRkk, totalItemsRkk)} dari {totalItemsRkk} data
                                        </span>
                                      </div>

                                      <div className="flex items-center gap-1">
                                        <button
                                          onClick={() => setCurrentPageRkk(p => Math.max(1, p - 1))}
                                          disabled={currentPageRkk === 1}
                                          className="p-1.5 border border-border rounded-md text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-muted-foreground transition-colors"
                                          title="Sebelumnya"
                                        >
                                          <ChevronRight size={15} className="rotate-180" />
                                        </button>

                                        {Array.from({ length: totalPagesRkk }, (_, i) => i + 1).map((pageNum) => {
                                          if (
                                            pageNum === 1 ||
                                            pageNum === totalPagesRkk ||
                                            (pageNum >= currentPageRkk - 1 && pageNum <= currentPageRkk + 1)
                                          ) {
                                            return (
                                              <button
                                                key={pageNum}
                                                onClick={() => setCurrentPageRkk(pageNum)}
                                                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                                                  currentPageRkk === pageNum
                                                    ? 'bg-primary text-primary-foreground shadow-sm'
                                                    : 'hover:bg-muted text-muted-foreground hover:text-foreground border border-transparent hover:border-border'
                                                }`}
                                              >
                                                {pageNum}
                                              </button>
                                            );
                                          } else if (
                                            (pageNum === 2 && currentPageRkk > 3) ||
                                            (pageNum === totalPagesRkk - 1 && currentPageRkk < totalPagesRkk - 2)
                                          ) {
                                            return <span key={pageNum} className="text-muted-foreground text-xs px-0.5">...</span>;
                                          }
                                          return null;
                                        })}

                                        <button
                                          onClick={() => setCurrentPageRkk(p => Math.min(totalPagesRkk, p + 1))}
                                          disabled={currentPageRkk === totalPagesRkk}
                                          className="p-1.5 border border-border rounded-md text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-muted-foreground transition-colors"
                                          title="Selanjutnya"
                                        >
                                          <ChevronRight size={15} />
                                        </button>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </>
                          );
                        })()}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
            
            {/* Modal Pilih Asesor */}
            {isAssessorModalOpen && activePengajuan && (
              <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
                <div className="bg-card w-full max-w-md rounded-2xl shadow-xl border border-border overflow-hidden">
                  <div className="p-5 border-b border-border bg-muted/20">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                      <CheckCircle className="text-green-500" size={20} />
                      Setujui & Tugaskan Asesor
                    </h3>
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase">Pilih Asesor Utama *</label>
                      <select
                        className="w-full px-3 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-xs font-medium text-foreground"
                        value={selectedAssessorId}
                        onChange={(e) => {
                          setSelectedAssessorId(e.target.value);
                          if (e.target.value === selectedCoAssessorId) {
                            setSelectedCoAssessorId('');
                          }
                        }}
                      >
                        <option value="">-- Pilih Asesor Utama --</option>
                        {userData.filter(u => u.role === 'Asesor').map(u => (
                          <option key={u.id} value={u.id}>{u.nama}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase">Pilih Asesor Pendamping (Opsional)</label>
                      <select
                        className="w-full px-3 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-xs font-medium text-foreground"
                        value={selectedCoAssessorId}
                        onChange={(e) => setSelectedCoAssessorId(e.target.value)}
                      >
                        <option value="">-- Pilih Asesor Pendamping --</option>
                        {userData.filter(u => u.role === 'Asesor' && String(u.id) !== String(selectedAssessorId)).map(u => (
                          <option key={u.id} value={u.id}>{u.nama}</option>
                        ))}
                      </select>
                    </div>
                    <p className="text-[10px] text-muted-foreground leading-normal mt-2">
                      Tugaskan Asesor Utama dan Asesor Pendamping untuk melakukan penilaian kompetensi pada asesi ini.
                    </p>
                  </div>
                  <div className="p-4 border-t border-border bg-muted/10 flex justify-end gap-3">
                    <button
                      onClick={() => setIsAssessorModalOpen(false)}
                      className="px-4 py-2 bg-muted text-foreground rounded-lg text-sm font-medium hover:bg-muted/80 transition-colors"
                    >
                      Batal
                    </button>
                    <button
                      onClick={() => {
                        if (!selectedAssessorId) {
                          showToast('Pilih Asesor Utama terlebih dahulu', 'error');
                          return;
                        }
                        setIsAssessorModalOpen(false);
                        handleUpdatePengajuanStatus(activePengajuan.id, activePengajuan.status === 'Pending' ? 'Approved' : activePengajuan.status, selectedAssessorId, selectedCoAssessorId);
                      }}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-bold hover:bg-green-600 transition-colors shadow"
                    >
                      Simpan & Setujui
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Modal CRUD Perawat */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card w-full max-w-4xl rounded-xl border border-border shadow-lg flex flex-col overflow-hidden max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-border bg-muted/30">
              <h3 className="font-bold text-xl">{modalMode === 'add' ? 'Tambah Data Perawat' : 'Edit Data Perawat'}</h3>
              <button type="button" onClick={handleCloseModal} className="text-muted-foreground hover:text-foreground transition-colors">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1">

              {/* Foto Profil di Atas */}
              <div className="flex flex-col items-center justify-center mb-6 pb-6 border-b border-border">
                <div className="relative group cursor-pointer w-28 h-28">
                  {formData.foto ? (
                    <img src={URL.createObjectURL(formData.foto)} className="w-28 h-28 rounded-full object-cover border-2 border-primary shadow-md" alt="Preview Foto" />
                  ) : formData.current_foto ? (
                    <img src={`${BASE_URL}/${formData.current_foto}`} className="w-28 h-28 rounded-full object-cover border-2 border-primary shadow-md" alt="Foto Perawat" />
                  ) : (
                    <div className="w-28 h-28 rounded-full bg-primary/10 border-2 border-dashed border-primary/30 flex flex-col items-center justify-center text-primary">
                      <Users size={32} className="opacity-60 mb-1" />
                      <span className="text-[10px] font-semibold opacity-80">Foto Profil</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center text-white text-[10px] font-semibold">
                    Ganti Foto
                  </div>
                  <input type="file" name="foto" id="foto-upload" onChange={handleChange} accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer rounded-full" />
                </div>
                <label htmlFor="foto-upload" className="mt-3 px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground rounded-md text-xs font-semibold cursor-pointer transition-colors shadow-sm">
                  Pilih Foto Profil
                </label>
                <p className="text-[10px] text-muted-foreground mt-1.5">PNG, JPG, atau JPEG (Maks. 2MB)</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Kolom 1: Info Pribadi */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-primary border-b border-border pb-2">Informasi Pribadi</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">NIK</label>
                      <input type="text" name="nik" value={formData.nik || ''} onChange={handleChange} required
                        className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">NIP</label>
                      <input type="text" name="nip" value={formData.nip || ''} onChange={handleChange} required
                        className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Nama Lengkap</label>
                    <input type="text" name="nama" value={formData.nama || ''} onChange={handleChange} required
                      className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Tempat Lahir</label>
                      <input type="text" name="tempat_lahir" value={formData.tempat_lahir || ''} onChange={handleChange}
                        className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Tanggal Lahir</label>
                      <input type="date" name="tanggal_lahir" value={formData.tanggal_lahir || ''} onChange={handleChange}
                        className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Jenis Kelamin</label>
                    <select name="jk" value={formData.jk || 'L'} onChange={handleChange}
                      className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                      <option value="L">Laki-laki</option>
                      <option value="P">Perempuan</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Alamat</label>
                    <textarea name="alamat" value={formData.alamat || ''} onChange={handleChange} rows="2"
                      className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"></textarea>
                  </div>
                </div>

                {/* Kolom 2: Info Pekerjaan & Kontak */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-primary border-b border-border pb-2">Pekerjaan & Kontak</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">No. HP</label>
                      <input type="text" name="hp" value={formData.hp || ''} onChange={handleChange}
                        className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Email</label>
                      <input type="email" name="email" value={formData.email || ''} onChange={handleChange}
                        className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Profesi</label>
                    <select name="profesi" value={formData.profesi || ''} onChange={handleChange} required
                      className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                      <option value="">Pilih Profesi</option>
                      <option value="Perawat">Perawat</option>
                      <option value="Bidan">Bidan</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Unit Kerja</label>
                    <select name="unit_kerja" value={formData.unit_kerja || ''} onChange={handleChange} required
                      className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                      <option value="">Pilih Unit Kerja</option>
                      {unitKerjaData.map(u => <option key={u.id} value={u.nama_unit}>{u.nama_unit}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Jabatan</label>
                    <select name="jabatan" value={formData.jabatan || ''} onChange={handleChange} required
                      className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                      <option value="">Pilih Jabatan</option>
                      {jabatanData.map(j => <option key={j.id} value={j.nama_jabatan}>{j.nama_jabatan}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Pendidikan Terakhir</label>
                    <select name="pendidikan_terakhir" value={formData.pendidikan_terakhir || ''} onChange={handleChange} required
                      className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                      <option value="">Pilih Pendidikan Terakhir</option>
                      {pendidikanData.map(p => (
                        <option key={p.id} value={p.nama_pendidikan}>{p.nama_pendidikan}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">No. Ijazah</label>
                    <input type="text" name="no_ijazah" value={formData.no_ijazah || ''} onChange={handleChange} placeholder="Masukkan Nomor Ijazah"
                      className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Grup Pegawai</label>
                    <select name="grup" value={formData.grup || ''} onChange={handleChange} required
                      className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                      <option value="">Pilih Grup Pegawai</option>
                      {grupData.map((g, idx) => (
                        <option key={idx} value={g.nama_grup}>{g.nama_grup}</option>
                      ))}
                    </select>
                  </div>
                  {currentUser?.role !== 'Perawat' && (
                    <div>
                      <label className="block text-sm font-medium mb-1">Status Keaktifan</label>
                      <select name="status" value={formData.status || 'A'} onChange={handleChange}
                        className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                        <option value="A">Aktif</option>
                        <option value="N">Nonaktif</option>
                      </select>
                    </div>
                  )}
                  {currentUser?.role !== 'Perawat' && (
                    <div>
                      <label className="block text-sm font-medium mb-1">Tautkan Akun Login</label>
                      <SearchableSelect
                        name="id_user"
                        placeholder="Cari nama akun login..."
                        value={formData.id_user || ''}
                        onChange={handleChange}
                        options={[
                          { value: '', label: '-- Tidak Ditautkan --' },
                          ...userData.filter(u => u.role === 'Perawat' || u.role === 'User').map(u => ({ value: u.id, label: `${u.nama} (${u.username})` }))
                        ]}
                      />
                      <p className="text-xs text-muted-foreground mt-1">Pilih akun agar perawat ini bisa login ke sistem.</p>
                    </div>
                  )}
                </div>

                {/* Kolom 3: Dokumen (Full Width) */}
                <div className="md:col-span-2 space-y-4 mt-2">
                  <h4 className="font-semibold text-primary border-b border-border pb-2">Dokumen Pendukung</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border border-border rounded-lg bg-muted/20">
                      <div className="flex justify-between items-start mb-2">
                        <label className="block text-sm font-medium">Dokumen STR</label>
                        {formData.current_str && <span className="text-[10px] bg-green-500/10 text-green-500 px-2 py-0.5 rounded-full font-medium">Terunggah</span>}
                      </div>
                      {formData.current_str && (
                        <a href={`${BASE_URL}/${formData.current_str}`} target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline block mb-2 font-medium">📄 Lihat File Saat Ini</a>
                      )}
                      <div className="space-y-2 mb-3">
                        <div>
                          <label className="block text-[11px] font-medium mb-1">No. STR</label>
                          <input type="text" name="no_str" value={formData.no_str || ''} onChange={handleChange} placeholder="Masukkan No. STR"
                            className="w-full px-2 py-1 bg-background border border-border rounded text-xs focus:outline-none focus:ring-2 focus:ring-primary" />
                        </div>
                        <div>
                          <label className="block text-[11px] font-medium mb-1">Masa Berlaku STR</label>
                          <input type="date" name="masa_berlaku_str" value={formData.masa_berlaku_str || ''} onChange={handleChange}
                            className="w-full px-2 py-1 bg-background border border-border rounded text-xs focus:outline-none focus:ring-2 focus:ring-primary" />
                        </div>
                      </div>
                      <input type="file" name="file_str" onChange={handleChange} accept=".pdf,.jpg,.jpeg,.png"
                        className="w-full text-xs text-muted-foreground file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90" />
                    </div>
                    <div className="p-4 border border-border rounded-lg bg-muted/20">
                      <div className="flex justify-between items-start mb-2">
                        <label className="block text-sm font-medium">Dokumen SIP/SIK</label>
                        {formData.current_sip && <span className="text-[10px] bg-green-500/10 text-green-500 px-2 py-0.5 rounded-full font-medium">Terunggah</span>}
                      </div>
                      {formData.current_sip && (
                        <a href={`${BASE_URL}/${formData.current_sip}`} target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline block mb-2 font-medium">📄 Lihat File Saat Ini</a>
                      )}
                      <div className="space-y-2 mb-3">
                        <div>
                          <label className="block text-[11px] font-medium mb-1">No. SIP</label>
                          <input type="text" name="no_sip" value={formData.no_sip || ''} onChange={handleChange} placeholder="Masukkan No. SIP"
                            className="w-full px-2 py-1 bg-background border border-border rounded text-xs focus:outline-none focus:ring-2 focus:ring-primary" />
                        </div>
                        <div>
                          <label className="block text-[11px] font-medium mb-1">Masa Berlaku SIP</label>
                          <input type="date" name="masa_berlaku_sip" value={formData.masa_berlaku_sip || ''} onChange={handleChange}
                            className="w-full px-2 py-1 bg-background border border-border rounded text-xs focus:outline-none focus:ring-2 focus:ring-primary" />
                        </div>
                      </div>
                      <input type="file" name="file_sip" onChange={handleChange} accept=".pdf,.jpg,.jpeg,.png"
                        className="w-full text-xs text-muted-foreground file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90" />
                    </div>
                  </div>
                </div>

              </div>

              <div className="pt-6 mt-6 border-t border-border flex justify-end space-x-3">
                <button type="button" onClick={handleCloseModal} className="px-6 py-2.5 bg-muted text-foreground rounded-md text-sm font-medium hover:bg-muted/80 transition-colors">Batal</button>
                <button type="submit" className="px-6 py-2.5 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm">Simpan Data</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal CRUD Pelatihan */}
      {isPelatihanModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card w-full max-w-lg rounded-xl border border-border shadow-lg flex flex-col overflow-hidden max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-border bg-muted/30">
              <h3 className="font-bold text-xl">{pelatihanModalMode === 'add' ? 'Tambah Data Pelatihan' : 'Edit Data Pelatihan'}</h3>
              <button type="button" onClick={() => setIsPelatihanModalOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handlePelatihanModalSubmit} className="p-6 space-y-4 overflow-y-auto">
              <div>
                <label className="block text-sm font-medium mb-1">Perawat *</label>
                <select value={pelatihanModalForm.id_perawat} onChange={e => setPelatihanModalForm({ ...pelatihanModalForm, id_perawat: e.target.value })} required className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                  <option value="">Pilih Perawat</option>
                  {perawatData.map(p => <option key={p.id_perawat} value={p.id_perawat}>{p.nama}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Nama Pelatihan *</label>
                <input type="text" value={pelatihanModalForm.nama_pelatihan} onChange={e => setPelatihanModalForm({ ...pelatihanModalForm, nama_pelatihan: e.target.value })} required className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Penyelenggara</label>
                <input type="text" value={pelatihanModalForm.penyelenggara} onChange={e => setPelatihanModalForm({ ...pelatihanModalForm, penyelenggara: e.target.value })} className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Tanggal Mulai</label>
                  <input type="date" value={pelatihanModalForm.tanggal_mulai} onChange={e => setPelatihanModalForm({ ...pelatihanModalForm, tanggal_mulai: e.target.value })} className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Tanggal Selesai</label>
                  <input type="date" value={pelatihanModalForm.tanggal_selesai} onChange={e => setPelatihanModalForm({ ...pelatihanModalForm, tanggal_selesai: e.target.value })} className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Jumlah Jam / JPL</label>
                  <input type="number" value={pelatihanModalForm.jumlah_jam} onChange={e => setPelatihanModalForm({ ...pelatihanModalForm, jumlah_jam: e.target.value })} className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">No. Sertifikat</label>
                  <input type="text" value={pelatihanModalForm.no_sertifikat} onChange={e => setPelatihanModalForm({ ...pelatihanModalForm, no_sertifikat: e.target.value })} className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Upload Sertifikat</label>
                <input type="file" onChange={e => setPelatihanModalForm({ ...pelatihanModalForm, file: e.target.files[0] })} accept=".pdf,.jpg,.jpeg,.png" className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-primary-foreground" />
              </div>

              <div className="pt-4 mt-6 border-t border-border flex justify-end space-x-3">
                <button type="button" onClick={() => setIsPelatihanModalOpen(false)} className="px-5 py-2 bg-muted text-foreground rounded-md text-sm font-medium hover:bg-muted/80 transition-colors">Batal</button>
                <button type="submit" className="px-5 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Nilai Ujian Akhir */}
      {showNilaiModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-card text-card-foreground rounded-xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col scale-100 animate-in zoom-in-95 duration-200">
            <div className="p-8 text-center flex flex-col items-center">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                <CheckCircle size={40} />
              </div>
              <h3 className="text-2xl font-black mb-2">Ujian Selesai!</h3>
              <p className="text-muted-foreground mb-8">Terima kasih telah menyelesaikan ujian kompetensi. Berikut adalah nilai akhir Anda:</p>

              <div className="text-6xl font-black text-primary mb-8">
                {finalNilai}
              </div>

              <button
                onClick={() => {
                  setShowNilaiModal(false);
                  setSertifikatSubTab('form_01');
                }}
                className="w-full px-6 py-3 bg-primary text-primary-foreground font-bold hover:bg-primary/90 rounded-xl transition-all shadow-md"
              >
                Tutup & Kembali
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Detail Hasil Ujian */}
      {isViewingHasilUjian && detailHasilUjian && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card w-full max-w-4xl rounded-xl border border-border shadow-lg flex flex-col overflow-hidden max-h-[90vh]">
            <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-muted/30">
              <div>
                <h3 className="text-lg font-bold text-foreground">Detail Jawaban Ujian</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Skor Akhir: {detailHasilUjian.nilai}</p>
              </div>
              <button onClick={() => setIsViewingHasilUjian(false)} className="p-2 bg-muted hover:bg-destructive hover:text-white rounded-lg transition-colors">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-6">
              {detailHasilUjian.soal.map((soal, index) => {
                const ansUser = detailHasilUjian.jawaban_user[soal.id_soal] || '-';
                const ansCorrect = soal.jawaban_benar ? soal.jawaban_benar.trim().toUpperCase() : '';
                const isCorrect = ansUser === ansCorrect;

                return (
                  <div key={soal.id_soal} className={`p-4 rounded-xl border ${isCorrect ? 'border-green-200 bg-green-50/30' : 'border-destructive/30 bg-destructive/5'}`}>
                    <h4 className="font-bold text-sm mb-3">
                      <span className="text-primary mr-2">{index + 1}.</span>
                      {soal.pertanyaan}
                    </h4>
                    <div className="space-y-2 pl-6">
                      {['A', 'B', 'C', 'D', 'E'].map(opt => {
                        const opsiText = soal[`opsi_${opt.toLowerCase()}`];
                        if (!opsiText) return null;

                        let optClass = "border-border";
                        if (opt === ansCorrect) {
                          optClass = "border-green-500 bg-green-100 dark:bg-green-900/30 font-bold text-green-800 dark:text-green-300";
                        } else if (opt === ansUser && !isCorrect) {
                          optClass = "border-destructive bg-destructive/10 font-bold text-destructive";
                        }

                        return (
                          <div key={opt} className={`flex items-start gap-3 p-2 rounded-lg border ${optClass}`}>
                            <span className="text-sm w-full">
                              <strong>{opt}.</strong> {opsiText}
                            </span>
                            {opt === ansCorrect && <CheckCircle size={16} className="text-green-600 dark:text-green-400 ml-auto shrink-0" />}
                            {opt === ansUser && !isCorrect && <XCircle size={16} className="text-destructive ml-auto shrink-0" />}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Modal CRUD Kompetensi */}
      {isKompetensiModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card w-full max-w-lg rounded-xl border border-border shadow-lg flex flex-col overflow-hidden max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-border bg-muted/30">
              <h3 className="font-bold text-xl">{kompetensiModalMode === 'add' ? 'Tambah Data Kompetensi' : 'Edit Data Kompetensi'}</h3>
              <button type="button" onClick={handleCloseKompetensiModal} className="text-muted-foreground hover:text-foreground transition-colors">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleKompetensiSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Kode Kompetensi</label>
                <input
                  type="text"
                  name="kode_kompetensi"
                  value={kompetensiFormData.kode_kompetensi}
                  onChange={handleKompetensiChange}
                  required
                  placeholder="Contoh: KD-01, PK-02"
                  className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Nama Kompetensi</label>
                <textarea
                  name="nama_kompetensi"
                  value={kompetensiFormData.nama_kompetensi}
                  onChange={handleKompetensiChange}
                  required
                  rows="3"
                  placeholder="Masukkan deskripsi kompetensi..."
                  className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Kategori</label>
                <select
                  name="kategori"
                  value={kompetensiFormData.kategori}
                  onChange={handleKompetensiChange}
                  required
                  className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Pilih Kategori</option>
                  <option value="Kompetensi Dasar">Kompetensi Dasar</option>
                  <option value="Kompetensi Klinis (PK)">Kompetensi Klinis (PK)</option>
                  <option value="Kompetensi Khusus">Kompetensi Khusus</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Unit Kerja</label>
                <select
                  name="unit"
                  value={kompetensiFormData.unit}
                  onChange={handleKompetensiChange}
                  required
                  className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Pilih Unit Kerja</option>
                  {unitKerjaData.map(u => <option key={u.id} value={u.nama_unit}>{u.nama_unit}</option>)}
                  <option value="Keperawatan Umum">Keperawatan Umum</option>
                </select>
              </div>

              <div className="pt-4 mt-6 border-t border-border flex justify-end space-x-3">
                <button type="button" onClick={handleCloseKompetensiModal} className="px-5 py-2 bg-muted text-foreground rounded-md text-sm font-medium hover:bg-muted/80 transition-colors">Batal</button>
                <button type="submit" className="px-5 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Jenis RKK */}
      {showJenisModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card w-full max-w-md rounded-xl border border-border shadow-lg flex flex-col overflow-hidden max-h-[90vh] animate-fade-in">
            <div className="flex justify-between items-center p-6 border-b border-border bg-muted/30">
              <h3 className="font-bold text-xl">{editingJenisKd ? 'Edit Kategori RKK' : 'Tambah Kategori RKK'}</h3>
              <button type="button" onClick={() => setShowJenisModal(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={editingJenisKd ? handleEditJenis : handleAddJenis} className="p-6 space-y-4 overflow-y-auto">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1 uppercase">Kode Kategori *</label>
                <input
                  type="text"
                  placeholder="Contoh: KMB, ANA, GADAR"
                  value={jenisForm.kd_jenis}
                  onChange={e => setJenisForm({ ...jenisForm, kd_jenis: e.target.value.toUpperCase() })}
                  disabled={editingJenisKd !== null}
                  required
                  maxLength={10}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1 uppercase">Nama Kategori RKK *</label>
                <input
                  type="text"
                  placeholder="Contoh: Keperawatan Medikal Bedah"
                  value={jenisForm.nm_jenis}
                  onChange={e => setJenisForm({ ...jenisForm, nm_jenis: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="pt-4 border-t border-border flex justify-end space-x-3">
                <button type="button" onClick={() => setShowJenisModal(false)} className="px-5 py-2 bg-muted text-foreground rounded-md text-sm font-medium hover:bg-muted/80 transition-colors">Batal</button>
                <button type="submit" className="px-5 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Master RKK */}
      {showRkkModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card w-full max-w-lg rounded-xl border border-border shadow-lg flex flex-col overflow-hidden max-h-[90vh] animate-fade-in">
            <div className="flex justify-between items-center p-6 border-b border-border bg-muted/30">
              <h3 className="font-bold text-xl">{editingRkkId ? 'Edit Kewenangan Klinis (RKK)' : 'Tambah Kewenangan Klinis (RKK)'}</h3>
              <button type="button" onClick={() => setShowRkkModal(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSaveRkk} className="p-6 space-y-4 overflow-y-auto">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1 uppercase">Kategori RKK *</label>
                <select
                  value={rkkForm.kd_jenis}
                  onChange={e => {
                    const newJenis = e.target.value;
                    setRkkForm(prev => {
                      const next = { ...prev, kd_jenis: newJenis };
                      if (next.level_pk === 1 && newJenis !== 'MGR' && newJenis !== 'MATER') {
                        next.kd_jenis = 'KMB';
                      }
                      return next;
                    });
                  }}
                  required
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">-- Pilih Kategori --</option>
                  {jenisList.map(j => {
                    if (rkkForm.level_pk === 1 && j.kd_jenis !== 'KMB' && j.kd_jenis !== 'MGR' && j.kd_jenis !== 'MATER') {
                      return null;
                    }
                    return (
                      <option key={j.kd_jenis} value={j.kd_jenis}>{j.nm_jenis} ({j.kd_jenis})</option>
                    );
                  })}
                </select>

              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1 uppercase">Level PK *</label>
                <select
                  value={rkkForm.level_pk}
                  onChange={e => {
                    const newLvl = Number(e.target.value);
                    setRkkForm(prev => {
                      const next = { ...prev, level_pk: newLvl };
                      if (newLvl === 1 && next.kd_jenis !== 'MGR' && next.kd_jenis !== 'MATER') {
                        next.kd_jenis = 'KMB';
                      }
                      return next;
                    });
                  }}
                  required
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value={1}>Level PK 1</option>
                  <option value={2}>Level PK 2</option>
                  <option value={3}>Level PK 3</option>
                  <option value={4}>Level PK 4</option>
                  <option value={5}>Level PK 5</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1 uppercase">Rincian Kewenangan Klinis *</label>
                <textarea
                  placeholder="Tuliskan detail tindakan / kewenangan klinis..."
                  value={rkkForm.kewenangan}
                  onChange={e => setRkkForm({ ...rkkForm, kewenangan: e.target.value })}
                  required
                  rows={4}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1 uppercase">Status Aktif *</label>
                <select
                  value={rkkForm.aktif}
                  onChange={e => setRkkForm({ ...rkkForm, aktif: Number(e.target.value) })}
                  required
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value={1}>Aktif</option>
                  <option value={0}>Nonaktif</option>
                </select>
              </div>

              <div className="pt-4 border-t border-border flex justify-end space-x-3">
                <button type="button" onClick={() => setShowRkkModal(false)} className="px-5 py-2 bg-muted text-foreground rounded-md text-sm font-medium hover:bg-muted/80 transition-colors">Batal</button>
                <button type="submit" className="px-5 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal CRUD User */}
      {isUserModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card w-full max-w-lg rounded-xl border border-border shadow-lg flex flex-col overflow-hidden max-h-[90vh] animate-fade-in">
            <div className="flex justify-between items-center p-6 border-b border-border bg-muted/30">
              <h3 className="font-bold text-xl">{userModalMode === 'add' ? 'Tambah Data User' : 'Edit Data User'}</h3>
              <button type="button" onClick={handleCloseUserModal} className="text-muted-foreground hover:text-foreground transition-colors">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleUserSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  name="nama"
                  value={userFormData.nama}
                  onChange={handleUserChange}
                  required
                  placeholder="Contoh: Siti Aminah, A.Md.Kep"
                  className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Username</label>
                <input
                  type="text"
                  name="username"
                  value={userFormData.username}
                  onChange={handleUserChange}
                  required
                  disabled={userModalMode === 'edit'}
                  placeholder="Contoh: sitiaminah"
                  className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:bg-muted text-foreground"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Password</label>
                <input
                  type="password"
                  name="password"
                  value={userFormData.password}
                  onChange={handleUserChange}
                  required={userModalMode === 'add'}
                  placeholder={userModalMode === 'add' ? "Masukkan password baru" : "Kosongkan jika tidak ingin mengubah password"}
                  className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                />
                {userModalMode === 'edit' && (
                  <p className="text-[10px] text-muted-foreground mt-1 font-medium">Kosongkan kolom ini jika password tidak diubah.</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Role</label>
                <select
                  name="role"
                  value={userFormData.role}
                  onChange={handleUserChange}
                  required
                  disabled={userFormData.username === 'admin'}
                  className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:bg-muted text-foreground"
                >
                  <option value="Admin">Admin</option>
                  <option value="Asesor">Asesor</option>
                  <option value="Perawat">Perawat</option>
                </select>
                {userFormData.username === 'admin' && (
                  <p className="text-[10px] text-yellow-500 mt-1 font-semibold">Role untuk admin utama tidak dapat diubah.</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status Keaktifan</label>
                <select
                  name="status"
                  value={userFormData.status}
                  onChange={handleUserChange}
                  required
                  disabled={userFormData.username === 'admin'}
                  className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:bg-muted text-foreground"
                >
                  <option value="A">Aktif</option>
                  <option value="N">Nonaktif</option>
                </select>
                {userFormData.username === 'admin' && (
                  <p className="text-[10px] text-yellow-500 mt-1 font-semibold">Status keaktifan admin utama tidak dapat diubah.</p>
                )}
              </div>

              {userFormData.role === 'Perawat' && (
                <div>
                  <label className="block text-sm font-medium mb-1">Tautkan ke Data Pegawai</label>
                  <SearchableSelect
                    name="id_perawat"
                    placeholder="Cari nama pegawai..."
                    value={userFormData.id_perawat || ''}
                    onChange={handleUserChange}
                    options={[
                      { value: '', label: '-- Tidak Ditautkan --' },
                      ...perawatData.map(p => ({ value: p.id_perawat, label: `${p.nama} (${p.nip})` }))
                    ]}
                  />
                  <p className="text-xs text-muted-foreground mt-1">Opsional: Pilih pegawai untuk menautkan profil ke akun ini.</p>
                </div>
              )}

              <div className="pt-4 mt-6 border-t border-border flex justify-end space-x-3">
                <button type="button" onClick={handleCloseUserModal} className="px-5 py-2 bg-muted text-foreground rounded-md text-sm font-medium hover:bg-muted/80 transition-colors">Batal</button>
                <button type="submit" className="px-5 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Peringatan Kecurangan */}
      {cheatWarningModal.show && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-card w-full max-w-md rounded-2xl border border-destructive/30 shadow-2xl overflow-hidden animate-fade-in flex flex-col items-center p-6 text-center">
            <div className="p-4 bg-destructive/10 rounded-full text-destructive mb-4 animate-bounce">
              <AlertTriangle size={48} />
            </div>
            <h3 className="text-xl font-bold text-destructive mb-2">
              {cheatWarningModal.isLast ? 'Ujian Dihentikan!' : 'Peringatan Kecurangan!'}
            </h3>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed text-foreground">
              {cheatWarningModal.message}
            </p>
            {!cheatWarningModal.isLast && (
              <div className="w-full bg-muted dark:bg-muted/50 rounded-lg p-3 mb-6 flex justify-around text-xs font-semibold text-foreground">
                <span className={cheatWarningModal.count >= 1 ? "text-destructive font-bold" : "text-muted-foreground"}>Peringatan 1 {cheatWarningModal.count >= 1 ? "⚠️" : "⚪"}</span>
                <span className={cheatWarningModal.count >= 2 ? "text-destructive font-bold" : "text-muted-foreground"}>Peringatan 2 {cheatWarningModal.count >= 2 ? "⚠️" : "⚪"}</span>
                <span className="text-muted-foreground">Otomatis Submit ⛔</span>
              </div>
            )}
            <button
              type="button"
              onClick={() => setCheatWarningModal(prev => ({ ...prev, show: false }))}
              className="w-full py-2.5 px-4 bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-lg text-sm font-semibold transition-colors shadow-md focus:outline-none"
            >
              {cheatWarningModal.isLast ? 'Selesai' : 'Saya Mengerti'}
            </button>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3.5 rounded-xl border shadow-xl backdrop-blur-md animate-slide-in transition-all duration-300 ${toast.type === 'success'
          ? 'bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400'
          : 'bg-destructive/10 border-destructive/20 text-destructive'
          }`}>
          {toast.type === 'success' ? (
            <CheckCircle size={18} className="text-green-500 shrink-0" />
          ) : (
            <XCircle size={18} className="text-destructive shrink-0" />
          )}
          <span className="text-xs font-semibold">{toast.message}</span>
          <button
            type="button"
            onClick={() => setToast(prev => ({ ...prev, show: false }))}
            className="text-muted-foreground hover:text-foreground transition-colors ml-2"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Modal Preview Foto Profil (Lebih Besar) */}
      {previewPhotoUrl && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-[99999] flex items-center justify-center p-4 cursor-zoom-out animate-in fade-in duration-200"
          onClick={() => setPreviewPhotoUrl(null)}
        >
          <div 
            className="relative max-w-full max-h-[85vh] bg-card/40 border border-white/10 rounded-2xl overflow-hidden shadow-2xl p-2 animate-in zoom-in-95 duration-200"
            onClick={e => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              type="button"
              onClick={() => setPreviewPhotoUrl(null)}
              className="absolute top-4 right-4 p-2 bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors z-10 shadow-md"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Detail Matriks Hasil Asesmen Modal */}
      {showDetailMatriksModal && selectedPengajuanForMatriks && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 print:p-0">
          <div className="bg-card w-full max-w-5xl rounded-xl border border-border shadow-2xl overflow-hidden flex flex-col max-h-[90vh] print:max-h-none print:shadow-none print:border-none print:w-full print:rounded-none">
            {/* Header */}
            <div className="px-6 py-4 bg-muted/20 border-b border-border flex justify-between items-start print:pb-2 print:border-b-2 print:border-black">
              <div>
                <h3 className="text-lg font-bold text-foreground print:text-xl">Detail Matriks Hasil Asesmen</h3>
                {(() => {
                  const nurse = perawatData.find(n => String(n.id_perawat) === String(selectedPengajuanForMatriks.id_perawat)) || {};
                  const primaryAsesor = userData.find(u => String(u.id) === String(selectedPengajuanForMatriks.id_asesor))?.nama || '-';
                  const pendampingAsesor = userData.find(u => String(u.id) === String(selectedPengajuanForMatriks.id_asesor_pendamping))?.nama || '-';
                  return (
                    <div className="mt-1 text-xs text-muted-foreground space-y-0.5 print:text-black">
                      <p>
                        Asesi: <strong className="text-foreground print:text-black">{toProperCase(nurse.nama)}</strong> ({nurse.nip || '-'}) | Unit: <strong className="text-foreground print:text-black">{nurse.unit_kerja || '-'}</strong>
                      </p>
                      <p>
                        Asesor Utama: <strong className="text-foreground print:text-black">{primaryAsesor}</strong> | Asesor Pendamping: <strong className="text-foreground print:text-black">{pendampingAsesor}</strong>
                      </p>
                    </div>
                  );
                })()}
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowDetailMatriksModal(false);
                  setSelectedPengajuanForMatriks(null);
                  setMatriksTulisExamDetails(null);
                }}
                className="p-1 hover:bg-muted rounded text-muted-foreground print:hidden"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content Table */}
            <div className="p-6 overflow-y-auto flex-1 print:overflow-visible print:p-0">
              <div className="overflow-x-auto rounded-lg border border-border print:border-none">
                <table className="w-full text-xs text-left border-collapse print:text-[10px]">
                  <thead className="bg-muted/40 border-b border-border text-muted-foreground uppercase text-[10px] font-bold print:border-b-2 print:border-black print:text-black">
                    <tr>
                      <th className="px-4 py-3.5 w-12 text-center">NO</th>
                      <th className="px-4 py-3.5">UNIT KOMPETENSI</th>
                      <th className="px-4 py-3.5 text-center w-24">UJI TULIS</th>
                      <th className="px-4 py-3.5 text-center w-24">UJI LISAN</th>
                      <th className="px-4 py-3.5 text-center w-24">UJI OBSERVASI</th>
                      <th className="px-4 py-3.5 text-center w-48">EVALUASI PORTOFOLIO</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60 print:divide-y print:divide-black">
                    {(() => {
                      const units = get12KompetensiForPengajuan(selectedPengajuanForMatriks);
                      const forms = selectedPengajuanForMatriks.form_data ? JSON.parse(selectedPengajuanForMatriks.form_data) : {};
                      const oralData = forms['global_form03b'] || {};
                      const obsData = forms['global_form03a'] || {};
                      
                      return units.map((u, idx) => {
                        const writtenScore = getUnitWrittenScore(u.kode, matriksTulisExamDetails);
                        const oralVal = oralData[`${u.kode}_nilai`] || '';
                        const obsVal = obsData[`${u.kode}_nilai`] || '';
                        const portVal = forms[`${u.kode}_form03d`] || {};
                        const isPortValid = portVal.v1 && portVal.a1 && portVal.t1 && portVal.k1;
                        const portText = isPortValid ? "Memadai / Kompeten" : "Tidak Memadai / Belum Diisi";

                        return (
                          <tr key={u.kode} className="hover:bg-muted/10">
                            <td className="px-4 py-3 text-center font-semibold text-muted-foreground">{idx + 1}.</td>
                            <td className="px-4 py-3">
                              <div className="font-bold text-foreground">{u.kode}</div>
                              <div className="text-[10px] text-muted-foreground font-medium mt-0.5">{u.judul}</div>
                            </td>
                            <td className="px-4 py-3 text-center whitespace-nowrap">
                              {writtenScore !== null ? (
                                <span className={`px-2 py-0.5 rounded font-bold text-xs whitespace-nowrap inline-block ${
                                  writtenScore >= 70 ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
                                }`}>
                                  {writtenScore}%
                                </span>
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-center whitespace-nowrap">
                              {oralVal === 'K' && (
                                <span className="px-2 py-0.5 bg-green-50 text-green-700 border border-green-200 rounded font-bold text-xs whitespace-nowrap inline-block">K</span>
                              )}
                              {oralVal === 'BK' && (
                                <span className="px-2 py-0.5 bg-red-50 text-red-700 border border-red-200 rounded font-bold text-xs whitespace-nowrap inline-block">BK</span>
                              )}
                              {!oralVal && <span className="text-muted-foreground">-</span>}
                            </td>
                            <td className="px-4 py-3 text-center whitespace-nowrap">
                              {obsVal === 'K' && (
                                <span className="px-2 py-0.5 bg-green-50 text-green-700 border border-green-200 rounded font-bold text-xs whitespace-nowrap inline-block">K</span>
                              )}
                              {obsVal === 'BK' && (
                                <span className="px-2 py-0.5 bg-red-50 text-red-700 border border-red-200 rounded font-bold text-xs whitespace-nowrap inline-block">BK</span>
                              )}
                              {!obsVal && <span className="text-muted-foreground">-</span>}
                            </td>
                            <td className="px-4 py-3 text-center whitespace-nowrap">
                              <span className={`px-2.5 py-1 text-[10px] font-semibold rounded border whitespace-nowrap inline-block ${
                                isPortValid ? 'bg-green-50 text-green-700 border-green-200' : 'bg-muted text-muted-foreground border-border'
                              }`}>
                                {portText}
                              </span>
                            </td>
                          </tr>
                        );
                      });
                    })()}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-border bg-muted/10 flex justify-end gap-3 print:hidden">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg transition-all flex items-center gap-2 shadow-sm"
              >
                <Printer size={16} /> Cetak Matriks
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowDetailMatriksModal(false);
                  setSelectedPengajuanForMatriks(null);
                  setMatriksTulisExamDetails(null);
                }}
                className="px-4 py-2 bg-secondary hover:bg-secondary/80 text-foreground text-sm font-semibold rounded-lg border border-border transition-all"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
