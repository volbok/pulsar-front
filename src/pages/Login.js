/* eslint eqeqeq: "off" */
import React, { useCallback, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import Context from './Context';
// funções.
import toast from '../functions/toast';
import checkinput from '../functions/checkinput';
// imagens.
import salvar from '../images/salvar.svg';
// componentes.
import Logo from '../components/Logo';
// router.
import { useHistory } from 'react-router-dom';

function Login() {

  // context.
  const {
    html,
    setsettings,
    pagina, setpagina,
    settoast,
    sethospital,
    setunidade,
    unidades, setunidades,
    setusuario, usuario,
  } = useContext(Context);

  // history (router).
  let history = useHistory();

  useEffect(() => {
    if (pagina == 0) {
      setusuario(
        {
          id: 0,
          nome_usuario: 'LOGOFF',
          dn_usuario: null,
          cpf_usuario: null,
          email_usuario: null,
        });
      setviewlistaunidades(0);
      loadUnidades();
    }
    // eslint-disable-next-line
  }, [pagina]);

  // carregar configurações do usuário logado.
  const loadSettings = (usuario) => {
    axios.get(html + 'settings/' + usuario).then((response) => {
      var x = [];
      x = response.data.rows;
      console.log('TEMA: ' + x.map(item => item.tema));
      changeTema(x.map(item => item.tema));
      setsettings(response.data.rows);
      if (x.length < 1) {
        var obj = {
          id_usuario: usuario,
          tema: 1,
          card_diasinternacao: 1,
          card_alergias: 1,
          card_anamnese: 1,
          card_evolucoes: 1,
          card_propostas: 1,
          card_precaucoes: 1,
          card_riscos: 1,
          card_alertas: 1,
          card_sinaisvitais: 1,
          card_body: 1,
          card_vm: 1,
          card_infusoes: 1,
          card_dieta: 1,
          card_culturas: 1,
          card_antibioticos: 1,
          card_interconsultas: 1
        }
        axios.post(html + 'insert_settings', obj).then(() => {
          toast(settoast, 'CONFIGURAÇÕES PESSOAIS ARMAZENADAS NA BASE PULSAR', 'rgb(82, 190, 128, 1)', 3000);
          axios.get(html + 'settings/' + usuario).then((response) => {
            setsettings(response.data.rows);
          })
            .catch(function (error) {
              console.log(error);
            })
        })
          .catch(function (error) {
            console.log(error);
          })
      }
    })
  }

  // carregando o tema de cores da aplicação.
  // função para seleção de esquemas de cores (temas) da aplicação.
  const changeTema = (tema) => {
    if (tema == 1) { // tema AZUL.
      document.documentElement.style.setProperty('--cor1', 'rgba(64, 74, 131, 0.7)');
      document.documentElement.style.setProperty('--cor1hover', 'rgba(64, 74, 131, 1)');
      document.documentElement.style.setProperty('--cor2', 'rgba(242, 242, 242)');
      document.documentElement.style.setProperty('--cor3', 'rgba(215, 219, 221)');
      document.documentElement.style.setProperty('--texto1', 'rgba(97, 99, 110, 1)');
      document.documentElement.style.setProperty('--texto2', '#ffffff');
      document.documentElement.style.setProperty('--texto3', 'rgba(64, 74, 131, 1)');
      document.documentElement.style.setProperty('--placeholder', 'rgb(97, 99, 110, 0.6)');
      document.documentElement.style.setProperty('--cor0', 'white');
    } else if (tema == 2) { // tema VERDE.
      document.documentElement.style.setProperty('--cor1', 'rgba(26, 188, 156, 0.7)');
      document.documentElement.style.setProperty('--cor1hover', 'rgba(26, 188, 156, 1)');
      document.documentElement.style.setProperty('--cor2', 'rgba(242, 242, 242)');
      document.documentElement.style.setProperty('--cor3', 'rgba(215, 219, 221)');
      document.documentElement.style.setProperty('--texto1', 'rgba(97, 99, 110, 1)');
      document.documentElement.style.setProperty('--texto2', '#ffffff');
      document.documentElement.style.setProperty('--texto3', '#48C9B0');
      document.documentElement.style.setProperty('--placeholder', 'rgb(97, 99, 110, 0.6)');
      document.documentElement.style.setProperty('--cor0', 'white');
    } else { // tema PRETO.
      document.documentElement.style.setProperty('--cor1', '#ABB2B9');
      document.documentElement.style.setProperty('--cor1hover', '#808B96');
      document.documentElement.style.setProperty('--cor2', '#212F3D');
      document.documentElement.style.setProperty('--cor3', '#566573');
      document.documentElement.style.setProperty('--texto1', '#ffffff');
      document.documentElement.style.setProperty('--texto2', '#ffffff');
      document.documentElement.style.setProperty('--texto3', '#ffffff');
      document.documentElement.style.setProperty('--placeholder', 'rgb(255, 255, 255, 0.5)');
      document.documentElement.style.setProperty('--cor0', '#212F3D');
    }
  }

  // recuperando registros de unidades cadastradas na aplicação.
  const loadUnidades = () => {
    axios.get(html + 'list_unidades').then((response) => {
      setunidades(response.data.rows);
    })
      .catch(function (error) {
        console.log(error);
      })
  }

  // recuperando registros de acessos do usuário logado.
  const [acessos, setacessos] = useState([]);
  const loadAcessos = (id_usuario) => {
    var obj = {
      id_usuario: id_usuario
    }
    axios.post(html + 'getunidades', obj,
      /*
      Forma de passar o token pelo header (deve ser repetida em toda endpoint).
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
      */
    ).then((response) => {
      setacessos(response.data.rows);
      setviewlistaunidades(1);
    })
      .catch(function (error) {
        console.log(error);
      })
  }

  // checando se o usuário inserido está registrado no sistema.
  let user = null;
  let password = null;
  var timeout = null;
  const checkLogin = () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      user = document.getElementById('inputUsuario').value
      password = document.getElementById('inputSenha').value
      var obj = {
        usuario: user,
        senha: password,
      }
      axios.post(html + 'checkusuario', obj).then((response) => {
        var x = [];
        x = response.data;
        console.log('RESPONSE: ' + JSON.stringify(x));
        // armazenando o token no localStorage.
        localStorage.setItem("token", x.token);

        // console.log('DADOS DO USUÁRIO: ' + x.nome + ' - ' + x.dn + ' - ' + x.cpf + ' - ' + x.email);
        // adicionando o token ao header.
        setAuthToken(x.token);

        if (x.auth == true) {
          toast(settoast, 'OLÁ, ' + x.nome.split(' ', 1), 'rgb(82, 190, 128, 1)', 3000);
          setusuario(
            {
              id: x.id,
              nome_usuario: x.nome,
              dn_usuario: x.dn,
              cpf_usuario: x.cpf,
              email_usuario: x.email
            }
          );
          // armazenando o context na localStorage.
          localStorage.setItem('usuario', usuario);
          loadAcessos(x.id);
          loadSettings(x.id);

        } else {
          toast(settoast, 'USUÁRIO OU SENHA INCORRETOS', 'rgb(231, 76, 60, 1)', 3000);
        }

      }).catch(function () {
        toast(settoast, 'ERRO DE CONEXÃO, REINICIANDO APLICAÇÃO.', 'black', 5000);
        setTimeout(() => {
          setpagina(0);
          history.push('/');
        }, 5000);
      });
    }, 1000);
  }

  // forma mais inteligente de adicionar o token ao header de todas as requisições.
  const setAuthToken = (token) => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = token;
    }
    else
      delete axios.defaults.headers.common["Authorization"];
  }

  // inputs para login e senha.
  const [viewlistaunidades, setviewlistaunidades] = useState(0);
  const [viewalterarsenha, setviewalterarsenha] = useState(0);
  const Inputs = useCallback(() => {
    return (
      <div style={{
        display: viewlistaunidades == 1 ? 'none' : 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}>
        <input
          autoComplete="off"
          placeholder="USUÁRIO"
          className="input"
          type="text"
          id="inputUsuario"
          onFocus={(e) => (e.target.placeholder = '')}
          onBlur={(e) => (e.target.placeholder = 'USUÁRIO')}
          // eslint-disable-next-line
          onChange={(e) => (user = e.target.value)}
          style={{
            marginTop: 10,
            marginBottom: 10,
            width: 200,
            height: 50,
          }}
        ></input>
        <input
          autoComplete="off"
          placeholder="SENHA"
          className="input"
          type="password"
          id="inputSenha"
          onFocus={(e) => (e.target.placeholder = '')}
          onBlur={(e) => (e.target.placeholder = 'SENHA')}
          // eslint-disable-next-line
          onChange={(e) => { password = e.target.value; checkLogin() }}
          style={{
            marginTop: 10,
            marginBottom: 10,
            width: 200,
            height: 50,
          }}
        ></input>
      </div>
    )
  }, [viewlistaunidades, viewalterarsenha])

  // lista de unidades disponiveis para o usuário logado.
  const ListaDeAcessos = useCallback(() => {
    return (
      <div
        style={{
          display: viewlistaunidades == 1 && viewalterarsenha == 0 ? 'flex' : 'none',
          flexDirection: 'column',
          justifyContent: 'center',
          width: window.innerWidth > 425 ? '45vw' : '80vw',
          marginTop: 20
        }}
      >
        {acessos.map(item => (
          <div
            key={'ACESSO: ' + item.id_acesso}
            className='button' style={{ flex: 1, padding: 10 }}
            onClick={() => {
              sethospital(item.id_cliente);
              setunidade(item.id_unidade);
              setpagina(1);
              history.push('/passometro');
            }}
          >
            {unidades.filter(valor => valor.id_unidade == item.id_unidade).map(valor => valor.nome_cliente + ' - ' + valor.nome_unidade)}
          </div>
        ))}
      </div>
    )
    // eslint-disable-next-line
  }, [viewlistaunidades, viewalterarsenha]);

  // ## TROCA DE SENHA ## //
  // atualizar usuário.
  const updateUsuario = () => {
    let novasenha = document.getElementById("inputNovaSenha").value;
    let repetesenha = document.getElementById("inputConfirmaSenha").value;

    if (novasenha == repetesenha) {
      var obj = {
        nome_usuario: usuario.nome_usuario,
        dn_usuario: usuario.dn_usuario,
        cpf_usuario: usuario.cpf_usuario,
        email_usuario: usuario.email_usuario,
        senha: novasenha,
        login: usuario.cpf_usuario,
      }
      axios.post(html + 'update_usuario/' + usuario.id, obj).then(() => {
        setviewalterarsenha(0);
        toast(settoast, 'SENHA ATUALIZADA COM SUCESSO NA BASE PULSAR', 'rgb(82, 190, 128, 1)', 3000);
      })
        .catch(function () {
          toast(settoast, 'ERRO DE CONEXÃO, REINICIANDO APLICAÇÃO.', 'black', 5000);
          setTimeout(() => {
            setpagina(0);
            history.push('/');
          }, 5000);
        });
    } else {
      document.getElementById("inputNovaSenha").value = '';
      document.getElementById("inputConfirmaSenha").value = '';
      document.getElementById("inputNovaSenha").focus();
      toast(settoast, 'SENHA REPETIDA NÃO CONFERE', 'rgb(231, 76, 60, 1)', 3000);
    }
  }

  // componente para alteração da senha:
  function AlterarSenha() {
    return (
      <div style={{
        display: viewalterarsenha == 1 ? 'flex' : 'none',
        flexDirection: 'column', justifyContent: 'center'
      }}>
        <div className='text3' style={{ color: 'white', fontSize: 16 }}>{usuario.nome_usuario}</div>
        <div className='text1' style={{ color: 'white' }}>DIGITE A NOVA SENHA</div>
        <input
          autoComplete="off"
          placeholder="NOVA SENHA"
          className="input"
          type="password"
          id="inputNovaSenha"
          onFocus={(e) => (e.target.placeholder = '')}
          onBlur={(e) => (e.target.placeholder = 'NOVA SENHA')}
          style={{
            marginTop: 10,
            marginBottom: 10,
            width: 200,
            height: 50,
          }}
        ></input>
        <div className='text1' style={{ color: 'white' }}>CONFIRME A NOVA SENHA</div>
        <input
          autoComplete="off"
          placeholder="REPITA SENHA"
          className="input"
          type="password"
          id="inputConfirmaSenha"
          onFocus={(e) => (e.target.placeholder = '')}
          onBlur={(e) => (e.target.placeholder = 'REPITA SENHA')}
          style={{
            marginTop: 10,
            marginBottom: 10,
            width: 200,
            height: 50,
          }}
        ></input>
        <div id="btnTrocarSenha" title="ALTERAR SENHA" className="button-green"
          onClick={() => {
            checkinput('input', settoast, ['inputNovaSenha', 'inputConfirmaSenha'], 'btnTrocarSenha', updateUsuario, []);
          }}
          style={{ width: 50, height: 50, alignSelf: 'center' }}
        >
          <img
            alt=""
            src={salvar}
            style={{
              margin: 10,
              height: 30,
              width: 30,
            }}
          ></img>
        </div>
      </div>
    )
  }

  return (
    <div className="main cor1"
      style={{
        display: pagina == 0 ? 'flex' : 'none',
        overflowY: 'auto'
      }}>
      <div className="text2"
        style={{
          display: window.innerWidth < 426 && viewalterarsenha == 1 ? 'none' : 'flex',
        }}>
        <Logo height={100} width={100}></Logo>
      </div>
      <div className="text2"
        style={{
          display: window.innerWidth < 426 && viewalterarsenha == 1 ? 'none' : 'flex',
          margin: 20, fontSize: 20
        }}>
        PULSAR
      </div>
      <Inputs></Inputs>
      <ListaDeAcessos></ListaDeAcessos>
      <div className='text1'
        style={{
          display: usuario.id != 0 ? 'flex' : 'none',
          textDecoration: 'underline',
          color: 'white',
          marginTop: window.innerWidth < 426 && viewalterarsenha == 1 ? 20 : 0,
        }}
        onClick={() => {
          if (viewalterarsenha == 1) {
            setviewalterarsenha(0);
          } else {
            setviewalterarsenha(1);
          }
        }}
      >
        ALTERAR SENHA
      </div>
      <AlterarSenha></AlterarSenha>
    </div>
  );
}

export default Login;