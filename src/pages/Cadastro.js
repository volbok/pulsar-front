/* eslint eqeqeq: "off" */
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import Context from "./Context";
import moment from "moment";
import "moment/locale/pt-br";
// router.
import { useHistory } from "react-router-dom";
// funções.
import toast from "../functions/toast";
import checkinput from "../functions/checkinput";
// imagens.
import salvar from "../images/salvar.svg";
import deletar from "../images/deletar.svg";
import back from "../images/back.svg";
import novo from "../images/novo.svg";
import modal from "../functions/modal";

function Cadastro() {
  // context.
  const {
    html,
    pagina,
    setpagina,
    setusuario,
    settoast,
    setdialogo,
    unidade,
    setunidade,
    hospital,
    clientes,
    setclientes,
    unidades,
    pacientes,
    setpacientes,
    paciente,
    setpaciente,
    atendimentos,
    setatendimentos,
  } = useContext(Context);

  // history (router).
  let history = useHistory();

  const refreshApp = () => {
    setusuario({
      id: 0,
      nome_usuario: "LOGOFF",
      dn_usuario: null,
      cpf_usuario: null,
      email_usuario: null,
    });
    setpagina(0);
    history.push("/");
  };
  window.addEventListener("load", refreshApp);

  useEffect(() => {
    if (pagina == 2) {
      loadClientes();
      loadPacientes();
      loadAtendimentos();
    }
    // eslint-disable-next-line
  }, [pagina]);

  // recuperando registros de pacientes cadastrados na aplicação.
  const [arraypacientes, setarraypacientes] = useState([]);
  const loadPacientes = () => {
    axios
      .get(html + "list_pacientes")
      .then((response) => {
        setpacientes(response.data.rows);
        setarraypacientes(response.data.rows);
      })
      .catch(function (error) {
        if (error.response == undefined) {
          toast(
            settoast,
            "ERRO DE CONEXÃO, REINICIANDO APLICAÇÃO.",
            "black",
            3000
          );
          setTimeout(() => {
            setpagina(0);
            history.push("/");
          }, 3000);
        } else {
          toast(
            settoast,
            error.response.data.message + " REINICIANDO APLICAÇÃO.",
            "black",
            3000
          );
          setTimeout(() => {
            setpagina(0);
            history.push("/");
          }, 3000);
        }
      });
  };

  const loadClientes = () => {
    // hospitais.
    axios
      .get(html + "list_hospitais")
      .then((response) => {
        setclientes(response.data.rows);
      })
      .catch(function (error) {
        if (error.response == undefined) {
          toast(
            settoast,
            "ERRO DE CONEXÃO, REINICIANDO APLICAÇÃO.",
            "black",
            3000
          );
          setTimeout(() => {
            setpagina(0);
            history.push("/");
          }, 3000);
        } else {
          toast(
            settoast,
            error.response.data.message + " REINICIANDO APLICAÇÃO.",
            "black",
            3000
          );
          setTimeout(() => {
            setpagina(0);
            history.push("/");
          }, 3000);
        }
      });
  };

  // recuperando registros de pacientes cadastrados na aplicação.
  const loadAtendimentos = () => {
    axios
      .get(html + "allatendimentos/" + hospital)
      .then((response) => {
        setatendimentos(response.data.rows);
      })
      .catch(function () {
        toast(
          settoast,
          "ERRO DE CONEXÃO, REINICIANDO APLICAÇÃO.",
          "black",
          5000
        );
        setTimeout(() => {
          setpagina(0);
          history.push("/");
        }, 5000);
      });
  };

  // registrando um novo paciente.
  const insertPaciente = () => {
    var obj = {
      nome_paciente: document
        .getElementById("inputNovoNomePaciente")
        .value.toUpperCase(),
      nome_mae_paciente: document
        .getElementById("inputNovoNomeMae")
        .value.toUpperCase(),
      dn_paciente: moment(
        document.getElementById("inputNovaDn").value,
        "DD/MM/YYYY"
      ),
      antecedentes_pessoais: document
        .getElementById("inputNovoAntecedentesPessoais")
        .value.toUpperCase(),
      medicacoes_previas: document
        .getElementById("inputNovoMedicacoesPrevias")
        .value.toUpperCase(),
      exames_previos: document
        .getElementById("inputNovoExamesPrevios")
        .value.toUpperCase(),
      exames_atuais: null,
      tipo_documento: document
        .getElementById("inputNovoTipoDocumento")
        .value.toUpperCase(),
      numero_documento: document
        .getElementById("inputNovoNumeroDocumento")
        .value.toUpperCase(),
      endereco: document
        .getElementById("inputNovoEndereco")
        .value.toUpperCase(),
      telefone: document
        .getElementById("inputNovoTelefone")
        .value.toUpperCase(),
      email: document.getElementById("inputNovoEmail").value.toUpperCase(),
    };
    axios
      .post(html + "insert_paciente", obj)
      .then(() => {
        loadPacientes();
        setviewnewpaciente(0);
        toast(
          settoast,
          "PACIENTE CADASTRADO COM SUCESSO NA BASE PULSAR",
          "rgb(82, 190, 128, 1)",
          3000
        );
      })
      .catch(function () {
        toast(
          settoast,
          "ERRO DE CONEXÃO, REINICIANDO APLICAÇÃO.",
          "black",
          5000
        );
        setTimeout(() => {
          setpagina(0);
          history.push("/");
        }, 5000);
      });
  };

  // excluir um paciente.
  const deletePaciente = (paciente) => {
    axios
      .get(html + "delete_paciente/" + paciente)
      .then(() => {
        loadPacientes();
        toast(
          settoast,
          "PACIENTE EXCLUÍDO COM SUCESSO DA BASE PULSAR",
          "rgb(82, 190, 128, 1)",
          3000
        );
        // excluindo todos os registros de atendimentos relativos ao paciente excluído.
        atendimentos
          .filter((atendimento) => atendimento.id_paciente == paciente)
          .map((atendimento) => {
            deleteAtendimento(atendimento.id_atendimento);
            clearTimeout(timeout);
            timeout = setTimeout(() => {
              loadAtendimentos();
            }, 1000);
            return null;
          });
      })
      .catch(function () {
        toast(
          settoast,
          "ERRO DE CONEXÃO, REINICIANDO APLICAÇÃO.",
          "black",
          5000
        );
        setTimeout(() => {
          setpagina(0);
          history.push("/");
        }, 5000);
      });
  };

  // registrando um novo atendimento.
  const insertAtendimento = (id, nome, leito) => {
    var obj = {
      data_inicio: moment(),
      data_termino: null,
      historia_atual: null,
      id_paciente: id,
      id_unidade: unidade,
      nome_paciente: nome,
      leito: leito,
      situacao: 1, // 1 = atendimento ativo; 0 = atendimento encerrado.
      id_cliente: hospital,
    };
    axios
      .post(html + "insert_atendimento", obj)
      .then(() => {
        loadAtendimentos();
        toast(
          settoast,
          "ATENDIMENTO INICIADO COM SUCESSO",
          "rgb(82, 190, 128, 1)",
          3000
        );
      })
      .catch(function () {
        toast(
          settoast,
          "ERRO DE CONEXÃO, REINICIANDO APLICAÇÃO.",
          "black",
          5000
        );
        setTimeout(() => {
          setpagina(0);
          history.push("/");
        }, 5000);
      });
  };

  // atualizando um atendimento (mudando de leito).
  const updateAtendimento = (leito, atendimento) => {
    atendimento.map((item) => {
      var obj = {
        data_inicio: item.data_inicio,
        data_termino: null,
        problemas: item.problemas,
        id_paciente: item.id_paciente,
        id_unidade: item.id_unidade,
        nome_paciente: item.nome_paciente,
        leito: leito,
        situacao: 1,
        id_cliente: hospital,
      };
      axios
        .post(html + "update_atendimento/" + item.id_atendimento, obj)
        .then(() => {
          loadAtendimentos();
          toast(
            settoast,
            "ATENDIMENTO ATUALIZADO COM SUCESSO NA BASE PULSAR",
            "rgb(82, 190, 128, 1)",
            3000
          );
        })
        .catch(function () {
          toast(
            settoast,
            "ERRO DE CONEXÃO, REINICIANDO APLICAÇÃO.",
            "black",
            5000
          );
          setTimeout(() => {
            setpagina(0);
            history.push("/");
          }, 5000);
        });
      return null;
    });
  };

  // encerrando um atendimento.
  const closeAtendimento = (atendimento) => {
    atendimento.map((item) => {
      var obj = {
        data_inicio: item.data_inicio,
        data_termino: moment(),
        historia_atual: item.historia_atual,
        id_paciente: item.id_paciente,
        id_unidade: item.id_unidade,
        nome_paciente: item.nome_paciente,
        leito: item.leito,
        situacao: 0, // 1 = atendimento ativo; 0 = atendimento encerrado.
        id_cliente: hospital,
      };
      axios
        .post(html + "update_atendimento/" + item.id_atendimento, obj)
        .then(() => {
          loadAtendimentos();
          toast(
            settoast,
            "ATENDIMENTO ENCERRADO COM SUCESSO NA BASE PULSAR",
            "rgb(82, 190, 128, 1)",
            3000
          );
        })
        .catch(function () {
          toast(
            settoast,
            "ERRO DE CONEXÃO, REINICIANDO APLICAÇÃO.",
            "black",
            5000
          );
          setTimeout(() => {
            setpagina(0);
            history.push("/");
          }, 5000);
        });
      return null;
    });
  };

  // excluir um atendimento.
  const deleteAtendimento = (id) => {
    axios.get(html + "delete_atendimento/" + id).catch(function () {
      toast(settoast, "ERRO DE CONEXÃO, REINICIANDO APLICAÇÃO.", "black", 5000);
      setTimeout(() => {
        setpagina(0);
        history.push("/");
      }, 5000);
    });
  };

  // componente para inserir novo paciente.
  const [viewnewpaciente, setviewnewpaciente] = useState(0);
  function InsertPaciente() {
    var timeout = null;
    // api para busca do endereço pelo CEP:
    const pegaEndereco = (cep) => {
      var xhr = new XMLHttpRequest();
      xhr.open("GET", "http://cep.la/" + cep, true);
      xhr.setRequestHeader("Accept", "application/json");
      xhr.onreadystatechange = function () {
        if ((xhr.readyState == 0 || xhr.readyState == 4) && xhr.status == 200) {
          let endereco = JSON.parse(xhr.responseText);
          if (endereco.logradouro != undefined) {
            console.log("ENDEREÇO: " + endereco.logradouro);
            document.getElementById("inputNovoEndereco").value =
              endereco.logradouro +
              ", BAIRRO: " +
              endereco.bairro +
              ", " +
              endereco.cidade +
              " - " +
              endereco.uf +
              " - CEP: " +
              endereco.cep;
            document.getElementById("inputNovoCep").value = endereco.cep;
          } else {
            document.getElementById("inputNovoEndereco").value = "";
            document.getElementById("inputNovoCep").value = "CPF";
          }
        }
      };
      xhr.send(null);
    };
    const [viewtipodocumento, setviewtipodocumento] = useState(0);
    function ViewTipoDocumento() {
      let array = ["CPF", "RG", "CERT. NASCTO.", "OUTRO"];
      return (
        <div
          className="fundo"
          style={{ display: viewtipodocumento == 1 ? "flex" : "none" }}
          onClick={() => setviewtipodocumento(0)}
        >
          <div className="janela scroll" onClick={(e) => e.stopPropagation()}>
            {array.map((item) => (
              <div
                className="button"
                style={{ width: 100 }}
                onClick={() => {
                  document.getElementById("inputNovoTipoDocumento").value =
                    item;
                  setviewtipodocumento(0);
                }}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      );
    }
    return (
      <div
        className="fundo"
        style={{ display: viewnewpaciente == 1 ? "flex" : "none" }}
        onClick={() => setviewnewpaciente(0)}
      >
        <div
          className="janela scroll"
          onClick={(e) => e.stopPropagation()}
          style={{ height: 0.8 * window.innerHeight }}
        >
          <div
            id="cadastrar paciente"
            style={{
              flexDirection: "row",
              justifyContent: "center",
              flexWrap: "wrap",
              marginRight: window.innerWidth > 425 ? 10 : 0,
              alignItems: "center",
            }}
          >
            <div
              id="nome do paciente"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <div className="text1">NOME DO PACIENTE</div>
              <input
                autoComplete="off"
                placeholder="NOME DO PACIENTE"
                className="textarea"
                type="text"
                id="inputNovoNomePaciente"
                onFocus={(e) => (e.target.placeholder = "")}
                onBlur={(e) => (e.target.placeholder = "NOME DO PACIENTE")}
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignSelf: "center",
                  width: window.innerWidth > 425 ? "30vw" : "70vw",
                  alignContent: "center",
                  height: 40,
                  minHeight: 40,
                  maxHeight: 40,
                  borderStyle: "none",
                  textAlign: "center",
                }}
              ></input>
            </div>
            <div
              id="dn paciente"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <div className="text1">DATA DE NASCIMENTO</div>
              <input
                autoComplete="off"
                placeholder="DN"
                className="textarea"
                type="text"
                id="inputNovaDn"
                title="FORMATO: DD/MM/YYYY"
                onClick={() =>
                  (document.getElementById("inputNovaDn").value = "")
                }
                onFocus={(e) => (e.target.placeholder = "")}
                onBlur={(e) => (e.target.placeholder = "DN")}
                onKeyUp={() => {
                  var x = document.getElementById("inputNovaDn").value;
                  if (x.length == 2) {
                    x = x + "/";
                    document.getElementById("inputNovaDn").value = x;
                  }
                  if (x.length == 5) {
                    x = x + "/";
                    document.getElementById("inputNovaDn").value = x;
                  }
                  clearTimeout(timeout);
                  var date = moment(
                    document.getElementById("inputNovaDn").value,
                    "DD/MM/YYYY",
                    true
                  );
                  timeout = setTimeout(() => {
                    if (date.isValid() == false) {
                      toast(
                        settoast,
                        "DATA INVÁLIDA",
                        "rgb(231, 76, 60, 1)",
                        3000
                      );
                      document.getElementById("inputNovaDn").value = "";
                    } else {
                      document.getElementById("inputNovaDn").value =
                        moment(date).format("DD/MM/YYYY");
                    }
                  }, 3000);
                }}
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignSelf: "center",
                  width: window.innerWidth > 425 ? "10vw" : "70vw",
                  height: 40,
                  minHeight: 40,
                  maxHeight: 40,
                  borderStyle: "none",
                  textAlign: "center",
                }}
              ></input>
            </div>
            <div
              id="documento"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <div className="text1">DOCUMENTO</div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
              >
                <input
                  autoComplete="off"
                  placeholder="TIPO DE DOC."
                  className="button"
                  type="text"
                  id={"inputNovoTipoDocumento"}
                  onFocus={(e) => (e.target.placeholder = "")}
                  onBlur={(e) => (e.target.placeholder = "TIPO DE DOC.")}
                  onClick={() => setviewtipodocumento(1)}
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignSelf: "center",
                    width: window.innerWidth > 425 ? 130 : "70vw",
                    alignContent: "center",
                    height: 40,
                    minHeight: 40,
                    maxHeight: 40,
                    borderStyle: "none",
                    textAlign: "center",
                    borderColor: "rgba(64, 74, 131, 0.3)",
                  }}
                ></input>
                <textarea
                  autoComplete="off"
                  placeholder="NÚMERO DO DOCUMENTO"
                  className="textarea"
                  type="text"
                  id={"inputNovoNumeroDocumento"}
                  onFocus={(e) => (e.target.placeholder = "")}
                  onBlur={(e) => (e.target.placeholder = "NÚMERO DO DOCUMENTO")}
                  style={{
                    flexDirection: "center",
                    justifyContent: "center",
                    alignSelf: "center",
                    width: window.innerWidth > 425 ? "30vw" : "70vw",
                    padding: 15,
                    height: 20,
                    minHeight: 20,
                    maxHeight: 20,
                  }}
                ></textarea>
              </div>
            </div>
            <div
              id="nome da mae"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <div className="text1">NOME DA MÃE</div>
              <input
                autoComplete="off"
                placeholder="NOME DA MÃE"
                className="textarea"
                type="text"
                id="inputNovoNomeMae"
                onFocus={(e) => (e.target.placeholder = "")}
                onBlur={(e) => (e.target.placeholder = "NOME DA MÃE")}
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignSelf: "center",
                  width: window.innerWidth > 425 ? "30vw" : "70vw",
                  alignContent: "center",
                  height: 40,
                  minHeight: 40,
                  maxHeight: 40,
                  borderStyle: "none",
                  textAlign: "center",
                }}
              ></input>
            </div>
            <div
              id="endereco"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <div className="text1">ENDEREÇO</div>
              <textarea
                autoComplete="off"
                placeholder="BUSCAR CEP..."
                className="textarea"
                type="text"
                id={"inputNovoCep"}
                onFocus={(e) => (e.target.placeholder = "")}
                onBlur={(e) => (e.target.placeholder = "BUSCAR CEP...")}
                style={{
                  flexDirection: "center",
                  justifyContent: "center",
                  alignSelf: "center",
                  width: window.innerWidth > 425 ? 100 : "70vw",
                  padding: 15,
                  height: 20,
                  minHeight: 20,
                  maxHeight: 20,
                }}
                onKeyUp={() => {
                  clearTimeout(timeout);
                  timeout = setTimeout(() => {
                    pegaEndereco(document.getElementById("inputNovoCep").value);
                  }, 2000);
                }}
              ></textarea>
              <textarea
                className="textarea"
                type="text"
                id={"inputNovoEndereco"}
                style={{
                  flexDirection: "center",
                  justifyContent: "center",
                  alignSelf: "center",
                  width: window.innerWidth > 425 ? "50vw" : "70vw",
                  padding: 15,
                  height: 20,
                  minHeight: 20,
                  maxHeight: 20,
                }}
              ></textarea>
            </div>
            <div
              id="telefone"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <div className="text1">TELEFONE</div>
              <textarea
                autoComplete="off"
                placeholder="TELEFONE"
                className="textarea"
                type="text"
                id={"inputNovoTelefone"}
                onFocus={(e) => (e.target.placeholder = "")}
                onBlur={(e) => (e.target.placeholder = "TELEFONE")}
                style={{
                  flexDirection: "center",
                  justifyContent: "center",
                  alignSelf: "center",
                  width: window.innerWidth > 425 ? "50vw" : "70vw",
                  padding: 15,
                  height: 20,
                  minHeight: 20,
                  maxHeight: 20,
                }}
              ></textarea>
            </div>
            <div
              id="email"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <div className="text1">EMAIL</div>
              <textarea
                autoComplete="off"
                placeholder="EMAIL"
                className="textarea"
                type="text"
                id={"inputNovoEmail"}
                onFocus={(e) => (e.target.placeholder = "")}
                onBlur={(e) => (e.target.placeholder = "EMAIL")}
                style={{
                  flexDirection: "center",
                  justifyContent: "center",
                  alignSelf: "center",
                  width: window.innerWidth > 425 ? "50vw" : "70vw",
                  padding: 15,
                  height: 20,
                  minHeight: 20,
                  maxHeight: 20,
                }}
              ></textarea>
            </div>
            <div
              id="antecedentes pessoais"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <div className="text1">ANTECEDENTES PESSOAIS</div>
              <textarea
                className="textarea"
                placeholder="ANTECEDENTES PESSOAIS"
                onFocus={(e) => (e.target.placeholder = "")}
                onBlur={(e) => (e.target.placeholder = "ANTECEDENTES PESSOAIS")}
                style={{
                  display: "flex",
                  flexDirection: "center",
                  justifyContent: "center",
                  alignSelf: "center",
                  width: window.innerWidth > 425 ? "50vw" : "70vw",
                  whiteSpace: "pre-wrap",
                }}
                id="inputNovoAntecedentesPessoais"
                title="ANTECEDENTES PESSOAIS."
              ></textarea>
            </div>
            <div
              id="medicações de uso domiciliar"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <div className="text1">MEDICAÇÕES DE USO DOMICILIAR</div>
              <textarea
                className="textarea"
                placeholder="MEDICAÇÕES DE USO DOMICILIAR"
                onFocus={(e) => (e.target.placeholder = "")}
                onBlur={(e) =>
                  (e.target.placeholder = "MEDICAÇÕES DE USO DOMICILIAR")
                }
                style={{
                  display: "flex",
                  flexDirection: "center",
                  justifyContent: "center",
                  alignSelf: "center",
                  width: window.innerWidth > 425 ? "50vw" : "70vw",
                  whiteSpace: "pre-wrap",
                }}
                id="inputNovoMedicacoesPrevias"
                title="MEDICAÇÕES DE USO DOMICILIAR."
              ></textarea>
            </div>
            <div
              id="exames prévios"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <div className="text1">EXAMES PRÉVIOS</div>
              <textarea
                className="textarea"
                placeholder="EXAMES PRÉVIOS"
                onFocus={(e) => (e.target.placeholder = "")}
                onBlur={(e) => (e.target.placeholder = "EXAMES PRÉVIOS")}
                style={{
                  display: "flex",
                  flexDirection: "center",
                  justifyContent: "center",
                  alignSelf: "center",
                  width: window.innerWidth > 425 ? "50vw" : "70vw",
                  whiteSpace: "pre-wrap",
                }}
                id="inputNovoExamesPrevios"
                title="EXAMES PRÉVIOS."
              ></textarea>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              <div
                id="btnNovoPaciente"
                title="REGISTRAR PACIENTE"
                className="button-green"
                onClick={() => {
                  checkinput(
                    "textarea",
                    settoast,
                    [
                      "inputNovoNomePaciente",
                      "inputNovaDn",
                      "inputNovoNomeMae",
                      "inputNovoAntecedentesPessoais",
                      "inputNovoMedicacoesPrevias",
                      "inputNovoExamesPrevios",
                      "inputNovoTipoDocumento",
                      "inputNovoNumeroDocumento",
                      "inputNovoEndereco",
                      "inputNovoTelefone",
                      "inputNovoEmail",
                    ],
                    "btnNovoPaciente",
                    insertPaciente,
                    []
                  );
                }}
                style={{ width: 50, height: 50, alignSelf: "center" }}
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
        <ViewTipoDocumento></ViewTipoDocumento>
      </div>
    );
  }

  const [filterpaciente, setfilterpaciente] = useState("");
  var timeout = null;
  var searchpaciente = "";
  const filterPaciente = () => {
    clearTimeout(timeout);
    document.getElementById("inputPaciente").focus();
    searchpaciente = document
      .getElementById("inputPaciente")
      .value.toUpperCase();
    timeout = setTimeout(() => {
      if (searchpaciente == "") {
        setfilterpaciente("");
        setarraypacientes(pacientes);
        document.getElementById("inputPaciente").value = "";
        setTimeout(() => {
          document.getElementById("inputPaciente").focus();
        }, 100);
      } else {
        setfilterpaciente(
          document.getElementById("inputPaciente").value.toUpperCase()
        );
        setarraypacientes(
          pacientes.filter((item) =>
            item.nome_paciente.includes(searchpaciente)
          )
        );
        document.getElementById("inputPaciente").value = searchpaciente;
        setTimeout(() => {
          document.getElementById("inputPaciente").focus();
        }, 100);
      }
    }, 1000);
  };

  // filtro de paciente por nome.
  function FilterPaciente() {
    return (
      <input
        className="input"
        autoComplete="off"
        placeholder="BUSCAR PACIENTE..."
        onFocus={(e) => (e.target.placeholder = "")}
        onBlur={(e) => (e.target.placeholder = "BUSCAR PACIENTE...")}
        onKeyUp={() => filterPaciente()}
        type="text"
        id="inputPaciente"
        defaultValue={filterpaciente}
        maxLength={100}
        style={{ margin: 0, width: window.innerWidth < 426 ? "100%" : "30vw" }}
      ></input>
    );
  }

  function HeaderListaDePacientes() {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignSelf: "center",
          width: window.innerWidth < 426 ? "90vw" : "calc(100vw - 40px)",
          maxWidth: window.innerWidth < 426 ? "90vw" : "calc(100vw - 40px)",
          marginBottom: 10,
        }}
      >
        <div className="header-row">
          <div
            className="header"
            style={{
              flex: window.innerWidth < 426 ? 6 : 2,
            }}
          >
            NOME DO PACIENTE
          </div>
          <div
            className="header"
            style={{
              display: window.innerWidth > 425 ? "flex" : "none",
              flex: 1,
            }}
          >
            DN
          </div>
          <div
            className="header"
            style={{
              display: window.innerWidth > 425 ? "flex" : "none",
              flex: 2,
            }}
          >
            NOME DA MÃE
          </div>
          <div
            className="header"
            style={{
              display: window.innerWidth > 425 ? "flex" : "none",
              flex: 1,
            }}
          >
            STATUS
          </div>
        </div>
      </div>
    );
  }

  function ListaDePacientes() {
    return (
      <div
        className="scroll"
        style={{
          width: window.innerWidth < 426 ? "90vw" : "calc(100vw - 30px)",
          height:
            window.innerWidth < 426
              ? window.innerHeight - 130
              : window.innerHeight - 130,
        }}
      >
        {arraypacientes.map((item) => (
          <div
            key={"paciente " + item.id_paciente}
            style={{
              display: arraypacientes.length > 0 ? "flex" : "none",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <div
              className="row"
              style={{
                justifyContent:
                  window.innerWidth > 425 ? "space-between" : "center",
                flex: 6,
                margin: 0,
              }}
              onClick={() => {
                setpaciente(item);
                setTimeout(() => {
                  document
                    .getElementById("expandlist " + item.id_paciente)
                    .classList.toggle("expand");
                  document
                    .getElementById(
                      "informações do paciente " + item.id_paciente
                    )
                    .classList.toggle("show");
                }, 100);
              }}
            >
              <div
                className="button"
                style={{
                  flex: window.innerWidth < 426 ? 6 : 2,
                }}
              >
                {item.nome_paciente}
              </div>
              <div
                className="button"
                style={{
                  display: window.innerWidth > 425 ? "flex" : "none",
                  flex: 1,
                }}
              >
                {moment(item.dn_paciente).format("DD/MM/YY")}
              </div>
              <div
                className="button"
                style={{
                  display: window.innerWidth > 425 ? "flex" : "none",
                  flex: 2,
                }}
              >
                {item.nome_mae_paciente}
              </div>
              <div
                className={
                  atendimentos.filter(
                    (valor) =>
                      valor.id_paciente == item.id_paciente &&
                      valor.data_termino == null &&
                      valor.id_unidade == unidade
                  ).length > 0
                    ? "button-green"
                    : "button"
                }
                style={{
                  display: window.innerWidth > 425 ? "flex" : "none",
                  flex: 1,
                }}
              >
                {atendimentos.filter(
                  (valor) =>
                    valor.id_paciente == item.id_paciente &&
                    valor.data_termino == null &&
                    valor.id_unidade == unidade
                ).length > 0
                  ? "EM ATENDIMENTO"
                  : "INICIAR ATENDIMENTO"}
              </div>
            </div>
            {DadosPacienteAtendimento(
              item,
              atendimentos.filter(
                (valor) =>
                  valor.id_paciente == item.id_paciente &&
                  valor.data_termino == null
              )
            )}
          </div>
        ))}
        <div
          className="text1"
          style={{
            display: arraypacientes.length == 0 ? "flex" : "none",
            width: "90vw",
            opacity: 0.5,
          }}
        >
          SEM PACIENTES CADASTRADOS NA APLICAÇÃO
        </div>
      </div>
    );
  }

  function DadosPacienteAtendimento(paciente, atendimento) {
    // api para busca do endereço pelo CEP:
    const pegaEndereco = (cep) => {
      var xhr = new XMLHttpRequest();
      xhr.open("GET", "http://cep.la/" + cep, true);
      xhr.setRequestHeader("Accept", "application/json");
      xhr.onreadystatechange = function () {
        if ((xhr.readyState == 0 || xhr.readyState == 4) && xhr.status == 200) {
          let endereco = JSON.parse(xhr.responseText);
          if (endereco.logradouro != undefined) {
            console.log("ENDEREÇO: " + endereco.logradouro);
            document.getElementById(
              "inputEndereco " + paciente.id_paciente
            ).value =
              endereco.logradouro +
              ", BAIRRO: " +
              endereco.bairro +
              ", " +
              endereco.cidade +
              " - " +
              endereco.uf +
              " - CEP: " +
              endereco.cep;
            document.getElementById("inputCep " + paciente.id_paciente).value =
              endereco.cep;
          } else {
            document.getElementById(
              "inputEndereco " + paciente.id_paciente
            ).value = "";
            document.getElementById("inputCep " + paciente.id_paciente).value =
              "CPF";
          }
        }
      };
      xhr.send(null);
    };
    const [viewtipodocumento, setviewtipodocumento] = useState(0);
    function ViewTipoDocumento() {
      let array = ["CPF", "RG", "CERT. NASCTO.", "OUTRO"];
      return (
        <div
          className="fundo"
          style={{ display: viewtipodocumento == 1 ? "flex" : "none" }}
          onClick={() => setviewtipodocumento(0)}
        >
          <div className="janela scroll" onClick={(e) => e.stopPropagation()}>
            {array.map((item) => (
              <div
                className="button"
                style={{ width: 100 }}
                onClick={() => {
                  document.getElementById(
                    "inputTipoDocumento " + paciente.id_paciente
                  ).value = item;
                  setviewtipodocumento(0);
                }}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      );
    }
    var timeout = null;
    // atualizando um novo paciente.
    const updatePaciente = (id) => {
      var obj = {
        nome_paciente: document
          .getElementById("inputNomePaciente " + id)
          .value.toUpperCase(),
        nome_mae_paciente: document
          .getElementById("inputNomeMae " + id)
          .value.toUpperCase(),
        dn_paciente: moment(
          document.getElementById("inputDn " + id).value,
          "DD/MM/YYYY"
        ),
        antecedentes_pessoais: document
          .getElementById("inputAntecedentesPessoais " + id)
          .value.toUpperCase(),
        medicacoes_previas: document
          .getElementById("inputMedicacoesPrevias " + id)
          .value.toUpperCase(),
        exames_previos: document
          .getElementById("inputExamesPrevios " + id)
          .value.toUpperCase(),
        exames_atuais: document
          .getElementById("inputExamesAtuais " + id)
          .value.toUpperCase(),
        tipo_documento: document
          .getElementById("inputTipoDocumento " + id)
          .value.toUpperCase(),
        numero_documento: document
          .getElementById("inputNumeroDocumento " + id)
          .value.toUpperCase(),
        endereco: document
          .getElementById("inputEndereco " + id)
          .value.toUpperCase(),
        telefone: document
          .getElementById("inputTelefone " + id)
          .value.toUpperCase(),
        email: document.getElementById("inputEmail " + id).value.toUpperCase(),
      };
      console.log(obj);
      axios
        .post(html + "update_paciente/" + id, obj)
        .then(() => {
          loadPacientes();
          toast(
            settoast,
            "PACIENTE ATUALIZADO COM SUCESSO NA BASE PULSAR",
            "rgb(82, 190, 128, 1)",
            3000
          );
        })
        .catch(function () {
          toast(
            settoast,
            "ERRO DE CONEXÃO, REINICIANDO APLICAÇÃO.",
            "black",
            5000
          );
          setTimeout(() => {
            setpagina(0);
            history.push("/");
          }, 5000);
        });
    };
    const toastypacientes = (settoast, mensagem, cor, duracao) => {
      settoast({ display: "flex", mensagem: mensagem, cor: cor });
      setTimeout(() => {
        settoast({ display: "none", mensagem: "", cor: "transparent" });
      }, duracao);
    };
    const [toastpacientes, settoastpacientes] = useState(0);
    function ToastPacientes() {
      return (
        <div
          style={{
            display: toastpacientes.display,
            zIndex: 999,
            position: "fixed",
            bottom: window.innerWidth > 426 ? 20 : "",
            top: window.innerWidth > 426 ? "" : 20,
            left: window.innerWidth > 426 ? "" : 20,
            right: window.innerWidth > 426 ? 20 : 20,
            flexDirection: "column",
            justifyContent: "center",
            alignContent: "center",
            alignItems: "center",
          }}
        >
          <div
            className="toasty"
            style={{
              display: "flex",
              alignItems: "center",
              textAlign: "center",
              backgroundColor: toastpacientes.cor,
              padding: 10,
              minHeight: 50,
              maxHeight: 300,
              minWidth: 100,
              maxWidth: 300,
              color: "#ffffff",
              fontWeight: "bold",
              fontSize: 14,
              borderRadius: 5,
            }}
          >
            {toastpacientes.mensagem}
          </div>
        </div>
      );
    }
    return (
      <div
        id={"expandlist " + paciente.id_paciente}
        className="retract"
        style={{
          display: "flex",
          flexDirection: window.innerWidth > 425 ? "row" : "column",
          justifyContent: "flex-start",
          alignSelf: "center",
          padding: 0,
        }}
      >
        <div
          className="hide"
          id={"informações do paciente " + paciente.id_paciente}
          style={{
            flexDirection: window.innerWidth > 425 ? "row" : "column",
            justifyContent: "center",
            alignSelf: "center",
          }}
        >
          <div
            id="dados do paciente"
            style={{
              flexDirection: "row",
              justifyContent: "center",
              flexWrap: "wrap",
              marginRight: window.innerWidth > 425 ? 10 : 0,
              alignItems: "center",
            }}
          >
            <div
              id="nome do paciente"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <div className="text1">NOME DO PACIENTE</div>
              <textarea
                autoComplete="off"
                placeholder="NOME DO PACIENTE"
                className="textarea"
                type="text"
                id={"inputNomePaciente " + paciente.id_paciente}
                onFocus={(e) => (e.target.placeholder = "")}
                onBlur={(e) => (e.target.placeholder = "NOME DO PACIENTE")}
                defaultValue={paciente.nome_paciente}
                style={{
                  flexDirection: "center",
                  justifyContent: "center",
                  alignSelf: "center",
                  width: window.innerWidth > 425 ? "50vw" : "70vw",
                  padding: 15,
                  height: 20,
                  minHeight: 20,
                  maxHeight: 20,
                }}
              ></textarea>
            </div>
            <div
              id="dn paciente"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <div className="text1">DATA DE NASCIMENTO</div>
              <textarea
                autoComplete="off"
                placeholder="DN"
                className="textarea"
                type="text"
                inputMode="numeric"
                maxLength={10}
                id={"inputDn " + paciente.id_paciente}
                title="FORMATO: DD/MM/YYYY"
                onClick={() =>
                  (document.getElementById(
                    "inputDn " + paciente.id_paciente
                  ).value = "")
                }
                onFocus={(e) => (e.target.placeholder = "")}
                onBlur={(e) => (e.target.placeholder = "DN")}
                onKeyUp={() => {
                  var x = document.getElementById(
                    "inputDn " + paciente.id_paciente
                  ).value;
                  if (x.length == 2) {
                    x = x + "/";
                    document.getElementById(
                      "inputDn " + paciente.id_paciente
                    ).value = x;
                  }
                  if (x.length == 5) {
                    x = x + "/";
                    document.getElementById(
                      "inputDn " + paciente.id_paciente
                    ).value = x;
                  }
                  clearTimeout(timeout);
                  var date = moment(
                    document.getElementById("inputDn " + paciente.id_paciente)
                      .value,
                    "DD/MM/YYYY",
                    true
                  );
                  timeout = setTimeout(() => {
                    if (date.isValid() == false) {
                      toast(
                        settoast,
                        "DATA INVÁLIDA",
                        "rgb(231, 76, 60, 1)",
                        3000
                      );
                      document.getElementById(
                        "inputDn " + paciente.id_paciente
                      ).value = "";
                    } else {
                      document.getElementById(
                        "inputDn " + paciente.id_paciente
                      ).value = moment(date).format("DD/MM/YYYY");
                    }
                  }, 3000);
                }}
                defaultValue={moment(paciente.dn_paciente).format("DD/MM/YYYY")}
                style={{
                  flexDirection: "center",
                  justifyContent: "center",
                  alignSelf: "center",
                  width: window.innerWidth > 425 ? "10vw" : "70vw",
                  textAlign: "center",
                  padding: 15,
                  height: 20,
                  minHeight: 20,
                  maxHeight: 20,
                }}
              ></textarea>
            </div>
            <div
              id="documento"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <div className="text1">DOCUMENTO</div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
              >
                <input
                  autoComplete="off"
                  placeholder="TIPO DE DOC."
                  className="button"
                  type="text"
                  id={"inputTipoDocumento " + paciente.id_paciente}
                  defaultValue={paciente.tipo_documento}
                  onFocus={(e) => (e.target.placeholder = "")}
                  onBlur={(e) => (e.target.placeholder = "TIPO DE DOC.")}
                  onClick={() => setviewtipodocumento(1)}
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignSelf: "center",
                    width: window.innerWidth > 425 ? 130 : "70vw",
                    alignContent: "center",
                    height: 40,
                    minHeight: 40,
                    maxHeight: 40,
                    borderStyle: "none",
                    textAlign: "center",
                  }}
                ></input>
                <textarea
                  autoComplete="off"
                  placeholder="NÚMERO DO DOCUMENTO"
                  className="textarea"
                  type="text"
                  id={"inputNumeroDocumento " + paciente.id_paciente}
                  onFocus={(e) => (e.target.placeholder = "")}
                  onBlur={(e) => (e.target.placeholder = "NÚMERO DO DOCUMENTO")}
                  defaultValue={paciente.numero_documento}
                  style={{
                    flexDirection: "center",
                    justifyContent: "center",
                    alignSelf: "center",
                    width: window.innerWidth > 425 ? "30vw" : "70vw",
                    padding: 15,
                    height: 20,
                    minHeight: 20,
                    maxHeight: 20,
                  }}
                ></textarea>
              </div>
            </div>
            <div
              id="nome da mae"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <div className="text1">NOME DA MÃE</div>
              <textarea
                autoComplete="off"
                placeholder="NOME DA MÃE"
                className="textarea"
                type="text"
                id={"inputNomeMae " + paciente.id_paciente}
                onFocus={(e) => (e.target.placeholder = "")}
                onBlur={(e) => (e.target.placeholder = "NOME DA MÃE")}
                defaultValue={paciente.nome_mae_paciente}
                style={{
                  flexDirection: "center",
                  justifyContent: "center",
                  alignSelf: "center",
                  width: window.innerWidth > 425 ? "50vw" : "70vw",
                  padding: 15,
                  height: 20,
                  minHeight: 20,
                  maxHeight: 20,
                }}
              ></textarea>
            </div>
            <div
              id="endereco"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <div className="text1">ENDEREÇO</div>
              <textarea
                autoComplete="off"
                placeholder="BUSCAR CEP..."
                className="textarea"
                type="text"
                id={"inputCep " + paciente.id_paciente}
                onFocus={(e) => (e.target.placeholder = "")}
                onBlur={(e) => (e.target.placeholder = "BUSCAR CEP...")}
                style={{
                  flexDirection: "center",
                  justifyContent: "center",
                  alignSelf: "center",
                  width: window.innerWidth > 425 ? 100 : "70vw",
                  padding: 15,
                  height: 20,
                  minHeight: 20,
                  maxHeight: 20,
                }}
                onKeyUp={() => {
                  clearTimeout(timeout);
                  timeout = setTimeout(() => {
                    pegaEndereco(
                      document.getElementById(
                        "inputCep " + paciente.id_paciente
                      ).value
                    );
                  }, 2000);
                }}
              ></textarea>
              <textarea
                className="textarea"
                type="text"
                id={"inputEndereco " + paciente.id_paciente}
                defaultValue={paciente.endereco}
                style={{
                  flexDirection: "center",
                  justifyContent: "center",
                  alignSelf: "center",
                  width: window.innerWidth > 425 ? "50vw" : "70vw",
                  padding: 15,
                  height: 20,
                  minHeight: 20,
                  maxHeight: 20,
                }}
              ></textarea>
            </div>
            <div
              id="telefone"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <div className="text1">TELEFONE</div>
              <textarea
                autoComplete="off"
                placeholder="TELEFONE"
                className="textarea"
                type="text"
                id={"inputTelefone " + paciente.id_paciente}
                onFocus={(e) => (e.target.placeholder = "")}
                onBlur={(e) => (e.target.placeholder = "TELEFONE")}
                defaultValue={paciente.telefone}
                style={{
                  flexDirection: "center",
                  justifyContent: "center",
                  alignSelf: "center",
                  width: window.innerWidth > 425 ? "50vw" : "70vw",
                  padding: 15,
                  height: 20,
                  minHeight: 20,
                  maxHeight: 20,
                }}
              ></textarea>
            </div>
            <div
              id="email"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <div className="text1">EMAIL</div>
              <textarea
                autoComplete="off"
                placeholder="EMAIL"
                className="textarea"
                type="text"
                id={"inputEmail " + paciente.id_paciente}
                onFocus={(e) => (e.target.placeholder = "")}
                onBlur={(e) => (e.target.placeholder = "EMAIL")}
                defaultValue={paciente.email}
                style={{
                  flexDirection: "center",
                  justifyContent: "center",
                  alignSelf: "center",
                  width: window.innerWidth > 425 ? "50vw" : "70vw",
                  padding: 15,
                  height: 20,
                  minHeight: 20,
                  maxHeight: 20,
                }}
              ></textarea>
            </div>
            <div
              id="antecedentes pessoais"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <div className="text1">ANTECEDENTES PESSOAIS</div>
              <textarea
                className="textarea"
                placeholder="ANTECEDENTES PESSOAIS"
                onFocus={(e) => (e.target.placeholder = "")}
                onBlur={(e) => (e.target.placeholder = "ANTECEDENTES PESSOAIS")}
                defaultValue={paciente.antecedentes_pessoais}
                style={{
                  display: "flex",
                  flexDirection: "center",
                  justifyContent: "center",
                  alignSelf: "center",
                  width: window.innerWidth > 425 ? "50vw" : "70vw",
                  whiteSpace: "pre-wrap",
                }}
                id={"inputAntecedentesPessoais " + paciente.id_paciente}
                title="ANTECEDENTES PESSOAIS."
              ></textarea>
            </div>
            <div
              id="medicações de uso domiciliar "
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <div className="text1">MEDICAÇÕES DE USO DOMICILIAR</div>
              <textarea
                className="textarea"
                placeholder="MEDICAÇÕES DE USO DOMICILIAR"
                onFocus={(e) => (e.target.placeholder = "")}
                onBlur={(e) =>
                  (e.target.placeholder = "MEDICAÇÕES DE USO DOMICILIAR")
                }
                defaultValue={paciente.medicacoes_previas}
                style={{
                  display: "flex",
                  flexDirection: "center",
                  justifyContent: "center",
                  alignSelf: "center",
                  width: window.innerWidth > 425 ? "50vw" : "70vw",
                  whiteSpace: "pre-wrap",
                }}
                id={"inputMedicacoesPrevias " + paciente.id_paciente}
                title="MEDICAÇÕES DE USO DOMICILIAR."
              ></textarea>
            </div>
            <div
              id="exames prévios"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <div className="text1">EXAMES PRÉVIOS</div>
              <textarea
                className="textarea"
                placeholder="EXAMES PRÉVIOS"
                onFocus={(e) => (e.target.placeholder = "")}
                onBlur={(e) => (e.target.placeholder = "EXAMES PRÉVIOS")}
                defaultValue={paciente.exames_previos}
                style={{
                  display: "flex",
                  flexDirection: "center",
                  justifyContent: "center",
                  alignSelf: "center",
                  width: window.innerWidth > 425 ? "50vw" : "70vw",
                  whiteSpace: "pre-wrap",
                }}
                id={"inputExamesPrevios " + paciente.id_paciente}
                title="EXAMES PRÉVIOS."
              ></textarea>
              <div
                id="exames atuais"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <div className="text1">EXAMES ATUAIS</div>
                <textarea
                  className="textarea"
                  placeholder="EXAMES ATUAIS"
                  onFocus={(e) => (e.target.placeholder = "")}
                  onBlur={(e) => (e.target.placeholder = "EXAMES ATUAIS")}
                  defaultValue={paciente.exames_atuais}
                  style={{
                    display: "flex",
                    flexDirection: "center",
                    justifyContent: "center",
                    alignSelf: "center",
                    width: window.innerWidth > 425 ? "50vw" : "70vw",
                    whiteSpace: "pre-wrap",
                  }}
                  id={"inputExamesAtuais " + paciente.id_paciente}
                  title="EXAMES ATUAIS."
                ></textarea>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                marginTop: 10,
              }}
            >
              <div
                id="btnUpdatePaciente"
                title="ATUALIZAR DADOS DO PACIENTE"
                className="button-green"
                onClick={() => {
                  var array = [
                    "inputNomePaciente " + paciente.id_paciente,
                    "inputDn " + paciente.id_paciente,
                    "inputNomeMae " + paciente.id_paciente,
                    "inputAntecedentesPessoais " + paciente.id_paciente,
                    "inputMedicacoesPrevias " + paciente.id_paciente,
                    "inputExamesPrevios " + paciente.id_paciente,
                    "inputExamesAtuais " + paciente.id_paciente,
                    "inputTipoDocumento " + paciente.id_paciente,
                    "inputNumeroDocumento " + paciente.id_paciente,
                    "inputEndereco " + paciente.id_paciente,
                    "inputTelefone " + paciente.id_paciente,
                    "inputEmail " + paciente.id_paciente,
                  ];
                  var check = 0;
                  array.map((item) => {
                    if (document.getElementById(item).value == "") {
                      check = 1;
                      document.getElementById(item).className =
                        "textarea emptyinput emptyplaceholder";
                    } else {
                      document.getElementById(item).className =
                        "textarea filledinput emptyplaceholder";
                    }
                    return null;
                  });
                  if (check == 0) {
                    updatePaciente(paciente.id_paciente);
                  } else {
                    console.log("SHIT");
                    toastypacientes(
                      settoastpacientes,
                      "CAMPO(S) OBRIGATÓRIO(S) EM BRANCO!",
                      "rgba(231, 76, 60, 1)",
                      2000
                    );
                  }
                }}
                style={{ width: 50, height: 50, alignSelf: "center" }}
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
              <div
                id="btnDeletePaciente"
                title="EXCLUIR PACIENTE"
                className="button-red"
                onClick={() => {
                  modal(
                    setdialogo,
                    "TEM CERTEZA QUE DESEJA EXCLUIR O REGISTRO DESTE PACIENTE? ESTA AÇÃO É IRREVERSÍVEL.",
                    deletePaciente,
                    paciente.id_paciente
                  );
                }}
                style={{ width: 50, height: 50, alignSelf: "center" }}
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
          <div
            id="status de atendimento"
            className="card cor7"
            style={{
              position: window.innerWidth > 425 ? "sticky" : "",
              top: 10,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              height: 345,
              marginTop: window.innerWidth > 425 ? 0 : 10,
              marginBottom: 20,
            }}
          >
            <div
              id="paciente sem atendimento ativo"
              style={{
                display:
                  atendimentos.filter(
                    (item) =>
                      item.id_paciente == paciente.id_paciente &&
                      item.data_termino == null
                  ).length == 0
                    ? "flex"
                    : "none",
                flexDirection: "column",
                justifyContent: "center",
                height: "50vh",
                width: window.innerWidth < 426 ? "70vw" : "30vw",
                alignSelf: "center",
              }}
            >
              <div className="text1" style={{ margin: 15 }}>
                {
                  "PACIENTE NÃO ESTÁ EM ATENDIMENTO NOS HOSPITAIS CADASTRADOS EM NOSSA BASE."
                }
              </div>
              <div className="button" onClick={() => setviewseletorunidades(1)}>
                INICIAR ATENDIMENTO
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              ></div>
            </div>
            <div
              id="em atendimento na unidade logada"
              className="card cor5hover"
              style={{
                display:
                  atendimentos.filter(
                    (item) =>
                      item.id_paciente == paciente.id_paciente &&
                      item.id_cliente == hospital &&
                      item.data_termino == null
                  ).length > 0
                    ? "flex"
                    : "none",
                flexDirection: "column",
                justifyContent: "center",
                height: "50vh",
                width: window.innerWidth < 426 ? "70vw" : "30vw",
                alignSelf: "center",
              }}
            >
              <div className="text1">
                {"PACIENTE ATUALMENTE EM ATENDIMENTO: UNIDADE " +
                  unidades
                    .filter(
                      (value) =>
                        value.id_unidade ==
                        atendimento.map((item) => item.id_unidade)
                    )
                    .map((item) => item.nome_unidade) +
                  " - LEITO " +
                  atendimento.map((item) => item.leito)}
              </div>
              <div className="button" onClick={() => setviewseletorunidades(1)}>
                ALTERAR LEITO
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                }}
              >
                <div
                  className="button-red"
                  title="ENCERRAR ATENDIMENTO"
                  style={{ width: 50, height: 50, alignSelf: "center" }}
                  onClick={() => {
                    modal(
                      setdialogo,
                      "TEM CERTEZA DE QUE DESEJA ENCERRAR ESTE ATENDIMENTO? ESTA OPERAÇÃO É IRREVERSÍVEL.",
                      closeAtendimento,
                      atendimento
                    );
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
            <div
              id="em atendimento em outro serviço"
              className="card cor6hover"
              style={{
                display:
                  atendimentos.filter(
                    (item) =>
                      item.id_paciente == paciente.id_paciente &&
                      item.id_unidade != unidade &&
                      item.id_cliente != hospital &&
                      item.data_termino == null
                  ).length > 0
                    ? "flex"
                    : "none",
                flexDirection: "column",
                justifyContent: "center",
                height: "50vh",
                width: window.innerWidth < 426 ? "70vw" : "30vw",
                alignSelf: "center",
              }}
            >
              <div className="text1">
                {"PACIENTE COM ATENDIMENTO ATIVO EM OUTRO SERVIÇO: " +
                  atendimentos
                    .filter(
                      (item) =>
                        item.id_paciente == paciente.id_paciente &&
                        item.id_cliente != hospital &&
                        item.data_termino == null
                    )
                    .map(
                      (item) =>
                        "HOSPITAL: " +
                        clientes
                          .filter((x) => x.id_cliente == item.id_cliente)
                          .map((y) => y.nome_cliente) +
                        " - UNIDADE: " +
                        item.id_unidade +
                        " - LEITO: " +
                        item.leito
                    )}
              </div>
              <div className="button" onClick={() => setviewseletorunidades(1)}>
                ALTERAR LEITO
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              ></div>
            </div>
          </div>
        </div>
        <ToastPacientes></ToastPacientes>
        <ViewTipoDocumento></ViewTipoDocumento>
      </div>
    );
  }

  const [viewseletorunidades, setviewseletorunidades] = useState(0);
  const [selectedunidade, setselectedunidade] = useState("");
  function SeletorDeUnidades() {
    return (
      <div>
        <div className="text1" style={{ marginTop: 50 }}>
          UNIDADES DE INTERNAÇÃO
        </div>
        <div
          id="unidades"
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {unidades
            .filter((item) => item.id_cliente == hospital)
            .map((item) => (
              <div
                id={"unidade: " + item}
                className={
                  selectedunidade == item.id_unidade ? "button-red" : "button"
                }
                style={{
                  width: 150,
                  height: 150,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
                onClick={() => {
                  setselectedunidade(item.id_unidade);
                  setunidade(item.id_unidade);
                  geraLeitos(item.total_leitos);
                }}
              >
                <div>{item.nome_unidade}</div>
                <div>
                  {parseInt(item.total_leitos) -
                    parseInt(
                      atendimentos.filter(
                        (check) => check.id_unidade == item.id_unidade
                      ).length +
                        " / " +
                        item.total_leitos
                    )}
                </div>
              </div>
            ))}
        </div>
      </div>
    );
  }

  const [arrayleitos, setarrayleitos] = useState([]);
  const geraLeitos = (leitos) => {
    let arrayleitos = [];
    let count = 0;
    while (count < leitos) {
      count = count + 1;
      arrayleitos.push(count);
      console.log(count);
    }
    setarrayleitos(arrayleitos);
  };

  function SeletorDeLeitos() {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignSelf: "center",
        }}
      >
        <div className="text1">LEITOS</div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            flexWrap: "wrap",
            alignSelf: "center",
          }}
        >
          {arrayleitos.map((item) => (
            <div
              className="button"
              style={{
                width: 150,
                height: 150,
                display: "flex",
                flexDirection: "column",
                justifyItems: "center",
                opacity:
                  atendimentos.filter(
                    (valor) =>
                      valor.id_cliente == hospital &&
                      valor.id_unidade == unidade &&
                      valor.data_termino == null &&
                      valor.leito == item
                  ).length > 0
                    ? 0.5
                    : 1,
              }}
              onClick={() => {
                if (
                  // existe um atendimento alocado no leito selecionado.
                  atendimentos.filter(
                    (valor) =>
                      valor.id_cliente == hospital &&
                      valor.id_unidade == unidade &&
                      valor.data_termino == null &&
                      valor.leito == item
                  ).length > 0 &&
                  // o atendimento ativo para o leito selecionado é do paciente selecionado.
                  atendimentos.filter(
                    (valor) =>
                      valor.id_paciente == paciente.id_paciente &&
                      valor.data_termino == null &&
                      valor.leito == item
                  ).length > 0
                ) {
                  console.log("NADA A FAZER. O PACIENTE JÁ ESTÁ NESTE LEITO");
                } else if (
                  // existe um atendimento alocado no leito selecionado.
                  atendimentos.filter(
                    (valor) =>
                      valor.id_cliente == hospital &&
                      valor.id_unidade == unidade &&
                      valor.data_termino == null &&
                      valor.leito == item
                  ).length > 0 &&
                  // o atendimento ativo para o leito selecionado não é do paciente selecionado.
                  atendimentos.filter(
                    (valor) =>
                      valor.id_paciente == paciente.id_paciente &&
                      valor.data_termino == null &&
                      valor.leito == item
                  ).length == 0
                ) {
                  console.log(
                    "NÃO É POSSÍVEL ALOCAR O PACIENTE NESTE LEITO, QUE JÁ ESTÁ OCUPADO POR OUTRO PACIENTE."
                  );
                } else if (
                  // não existe um atendimento alocado no leito selecionado.
                  atendimentos.filter(
                    (valor) =>
                      valor.id_cliente == hospital &&
                      valor.id_unidade == unidade &&
                      valor.data_termino == null &&
                      valor.leito == item
                  ).length == 0 &&
                  // o paciente tem um atendimento ativo em outro leito.
                  atendimentos.filter(
                    (valor) =>
                      valor.id_paciente == paciente.id_paciente &&
                      valor.data_termino == null
                  ).length > 0
                ) {
                  updateAtendimento(
                    item,
                    atendimentos.filter(
                      (valor) =>
                        valor.id_cliente == hospital &&
                        valor.id_unidade == unidade &&
                        valor.data_termino == null &&
                        valor.id_paciente == paciente.id_paciente
                    )
                  );
                } else if (
                  // não existe um atendimento alocado no leito selecionado.
                  atendimentos.filter(
                    (valor) =>
                      valor.id_cliente == hospital &&
                      valor.id_unidade == unidade &&
                      valor.data_termino == null &&
                      valor.leito == item
                  ).length == 0 &&
                  // o paciente não tem um atendimento ativo.
                  atendimentos.filter(
                    (valor) =>
                      valor.id_paciente == paciente.id_paciente &&
                      valor.data_termino == null
                  ).length == 0
                ) {
                  insertAtendimento(
                    paciente.id_paciente,
                    paciente.nome_paciente,
                    item
                  );
                } else {
                }
              }}
            >
              <div style={{ fontSize: 20, margin: 10 }}>{item}</div>
              <div
                style={{
                  display:
                    atendimentos.filter(
                      (valor) =>
                        valor.id_cliente == hospital &&
                        valor.id_unidade == unidade &&
                        valor.data_termino == null &&
                        valor.leito == item
                    ).length > 0
                      ? "flex"
                      : "none",
                }}
              >
                {atendimentos
                  .filter(
                    (valor) =>
                      valor.id_cliente == hospital &&
                      valor.id_unidade == unidade &&
                      valor.data_termino == null &&
                      valor.leito == item
                  )
                  .map((valor) => valor.nome_paciente)}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  function MovimentaPaciente() {
    return (
      <div
        className="fundo"
        style={{
          display: viewseletorunidades == 1 ? "flex" : "none",
        }}
      >
        <div
          className="janela scroll"
          style={{
            position: "relative",
            width: "90vw",
            height: "90vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
          }}
        >
          <div
            className="button-red"
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              margin: 0,
              width: 50,
              height: 50,
            }}
            title={"VOLTAR PARA A TELA DE PACIENTES E ATENDIMENTOS"}
            onClick={() => {
              setviewseletorunidades(0);
            }}
          >
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
          <SeletorDeUnidades></SeletorDeUnidades>
          <SeletorDeLeitos></SeletorDeLeitos>
        </div>
      </div>
    );
  }

  return (
    <div className="main" style={{ display: pagina == 2 ? "flex" : "none" }}>
      <div
        className="scroll"
        id="cadastro de pacientes e de atendimentos"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "calc(100vw - 20px)",
          // height: window.innerWidth < 426 ? '' : window.innerHeight,
        }}
      >
        <div
          id="botões e pesquisa"
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignSelf: "center",
          }}
        >
          <div
            className="button-red"
            style={{ margin: 0, marginRight: 10, width: 50, height: 50 }}
            title={"VOLTAR PARA O PASSÔMETRO"}
            onClick={() => {
              setpagina(1);
              history.push("/passometro");
            }}
          >
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
          <div
            className="button-green"
            style={{ margin: 0, marginLeft: 10, width: 50, height: 50 }}
            title={"CADASTRAR PACIENTE"}
            onClick={() => setviewnewpaciente(1)}
          >
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
        <MovimentaPaciente></MovimentaPaciente>
      </div>
    </div>
  );
}

export default Cadastro;
