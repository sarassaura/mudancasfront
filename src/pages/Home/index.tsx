import { useContext, type JSX } from "react";
import ButtonLink from "../../components/Button";
import UserContext from "../../context/user";

function Home(): JSX.Element {
  const { user } = useContext(UserContext)!;
  return (
    <div className="col-12 col-md-6 col-lg-4 mx-auto d-flex flex-column gap-3">
      <div className="mx-auto d-flex flex-column gap-3 mt-3 mb-3">
        {user?.admin && (
          <>
            <ButtonLink url="/cadastrar">Cadastrar</ButtonLink>
            <ButtonLink url="/gerenciar">Gerenciar</ButtonLink>
          </>
        )}
        <ButtonLink url="/pedidos-mudanca">Pedidos de Mudança</ButtonLink>
        <ButtonLink url="/premiacoes">Premiações</ButtonLink>
        <ButtonLink url="/valor-a-pagar">Valor a Pagar</ButtonLink>
      </div>
    </div>
  )
}

export default Home;