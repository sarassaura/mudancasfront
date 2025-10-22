import { useEffect, useRef, useState, type JSX } from "react";
import RequestCard from "../../components/Card";
import { Button, Form, InputGroup, Modal, Pagination } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import html2pdf from "html2pdf.js";
import { showSuccess } from "../../components/ToastAlerts/ShowSuccess";
import { showError } from "../../components/ToastAlerts/ShowError";

interface Pedidos {
  _id: string;
  titulo: string;
  data_embalagem: string;
  data_entrega: string;
  data_retirada: string;
  equipe: {
    _id: string;
    nome: string;
  };
  veiculo: {
    _id: string;
    nome: string;
  };
  descricao?: string;
}

interface CardItem extends Pedidos {
  data_foco: string;
  tipo_data: "Embalagem" | "Retirada" | "Entrega";
  card_key: string;
}

const COLOR_OPTIONS = ["#E0F7FA", "#fff0f0"];

const parseDateToLocal = (dateString: string): Date | null => {
  let yyyy_mm_dd: string;

  if (dateString.includes("/")) {
    const parts = dateString.split("/");
    const d = parts[0].padStart(2, "0");
    const m = parts[1].padStart(2, "0");
    const y = parts[2];
    yyyy_mm_dd = `${y}-${m}-${d}`;
  } else {
    yyyy_mm_dd = dateString;
  }

  const date = new Date(`${yyyy_mm_dd}T12:00:00`);

  return isNaN(date.getTime()) ? null : date;
};

const expandPedidosToCardItems = (pedidos: Pedidos[]): CardItem[] => {
  const expanded: CardItem[] = [];

  pedidos.forEach((pedido) => {
    const dates = {
      embalagem: pedido.data_embalagem,
      retirada: pedido.data_retirada,
      entrega: pedido.data_entrega,
    };
    
    const addedDates = new Set<string>();

    if (dates.embalagem && !addedDates.has(dates.embalagem)) {
      expanded.push({
        ...pedido,
        data_foco: dates.embalagem,
        tipo_data: "Embalagem",
        card_key: `${pedido._id}-embalagem`,
      });
      addedDates.add(dates.embalagem);
    }

    if (dates.retirada && !addedDates.has(dates.retirada)) {
      expanded.push({
        ...pedido,
        data_foco: dates.retirada,
        tipo_data: "Retirada",
        card_key: `${pedido._id}-retirada`,
      });
      addedDates.add(dates.retirada);
    }

    if (dates.entrega && !addedDates.has(dates.entrega)) {
      expanded.push({
        ...pedido,
        data_foco: dates.entrega,
        tipo_data: "Entrega",
        card_key: `${pedido._id}-entrega`,
      });
      addedDates.add(dates.entrega);
    }
  });

  return expanded;
};


const filterCardItems = (
  data: CardItem[],
  day: number | "",
  month: number | "",
  year: number | ""
): CardItem[] => {
  const hasFilter = day || month || year;

  return data.filter((entry) => {
    const entryDate = parseDateToLocal(entry.data_foco);
    if (!entryDate) return false;

    const entryDay = entryDate.getDate();
    const entryMonth = entryDate.getMonth() + 1;
    const entryYear = entryDate.getFullYear();

    if (hasFilter) {
      const dayMatch = !day || entryDay === day;
      const monthMatch = !month || entryMonth === month;
      const yearMatch = !year || entryYear === year;
      return dayMatch && monthMatch && yearMatch;
    }

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setHours(0, 0, 0, 0);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    return entryDate >= thirtyDaysAgo;
  });
};

const sortCardItems = (data: CardItem[]): CardItem[] =>
  [...data].sort((a, b) => {
    const dateA = parseDateToLocal(a.data_foco);
    const dateB = parseDateToLocal(b.data_foco);
    if (!dateA && dateB) return 1;
    if (dateA && !dateB) return -1;
    if (!dateA && !dateB) return 0;
    return dateA!.getTime() - dateB!.getTime();
  });


function DeliveryRequests(): JSX.Element {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const contentRef = useRef<HTMLDivElement>(null);
  const [rawData, setRawData] = useState<Pedidos[]>([]);
  const [allFilteredCardItems, setAllFilteredCardItems] = useState<CardItem[]>(
    []
  );
  const [selectedDay, setSelectedDay] = useState<number | "">("");
  const [selectedMonth, setSelectedMonth] = useState<number | "">("");
  const [selectedYear, setSelectedYear] = useState<number | "">("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [loading, setLoading] = useState(true);
  const [selectedPedido, setSelectedPedido] = useState<Pedidos | null>(null);
  const [showModal, setShowModal] = useState(false);
  
  const [dayColorMap, setDayColorMap] = useState<Map<string, string>>(new Map());

  const navigate = useNavigate();
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];
  const years = Array.from({ length: 11 }, (_, i) => 2015 + i);

  const handleEditRequest = (id: string) => {
    navigate("/pedidos", {
      state: {
        editId: id,
        fromManage: true,
      },
    });
  };

  const handleDeleteRequest = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/pedidos/${id}/inativar`, {
        method: "PATCH",
      });

      if (response.ok) {
        setRawData((prevData) =>
          prevData.map((pedido) =>
            pedido._id === id ? { ...pedido, status: "inativado" } : pedido
          )
        );
        showSuccess("Pedido excluído com sucesso!");
      } else {
        const errorData = await response.json();
        showError(errorData.message || "Erro ao excluir pedido.");
      }
    } catch (error) {
      console.error("Erro de conexão:", error);
      showError("Erro de conexão com o servidor.");
    }
  };

  const handleOpenModal = (cardItem: CardItem) => {
    setSelectedPedido(cardItem);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedPedido(null);
    setShowModal(false);
  };

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE_URL}/pedidos`)
      .then((response) => response.json())
      .then((data: Pedidos[]) => {
        setRawData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erro ao buscar pedidos:", err);
        setLoading(false);
      });
  }, [API_BASE_URL]);

  useEffect(() => {
    const allCardItems = expandPedidosToCardItems(rawData);

    const newFiltered = filterCardItems(
      allCardItems,
      selectedDay,
      selectedMonth,
      selectedYear
    );

    const sortedFiltered = sortCardItems(newFiltered);

    const newDayColorMap = new Map<string, string>();
    let colorIndex = 0;

    const uniqueSortedDates = Array.from(
      new Set(sortedFiltered.map((item) => item.data_foco))
    ).sort((a, b) => {
      const dateA = parseDateToLocal(a);
      const dateB = parseDateToLocal(b);
      return dateA && dateB ? dateA.getTime() - dateB.getTime() : 0;
    });

    uniqueSortedDates.forEach((dateString) => {
      if (!newDayColorMap.has(dateString)) {
        const color = COLOR_OPTIONS[colorIndex % COLOR_OPTIONS.length];
        newDayColorMap.set(dateString, color);
        colorIndex++;
      }
    });

    setDayColorMap(newDayColorMap);
    setAllFilteredCardItems(sortedFiltered);
    setCurrentPage(1);
  }, [rawData, selectedDay, selectedMonth, selectedYear]); 

  const getCardColor = (dateString: string): string => {
      return dayColorMap.get(dateString) || COLOR_OPTIONS[0]; 
  };
  
  const handleExportPDF = () => {
    const element = contentRef.current;
    if (!element) return;

    const opt = {
      margin: 0,
      filename: "pedidos_filtrados.pdf",
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

  const paginatedPedidos = allFilteredCardItems;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = paginatedPedidos.slice(
    startIndex,
    startIndex + itemsPerPage
  );
  const totalPages = Math.ceil(paginatedPedidos.length / itemsPerPage);

  const renderPaginationItems = () => {
    const items = [];
    for (let number = 1; number <= totalPages; number++) {
      items.push(
        <Pagination.Item
          key={number}
          active={number === currentPage}
          onClick={() => setCurrentPage(number)}
        >
          {number}
        </Pagination.Item>
      );
    }
    return items;
  };

  if (loading)
    return (
      <div className="text-center p-5">
        <h2 style={{ color: "#Ec3239" }}>Carregando pedidos...</h2>
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
          style={{ color: "#Ec3239" }}
        >
          Pedidos de Mudança
        </h1>
        <div className="d-flex justify-content-end mb-4">
          <div className="d-flex flex-wrap justify-content-center justify-content-md-end gap-3 w-100 w-md-auto">
            <InputGroup
              className="flex-grow-1"
              style={{ maxWidth: "120px", minWidth: "100px" }}
            >
              <InputGroup.Text>
                <i className="bi bi-calendar-day"></i>
              </InputGroup.Text>
              <Form.Select
                value={selectedDay}
                onChange={(e) =>
                  setSelectedDay(e.target.value ? Number(e.target.value) : "")
                }
              >
                <option value="">Dia</option>
                {days.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </Form.Select>
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
                onChange={(e) =>
                  setSelectedMonth(e.target.value ? Number(e.target.value) : "")
                }
              >
                <option value="">Mês</option>
                {months.map((month, index) => (
                  <option key={month} value={index + 1}>
                    {month}
                  </option>
                ))}
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
                onChange={(e) =>
                  setSelectedYear(e.target.value ? Number(e.target.value) : "")
                }
              >
                <option value="">Ano</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </Form.Select>
            </InputGroup>
          </div>
        </div>

        <div className="d-flex flex-wrap justify-content-center gap-4 mb-5">
          {currentData.map((cardItem) => (
            <div
              key={cardItem.card_key} 
              onClick={() => handleOpenModal(cardItem)}
              style={{ cursor: "pointer" }}
            >
              <RequestCard
                key={cardItem.card_key}
                pedidoId={cardItem._id}
                title={`[${cardItem.tipo_data}] ${
                  cardItem.titulo || "Pedido Sem Título"
                }`} 
                team={cardItem.equipe.nome}
                packingDate={
                  cardItem.tipo_data === "Embalagem"
                    ? cardItem.data_foco
                    : "---"
                }
                takeoutDate={
                  cardItem.tipo_data === "Retirada"
                    ? cardItem.data_foco
                    : "---"
                }
                deliveryDate={
                  cardItem.tipo_data === "Entrega"
                    ? cardItem.data_foco
                    : "---"
                }
                vehicle={cardItem.veiculo.nome}
                description={cardItem.descricao ?? ""}
                onEdit={() => handleEditRequest(cardItem._id)}
                onDelete={() => handleDeleteRequest(cardItem._id)}
                cardColor={getCardColor(cardItem.data_foco)} 
              />
            </div>
          ))}
        </div>

        <div className="d-flex justify-content-center mb-5">
          <Pagination size="lg">
            <Pagination.Prev
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            />
            {renderPaginationItems()}
            <Pagination.Next
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            />
          </Pagination>
        </div>
      </div>

      <Modal show={showModal} onHide={handleCloseModal} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title style={{ color: "#Ec3239" }}>
            {selectedPedido?.titulo || "Pedido Sem Título"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPedido ? (
            <>
              <p>
                <strong>Equipe:</strong> {selectedPedido.equipe?.nome}
              </p>
              <p>
                <strong>Veículo:</strong> {selectedPedido.veiculo?.nome}
              </p>
              <p>
                <strong>Data de Embalagem:</strong>{" "}
                {selectedPedido.data_embalagem}
              </p>
              <p>
                <strong>Data de Retirada:</strong>{" "}
                {selectedPedido.data_retirada}
              </p>
              <p>
                <strong>Data de Entrega:</strong> {selectedPedido.data_entrega}
              </p>
              <p>
                <strong>Descrição completa:</strong>
              </p>
              <div
                style={{
                  backgroundColor: "#f8f9fa",
                  padding: "10px 15px",
                  borderRadius: "8px",
                  whiteSpace: "pre-wrap",
                }}
              >
                {selectedPedido.descricao || "Sem descrição disponível."}
              </div>
            </>
          ) : (
            <p>Carregando informações...</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Fechar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default DeliveryRequests;