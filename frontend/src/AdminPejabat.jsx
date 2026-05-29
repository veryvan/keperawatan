import React, { useState, useEffect } from 'react';
import { Edit2, Save, X } from 'lucide-react';

export default function AdminPejabat({ API_URL, showToast }) {
  const [pejabatList, setPejabatList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  useEffect(() => {
    fetchPejabat();
  }, []);

  const fetchPejabat = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/pejabat`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setPejabatList(data);
      }
    } catch (err) {
      console.error(err);
      showToast('Gagal memuat data pejabat', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = (pejabat) => {
    setEditingId(pejabat.id);
    setEditFormData(pejabat);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditFormData({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`${API_URL}/pejabat/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editFormData)
      });
      const data = await res.json();
      if (res.ok) {
        showToast('Data Pejabat berhasil diperbarui.', 'success');
        setEditingId(null);
        fetchPejabat();
      } else {
        showToast('Gagal memperbarui data pejabat.', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Terjadi kesalahan koneksi.', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">Master Pejabat</h2>
          <p className="text-muted-foreground text-sm mt-1">Kelola data pejabat penandatangan sertifikat (nama, NIK, NIP)</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/50 border-b border-border text-xs uppercase text-muted-foreground">
                <th className="px-4 py-3 font-semibold">Jabatan</th>
                <th className="px-4 py-3 font-semibold">Nama Pejabat</th>
                <th className="px-4 py-3 font-semibold">NIP / NIK</th>
                <th className="px-4 py-3 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-sm">
              {isLoading ? (
                <tr><td colSpan="4" className="text-center py-8 text-muted-foreground">Memuat data...</td></tr>
              ) : pejabatList.length === 0 ? (
                <tr><td colSpan="4" className="text-center py-8 text-muted-foreground">Tidak ada data.</td></tr>
              ) : (
                pejabatList.map((pejabat) => (
                  <tr key={pejabat.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-4 font-semibold text-foreground align-top">
                      {pejabat.jabatan}
                    </td>
                    <td className="px-4 py-3 align-top">
                      {editingId === pejabat.id ? (
                        <input
                          type="text"
                          name="nama"
                          value={editFormData.nama || ''}
                          onChange={handleChange}
                          className="w-full px-2 py-1.5 bg-background border border-border rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      ) : (
                        pejabat.nama || '-'
                      )}
                    </td>
                    <td className="px-4 py-3 align-top">
                      {editingId === pejabat.id ? (
                        <div className="space-y-2">
                          <div>
                            <span className="text-[10px] text-muted-foreground uppercase font-bold">NIP</span>
                            <input
                              type="text"
                              name="nip"
                              value={editFormData.nip || ''}
                              onChange={handleChange}
                              className="w-full px-2 py-1 bg-background border border-border rounded text-xs mt-0.5 focus:outline-none focus:ring-1 focus:ring-primary"
                              placeholder="Masukkan NIP"
                            />
                          </div>
                          <div>
                            <span className="text-[10px] text-muted-foreground uppercase font-bold">NIK</span>
                            <input
                              type="text"
                              name="nik"
                              value={editFormData.nik || ''}
                              onChange={handleChange}
                              className="w-full px-2 py-1 bg-background border border-border rounded text-xs mt-0.5 focus:outline-none focus:ring-1 focus:ring-primary"
                              placeholder="Masukkan NIK"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-1">
                          {pejabat.nip ? <span className="font-mono text-xs"><span className="text-muted-foreground">NIP.</span> {pejabat.nip}</span> : null}
                          {pejabat.nik ? <span className="font-mono text-xs"><span className="text-muted-foreground">NIK.</span> {pejabat.nik}</span> : null}
                          {!pejabat.nip && !pejabat.nik && <span className="text-muted-foreground italic">-</span>}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 align-top text-right whitespace-nowrap">
                      {editingId === pejabat.id ? (
                        <div className="flex justify-end gap-2">
                          <button onClick={handleSave} className="px-3 py-1.5 bg-primary text-primary-foreground font-semibold rounded hover:bg-primary/90 flex items-center gap-1 text-xs">
                            <Save size={14} /> Simpan
                          </button>
                          <button onClick={handleCancelEdit} className="px-3 py-1.5 bg-muted text-foreground font-semibold rounded hover:bg-muted/80 flex items-center gap-1 text-xs">
                            <X size={14} /> Batal
                          </button>
                        </div>
                      ) : (
                        <button onClick={() => handleEditClick(pejabat)} className="px-3 py-1.5 bg-blue-50 text-blue-600 font-semibold rounded hover:bg-blue-100 flex items-center gap-1 text-xs ml-auto">
                          <Edit2 size={14} /> Edit
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
