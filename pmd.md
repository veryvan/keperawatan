# PMD.md — Nursing Management System

# 1. Project Overview

## Nama Aplikasi

Nursing Management System (NMS)

## Deskripsi

Aplikasi manajemen keperawatan untuk mendukung pengelolaan data tenaga keperawatan, asesmen kompetensi, sertifikasi kompetensi, kredensial keperawatan, pelatihan, dan monitoring kewenangan klinis sesuai standar pelayanan keperawatan rumah sakit.

Aplikasi mendukung proses:

* pendataan tenaga keperawatan
* asesmen kompetensi
* sertifikasi kompetensi
* kredensial keperawatan
* monitoring STR/SIP
* monitoring pelatihan
* clinical privilege
* dashboard monitoring keperawatan

---

# 2. Objective

Tujuan aplikasi:

1. Mempermudah pengelolaan data keperawatan.
2. Mendukung proses asesmen kompetensi perawat.
3. Mendukung proses kredensial dan rekredensial.
4. Monitoring masa berlaku STR/SIP/sertifikat.
5. Mempermudah dokumentasi pelatihan.
6. Mendukung akreditasi rumah sakit dan SNARS.
7. Menyediakan dashboard monitoring SDM keperawatan.

---

# 3. Standard Reference

Aplikasi mengacu pada:

* Standar Kompetensi Perawat Indonesia
* SKKNI Keperawatan
* SNARS
* Standar Kredensial Rumah Sakit
* PMK terkait tenaga keperawatan
* Komite Keperawatan
* Dokumen sertifikasi kompetensi keperawatan

Contoh dokumen:

* Formulir Permohonan Sertifikasi Kompetensi
* Form Asesmen Kompetensi
* Form Kredensial
* Clinical Privilege

---

# 4. Main Modules

# 4.1 Master Data Perawat

## Features

* Data perawat
* Biodata tenaga keperawatan
* Pendidikan formal
* Riwayat pekerjaan
* Riwayat mutasi
* Status aktif/nonaktif
* Jenjang karir klinis

## Fields

* NIP
* Nama
* Tempat lahir
* Tanggal lahir
* Jenis kelamin
* Alamat
* No HP
* Email
* Unit kerja
* Jabatan
* Pendidikan terakhir
* Status pegawai

---

# 4.2 Modul Kompetensi Keperawatan

## Features

* Master unit kompetensi
* Kompetensi dasar
* Kompetensi khusus
* Kompetensi per unit
* Mapping kompetensi
* Checklist kompetensi

## Contoh Kompetensi

* Balance cairan
* Pemasangan infus
* BTCLS
* ICU
* NICU
* HD
* IGD
* OK
* Ventilator
* Emergency nursing

---

# 4.3 Modul Sertifikasi Kompetensi

## Features

* Pengajuan sertifikasi
* Upload dokumen pendukung
* Penilaian asesor
* Validasi bukti kompetensi
* Status asesmen
* Rekomendasi asesor

## Dokumen Pendukung

* Ijazah
* STR
* SIP
* Sertifikat pelatihan
* Surat keterangan
* Job description
* Portofolio tindakan
* Clinical logbook

## Workflow

1. Perawat mengajukan sertifikasi.
2. Upload dokumen.
3. Verifikasi asesor.
4. Penilaian kompetensi.
5. Rekomendasi.
6. Status kompeten/belum kompeten.

---

# 4.4 Modul Kredensial Keperawatan

## Features

* Pengajuan kredensial
* Rekredensial
* Clinical privilege
* Approval komite keperawatan
* Masa berlaku kewenangan klinis
* Monitoring kewenangan klinis

## Output

* Surat kewenangan klinis
* Daftar clinical privilege
* Histori kredensial

---

# 4.5 Modul Asesmen Kompetensi

## Features

* Self assessment
* Penilaian kompetensi
* Checklist asesmen
* Observasi langsung
* Wawancara
* Penilaian portofolio
* Validasi asesor

## Status Penilaian

* Kompeten
* Belum kompeten
* Perlu pembinaan
* Pending

---

# 4.6 Modul STR dan SIP

## Features

* Data STR
* Data SIP
* Monitoring expired
* Reminder masa berlaku
* Upload dokumen STR/SIP

## Reminder

* 90 hari sebelum expired
* 30 hari sebelum expired
* Hari H expired

---

# 4.7 Modul Pelatihan

## Features

* Riwayat pelatihan
* Jadwal pelatihan
* Sertifikat pelatihan
* Kredit poin
* Reminder expired sertifikat

## Jenis Pelatihan

* BTCLS
* BHD
* IPCN
* ICU Training
* NICU Training
* Hemodialisa
* PPGD
* Pelatihan mutu

---

# 4.8 Dashboard Monitoring

## Dashboard SDM

* Jumlah perawat aktif
* Jumlah per unit
* STR akan expired
* SIP akan expired
* Kompetensi belum lengkap
* Sertifikat expired
* Status kredensial

## Dashboard Grafik

* Grafik kompetensi
* Grafik pelatihan
* Grafik kredensial
* Grafik SDM per unit

---

# 5. User Role

# 5.1 Admin

## Access

* Full access
* Kelola master data
* Kelola user
* Monitoring sistem

---

# 5.2 Kepala Ruangan

## Access

* Monitoring staf
* Validasi kompetensi
* Approval internal
* Monitoring pelatihan

---

# 5.3 Perawat

## Access

* Input data pribadi
* Upload dokumen
* Pengajuan sertifikasi
* Self assessment
* Melihat status kompetensi

---

# 5.4 Komite Keperawatan

## Access

* Approval kredensial
* Validasi kompetensi
* Monitoring clinical privilege
* Penilaian rekredensial

---

# 5.5 Asesor

## Access

* Penilaian asesmen
* Validasi bukti
* Rekomendasi kompetensi

---

# 6. Database Design

# tabel_perawat

| Field         | Type    |
| ------------- | ------- |
| id_perawat    | bigint  |
| nip           | varchar |
| nama          | varchar |
| tempat_lahir  | varchar |
| tanggal_lahir | date    |
| jk            | char    |
| alamat        | text    |
| hp            | varchar |
| email         | varchar |
| unit_kerja    | varchar |
| jabatan       | varchar |
| status        | char    |

---

# tabel_pendidikan

| Field       | Type    |
| ----------- | ------- |
| id          | bigint  |
| id_perawat  | bigint  |
| pendidikan  | varchar |
| institusi   | varchar |
| tahun_lulus | year    |

---

# tabel_kompetensi

| Field           | Type    |
| --------------- | ------- |
| id              | bigint  |
| kode_kompetensi | varchar |
| nama_kompetensi | varchar |
| kategori        | varchar |
| unit            | varchar |

---

# tabel_sertifikat

| Field           | Type    |
| --------------- | ------- |
| id              | bigint  |
| id_perawat      | bigint  |
| nama_sertifikat | varchar |
| nomor           | varchar |
| tgl_terbit      | date    |
| tgl_expired     | date    |
| file            | varchar |

---

# tabel_assessment

| Field         | Type     |
| ------------- | -------- |
| id            | bigint   |
| id_perawat    | bigint   |
| id_kompetensi | bigint   |
| asesor        | bigint   |
| nilai         | decimal  |
| status        | varchar  |
| catatan       | text     |
| tanggal       | datetime |

---

# tabel_kredensial

| Field        | Type     |
| ------------ | -------- |
| id           | bigint   |
| id_perawat   | bigint   |
| status       | varchar  |
| tanggal      | datetime |
| masa_berlaku | date     |
| catatan      | text     |

---

# 7. Workflow

# Workflow Sertifikasi

1. Perawat login.
2. Mengisi formulir sertifikasi.
3. Upload dokumen pendukung.
4. Verifikasi admin.
5. Penilaian asesor.
6. Hasil kompetensi.
7. Approval komite.

---

# Workflow Kredensial

1. Pengajuan kredensial.
2. Verifikasi dokumen.
3. Penilaian kompetensi.
4. Approval komite.
5. Terbit clinical privilege.

---

# 8. Integration

## SIMRS Integration

* Master pegawai
* Unit kerja
* Jadwal dinas
* User login

## SSO Integration

* LDAP
* Active Directory

## Notification

* WhatsApp Gateway
* Email Reminder

---

# 9. Technology Stack

## Backend

* CodeIgniter 4
* Laravel

## Frontend

* ReactJS
* TailwindCSS
* Shadcn UI

## Database

* MySQL
* MariaDB

## Server

* Linux Ubuntu
* Nginx / Apache

---

# 10. Security

## Features

* Role based access
* Audit trail
* Log aktivitas
* Session management
* Enkripsi password
* Upload validation

---

# 11. Additional Features

* Export PDF
* Export Excel
* Digital signature
* QR Code sertifikat
* Reminder otomatis
* Dashboard realtime
* Dark mode dashboard
* Mobile responsive

---

# 12. UI Design Concept

## Theme

* Modern Healthcare Dashboard
* Dark Mode
* Soft Blue Accent
* Responsive Layout

## Dashboard Components

* Statistic Card
* Progress Chart
* Competency Status
* Reminder Panel
* Credential Status

---

# 13. Future Development

* Mobile Apps
