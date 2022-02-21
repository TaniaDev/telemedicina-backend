<h1 align="center">👩‍⚕️ TeleMedicina 👨‍⚕️</h1>

<p>Aplicativo de telemedicina, tem como objetivo democratizar o acesso a saúde pública de maneira acessível e simplificada.</p>

<p align="center">
 <a href="#features">Features</a> •
 <a href="#demonstrativo">Demonstrativo</a> • 
  <a href="#comoRodar">Como rodar a aplicação</a> • 
 <a href="#tecnologias">Tecnologias</a> • 
 <a href="#contribuicao">Contribuição</a> 
</p>

<br/><h4 align="center" id="features"> 
	🚧  Em construção...  🚧
</h4>

- [x] Cadastro de paciente
- [x] Cadastro de médico
- [ ] ** Listar todas as funcionalidade do sistema **

<br/><h4 align="center" id="demonstrativo">👀 Demonstrativo da Aplicação</h4>

<p>** Inserir prints ou gifs**</p>

<br/><h4 align="center" id="comoRodar">📋 Pré-requisitos e como rodar a aplicação</h4>

<h5>1. Instale o PostgreSQL</h5>
<a href="https://fabridata.com/como-instalar-postgresql-13-no-windows/"><small>Material de apoio</small></a>

<h5>2. Clone este repositório</h5>

```
git clone https://github.com/TaniaDev/telemedicina-backend.git
```

<h5>3. Acesse a pasta do projeto no terminal/cmd</h5>

```
cd telemedicina-backend
```

<h5>4. Instale as dependências</h5>

```
npm install
```

<h5>5. No postgreSQL crie um banco de dados com as seguintes informações:</h5>
Nome do BD: <strong>telemedicina</strong><br/>
Usuário: <strong>postgres</strong><br/>
Senha: <strong>postgres</strong><br/>
Host: <strong>localhost</strong><br/>
Porta: <strong>5432</strong><br/>


<h5>6. Rode as migrations para criar as tabelas no banco de dados</h5>

```
npx knex migrate:latest
```

<h5>7. Popule o banco de dados com as seeds</h5>

```
npx knex seed:run
```

<h5>8. Execute a aplicação</h5>

```
npm start
```

<h5>9. O servidor iniciará na porta:3333</h5>

<br/><h3 id="tecnologias" align="center">🔧 Tecnologias</h3>

As seguintes ferramentas foram usadas na construção do projeto:
cors
- [Node](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [Nodemon](https://www.npmjs.com/package/nodemon)
- [Jwt](https://jwt.io/)
- [Knex](https://knexjs.org/)
- [Postgre Sql](https://www.postgresql.org/)
- [Cors](https://www.npmjs.com/package/cors)

<br/><h3 id="contribuicao" align="center"> 🖇️ Contribuição</h3>

<table align="center">
	<tr>
	    <td align="center"><a href="https://github.com/LeonhardDuarth13"><img 				style="border-radius: 50%;" 	src="https://avatars.githubusercontent.com/u/61330383?v=4" width="100px;" alt=""/><br /><sub><b>Leonardo Duarte</b></sub></a><br /><a href="https://github.com/LeonhardDuarth13" title="Github Leonardo">👨‍🚀</a></td>
	    <td align="center"><a href="https://github.com/TaniaDev"><img 				style="border-radius: 50%;" 	src="https://avatars.githubusercontent.com/u/60274024?v=4" width="100px;" alt=""/><br /><sub><b>Tânia de Arruda</b></sub></a><br /><a href="https://github.com/TaniaDev" title="Github Tania">👨‍🚀</a></td>
	    <td align="center"><a href="https://github.com/wrodriguess"><img 				style="border-radius: 50%;" 	src="https://avatars.githubusercontent.com/u/56493042?v=4" width="100px;" alt=""/><br /><sub><b>William Rodrigues</b></sub></a><br /><a href="https://github.com/wrodriguess" title="Github William">👨‍🚀</a></td>
	</tr>
</table>
