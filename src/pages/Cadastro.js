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
import salvar from '../images/salvar.svg';
import deletar from '../images/deletar.svg';
import back from '../images/back.svg';
import novo from '../images/novo.svg';
import modal from '../functions/modal';

function Cadastro() {

  // context.
  const {
    html,
    pagina, setpagina,
    setusuario,
    settoast, setdialogo,
    unidade,
    pacientes, setpacientes,
    paciente, setpaciente,
    atendimentos, setatendimentos,
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
    if (pagina == 2) {
      loadPacientes();
      loadAtendimentos();
    }
    // eslint-disable-next-line
  }, [pagina]);

  // recuperando registros de pacientes cadastrados na aplicação.
  const [arraypacientes, setarraypacientes] = useState([]);
  const loadPacientes = () => {
    axios.get(html + 'list_pacientes').then((response) => {
      setpacientes(response.data.rows);
      setarraypacientes(response.data.rows);
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

  // recuperando registros de pacientes cadastrados na aplicação.
  const loadAtendimentos = () => {
    axios.get(html + 'list_atendimentos/' + unidade).then((response) => {
      setatendimentos(response.data.rows);
    })
      .catch(function () {
        toast(settoast, 'ERRO DE CONEXÃO, REINICIANDO APLICAÇÃO.', 'black', 5000);
        setTimeout(() => {
          setpagina(0);
          history.push('/');
        }, 5000);
      });
  }

  // registrando um novo paciente.
  const insertPaciente = () => {
    var obj = {
      nome_paciente: document.getElementById("inputNovoNomePaciente").value.toUpperCase(),
      nome_mae_paciente: document.getElementById("inputNovoNomeMae").value.toUpperCase(),
      dn_paciente: moment(document.getElementById("inputNovaDn").value, 'DD/MM/YYYY'),
      antecedentes_pessoais: document.getElementById("inputNovoAntecedentesPessoais").value.toUpperCase(),
      medicacoes_previas: document.getElementById("inputNovoMedicacoesPrevias").value.toUpperCase(),
      exames_previos: document.getElementById("inputNovoExamesPrevios").value.toUpperCase(),
    }
    axios.post(html + 'insert_paciente', obj).then(() => {
      loadPacientes();
      setviewnewpaciente(0);
      toast(settoast, 'PACIENTE CADASTRADO COM SUCESSO NA BASE PULSAR', 'rgb(82, 190, 128, 1)', 3000);
    })
      .catch(function () {
        toast(settoast, 'ERRO DE CONEXÃO, REINICIANDO APLICAÇÃO.', 'black', 5000);
        setTimeout(() => {
          setpagina(0);
          history.push('/');
        }, 5000);
      });
  }

  // atualizando um novo paciente.
  const updatePaciente = (id) => {
    var obj = {
      nome_paciente: document.getElementById("inputNomePaciente " + id).value.toUpperCase(),
      nome_mae_paciente: document.getElementById("inputNomeMae " + id).value.toUpperCase(),
      dn_paciente: moment(document.getElementById("inputDn " + id).value, 'DD/MM/YYYY'),
      antecedentes_pessoais: document.getElementById("inputAntecedentesPessoais " + id).value.toUpperCase(),
      medicacoes_previas: document.getElementById("inputMedicacoesPrevias " + id).value.toUpperCase(),
      exames_previos: document.getElementById("inputExamesPrevios " + id).value.toUpperCase(),
    }
    axios.post(html + 'update_paciente/' + id, obj).then(() => {
      loadPacientes();
      toast(settoast, 'PACIENTE ATUALIZADO COM SUCESSO NA BASE PULSAR', 'rgb(82, 190, 128, 1)', 3000);
    })
      .catch(function () {
        toast(settoast, 'ERRO DE CONEXÃO, REINICIANDO APLICAÇÃO.', 'black', 5000);
        setTimeout(() => {
          setpagina(0);
          history.push('/');
        }, 5000);
      });
  }

  // excluir um paciente.
  const deletePaciente = (paciente) => {
    axios.get(html + 'delete_paciente/' + paciente).then(() => {
      loadPacientes();
      toast(settoast, 'PACIENTE EXCLUÍDO COM SUCESSO DA BASE PULSAR', 'rgb(82, 190, 128, 1)', 3000);
      // excluindo todos os registros de atendimentos relativos ao paciente excluído.
      atendimentos.filter(atendimento => atendimento.id_paciente == paciente).map(atendimento => {
        deleteAtendimento(atendimento.id_atendimento);
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          loadAtendimentos();
        }, 1000);
        return null;
      })
    })
      .catch(function () {
        toast(settoast, 'ERRO DE CONEXÃO, REINICIANDO APLICAÇÃO.', 'black', 5000);
        setTimeout(() => {
          setpagina(0);
          history.push('/');
        }, 5000);
      });
  }

  // registrando um novo atendimento.
  const insertAtendimento = (id, nome) => {
    var obj = {
      data_inicio: moment(),
      data_termino: null,
      historia_atual: null,
      id_paciente: id,
      id_unidade: unidade,
      nome_paciente: nome,
      leito: document.getElementById('inputInsertLeito ' + id).value.toUpperCase(),
    }
    axios.post(html + 'insert_atendimento', obj).then(() => {
      loadAtendimentos();
      toast(settoast, 'ATENDIMENTO INICIADO COM SUCESSO', 'rgb(82, 190, 128, 1)', 3000);
    })
      .catch(function () {
        toast(settoast, 'ERRO DE CONEXÃO, REINICIANDO APLICAÇÃO.', 'black', 5000);
        setTimeout(() => {
          setpagina(0);
          history.push('/');
        }, 5000);
      });
  }

  // atualizando um atendimento (mudando de leito).
  const updateAtendimento = (atendimento) => {
    atendimento.map(item => {
      var obj = {
        data_inicio: item.data_inicio,
        data_termino: null,
        problemas: item.problemas,
        id_paciente: item.id_paciente,
        id_unidade: item.id_unidade,
        nome_paciente: item.nome_paciente,
        leito: document.getElementById('inputUpdateLeito ' + item.id_paciente).value.toUpperCase(),
        situacao: item.situacao,
      }
      axios.post(html + 'update_atendimento/' + item.id_atendimento, obj).then(() => {
        loadAtendimentos();
        toast(settoast, 'ATENDIMENTO ATUALIZADO COM SUCESSO NA BASE PULSAR', 'rgb(82, 190, 128, 1)', 3000);
      })
        .catch(function () {
          toast(settoast, 'ERRO DE CONEXÃO, REINICIANDO APLICAÇÃO.', 'black', 5000);
          setTimeout(() => {
            setpagina(0);
            history.push('/');
          }, 5000);
        });
      return null;
    });
  }

  // encerrando um atendimento.
  const closeAtendimento = (atendimento) => {
    atendimento.map(item => {
      var obj = {
        data_inicio: item.data_inicio,
        data_termino: moment(),
        historia_atual: item.historia_atual,
        id_paciente: item.id_paciente,
        id_unidade: item.id_unidade,
        nome_paciente: item.nome_paciente,
        leito: item.leito,
      }
      axios.post(html + 'update_atendimento/' + item.id_atendimento, obj).then(() => {
        loadAtendimentos();
        toast(settoast, 'ATENDIMENTO ENCERRADO COM SUCESSO NA BASE PULSAR', 'rgb(82, 190, 128, 1)', 3000);
      })
        .catch(function () {
          toast(settoast, 'ERRO DE CONEXÃO, REINICIANDO APLICAÇÃO.', 'black', 5000);
          setTimeout(() => {
            setpagina(0);
            history.push('/');
          }, 5000);
        });
      return null;
    });
  }

  // excluir um atendimento.
  const deleteAtendimento = (id) => {
    axios.get(html + 'delete_atendimento/' + id)
      .catch(function () {
        toast(settoast, 'ERRO DE CONEXÃO, REINICIANDO APLICAÇÃO.', 'black', 5000);
        setTimeout(() => {
          setpagina(0);
          history.push('/');
        }, 5000);
      });
  }

  // componente para inserir novo paciente.
  const [viewnewpaciente, setviewnewpaciente] = useState(0);
  const InsertPaciente = useCallback(() => {
    var timeout = null;
    return (
      <div className='fundo'
        style={{ display: viewnewpaciente == 1 ? 'flex' : 'none' }}
        onClick={() => setviewnewpaciente(0)}
      >
        <div className='janela scroll' onClick={(e) => e.stopPropagation()} style={{ height: 0.8 * window.innerHeight }}>
          <div id="cadastrar paciente"
            style={{
              flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap',
              marginRight: window.innerWidth > 425 ? 10 : 0, alignItems: 'center',
            }}>
            <div id="nome do paciente" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div className='text1'>NOME DO PACIENTE</div>
              <input
                autoComplete="off"
                placeholder="NOME DO PACIENTE"
                className="textarea"
                type="text"
                id="inputNovoNomePaciente"
                onFocus={(e) => (e.target.placeholder = '')}
                onBlur={(e) => (e.target.placeholder = 'NOME DO PACIENTE')}
                defaultValue={paciente.nome_paciente}
                style={{
                  flexDirection: 'row', justifyContent: 'center', alignSelf: 'center',
                  width: window.innerWidth > 425 ? '30vw' : '70vw', alignContent: 'center',
                  height: 40, minHeight: 40, maxHeight: 40,
                  borderStyle: 'none',
                  textAlign: 'center',
                }}
              ></input>
            </div>
            <div id="dn paciente" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div className='text1'>DATA DE NASCIMENTO</div>
              <input
                autoComplete="off"
                placeholder="DATA DE NASCIMENTO"
                className="textarea"
                type="text"
                id="inputNovaDn"
                title="FORMATO: DD/MM/YYYY"
                onClick={() => document.getElementById("inputNovaDn").value = ''}
                onFocus={(e) => (e.target.placeholder = '')}
                onBlur={(e) => (e.target.placeholder = 'DATA DE NASCIMENTO')}
                onKeyUp={() => {
                  var x = document.getElementById("inputNovaDn").value;
                  if (x.length == 2) {
                    x = x + '/';
                    document.getElementById("inputNovaDn").value = x;
                  }
                  if (x.length == 5) {
                    x = x + '/'
                    document.getElementById("inputNovaDn").value = x;
                  }
                  clearTimeout(timeout);
                  var date = moment(document.getElementById("inputNovaDn").value, 'DD/MM/YYYY', true);
                  timeout = setTimeout(() => {
                    if (date.isValid() == false) {
                      toast(settoast, 'DATA INVÁLIDA', 'rgb(231, 76, 60, 1)', 3000);
                      document.getElementById("inputNovaDn").value = '';
                    } else {
                      document.getElementById("inputNovaDn").value = moment(date).format('DD/MM/YYYY');
                    }
                  }, 3000);

                }}
                defaultValue={moment(paciente.dn_paciente).format('DD/MM/YYYY')}
                style={{
                  flexDirection: 'row', justifyContent: 'center', alignSelf: 'center',
                  width: window.innerWidth > 425 ? '10vw' : '70vw',
                  height: 40, minHeight: 40, maxHeight: 40,
                  borderStyle: 'none',
                  textAlign: 'center',
                }}
              ></input>
            </div>
            <div id="nome da mae" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div className='text1'>NOME DA MÃE</div>
              <input
                autoComplete="off"
                placeholder="NOME DA MÃE"
                className="textarea"
                type="text"
                id="inputNovoNomeMae"
                onFocus={(e) => (e.target.placeholder = '')}
                onBlur={(e) => (e.target.placeholder = 'NOME DA MÃE')}
                defaultValue={paciente.nome_mae_paciente}
                style={{
                  flexDirection: 'row', justifyContent: 'center', alignSelf: 'center',
                  width: window.innerWidth > 425 ? '30vw' : '70vw', alignContent: 'center',
                  height: 40, minHeight: 40, maxHeight: 40,
                  borderStyle: 'none',
                  textAlign: 'center',
                }}
              ></input>
            </div>
            <div id="antecedentes pessoais" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div className='text1'>ANTECEDENTES PESSOAIS</div>
              <textarea
                className="textarea"
                placeholder='ANTECEDENTES PESSOAIS'
                onFocus={(e) => (e.target.placeholder = '')}
                onBlur={(e) => (e.target.placeholder = 'ANTECEDENTES PESSOAIS')}
                defaultValue={paciente.antecedentes_pessoais}

                style={{
                  display: 'flex',
                  flexDirection: 'center', justifyContent: 'center', alignSelf: 'center',
                  width: window.innerWidth > 425 ? '50vw' : '70vw',
                  whiteSpace: 'pre-wrap'
                }}
                id="inputNovoAntecedentesPessoais"
                title="ANTECEDENTES PESSOAIS."
              >
              </textarea>
            </div>
            <div id="medicações de uso domiciliar" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div className='text1'>MEDICAÇÕES DE USO DOMICILIAR</div>
              <textarea
                className="textarea"
                placeholder='MEDICAÇÕES DE USO DOMICILIAR'
                onFocus={(e) => (e.target.placeholder = '')}
                onBlur={(e) => (e.target.placeholder = 'MEDICAÇÕES DE USO DOMICILIAR')}
                defaultValue={paciente.medicacoes_previas}

                style={{
                  display: 'flex',
                  flexDirection: 'center', justifyContent: 'center', alignSelf: 'center',
                  width: window.innerWidth > 425 ? '50vw' : '70vw',
                  whiteSpace: 'pre-wrap'
                }}
                id="inputNovoMedicacoesPrevias"
                title="MEDICAÇÕES DE USO DOMICILIAR."
              >
              </textarea>
            </div>
            <div id="exames prévios" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div className='text1'>EXAMES PRÉVIOS</div>
              <textarea
                className="textarea"
                placeholder='EXAMES PRÉVIOS'
                onFocus={(e) => (e.target.placeholder = '')}
                onBlur={(e) => (e.target.placeholder = 'EXAMES PRÉVIOS')}
                defaultValue={paciente.exames_previos}

                style={{
                  display: 'flex',
                  flexDirection: 'center', justifyContent: 'center', alignSelf: 'center',
                  width: window.innerWidth > 425 ? '50vw' : '70vw',
                  whiteSpace: 'pre-wrap'
                }}
                id="inputNovoExamesPrevios"
                title="EXAMES PRÉVIOS."
              >
              </textarea>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
              <div id="btnNovoPaciente" title="REGISTRAR PACIENTE" className="button-green"
                onClick={() => {
                  checkinput('textarea', settoast, ['inputNovoNomePaciente', 'inputNovaDn', 'inputNovoNomeMae', 'inputNovoAntecedentesPessoais', 'inputNovoMedicacoesPrevias', 'inputNovoExamesPrevios'], 'btnNovoPaciente', insertPaciente, []);
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
          </div>
        </div>
      </div>
    )
    // eslint-disable-next-line
  }, [viewnewpaciente, paciente, settoast]);

  const [filterpaciente, setfilterpaciente] = useState('');
  var timeout = null;
  var searchpaciente = '';
  const filterPaciente = () => {
    clearTimeout(timeout);
    document.getElementById("inputPaciente").focus();
    searchpaciente = document.getElementById("inputPaciente").value.toUpperCase();
    timeout = setTimeout(() => {
      if (searchpaciente == '') {
        setfilterpaciente('');
        setarraypacientes(pacientes);
        document.getElementById("inputPaciente").value = '';
        setTimeout(() => {
          document.getElementById("inputPaciente").focus();
        }, 100);
      } else {
        setfilterpaciente(document.getElementById("inputPaciente").value.toUpperCase());
        setarraypacientes(pacientes.filter(item => item.nome_paciente.includes(searchpaciente)));
        document.getElementById("inputPaciente").value = searchpaciente;
        setTimeout(() => {
          document.getElementById("inputPaciente").focus();
        }, 100);
      }
    }, 1000);
  }

  // filtro de paciente por nome.
  function FilterPaciente() {
    return (
      <input
        className="input"
        autoComplete="off"
        placeholder="BUSCAR PACIENTE..."
        onFocus={(e) => (e.target.placeholder = '')}
        onBlur={(e) => (e.target.placeholder = 'BUSCAR PACIENTE...')}
        onKeyUp={() => filterPaciente()}
        type="text"
        id="inputPaciente"
        defaultValue={filterpaciente}
        maxLength={100}
        style={{ margin: 0, width: window.innerWidth < 426 ? '100%' : '30vw' }}
      ></input>
    )
  }

  function HeaderListaDePacientes() {
    return (
      <div
        style={{
          display: 'flex', flexDirection: 'row', justifyContent: 'center',
          alignSelf: 'center',
          width: window.innerWidth < 426 ? '90vw' : 'calc(100vw - 40px)',
          maxWidth: window.innerWidth < 426 ? '90vw' : 'calc(100vw - 40px)',
          marginBottom: 10,
        }}>
        <div className='header-row'>
          <div className='header'
            style={{
              flex: window.innerWidth < 426 ? 6 : 2,
            }}>
            NOME DO PACIENTE
          </div>
          <div className='header'
            style={{ display: window.innerWidth > 425 ? 'flex' : 'none', flex: 1 }}>
            DN
          </div>
          <div className='header'
            style={{
              display: window.innerWidth > 425 ? 'flex' : 'none', flex: 2,
            }}>
            NOME DA MÃE
          </div>
          <div className='header'
            style={{
              display: window.innerWidth > 425 ? 'flex' : 'none', flex: 1
            }}>STATUS
          </div>
        </div>
      </div >
    )
  }

  const ListaDePacientes = useCallback(() => {
    return (
      <div className='scroll'
        style={{
          width: window.innerWidth < 426 ? '90vw' : 'calc(100vw - 30px)',
          height: window.innerWidth < 426 ? window.innerHeight - 130 : window.innerHeight - 130,
        }}>
        {arraypacientes.map(item => (
          <div
            key={"paciente " + item.id_paciente}
            style={{
              display: arraypacientes.length > 0 ? 'flex' : 'none',
              flexDirection: 'column', justifyContent: 'center',
            }}>
            <div className='row'
              style={{
                justifyContent: window.innerWidth > 425 ? 'space-between' : 'center',
                flex: 6, margin: 0,
              }}
              onClick={() => {
                setpaciente(item.id_paciente);
                setTimeout(() => {
                  document.getElementById('expandlist ' + item.id_paciente).classList.toggle("expand");
                  document.getElementById('informações do paciente ' + item.id_paciente).classList.toggle("show");
                }, 100);
              }}
            >
              <div className='button'
                style={{
                  flex: window.innerWidth < 426 ? 6 : 2
                }}>
                {item.nome_paciente}
              </div>
              <div className='button'
                style={{ display: window.innerWidth > 425 ? 'flex' : 'none', flex: 1 }}>
                {moment(item.dn_paciente).format('DD/MM/YY')}
              </div>
              <div className='button'
                style={{
                  display: window.innerWidth > 425 ? 'flex' : 'none',
                  flex: 2,
                }}>
                {item.nome_mae_paciente}
              </div>
              <div className={atendimentos.filter(valor => valor.id_paciente == item.id_paciente && valor.data_termino == null && valor.id_unidade == unidade).length > 0 ? 'button-green' : 'button'}
                style={{ display: window.innerWidth > 425 ? 'flex' : 'none', flex: 1 }}>
                {atendimentos.filter(valor => valor.id_paciente == item.id_paciente && valor.data_termino == null && valor.id_unidade == unidade).length > 0 ? 'EM ATENDIMENTO' : 'INICIAR ATENDIMENTO'}
              </div>
            </div>
            {dadosPacienteAtendimento(item, atendimentos.filter(valor => valor.id_paciente == item.id_paciente && valor.data_termino == null))}
          </div>
        ))}
        <div className='text1'
          style={{ display: arraypacientes.length == 0 ? 'flex' : 'none', width: '90vw', opacity: 0.5 }}>
          SEM PACIENTES CADASTRADOS NA APLICAÇÃO
        </div>
      </div>
    )
    // eslint-disable-next-line
  }, [arraypacientes, atendimentos]);

  const dadosPacienteAtendimento = (paciente, atendimento) => {
    return (
      <div id={'expandlist ' + paciente.id_paciente}
        className='retract'
        style={{
          display: 'flex',
          flexDirection: window.innerWidth > 425 ? 'row' : 'column',
          justifyContent: 'center', alignSelf: 'center',
          padding: 0,
        }}>
        <div className="hide" id={"informações do paciente " + paciente.id_paciente}
          style={{
            flexDirection: window.innerWidth > 425 ? 'row' : 'column',
            justifyContent: 'center', alignSelf: 'center'
          }}>
          <div id="dados do paciente"
            style={{
              flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap',
              marginRight: window.innerWidth > 425 ? 10 : 0, alignItems: 'center',
            }}>
            <div id="nome do paciente" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div className='text1'>NOME DO PACIENTE</div>
              <textarea
                autoComplete="off"
                placeholder="NOME DO PACIENTE"
                className="textarea"
                type="text"
                id={"inputNomePaciente " + paciente.id_paciente}
                onFocus={(e) => (e.target.placeholder = '')}
                onBlur={(e) => (e.target.placeholder = 'NOME DO PACIENTE')}
                defaultValue={paciente.nome_paciente}
                style={{
                  flexDirection: 'center', justifyContent: 'center', alignSelf: 'center',
                  width: window.innerWidth > 425 ? '50vw' : '70vw',
                  padding: 15,
                  height: 20, minHeight: 20, maxHeight: 20,
                }}
              ></textarea>
            </div>
            <div id="dn paciente" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div className='text1'>DATA DE NASCIMENTO</div>
              <textarea
                autoComplete="off"
                placeholder="DN"
                className="textarea"
                type="text"
                inputMode='numeric'
                maxLength={10}
                id={"inputDn " + paciente.id_paciente}
                title="FORMATO: DD/MM/YYYY"
                onClick={() => document.getElementById("inputDn " + paciente.id_paciente).value = ''}
                onFocus={(e) => (e.target.placeholder = '')}
                onBlur={(e) => (e.target.placeholder = 'DN')}
                onKeyUp={() => {
                  var x = document.getElementById("inputDn " + paciente.id_paciente).value;
                  if (x.length == 2) {
                    x = x + '/';
                    document.getElementById("inputDn " + paciente.id_paciente).value = x;
                  }
                  if (x.length == 5) {
                    x = x + '/'
                    document.getElementById("inputDn " + paciente.id_paciente).value = x;
                  }
                  clearTimeout(timeout);
                  var date = moment(document.getElementById("inputDn " + paciente.id_paciente).value, 'DD/MM/YYYY', true);
                  timeout = setTimeout(() => {
                    if (date.isValid() == false) {
                      toast(settoast, 'DATA INVÁLIDA', 'rgb(231, 76, 60, 1)', 3000);
                      document.getElementById("inputDn " + paciente.id_paciente).value = '';
                    } else {
                      document.getElementById("inputDn " + paciente.id_paciente).value = moment(date).format('DD/MM/YYYY');
                    }
                  }, 3000);
                }}
                defaultValue={moment(paciente.dn_paciente).format('DD/MM/YYYY')}
                style={{
                  flexDirection: 'center', justifyContent: 'center', alignSelf: 'center',
                  width: window.innerWidth > 425 ? '10vw' : '70vw',
                  textAlign: 'center',
                  padding: 15,
                  height: 20, minHeight: 20, maxHeight: 20,
                }}
              ></textarea>
            </div>
            <div id="nome da mae" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div className='text1'>NOME DA MÃE</div>
              <textarea
                autoComplete="off"
                placeholder="NOME DA MÃE"
                className="textarea"
                type="text"
                id={"inputNomeMae " + paciente.id_paciente}
                onFocus={(e) => (e.target.placeholder = '')}
                onBlur={(e) => (e.target.placeholder = 'NOME DA MÃE')}
                defaultValue={paciente.nome_mae_paciente}
                style={{
                  flexDirection: 'center', justifyContent: 'center', alignSelf: 'center',
                  width: window.innerWidth > 425 ? '50vw' : '70vw',
                  padding: 15,
                  height: 20, minHeight: 20, maxHeight: 20,
                }}
              ></textarea>
            </div>
            <div id="antecedentes pessoais"
              style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div className='text1'>ANTECEDENTES PESSOAIS</div>
              <textarea
                className="textarea"
                placeholder='ANTECEDENTES PESSOAIS'
                onFocus={(e) => (e.target.placeholder = '')}
                onBlur={(e) => (e.target.placeholder = 'ANTECEDENTES PESSOAIS')}
                defaultValue={paciente.antecedentes_pessoais}
                style={{
                  display: 'flex',
                  flexDirection: 'center', justifyContent: 'center', alignSelf: 'center',
                  width: window.innerWidth > 425 ? '50vw' : '70vw',
                  whiteSpace: 'pre-wrap'
                }}
                id={"inputAntecedentesPessoais " + paciente.id_paciente}
                title="ANTECEDENTES PESSOAIS."
              >
              </textarea>
            </div>
            <div id="medicações de uso domiciliar "
              style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div className='text1'>MEDICAÇÕES DE USO DOMICILIAR</div>
              <textarea
                className="textarea"
                placeholder='MEDICAÇÕES DE USO DOMICILIAR'
                onFocus={(e) => (e.target.placeholder = '')}
                onBlur={(e) => (e.target.placeholder = 'MEDICAÇÕES DE USO DOMICILIAR')}
                defaultValue={paciente.medicacoes_previas}
                style={{
                  display: 'flex',
                  flexDirection: 'center', justifyContent: 'center', alignSelf: 'center',
                  width: window.innerWidth > 425 ? '50vw' : '70vw',
                  whiteSpace: 'pre-wrap'
                }}
                id={"inputMedicacoesPrevias " + paciente.id_paciente}
                title="MEDICAÇÕES DE USO DOMICILIAR."
              >
              </textarea>
            </div>
            <div id="exames prévios" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div className='text1'>EXAMES PRÉVIOS</div>
              <textarea
                className="textarea"
                placeholder='EXAMES PRÉVIOS'
                onFocus={(e) => (e.target.placeholder = '')}
                onBlur={(e) => (e.target.placeholder = 'EXAMES PRÉVIOS')}
                defaultValue={paciente.exames_previos}
                style={{
                  display: 'flex',
                  flexDirection: 'center', justifyContent: 'center', alignSelf: 'center',
                  width: window.innerWidth > 425 ? '50vw' : '70vw',
                  whiteSpace: 'pre-wrap'
                }}
                id={"inputExamesPrevios " + paciente.id_paciente}
                title="EXAMES PRÉVIOS."
              >
              </textarea>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
              <div id="btnUpdatePaciente" title="ATUALIZAR DADOS DO PACIENTE" className="button-green"
                onClick={() => {
                  checkinput('textarea', settoast, ['inputNomePaciente ' + paciente.id_paciente, 'inputDn ' + paciente.id_paciente, 'inputNomeMae ' + paciente.id_paciente, 'inputAntecedentesPessoais ' + paciente.id_paciente, 'inputMedicacoesPrevias ' + paciente.id_paciente, 'inputExamesPrevios ' + paciente.id_paciente], 'btnUpdatePaciente', updatePaciente, [paciente.id_paciente]);
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
              <div id="btnDeletePaciente" title="EXCLUIR PACIENTE" className="button-red"
                onClick={() => {
                  modal(setdialogo, 'TEM CERTEZA QUE DESEJA EXCLUIR O REGISTRO DESTE PACIENTE? ESTA AÇÃO É IRREVERSÍVEL.', deletePaciente, paciente.id_paciente);
                }}
                style={{ width: 50, height: 50, alignSelf: 'center' }}
              >
                <img
                  alt=""
                  src={deletar}
                  style={{
                    margin: 10,
                    height: 30,
                    width: 30,
                  }}
                ></img>
              </div>
            </div>
          </div>
          <div id="status de atendimento"
            className='card cor7'
            style={{
              position: window.innerWidth > 425 ? 'sticky' : '', top: 10,
              display: 'flex', flexDirection: 'column', justifyContent: 'center', height: 345,
              marginTop: window.innerWidth > 425 ? 0 : 10, marginBottom: 20,
            }}>
            <div id="paciente sem atendimento ativo"
              style={{
                display: atendimento.length == 0 ? 'flex' : 'none',
                flexDirection: 'column', justifyContent: 'center', height: '50vh',
                width: window.innerWidth < 426 ? '70vw' : '30vw',
                alignSelf: 'center',
              }}>
              <div className="text1">INICIAR ATENDIMENTO</div>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <input
                  autoComplete="off"
                  placeholder="LEITO"
                  className="input"
                  type="text"
                  id={"inputInsertLeito " + paciente.id_paciente}
                  onFocus={(e) => (e.target.placeholder = '')}
                  onBlur={(e) => (e.target.placeholder = 'LEITO')}
                  style={{
                    marginTop: 10,
                    marginBottom: 10,
                    width: '20vw',
                    height: 50,
                    alignSelf: 'center',
                  }}
                ></input>
              </div>
              <div
                id='btn-insert-leito'
                className='button-green'
                title="INICIAR ATENDIMENTO"
                style={{ width: 50, height: 50, alignSelf: 'center' }}
                onClick={() => {
                  var input = document.getElementById("inputInsertLeito " + paciente.id_paciente);
                  if (input.value != '') {
                    input.style.backgroundColor = 'white';
                    input.style.borderColor = 'white';
                    insertAtendimento(paciente.id_paciente, paciente.nome_paciente);
                  } else {
                    input.style.backgroundColor = 'rgb(231, 76, 60, 1)';
                    input.style.borderColor = 'transparent';
                    input.focus();
                    toast(settoast, 'CAMPO LEITO EM BRANCO', 'rgb(231, 76, 60, 1)', 3000);
                  }
                }}
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
            <div id="em atendimento na unidade logada"
              className='card cor5hover'
              style={{
                display: atendimento.length > 0 ? 'flex' : 'none',
                flexDirection: 'column', justifyContent: 'center', height: '50vh',
                width: window.innerWidth < 426 ? '70vw' : '30vw',
                alignSelf: 'center',
              }}>
              <div
                className='text1'
                style={{ margin: 15 }}
              >
                {'PACIENTE ATUALMENTE EM ATENDIMENTO NO LEITO ' + atendimento.map(item => item.leito)}
              </div>
              <div className='text1'>ALTERAR LEITO</div>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignSelf: 'center' }}>
                <input
                  autoComplete="off"
                  placeholder="LEITO"
                  className="input"
                  type="text"
                  id={"inputUpdateLeito " + paciente.id_paciente}
                  onFocus={(e) => (e.target.placeholder = '')}
                  onBlur={(e) => (e.target.placeholder = 'LEITO')}
                  defaultValue={atendimentos.filter(valor => valor.id_paciente == paciente.id_paciente && valor.data_termino == null && valor.id_unidade == unidade).map(item => item.leito)}
                  style={{
                    marginTop: 10,
                    marginBottom: 10,
                    width: '20vw',
                    height: 50,
                  }}
                ></input>
              </div>
              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                <div
                  id="btn-update-leito"
                  className='button-green'
                  title="ATUALIZAR ATENDIMENTO"
                  style={{ width: 50, height: 50, alignSelf: 'center' }}
                  onClick={() => {
                    var input = document.getElementById("inputUpdateLeito " + paciente.id_paciente);
                    if (input.value != '') {
                      input.style.backgroundColor = 'white';
                      input.style.borderColor = 'white';
                      updateAtendimento(atendimento);
                    } else {
                      input.style.backgroundColor = 'rgb(231, 76, 60, 0.3)';
                      input.style.borderColor = 'transparent';
                      input.focus();
                      toast(settoast, 'CAMPO LEITO EM BRANCO', 'rgb(231, 76, 60, 1)', 3000);
                    }
                  }}
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
                <div className='button-red'
                  title="ENCERRAR ATENDIMENTO"
                  style={{ width: 50, height: 50, alignSelf: 'center' }}
                  onClick={() => {
                    modal(setdialogo, 'TEM CERTEZA DE QUE DESEJA ENCERRAR ESTE ATENDIMENTO? ESTA OPERAÇÃO É IRREVERSÍVEL.', closeAtendimento, atendimento);
                  }}
                >
                  <img
                    alt=""
                    src={deletar}
                    style={{
                      margin: 10,
                      height: 30,
                      width: 30,
                    }}
                  ></img>
                </div>
              </div>
            </div>
            <div id="em atendimento em outro serviço"
              className='card cor6hover'
              style={{
                display: atendimento.filter(item => item.id_unidade != unidade).length > 0 ? 'flex' : 'none',
                flexDirection: 'column', justifyContent: 'center', height: '50vh',
                width: window.innerWidth < 426 ? '70vw' : '30vw',
                alignSelf: 'center',
              }}>
              <div
                className='text1'>
                {'PACIENTE COM ATENDIMENTO ATIVO EM OUTRO SERVIÇO:'}
              </div>
              <div>{atendimento.map(item => 'UNIDADE: ' + item.id_unidade + ' LEITO: ' + item.leito)}</div>
              <div className='text1'>ALTERAR LEITO</div>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <input
                  autoComplete="off"
                  placeholder="LEITO"
                  className="input"
                  type="text"
                  id="inputLeito"
                  onFocus={(e) => (e.target.placeholder = '')}
                  onBlur={(e) => (e.target.placeholder = 'LEITO')}
                  defaultValue={atendimentos.filter(valor => valor.id_paciente == paciente.id_paciente && valor.data_termino == null && valor.id_unidade == unidade).map(item => item.leito)}
                  style={{
                    marginTop: 10,
                    marginBottom: 10,
                    width: '20vw',
                    height: 50,
                  }}
                ></input>
              </div>
            </div>
          </div>
        </div>
      </div >
    )
  }

  return (
    <div className='main fadein cor7'
      style={{ display: pagina == 2 ? 'flex' : 'none' }}>
      <div id="cadastro de pacientes e de atendimentos"
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: 'calc(100vw - 20px)',
          // height: window.innerWidth < 426 ? '' : window.innerHeight,
        }}>
        <div id="botões e pesquisa"
          style={{
            display: 'flex', flexDirection: 'row', justifyContent: 'center',
            alignSelf: 'center',
          }}>
          <div className='button-red'
            style={{ margin: 0, marginRight: 10, width: 50, height: 50 }}
            title={'VOLTAR PARA O PASSÔMETRO'}
            onClick={() => { setpagina(1); history.push('/passometro') }}>
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
          <FilterPaciente></FilterPaciente>
          <div className='button-green'
            style={{ margin: 0, marginLeft: 10, width: 50, height: 50 }}
            title={'CADASTRAR PACIENTE'}
            onClick={() => setviewnewpaciente(1)}>
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
        <HeaderListaDePacientes></HeaderListaDePacientes>
        <ListaDePacientes></ListaDePacientes>
        <InsertPaciente></InsertPaciente>
      </div>
    </div>
  );
}

export default Cadastro;