const request = require('supertest');
require ('dotenv').config();
const {faker} = require('@faker-js/faker');

const{
    URLS,
    HEADERS
} = require('../suporte/configEnv')



describe('Suíte de testes crud (post, get, put, delete)', () => {

    let recebeId;

    const payloadUsuario = {
        nome: faker.name.fullName(),
        telefone: faker.phone.number('+55 (##) ####-####'),
        email: faker.internet.email(),
        senha:faker.internet.password()
    }

    const payloadUsuarioEmailNull = {
        nome: faker.name.fullName(),
        telefone: faker.phone.number('+55 (##) ####-####'),
        email: null,
        senha:faker.internet.password()

    }


    it('Ausência de campo email, deverá gerar o status code 422 e emitir uma mensagem de erro validando a mesma.', async () => {
        const response = await request(URLS.ENDPOINT_USERS)
            .post('/users')
            .send(payloadUsuarioEmailNull);

        //validação do status code
        expect(response.status).toBe(422);

        //validar a mensagem: "Os seguintes campos são obrigatórios: email"
        expect(response.body).toEqual({error: 'Os seguintes campos são obrigatórios: email'});
        console.log(response.body);
    });

    it('Cadastrando um usuário, e consultando o retorno dos campos, se foram os enviados.', async () => {
        const response = await request(URLS.ENDPOINT_USERS)
            .post('/users')
            .send(payloadUsuario);

        //armazenar o retorno do ID, na variável
        recebeId = response.body.id;
        
        //validação do status code
        expect(response.status).toBe(201);

        //validar dados retornados
        const {id, nome, telefone, email} = response.body

        //verificar se o id realmente está definido (retornado)
        expect(recebeId).toBeDefined();
    });

    it('Alterando o registro cadastrado anteriormente, e verificando se os dados realmente foram alterados', async()=>{
        const novoUsuario = {
            nome: faker.name.fullName(),
            telefone: faker.phone.number('+55 (##) ####-####'),
            email: faker.internet.email(),
            senha:faker.internet.password()    
        }

        const responsePut = await request(URLS.ENDPOINT_USERS)
            .put(`/users/${recebeId}`)
            .send(novoUsuario)

        expect(responsePut.status).toBe(201);

        expect(responsePut.body.nome).toBe(novoUsuario.nome);
        expect(responsePut.body.telefone).toBe(novoUsuario.telefone);
        //expect(responsePut.body.senha).toBe(novoUsuario.senha);
      
        const responseGet = await request(URLS.ENDPOINT_USERS)
            .get(`/users/${recebeId}`)
        
        expect(responseGet.status).toBe(200);
        expect(responseGet.body.id).toBe(recebeId);
        expect(responseGet.body.nome).toBe(novoUsuario.nome);
        expect(responseGet.body.telefone).toBe(novoUsuario.telefone);

        
        console.log('Usuário alterado resultado da consulta: ', responseGet.body);
        
    });

    it('Deverá remover o registro cadastrado anteriormente. E retornar 204.', async()=>{
        const response = await request(URLS.ENDPOINT_USERS)
            .delete(`/users/${recebeId}`)

        //validar o statuscode
        expect(response.status).toBe(204);
        console.log('Resposta do delete:', response.body)

        //validar se realmente foi removido o registro
        const responseGet = await request(URLS.ENDPOINT_USERS)
            .get(`/users/${recebeId}`)

        expect(responseGet.status).toBe(404);
        expect(responseGet.body).toEqual({error: 'Usuário não encontrado'});
        console.log(responseGet.body);        
    });
});