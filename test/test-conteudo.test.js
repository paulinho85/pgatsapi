const request = require('supertest');
const rota = "http://localhost:3000";

describe("Trabalho de conclusão de disciplina de Automação de Testes em API Rest", ()=>{

    let idConteudo;
    let idConteudoInexistente=0;

    const cadastroConteudo = {
        titulo: "Automação em Testes de API",
        descricao: "Suíte de automação de Testes de API utilizando JEST",
        tipoConteudo: "Teste de Integração",
        conteudo: "Testes aplicados a rota de conteudo da 'API de CRUD para testes automatizados'"
    }
    

     it('Deve cadastrar um novo conteúdo e retornar 201', async()=>{        
        const responsePost = await request(rota)
            .post('/conteudos')            
            .send(cadastroConteudo)
        expect(responsePost.body).toBeDefined();
        expect(responsePost.body).toHaveProperty('id', "titulo", "descricao", "tipoConteudo", "conteudo", "dataCadastro");
        expect(responsePost.status).toBe(201);        
        console.log(responsePost.body);
        idConteudo = responsePost.body.id;       
    });

    
    it('Deve consultar o conteúdo cadastrado e comparar se está correto', async () => {
        const responseGet = await request(rota)
            .get(`/conteudos/${idConteudo}`);
        expect(responseGet.status).toBe(200);        
        expect(responseGet.body).toBeDefined();
        expect(responseGet.body).toHaveProperty('id', idConteudo);
        console.log('Conteudo Retornado', responseGet.body);
    });


    it('Deve consultar um conteúdo inexistente e retornar 404', async () => {
        const responseGet = await request(rota)
            .get(`/conteudos/${idConteudoInexistente}`);
        expect(responseGet.status).toBe(404);
        expect(responseGet.body).toEqual({error: `O conteúdo com o ID: ${idConteudoInexistente} não foi encontrado.`});
        console.log(responseGet.body, responseGet.status);
    });    
    

    it('Deve alterar o conteúdo cadastrado anteriormente e retornar 201', async () => {
        const alteracaoConteudo={            
            titulo: "Automação em Testes de API 2.0",
            descricao: "Suíte de automação de Testes de API utilizando JEST e JavaScript",
            tipoConteudo: "Teste de Unidade",
            conteudo: "Testes aplicados a rota de usuários da 'API de CRUD para testes automatizados'"
        }   

        const responseUpdate = await request(rota)            
            .put(`/conteudos/${idConteudo}`)
            .send(alteracaoConteudo);
        expect(responseUpdate.status).toBe(201);
        expect(responseUpdate.body.nome).toBe(alteracaoConteudo.nome);        
        console.log(responseUpdate.body);        
    });


    it('Deve tentar alterar um conteúdo inexistente e retornar 404', async () => {
        const alteracaoConteudo={            
            titulo: "Conteúdo alterado",
            descricao: "Descrição Alterada",
            tipoConteudo: "Teste de Integração",
            conteudo: "Conteúdo de Testes de Integração"
        }   

        const responseUpdate = await request(rota)            
            .put(`/conteudos/${idConteudoInexistente}`)
            .send(alteracaoConteudo);
        expect(responseUpdate.status).toBe(404);        
        console.log(responseUpdate.body);        
    });

    it('Deve deletar o conteúdo cadastrado anteriormente e retornar 200', async () => {        
        const responseDelete = await request(rota)            
            .delete(`/conteudos/${idConteudo}`);
        expect(responseDelete.status).toBe(200);
        expect(responseDelete.body).toEqual({message: "O conteúdo foi removido com sucesso!"});
        console.log(responseDelete.body);        
    });


    it('Deve tentar deletar o conteúdo deletado anteriormente e retornar 404', async () => {        
        const responseDelete = await request(rota)            
            .delete(`/conteudos/${idConteudo}`);
        expect(responseDelete.status).toBe(404);
        expect(responseDelete.body.error).toBe("Erro ao excluir o conteúdo, o conteúdo não foi encontrado.");
        console.log(responseDelete.body);        
    });

   
});