const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Configuração da conexão com o banco de dados
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // Senha padrão do XAMPP é vazia
  database: 'catalogo_produtos' 
});

// Conectar ao banco de dados
connection.connect(error => {
  if (error) {
    console.error('Erro ao conectar ao banco de dados: ' + error.stack);
    return;
  }
  console.log('Conectado ao banco de dados com ID ' + connection.threadId);
});

// Endpoint para adicionar um produtos (POST)
app.post('/produtos', (req, res) => {
  const { nome, descricao, preco } = req.body;
  const sql = 'INSERT INTO produtos (nome, descricao, preco ) VALUES (?, ?, ?)';
  connection.query(sql, [nome, descricao, preco ], (error, results) => {
    if (error) {
      res.status(500).send('Erro ao adicionar produtos.');
      return;
    }
    res.status(201).send('produtos adicionado com sucesso.');
  });
});

// Endpoint para obter todos os produtos (GET)
app.get('/produtos', (req, res) => {
  connection.query('SELECT * FROM produtos', (error, results) => {
    if (error) {
      res.status(500).send('Erro ao obter produtos.');
      return;
    }
    res.json(results);
  });
});

// Endpoint para obter um produtos por ID (GET)
app.get('/produtos/:id', (req, res) => {
  const { id } = req.params;
  connection.query('SELECT * FROM produtos WHERE id = ?', [id], (error, results) => {
    if (error) {
      res.status(500).send('Erro ao obter produtos.');
      return;
    }
    res.json(results[0]);
  });
});

// Endpoint para atualizar um produtos (PUT)
app.put('/produtos/:id', (req, res) => {
  const { id } = req.params;
  const { nome, descricao, preco} = req.body;
  const sql = 'UPDATE produtos SET nome = ?, descricao = ?, preco = ? WHERE id = ?';
  connection.query(sql, [nome, descricao, preco, id], (error, results) => {
    if (error) {
      res.status(500).send('Erro ao atualizar produtos.');
      return;
    }
    res.send('produtos atualizado com sucesso.');
  });
});

// Endpoint para deletar um produtos (DELETE)
app.delete('/produtos/:id', (req, res) => {
  const { id } = req.params;
  connection.query('DELETE FROM produtos WHERE id = ?', [id], (error, results) => {
    if (error) {
      res.status(500).send('Erro ao deletar produtos.');
      return;
    }
    res.send('produtos deletado com sucesso.');
  });
});

// Iniciar o servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});


//Função de callback apara a inserção de usuario
function adicionarprodutosCallback (error, results, res) {
  if (error) {
    res.status(500).send('Erro ao adicionar produtos.');
    return;
  }
  res.status(201).send('produtos adicionado com sucesso.');
}

//Função para a rota POST
function adicionarprodutos(req, res) {
  const { nome, descricao, preco } = req.body;
  const sql = 'INSERT INTO produtos (nome, descricao, preco ) VALUES (?, ?, ?)';
  connection.query(sql, [nome,descricao, preco], function (error, results) {
    adicionarprodutosCallback(error, results, res);
  });
}

