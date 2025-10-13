import type { JSX } from "react";
import RequestCard from "../../components/Card";
import { Form, InputGroup, Pagination } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function DeliveryRequests(): JSX.Element {
  const navigate = useNavigate();
  
  return (
    <div className="mx-auto d-flex flex-column">
      <div className="d-flex justify-content-between p-4 mb-3">
        <button 
          onClick={() => navigate('/')}
          style={{
            border: 'none', 
            backgroundColor: 'transparent',
            color: 'black',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <i className="bi bi-arrow-left-circle"></i>
          Voltar
        </button>
        <button
          style={{
            border: 'none', 
            backgroundColor: 'transparent', 
            color: 'black', 
            display: 'flex',
            alignItems: 'center',
            gap: '12px', 
          }}
        >
          <i className="bi bi-download"></i>
          Exportar
        </button>
      </div>

      <div className="px-3">
        <h1 className="h1 fw-bold text-primary text-center mb-4">Pedidos de Mudança</h1>
        <div className="d-flex justify-content-end mb-4">
          <div className="d-flex gap-3">
            <InputGroup style={{ width: '120px' }}>
              <InputGroup.Text>
                <i className="bi bi-calendar-day"></i> 
              </InputGroup.Text>
              <Form.Select>
                <option>Dia</option>
              </Form.Select>
            </InputGroup>

            <InputGroup style={{ width: '130px' }}>
              <InputGroup.Text>
                <i className="bi bi-calendar-month"></i>
              </InputGroup.Text>
              <Form.Select>
                < option>Mês</option>
              </Form.Select>
            </InputGroup>

            <InputGroup style={{ width: '120px' }}>
              <InputGroup.Text>
                <i className="bi bi-calendar-date"></i>
              </InputGroup.Text>
              <Form.Select>
                <option>Ano</option>
              </Form.Select>
            </InputGroup>
          </div>
        </div>
        
        <div className="d-flex flex-wrap justify-content-center gap-4 mb-5">
          <RequestCard 
            team="Vendas"
            startDate="12/03/2025"
            endDate="12/03/2025"
            vehicle="QKR9232"
            description="Some quick example text to build on the card title and make up the bulk of the card's content."
          />
          <RequestCard 
            team="Logística"
            startDate="15/04/2025"
            endDate="18/04/2025"
            vehicle="ABC1A23"
            description="Planejamento de rotas e entrega de materiais sensíveis."
          />
          <RequestCard 
            team="Vendas"
            startDate="12/03/2025"
            endDate="12/03/2025"
            vehicle="QKR9232"
            description="Some quick example text to build on the card title and make up the bulk of the card's content."
          />
          <RequestCard 
            team="Logística"
            startDate="15/04/2025"
            endDate="18/04/2025"
            vehicle="ABC1A23"
            description="Planejamento de rotas e entrega de materiais sensíveis."
          />
        </div>

        <div className="d-flex justify-content-center mb-5">
          <Pagination size="lg"> 
            <Pagination.Prev>Prev</Pagination.Prev>
            <Pagination.Item active>{1}</Pagination.Item>
            <Pagination.Item>{2}</Pagination.Item>
            <Pagination.Item>{3}</Pagination.Item>
            <Pagination.Item>{4}</Pagination.Item>
            <Pagination.Next>Next</Pagination.Next>
          </Pagination>
        </div>
      </div>
    </div>
  )
}

export default DeliveryRequests;