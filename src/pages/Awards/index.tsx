import { useEffect, useRef, useState, type JSX } from "react";
import { Form, InputGroup, Pagination, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import html2pdf from 'html2pdf.js'; 

interface Premiacoes {
  _id: string;
  data: string;
  hora: string;
  autonomo: {
    _id: string;
    nome: string;
  },
  pernoite: boolean;
}

interface AwardEntry {
  id: string;
  name: string;
  hoursWorked: number;
  extraHours: number;
  overnights: number;
}

const RED_COLOR = '#Ec3239'; 
const jornadaNormalHoras = 150;

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

const aggregateAwardsData = (data: Premiacoes[]): AwardEntry[] => {
  const aggregated: { [autonomoId: string]: AwardEntry } = {};

  data.forEach((entry) => {
    const autonomoId = entry.autonomo._id;
    const hours = parseInt(entry.hora, 10) || 0;

    if (!aggregated[autonomoId]) {
      aggregated[autonomoId] = {
        id: autonomoId,
        name: entry.autonomo.nome,
        hoursWorked: 0,
        extraHours: 0,
        overnights: 0,
      };
    }

    aggregated[autonomoId].hoursWorked += hours;
    
    if (entry.pernoite) {
      aggregated[autonomoId].overnights += 1;
    }
  });

  return Object.values(aggregated).map((entry) => {
    const hoursWorked = entry.hoursWorked;
    const extraHours = Math.max(0, hoursWorked - jornadaNormalHoras);

    return {
      ...entry,
      extraHours: extraHours,
    };
  });
};

const filterAndAggregateData = (
  data: Premiacoes[],
  day: string,
  month: string,
  year: string
): AwardEntry[] => {

  let filteredData = data;

  if (day || month || year) {
    filteredData = data.filter(entry => {
      const entryDate = parseDateToLocal(entry.data);
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
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    filteredData = data.filter(entry => {
      const entryDate = new Date(entry.data.split('/').reverse().join('-'));
      return !isNaN(entryDate.getTime()) && entryDate >= thirtyDaysAgo;
    });
  }
  
  return aggregateAwardsData(filteredData);
}

function Awards(): JSX.Element {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const contentRef = useRef<HTMLDivElement>(null)
  const [rawData, setRawData] = useState<Premiacoes[]>([]);
  const [allSortedData, setAllSortedData] = useState<AwardEntry[]>([]);
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
  ];
  const years = Array.from({ length: 11 }, (_, i) => 2015 + i);
  
  const [sortConfig, setSortConfig] = useState<{ key: keyof AwardEntry; order: "asc" | "desc" }>({
    key: "hoursWorked",
    order: "desc",
  });

  const sortData = (dataToSort: AwardEntry[], key: keyof AwardEntry, order: "asc" | "desc"): AwardEntry[] => {
    return [...dataToSort].sort((a, b) => {
      if (key === 'hoursWorked' || key === 'extraHours' || key === 'overnights') {
        const aValue = a[key];
        const bValue = b[key];
        return order === "asc" ? aValue - bValue : bValue - aValue;
      }
      if (key === 'name') {
        const aValue = String(a[key]).toLowerCase();
        const bValue = String(b[key]).toLowerCase();
        if (aValue < bValue) return order === "asc" ? -1 : 1;
        if (aValue > bValue) return order === "asc" ? 1 : -1;
        return 0;
      }
      return 0;
    });
  };

  const handleSort = (column: keyof AwardEntry) => {
    const isSameColumn = sortConfig.key === column;
    const newOrder = isSameColumn && sortConfig.order === "asc" ? "desc" : "asc";

    const sorted = sortData(allSortedData, column, newOrder);

    setAllSortedData(sorted);
    setSortConfig({ key: column, order: newOrder });
  };

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE_URL}/data`) 
      .then(response => response.json())
      .then((data: Premiacoes[]) => {
        setRawData(data);

        const aggregated = filterAndAggregateData(data, selectedDay, selectedMonth, selectedYear);

        const sorted = sortData(aggregated, sortConfig.key, sortConfig.order);

        setAllSortedData(sorted);
        setCurrentPage(1);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erro ao buscar premiações:", err);
        setLoading(false);
      });
  }, [selectedDay, selectedMonth, selectedYear]);

  useEffect(() => {
    if (rawData.length > 0) {
      const aggregated = filterAndAggregateData(rawData, selectedDay, selectedMonth, selectedYear);
      
      const sorted = sortData(aggregated, sortConfig.key, sortConfig.order);
      
      setAllSortedData(sorted);
      setCurrentPage(1);
    }
  }, [selectedDay, selectedMonth, selectedYear, rawData]);

  const handleExportPDF = () => {
    const element = contentRef.current;
    if (!element) return;
    
    const opt = {
      margin: 0,
      filename: 'premiacoes_filtradas.pdf',
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
        orientation: 'landscape' 
      },
      pagebreak: { mode: 'avoid-all' }
    };

    html2pdf().set(opt).from(element).save();
  };

  const paginateAwards = allSortedData;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = paginateAwards.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(paginateAwards.length / itemsPerPage);

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

  const renderSortIcon = (column: keyof AwardEntry) => {
    const isActive = sortConfig.key === column;
    const icon = sortConfig.order === "asc" ? "down" : "up";
    const iconVisibility = isActive ? "visible" : "hidden";

    return (
      <i
        className={`bi bi-arrow-${icon} ms-1`}
        style={{
          visibility: iconVisibility,
          display: 'inline-block',
          width: '16px',
        }}
      ></i>
    );
  };

  if (loading)
    return (
      <div className="text-center p-5">
        <h2 style={{ color: '#Ec3239' }}>Carregando premiações...</h2>
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

      <div className="mx-auto w-100 px-3 px-md-5" style={{ maxWidth: '1200px' }} >
        <h1 className="h1 fw-bold text-center mb-4" style={{ color: '#Ec3239' }}>Premiações</h1>
        <div className="d-flex justify-content-end mb-4">
          <div className="d-flex flex-wrap justify-content-center justify-content-md-end gap-3 w-100 w-md-auto">
            <InputGroup className="flex-grow-1" style={{ maxWidth: '120px', minWidth: '100px' }}>
              <InputGroup.Text>
                <i className="bi bi-calendar-day"></i> 
              </InputGroup.Text>
              <Form.Select value={selectedDay} onChange={(e) => setSelectedDay(e.target.value)}>
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
              <Form.Select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
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
              <Form.Select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
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

        <Table responsive striped bordered className="mb-5">
          <thead>
            <tr>
              <th>#</th>
              <th style={{ cursor: 'pointer' }} onClick={() => handleSort("name")}>
                Nome
                {renderSortIcon("name")}
              </th>
              <th style={{ cursor: 'pointer' }} onClick={() => handleSort("hoursWorked")}> 
                Horas Trabalhadas 
                {renderSortIcon("hoursWorked")}
              </th>
              <th
                style={{ cursor: "pointer" }}
                onClick={() => handleSort("extraHours")}>
                  Horas Extras
                  {renderSortIcon("extraHours")}
                </th>
              <th
                style={{ cursor: "pointer" }}
                onClick={() => handleSort("overnights")}
              >
                Pernoites
                {renderSortIcon("overnights")}
              </th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((entry, index) => (
              <tr key={entry.id}>
                <td className="fw-bold">{startIndex + index + 1}</td>
                <td>{entry.name}</td>
                <td>{entry.hoursWorked}</td>
                <td>{entry.extraHours}</td>
                <td>{entry.overnights}</td>
              </tr>
            ))}
          </tbody>
        </Table>

        <div className="d-flex justify-content-center mb-5">
          <Pagination size="lg"> 
            <Pagination.Prev
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              style={{ color: RED_COLOR }}
            />
            {renderPaginationItems()}
            <Pagination.Next
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              style={{ color: RED_COLOR }}
            />
          </Pagination>
        </div>
      </div>
    </div>
  )
}

export default Awards;