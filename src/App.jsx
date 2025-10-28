import { useEffect, useMemo, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Table,
  Toast,
  ToastContainer,
} from "react-bootstrap";

export default function App() {
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem("products");
    return saved ? JSON.parse(saved) : [];
  });

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [stock, setStock] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [errors, setErrors] = useState({});
  const [editingId, setEditingId] = useState(null);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success");

  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);

  const validate = () => {
    const newErrors = {};
    const trimmedName = name.trim();

    if (!trimmedName) {
      newErrors.name = "Nama produk wajib diisi.";
    } else if (trimmedName.length > 100) {
      newErrors.name = "Maksimal 100 karakter.";
    }

    if (description.trim().length < 20) {
      newErrors.description = "Deskripsi minimal 20 karakter.";
    }

    if (!price) {
      newErrors.price = "Harga wajib diisi.";
    } else if (price <= 0) {
      newErrors.price = "Harga harus lebih dari 0.";
    }

    if (!category) {
      newErrors.category = "Kategori wajib dipilih.";
    }

    if (!releaseDate) {
      newErrors.releaseDate = "Tanggal rilis wajib diisi.";
    } else {
      const today = new Date();
      const inputDate = new Date(releaseDate);
      if (inputDate > today) {
        newErrors.releaseDate = "Tanggal rilis tidak boleh di masa depan.";
      }
    }

    if (stock < 0) {
      newErrors.stock = "Stok tidak boleh negatif.";
    }

    return newErrors;
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setPrice("");
    setCategory("");
    setReleaseDate("");
    setStock(0);
    setIsActive(false);
    setErrors({});
    setEditingId(null);
  };

  const showToastMsg = (message, variant = "success") => {
    setToastMessage(message);
    setToastVariant(variant);
    setShowToast(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const v = validate();
    setErrors(v);

    if (Object.keys(v).length !== 0) {
      showToastMsg("Periksa kembali input Anda.", "danger");
      return;
    }

    const newProduct = {
      id: editingId ?? Date.now(),
      name: name.trim(),
      description: description.trim(),
      price: parseFloat(price),
      category,
      releaseDate,
      stock: parseInt(stock),
      isActive,
    };

    if (editingId === null) {
      setProducts((prev) => [newProduct, ...prev]);
      showToastMsg("Produk berhasil ditambahkan.", "success");
    } else {
      setProducts((prev) =>
        prev.map((p) => (p.id === editingId ? newProduct : p))
      );
      showToastMsg("Produk berhasil diperbarui.", "success");
    }

    resetForm();
  };

  const handleEdit = (prod) => {
    setEditingId(prod.id);
    setName(prod.name);
    setDescription(prod.description);
    setPrice(prod.price);
    setCategory(prod.category);
    setReleaseDate(prod.releaseDate);
    setStock(prod.stock);
    setIsActive(prod.isActive);
    setErrors({});
  };

  const handleDelete = (id) => {
    const target = products.find((p) => p.id === id);
    if (!target) return;
    if (!window.confirm(`Hapus Produk "${target.name}"?`)) return;
    setProducts((prev) => prev.filter((p) => p.id !== id));
    if (editingId === id) resetForm();
    showToastMsg("Produk berhasil dihapus.", "success");
  };

  const isEditing = editingId !== null;

  return (
    <Container className="py-4">
      <Row>
        <Col lg={5}>
          <Card className="mb-4">
            <Card.Header as="h5">
              {isEditing ? "Edit Produk" : "Tambah Produk"}
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit} noValidate>
                {/* Nama Produk */}
                <Form.Group className="mb-3" controlId="productName">
                  <Form.Label>Nama Produk</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nama lengkap produk"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    isInvalid={!!errors.name}
                    maxLength={100}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.name}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Deskripsi */}
                <Form.Group className="mb-3" controlId="productDescription">
                  <Form.Label>Deskripsi</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Penjelasan detail produk (minimal 20 karakter)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    isInvalid={!!errors.description}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.description}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Harga */}
                <Form.Group className="mb-3" controlId="productPrice">
                  <Form.Label>Harga</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Masukkan harga produk"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    isInvalid={!!errors.price}
                    min={0}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.price}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Kategori */}
                <Form.Group className="mb-3" controlId="productCategory">
                  <Form.Label>Kategori</Form.Label>
                  <Form.Select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    isInvalid={!!errors.category}
                  >
                    <option value="">-- Pilih Kategori --</option>
                    <option value="Elektronik">Elektronik</option>
                    <option value="Pakaian">Pakaian</option>
                    <option value="Makanan">Makanan</option>
                    <option value="Minuman">Minuman</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.category}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Tanggal Rilis */}
                <Form.Group className="mb-3" controlId="releaseDate">
                  <Form.Label>Tanggal Rilis</Form.Label>
                  <Form.Control
                    type="date"
                    value={releaseDate}
                    onChange={(e) => setReleaseDate(e.target.value)}
                    isInvalid={!!errors.releaseDate}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.releaseDate}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Stok */}
                <Form.Group className="mb-3" controlId="stock">
                  <Form.Label>Stok Tersedia: {stock}</Form.Label>
                  <Form.Range
                    min={0}
                    max={1000}
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                  />
                </Form.Group>

                {/* Aktif */}
                <Form.Group className="mb-3" controlId="isActive">
                  <Form.Check
                    type="switch"
                    label="Produk Aktif"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                  />
                </Form.Group>

                <div className="d-flex gap-2">
                  <Button
                    type="submit"
                    variant={isEditing ? "primary" : "success"}
                  >
                    {isEditing ? "Simpan Perubahan" : "Tambah Produk"}
                  </Button>
                  {isEditing && (
                    <Button type="button" variant="secondary" onClick={resetForm}>
                      Batal
                    </Button>
                  )}
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={7}>
          <Card>
            <Card.Header as="h5">Daftar Produk</Card.Header>
            <Card.Body className="p-0">
              <Table striped bordered hover responsive className="mb-0">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Nama</th>
                    <th>Kategori</th>
                    <th>Harga</th>
                    <th>Stok</th>
                    <th>Status</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-4 text-muted">
                        Belum ada data produk.
                      </td>
                    </tr>
                  ) : (
                    products.map((p, i) => (
                      <tr key={p.id}>
                        <td>{i + 1}</td>
                        <td>{p.name}</td>
                        <td>{p.category}</td>
                        <td>Rp {p.price.toLocaleString()}</td>
                        <td>{p.stock}</td>
                        <td>{p.isActive ? "Aktif" : "Tidak Aktif"}</td>
                        <td>
                          <div className="d-flex gap-2 justify-content-center">
                            <Button
                              size="sm"
                              variant="warning"
                              onClick={() => handleEdit(p)}
                            >
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="danger"
                              onClick={() => handleDelete(p.id)}
                            >
                              Hapus
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <ToastContainer position="top-end" className="p-3">
        <Toast
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={3000}
          autohide
          bg={toastVariant}
        >
          <Toast.Header closeButton>
            <strong className="me-auto">Notifikasi</strong>
            <small>Baru saja</small>
          </Toast.Header>
          <Toast.Body
            className={toastVariant === "danger" ? "text-white" : ""}
          >
            {toastMessage}
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </Container>
  );
}