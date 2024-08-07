const request = require('supertest');
require ('dotenv').config();
const {faker} = require('@faker-js/faker');

const{
    URLS,
    HEADERS
} = require('../suporte/configEnv')


describe('Suíte de testes crud (post, get, put, delete)', () => {

    let recebeId;

    beforeAll(async()=>{
        const payloadUsuario = {
            nome: faker.person.fullName(),
            telefone: faker.phone.number('+55 (##) ####-####'),
            email: faker.internet.email(),
            senha:faker.internet.password()
        }
        
        const response = await request(URLS.ENDPOINT_USERS)
            .post('/users')
            .send(payloadUsuario);

        recebeId = response.body.id;
        expect(response.status).toBe(201);
        const {id, nome, telefone, email} = response.body
        expect(recebeId).toBeDefined();
    })
    
      
    it.only('Alterando o registro cadastrado anteriormente, e verificando se os dados realmente foram alterados', async()=>{
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

        expect(response.status).toBe(204);
        console.log('Resposta do delete:', response.body)
        const responseGet = await request(URLS.ENDPOINT_USERS)
            .get(`/users/${recebeId}`)
        expect(responseGet.status).toBe(404);
        expect(responseGet.body).toEqual({error: 'Usuário não encontrado'});
        console.log(responseGet.body);        
    });
});