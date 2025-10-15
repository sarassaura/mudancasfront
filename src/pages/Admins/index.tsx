import { type JSX, useState } from "react";
import { Form, InputGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { showSuccess } from "../../components/ToastAlerts/ShowSuccess";
import { showError } from "../../components/ToastAlerts/ShowError";
import type { DadosAdmin } from "../../types";
import CustomButton from "../../components/CustomButton";

function Admins(): JSX.Element {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const navigate = useNavigate();
  const [formData, setFormData] = useState<DadosAdmin>({
    nome: "",
    email: "",
    senha: "",
  });

  const [loading, setLoading] = useState(false);

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

    if (!formData.nome || !formData.email || !formData.senha) {
      showError("Por favor, preencha todos os campos");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/admins`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        showSuccess("Admin cadastrado com sucesso!");
        setFormData({ nome: "", email: "", senha: "" });
      } else {
        const errorData = await response.json();
        showError(errorData.message || "Erro ao cadastrar admin");
      }
    } catch (error) {
      showError("Erro de conexão com o servidor.");
      console.error("Erro:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto d-flex flex-column">
      <h1 className="h1 fw-bold text-center" style={{ color: "#Ec3239" }}>
        Cadastro de Admin
      </h1>
      <Form style={{ width: "480px", margin: "auto" }} onSubmit={handleSubmit}>
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
              disabled={loading}
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
              disabled={loading}
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
              placeholder="Digite a senha do Admin"
              name="senha"
              type="password"
              value={formData.senha}
              onChange={handleChange}
              disabled={loading}
            />
          </InputGroup>
        </Form.Group>

        <div className="row mb-3 d-flex flex-col">
          <CustomButton
            type="button"
            className="col-6 mx-auto"
            onClick={() => navigate("/cadastrar")}
            disabled={loading}
            isOutline
          >
            Voltar
          </CustomButton>
          <CustomButton
            type="submit"
            className="col-6 mx-auto"
            disabled={loading}
          >
            {loading ? "Cadastrando..." : "Salvar"}
          </CustomButton>
        </div>
      </Form>
    </div>
  );
}

export default Admins;
