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
    isPedido?: boolean;
  } | null>(null);
  const [showInactiveSection, setShowInactiveSection] = useState(false);
  const [showReactivationModal, setShowReactivationModal] = useState(false);
  const [itemToReactivate, setItemToReactivate] = useState<{
    value: string;
    sectionTitle: string;
    id: string;
    endpoint: string;
  } | null>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const [sectionsData, setSectionsData] = useState<Section[]>([]);
  const [openInactiveSection, setOpenInactiveSection] = useState<string | null>(
    null
  );
  const [showPermanentDeleteModal, setShowPermanentDeleteModal] =
    useState(false);

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
        isActive: item.status !== "excluído" && item.status !== "inativado",
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
      setOpenInactiveSection(null);
      await reloadSection(endpoint, title);
    }
  };

  const handleToggleInactive = async (title: string, endpoint: string) => {
    if (openInactiveSection === title) {
      setOpenInactiveSection(null);
    } else {
      setOpenInactiveSection(title);
      setOpenSection(null);
      await reloadSection(endpoint, title);
    }
  };

  const handleToggleInactiveSection = () => {
    setShowInactiveSection(!showInactiveSection);
  };

  const handleEdit = (id: string, sectionTitle: string) => {
    const route = editRoutes[sectionTitle];
    if (route) {
      navigate(route, { state: { editId: id, fromManage: true } });
    } else {
      showError("Rota de edição não encontrada.");
    }
  };

  const handleCloseModal = () => {
    setShowDeletionModal(false);
    setShowReactivationModal(false);
    setItemToDelete(null);
    setItemToReactivate(null);
    setShowPermanentDeleteModal(false);
  };

  const deleteItem = async (id: string, endpoint: string) => {
    setLoading(id);

    try {
      const response = await fetch(
        `${API_BASE_URL}/${endpoint}/${id}/inativar`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        showSuccess("Item excluído com sucesso!");
        await reloadAllSections();
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

  const reactivateItem = async (id: string, endpoint: string) => {
    setLoading(id);

    try {
      const response = await fetch(
        `${API_BASE_URL}/${endpoint}/${id}/reativar`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        showSuccess("Item reativado com sucesso!");
        await reloadAllSections();
      } else {
        const errorData = await response.json();
        showError(errorData.message || "Erro ao reativar item");
      }
    } catch (error) {
      showError("Erro de conexão com o servidor.");
      console.error("Erro:", error);
    } finally {
      setLoading(null);
    }
  };

  const reloadAllSections = async () => {
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

  const deletePermanently = async (id: string, endpoint: string) => {
    setLoading(id);

    try {
      const response = await fetch(`${API_BASE_URL}/${endpoint}/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        const section = sectionsData.find((s) => s.endpoint === endpoint);
        if (section?.isPedido) {
          showSuccess("Pedido excluído permanentemente com sucesso!");
        } else {
          showSuccess("Item excluído permanentemente com sucesso!");
        }

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
        showError(
          errorData.message || "Erro ao excluir pedido permanentemente"
        );
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

  const handleReactivate = (
    row: { value: string; id: string },
    sectionTitle: string,
    endpoint: string
  ) => {
    setItemToReactivate({
      value: row.value,
      sectionTitle,
      id: row.id,
      endpoint,
    });
    setShowReactivationModal(true);
  };

  const handlePermanentDelete = (
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
    setShowPermanentDeleteModal(true);
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

  const confirmReactivation = () => {
    if (!itemToReactivate) {
      showError("Nenhum item selecionado para reativação.");
      handleCloseModal();
      return;
    }

    reactivateItem(itemToReactivate.id, itemToReactivate.endpoint);
    handleCloseModal();
  };

  const confirmPermanentDeletion = () => {
    if (!itemToDelete) {
      showError("Nenhum item selecionado para exclusão.");
      handleCloseModal();
      return;
    }

    deletePermanently(itemToDelete.id, itemToDelete.endpoint);
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
                              {loading === row.id ? "..." : "Excluir"}
                            </Button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
            </>
          ))}

          <tr key="itens-inativos" style={{ cursor: "pointer" }}>
            <th
              scope="row"
              onClick={handleToggleInactiveSection}
              className="bg-light"
              style={{ color: "#Ec3239" }}
            >
              Itens Inativos
            </th>
          </tr>

          {showInactiveSection &&
            sectionsData.map((section) => (
              <>
                <tr
                  key={`inactive-${section.title}`}
                  style={{ cursor: "pointer" }}
                >
                  <th
                    scope="row"
                    onClick={() =>
                      handleToggleInactive(section.title, section.endpoint)
                    }
                    className="bg-light ps-4"
                    style={{ backgroundColor: "#f8f9fa" }}
                  >
                    {section.title}
                  </th>
                </tr>

                {openInactiveSection === section.title &&
                  section.rows
                    .filter((row) => row.isActive === false)
                    .map((row, idx) => (
                      <tr
                        key={`inactive-${section.title}-${idx}`}
                        style={{ opacity: 0.7 }}
                      >
                        <td className="ps-5 ps-sm-5">
                          <div className="d-flex justify-content-between align-items-center w-100">
                            <span className="me-2">
                              {row.value}
                              <i
                                className="bi bi-x-circle-fill text-danger ms-2"
                                title="Inativo"
                              ></i>
                            </span>
                            <div className="d-flex gap-2">
                              <Button
                                variant="outline-success"
                                size="sm"
                                disabled={loading === row.id}
                                onClick={() =>
                                  handleReactivate(
                                    row,
                                    section.title,
                                    section.endpoint
                                  )
                                }
                              >
                                {loading === row.id ? "..." : "Reativar"}
                              </Button>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                disabled={loading === row.id}
                                onClick={() =>
                                  handlePermanentDelete(
                                    row,
                                    section.title,
                                    section.endpoint
                                  )
                                }
                              >
                                {loading === row.id
                                  ? "..."
                                  : "Excluir Permanentemente"}
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
            Você tem certeza que deseja excluir{" "}
            <strong>{itemToDelete?.value}</strong>?
          </p>

          <p className="text-muted">
            {itemToDelete?.sectionTitle === "Pedidos"
              ? "O pedido será removido da visualização, mas os dados serão mantidos no banco."
              : "O item será excluído e removido da visualização, mas os dados serão mantidos no banco."}
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
          <Button variant="danger" onClick={confirmDeletion}>
            Sim, Excluir
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showPermanentDeleteModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title style={{ color: "#Ec3239" }}>
            Excluir Permanentemente
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="alert alert-danger">
            <strong>Atenção!</strong> Esta ação não pode ser desfeita.
          </div>
          <p>
            Você tem certeza que deseja excluir permanentemente{" "}
            {itemToDelete?.sectionTitle === "Pedidos" ? "o pedido" : "o item"}:
            <strong> {itemToDelete?.value}</strong>?
          </p>
          <p className="text-muted">
            Todos os dados{" "}
            {itemToDelete?.sectionTitle === "Pedidos"
              ? "deste pedido"
              : "deste item"}{" "}
            serão permanentemente removidos do banco de dados.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancelar
          </Button>
          <Button
            variant="danger"
            onClick={confirmPermanentDeletion}
            disabled={false}
          >
            Sim, Excluir Permanentemente
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showReactivationModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title style={{ color: "#Ec3239" }}>
            Confirmar Reativação
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Você tem certeza que deseja reativar{" "}
            <strong>{itemToReactivate?.value}</strong>?
          </p>
          <p className="text-muted">
            O item voltará a aparecer nas listas ativas do sistema.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancelar
          </Button>
          <Button variant="success" onClick={confirmReactivation}>
            Sim, Reativar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Manage;
