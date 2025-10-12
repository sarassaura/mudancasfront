import type { JSX } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";

function Admins(): JSX.Element {
  return (
    <div className="mx-auto d-flex flex-column">
        <h1 className="h1 fw-bold text-primary text-center">Cadastro de Admin</h1>
        <Form style={{ width: "480px" }}>

          <Form.Group className="mb-3" controlId="formGridAddress1" >
            <Form.Label>Nome</Form.Label>
            <InputGroup>
              <InputGroup.Text>
                <i className="bi bi-person-fill"></i>
              </InputGroup.Text>
              <Form.Control placeholder="Digite o nome do Admin" />
            </InputGroup>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formGridAddress1" >
            <Form.Label>Email</Form.Label>
            <InputGroup>
              <InputGroup.Text>
                <i className="bi bi-at"></i>
              </InputGroup.Text>
              <Form.Control placeholder="Digite o email do Admin" />
            </InputGroup>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formGridAddress1" >
            <Form.Label>Senha</Form.Label>
            <InputGroup>
              <InputGroup.Text>
                <i className="bi bi-key-fill"></i>
              </InputGroup.Text>
              <Form.Control placeholder="Digite a senha do Admin" />
            </InputGroup>
          </Form.Group>


          <div className="row mb-3 d-flex flex-col">
            <Button 
              variant="outline-primary" 
              type="submit" 
              className="col-6 mx-auto"
              size="lg" 
              style={{ width: '200px' }} 
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

export default Admins;