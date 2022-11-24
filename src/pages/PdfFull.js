/* eslint eqeqeq: "off" */
import React, { useEffect, useContext, useState } from 'react';
import axios from 'axios';
import Context from './Context';
import { useHistory } from 'react-router-dom';
import { Page, Text, View, Document, PDFViewer, StyleSheet } from '@react-pdf/renderer';
import { Font } from '@react-pdf/renderer';
import fontbold from '../fonts/Roboto-Bold.ttf';
import moment from 'moment';

// imagens.
import back from '../images/back.svg';

function PdfFull() {

  // context.
  const {
    html,
    pagina,
    setusuario,
    setpagina,
    pacientes,
    atendimentos,

    setalergias, alergias,
    setantibioticos, antibioticos,
    setinvasoes, invasoes,
    setprecaucoes, precaucoes,
    setriscos, riscos,
    setculturas, culturas,
    setevolucoes, evolucoes,
    setinfusoes, infusoes,
    setpropostas, propostas,
    setvm, vm,
    setinterconsultas, interconsultas,

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
    // eslint-disable-next-line
  }, [pagina]);

  // registro de fontes para o react-pdf (a lib não aceita ajustar fontWeight).
  Font.register({
    family: 'Roboto',
    src: fontbold,
  });

  // estilização (css).
  const styles = StyleSheet.create({
    title1: {
      fontFamily: 'Helvetica-Bold',
      fontSize: 14, textAlign: 'center',
      fontWeight: 'bold',
      padding: 10,
      margin: 2.5,
    },
    title2: {
      fontFamily: 'Helvetica-Bold',
      fontSize: 10,
      fontWeight: 'bold',
      padding: 10,
      margin: 2.5,
      borderStyle: 'solid', borderWidth: 1, borderRadius: 5, borderColor: 'black',
    },
    view0: {
      flexDirection: 'column',
      justifyContent: 'center',
      margin: 0,
      padding: 2.5,
      borderStyle: 'solid', borderWidth: 1, borderRadius: 5, borderColor: 'black',
    },
    view1: {
      flexDirection: 'row',
      justifyContent: 'center',
      margin: 0,
      padding: 0,
      borderStyle: 'none', borderWidth: 0, borderRadius: 5, borderColor: 'transparent',
    },
    view2: {
      flexDirection: 'column',
      justifyContent: 'center',
      margin: 0,
      padding: 0,
      borderStyle: 'none', borderWidth: 0, borderRadius: 5, borderColor: 'transparent',
    },
    view3: {
      margin: 0,
      padding: 0,
      borderRadius: 5,
      backgroundColor: '#f2f2f2',
      justifyContent: 'flex-start'
    },
  });

  const BackButton = () => {
    return (
      <div id="botão de retorno"
        className="button-red"
        style={{
          position: 'absolute', bottom: 25, left: 25,
          opacity: 1, backgroundColor: '#ec7063',
          alignSelf: 'center',
          zIndex: 90
        }}
        onClick={() => {
          setpagina(1);
          history.push('/passometro');
        }}>
        <img
          alt=""
          src={back}
          style={{ width: 30, height: 30 }}
        ></img>
      </div >
    )
  }

  // conteúdo de cada atendimento.
  const pdfAtendimento = (item) => {
    // const [alergias, setalergias] = useState([]);
    axios.get(html + 'paciente_alergias/' + item.id_paciente).then((response) => {
      setalergias(response.data.rows);
    });

    /*
    var lesoes = [];
    axios.get(html + 'paciente_lesoes/' + paciente).then((response) => {
      lesoes = response.data.rows;
    });
    */

    //const [precaucoes, setprecaucoes] = useState([]);
    axios.get(html + 'paciente_precaucoes/' + item.id_paciente).then((response) => {
      setprecaucoes(response.data.rows);
    });

    // const [riscos, setriscos] = useState([]);
    axios.get(html + 'paciente_riscos/' + item.id_paciente).then((response) => {
      setriscos(response.data.rows);
    });

    //const [antibioticos, setantibioticos] = useState([]);
    axios.get(html + 'list_antibioticos/' + item.id_atendimento).then((response) => {
      setantibioticos(response.data.rows);
    });

    //const [culturas, setculturas] = useState([]);
    axios.get(html + 'list_culturas/' + item.id_atendimento).then((response) => {
      setculturas(response.data.rows);
    });

    /*
    var dietas = [];
    axios.get(html + 'list_dietas/' + atendimento).then((response) => {
      dietas = response.data.rows;
    });
    */

    //const [evolucoes, setevolucoes] = useState([]);
    axios.get(html + 'list_evolucoes/' + item.id_atendimento).then((response) => {
      setevolucoes(response.data.rows);
    });

    //const [infusoes, setinfusoes] = useState([]);
    axios.get(html + 'list_infusoes/' + item.id_atendimento).then((response) => {
      setinfusoes(response.data.rows);
    });

    //const [invasoes, setinvasoes] = useState([]);
    axios.get(html + 'list_invasoes/' + item.id_atendimento).then((response) => {
      setinvasoes(response.data.rows);
    });

    //const [propostas, setpropostas] = useState([]);
    axios.get(html + 'list_propostas/' + item.id_atendimento).then((response) => {
      setpropostas(response.data.rows);
    });

    /*
    // cálculo do balanço acumulado.
    var balancoacumulado = 0;
    axios.get(html + 'list_sinais_vitais/' + atendimento).then((response) => {
      var x = response.data.rows;
      var arraybalancos = [];
      sinaisvitais = response.data.rows;
      x.map(item => arraybalancos.push(parseInt(item.balanco)));
      function soma(total, num) {
        return total + num;
      }
      balancoacumulado = arraybalancos.reduce(soma, 0);
    });
    */

    //const [vm, setvm] = useState([]);
    axios.get(html + 'list_vm/' + item.id_atendimento).then((response) => {
      setvm(response.data.rows);
    });

    //const [interconsultas, setinterconsultas] = useState([]);
    axios.get(html + 'list_interconsultas/' + item.id_atendimento).then((response) => {
      setinterconsultas(response.data.rows);
    });

    return (
      <Page wrap={false} size="A4" style={{ padding: 10 }}>
        <View wrap={false} style={styles.view0}>
          <View wrap={false} style={styles.view1}>
            <Text wrap={false} style={[styles.title2, {
              flex: 1, backgroundColor: '#85929E', // borderColor: '#85929E',
              color: 'white', textAlign: 'center'
            }]}>
              {'LEITO: ' + item.leito}
            </Text>
            <Text wrap={false} style={[styles.title2, { flex: 5.5 }]}>
              {'NOME: ' + pacientes.filter(valor => valor.id_paciente == item.id_paciente).map(valor => valor.nome_paciente)}
            </Text>
            <Text wrap={false} style={[styles.title2, { flex: 1.5 }]}>
              {'IDADE: ' + pacientes.filter(valor => valor.id_paciente == item.id_paciente).map(valor => moment().diff(valor.dn_paciente, 'years')) + ' ANOS'}
            </Text>
          </View>
          <View wrap={false} style={styles.view1}>
            <Text wrap={false} style={[styles.title2, { flex: 1 }]}>
              {'ADMISSÃO: ' + moment(item.data_inicio).format('DD/MM/YY')}
            </Text>
            <Text wrap={false} style={[styles.title2, { flex: 2.3 }]}>
              {'TEMPO DE INTERNAÇÃO: ' + moment().diff(item.data_inicio, 'days') + ' DIAS'}
            </Text>
            <Text wrap={false} style={[styles.title2, { flex: 4.7 }]}>
              {interconsultas.length > 0 ? 'INTERCONSULTAS: ' + interconsultas.filter(valor => valor.id_atendimento == item.id_atendimento).map(item => ' ' + item.especialidade) : 'INTERCONSULTAS: NÃO'}
            </Text>
          </View>
          <View wrap={false} style={styles.view1}>
            <Text wrap={false} style={[styles.title2, { flex: 1, borderColor: 'red' }]}>
              {alergias.length > 0 ? 'ALERGIAS: ' + alergias.map(item => ' ' + item.alergia) : 'ALERGIAS: NÃO'}
            </Text>
            <Text wrap={false} style={[styles.title2, { flex: 1, borderColor: 'red' }]}>
              {riscos.length > 0 ? 'RISCOS: ' + riscos.map(item => ' ' + item.risco) : 'RISCOS: NÃO'}
            </Text>
            <Text wrap={false} style={[styles.title2, { flex: 1, borderColor: 'red' }]}>
              {precaucoes.length > 0 ? 'PRECAUÇÕES: ' + precaucoes.map(item => ' ' + item.precaucao) : 'PRECAUÇÕES: NÃO'}
            </Text>
          </View>
          <View wrap={false} style={styles.view2}>
            <Text wrap={false} style={styles.title2}>
              {'ANTECEDENTES: ' + pacientes.filter(valor => valor.id_paciente == item.id_paciente).map(item => item.antecedentes_pessoais)}
            </Text>
            <Text wrap={false} style={styles.title2}>
              {'MEDICAÇÕES DE USO CONTÍNUO: ' + pacientes.filter(valor => valor.id_paciente == item.id_paciente).map(item => item.medicacoes_previas)}
            </Text>
            <Text wrap={false} style={styles.title2}>
              {'EXAMES PRÉVIOS RELEVANTES: ' + pacientes.filter(valor => valor.id_paciente == item.id_paciente).map(item => item.exames_previos)}
            </Text>
            <Text wrap={false} style={styles.title2}>
              {'LISTA DE PROBLEMAS: \n' + atendimentos.map(item => item.problemas)}
            </Text>
            <Text wrap={false} style={styles.title2}>
              {'SITUAÇÃO: ' + atendimentos.map(item => item.situacao)}
            </Text>
            <Text wrap={false} style={styles.title2}>
              {'EVOLUÇÕES:' + evolucoes.slice(-10).map(item =>
                '\n' + moment(item.data_evolucao).format('DD/MM/YY') + ' - ' + item.evolucao)}
            </Text>
          </View>
          <View wrap={false} style={styles.view1}>
            <Text wrap={false} style={[styles.title2, { flex: 2 }]}>
              {invasoes.filter(item => item.data_retirada == null).length > 0 ? 'INVASÕES:' + invasoes.filter(item => item.data_retirada == null).map(item => '\n' + item.dispositivo + ' - ' + item.local + ' - ' + moment(item.data_implante).format('DD/MM/YY')) : 'INVASÕES: NÃO'}
            </Text>
            <Text wrap={false} style={[styles.title2, { flex: 1 }]}>
              {vm.sort((a, b) => moment(a.data_vm) < moment(b.data_vm) ? -1 : 1).slice(-1).filter(item => item.modo != 'OFF').length > 0 ?
                'VM: ' + vm.sort((a, b) => moment(a.data_vm) < moment(b.data_vm) ? -1 : 1).slice(-1)
                  .map(item => '\n MODO: ' + item.modo + '\n PRESSÃO: ' + item.pressao + '\n VOLUME: ' + item.volume + '\n PEEP: ' + item.peep) + '\n FI: ' + item.fi
                :
                'VM: NÃO'}
            </Text>
            <Text wrap={false} style={[styles.title2, { flex: 1 }]}>
              {infusoes.filter(item => item.data_termino == null).length > 0 ? 'INFUSÕES:' + infusoes.filter(item => item.data_termino == null).map(item => '\n' + item.droga + ' - ' + item.velocidade + 'ml/h') : 'INFUSÕES: NÃO'}
            </Text>
          </View>
          <View wrap={false} style={styles.view1}>
            <Text wrap={false} style={[styles.title2, { flex: 1 }]}>
              {culturas.length > 0 ? 'CULTURAS: ' + culturas.map(item => '\n' + item.material + ' (' + moment(item.data_pedido).format('DD/MM/YY') + '): ' + item.resultado) : 'CULTURAS: NÃO'}
            </Text>
            <Text wrap={false} style={[styles.title2, { flex: 1 }]}>
              {antibioticos.length > 0 ? 'ANTIBIÓTICOS:' + antibioticos.map(item => '\n' + item.antibiotico + ' - ' + moment(item.data_inicio).format('DD/MM/YY')) : 'ANTIBIÓTICOS: NÃO'}
            </Text>
          </View>
          <View wrap={false} style={[styles.view1, { flexDirection: 'column' }]}>
            <Text wrap={false} style={styles.title2}>
              {propostas.filter(item => item.status == 0).length > 0 ?
                'PROPOSTAS:' + propostas.filter(item => item.status == 0).map(item => '\n' + item.proposta)
                :
                'SEM PROPOSTAS'
              }
            </Text>
          </View>
        </View>
      </Page>
    )
  }

  return (
    <div style={{ display: pagina == 6 ? 'flex' : 'none' }}>
      <BackButton></BackButton>
      <PDFViewer
        style={{
          position: 'relative',
          width: window.innerWidth, height: window.innerHeight,
          fontSize: 10,
          border: 'none'
        }}>
        <Document>
          {
            atendimentos.map(item => pdfAtendimento(item))
          }
        </Document>
      </PDFViewer>
    </div>
  )
};

export default PdfFull;