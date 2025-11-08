import { useState, type JSX, useEffect } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { showError } from "../../components/ToastAlerts/ShowError";
import { showSuccess } from "../../components/ToastAlerts/ShowSuccess";
import type { DadosHorasAutonomo, Autonomo } from "../../types";
import CustomButton from "../../components/CustomButton";

interface HourEntry {
  id: number;
  daily?: boolean;
  daily_date?: Date | null;
  stairs?: boolean;
  date_stairs?: Date | null;
  price?: string;
}

const DayRow = ({
  entry,
  updateEntry,
}: {
  entry: HourEntry;
  updateEntry: (
    id: number,
    field: keyof HourEntry,
    value: Date | null | number | boolean | string
  ) => void;
}) => (
  <>
    <div className="row mb-3 g-3 align-items-end justify-content-between text-center">
      <div className="col-12 d-flex flex-wrap justify-content-center justify-content-md-start align-items-end gap-3 mb-3">
        <Form.Group className="col-12 col-md-3 d-flex flex-column align-items-center">
          <Form.Label>Diária?</Form.Label>
          <Form.Check
            type="checkbox"
            checked={entry.daily}
            onChange={(e) => updateEntry(entry.id, "daily", e.target.checked)}
            style={{ marginTop: "0.4rem", transform: "scale(1.2)" }}
          />
        </Form.Group>
        <Form.Group className="col-12 col-md-5">
          <Form.Label>Data da Diária</Form.Label>
          <InputGroup className="d-flex justify-content-center justify-content-md-start">
            <InputGroup.Text>
              <i className="bi bi-calendar-week"></i>
            </InputGroup.Text>
            <div className="col-md-8">
              <DatePicker
                selected={entry.daily_date}
                onChange={(date) => updateEntry(entry.id, "daily_date", date)}
                dateFormat="dd/MM/yyyy"
                className="form-control rounded-start-0 w-100"
                placeholderText="dd/mm/aaaa"
              />
            </div>
          </InputGroup>
        </Form.Group>
      </div>

      <div className="col-12 d-flex flex-wrap justify-content-center justify-content-md-start align-items-end gap-3 mb-3">
        <Form.Group className="col-12 col-md-3 d-flex flex-column align-items-center">
          <Form.Label>Escada?</Form.Label>
          <Form.Check
            type="checkbox"
            checked={entry.stairs}
            onChange={(e) => updateEntry(entry.id, "stairs", e.target.checked)}
            style={{ marginTop: "0.4rem", transform: "scale(1.2)" }}
          />
        </Form.Group>
        <Form.Group className="col-12 col-md-5">
          <Form.Label>Data Escada</Form.Label>
          <InputGroup className="d-flex justify-content-center justify-content-md-start">
            <InputGroup.Text>
              <i className="bi bi-calendar-week"></i>
            </InputGroup.Text>
            <div className="col-md-8">
              <DatePicker
                selected={entry.date_stairs}
                onChange={(date) => updateEntry(entry.id, "date_stairs", date)}
                dateFormat="dd/MM/yyyy"
                className="form-control rounded-start-0 w-100"
                placeholderText="dd/mm/aaaa"
              />
            </div>
          </InputGroup>
        </Form.Group>
        <Form.Group className="col-12 col-md-3 d-flex flex-column align-items-center">
          <Form.Label>Valor a Pagar</Form.Label>
          <Form.Control
            type="text"
            value={entry.price}
            onChange={(e) => {
              const raw = e.target.value.replace(/\D/g, ""); // só números
              const floatValue = parseFloat(raw) / 100;
              const formatted =
                raw.length === 0
                  ? ""
                  : floatValue.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    });
              updateEntry(entry.id, "price", formatted);
            }}
            style={{ marginTop: "0.4rem" }}
            placeholder="R$ 0,00"
          />
        </Form.Group>
      </div>
    </div>
  </>
);

function FreelancerHours(): JSX.Element {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  const [days, setDays] = useState<HourEntry[]>([
    {
      id: 1,
      daily: false,
      daily_date: null,
      stairs: false,
      date_stairs: null,
      price: "",
    },
  ]);

  const [autonomos, setAutonomos] = useState<Autonomo[]>([]);
  const [selectedAutonomo, setSelectedAutonomo] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAutonomos = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/autonomos`);
        const data = await response.json();
        setAutonomos(data);
      } catch (error) {
        console.error("Erro ao carregar autônomos:", error);
      }
    };

    fetchAutonomos();
  }, [API_BASE_URL]);

  const handleAddDay = () => {
    const newId = days.length > 0 ? Math.max(...days.map((d) => d.id)) + 1 : 1;
    setDays([
      ...days,
      {
        id: newId,
        daily: false,
        daily_date: null,
        stairs: false,
        date_stairs: null,
        price: "",
      },
    ]);
  };

  const updateDayEntry = (
    id: number,
    field: keyof HourEntry,
    value: Date | null | number | boolean | string
  ) => {
    setDays(
      days.map((day) => (day.id === id ? { ...day, [field]: value } : day))
    );
  };

  const formatDateToString = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!selectedAutonomo) {
      showError("Por favor, selecione um autônomo");
      setLoading(false);
      return;
    }

    if (
      days.some(
        (day) =>
          (day.daily && !day.daily_date) || (day.stairs && !day.date_stairs)
      )
    ) {
      showError("Se marcar Diária ou Escada, preencha a data correspondente");
      setLoading(false);
      return;
    }

    try {
      for (const day of days) {
        if (day.daily_date || day.date_stairs) {
          const dadosParaEnviar: DadosHorasAutonomo = {
            autonomo: selectedAutonomo,
            diaria: day.daily,
            data_diaria: day.daily_date
              ? formatDateToString(day.daily_date)
              : "",
            escada: day.stairs,
            data_escada: day.date_stairs
              ? formatDateToString(day.date_stairs)
              : "",
            pagar: day.price,
          };

          console.log("Enviando:", dadosParaEnviar);

          const response = await fetch(`${API_BASE_URL}/dados-autonomo`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(dadosParaEnviar),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Erro ao cadastrar horas");
          }
        }
      }

      showSuccess("Dias cadastrados com sucesso!");
      setSelectedAutonomo("");
      setDays([
        {
          id: 1,
          daily: false,
          daily_date: null,
          stairs: false,
          date_stairs: null,
          price: "",
        },
      ]);
    } catch (error) {
      showError("Erro ao cadastrar os dias");
      console.error("Erro:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-auto">
      <h1
        className="h1 fw-bold text-center w-100 mt-3"
        style={{ color: "#Ec3239" }}
      >
        Cadastro de Diárias de Autônomos
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
              <i className="bi bi-person-fill"></i>
            </InputGroup.Text>
            <Form.Select
              value={selectedAutonomo}
              onChange={(e) => setSelectedAutonomo(e.target.value)}
              disabled={loading}
            >
              <option value="">Digite o nome do Profissional Autônomo</option>
              {autonomos.map((autonomo) => (
                <option key={autonomo._id} value={autonomo._id}>
                  {autonomo.nome}
                </option>
              ))}
            </Form.Select>
          </InputGroup>
        </Form.Group>

        {days.map((day) => (
          <DayRow key={day.id} entry={day} updateEntry={updateDayEntry} />
        ))}

        <div className="d-flex justify-content-center mb-5">
          <Button
            variant="link"
            onClick={handleAddDay}
            className="text-decoration-none text-black d-flex align-items-center"
            disabled={loading}
          >
            <i className="bi bi-plus-square me-2 h4 mt-1"></i>
            Adicionar Mais Diárias
          </Button>
        </div>

        <div className="row mb-3 d-flex flex-col gap-3">
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

export default FreelancerHours;
