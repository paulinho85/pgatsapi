const request = require('supertest');

const rota = "http://localhost:3000";

describe("Suite de testes da api users...", ()=>{

    const json_arquivo_cadastro_usuario={
            nome: "Danielle Santos Garcia",
            telefone: "(18) 99158-9194",
            email: "danyydanyy9@gmail.com",
            senha: "123456"         
    }

    it('Consulta todos os usuários...deve retornar status 200.', async()=>{
        const response = await request(rota)
            .get('/users');
        expect(response.status).toBe(200);
        console.log(response.body);
    });

    it.only('Deve cadastrar um novo usuario e retornar 201', async()=>{
        //construção da requisição passando a rota completa
        const response = await request(rota)
            .post('/users')
            //construção dos dados que são enviados no body
            .send(json_arquivo_cadastro_usuario)
        expect(response.body).toBeDefined();
        expect(response.body).toHaveProperty('id');
        expect(response.status).toBe(201);
        console.log(response.body);

        idUsuario = response.body.id
        console.log('Usuário cadastrado:', idUsuario);
    })

    it.only('Deve consultar o usuário cadastrado anteriormente, e logar o registro do usuário cadastrado com o retornado', async () => {
        const response = await request(rota)
            .get(`/users/${idUsuario}`);
        expect(response.status).toBe(200);        
        expect(response.body).toBeDefined();
        expect(response.body).toHaveProperty('id', idUsuario);
        console.log('Usuário Retornado', response.body);

    });

    it.only('Alterando o registro cadastrado anteriormente', async () => {
        const novoPayload={
            nome: "Sérgio Garcia",
            telefone: "(18) 99158-9194",
            email: "danyydanyy5@gmail.com",
            senha: "123456"         
        }   

        const responseUpdate = await request(rota)
            .put(`/users/${idUsuario}`)
            .send(novoPayload)

        expect(responseUpdate.status).toBe(201);
        expect(responseUpdate.body.nome).toBe(novoPayload.nome);
        console.log(responseUpdate.body)
        
    });

    it('Quando cadastrar usuário já existente, deve retornar 422', async()=>{
        const response = await request(rota)
            .post('/users')
            .send(json_arquivo_cadastro_usuario)    
        expect(response.status).toBe(422);
        console.log(response.body);
    })

    it('Quando tentar cadastrar com dados incompletos, deve retornar 422', async()=>{
        const response = await request(rota)
            .post('/users')
            .send(json_arquivo_cadastro_usuario)    
        expect(response.status).toBe(422);
        console.log(response.body);
    })

    it('Quando tentar cadastrar com dados incompletos, validar mensagem de erro', async()=>{
        const response = await request(rota)
            .post('/users')
            .send(json_arquivo_cadastro_usuario)    
            expect(response.body.error).toBe("Os seguintes campos são obrigatórios: nome, telefone, email, senha");
            console.log(response.body);
    })


});