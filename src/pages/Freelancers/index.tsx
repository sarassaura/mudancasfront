import { type JSX, useState } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { showError } from "../../components/ToastAlerts/ShowError";
import { showSuccess } from "../../components/ToastAlerts/ShowSuccess";
import type { DadosAutonomo } from "../../types";

function Freelancers(): JSX.Element {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<DadosAutonomo>({
    nome: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: any) => {
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
      showError("Por favor, preencha o nome do Autônomo");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/autonomos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        showSuccess("Autônomo cadastrado com sucesso!");
        setFormData({
          nome: "",
        });
      } else {
        const errorData = await response.json();
        showError(errorData.message || "Erro ao cadastrar autônomo");
      }
    } catch (error) {
      showError("Erro de conexão com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto d-flex flex-column">
      <h1 className="h1 fw-bold text-primary text-center">
        Cadastro de Profissional Autônomo
      </h1>
      <Form style={{ width: "480px", margin: "auto" }} onSubmit={handleSubmit}>
        <Form.Group className="mb-3 mx-auto" controlId="formGridAddress1">
          <Form.Label>Nome</Form.Label>
          <InputGroup>
            <InputGroup.Text>
              <i className="bi bi-person-fill"></i>
            </InputGroup.Text>
            <Form.Control
              placeholder="Digite o nome do Autônomo"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              disabled={loading}
            />
          </InputGroup>
        </Form.Group>

        <div className="row mb-3 d-flex flex-col">
          <Button
            variant="outline-primary"
            type="button"
            className="col-6 mx-auto"
            size="lg"
            style={{ width: "200px" }}
            onClick={() => navigate("/cadastrar")}
            disabled={loading}
          >
            Voltar
          </Button>
          <Button
            variant="primary"
            type="submit"
            className="col-6 mx-auto"
            size="lg"
            style={{ width: "200px" }}
            disabled={loading}
          >
            {loading ? "Cadastrando..." : "Salvar"}
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default Freelancers;
