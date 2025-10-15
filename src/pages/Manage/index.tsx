import { useState, type JSX } from "react";
import { Button, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

interface Section {
  title: string;
  rows: { value: string }[];
  isPedido?: boolean;
  summary?: { label: string; value: string }[];
}

function Manage(): JSX.Element {
  const navigate = useNavigate();
  const [openSection, setOpenSection] = useState<string | null>(null);

  const data: Section[] = [
    {
      title: "Administradores",
      rows: [
        { value: "João Paulo Aleixo" },
        { value: "Michelle Pereira" },
        { value: "Paulo Henrique Aleixo" },
        { value: "Jenifer Campos" },
      ],
    },
    {
      title: "Funcionários",
      rows: [
        { value: "Vadson Souza" },
        { value: "Elton Alves" },
        { value: "Mateus Silva" },
        { value: "Clayton de Carvalho" },
        { value: "Leonan Damasceno" },
        { value: "Jefferson Barros" },
        { value: "Joel Tavares" },
        { value: "Gabriel Braga" },
        { value: "Jaziel de Carvalho" },
        { value: "Vitor Helfstein" },
      ],
    },
    {
      title: "Autônomos",
      rows: [
        { value: "Debora" },
        { value: "Amanda" },
        { value: "Hugo" },
      ],
    },
    {
      title: "Equipes",
      rows: [
        { value: "Diretor" },
        { value: "Vendas" },
        { value: "Logística" },
        { value: "Financeiro" },
      ],
    },
    {
      title: "Veículos",
      rows: [
        { value: "QKR9232" },
        { value: "EZL3F69" },
        { value: "KWN7B37" },
        { value: "EPU5G65" },
        { value: "EAL1D86" },
      ],
    },
    {
      title: "Pedidos",
      isPedido: true,
      summary: [
        { label: "Finalizados", value: "58" },
        { label: "Em andamento", value: "7" },
        { label: "Cancelados", value: "3" },
      ],
      rows: [
        { value: "Mudança X" },
        { value: "Mudança Y" },
        { value: "Frete X" },
        { value: "Frete Y" },
      ],
    },
  ];

  const handleToggle = (title: string) => {
    setOpenSection(openSection === title ? null : title);
  };
  
  const handleEdit = (value: string) => {
    alert(`Editar: ${value}`);
    // Aqui você pode abrir modal ou redirecionar para a página de edição
  };

  const handleDelete = (value: string) => {
    if (confirm(`Tem certeza que deseja excluir ${value}?`)) {
      alert(`Excluído: ${value}`);
      // Aqui você pode chamar API para deletar
    }
  };

  return (
    <div className="w-100 d-flex flex-column">
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
      </div>

      <h1 className="h1 fw-bold text-center mb-4" style={{ color: '#Ec3239' }}>Gerenciar</h1>

      <Table responsive bordered hover className="mb-5 align-middle">
        <tbody>
          {data.map((section) => (
            <>
              <tr key={section.title} style={{ cursor: "pointer" }}>
                <th
                  scope="row"
                  onClick={() => handleToggle(section.title)}
                  className="bg-light"
                >
                  {section.title}
                </th>
              </tr>

              {openSection === section.title && section.isPedido && section.summary && (
                <tr>
                  <td className="ps-5">
                    <div className="w-100 d-flex justify-content-between">
                      {section.summary.map((s) => (
                        <span key={s.label} className="text-center flex-grow-1">
                          <strong>{s.label}:</strong> {s.value}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              )}

              {openSection === section.title &&
                section.rows.map((row, idx) => (
                  <tr key={`${section.title}-${idx}`}>
                    <td className="ps-5">
                      <div className="d-flex justify-content-between align-items-center w-100">
                        <span>{row.value}</span>
                        <div className="d-flex gap-2">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => handleEdit(row.value)}
                          >
                            Editar
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDelete(row.value)}
                          >
                            Excluir
                          </Button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
            </>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default Manage;

