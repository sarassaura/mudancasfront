import { useState, type JSX, useEffect } from "react";
import { Button, Modal, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { showSuccess } from "../../components/ToastAlerts/ShowSuccess";
import { showError } from "../../components/ToastAlerts/ShowError";

interface Section {
  title: string;
  rows: { value: string; isActive?: boolean; id: string }[];
  isPedido?: boolean;
  endpoint: string;
}

function Manage(): JSX.Element {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [showDeletionModal, setShowDeletionModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{
    value: string;
    sectionTitle: string;
    id: string;
    endpoint: string;
  } | null>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const [sectionsData, setSectionsData] = useState<Section[]>([]);

  const sectionsConfig = [
    {
      title: "Administradores",
      endpoint: "admins",
      isPedido: false,
    },
    {
      title: "Funcionários",
      endpoint: "funcionarios",
      isPedido: false,
    },
    {
      title: "Autônomos",
      endpoint: "autonomos",
      isPedido: false,
    },
    {
      title: "Equipes",
      endpoint: "equipes",
      isPedido: false,
    },
    {
      title: "Veículos",
      endpoint: "veiculos",
      isPedido: false,
    },
    {
      title: "Pedidos",
      endpoint: "pedidos",
      isPedido: true,
    },
  ];

  const editRoutes: Record<string, string> = {
    Administradores: "/admins",
    Funcionários: "/funcionarios",
    Autônomos: "/autonomos",
    Equipes: "/equipes",
    Veículos: "/veiculos",
    Pedidos: "/pedidos",
  };

  const fetchSectionData = async (endpoint: string, title: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${endpoint}`);

      if (!response.ok) {
        throw new Error(`Erro ao buscar ${title}`);
      }

      const data = await response.json();

      const rows = data.map((item: any) => ({
        value: item.nome || item.titulo,
        id: item._id,
        isActive: item.status !== "excluído",
      }));

      return rows;
    } catch (error) {
      console.error(`Erro ao buscar ${title}:`, error);
      showError(`Erro ao carregar ${title}`);
      return [];
    }
  };

  const reloadSection = async (endpoint: string, title: string) => {
    const rows = await fetchSectionData(endpoint, title);
    setSectionsData((prev) =>
      prev.map((section) =>
        section.endpoint === endpoint ? { ...section, rows } : section
      )
    );
  };

  useEffect(() => {
    const loadAllData = async () => {
      const allSectionsData = await Promise.all(
        sectionsConfig.map(async (config) => {
          const rows = await fetchSectionData(config.endpoint, config.title);
          return {
            title: config.title,
            rows,
            isPedido: config.isPedido,
            endpoint: config.endpoint,
          };
        })
      );

      setSectionsData(allSectionsData);
    };

    loadAllData();
  }, []);

  const handleToggle = async (title: string, endpoint: string) => {
    if (openSection === title) {
      setOpenSection(null);
    } else {
      setOpenSection(title);
      await reloadSection(endpoint, title);
    }
  };

  const handleEdit = (id: string, sectionTitle: string) => {
    const route = editRoutes[sectionTitle];
    if (route) {
      navigate(route, { state: { editId: id } });
    } else {
      showError("Rota de edição não encontrada.");
    }
  };

  const handleCloseModal = () => {
    setShowDeletionModal(false);
    setItemToDelete(null);
  };

  const deleteItem = async (id: string, endpoint: string) => {
    setLoading(id);

    try {
      const response = await fetch(`${API_BASE_URL}/${endpoint}/${id}/excluir`, {
        method: "PATCH",
      });

      if (response.ok) {
        showSuccess("Item excluído com sucesso!");

        setSectionsData((prev) =>
          prev.map((section) =>
            section.endpoint === endpoint
              ? {
                  ...section,
                  rows: section.rows.filter((r) => r.id !== id),
                }
              : section
          )
        );
      } else {
        const errorData = await response.json();
        showError(errorData.message || "Erro ao excluir item");
      }
    } catch (error) {
      showError("Erro de conexão com o servidor.");
      console.error("Erro:", error);
    } finally {
      setLoading(null);
    }
  };

  const handleDelete = (
    row: { value: string; id: string },
    sectionTitle: string,
    endpoint: string
  ) => {
    setItemToDelete({
      value: row.value,
      sectionTitle,
      id: row.id,
      endpoint,
    });
    setShowDeletionModal(true);
  };

  const confirmDeletion = () => {
    if (!itemToDelete) {
      showError("Nenhum item selecionado para exclusão.");
      handleCloseModal();
      return;
    }

    deleteItem(itemToDelete.id, itemToDelete.endpoint);
    handleCloseModal();
  };

  return (
    <div className="w-100 d-flex flex-column">
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
      </div>

      <h1 className="h1 fw-bold text-center mb-4" style={{ color: "#Ec3239" }}>
        Gerenciar
      </h1>

      <Table responsive bordered hover className="mb-5 align-middle">
        <tbody>
          {sectionsData.map((section) => (
            <>
              <tr key={section.title} style={{ cursor: "pointer" }}>
                <th
                  scope="row"
                  onClick={() => handleToggle(section.title, section.endpoint)}
                  className="bg-light"
                >
                  {section.title}
                </th>
              </tr>

              {openSection === section.title &&
                section.rows
                  .filter((row) => row.isActive !== false)
                  .map((row, idx) => (
                    <tr
                      key={`${section.title}-${idx}`}
                      style={{ opacity: row.isActive === false ? 0.6 : 1 }}
                    >
                      <td className="ps-3 ps-sm-5">
                        <div className="d-flex justify-content-between align-items-center w-100">
                          <span className="me-2">
                            {row.value}
                            {row.isActive === false && (
                              <i
                                className="bi bi-x-circle-fill text-danger ms-2"
                                title="Inativo"
                              ></i>
                            )}
                          </span>
                          <div className="d-flex gap-2">
                            <Button
                              variant="outline-primary"
                              size="sm"
                              disabled={
                                row.isActive === false || loading === row.id
                              }
                              onClick={() => handleEdit(row.id, section.title)}
                            >
                              {loading === row.id ? "..." : "Editar"}
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              disabled={loading === row.id}
                              onClick={() =>
                                handleDelete(
                                  row,
                                  section.title,
                                  section.endpoint
                                )
                              }
                            >
                              {loading === row.id
                                ? "..."
                                : "Excluir"}
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
      <Modal show={showDeletionModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title style={{ color: "#Ec3239" }}>
            Confirmar Exclusão
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Você tem certeza que deseja excluir *{itemToDelete?.value}*?
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={handleCloseModal}
            disabled={false}
          >
            Cancelar
          </Button>
          <Button
            variant="danger"
            onClick={confirmDeletion}
            disabled={false}
          >
            Sim, Excluir
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Manage;
