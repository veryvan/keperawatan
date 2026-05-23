<?php
namespace App\Controllers\Api;
use CodeIgniter\RESTful\ResourceController;
use CodeIgniter\API\ResponseTrait;

class Pelatihan extends ResourceController {
    use ResponseTrait;
    protected $modelName = 'App\Models\PelatihanModel';
    protected $format    = 'json';

    private function handleFile(&$data) {
        $file = $this->request->getFile('file');
        if ($file && $file->isValid() && !$file->hasMoved()) {
            $newName = $file->getRandomName();
            $file->move(FCPATH . 'uploads', $newName);
            $data['file'] = 'uploads/' . $newName;
        }
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

    public function index() {
        return $this->respond($this->model->findAll());
    }

    public function show($id = null) {
        $data = $this->model->find($id);
        return $data ? $this->respond($data) : $this->failNotFound();
    }

    public function create() {
        $data = $this->getRequestData();
        $this->handleFile($data);
        if (isset($data['tanggal_mulai']) && $data['tanggal_mulai'] === '') $data['tanggal_mulai'] = null;
        if (isset($data['tanggal_selesai']) && $data['tanggal_selesai'] === '') $data['tanggal_selesai'] = null;
        if (isset($data['jumlah_jam']) && $data['jumlah_jam'] === '') $data['jumlah_jam'] = null;
        return $this->model->insert($data) ? $this->respondCreated($data) : $this->fail($this->model->errors());
    }

    public function update($id = null) {
        $data = $this->getRequestData();
        $this->handleFile($data);
        if (isset($data['id'])) unset($data['id']);
        if (isset($data['tanggal_mulai']) && $data['tanggal_mulai'] === '') $data['tanggal_mulai'] = null;
        if (isset($data['tanggal_selesai']) && $data['tanggal_selesai'] === '') $data['tanggal_selesai'] = null;
        if (isset($data['jumlah_jam']) && $data['jumlah_jam'] === '') $data['jumlah_jam'] = null;
        return $this->model->update($id, $data) ? $this->respond($data, 200) : $this->fail($this->model->errors());
    }

    public function delete($id = null) {
        return $this->model->delete($id) ? $this->respondDeleted(['id' => $id]) : $this->failNotFound();
    }
}
