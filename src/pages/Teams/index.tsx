import { type JSX, useState, useEffect } from "react";
import { Form, InputGroup } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { showError } from "../../components/ToastAlerts/ShowError";
import { showSuccess } from "../../components/ToastAlerts/ShowSuccess";
import type { DadosEquipe } from "../../types";
import CustomButton from "../../components/CustomButton";

type FormElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

function Teams(): JSX.Element {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  const location = useLocation();
  const editId = location.state?.editId;
  const isEditMode = Boolean(editId);

  const [formData, setFormData] = useState<DadosEquipe>({
    nome: "",
    status: "ativo",
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    const fetchEquipeData = async () => {
      if (isEditMode && editId) {
        setFetching(true);
        try {
          const response = await fetch(`${API_BASE_URL}/equipes/${editId}`);

          if (!response.ok) {
            throw new Error("Erro ao carregar dados da equipe");
          }

          const equipeData = await response.json();
          setFormData({
            nome: equipeData.nome || "",
            status: equipeData.status || "ativo",
          });
        } catch (error) {
          showError("Erro ao carregar dados para edição");
          console.error("Erro:", error);
        } finally {
          setFetching(false);
        }
      }
    };

    fetchEquipeData();
  }, [isEditMode, editId, API_BASE_URL]);

  const handleChange = (e: React.ChangeEvent<FormElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.nome) {
      showError("Por favor, preencha o nome da equipe");
      setLoading(false);
      return;
    }

    try {
      let response;

      if (isEditMode) {
        response = await fetch(`${API_BASE_URL}/equipes/${editId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
      } else {
        response = await fetch(`${API_BASE_URL}/equipes`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
      }

      if (response.ok) {
        showSuccess(
          isEditMode
            ? "Equipe atualizada com sucesso!"
            : "Equipe cadastrada com sucesso!"
        );

        navigate("/gerenciar");
      } else {
        const errorData = await response.json();
        showError(
          errorData.message ||
            `Erro ao ${isEditMode ? "atualizar" : "cadastrar"} equipe`
        );
      }
    } catch (error) {
      console.error(error);
      showError("Erro de conexão com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (location.state?.fromManage || isEditMode) {
      navigate("/gerenciar");
    } else {
      navigate("/cadastrar");
    }
  };

  if (fetching) {
    return (
      <div className="container my-auto text-center">
        <div className="spinner-border text-danger" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
        <p className="mt-2">Carregando dados...</p>
      </div>
    );
  }

  return (
    <div className="container my-auto">
      <h1
        className="h1 fw-bold text-center w-100 mt-3"
        style={{ color: "#Ec3239" }}
      >
        {isEditMode ? "Editar Equipe" : "Cadastro de Equipe"}
      </h1>
      <Form
        className="mx-auto w-100"
        style={{ maxWidth: "480px" }}
        onSubmit={handleSubmit}
      >
        <Form.Group className="mb-3 mx-auto" controlId="formGridAddress1">
          <Form.Label>Nome</Form.Label>
          <InputGroup>
            <InputGroup.Text>
              <i className="bi bi-people-fill"></i>
            </InputGroup.Text>
            <Form.Control
              placeholder="Digite o nome da Equipe"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              disabled={loading || fetching}
            />
          </InputGroup>
        </Form.Group>

        <div className="row mb-3 d-flex flex-col gap-3">
          <CustomButton
            type="button"
            className="col-6 mx-auto"
            onClick={handleBack}
            disabled={loading || fetching}
            isOutline
          >
            Voltar
          </CustomButton>
          <CustomButton
            type="submit"
            className="col-6 mx-auto"
            disabled={loading || fetching}
          >
            {loading
              ? isEditMode
                ? "Atualizando..."
                : "Cadastrando..."
              : isEditMode
              ? "Atualizar"
              : "Salvar"}
          </CustomButton>
        </div>
      </Form>
    </div>
  );
}

export default Teams;
