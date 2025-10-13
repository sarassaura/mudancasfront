import { useState, type JSX } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function Requests(): JSX.Element {
  const navigate = useNavigate();
  const [deliveryDate, setDeliveryDate] = useState<Date | null>(null);
  const [takeoutDate, setTakeoutDate] = useState<Date | null>(null);

  return (
    <div className="mx-auto d-flex flex-column">
        <h1 className="h1 fw-bold text-primary text-center">Cadastro de Pedidos</h1>
        <Form style={{ width: "480px", margin: "auto" }}>
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
                />
              </InputGroup>
            </Form.Group>
          </div>

          <Form.Group className="mb-3" controlId="formGridTeam" >
            <Form.Label>Equipe</Form.Label>
            <InputGroup>
              <InputGroup.Text>
                <i className="bi bi-people-fill"></i>
              </InputGroup.Text>
              <Form.Select>
                <option>Digite a equipe do Pedido</option>
              </Form.Select>
            </InputGroup>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formGridVehicle" >
            <Form.Label>Veículo</Form.Label>
            <InputGroup>
              <InputGroup.Text>
                <i className="bi bi-car-front-fill"></i>
              </InputGroup.Text>
              <Form.Select>
                <option>Digite o veículo do Pedido</option>
              </Form.Select>
            </InputGroup>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formGridNotes" >
            <Form.Control as="textarea" placeholder="Informações Adicionais"
            style={{
              width: "480px",
              height: "114px",
              resize: "none",
            }} />
          </Form.Group>

          <div className="row mb-3 d-flex flex-col">
            <Button 
              variant="outline-primary" 
              type="button" 
              className="col-6 mx-auto"
              size="lg" 
              style={{ width: '200px' }} 
              onClick={() => navigate('/cadastrar')}
            >
              Voltar
            </Button>
            <Button 
              variant="primary" 
              type="submit" 
              className="col-6 mx-auto"
              size="lg" 
              style={{ width: '200px' }} 
            >
              Salvar
            </Button>
          </div>
        </Form>
    </div>
  )
}

export default Requests;