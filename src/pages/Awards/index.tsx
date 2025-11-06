import { useEffect, useRef, useState, type JSX } from "react";
import { Button, Form, InputGroup, Modal, Pagination, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import html2pdf from "html2pdf.js";

interface Premiacoes {
  _id: string;
  funcionario: {
    _id: string;
    nome: string;
  };
  pernoite: boolean;
  data_pernoite: string;
  escada: boolean;
  data_escada: string;
  valor: string;
}

const RED_COLOR = "#Ec3239";

function Awards(): JSX.Element {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  const contentRef = useRef<HTMLDivElement>(null);
  
  const [data, setData] = useState<Premiacoes[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [searchName, setSearchName] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE_URL}/data`)
      .then((response) => response.json())
      .then((data: Premiacoes[]) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erro ao buscar premiações:", err);
        setLoading(false);
      });
  }, [API_BASE_URL]);

  const formatDate = (isoDate?: string) => {
    if (!isoDate) return "-";
    const date = new Date(isoDate);
    if (isNaN(date.getTime())) return "-";
    return date.toLocaleDateString("pt-BR", { timeZone: "UTC" });
  };
  
  const filteredData = data.filter((item) => {
    const nameMatch = item.funcionario?.nome
      .toLowerCase()
      .includes(searchName.toLowerCase());

    const monthMatch =
      !selectedMonth ||
      item.data_pernoite?.split("-")[1] === selectedMonth ||
      item.data_escada?.split("-")[1] === selectedMonth;

    const yearMatch =
      !selectedYear ||
      item.data_pernoite?.split("-")[0] === selectedYear ||
      item.data_escada?.split("-")[0] === selectedYear;

    return nameMatch && monthMatch && yearMatch;
  });

  const handleExportPDF = () => {
    const element = contentRef.current;
    if (!element) return;

    const opt = {
      margin: 0,
      filename: "premiacoes.pdf",
      image: { type: "jpeg" as const, quality: 0.98 },
      html2canvas: {
        scale: 2,
        scroll: 0,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight + 10,
      },
      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation: "landscape" as const,
      },
      pagebreak: { mode: "avoid-all" },
    };

    html2pdf().set(opt).from(element).save();
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage
  );
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
    setShowModal(true);
  };

  const confirmDelete = () => {
    if (deleteId) {
      setData((prev) => prev.filter((item) => item._id !== deleteId));
    }
    setShowModal(false);
    setDeleteId(null);
  };

  if (loading)
    return (
      <div className="text-center p-5">
        <h2 style={{ color: RED_COLOR }}>Carregando premiações...</h2>
      </div>
    );

  return (
    <div className="w-100 d-flex flex-column" ref={contentRef}>
      <div className="d-flex justify-content-between px-3 px-md-5 pt-4 mb-3">
        <button
          onClick={() => navigate("/")}
          style={{
            border: "none",
            backgroundColor: "transparent",
            color: "black",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <i className="bi bi-arrow-left-circle"></i>
          Voltar
        </button>
        <button
          onClick={handleExportPDF}
          style={{
            border: "none",
            backgroundColor: "transparent",
            color: "black",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <i className="bi bi-download"></i>
          Exportar
        </button>
      </div>

      <div
        className="mx-auto w-100 px-3 px-md-5"
        style={{ maxWidth: "1200px" }}
      >
        <h1
          className="h1 fw-bold text-center mb-4"
          style={{ color: RED_COLOR }}
        >
          Premiações
        </h1>
        <div className="d-flex justify-content-end mb-4">
          <div className="d-flex flex-wrap justify-content-center justify-content-md-end gap-3 w-100 w-md-auto">
            <InputGroup style={{ maxWidth: "200px" }}>
              <InputGroup.Text>
                <i className="bi bi-person"></i>
              </InputGroup.Text>
              <Form.Control
                placeholder="Filtrar por nome"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
              />
            </InputGroup>

            <InputGroup
              className="flex-grow-1"
              style={{ maxWidth: "130px", minWidth: "120px" }}
            >
              <InputGroup.Text>
                <i className="bi bi-calendar-month"></i>
              </InputGroup.Text>
              <Form.Select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
              >
                <option value="">Mês</option>
                {Array.from({ length: 12 }, (_, i) => {
                  const monthName = new Date(0, i)
                    .toLocaleString("pt-BR", { month: "long" });
                  const capitalized =
                    monthName.charAt(0).toUpperCase() + monthName.slice(1);
                  return (
                    <option key={i + 1} value={(i + 1).toString().padStart(2, "0")}>
                      {capitalized}
                    </option>
                  );
                })}
              </Form.Select>
            </InputGroup>

            <InputGroup
              className="flex-grow-1"
              style={{ maxWidth: "130px", minWidth: "120px" }}
            >
              <InputGroup.Text>
                <i className="bi bi-calendar-date"></i>
              </InputGroup.Text>
              <Form.Select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
              >
                <option value="">Ano</option>
                {[...new Set(data.map(item => 
                  (item.data_pernoite || item.data_escada || "")
                    .split("-")[0]
                ))]
                  .filter(Boolean)
                  .sort()
                  .map((year) => (
                    <option key={year}>{year}</option>
                  ))}
              </Form.Select>
            </InputGroup>
          </div>
        </div>

        <Table responsive striped bordered className="mb-5">
          <thead>
            <tr>
              <th>#</th>
              <th>Funcionário</th>
              <th className="text-center">Pernoite</th>
              <th className="text-center">Data Pernoite</th>
              <th className="text-center">Escada</th>
              <th className="text-center">Data Escada</th>
              <th className="text-center">Valor</th>
              <th className="text-center">Editar</th>
              <th className="text-center">Excluir</th>
            </tr>
          </thead>
          <tbody>
            {currentData.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center text-muted">
                  Nenhum registro encontrado.
                </td>
              </tr>
            ) : (
            currentData.map((item, index) => (
              <tr key={item._id}>
                <td className="fw-bold">{startIndex + index + 1}</td>
                <td>{item.funcionario?.nome}</td>
                <td className="text-center">{item.pernoite ? "Sim" : "Não"}</td>
                <td className="text-center">{formatDate(item.data_pernoite)}</td>
                <td className="text-center">{item.escada ? "Sim" : "Não"}</td>
                <td className="text-center">{formatDate(item.data_escada)}</td>
                <td className="text-center">{item.valor}</td>
                <td className="text-center">
                  <i
                    className="bi bi-pencil-square text-primary"
                    style={{ cursor: "pointer" }}
                    title="Editar"
                  ></i>
                </td>
                <td className="text-center">
                  <i
                    className="bi bi-trash3 text-danger"
                    style={{ cursor: "pointer" }}
                    title="Excluir"
                    onClick={() => handleDeleteClick(item._id)}
                  ></i>
                </td>
              </tr>
            ))
          )}
          </tbody>
        </Table>

        <div className="d-flex justify-content-center mb-5">
          <Pagination size="lg">
            <Pagination.Prev
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              style={{ color: RED_COLOR }}
            />
            {Array.from({ length: totalPages }, (_, i) => (
              <Pagination.Item
                key={i + 1}
                active={i + 1 === currentPage}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              style={{ color: RED_COLOR }}
            />
          </Pagination>
        </div>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar exclusão</Modal.Title>
        </Modal.Header>
        <Modal.Body>Tem certeza que deseja excluir este registro?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Excluir
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Awards;
