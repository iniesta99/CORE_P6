
const user = require("./cmds_user.js");
const quiz = require("./cmds_quiz.js");
const favs = require("./cmds_favs.js");
const readline = require('readline');

const net = require("net");

// Crear socket de servidor
net.createServer(function (socket){
  const clientName = `${socket.remoteAddress}-${socket.remotePort}`
  console.log(`Cliente conectado desde: ${clientName}`);

  const rl = readline.createInterface({
    input: socket,
    output: socket,
    prompt: "> "
  });
  rl.log = (msg) => socket.write(`${msg}\n`);  // Add  to rl interface
  rl.questionSync = async (rl, string) => {   // Add to rl interface
    return new Promise ( (resolve) => {
      rl.question(`  ${string}: `, (answer) => resolve(answer.trim()))
    })
  };

  //Terminar rl si se cierra el socket.

  socket
  .on('end', () => {
    rl.close();
  }).on('error', () => {
    rl.close();
  });
  
  rl.prompt();
  
  rl.on('line', async (line) => {
    try{
      let cmd = line.trim()
  
      if      ('' ===cmd)   {}
      else if ('h' ===cmd)  { user.help(rl);}

      else if ('p' === cmd) { await quiz.play(rl);}
      else if ('ls' === cmd) { await quiz.scores(rl);}
  
      else if (['lu', 'ul', 'u'].includes(cmd)) { await user.list(rl);}
      else if (['cu', 'uc'].includes(cmd))      { await user.create(rl);}
      else if (['ru', 'ur', 'r'].includes(cmd)) { await user.read(rl);}
      else if (['uu'].includes(cmd))            { await user.update(rl);}
      else if (['du', 'ud'].includes(cmd))      { await user.delete(rl);}
  
      else if (['lq', 'ql', 'q'].includes(cmd)) { await quiz.list(rl);}
      else if (['cq', 'qc'].includes(cmd))      { await quiz.create(rl);}
      else if (['tq', 'qt', 't'].includes(cmd)) { await quiz.test(rl);}
      else if (['uq', 'qu'].includes(cmd))      { await quiz.update(rl);}
      else if (['dq', 'qd'].includes(cmd))      { await quiz.delete(rl);}
  
      else if (['lf', 'fl', 'f'].includes(cmd)) { await favs.list(rl);}
      else if (['cf', 'fc'].includes(cmd))      { await favs.create(rl);}
      else if (['df', 'fd'].includes(cmd))      { await favs.delete(rl);}
  
      else if ('e'===cmd)  { rl.log('Bye!'); socket.end();}
      else                 {  rl.log('UNSUPPORTED COMMAND!');
                              user.help(rl);
                           };
      } catch (err) { rl.log(`  ${err}`);}
      finally       { rl.prompt(); }
    })
    .on('close', () => {
      console.log(`El cliente ${clientName} se ha desconectado.`)
    });

})

.listen(8080);


