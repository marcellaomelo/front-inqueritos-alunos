import * as React from 'react'
import API from '../main/api'
import PerguntaGeral3 from './perguntaGeral3';
import '../App.css'
import { ProgressBar } from 'react-bootstrap';

export async function para_proxima(nPergunta, state, props, pagina, conteudoName) {
    if(!state.token){
        state.token = props.location.state.token;
    }
    await API.post('resposta/submit', {
        "disciplinaId": state.disciplinas.id,
        "perguntaId": state.perguntasGerais[nPergunta].id,
        "professorId": 'null',
        "conteudo": state[conteudoName],
        "session": state.token,
    }).then(res => {
        props.match.params.estado = state
        props.history.push({
            pathname: `/${pagina}/${state.id}`,
            state: state,
        })
    });

}
class EscolheCurso extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            respostas: [],
            respostaQualCurso: "",
            disciplinas: [],
            perguntasGerais: [],
            ready: 0,
            id: props.match.params.id

        };

    }
    async proximaPagina8() {
        this.setState({ respostas: [...this.state.respostaQualCurso] })
        para_proxima(0, this.state, this.props, `perguntaGeral1`, 'respostaQualCurso');
    };
    async componentDidMount() {
        await API.get(`disciplina/exportacao?disciplina=${this.state.id}`)
            .then(res => {
                const disciplinas = res.data.disciplina;
                const perguntasGerais = res.data.perguntasGerais;
                const token = res.data.token;
                this.setState({ disciplinas, perguntasGerais, ready: 1, token });
                window.onbeforeunload = function () { return "Your work will be lost."; };
                window.history.pushState(null, "", window.location.href);
                window.onpopstate = function () {
                    window.history.pushState(null, "", window.location.href);
                }

                if (this.state.disciplinas.cursos.length === 1) {

                    if (this.state.disciplinas.cursos[0].id === 1) {
                        var cursoName = "Engenharia Informatica";
                    } else if (this.state.disciplinas.cursos[0].id === 2) {
                        var cursoName = "Informatica Gestao";
                    } else if (this.state.disciplinas.cursos[0].id === 0) {
                        var cursoName = "LEIRT";
                    } else {  // this shouldn't happen?
                        var cursoName = this.state.disciplinas.cursos[0].name
                    }

                    API.post('resposta/submit', {
                        "conteudo": cursoName,
                        "disciplinaId": this.state.disciplinas.id,
                        "perguntaId": this.state.perguntasGerais[0].id,
                        "professorId": 'null',
                        "session": this.state.token,
                    }).then(res => {
                        
                    });
                    this.props.history.push({
                        pathname: `/perguntaGeral1/${this.state.id}`,
                        state: this.state

                    })
                    
                }

            })
    }
    handleClick(valor) {
        this.setState({ respostaQualCurso: this.state.respostaQualCurso = valor })
        this.proximaPagina8();
    }
    render() {
        return (this.state.ready ?
            <div>
                <div>
                    <ProgressBar striped variant="success" style={{ marginTop: "0px" }}>
                        <ProgressBar animated now={20} />
                    </ProgressBar>
                </div>
                <div style={{ backgroundColor: '#008B8B' }} className="nm-custom-decoration" >
                    <div style={{ color: 'white', marginLeft: '120%', whiteSpace: 'nowrap', paddingTop: '160%' }}> {this.state.disciplinas.nome}
                    </div>
                </div>
                <div className="container ">
                    <div className="row" style={{ display: 'flex', justifyContent: 'center' }}>
                        <div className="col-md-6" style={{ justifyContent: 'center', position: 'absolute', color: 'white', top: '19%', textAlign: 'center' }}>
                            <p style={{ fontSize: '15pt', top: '50%' }}>
                                {this.state.perguntasGerais.find(pg => pg.id === 0).enunciado + " " + this.state.disciplinas.nome}
                            </p>

                            <p style={{ fontSize: '13pt', top: '50%' }}>
                                <p style={{ fontSize: '15pt', verticalAlign: 'middle', marginTop: '5%' }}>{this.state.perguntasGerais.find(pg => pg.id === 15).enunciado}</p>
                            </p>

                            <br />
                            <div className="form-group">
                                <div>
                                    {this.state.disciplinas.cursos.find(pg => pg.id === 1) ?
                                        <button onClick={() => { this.handleClick("Engenharia Informatica"); return <PerguntaGeral3 state={this.state} /> }} style={{ padding: '13pt', fontSize: '13pt', fontWeight: '500', borderWidth: '5px', width: '100%' }} type="button" className="btn btn-primary btn-lg">{this.state.disciplinas.cursos.find(pg => pg.id === 1).nome}</button>
                                        : null}
                                </div>
                                <div>
                                    {this.state.disciplinas.cursos.find(pg => pg.id === 2) ?
                                        <button onClick={() => { this.handleClick("Informatica Gestao"); return <PerguntaGeral3 state={this.state} /> }} style={{ marginTop: '1%', padding: '13pt', fontSize: '13pt', fontWeight: '500', borderWidth: '5px', width: '100%' }} type="button" className="btn btn-primary btn-lg">{this.state.disciplinas.cursos.find(pg => pg.id === 2).nome}</button>
                                        : null}
                                </div>
                                <div>
                                    {this.state.disciplinas.cursos.find(pg => pg.id === 0) ?
                                        <button onClick={() => { this.handleClick("LEIRT"); return <PerguntaGeral3 state={this.state} /> }} style={{ marginTop: '1%', padding: '13pt', fontSize: '13pt', fontWeight: '500', borderWidth: '5px', width: '100%' }} type="button" className="btn btn-primary btn-lg">{this.state.disciplinas.cursos.find(pg => pg.id === 0).nome}</button>
                                        : null}
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
            : <div>Verifique o endereço...</div>
        )
    }
}

export default EscolheCurso
