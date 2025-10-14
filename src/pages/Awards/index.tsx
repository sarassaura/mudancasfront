import { useEffect, useState, type JSX } from "react";
import { Form, InputGroup, Pagination, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

interface AwardEntry {
  id: number;
  name: string;
  hoursWorked: string;
  extraHours: string;
  overnights: string;
}

const awardData: AwardEntry[] = [
  { id: 1, name: "Vadson Souza", hoursWorked: "300h", extraHours: "100h", overnights: "2 dias" },
  { id: 2, name: "Elton Alves", hoursWorked: "280h", extraHours: "80h", overnights: "5 dias" },
  { id: 3, name: "Mateus Silva", hoursWorked: "250h", extraHours: "50h", overnights: "3 dias" },
  { id: 4, name: "Vadson Souza", hoursWorked: "300h", extraHours: "100h", overnights: "2 dias" },
  { id: 5, name: "Elton Alves", hoursWorked: "280h", extraHours: "80h", overnights: "5 dias" },
  { id: 6, name: "Mateus Silva", hoursWorked: "250h", extraHours: "50h", overnights: "3 dias" },
];


function Awards(): JSX.Element {
  const navigate = useNavigate();
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
  ];
  const years = Array.from({ length: 11 }, (_, i) => 2015 + i);
  const [sortConfig, setSortConfig] = useState<{ key: keyof AwardEntry; order: "asc" | "desc" }>({
    key: "hoursWorked",
    order: "asc",
  });
  const [sortedData, setSortedData] = useState(awardData);

  const handleSort = (column: keyof AwardEntry) => {
    const isSameColumn = sortConfig.key === column;
    const newOrder = isSameColumn && sortConfig.order === "asc" ? "desc" : "asc";

    const sorted = [...sortedData].sort((a, b) => {
      const getValue = (val: string | number) =>
        parseInt(String(val).replace(/\D/g, "")) || 0;
      const aValue = getValue(a[column]);
      const bValue = getValue(b[column]);
      return newOrder === "asc" ? aValue - bValue : bValue - aValue;
    });

    setSortedData(sorted);
    setSortConfig({ key: column, order: newOrder });
  };

  const renderSortIcon = (column: keyof AwardEntry) => {
    const isActive = sortConfig.key === column || (sortConfig.key === "hoursWorked" && column === "hoursWorked");
    const iconVisibility = isActive ? "visible" : "hidden";

    return (
      <i
        className={`bi bi-arrow-${sortConfig.order === "asc" ? "down" : "up"} ms-1`}
        style={{
          visibility: iconVisibility,
          width: "16px",
        }}
      ></i>
    );
  };

  return (
    <div className="mx-auto d-flex flex-column">
      <div className="d-flex justify-content-between p-4 mb-3">
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

      <div className="mx-auto px-0" style={{ width: '1110px' }}>
        <h1 className="h1 fw-bold text-primary text-center mb-4">Premiações</h1>
        <div className="d-flex justify-content-end mb-4">
          <div className="d-flex gap-3">
            <InputGroup style={{ width: '120px' }}>
              <InputGroup.Text>
                <i className="bi bi-calendar-day"></i> 
              </InputGroup.Text>
              <Form.Select defaultValue="">
                <option value="">Dia</option>
                  {days.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
              </Form.Select>
            </InputGroup>

            <InputGroup style={{ width: '130px' }}>
              <InputGroup.Text>
                <i className="bi bi-calendar-month"></i>
              </InputGroup.Text>
              <Form.Select defaultValue="">
                <option value="">Mês</option>
                  {months.map((month, index) => (
                <option key={month} value={index + 1}>
                  {month}
                </option>
              ))}
              </Form.Select>
            </InputGroup>

            <InputGroup style={{ width: '130px' }}>
              <InputGroup.Text>
                <i className="bi bi-calendar-date"></i>
              </InputGroup.Text>
              <Form.Select defaultValue="">
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
              <th>Nome</th>
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
            {sortedData.map((award, index) => (
              <tr key={award.id}>
                <td className="fw-bold">{index + 1}</td>
                <td>{award.name}</td>
                <td>{award.hoursWorked}</td>
                <td>{award.extraHours}</td>
                <td>{award.overnights}</td>
              </tr>
            ))}
          </tbody>
        </Table>

        <div className="d-flex justify-content-center mb-5">
          <Pagination size="lg"> 
            <Pagination.Prev>Prev</Pagination.Prev>
            <Pagination.Item active>{1}</Pagination.Item>
            <Pagination.Item>{2}</Pagination.Item>
            <Pagination.Item>{3}</Pagination.Item>
            <Pagination.Item>{4}</Pagination.Item>
            <Pagination.Next>Next</Pagination.Next>
          </Pagination>
        </div>
      </div>
    </div>
  )
}

export default Awards;