import { useEffect, useRef, useState, type JSX } from "react";
import RequestCard from "../../components/Card";
import { Form, InputGroup, Pagination } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import html2pdf from 'html2pdf.js'; 

interface Pedidos {
  "_id": string,
  "data_entrega": string,
  "data_retirada": string,
  equipe: {
    "_id": string,
    nome: string,
  },
  veiculo: {
    "_id": string,
    nome: string,
  },
  descricao?: string,
}

const parseDateToLocal = (dateString: string): Date | null => {
    let yyyy_mm_dd: string;
    
    if (dateString.includes('/')) {
      const parts = dateString.split('/');
      const d = parts[0].padStart(2, '0');
      const m = parts[1].padStart(2, '0');
      const y = parts[2];
      yyyy_mm_dd = `${y}-${m}-${d}`;
    } else {
      yyyy_mm_dd = dateString;
    }
    
    const date = new Date(`${yyyy_mm_dd}T12:00:00`); 
    
    return isNaN(date.getTime()) ? null : date;
}

const filterPedidos = (
  data: Pedidos[],
  day: string,
  month: string,
  year: string
): Pedidos[] => {
    
  let filteredData = data;

  if (day || month || year) {
    filteredData = data.filter(entry => {
      const entryDate = parseDateToLocal(entry.data_entrega);
      if (!entryDate) return false;
      
      const entryDay = entryDate.getDate().toString();
      const entryMonth = (entryDate.getMonth() + 1).toString(); 
      const entryYear = entryDate.getFullYear().toString();

      const dayMatch = !day || entryDay === day;
      const monthMatch = !month || entryMonth === month;
      const yearMatch = !year || entryYear === year;

      return dayMatch && monthMatch && yearMatch;
    });
  }

  if (!day && !month && !year) {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setHours(0, 0, 0, 0); 
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    filteredData = data.filter(entry => {
      const entryDate = parseDateToLocal(entry.data_entrega);
      if (!entryDate) return false;

      return entryDate >= thirtyDaysAgo;
    });
  }

  return filteredData;
};

function DeliveryRequests(): JSX.Element {
  const API_BASE_URL = import.meta.env.PUBLIC_API_BASE_URL;
  const contentRef = useRef<HTMLDivElement>(null)
  const [rawData, setRawData] = useState<Pedidos[]>([]);
  const [allFilteredPedidos, setAllFilteredPedidos] = useState<Pedidos[]>([]);
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; 
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
  ];
  const years = Array.from({ length: 11 }, (_, i) => 2015 + i);

useEffect(() => {
  setLoading(true);
  fetch(`${API_BASE_URL}/pedidos`)
  .then(response => response.json())
  .then((data: Pedidos[]) => {
    setRawData(data);

    const initialFiltered = filterPedidos(data, selectedDay, selectedMonth, selectedYear);
    setAllFilteredPedidos(initialFiltered);
    setCurrentPage(1);
    setLoading(false);
  })
  .catch((err) => {
      console.error("Erro ao buscar pedidos:", err);
      setLoading(false);
  });
}, [API_BASE_URL, selectedDay, selectedMonth, selectedYear]);

useEffect(() => {
  const newFiltered = filterPedidos(rawData, selectedDay, selectedMonth, selectedYear);
  
  setAllFilteredPedidos(newFiltered);
  setCurrentPage(1); 
}, [rawData, selectedDay, selectedMonth, selectedYear]);

const handleExportPDF = () => {
  const element = contentRef.current;
  if (!element) return;
  
  const opt = {
    margin: 0,
    filename: 'pedidos_filtrados.pdf',
    image: { type: 'jpeg' as const, quality: 0.98 },
    html2canvas: { 
      scale: 2, 
      scroll: 0, 
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight + 10,
    },
    jsPDF: { 
      unit: 'mm', 
      format: 'a4', 
      orientation: 'landscape' as const
    },
    pagebreak: { mode: 'avoid-all' }
  };

  html2pdf().set(opt).from(element).save();
};

const paginatedPedidos = allFilteredPedidos;
const startIndex = (currentPage - 1) * itemsPerPage;
const currentData = paginatedPedidos.slice(startIndex, startIndex + itemsPerPage);
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
      <h2 style={{ color: '#Ec3239' }}>Carregando pedidos...</h2>
    </div>
  );

  return (
    <div className="w-100 d-flex flex-column" ref={contentRef}>
      <div className="d-flex justify-content-between px-3 px-md-5 pt-4 mb-3">
        <button 
          onClick={() => navigate('/')}
          style={{
            border: 'none', 
            backgroundColor: 'transparent',
            color: 'black',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <i className="bi bi-arrow-left-circle"></i>
          Voltar
        </button>
        <button
          onClick={handleExportPDF} 
          style={{
            border: 'none', 
            backgroundColor: 'transparent', 
            color: 'black', 
            display: 'flex',
            alignItems: 'center',
            gap: '12px', 
          }}
        >
          <i className="bi bi-download"></i>
          Exportar
        </button>
      </div>

      <div className="mx-auto w-100 px-3 px-md-5" style={{ maxWidth: '1200px' }}>
        <h1 className="h1 fw-bold text-center mb-4" style={{ color: '#Ec3239' }}>Pedidos de Mudança</h1>
        <div className="d-flex justify-content-end mb-4">
          <div className="d-flex flex-wrap justify-content-center justify-content-md-end gap-3 w-100 w-md-auto">
            <InputGroup className="flex-grow-1" style={{ maxWidth: '120px', minWidth: '100px' }}>
              <InputGroup.Text>
                <i className="bi bi-calendar-day"></i> 
              </InputGroup.Text>
              <Form.Select value={selectedDay} 
                onChange={(e) => setSelectedDay(e.target.value)}>
                <option value="">Dia</option>
                  {days.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
              </Form.Select>
            </InputGroup>

            <InputGroup className="flex-grow-1" style={{ maxWidth: '130px', minWidth: '120px' }}>
              <InputGroup.Text>
                <i className="bi bi-calendar-month"></i>
              </InputGroup.Text>
              <Form.Select value={selectedMonth} 
                onChange={(e) => setSelectedMonth(e.target.value)}>
                <option value="">Mês</option>
                  {months.map((month, index) => (
                <option key={month} value={index + 1}>
                  {month}
                </option>
              ))}
              </Form.Select>
            </InputGroup>

            <InputGroup className="flex-grow-1" style={{ maxWidth: '130px', minWidth: '120px' }}>
              <InputGroup.Text>
                <i className="bi bi-calendar-date"></i>
              </InputGroup.Text>
              <Form.Select value={selectedYear} 
                onChange={(e) => setSelectedYear(e.target.value)}>
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
            {currentData.map((pedido) => (
              <RequestCard 
                key={pedido._id}
                team={pedido.equipe.nome}
                startDate={pedido.data_entrega}
                endDate={pedido.data_retirada}
                vehicle={pedido.veiculo.nome}
                description={pedido.descricao ?? ''}
              />
            ))
          }
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
    </div>
  )
}

export default DeliveryRequests;