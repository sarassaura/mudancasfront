import { useState, type JSX } from "react";
import { Button, Modal, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { showSuccess } from "../../components/ToastAlerts/ShowSuccess";
import { showError } from "../../components/ToastAlerts/ShowError";

interface Section {
  title: string;
  rows: { value: string, isActive?: boolean }[];
  isPedido?: boolean;
}

function Manage(): JSX.Element {
  const navigate = useNavigate();
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [showInactivationModal, setShowInactivationModal] = useState(false);
  const [itemToInactivate, setItemToInactivate] = useState<{ value: string; sectionTitle: string } | null>(null);

  const initialData: Section[] = [
    {
      title: "Administradores",
      rows: [
        { value: "João Paulo Aleixo", isActive: true },
        { value: "Michelle Pereira", isActive: true },
        { value: "Paulo Henrique Aleixo", isActive: true },
        { value: "Jenifer Campos", isActive: true },
      ],
    },
    {
      title: "Funcionários",
      rows: [
        { value: "Vadson Souza", isActive: true },
        { value: "Elton Alves", isActive: true },
        { value: "Mateus Silva", isActive: true },
        { value: "Clayton de Carvalho", isActive: true },
        { value: "Leonan Damasceno", isActive: true },
        { value: "Jefferson Barros", isActive: true },
        { value: "Joel Tavares", isActive: true },
        { value: "Gabriel Braga", isActive: true },
        { value: "Jaziel de Carvalho", isActive: true },
        { value: "Vitor Helfstein", isActive: true },
      ],
    },
    {
      title: "Autônomos",
      rows: [
        { value: "Debora", isActive: true },
        { value: "Amanda", isActive: true },
        { value: "Hugo", isActive: true },
      ],
    },
    {
      title: "Equipes",
      rows: [
        { value: "Diretor", isActive: true },
        { value: "Vendas", isActive: true },
        { value: "Logística", isActive: true },
        { value: "Financeiro", isActive: true },
      ],
    },
    {
      title: "Veículos",
      rows: [
        { value: "QKR9232", isActive: true },
        { value: "EZL3F69", isActive: true },
        { value: "KWN7B37", isActive: true },
        { value: "EPU5G65", isActive: true },
        { value: "EAL1D86", isActive: true },
      ],
    },
    {
      title: "Pedidos",
      isPedido: true,
      rows: [
        { value: "Mudança X", isActive: true },
        { value: "Mudança Y", isActive: true },
        { value: "Frete X", isActive: true },
        { value: "Frete Y", isActive: true },
      ],
    },
  ];

  const [sectionsData, setSectionsData] = useState<Section[]>(initialData);

  const editRoutes: Record<string, string> = {
    "Administradores": "/admins",
    "Funcionários": "/funcionarios",
    "Autônomos": "/autonomos",
    "Equipes": "/equipes",
    "Veículos": "/veiculos",
    "Pedidos": "/pedidos",
  };

  const handleToggle = (title: string) => {
    setOpenSection(openSection === title ? null : title);
  };

  const handleEdit = (_value: string, sectionTitle: string) => {
    const route = editRoutes[sectionTitle];

    if (route) {
      navigate(route); 
    } else {
      showError("Rota de edição não encontrada.");
    }
  };

  const handleInactivationPrompt = (value: string, sectionTitle: string) => {
    setItemToInactivate({ value, sectionTitle });
    setShowInactivationModal(true);
  };

  const handleCloseModal = () => {
    setShowInactivationModal(false);
    setItemToInactivate(null);
  };

  const confirmInactivation = () => {
    if (!itemToInactivate) {
      showError("Nenhum item selecionado para inativação.");
      handleCloseModal();
      return;
    }

    setSectionsData(prevData => prevData.map(section => {
      if (section.title === itemToInactivate.sectionTitle) {
        return {
          ...section,
          rows: section.rows.map(row => 
            row.value === itemToInactivate.value ? { ...row, isActive: false } : row
          ),
        };
      }
      return section;
    }));

    showSuccess(`"${itemToInactivate.value}" inativado com sucesso!`);
    handleCloseModal();
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
          {sectionsData.map((section) => (
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

              {openSection === section.title &&
                section.rows
                  .sort((a, b) => (a.isActive === b.isActive ? 0 : a.isActive ? -1 : 1)) 
                  .map((row, idx) => (
                  <tr key={`${section.title}-${idx}`} style={{ opacity: row.isActive === false ? 0.6 : 1 }}>
                    <td className="ps-5">
                      <div className="d-flex justify-content-between align-items-center w-100">
                        <span>
                          {row.value}
                          {row.isActive === false && <i className="bi bi-x-circle-fill text-danger ms-2" title="Inativo"></i>}
                        </span>
                        <div className="d-flex gap-2">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => handleEdit(row.value, section.title)}
                          >
                            Editar
                          </Button>
                          <Button
                            variant={row.isActive === false ? "outline-success" : "outline-danger"}
                            size="sm"
                            onClick={() => handleInactivationPrompt(row.value, section.title)}
                          >
                            {row.isActive === false ? 'Reativar' : 'Inativar'}
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
      <Modal show={showInactivationModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title style={{ color: '#Ec3239' }}>Confirmar Inativação</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Você tem certeza que deseja inativar *{itemToInactivate?.value}*?</p>
          <p className="text-muted small">
            Este item será mantido no banco de dados e poderá ser reativado a qualquer momento.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal} disabled={false}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={confirmInactivation} disabled={false}>
            Sim, Excluir
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Manage;

