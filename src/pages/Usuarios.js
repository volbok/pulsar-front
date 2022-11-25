/* eslint eqeqeq: "off" */
import React, { useContext, useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import Context from './Context';
import moment from 'moment';
import 'moment/locale/pt-br';
// router.
import { useHistory } from 'react-router-dom';
// funções.
import toast from '../functions/toast';
import checkinput from '../functions/checkinput';
// imagens.
import deletar from '../images/deletar.svg';
import back from '../images/back.svg';
import novo from '../images/novo.svg';
import editar from '../images/editar.svg';
import modal from '../functions/modal';

function Usuarios() {

  // context.
  const {
    html,
    pagina, setpagina,
    setusuario,
    settoast, setdialogo,
    hospital,
    unidade,
    usuario,
  } = useContext(Context);

  // history (router).
  let history = useHistory();

  const refreshApp = () => {
    setusuario(
      {
        id: 0,
        nome_usuario: 'LOGOFF',
        dn_usuario: null,
        cpf_usuario: null,
        email_usuario: null,
      });
    setpagina(0);
    history.push('/');
  }
  window.addEventListener('load', refreshApp);

  useEffect(() => {
    if (pagina == 5) {
      setselectedusuario(0);
      loadUsuarios();
      loadAcessos();
      loadTodosAcessos();
    }
    // eslint-disable-next-line
  }, [pagina]);

  // ## USUÁRIOS ##
  // recuperando registros de usuários cadastrados na aplicação.
  const [usuarios, setusuarios] = useState([]);
  const [arrayusuarios, setarrayusuarios] = useState([]);
  const loadUsuarios = () => {
    axios.get(html + 'list_usuarios').then((response) => {
      setusuarios(response.data.rows);
      setarrayusuarios(response.data.rows);
    })
      .catch(function (error) {
        if (error.response == undefined) {
          toast(settoast, 'ERRO DE CONEXÃO, REINICIANDO APLICAÇÃO.', 'black', 3000);
          setTimeout(() => {
            setpagina(0);
            history.push('/');
          }, 3000);
        } else {
          toast(settoast, error.response.data.message + ' REINICIANDO APLICAÇÃO.', 'black', 3000);
          setTimeout(() => {
            setpagina(0);
            history.push('/');
          }, 3000);
        }
      });
  }

  // registrando um usuário.
  const insertUsuario = () => {
    var cpf = document.getElementById("inputCpf").value.toUpperCase();
    var obj = {
      nome_usuario: document.getElementById("inputNome").value.toUpperCase(),
      dn_usuario: moment(document.getElementById("inputDn").value, 'DD/MM/YYYY'),
      cpf_usuario: cpf,
      email_usuario: document.getElementById("inputContato").value,
      senha: cpf,
      login: cpf,
    }
    if (usuarios.filter(item => item.cpf_usuario == cpf).length < 1) {
      axios.post(html + 'insert_usuario', obj).then(() => {
        loadUsuarios();
        setselectedusuario(0);
        setviewnewusuario(0);
        toast(settoast, 'USUÁRIO CADASTRADO COM SUCESSO NA BASE PULSAR', 'rgb(82, 190, 128, 1)', 3000);
      })
        .catch(function () {
          toast(settoast, 'ERRO DE CONEXÃO, REINICIANDO APLICAÇÃO.', 'black', 5000);
          setTimeout(() => {
            setpagina(0);
            history.push('/');
          }, 5000);
        });
    } else {
      toast(settoast, 'USUÁRIO JÁ CADASTRADO NA BASE PULSAR', 'rgb(231, 76, 60, 1)', 3000);
    }
  }

  // atualizando um usuário.
  const updateUsuario = () => {
    var obj = {
      nome_usuario: document.getElementById("inputNome").value.toUpperCase(),
      dn_usuario: moment(document.getElementById("inputDn").value, 'DD/MM/YYYY'),
      cpf_usuario: document.getElementById("inputCpf").value.toUpperCase(),
      email_usuario: document.getElementById("inputContato").value,
      senha: selectedusuario.senha,
      login: selectedusuario.login
    }
    axios.post(html + 'update_usuario/' + selectedusuario.id_usuario, obj).then(() => {
      loadUsuarios();
      setselectedusuario(0);
      setviewnewusuario(0);
      toast(settoast, 'USUÁRIO ATUALIZADO COM SUCESSO NA BASE PULSAR', 'rgb(82, 190, 128, 1)', 3000);
    })
      .catch(function () {
        toast(settoast, 'ERRO DE CONEXÃO, REINICIANDO APLICAÇÃO.', 'black', 5000);
        setTimeout(() => {
          setpagina(0);
          history.push('/');
        }, 5000);
      });
  }

  // excluir um usuário.
  const deleteUsuario = (usuario) => {
    // excluir somente usuários sem cadastro em outras unidades.
    if (todosacessos.filter(item => item.id_usuario == usuario).length > 1) {
      toast(settoast, 'EXCLUSÃO NEGADA, PACIENTE VINCULADO A OUTRAS UNIDADES DE ATENDIMENTO', 'rgb(231, 76, 60, 1)', 3000);
    } else {
      axios.get(html + 'delete_usuario/' + usuario).then(() => {
        loadUsuarios();
        toast(settoast, 'USUÁRIO EXCLUÍDO COM SUCESSO DA BASE PULSAR', 'rgb(82, 190, 128, 1)', 3000);
      })
        .catch(function () {
          toast(settoast, 'ERRO DE CONEXÃO, REINICIANDO APLICAÇÃO.', 'black', 5000);
          setTimeout(() => {
            setpagina(0);
            history.push('/');
          }, 5000);
        });
    }
  }

  // componente para inserir novo usuário.
  const [viewnewusuario, setviewnewusuario] = useState(0);
  const [selectedusuario, setselectedusuario] = useState(0);
  const InsertUsuario = useCallback(() => {
    var timeout = null;
    return (
      <div className='fundo'
        style={{ display: viewnewusuario == 1 || viewnewusuario == 2 ? 'flex' : 'none' }}
        onClick={() => setviewnewusuario(0)}
      >
        <div className={window.innerWidth < 426 ? 'janela scroll' : 'janela'} onClick={(e) => e.stopPropagation()}>
          <div id="cadastrar usuario"
            style={{
              flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap',
              marginRight: window.innerWidth > 425 ? 10 : 0, alignItems: 'center',
              maxHeight: 0.8 * window.innerHeight,
            }}>
            <div id="nome do usuário" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div className='text1'>NOME DO USUÁRIO</div>
              <input
                autoComplete="off"
                placeholder="NOME DO USUÁRIO"
                className="input"
                type="text"
                id="inputNome"
                onFocus={(e) => (e.target.placeholder = '')}
                onBlur={(e) => (e.target.placeholder = 'NOME DO USUÁRIO')}
                defaultValue={viewnewusuario == 2 ? selectedusuario.nome_usuario : ''}
                style={{
                  flexDirection: 'center', justifyContent: 'center', alignSelf: 'center',
                  width: window.innerWidth > 425 ? '30vw' : '70vw',
                }}
              ></input>
            </div>
            <div id="dn usuário" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div className='text1'>DATA DE NASCIMENTO</div>
              <input
                autoComplete="off"
                placeholder="DN"
                className="input"
                type="text"
                id="inputDn"
                inputMode='numeric'
                onFocus={(e) => (e.target.placeholder = '')}
                onBlur={(e) => (e.target.placeholder = 'DN')}
                onKeyUp={() => {
                  var x = document.getElementById("inputDn").value;
                  if (x.length == 2) {
                    x = x + '/';
                    document.getElementById("inputDn").value = x;
                  }
                  if (x.length == 5) {
                    x = x + '/'
                    document.getElementById("inputDn").value = x;
                  }
                  clearTimeout(timeout);
                  var date = moment(document.getElementById("inputDn").value, 'DD/MM/YYYY', true);
                  timeout = setTimeout(() => {
                    if (date.isValid() == false) {
                      toast(settoast, 'DATA INVÁLIDA', 'rgb(231, 76, 60, 1)', 3000);
                      document.getElementById("inputDn").value = '';
                    } else {
                      document.getElementById("inputDn").value = moment(date).format('DD/MM/YYYY');
                    }
                  }, 3000);
                }}
                defaultValue={viewnewusuario == 2 ? moment(selectedusuario.dn_usuario).format('DD/MM/YYYY') : ''}
                style={{
                  flexDirection: 'center', justifyContent: 'center', alignSelf: 'center',
                  width: window.innerWidth > 425 ? '10vw' : '70vw',
                }}
              ></input>
            </div>
            <div id="dn usuário" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div className='text1'>CONTATO</div>
              <input
                autoComplete="off"
                placeholder="CONTATO"
                className="input"
                type="text"
                id="inputContato"
                onFocus={(e) => (e.target.placeholder = '')}
                onBlur={(e) => (e.target.placeholder = 'CONTATO')}
                defaultValue={viewnewusuario == 2 ? moment(selectedusuario.dn_usuario).format('DD/MM/YY') : ''}
                style={{
                  flexDirection: 'center', justifyContent: 'center', alignSelf: 'center',
                  width: window.innerWidth > 425 ? '30vw' : '70vw',
                }}
              ></input>
            </div>
            <div id="cpf do usuário" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div className='text1'>CPF DO USUÁRIO</div>
              <input
                autoComplete="off"
                placeholder="CPF DO USUÁRIO"
                className="input"
                type="text"
                id="inputCpf"
                onFocus={(e) => (e.target.placeholder = '')}
                onBlur={(e) => (e.target.placeholder = 'CPF DO USUÁRIO')}
                defaultValue={viewnewusuario == 2 ? selectedusuario.cpf_usuario : ''}
                style={{
                  flexDirection: 'center', justifyContent: 'center', alignSelf: 'center',
                  width: window.innerWidth > 425 ? '30vw' : '70vw',
                }}
              ></input>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
              <div className='button-red'
                onClick={(e) => {
                  setviewnewusuario(0); e.stopPropagation();
                }}>
                <img
                  alt=""
                  src={back}
                  style={{
                    margin: 10,
                    height: 25,
                    width: 25,
                  }}
                ></img>
              </div>
              <div className='button-green' id='btnusuario'
                onClick={() => {
                  if (viewnewusuario == 1) {
                    checkinput('input', settoast, ['inputNome', 'inputDn', 'inputContato', 'inputCpf'], 'btnusuario', insertUsuario, []);
                  } else {
                    checkinput('input', settoast, ['inputNome', 'inputDn', 'inputContato', 'inputCpf'], 'btnusuario', updateUsuario, []);
                  }
                }}>
                <img
                  alt=""
                  src={novo}
                  style={{
                    margin: 10,
                    height: 25,
                    width: 25,
                  }}
                ></img>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
    // eslint-disable-next-line
  }, [viewnewusuario]);

  const [filterusuario, setfilterusuario] = useState('');
  var timeout = null;
  var searchusuario = '';
  const filterUsuario = () => {
    clearTimeout(timeout);
    document.getElementById("inputusuario").focus();
    searchusuario = document.getElementById("inputusuario").value.toUpperCase();
    timeout = setTimeout(() => {
      if (searchusuario == '') {
        setfilterusuario('');
        setarrayusuarios(usuarios);
        document.getElementById("inputusuario").value = '';
        setTimeout(() => {
          document.getElementById("inputusuario").focus();
        }, 100);
      } else {
        setfilterusuario(document.getElementById("inputusuario").value.toUpperCase());
        setarrayusuarios(usuarios.filter(item => item.nome_usuario.includes(searchusuario)));
        document.getElementById("inputusuario").value = searchusuario;
        setTimeout(() => {
          document.getElementById("inputusuario").focus();
        }, 100);
      }
    }, 1000);
  }

  // filtro de usuário por nome.
  function FilterUsuario() {
    return (
      <input
        className="input"
        autoComplete="off"
        placeholder="BUSCAR USUÁRIO..."
        onFocus={(e) => (e.target.placeholder = '')}
        onBlur={(e) => (e.target.placeholder = 'BUSCAR USUÁRIO...')}
        onKeyUp={() => filterUsuario()}
        type="text"
        id="inputUsuario"
        defaultValue={filterusuario}
        maxLength={100}
        style={{ margin: 0, width: window.innerWidth < 426 ? '100%' : '100%' }}
      ></input>
    )
  }

  function HeaderListaDeUsuarios() {
    return (
      <div
        style={{
          display: 'flex', flexDirection: 'row', justifyContent: 'center',
          alignSelf: 'center',
          width: window.innerWidth < 426 ? '90vw' : 'calc(40vw - 10px)',
          maxWidth: window.innerWidth < 426 ? '90vw' : 'calc(40vw - 10px)',
        }}>
        <div className='header-row'>
          <div className='header'
            style={{
              flex: window.innerWidth < 426 ? 6 : 2,
            }}>
            NOME
          </div>
        </div>
      </div>
    )
  }

  function ListaDeUsuarios() {
    return (
      <div className='scroll'
        id="scroll usuários"
        style={{
          width: window.innerWidth < 426 ? '90vw' : 'calc(40vw - 10px)',
          maxWidth: window.innerWidth < 426 ? '90vw' : 'calc(40vw - 10px)',
          height: window.innerWidth < 426 ? '50vh' : 'calc(100vh - 80px)',
        }}>
        {arrayusuarios.map(item => (
          <div
            key={"usuario " + item.id_usuario}
            style={{
              display: arrayusuarios.length > 0 ? 'flex' : 'none',
              flexDirection: 'column', justifyContent: 'center',
            }}>
            <div className='row'
              style={{ justifyContent: window.innerWidth > 425 ? 'space-between' : 'center', flex: 6, margin: 0 }}
              onClick={() => {
                setselectedusuario(item);
                setarrayacessos(acessos.filter(valor => valor.id_usuario == item.id_usuario));
                setTimeout(() => {
                  var botoes = document.getElementById("scroll usuários").getElementsByClassName("button-red");
                  for (var i = 0; i < botoes.length; i++) {
                    botoes.item(i).className = "button";
                  }
                  document.getElementById("usuario " + item.id_usuario).className = "button-red";
                }, 100);
              }}
            >
              <div className='button'
                id={"usuario " + item.id_usuario}
                style={{
                  flex: window.innerWidth < 426 ? 6 : 2, justifyContent: 'space-between', paddingLeft: 10
                }}>
                {item.nome_usuario}
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                  <div id='btn-edit' className='button-yellow'
                    style={{ width: 25, minWidth: 25, height: 25, minHeight: 25 }}
                    onClick={() => {
                      setselectedusuario(item);
                      setviewnewusuario(2);
                      setTimeout(() => {
                        var botoes = document.getElementById("scroll usuários").getElementsByClassName("button-red");
                        for (var i = 0; i < botoes.length; i++) {
                          botoes.item(i).className = "button";
                        }
                        document.getElementById("usuario " + item.id_usuario).className = "button-red";
                      }, 500);
                    }}>
                    <img
                      alt=""
                      src={editar}
                      style={{
                        margin: 10,
                        height: 25,
                        width: 25,
                      }}
                    ></img>
                  </div>
                  <div id="btn-delete" className='button-red'
                    style={{
                      display: item.id_usuario == usuario.id ? 'none' : 'flex',
                      width: 25, minWidth: 25, height: 25, minHeight: 25,
                      backgroundColor: 'rgb(231, 76, 60, 1)',
                    }}
                    onClick={() => {
                      modal(setdialogo, 'EXCLUIR O USUÁRIO ' + item.nome_usuario + '?', deleteUsuario, [item.id_usuario])
                    }}>
                    <img
                      alt=""
                      src={deletar}
                      style={{
                        margin: 10,
                        height: 25,
                        width: 25,
                      }}
                    ></img>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))
        }
        <div className='text1'
          style={{ display: arrayusuarios.length == 0 ? 'flex' : 'none', width: '90vw', opacity: 0.5 }}>
          SEM USUÁRIOS CADASTRADOS NA APLICAÇÃO
        </div>
      </div >
    )
    // eslint-disable-next-line
  };

  // ## ACESSOS ##
  // recuperando registros de acessos cadastrados na aplicação, para a unidade logada.
  const [acessos, setacessos] = useState([])
  const [arrayacessos, setarrayacessos] = useState([])
  const loadAcessos = () => {
    axios.get(html + 'list_acessos/' + unidade).then((response) => {
      setacessos(response.data.rows);
    })
      .catch(function () {
        toast(settoast, 'ERRO DE CONEXÃO, REINICIANDO APLICAÇÃO.', 'black', 5000);
        setTimeout(() => {
          setpagina(0);
          history.push('/');
        }, 5000);
      });
  }

  // recuperando todos os acessos da base (necessário para gerenciar a exclusão segura de usuários).
  const [todosacessos, settodosacessos] = useState([])
  const loadTodosAcessos = () => {
    axios.get(html + 'list_todos_acessos').then((response) => {
      settodosacessos(response.data.rows);
    })
      .catch(function () {
        toast(settoast, 'ERRO DE CONEXÃO, REINICIANDO APLICAÇÃO.', 'black', 5000);
        setTimeout(() => {
          setpagina(0);
          history.push('/');
        }, 5000);
      });
  }

  // registrando um acesso.
  const insertAcesso = (boss) => {
    var obj = {
      id_cliente: hospital,
      id_unidade: unidade,
      id_usuario: selectedusuario.id_usuario,
      boss: boss,
    }
    console.log('LOUCURA: ' + selectedusuario.id_usuario);
    axios.post(html + 'insert_acesso', obj).then(() => {
      loadAcessos();
      setselectedusuario(0);
      setviewnewacesso(0);
      toast(settoast, 'ACESSO CADASTRADO COM SUCESSO NA BASE PULSAR', 'rgb(82, 190, 128, 1)', 3000);
    })
      .catch(function () {
        toast(settoast, 'ERRO DE CONEXÃO, REINICIANDO APLICAÇÃO.', 'black', 5000);
        setTimeout(() => {
          setpagina(0);
          history.push('/');
        }, 5000);
      });
  }

  // excluindo um acesso.
  const deleteAcesso = (id) => {
    axios.get(html + 'delete_acesso/' + id).then(() => {
      toast(settoast, 'ACESSO EXCLUIDO COM SUCESSO', 'rgb(82, 190, 128, 1)', 3000);
      loadAcessos();
    })
      .catch(function () {
        toast(settoast, 'ERRO DE CONEXÃO, REINICIANDO APLICAÇÃO.', 'black', 5000);
        setTimeout(() => {
          setpagina(0);
          history.push('/');
        }, 5000);
      });
  }

  const ListaDeAcessos = useCallback(() => {
    return (
      <div
        style={{
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          alignContent: 'center', alignSelf: 'center', alignItems: 'center',
          width: window.innerWidth < 426 ? '90vw' : 'calc(100vw - 30px)',
          height: window.innerWidth < 426 ? 250 : 'calc(100vh - 30px)',
          marginLeft: window.innerWidth < 426 ? 0 : 10
        }}>
        <div id='usuário com acesso' className='text3'
          style={{ display: selectedusuario != 0 && arrayacessos.length > 0 ? 'flex' : 'none', justifyContent: 'center' }}>
          {'USUÁRIO TEM ACESSO À UNIDADE ' + unidade + '.'}
          <div className='button-red'
            style={{
              marginTop: 10,
            }}
            onClick={(e) => {
              if (selectedusuario != 0) {
                deleteAcesso(acessos.filter(valor => valor.id_usuario == selectedusuario.id_usuario).map(item => item.id_acesso));
              }
            }}>
            <img
              alt=""
              src={deletar}
              style={{
                margin: 10,
                height: 25,
                width: 25,
              }}
            ></img>
          </div>
        </div>
        <div id='usuário sem acesso' className='text3'
          style={{ display: selectedusuario != 0 && arrayacessos.length == 0 ? 'flex' : 'none', justifyContent: 'center' }}>
          {'USUÁRIO SEM ACESSO À UNIDADE ' + unidade + '.'}
          <div className='button-green'
            style={{
              marginTop: 10,
            }}
            onClick={() => {
              setviewnewacesso(1);
            }}>
            <img
              alt=""
              src={novo}
              style={{
                margin: 10,
                height: 25,
                width: 25,
              }}
            ></img>
          </div>
        </div>
        <div id='usuário não selecionado' className='text3' style={{
          display: selectedusuario == 0 ? 'flex' : 'none',
          flexDirection: 'column', justifyContent: 'center', alignSelf: 'center',
        }}>
          {'SELECIONE UM USUÁRIO'}
        </div>
      </div>
    )
    // eslint-disable-next-line
  }, [selectedusuario, acessos, arrayacessos]);

  // componente para inserir novo acesso.
  const [viewnewacesso, setviewnewacesso] = useState(0);
  function InsertAcesso() {
    const [boss, setboss] = useState(0);
    return (
      <div className='fundo'
        style={{ display: viewnewacesso == 1 ? 'flex' : 'none' }}
        onClick={() => setviewnewacesso(0)}
      >
        <div className='janela' onClick={(e) => e.stopPropagation()}>
          <div id="cadastrar acesso"
            style={{
              flexDirection: 'column', justifyContent: 'center',
              alignItems: 'center',
            }}>
            <div className='text1'>{selectedusuario != null ? 'AUTORIZAR ' + selectedusuario.nome_usuario + ' PARA ACESSO À UNIDADE ' + unidade : ''}</div>
            <div className={boss == 1 ? 'button-red' : 'button'} style={{ padding: 10 }}
              onClick={() => {
                if (boss == 1) {
                  setboss(0)
                }
                else {
                  setboss(1)
                }
              }}>PRIVILÉGIOS DE ADMINISTRADOR</div>
            <div className='button-green' style={{ padding: 10 }} onClick={() => insertAcesso(boss)}>AUTORIZAR ACESSO</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='main fadein cor7'
      style={{ display: pagina == 5 ? 'flex' : 'none' }}>
      <div id="cadastro de usuários e de acessos"
        style={{
          display: 'flex',
          flexDirection: window.innerWidth < 426 ? 'column' : 'row',
          justifyContent: 'space-between',
          width: 'calc(100vw - 20px)',
          height: window.innerHeight - 20,
        }}>
        <div style={{
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
        }}>
          <div id="botões e pesquisa"
            style={{
              display: 'flex', flexDirection: 'row', justifyContent: 'center',
              alignSelf: 'center',
              width: '100%'
            }}>
            <div className='button-red'
              style={{ margin: 0, marginRight: 10, width: 50, height: 50 }}
              title={'VOLTAR PARA O SETUP'}
              onClick={() => { setpagina(4); history.push('/settings') }}>
              <img
                alt=""
                src={back}
                style={{
                  margin: 0,
                  height: 30,
                  width: 30,
                }}
              ></img>
            </div>
            <FilterUsuario></FilterUsuario>
            <div className='button-green'
              style={{ margin: 0, marginLeft: 10, width: 50, height: 50 }}
              title={'CADASTRAR USUÁRIO'}
              onClick={() => setviewnewusuario(1)}>
              <img
                alt=""
                src={novo}
                style={{
                  margin: 0,
                  height: 30,
                  width: 30,
                }}
              ></img>
            </div>
          </div>
          <HeaderListaDeUsuarios></HeaderListaDeUsuarios>
          <ListaDeUsuarios></ListaDeUsuarios>
        </div>
        <ListaDeAcessos></ListaDeAcessos>
        <InsertUsuario></InsertUsuario>
        <InsertAcesso></InsertAcesso>
      </div>
    </div>
  );
}

export default Usuarios;