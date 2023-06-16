const { Router } = require("express");
const { auth } = require("../util/middleware/auth");
const router = Router();

router.get("/dash", auth, (req, res) => {

  let servidores = [];
  let guilds = req.user.guilds.filter(p => (p.permissions & 8) === 8)

  for (const key in guilds) {
    if (req.BotClient.guilds.cache.get(guilds[key].id)) {
      servidores.push({
        esta: true,
        id: req.BotClient.guilds.cache.get(guilds[key].id).id,
        name: req.BotClient.guilds.cache.get(guilds[key].id).name,
        icon: req.BotClient.guilds.cache.get(guilds[key].id).icon
      })
    } else {
      servidores.push({
        esta: false,
        id: guilds[key].id,
        name: guilds[key].name,
        icon: guilds[key].icon
    })
  }
}


  res.render("dash", {
    user: req.user,
    servidores
  });
});

router.get("/dash/:id", auth, (req, res) => {
  let id = req.params.id;
  let servidor = req.BotClient.guilds.cache.get(id);
  let emoji = JSON.stringify(servidor.emojis.cache);
  // res.json({
  //   servidor,
  //   canales: servidor.channels.cache,
  //   roles: servidor.roles.cache,
  //   emojis: JSON.parse(emoji),
  // })

 res.render("data", {
   user: req.user,
    servidor,
    canales: servidor.channels.cache.filter(ch => ch.type === "text").map(ch => ({name: ch.name, id: ch.id})),
    roles: servidor.roles.cache,
    emojis: JSON.parse(emoji),
  })
});

module.exports = router;
