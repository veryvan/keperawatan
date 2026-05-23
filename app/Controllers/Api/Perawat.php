<?php

namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;
use CodeIgniter\API\ResponseTrait;
use App\Models\PerawatModel;

class Perawat extends ResourceController
{
    use ResponseTrait;

    protected $modelName = PerawatModel::class;
    protected $format    = 'json';

    public function index()
    {
        $data = $this->model->findAll();
        return $this->respond($data);
    }

    public function show($id = null)
    {
        $data = $this->model->find($id);
        if ($data) {
            return $this->respond($data);
        }
        return $this->failNotFound('Data tidak ditemukan.');
    }

    private function handleFiles(&$data)
    {
        $files = ['foto', 'file_str', 'file_sip'];
        foreach ($files as $field) {
            $file = $this->request->getFile($field);
            if ($file && $file->isValid() && !$file->hasMoved()) {
                $newName = $file->getRandomName();
                $file->move(FCPATH . 'uploads', $newName);
                $data[$field] = 'uploads/' . $newName;
            }
        }
    }

    public function create()
    {
        $data = $this->request->getPost();
        $this->handleFiles($data);
        
        // Clean empty dates
        if (isset($data['tanggal_lahir']) && $data['tanggal_lahir'] === '') {
            $data['tanggal_lahir'] = null;
        }
        if (isset($data['masa_berlaku_str']) && $data['masa_berlaku_str'] === '') {
            $data['masa_berlaku_str'] = null;
        }
        if (isset($data['masa_berlaku_sip']) && $data['masa_berlaku_sip'] === '') {
            $data['masa_berlaku_sip'] = null;
        }

        if ($this->model->insert($data)) {
            $data['id_perawat'] = $this->model->getInsertID();
            return $this->respondCreated($data, 'Data berhasil disimpan.');
        }
        return $this->fail($this->model->errors());
    }

    public function update($id = null)
    {
        $data = $this->request->getPost();
        $this->handleFiles($data);

        // Clean empty dates and unset PK
        if (isset($data['tanggal_lahir']) && $data['tanggal_lahir'] === '') {
            $data['tanggal_lahir'] = null;
        }
        if (isset($data['masa_berlaku_str']) && $data['masa_berlaku_str'] === '') {
            $data['masa_berlaku_str'] = null;
        }
        if (isset($data['masa_berlaku_sip']) && $data['masa_berlaku_sip'] === '') {
            $data['masa_berlaku_sip'] = null;
        }
        if (isset($data['id_perawat'])) {
            unset($data['id_perawat']);
        }

        if ($this->model->update($id, $data)) {
            return $this->respond($data, 200, 'Data berhasil diupdate.');
        }
        return $this->fail($this->model->errors());
    }

    public function delete($id = null)
    {
        $data = $this->model->find($id);
        if ($data) {
            $this->model->delete($id);
            return $this->respondDeleted($data, 'Data berhasil dihapus.');
        }
        return $this->failNotFound('Data tidak ditemukan.');
    }
}
