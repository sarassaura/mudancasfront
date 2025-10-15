import { useState, type JSX, useEffect } from "react";
import { Form, InputGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { showError } from "../../components/ToastAlerts/ShowError";
import { showSuccess } from "../../components/ToastAlerts/ShowSuccess";
import type { DadosPedido, Equipe, Veiculo } from "../../types";
import CustomButton from "../../components/CustomButton";

function Requests(): JSX.Element {
  const API_BASE_URL = import.meta.env.PUBLIC_API_BASE_URL;
  const navigate = useNavigate();
  const [deliveryDate, setDeliveryDate] = useState<Date | null>(null);
  const [takeoutDate, setTakeoutDate] = useState<Date | null>(null);

  const [formData, setFormData] = useState<DadosPedido>({
    data_entrega: "",
    data_retirada: "",
    equipe: "",
    veiculo: "",
    descricao: "",
  });

  const [equipes, setEquipes] = useState<Equipe[]>([]);
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const equipesResponse = await fetch(
          `${API_BASE_URL}/equipes`
        );
        const equipesData = await equipesResponse.json();
        setEquipes(equipesData);

        const veiculosResponse = await fetch(
          `${API_BASE_URL}/veiculos`
        );
        const veiculosData = await veiculosResponse.json();
        setVeiculos(veiculosData);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
    };
    fetchData();
  }, [API_BASE_URL]);

  const formatDateToString = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  useEffect(() => {
    if (deliveryDate) {
      setFormData((prev) => ({
        ...prev,
        data_entrega: formatDateToString(deliveryDate), // ← FORMATO dd/mm/aaaa
      }));
    }
  }, [deliveryDate]);

  useEffect(() => {
    if (takeoutDate) {
      setFormData((prev) => ({
        ...prev,
        data_retirada: formatDateToString(takeoutDate), // ← FORMATO dd/mm/aaaa
      }));
    }
  }, [takeoutDate]);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      descricao: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (
      !formData.data_entrega ||
      !formData.data_retirada ||
      !formData.equipe ||
      !formData.veiculo
    ) {
      showError("Por favor, preencha todos os campos obrigatórios");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/pedidos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        showSuccess("Pedido cadastrado com sucesso!");
        setFormData({
          data_entrega: "",
          data_retirada: "",
          equipe: "",
          veiculo: "",
          descricao: "",
        });
        setDeliveryDate(null);
        setTakeoutDate(null);
      } else {
        const errorData = await response.json();
        showError(errorData.message || "Erro ao cadastrar pedido");
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
      <h1 className="h1 fw-bold text-center" style={{ color: '#Ec3239' }}>
        Cadastro de Pedidos
      </h1>
      <Form style={{ width: "480px", margin: "auto" }} onSubmit={handleSubmit}>
        <div className="row mb-3">
          <Form.Group controlId="formGridDeliveryDate" className="col-6">
            <Form.Label>Data da Entrega</Form.Label>
            <InputGroup className="flex-nowrap">
              <InputGroup.Text>
                <i className="bi bi-calendar-week"></i>
              </InputGroup.Text>
              <DatePicker
                selected={deliveryDate}
                onChange={(date) => setDeliveryDate(date)}
                dateFormat="dd/MM/yyyy"
                className="form-control rounded-start-0"
                placeholderText="dd/mm/aaaa"
                disabled={loading}
              />
            </InputGroup>
          </Form.Group>

          <Form.Group controlId="formGridTakeoutDate" className="col-6">
            <Form.Label>Data da Retirada</Form.Label>
            <InputGroup className="flex-nowrap">
              <InputGroup.Text>
                <i className="bi bi-calendar-week"></i>
              </InputGroup.Text>
              <DatePicker
                selected={takeoutDate}
                onChange={(date) => setTakeoutDate(date)}
                dateFormat="dd/MM/yyyy"
                className="form-control rounded-start-0"
                placeholderText="dd/mm/aaaa"
                disabled={loading}
              />
            </InputGroup>
          </Form.Group>
        </div>

        <Form.Group className="mb-3" controlId="formGridTeam">
          <Form.Label>Equipe</Form.Label>
          <InputGroup>
            <InputGroup.Text>
              <i className="bi bi-people-fill"></i>
            </InputGroup.Text>
            <Form.Select
              name="equipe"
              value={formData.equipe}
              onChange={handleSelectChange}
              disabled={loading}
            >
              <option value="">Digite a equipe do Pedido</option>
              {equipes.map((equipe) => (
                <option key={equipe._id} value={equipe._id}>
                  {equipe.nome}
                </option>
              ))}
            </Form.Select>
          </InputGroup>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formGridVehicle">
          <Form.Label>Veículo</Form.Label>
          <InputGroup>
            <InputGroup.Text>
              <i className="bi bi-car-front-fill"></i>
            </InputGroup.Text>
            <Form.Select
              name="veiculo"
              value={formData.veiculo}
              onChange={handleSelectChange}
              disabled={loading}
            >
              <option value="">Digite o veículo do Pedido</option>
              {veiculos.map((veiculo) => (
                <option key={veiculo._id} value={veiculo._id}>
                  {veiculo.nome}
                </option>
              ))}
            </Form.Select>
          </InputGroup>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formGridNotes">
          <Form.Control
            as="textarea"
            placeholder="Informações Adicionais"
            value={formData.descricao}
            onChange={handleTextareaChange}
            disabled={loading}
            style={{
              width: "480px",
              height: "114px",
              resize: "none",
            }}
          />
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

export default Requests;
