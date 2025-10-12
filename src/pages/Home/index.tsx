import type { JSX } from "react";
import ButtonLink from "../../components/Button";

function Home(): JSX.Element {
  return (
    <div className="mx-auto d-flex flex-column gap-3">
        <ButtonLink url="/cadastrar">Cadastrar</ButtonLink>
        <ButtonLink url="/pedidos-mudanca">Pedidos de Mudança</ButtonLink>
        <ButtonLink url="/premiacoes">Premiações</ButtonLink>
    </div>
  )
}

export default Home;