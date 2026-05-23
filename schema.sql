CREATE TABLE tabel_perawat (
    id_perawat BIGINT AUTO_INCREMENT PRIMARY KEY,
    nip VARCHAR(50) NOT NULL,
    nama VARCHAR(150) NOT NULL,
    tempat_lahir VARCHAR(100),
    tanggal_lahir DATE,
    jk CHAR(1),
    alamat TEXT,
    hp VARCHAR(20),
    email VARCHAR(100),
    profesi VARCHAR(50),
    unit_kerja VARCHAR(100),
    jabatan VARCHAR(100),
    pendidikan_terakhir VARCHAR(100),
    no_ijazah VARCHAR(100),
    grup VARCHAR(50),
    status CHAR(1),
    foto VARCHAR(255),
    file_str VARCHAR(255),
    no_str VARCHAR(100),
    masa_berlaku_str DATE,
    file_sip VARCHAR(255),
    no_sip VARCHAR(100),
    masa_berlaku_sip DATE,
    id_user BIGINT NULL
);

CREATE TABLE tabel_pendidikan (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_perawat BIGINT,
    pendidikan VARCHAR(100),
    institusi VARCHAR(150),
    tahun_lulus YEAR,
    FOREIGN KEY (id_perawat) REFERENCES tabel_perawat(id_perawat) ON DELETE CASCADE
);

CREATE TABLE tabel_kompetensi (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    kode_kompetensi VARCHAR(50) NOT NULL,
    nama_kompetensi VARCHAR(200) NOT NULL,
    kategori VARCHAR(100),
    unit VARCHAR(100)
);

CREATE TABLE tabel_sertifikat (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_perawat BIGINT,
    nama_sertifikat VARCHAR(200) NOT NULL,
    nomor VARCHAR(100),
    tgl_terbit DATE,
    tgl_expired DATE,
    file VARCHAR(255),
    FOREIGN KEY (id_perawat) REFERENCES tabel_perawat(id_perawat) ON DELETE CASCADE
);

CREATE TABLE tabel_assessment (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_perawat BIGINT,
    id_kompetensi BIGINT,
    asesor BIGINT,
    nilai DECIMAL(5,2),
    status VARCHAR(50),
    catatan TEXT,
    tanggal DATETIME,
    FOREIGN KEY (id_perawat) REFERENCES tabel_perawat(id_perawat) ON DELETE CASCADE,
    FOREIGN KEY (id_kompetensi) REFERENCES tabel_kompetensi(id) ON DELETE CASCADE
);

CREATE TABLE tabel_kredensial (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_perawat BIGINT,
    status VARCHAR(50),
    tanggal DATETIME,
    masa_berlaku DATE,
    catatan TEXT,
    FOREIGN KEY (id_perawat) REFERENCES tabel_perawat(id_perawat) ON DELETE CASCADE
);

CREATE TABLE tabel_unit_kerja (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama_unit VARCHAR(100) NOT NULL
);

CREATE TABLE tabel_jabatan (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama_jabatan VARCHAR(100) NOT NULL
);

CREATE TABLE tabel_riwayat_kerja (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_perawat BIGINT,
    posisi VARCHAR(100) NOT NULL,
    instansi VARCHAR(150) NOT NULL,
    tahun_masuk YEAR,
    tahun_keluar YEAR,
    deskripsi TEXT,
    FOREIGN KEY (id_perawat) REFERENCES tabel_perawat(id_perawat) ON DELETE CASCADE
);

-- Seed 12 Kompetensi Dasar Perawat
INSERT INTO tabel_kompetensi (kode_kompetensi, nama_kompetensi, kategori, unit) VALUES
('KD-01', 'Melakukan komunikasi interpersonal dalam melaksanakan tindakan keperawatan', 'Kompetensi Dasar', 'Keperawatan Umum'),
('KD-02', 'Menerapkan prinsip etika dan etiket dalam pelayanan keperawatan', 'Kompetensi Dasar', 'Keperawatan Umum'),
('KD-03', 'Melakukan pengukuran tanda-tanda vital (TTV)', 'Kompetensi Dasar', 'Keperawatan Umum'),
('KD-04', 'Melakukan pengkajian keperawatan yang holistik', 'Kompetensi Dasar', 'Keperawatan Umum'),
('KD-05', 'Melakukan perawatan luka dasar (Wound Care)', 'Kompetensi Dasar', 'Keperawatan Umum'),
('KD-06', 'Memfasilitasi pemenuhan kebutuhan oksigenasi', 'Kompetensi Dasar', 'Keperawatan Umum'),
('KD-07', 'Memfasilitasi pemenuhan kebutuhan cairan dan elektrolit', 'Kompetensi Dasar', 'Keperawatan Umum'),
('KD-08', 'Melakukan pemberian obat dengan aman dan benar (6 Benar)', 'Kompetensi Dasar', 'Keperawatan Umum'),
('KD-09', 'Memfasilitasi pemenuhan kebutuhan eliminasi urine dan alvi', 'Kompetensi Dasar', 'Keperawatan Umum'),
('KD-10', 'Memfasilitasi pemenuhan kebutuhan nutrisi pasien', 'Kompetensi Dasar', 'Keperawatan Umum'),
('KD-11', 'Menerapkan prinsip-prinsip pencegahan dan pengendalian infeksi (PPI)', 'Kompetensi Dasar', 'Keperawatan Umum'),
('KD-12', 'Melakukan tindakan pencegahan cedera dan keselamatan pasien (Patient Safety)', 'Kompetensi Dasar', 'Keperawatan Umum');

CREATE TABLE tabel_user (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    nama VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL, -- Admin, Asesor, Perawat
    status CHAR(1) DEFAULT 'A', -- A: Aktif, N: Nonaktif
    otp_code VARCHAR(10) NULL,
    otp_expires_at DATETIME NULL
);

-- Seed data for tabel_user
-- Passwords are secure bcrypt hashes of: 'admin123', 'asesor123', 'perawat123' respectively.
INSERT INTO tabel_user (username, password, nama, role, status) VALUES
('admin', '$2y$10$q0Cfcw8oBSK6ymHCo6TkbuJniAUjRhiCLMMuJYnQtt1LULwdVlefm', 'Administrator Sistem', 'Admin', 'A'),
('asesor', '$2y$10$HgvksmA/zM7iyCJmENu/LuKfAbX/sFmYgObJrg74eClNOaSiHM.oi', 'Dr. Rahmat Asesor, M.Kep', 'Asesor', 'A'),
('perawat', '$2y$10$EO9dwLliZ9lJxZZme8qXa.9aC5ZZ4DYZVVcnwV.iltVaPkok5LWBW', 'Siti Rahma, A.Md.Kep', 'Perawat', 'A');

CREATE TABLE tabel_jenjang_jabatan (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama_jenjang VARCHAR(100) NOT NULL,
    kategori_pendidikan VARCHAR(50) NOT NULL, -- D3, S1, Semua
    profesi VARCHAR(50) NOT NULL -- Perawat, Bidan, Semua
);

INSERT INTO tabel_jenjang_jabatan (nama_jenjang, kategori_pendidikan, profesi) VALUES
('Terampil', 'D3', 'Perawat'),
('Mahir', 'D3', 'Perawat'),
('Madya', 'D3', 'Perawat'),
('Ahli Pertama', 'S1', 'Perawat'),
('Ahli Muda', 'S1', 'Perawat'),
('Ahli Madya', 'S1', 'Perawat'),
('Terampil', 'D3', 'Bidan'),
('Mahir', 'D3', 'Bidan'),
('Madya', 'D3', 'Bidan'),
('Ahli Pertama', 'S1', 'Bidan'),
('Ahli Muda', 'S1', 'Bidan'),
('Ahli Madya', 'S1', 'Bidan');

CREATE TABLE tabel_pelatihan (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_perawat BIGINT,
    nama_pelatihan VARCHAR(200) NOT NULL,
    penyelenggara VARCHAR(200),
    tanggal_mulai DATE,
    tanggal_selesai DATE,
    jumlah_jam INT,
    no_sertifikat VARCHAR(100),
    file VARCHAR(255),
    FOREIGN KEY (id_perawat) REFERENCES tabel_perawat(id_perawat) ON DELETE CASCADE
);

ALTER TABLE tabel_perawat
ADD CONSTRAINT fk_perawat_user FOREIGN KEY (id_user) REFERENCES tabel_user(id) ON DELETE SET NULL;
