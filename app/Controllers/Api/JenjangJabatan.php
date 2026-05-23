<?php
namespace App\Controllers\Api;
use CodeIgniter\RESTful\ResourceController;
use CodeIgniter\API\ResponseTrait;

class JenjangJabatan extends ResourceController {
    use ResponseTrait;
    protected $modelName = 'App\Models\JenjangJabatanModel';
    protected $format    = 'json';

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
        return $this->model->insert($data) ? $this->respondCreated($data) : $this->fail($this->model->errors());
    }

    public function update($id = null) {
        $data = $this->getRequestData();
        return $this->model->update($id, $data) ? $this->respond($data, 200) : $this->fail($this->model->errors());
    }

    public function delete($id = null) {
        return $this->model->delete($id) ? $this->respondDeleted(['id' => $id]) : $this->failNotFound();
    }
}
