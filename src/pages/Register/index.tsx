import type { JSX } from "react";
import ButtonLink from "../../components/Button";

function Register(): JSX.Element {
  return (
    <div className="mx-auto d-flex flex-column">
        <h1 className="h1 fw-bold text-primary text-center">Cadastrar</h1>
        <div className="row">
            <div className="col-6 d-flex flex-column gap-3 px-2">
                <ButtonLink url="/admins">Admins</ButtonLink>
                <ButtonLink url="/funcionarios">Funcionários</ButtonLink>
                <ButtonLink url="/autonomos">Autônomos</ButtonLink>
                <ButtonLink url="/equipes">Equipes</ButtonLink>
            </div>
            <div className="col-6 d-flex flex-column gap-3 px-2">
                <ButtonLink url="/pedidos">Pedidos</ButtonLink>
                <ButtonLink url="/horas">Horas Autônomos</ButtonLink>
                <ButtonLink url="/veiculos">Veículos</ButtonLink>
            </div>
        </div>
    </div>
  )
}

export default Register;