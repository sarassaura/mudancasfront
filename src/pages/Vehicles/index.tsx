import type { JSX } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function Vehicles(): JSX.Element {
  const navigate = useNavigate();
  
  return (
    <div className="mx-auto d-flex flex-column">
        <h1 className="h1 fw-bold text-primary text-center">Cadastro de Veículo</h1>
        <Form style={{ width: "480px", margin: "auto" }}>
          <Form.Group className="mb-3 mx-auto" controlId="formGridAddress1" >
            <Form.Label>Nome</Form.Label>
            <InputGroup>
              <InputGroup.Text>
                <i className="bi bi-car-front-fill"></i>
              </InputGroup.Text>
              <Form.Control placeholder="Digite o nome do Veículo" />
            </InputGroup>
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

export default Vehicles;