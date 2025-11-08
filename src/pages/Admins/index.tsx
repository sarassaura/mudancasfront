import { type JSX, useState, useEffect } from "react";
import { Form, InputGroup } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { showSuccess } from "../../components/ToastAlerts/ShowSuccess";
import { showError } from "../../components/ToastAlerts/ShowError";
import type { DadosAdmin } from "../../types";
import CustomButton from "../../components/CustomButton";

function Admins(): JSX.Element {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const navigate = useNavigate();
  const location = useLocation();
  const editId = location.state?.editId;
  const isEditMode = Boolean(editId);
  const [formData, setFormData] = useState<DadosAdmin>({
    nome: "",
    email: "",
    senha: "",
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    const fetchAdminData = async () => {
      if (isEditMode && editId) {
        setFetching(true);
        try {
          const response = await fetch(`${API_BASE_URL}/admins/${editId}`);

          if (!response.ok) {
            throw new Error("Erro ao carregar dados do admin");
          }

          const adminData = await response.json();
          setFormData({
            nome: adminData.nome || "",
            email: adminData.email || "",
            senha: "",
          });
        } catch (error) {
          showError("Erro ao carregar dados para edição");
          console.error("Erro:", error);
        } finally {
          setFetching(false);
        }
      }
    };

    fetchAdminData();
  }, [isEditMode, editId, API_BASE_URL]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.nome || !formData.email) {
      showError("Por favor, preencha nome e email");
      setLoading(false);
      return;
    }

    if (!isEditMode && !formData.senha) {
      showError("Por favor, preencha a senha");
      setLoading(false);
      return;
    }

    try {
      let response;

      if (isEditMode) {
        const updateData: Partial<DadosAdmin> = {
          nome: formData.nome,
          email: formData.email,
        };

        if (formData.senha) {
          updateData.senha = formData.senha;
        }

        response = await fetch(`${API_BASE_URL}/admins/${editId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateData),
        });
      } else {
        response = await fetch(`${API_BASE_URL}/admins`, {
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
            ? "Admin atualizado com sucesso!"
            : "Admin cadastrado com sucesso!"
        );

        if (isEditMode) {
          navigate("/gerenciar");
        } else {
          navigate("/cadastrar");
        }
      } else {
        const errorData = await response.json();
        showError(
          errorData.message ||
            `Erro ao ${isEditMode ? "atualizar" : "cadastrar"} admin`
        );
      }
    } catch (error) {
      showError("Erro de conexão com o servidor.");
      console.error("Erro:", error);
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
        {isEditMode ? "Editar Admin" : "Cadastro de Admin"}
      </h1>
      <Form
        className="mx-auto w-100"
        style={{ maxWidth: "480px" }}
        onSubmit={handleSubmit}
      >
        <Form.Group className="mb-3" controlId="formGridAddress1">
          <Form.Label>Nome</Form.Label>
          <InputGroup>
            <InputGroup.Text>
              <i className="bi bi-person-fill"></i>
            </InputGroup.Text>
            <Form.Control
              placeholder="Digite o nome do Admin"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              disabled={loading || fetching}
            />
          </InputGroup>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formGridAddress1">
          <Form.Label>Email</Form.Label>
          <InputGroup>
            <InputGroup.Text>
              <i className="bi bi-at"></i>
            </InputGroup.Text>
            <Form.Control
              placeholder="Digite o email do Admin"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              disabled={loading || fetching}
            />
          </InputGroup>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formGridAddress1">
          <Form.Label>Senha</Form.Label>
          <InputGroup>
            <InputGroup.Text>
              <i className="bi bi-key-fill"></i>
            </InputGroup.Text>
            <Form.Control
              placeholder={
                isEditMode
                  ? "Deixe em branco para manter a senha atual"
                  : "Digite a senha do Admin"
              }
              name="senha"
              type="password"
              value={formData.senha}
              onChange={handleChange}
              disabled={loading || fetching}
            />
          </InputGroup>
          {isEditMode && (
            <Form.Text className="text-muted">
              Preencha apenas se desejar alterar a senha
            </Form.Text>
          )}
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

export default Admins;
