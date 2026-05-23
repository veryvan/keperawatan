<?php
namespace App\Controllers\Api;
use CodeIgniter\RESTful\ResourceController;
use CodeIgniter\API\ResponseTrait;

class PengajuanSertifikasi extends ResourceController {
    use ResponseTrait;
    protected $modelName = 'App\Models\PengajuanSertifikasiModel';
    protected $format    = 'json';

    private function handleFile(&$data) {
        $file = $this->request->getFile('file_pendukung');
        if ($file && $file->isValid() && !$file->hasMoved()) {
            $newName = $file->getRandomName();
            $file->move(FCPATH . 'uploads', $newName);
            $data['file_pendukung'] = 'uploads/' . $newName;
        }
    }

    public function index() { 
        return $this->respond($this->model->findAll()); 
    }

    public function show($id = null) { 
        $data = $this->model->find($id); 
        return $data ? $this->respond($data) : $this->failNotFound(); 
    }

    private function getRequestData() {
        $contentType = $this->request->getHeaderLine('Content-Type');
        if (strpos($contentType, 'application/json') !== false) {
            try {
                return $this->request->getJSON(true) ?? [];
            } catch (\Exception $e) {
                return [];
            }
        }
        
        $data = $this->request->getPost();
        if (empty($data)) {
            $data = $this->request->getRawInput();
        }
        return $data ?? [];
    }

    public function create() {
        $data = $this->getRequestData();
        $this->handleFile($data);
        if (empty($data['tanggal_pengajuan'])) {
            $data['tanggal_pengajuan'] = date('Y-m-d');
        }
        if (empty($data['status'])) {
            $data['status'] = 'Pending';
        }
        
        if (empty($data['form_data'])) {
            $data['form_data'] = json_encode([]);
        }

        if ($this->model->insert($data)) {
            $data['id'] = $this->model->getInsertID();
            return $this->respondCreated($data);
        } else {
            return $this->fail($this->model->errors());
        }
    }

    public function update($id = null) {
        $data = $this->getRequestData();
        $this->handleFile($data);
        
        if ($this->model->update($id, $data)) {
            $updated = $this->model->find($id);
            return $this->respond($updated, 200);
        } else {
            return $this->fail($this->model->errors());
        }
    }

    public function delete($id = null) {
        return $this->model->delete($id) ? $this->respondDeleted(['id' => $id]) : $this->failNotFound();
    }
}
