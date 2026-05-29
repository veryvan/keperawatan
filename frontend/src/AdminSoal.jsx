import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, X } from 'lucide-react';

export default function AdminSoal({ API_URL, showToast, LIST_12_KOMPETENSI, SearchableSelect, pendidikanData = [] }) {
  const [soalList, setSoalList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPendidikan, setFilterPendidikan] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [formData, setFormData] = useState({
    id_soal: null,
    id_kompetensi: '',
    pertanyaan: '',
    opsi_a: '',
    opsi_b: '',
    opsi_c: '',
    opsi_d: '',
    opsi_e: '',
    jawaban_benar: '',
    pendidikan_soal: 'D3 Keperawatan' // Default selection
  });

  const pendidikanOptions = pendidikanData.length > 0
    ? pendidikanData.map(p => p.nama_pendidikan)
    : [
        'D3 Keperawatan',
        'S1 Ners',
        'D3 Kebidanan',
        'D4 Kebidanan',
        'S1 Kebidanan'
      ];

  const kompetensiOptions = LIST_12_KOMPETENSI.map(k => ({
    value: k.kode,
    label: `${k.kode} - ${k.judul}`
  }));

  useEffect(() => {
    fetchSoal();
  }, []);

  const fetchSoal = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/soal`);
      const data = await res.json();
      if (Array.isArray(data)) {
        // Handle migration of old data ('D3' -> 'D3 Keperawatan')
        const normalizedData = data.map(s => ({
            ...s,
            pendidikan_soal: s.pendidikan_soal === 'D3' ? 'D3 Keperawatan' : s.pendidikan_soal
        }));
        setSoalList(normalizedData);
      }
    } catch (err) {
      console.error(err);
      showToast('Gagal memuat data soal', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (mode, soal = null) => {
    setModalMode(mode);
    if (soal) {
      setFormData(soal);
    } else {
      setFormData({
        id_soal: null,
        id_kompetensi: '',
        pertanyaan: '',
        opsi_a: '',
        opsi_b: '',
        opsi_c: '',
        opsi_d: '',
        opsi_e: '',
        jawaban_benar: '',
        pendidikan_soal: 'D3 Keperawatan'
      });
    }
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.id_kompetensi || !formData.pertanyaan || !formData.jawaban_benar || !formData.pendidikan_soal) {
      return showToast('Mohon lengkapi semua field yang wajib.', 'error');
    }

    try {
      let res;
      if (modalMode === 'add') {
        res = await fetch(`${API_URL}/soal`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      } else {
        res = await fetch(`${API_URL}/soal/${formData.id_soal}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      }
      
      const data = await res.json();
      if (res.ok && !data.error) {
        showToast(data.message || 'Soal berhasil disimpan.', 'success');
        setIsModalOpen(false);
        fetchSoal();
      } else {
        showToast(data.messages ? Object.values(data.messages)[0] : 'Gagal menyimpan soal.', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Terjadi kesalahan koneksi.', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus soal ini?')) return;
    try {
      const res = await fetch(`${API_URL}/soal/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('Soal berhasil dihapus.', 'success');
        fetchSoal();
      } else {
        showToast('Gagal menghapus soal.', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Terjadi kesalahan koneksi.', 'error');
    }
  };

  const filteredSoal = soalList.filter(s => {
    const matchSearch = s.pertanyaan.toLowerCase().includes(searchQuery.toLowerCase());
    const matchPendidikan = filterPendidikan ? s.pendidikan_soal === filterPendidikan : true;
    return matchSearch && matchPendidikan;
  });

  const totalPages = Math.ceil(filteredSoal.length / itemsPerPage);
  const safeCurrentPage = Math.min(currentPage, Math.max(1, totalPages));
  const startIndex = (safeCurrentPage - 1) * itemsPerPage;
  const currentSoal = filteredSoal.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">Master Soal Ujian</h2>
          <p className="text-muted-foreground text-sm mt-1">Kelola bank soal untuk berbagai tingkat pendidikan</p>
        </div>
        <button
          onClick={() => handleOpenModal('add')}
          className="flex items-center justify-center space-x-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm w-full md:w-auto"
        >
          <Plus size={18} />
          <span>Tambah Soal</span>
        </button>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-border bg-muted/20 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
            <input
              type="text"
              placeholder="Cari pertanyaan..."
              className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <div className="sm:w-64">
            <select
              className="w-full px-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              value={filterPendidikan}
              onChange={(e) => {
                setFilterPendidikan(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="">Semua Tingkat Pendidikan</option>
              {pendidikanOptions.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/50 border-b border-border text-xs uppercase text-muted-foreground">
                <th className="px-4 py-3 font-semibold">Tingkat Pendidikan</th>
                <th className="px-4 py-3 font-semibold">Kompetensi</th>
                <th className="px-4 py-3 font-semibold w-1/2">Pertanyaan</th>
                <th className="px-4 py-3 font-semibold">Kunci</th>
                <th className="px-4 py-3 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-sm">
              {isLoading ? (
                <tr><td colSpan="5" className="text-center py-8 text-muted-foreground">Memuat data...</td></tr>
              ) : filteredSoal.length === 0 ? (
                <tr><td colSpan="5" className="text-center py-8 text-muted-foreground">Tidak ada data soal.</td></tr>
              ) : (
                currentSoal.map((soal) => (
                  <tr key={soal.id_soal} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 align-top whitespace-nowrap">
                      <span className="inline-block px-2 py-1 bg-secondary text-secondary-foreground rounded text-xs font-medium border border-border">
                        {soal.pendidikan_soal}
                      </span>
                    </td>
                    <td className="px-4 py-3 align-top whitespace-nowrap text-muted-foreground">
                      {soal.id_kompetensi || '-'}
                    </td>
                    <td className="px-4 py-3 align-top">
                      <div className="line-clamp-2" title={soal.pertanyaan}>{soal.pertanyaan}</div>
                    </td>
                    <td className="px-4 py-3 align-top font-bold">
                      {soal.jawaban_benar}
                    </td>
                    <td className="px-4 py-3 align-top text-right whitespace-nowrap">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleOpenModal('edit', soal)} className="p-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-md transition-colors" title="Edit">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDelete(soal.id_soal)} className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-md transition-colors" title="Hapus">
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
          <div className="flex items-center gap-3">
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-2 py-1.5 bg-background border border-border rounded text-xs focus:outline-none focus:ring-1 focus:ring-primary font-semibold"
            >
              <option value={10}>10 baris</option>
              <option value={25}>25 baris</option>
              <option value={50}>50 baris</option>
              <option value={100}>100 baris</option>
            </select>
            <span className="text-xs text-muted-foreground font-medium">
              Menampilkan {filteredSoal.length === 0 ? 0 : startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredSoal.length)} dari {filteredSoal.length} soal
            </span>
          </div>
          
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={safeCurrentPage === 1}
              className="px-3 py-1.5 border border-border bg-background rounded-md text-xs font-semibold disabled:opacity-50 hover:bg-muted transition-colors"
            >
              Sebelumnya
            </button>
            <span className="text-xs font-bold px-3">
              Hal {safeCurrentPage} dari {Math.max(1, totalPages)}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={safeCurrentPage === totalPages || totalPages === 0}
              className="px-3 py-1.5 border border-border bg-background rounded-md text-xs font-semibold disabled:opacity-50 hover:bg-muted transition-colors"
            >
              Selanjutnya
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-card w-full max-w-4xl rounded-2xl shadow-xl border border-border overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-5 border-b border-border bg-muted/20">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                {modalMode === 'add' ? <Plus size={20} className="text-primary" /> : <Edit2 size={20} className="text-primary" />}
                {modalMode === 'add' ? 'Tambah Soal Baru' : 'Edit Soal'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-full hover:bg-muted">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-5 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Tingkat Pendidikan</label>
                  {/* We use a datalist or custom input to allow free text or predefined options */}
                  <input
                    type="text"
                    name="pendidikan_soal"
                    list="pendidikan-list"
                    value={formData.pendidikan_soal}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Ketik atau pilih pendidikan..."
                  />
                  <datalist id="pendidikan-list">
                    {pendidikanOptions.map(p => <option key={p} value={p} />)}
                  </datalist>
                  <p className="text-xs text-muted-foreground mt-1">Anda bisa mengetik pendidikan baru jika belum ada di daftar.</p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Kode Kompetensi</label>
                  <SearchableSelect
                    options={kompetensiOptions}
                    name="id_kompetensi"
                    value={formData.id_kompetensi}
                    onChange={handleChange}
                    placeholder="Cari Kompetensi..."
                  />
                </div>
              </div>

              <div className="mb-5">
                <label className="block text-sm font-medium mb-1.5">Pertanyaan</label>
                <textarea
                  name="pertanyaan"
                  value={formData.pertanyaan}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Tuliskan soal pertanyaan di sini..."
                />
              </div>

              <div className="space-y-4 mb-5 border border-border rounded-lg p-4 bg-muted/10">
                <h4 className="text-sm font-semibold text-muted-foreground">Pilihan Jawaban</h4>
                {['a', 'b', 'c', 'd', 'e'].map((opt) => (
                  <div key={opt} className="flex items-start gap-3">
                    <span className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center font-bold text-sm shrink-0 border border-border">
                      {opt.toUpperCase()}
                    </span>
                    <input
                      type="text"
                      name={`opsi_${opt}`}
                      value={formData[`opsi_${opt}`]}
                      onChange={handleChange}
                      className="flex-1 px-3 py-1.5 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder={`Opsi ${opt.toUpperCase()}...`}
                    />
                  </div>
                ))}
              </div>

              <div className="mb-2">
                <label className="block text-sm font-medium mb-1.5 text-primary">Kunci Jawaban Benar</label>
                <div className="flex gap-4">
                  {['A', 'B', 'C', 'D', 'E'].map(opt => (
                    <label key={opt} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="jawaban_benar"
                        value={opt}
                        checked={formData.jawaban_benar === opt}
                        onChange={handleChange}
                        className="w-4 h-4 text-primary focus:ring-primary"
                        required
                      />
                      <span className="font-medium text-sm">{opt}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-5 mt-6 border-t border-border flex justify-end space-x-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2 bg-muted text-foreground rounded-md text-sm font-medium hover:bg-muted/80 transition-colors">Batal</button>
                <button type="submit" disabled={isLoading} className="px-5 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50">
                  {isLoading ? 'Menyimpan...' : 'Simpan Soal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
