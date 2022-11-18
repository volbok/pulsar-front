import './App.css';
import './design.css';
// import 'animate.css';
import React, { useState } from 'react';
import Context from './pages/Context';
// páginas.
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import Passometro from './pages/Passometro';
import Settings from './pages/Settings';
import Usuarios from './pages/Usuarios';
import Pdf from './pages/Pdf';
// componentes.
import Toast from './components/Toast';
import Modal from './components/Modal';
import DatePicker from './components/DatePicker';
// router.
import {
  // BrowserRouter as Router, >> pode usar fora do githubPages.
  HashRouter as Router,
  Switch,
  Route,
} from 'react-router-dom'

function App() {
  // api.
  // var html = 'http://localhost:3333/'
  // const html = 'http://10.0.6.3:3333/'
  // const html = 'https://pulsarapi.herokuapp.com/'

  var html = 'https://pulsar-api.up.railway.app/'

  // estados do context.
  const [toast, settoast] = useState({ display: 'none', mensagem: '', cor: 'transparent' });
  const [dialogo, setdialogo] = useState({ id: 0, mensagem: '', funcao: null });

  const [viewdatepicker, setviewdatepicker] = useState(0);
  const [pickdate1, setpickdate1] = useState();
  const [pickdate2, setpickdate2] = useState();

  const [unidades, setunidades] = useState([]);
  const [hospital, sethospital] = useState([]);
  const [unidade, setunidade] = useState([]);
  const [usuario, setusuario] = useState({});

  const [pagina, setpagina] = useState(0);

  // configuração de tema e cards visíveis.
  const [settings, setsettings] = useState([]);
  const [tema, settema] = useState(1);
  const [carddiasinternacao, setcarddiasinternacao] = useState(1);
  const [cardalergias, setcardalergias] = useState(1);
  const [cardanamnese, setcardanamnese] = useState(1);
  const [cardevolucoes, setcardevolucoes] = useState(1);
  const [cardpropostas, setcardpropostas] = useState(1);
  const [cardprecaucoes, setcardprecaucoes] = useState(1);
  const [cardriscos, setcardriscos] = useState(1);
  const [cardalertas, setcardalertas] = useState(1);
  const [cardsinaisvitais, setcardsinaisvitais] = useState(1);
  const [cardbody, setcardbody] = useState(1);
  const [cardvm, setcardvm] = useState(1);
  const [cardinfusoes, setcardinfusoes] = useState(1);
  const [carddieta, setcarddieta] = useState(1);
  const [cardculturas, setcardculturas] = useState(1);
  const [cardatb, setcardatb] = useState(1);
  const [cardinterconsultas, setcardinterconsultas] = useState(1);

  // estado para seleção dos cards do passômetro.
  const [card, setcard] = useState('');

  const [pacientes, setpacientes] = useState([]);
  const [paciente, setpaciente] = useState([]);
  const [atendimentos, setatendimentos] = useState([]);
  const [atendimento, setatendimento] = useState(null);

  const [alergias, setalergias] = useState([]);
  const [lesoes, setlesoes] = useState([]);
  const [precaucoes, setprecaucoes] = useState([]);
  const [riscos, setriscos] = useState([]);
  const [culturas, setculturas] = useState([]);
  const [arrayculturas, setarrayculturas] = useState([]);
  const [antibioticos, setantibioticos] = useState([]);
  const [arrayantibioticos, setarrayantibioticos] = useState([]);
  const [dietas, setdietas] = useState([]);
  const [evolucoes, setevolucoes] = useState([]);
  const [arrayevolucoes, setarrayevolucoes] = useState([]);
  const [infusoes, setinfusoes] = useState([]);
  const [invasoes, setinvasoes] = useState([]);
  const [propostas, setpropostas] = useState([]);
  const [arraypropostas, setarraypropostas] = useState([]);
  const [sinaisvitais, setsinaisvitais] = useState([]);
  const [vm, setvm] = useState([]);
  const [interconsultas, setinterconsultas] = useState([]);

  return (
    <Context.Provider
      value={{
        html,

        toast, settoast,
        dialogo, setdialogo,

        viewdatepicker, setviewdatepicker,
        pickdate1, setpickdate1,
        pickdate2, setpickdate2,

        unidades, setunidades,
        hospital, sethospital,
        unidade, setunidade,
        usuario, setusuario,

        pagina, setpagina,

        settings, setsettings,
        tema, settema,
        carddiasinternacao, setcarddiasinternacao,
        cardalergias, setcardalergias,
        cardanamnese, setcardanamnese,
        cardevolucoes, setcardevolucoes,
        cardpropostas, setcardpropostas,
        cardprecaucoes, setcardprecaucoes,
        cardriscos, setcardriscos,
        cardalertas, setcardalertas,
        cardsinaisvitais, setcardsinaisvitais,
        cardbody, setcardbody,
        cardvm, setcardvm,
        cardinfusoes, setcardinfusoes,
        carddieta, setcarddieta,
        cardculturas, setcardculturas,
        cardatb, setcardatb,
        cardinterconsultas, setcardinterconsultas,

        card, setcard,

        pacientes, setpacientes,
        paciente, setpaciente,
        atendimentos, setatendimentos,
        atendimento, setatendimento,

        alergias, setalergias,
        lesoes, setlesoes,
        precaucoes, setprecaucoes,
        riscos, setriscos,
        culturas, setculturas,
        arrayculturas, setarrayculturas,
        antibioticos, setantibioticos,
        arrayantibioticos, setarrayantibioticos,
        dietas, setdietas,
        evolucoes, setevolucoes,
        arrayevolucoes, setarrayevolucoes,
        infusoes, setinfusoes,
        invasoes, setinvasoes,
        propostas, setpropostas,
        arraypropostas, setarraypropostas,
        sinaisvitais, setsinaisvitais,
        vm, setvm,
        interconsultas, setinterconsultas,
      }}
    >
      <div>
        <Router>
          <Switch>
            <Route exact path="/">
              <Login></Login>
            </Route>
            <Route path="/passometro">
              <Passometro></Passometro>
            </Route>
            <Route path="/pdf">
              <Pdf></Pdf>
            </Route>
            <Route path="/cadastro">
              <Cadastro></Cadastro>
            </Route>
            <Route path="/settings">
              <Settings></Settings>
            </Route>
            <Route path="/usuarios">
              <Usuarios></Usuarios>
            </Route>
          </Switch>
        </Router>
        <Toast></Toast>
        <Modal></Modal>
        <DatePicker></DatePicker>
      </div>
    </Context.Provider>
  );
}

export default App;