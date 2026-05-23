<?php
namespace App\Controllers\Api;
use CodeIgniter\RESTful\ResourceController;
use CodeIgniter\API\ResponseTrait;

class Jabatan extends ResourceController {
    use ResponseTrait;
    protected $modelName = 'App\Models\JabatanModel';
    protected $format    = 'json';

    public function index() { return $this->respond($this->model->findAll()); }
    public function show($id = null) { 
        $data = $this->model->find($id); 
        return $data ? $this->respond($data) : $this->failNotFound(); 
    }
    public function create() {
        $data = $this->request->getJSON(true) ?? $this->request->getPost();
        return $this->model->insert($data) ? $this->respondCreated($data) : $this->fail($this->model->errors());
    }
    public function update($id = null) {
        $data = $this->request->getJSON(true) ?? $this->request->getRawInput();
        return $this->model->update($id, $data) ? $this->respond($data, 200) : $this->fail($this->model->errors());
    }
    public function delete($id = null) {
        return $this->model->delete($id) ? $this->respondDeleted(['id' => $id]) : $this->failNotFound();
    }
}
